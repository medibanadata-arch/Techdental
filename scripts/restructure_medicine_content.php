<?php
/**
 * Restructure medicine content.
 *
 *  - Moves every article section (intro / Uses / Dosage / Side effects / Warnings / Price)
 *    into the matching structured field (EN + BN).
 *  - Removes those sections from the "More about" rich content, so nothing is duplicated.
 *    "More about" keeps: unmapped sections, references, price notes, disclaimer blockquotes.
 *  - FAQ: the article FAQ is already stored in the bilingual `faqs` array, so the HTML copy is
 *    dropped; any Q/A that is NOT yet in `faqs` is appended, so no question is lost.
 *  - Fills price_per_tablet / price_per_strip from the article's own price section.
 *
 * Safety: every moved text block has to survive in the new structured fields, otherwise the
 * record is skipped and reported. Nothing is written unless --apply is passed.
 *
 * Usage:
 *   php scripts/restructure_medicine_content.php            (dry run)
 *   php scripts/restructure_medicine_content.php --apply
 *   php scripts/restructure_medicine_content.php --slug=naproxen-500
 */
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Medicine;
use App\Models\Post;

$APPLY = in_array('--apply', $argv, true);
$ONLY = null;
foreach ($argv as $a) {
    if (str_starts_with($a, '--slug=')) $ONLY = substr($a, 7);
}

const BN_DIGITS = ['০' => '0', '১' => '1', '২' => '2', '৩' => '3', '৪' => '4', '৫' => '5', '৬' => '6', '৭' => '7', '৮' => '8', '৯' => '9'];

function bnToEn(string $s): string
{
    return strtr($s, BN_DIGITS);
}

function norm(string $s): string
{
    $s = html_entity_decode($s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $s = str_replace(["\xC2\xA0", "\u{2013}", "\u{2014}", "\u{2019}", "\u{2018}", "\u{201C}", "\u{201D}"], [' ', '-', '-', "'", "'", '"', '"'], $s);
    $s = preg_replace('/\s+/u', ' ', $s);
    return trim($s);
}

/** lowercase, letters+digits only */
function squash(string $s): string
{
    $s = html_entity_decode($s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $s = mb_strtolower($s, 'UTF-8');
    return preg_replace('/[^\p{L}\p{N}]+/u', '', $s);
}

function textOf(DOMNode $n): string
{
    return norm($n->textContent ?? '');
}

/** Strip Gemini citation chips that are not article content. */
function cleanHtml(string $html): string
{
    $html = preg_replace('/<bdi\b[^>]*class="[^"]*source-title[^"]*"[^>]*>.*?<\/bdi>/is', '', $html);
    $html = preg_replace('/<span\b[^>]*class="[^"]*source-count[^"]*"[^>]*>.*?<\/span>/is', '', $html);
    return $html;
}

function loadRoot(string $html): ?DOMNode
{
    $doc = new DOMDocument('1.0', 'UTF-8');
    libxml_use_internal_errors(true);
    $doc->loadHTML('<?xml encoding="UTF-8"><div id="__root">' . $html . '</div>', LIBXML_NOWARNING | LIBXML_NOERROR);
    libxml_clear_errors();
    $xp = new DOMXPath($doc);
    $root = $xp->query('//*[@id="__root"]')->item(0);
    return $root ?: null;
}

function collectBlocks(DOMNode $node, array &$out): void
{
    foreach ($node->childNodes as $child) {
        if ($child->nodeType === XML_TEXT_NODE) {
            if (trim($child->nodeValue) !== '') {
                $out[] = ['tag' => 'text', 'node' => $child, 'text' => norm($child->nodeValue)];
            }
            continue;
        }
        if ($child->nodeType !== XML_ELEMENT_NODE) continue;
        $tag = strtolower($child->tagName);
        if (in_array($tag, ['script', 'style', 'noscript'], true)) continue;
        if ($tag === 'div') {
            // Some Elementor sections use a short wrapper <div> as a visual heading
            // (e.g. <div style="display:flex"><div>Dosage</div></div>) — treat it as a heading.
            $t = trim(textOf($child));
            $hasBlockChild = $child->getElementsByTagName('p')->length
                || $child->getElementsByTagName('ul')->length
                || $child->getElementsByTagName('ol')->length
                || $child->getElementsByTagName('figure')->length
                || $child->getElementsByTagName('div')->length > 0
                || $child->getElementsByTagName('table')->length;
            if ($t !== '' && !$hasBlockChild && mb_strlen($t) <= 80 && classifyHeading($t) !== null) {
                $out[] = ['tag' => 'h2', 'node' => $child, 'text' => $t];
                continue;
            }
            collectBlocks($child, $out);
            continue;
        }
        $out[] = ['tag' => $tag, 'node' => $child, 'text' => textOf($child)];
    }
}

function listItems(DOMElement $node): array
{
    $items = [];
    foreach ($node->getElementsByTagName('li') as $li) {
        $t = textOf($li);
        if ($t !== '') $items[] = $t;
    }
    return $items;
}

function isBulletText(string $t): bool
{
    return (bool) preg_match('/^[\x{00B7}\x{2022}\-\x{2013}\*]\s*/u', $t);
}

function stripBullet(string $t): string
{
    return preg_replace('/^[\x{00B7}\x{2022}\-\x{2013}\*]\s*/u', '', $t);
}

function splitInlineBullets(string $t): array
{
    $t = preg_replace('/\s*[\x{00B7}\x{2022}]\s*/u', "\n", $t);
    $parts = preg_split('/\n+/u', $t);
    return array_values(array_filter(array_map('trim', $parts), fn($x) => $x !== ''));
}

function splitLabel(string $t): array
{
    if (preg_match('/^(.{2,90}?)[\s]*[:：][\s]*(.+)$/u', $t, $m)) {
        return [trim($m[1]), trim($m[2])];
    }
    return ['', $t];
}

function classifyHeading(string $h): ?string
{
    $h = mb_strtolower(trim($h));
    if ($h === '') return null;
    if (preg_match('/frequently asked|faq|সচরাচর|জিজ্ঞাসিত|জিজ্ঞাসা|প্রশ্নোত্তর/u', $h)) return 'faq';
    if (preg_match('/price|cost|দাম|মূল্য/u', $h)) return 'price';
    if (preg_match('/side[\s-]*effect|পার্শ্ব/u', $h)) return 'side_effects';
    if (preg_match('/warning|precaution|সতর্ক|সাবধান/u', $h)) return 'warnings';
    if (preg_match('/dosage|dose|মাত্রা|সেবন|নিয়ম/u', $h)) return 'dosage';
    if (preg_match('/used for|uses|what is|indication|ব্যবহার|কাজে/u', $h)) return 'uses';
    return null;
}

function parseArticle(string $html): array
{
    $root = loadRoot($html);
    if (!$root) return ['ok' => false, 'preamble' => [], 'sections' => []];
    $blocks = [];
    collectBlocks($root, $blocks);

    $preamble = [];
    $sections = [];
    $cur = null;
    foreach ($blocks as $b) {
        $tag = $b['tag'];
        if (in_array($tag, ['h1', 'h2'], true)) {
            if ($cur) $sections[] = $cur;
            $cur = ['heading' => $b['text'], 'rawHeading' => $b['node']->ownerDocument->saveHTML($b['node']), 'html' => '', 'body' => []];
            continue;
        }
        if ($cur === null) {
            $preamble[] = $b;
        } else {
            $cur['body'][] = $b;
            if ($b['node'] instanceof DOMNode) {
                $cur['html'] .= $b['node']->ownerDocument->saveHTML($b['node']);
            }
        }
    }
    if ($cur) $sections[] = $cur;

    return ['ok' => true, 'preamble' => $preamble, 'sections' => $sections];
}

/** Text content with image/figure captions removed (those belong to the gallery, not the copy). */
function textWithoutFigures(DOMElement $el): string
{
    $clone = $el->cloneNode(true);
    foreach (['figure', 'figcaption', 'img', 'noscript', 'svg'] as $t) {
        $nodes = [];
        foreach ($clone->getElementsByTagName($t) as $n) $nodes[] = $n;
        foreach ($nodes as $n) {
            if ($n->parentNode) $n->parentNode->removeChild($n);
        }
    }
    return norm($clone->textContent ?? '');
}

/**
 * @return array [bullets, paragraphs, extraHtml, quotes]
 */
function sectionParts(array $body): array
{
    $bullets = [];
    $paras = [];
    $extraHtml = '';
    $quotes = [];
    foreach ($body as $b) {
        $tag = $b['tag'];
        if ($b['node'] instanceof DOMElement
            && ($b['node']->getElementsByTagName('figure')->length > 0 || $b['node']->getElementsByTagName('img')->length > 0)) {
            $b['text'] = textWithoutFigures($b['node']);
        }
        if (in_array($tag, ['ul', 'ol'], true)) {
            foreach (listItems($b['node']) as $t) {
                foreach (splitInlineBullets($t) as $piece) $bullets[] = $piece;
            }
            continue;
        }
        if ($tag === 'p' || $tag === 'text') {
            $t = $b['text'];
            if ($t === '') continue;
            if (isBulletText($t)) {
                foreach (splitInlineBullets(stripBullet($t)) as $piece) $bullets[] = $piece;
            } else {
                $paras[] = $t;
            }
            continue;
        }
        if (in_array($tag, ['h3', 'h4', 'h5', 'h6'], true)) {
            $paras[] = $b['text'];
            continue;
        }
        if (in_array($tag, ['figure', 'img', 'noscript'], true)) continue;
        if ($tag === 'blockquote') {
            $t = $b['text'];
            if ($t !== '') $quotes[] = ['text' => $t, 'html' => $b['node']->ownerDocument->saveHTML($b['node'])];
            continue;
        }
        if (in_array($tag, ['table', 'pre'], true)) {
            $extraHtml .= $b['node']->ownerDocument->saveHTML($b['node']);
            continue;
        }
        if ($b['text'] !== '') $paras[] = $b['text'];
    }
    return [$bullets, $paras, $extraHtml, $quotes];
}

/** FAQ Q/A pairs: each h3 starts a question, following text is the answer. */
function faqPairs(array $body): array
{
    $pairs = [];
    $cur = null;
    foreach ($body as $b) {
        $tag = $b['tag'];
        if (in_array($tag, ['h3', 'h4', 'strong'], true)) {
            if ($cur) $pairs[] = $cur;
            $cur = ['q' => $b['text'], 'a' => []];
            continue;
        }
        if ($cur === null) continue;
        if (in_array($tag, ['blockquote', 'figure', 'img', 'table', 'ul', 'ol'], true)) continue;
        if ($b['text'] !== '') $cur['a'][] = $b['text'];
    }
    if ($cur) $pairs[] = $cur;

    $out = [];
    foreach ($pairs as $p) {
        $q = preg_replace('/^(?:Q|প্রশ্ন)\s*[:：]\s*/u', '', $p['q']);
        $a = trim(implode(' ', $p['a']));
        $a = preg_replace('/^(?:A|উত্তর)\s*[:：]\s*/u', '', $a);
        $q = trim($q);
        if ($q === '' || $a === '') continue;
        $out[] = ['q' => $q, 'a' => $a];
    }
    return $out;
}

function amounts(string $line): array
{
    $line = bnToEn($line);
    $cur = '৳|BDT|Tk\.?|টাকা';
    $sep = '–|—|-|to\b|থেকে';

    // 1) a range that is anchored by a currency token on at least one side
    if (preg_match('/(?:' . $cur . ')\s*([0-9]+(?:\.[0-9]+)?)\s*(?:' . $sep . ')\s*(?:' . $cur . ')?\s*([0-9]+(?:\.[0-9]+)?)/iu', $line, $m)) {
        return [$m[1], $m[2]];
    }
    if (preg_match('/([0-9]+(?:\.[0-9]+)?)\s*(?:' . $sep . ')\s*(?:' . $cur . ')?\s*([0-9]+(?:\.[0-9]+)?)\s*(?:' . $cur . ')/iu', $line, $m)) {
        return [$m[1], $m[2]];
    }
    // 2) numbers attached to a currency token
    preg_match_all('/(?:' . $cur . ')\s*([0-9]+(?:\.[0-9]+)?)|([0-9]+(?:\.[0-9]+)?)\s*(?:' . $cur . ')/iu', $line, $m2, PREG_SET_ORDER);
    $nums = [];
    foreach ($m2 as $x) {
        $v = ($x[1] ?? '') !== '' ? $x[1] : ($x[2] ?? '');
        if ($v !== '') $nums[] = $v;
    }
    if ($nums) return array_slice(array_values(array_unique($nums)), 0, 2);

    // 3) plain range, then plain numbers
    if (preg_match('/([0-9]+(?:\.[0-9]+)?)\s*(?:' . $sep . ')\s*([0-9]+(?:\.[0-9]+)?)/iu', $line, $m3)) {
        return [$m3[1], $m3[2]];
    }
    preg_match_all('/([0-9]+(?:\.[0-9]+)?)/u', $line, $m4);
    return array_slice(array_values(array_unique($m4[1])), 0, 2);
}

function priceValue(string $line): string
{
    $nums = amounts($line);
    if (!$nums) return '';
    if (count($nums) >= 2) return '৳' . $nums[0] . ' – ৳' . $nums[1];
    return '৳' . $nums[0];
}

/** @return array ['tablet'=>, 'strip'=>, 'extras'=>[], 'numbers'=>[]] */
function extractPrice(array $paras, array $bullets): array
{
    $lines = array_merge($bullets, $paras);
    $res = ['tablet' => '', 'strip' => '', 'extras' => [], 'numbers' => []];
    $consumed = [];
    foreach ($lines as $i => $line) {
        $l = mb_strtolower($line);
        $isTablet = (bool) preg_match('/price per tablet|per tablet|tablet price|প্রতিটি ট্যাবলেট|ট্যাবলেটের দাম|প্রতি ট্যাবলেট/u', $l);
        $isStrip = (bool) preg_match('/price per strip|per strip|strip price|প্রতি পাতা|স্ট্রিপ|পাতার দাম/u', $l);
        if ($isTablet && $res['tablet'] === '') {
            $v = priceValue($line);
            if ($v !== '') { $res['tablet'] = $v; $consumed[$i] = true; continue; }
        }
        if ($isStrip && $res['strip'] === '') {
            $v = priceValue($line);
            if ($v !== '') { $res['strip'] = $v; $consumed[$i] = true; continue; }
        }
    }
    // fallback: a line with a currency amount but no keyword becomes the tablet price
    if ($res['tablet'] === '') {
        foreach ($lines as $i => $line) {
            if (isset($consumed[$i])) continue;
            if (!preg_match('/(?:৳|BDT|Tk\.?|টাকা)\s*[0-9]|[0-9]\s*(?:৳|BDT|Tk\.?|টাকা)/u', $line)) continue;
            $v = priceValue($line);
            if ($v !== '') { $res['tablet'] = $v; $consumed[$i] = true; break; }
        }
    }
    // leftovers: everything not turned into a price, plus numeric parentheses of consumed lines
    foreach ($lines as $i => $line) {
        $extraBits = [];
        if (isset($consumed[$i])) {
            if (preg_match_all('/\(([^)]*\d[^)]*)\)/u', $line, $pm)) {
                foreach ($pm[0] as $pc) {
                    // only keep a parenthetical when it carries price information
                    if (preg_match('/(?:৳|BDT|Tk\.?|টাকা)\s*[0-9০-৯]|[0-9০-৯]\s*(?:৳|BDT|Tk\.?|টাকা)/u', $pc)) $extraBits[] = $pc;
                }
            }
        } else {
            $extraBits[] = trim($line);
        }
        foreach ($extraBits as $bit) {
            $bit = trim($bit);
            if ($bit !== '') $res['extras'][] = $bit;
        }
        foreach (amounts($line) as $n) $res['numbers'][] = $n;
    }
    $res['numbers'] = array_values(array_unique($res['numbers']));
    return $res;
}

/** Keep an existing value only if the article does not already carry it. */
function mergeKeep(string $new, string $old): string
{
    $new = trim($new);
    $old = trim($old);
    if ($old === '') return $new;
    if ($new === '') return $old;
    $nOld = squash($old);
    if ($nOld === '') return $new;
    if (mb_strpos(squash($new), mb_substr($nOld, 0, 50)) !== false) return $new;
    return $new . "\n\n" . $old;
}

/** Push a paragraph into an items array as an unlabelled bullet. */
function paraItem(string $t, string $keyText = 'text', string $keyBn = 'text_bn'): array
{
    return ['label' => '', 'text' => $t];
}

function buildFields(array $parsed, bool $isBn, array $existing, array $faqs): array
{
    $f = [
        'intro' => '',
        'uses_text' => '', 'uses_items' => [],
        'dosage' => '', 'dosage_admin' => '', 'dosage_timing' => '',
        'side_effects' => '', 'side_effects_items' => [],
        'warnings' => [],
        'price_tablet' => '', 'price_strip' => '',
        'leftover_html' => '', 'links' => [], 'mapped_texts' => [],
        'faq_extra' => [], 'price_numbers' => [], 'price_lines' => 0,
        'has_mapped' => false,
    ];

    // ---------- preamble -> intro ----------
    $pre = [];
    foreach ($parsed['preamble'] as $b) {
        if (in_array($b['tag'], ['p', 'text'], true)) {
            $t = $b['text'];
            if ($t !== '' && !isBulletText($t)) $pre[] = $t;
        }
    }
    if ($pre) {
        $f['intro'] = implode("\n\n", $pre);
        foreach ($pre as $p) $f['mapped_texts'][] = $p;
    }

    // existing faq haystack for this language
    $faqQ = [];
    $faqA = [];
    foreach ($faqs as $x) {
        $q = $isBn ? ($x['q_bn'] ?? '') : ($x['q'] ?? '');
        $a = $isBn ? ($x['a_bn'] ?? '') : ($x['a'] ?? '');
        if ($q !== '') $faqQ[] = squash($q);
        if ($a !== '') $faqA[] = squash($a);
    }
    $faqQ = implode('|', $faqQ);
    $faqA = implode('|', $faqA);

    foreach ($parsed['sections'] as $s) {
        $kind = classifyHeading($s['heading']);
        if ($kind === null && trim($s['heading']) === '') {
            $probe = mb_strtolower(implode(' ', array_map(fn($b) => $b['text'], $s['body'])));
            if (preg_match('/dosage|dose|মাত্রা|সেবন/u', $probe)) $kind = 'dosage';
            elseif (preg_match('/price|দাম|মূল্য/u', $probe)) $kind = 'price';
            elseif (preg_match('/side[\s-]*effect|পার্শ্ব/u', $probe)) $kind = 'side_effects';
            elseif (preg_match('/warning|সতর্ক/u', $probe)) $kind = 'warnings';
            elseif (preg_match('/used for|ব্যবহার/u', $probe)) $kind = 'uses';
        }

        // collect outbound links from any section (kept in "References")
        if ($s['html'] !== '') {
            if (preg_match_all('/<a\b[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/is', $s['html'], $lm, PREG_SET_ORDER)) {
                foreach ($lm as $l) {
                    $href = html_entity_decode($l[1], ENT_QUOTES | ENT_HTML5, 'UTF-8');
                    $label = norm(strip_tags($l[2]));
                    if ($href && !str_contains($href, 'techdentalcare.com') && $label !== '') $f['links'][$href] = $label;
                }
            }
        }

        [$bullets, $paras, $extraHtml, $quotes] = sectionParts($s['body']);

        // ---------- FAQ: keep only what the structured faqs do not already hold ----------
        if ($kind === 'faq') {
            foreach (faqPairs($s['body']) as $pair) {
                $nq = mb_substr(squash($pair['q']), 0, 40);
                $na = mb_substr(squash($pair['a']), 0, 40);
                $qOk = $nq !== '' && mb_strpos($faqQ, $nq) !== false;
                $aOk = $na !== '' && mb_strpos($faqA, $na) !== false;
                if (!$qOk || !$aOk) $f['faq_extra'][] = $pair;
            }
            // disclaimer blockquotes: the page already renders a disclaimer next to the FAQ
            foreach ($quotes as $q) {
                $nq = squash($q['text']);
                if ($nq === '') continue;
                if (preg_match('/disclaimer|educational information|শিক্ষামূলক|সতর্ক/u', $q['text'])) continue;
                if (mb_strpos(squash((string) ($existing['disclaimer'] ?? '')), mb_substr($nq, 0, 40)) !== false) continue;
                $f['leftover_html'] .= $q['html'];
            }
            $f['leftover_html'] .= $extraHtml;
            continue;
        }

        if ($kind === null) {
            $f['leftover_html'] .= (trim($s['heading']) !== '' ? '<h2>' . htmlspecialchars(trim($s['heading']), ENT_QUOTES, 'UTF-8') . '</h2>' : '') . $s['html'];
            continue;
        }

        // ---------- mapped section ----------
        $f['has_mapped'] = true;
        if ($kind !== 'price') {
            foreach ($paras as $p) $f['mapped_texts'][] = $p;
            foreach ($bullets as $b) $f['mapped_texts'][] = $b;
        }
        if ($extraHtml !== '') $f['leftover_html'] .= $extraHtml;
        foreach ($quotes as $q) $f['mapped_texts'][] = $q['text'];

        if ($kind === 'uses') {
            // all prose stays in the section intro so the bullets line up with the other language
            foreach ($paras as $p) {
                $f['uses_text'] = $f['uses_text'] === '' ? $p : $f['uses_text'] . "\n\n" . $p;
            }
            foreach ($bullets as $b) {
                [$label, $text] = splitLabel($b);
                $f['uses_items'][] = ['label' => $label, 'text' => $text];
            }
        } elseif ($kind === 'dosage') {
            $dose = [];
            foreach ($bullets as $b) {
                [$label, $text] = splitLabel($b);
                $lab = mb_strtolower($label);
                if ($label !== '' && preg_match('/administration|how to take|direction|প্রয়োগ|সেবনের নিয়ম|খাওয়ার নিয়ম|নির্দেশনা/u', $lab)) {
                    $f['dosage_admin'] = $f['dosage_admin'] === '' ? $text : $f['dosage_admin'] . ' ' . $text;
                } elseif ($label !== '' && preg_match('/timing|when|সময়|কখন|টাইমিং/u', $lab)) {
                    $f['dosage_timing'] = $f['dosage_timing'] === '' ? $text : $f['dosage_timing'] . ' ' . $text;
                } else {
                    $dose[] = $b;
                }
            }
            foreach ($paras as $p) $dose[] = $p;
            if ($dose) {
                $block = implode("\n\n", $dose);
                $f['dosage'] = $f['dosage'] === '' ? $block : $f['dosage'] . "\n\n" . $block;
            }
        } elseif ($kind === 'side_effects') {
            foreach ($paras as $p) {
                $f['side_effects'] = $f['side_effects'] === '' ? $p : $f['side_effects'] . "\n\n" . $p;
            }
            foreach ($bullets as $b) $f['side_effects_items'][] = ['text' => $b];
        } elseif ($kind === 'warnings') {
            foreach ($bullets as $b) {
                [$label, $text] = splitLabel($b);
                $f['warnings'][] = ['label' => $label, 'text' => $text];
            }
            foreach ($paras as $p) {
                [$label, $text] = splitLabel($p);
                $f['warnings'][] = ['label' => $label, 'text' => $text];
            }
        } elseif ($kind === 'price') {
            $pr = extractPrice($paras, $bullets);
            if ($f['price_tablet'] === '') $f['price_tablet'] = $pr['tablet'];
            if ($f['price_strip'] === '') $f['price_strip'] = $pr['strip'];
            $f['price_numbers'] = array_merge($f['price_numbers'], $pr['numbers']);
            $f['price_lines'] += count($paras) + count($bullets);
            if ($pr['extras']) {
                $f['leftover_html'] .= '<h3>' . ($isBn ? 'মূল্য নোট' : 'Price notes') . '</h3><ul>';
                foreach ($pr['extras'] as $e) {
                    $f['leftover_html'] .= '<li>' . htmlspecialchars($e, ENT_QUOTES, 'UTF-8') . '</li>';
                }
                $f['leftover_html'] .= '</ul>';
            }
            foreach ($quotes as $q) $f['leftover_html'] .= $q['html'];
        }

        // blockquotes inside a mapped section stay with that section's text
        if ($kind !== 'price' && $quotes) {
            $qtext = implode("\n\n", array_map(fn($q) => $q['text'], $quotes));
            $append = fn(string $old, string $new): string => $old === '' ? $new : $old . "\n\n" . $new;
            if ($kind === 'uses') $f['uses_text'] = $append($f['uses_text'], $qtext);
            elseif ($kind === 'dosage') $f['dosage'] = $append($f['dosage'], $qtext);
            elseif ($kind === 'side_effects') $f['side_effects'] = $append($f['side_effects'], $qtext);
            elseif ($kind === 'warnings') $f['warnings'][] = ['label' => '', 'text' => $qtext];
        }
    }

    // never lose pre-existing values that came from somewhere else
    $f['uses_text'] = mergeKeep($f['uses_text'], $existing['uses_text'] ?? '');
    $f['dosage'] = mergeKeep($f['dosage'], $existing['dosage'] ?? '');
    $f['dosage_admin'] = mergeKeep($f['dosage_admin'], $existing['dosage_admin'] ?? '');
    $f['dosage_timing'] = mergeKeep($f['dosage_timing'], $existing['dosage_timing'] ?? '');
    $f['side_effects'] = mergeKeep($f['side_effects'], $existing['side_effects'] ?? '');

    return $f;
}

function referencesHtml(array $links): string
{
    if (!$links) return '';
    $html = '<h3>References</h3><ul>';
    foreach ($links as $href => $label) {
        $html .= '<li><a href="' . htmlspecialchars($href, ENT_QUOTES, 'UTF-8') . '" target="_blank" rel="noopener">' . htmlspecialchars($label, ENT_QUOTES, 'UTF-8') . '</a></li>';
    }
    return $html . '</ul>';
}

function validate(array $f): array
{
    $hay = squash(implode(' ', [
        $f['intro'], $f['uses_text'], $f['dosage'], $f['dosage_admin'], $f['dosage_timing'], $f['side_effects'],
        implode(' ', array_map(fn($x) => ($x['label'] ?? '') . ' ' . ($x['text'] ?? ''), $f['uses_items'])),
        implode(' ', array_map(fn($x) => ($x['text'] ?? ''), $f['side_effects_items'])),
        implode(' ', array_map(fn($x) => ($x['label'] ?? '') . ' ' . ($x['text'] ?? ''), $f['warnings'])),
        strip_tags($f['leftover_html']),
    ]));
    $missing = [];
    foreach ($f['mapped_texts'] as $t) {
        $nt = squash($t);
        if (mb_strlen($nt) < 20) continue;
        $needle = mb_substr($nt, 0, min(70, mb_strlen($nt)));
        $found = mb_strpos($hay, $needle) !== false;
        if (!$found) {
            // label may have been split off into a separate field (e.g. "Administration: ...")
            [$lab, $rest] = splitLabel($t);
            if ($lab !== '') {
                $nr = squash($rest);
                $found = $nr !== '' && mb_strpos($hay, mb_substr($nr, 0, min(70, mb_strlen($nr)))) !== false;
            }
        }
        if (!$found) $missing[] = mb_substr($t, 0, 90);
    }
    if ($f['price_numbers']) {
        $phay = squash(bnToEn($f['price_tablet'] . ' ' . $f['price_strip'] . ' ' . strip_tags($f['leftover_html'])));
        foreach ($f['price_numbers'] as $n) {
            $nn = squash((string) $n);
            if ($nn === '') continue;
            if (mb_strpos($phay, $nn) === false) $missing[] = 'PRICE ' . $n;
        }
    }
    return $missing;
}

function combineByIndex(array $en, array $bn, callable $mk): array
{
    $max = max(count($en), count($bn));
    $out = [];
    for ($i = 0; $i < $max; $i++) $out[] = $mk($en[$i] ?? null, $bn[$i] ?? null);
    return $out;
}

$stats = ['ok' => 0, 'skipped' => 0, 'blog_rows' => 0, 'with_price' => 0, 'no_price' => 0, 'faq_added' => 0];
$log = '';
$preview = [];
$blogSlugs = Post::pluck('slug')->filter()->flip();

foreach (Medicine::orderBy('id')->get() as $m) {
    if ($ONLY && $m->slug !== $ONLY) continue;
    $log .= str_repeat('=', 95) . "\nID {$m->id} | {$m->slug}\n";

    $enHtml = trim((string) $m->seo_content);
    $bnHtml = trim((string) $m->seo_content_bn);
    $hasEn = $enHtml !== '';
    $hasBn = $bnHtml !== '';

    // The 33 blog articles that live in the medicines table keep their content untouched.
    if (isset($blogSlugs[$m->slug])) {
        $update = [];
        foreach (['price_per_tablet', 'price_per_strip'] as $col) {
            $v = trim((string) $m->$col);
            if ($v === '' || $v === '৳' || preg_match('/^৳?\s*(5|50)(\.00)?$/u', $v)) $update[$col] = '';
        }
        $stats['blog_rows']++;
        $log .= "  BLOG ROW -> prices cleared: " . implode(',', array_keys($update)) . "\n";
        if ($APPLY && $update) $m->update($update);
        continue;
    }

    if (!$hasEn && !$hasBn) {
        $stats['skipped']++;
        $log .= "  SKIP: no content\n";
        continue;
    }

    $faqs = is_array($m->faqs) ? $m->faqs : [];

    $en = $hasEn ? buildFields(parseArticle(cleanHtml($enHtml)), false, [
        'uses_text' => (string) $m->uses_text,
        'dosage' => (string) $m->dosage,
        'dosage_admin' => (string) $m->dosage_admin,
        'dosage_timing' => (string) $m->dosage_timing,
        'side_effects' => (string) $m->side_effects,
        'disclaimer' => (string) ($m->author['disclaimer'] ?? ''),
    ], $faqs) : null;

    $bn = $hasBn ? buildFields(parseArticle(cleanHtml($bnHtml)), true, [
        'uses_text' => (string) $m->uses_text_bn,
        'dosage' => (string) $m->dosage_bn,
        'dosage_admin' => (string) $m->dosage_admin_bn,
        'dosage_timing' => (string) $m->dosage_timing_bn,
        'side_effects' => (string) $m->side_effects_bn,
        'disclaimer' => (string) ($m->author['disclaimer_bn'] ?? ''),
    ], $faqs) : null;

    $errors = [];
    foreach (['EN' => $en, 'BN' => $bn] as $lang => $f) {
        if (!$f) continue;
        if (!$f['has_mapped']) $log .= "  [$lang] no mapped sections\n";
        $miss = validate($f);
        if ($miss) $errors[] = strtolower($lang) . ' missing=' . count($miss) . ' :: ' . $miss[0];
    }
    if ($errors) {
        $stats['skipped']++;
        $log .= "  SKIP " . implode(' | ', $errors) . "\n";
        continue;
    }

    $update = [];
    $bothLangs = $en && $bn;

    // ---------- text fields ----------
    if ($en) {
        foreach (['uses_text', 'dosage', 'dosage_admin', 'dosage_timing', 'side_effects', 'intro'] as $k) {
            if (trim($en[$k]) !== '') $update[$k] = $en[$k];
        }
        $update['seo_content'] = trim($en['leftover_html'] . referencesHtml($en['links']));
        if ($en['price_tablet'] !== '') $update['price_per_tablet'] = $en['price_tablet'];
        if ($en['price_strip'] !== '') $update['price_per_strip'] = $en['price_strip'];
    }
    if ($bn) {
        foreach (['uses_text', 'dosage', 'dosage_admin', 'dosage_timing', 'side_effects', 'intro'] as $k) {
            if (trim($bn[$k]) !== '') $update[$k . '_bn'] = $bn[$k];
        }
        $update['seo_content_bn'] = trim($bn['leftover_html'] . referencesHtml($bn['links']));
        if (!$en || $en['price_tablet'] === '') {
            if ($bn['price_tablet'] !== '') $update['price_per_tablet'] = $bn['price_tablet'];
            if ($bn['price_strip'] !== '') $update['price_per_strip'] = $bn['price_strip'];
        }
    }

    // ---------- item arrays (only when both languages are known) ----------
    if ($bothLangs) {
        if ($en['uses_items'] || $bn['uses_items']) {
            $update['uses_items'] = combineByIndex($en['uses_items'], $bn['uses_items'], function ($a, $b) {
                return [
                    'label' => $a['label'] ?? '',
                    'text' => $a['text'] ?? '',
                    'label_bn' => $b['label'] ?? '',
                    'text_bn' => $b['text'] ?? '',
                ];
            });
        }
        if ($en['side_effects_items'] || $bn['side_effects_items']) {
            $update['side_effects_items'] = combineByIndex($en['side_effects_items'], $bn['side_effects_items'], function ($a, $b) {
                return ['text' => $a['text'] ?? '', 'text_bn' => $b['text'] ?? ''];
            });
        }
        if ($en['warnings'] || $bn['warnings']) {
            $update['warnings'] = combineByIndex($en['warnings'], $bn['warnings'], function ($a, $b) {
                return [
                    'type' => 'warning',
                    'icon' => 'triangle-exclamation',
                    'label' => $a['label'] ?? '',
                    'text' => $a['text'] ?? '',
                    'label_bn' => $b['label'] ?? '',
                    'text_bn' => $b['text'] ?? '',
                ];
            });
        }
    }

    // ---------- FAQs: append anything the structured list did not have ----------
    $newFaqs = $faqs;
    $added = 0;
    if ($en && $en['faq_extra']) {
        foreach ($en['faq_extra'] as $p) {
            $newFaqs[] = ['q' => $p['q'], 'a' => $p['a']];
            $added++;
        }
    }
    if ($bn && $bn['faq_extra']) {
        foreach ($bn['faq_extra'] as $p) {
            $newFaqs[] = ['q_bn' => $p['q'], 'a_bn' => $p['a']];
            $added++;
        }
    }
    if ($added) $update['faqs'] = $newFaqs;
    $stats['faq_added'] += $added;

    // ---------- clear leftover placeholders ----------
    $finalTablet = $update['price_per_tablet'] ?? (string) $m->price_per_tablet;
    if (trim($finalTablet) === '' || $finalTablet === '৳' || preg_match('/^৳?\s*(5|50)(\.00)?$/u', $finalTablet)) {
        $update['price_per_tablet'] = '';
    }
    $finalStrip = $update['price_per_strip'] ?? (string) $m->price_per_strip;
    if (trim($finalStrip) === '' || preg_match('/^৳?\s*50(\.00)?$/u', $finalStrip)) {
        $update['price_per_strip'] = '';
    }

    $stats['ok']++;
    $priceText = $update['price_per_tablet'] ?? '';
    if ($priceText !== '') $stats['with_price']++; else $stats['no_price']++;
    $log .= "  faq=" . count($newFaqs) . " (+$added) tablet=[" . ($update['price_per_tablet'] ?? '') . "] strip=[" . ($update['price_per_strip'] ?? '') . "]\n";
    $log .= "  fields=" . implode(',', array_keys($update)) . "\n";
    $log .= "  more_about: en=" . (isset($update['seo_content']) ? strlen($update['seo_content']) : '-') . " bn=" . (isset($update['seo_content_bn']) ? strlen($update['seo_content_bn']) : '-') . "\n";

    if ($APPLY) $m->update($update); else $preview[$m->slug] = $update;
}

if (!$APPLY) {
    file_put_contents(__DIR__ . '/../scratch/restructure_preview.json', json_encode($preview ?? [], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
}

file_put_contents(__DIR__ . '/../scratch/restructure_report.txt', $log);
echo json_encode($stats) . " apply=" . ($APPLY ? 'yes' : 'no') . "\n";
