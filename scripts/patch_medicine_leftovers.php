<?php
/**
 * Patch the remaining content that the first restructuring pass dropped.
 *
 * The first pass only wrote item arrays when BOTH languages parsed, and it discarded
 * prose paragraphs inside FAQ sections (they were only picked up when written as
 * headings).  This script re-reads the pristine backup article, finds every text unit
 * that is not present anywhere in the current row, and puts it back into the matching
 * structured field (uses / dosage / side effects / warnings / faqs) or into the
 * "More about" rich content when the unit does not belong to a mapped section.
 *
 * Idempotent: a unit that already exists anywhere in the row is never added again.
 *
 * Usage:
 *   php scripts/patch_medicine_leftovers.php              (dry run)
 *   php scripts/patch_medicine_leftovers.php --apply
 *   php scripts/patch_medicine_leftovers.php --slug=naproxen-500
 */
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Medicine;

$APPLY = in_array('--apply', $argv, true);
$ONLY = null;
$BACKUP = __DIR__ . '/../database/database.sqlite.bak-20261110-124011';
foreach ($argv as $a) {
    if (str_starts_with($a, '--slug=')) $ONLY = substr($a, 7);
    if (str_starts_with($a, '--backup=')) $BACKUP = substr($a, 9);
}

// ---------------------------------------------------------------------------
// reuse the parser of the restructuring script (everything before its runner)
// ---------------------------------------------------------------------------
$src = file_get_contents(__DIR__ . '/restructure_medicine_content.php');
$cut = strpos($src, '$stats = [');
$funcs = substr($src, 0, $cut);
$funcs = preg_replace('/^<\?php\s*/', '', $funcs);
$funcs = preg_replace('/^require .*?;\s*/m', '', $funcs);
$funcs = preg_replace('/^\$app = .*?;\s*/m', '', $funcs);
$funcs = preg_replace('/^\$app->make\(.*?;\s*/m', '', $funcs);
$funcs = preg_replace('/^use App\\\\\\\\Models\\\\\\\\Medicine;\s*/m', '', $funcs);
$funcs = preg_replace('/^use App\\\\\\\\Models\\\\\\\\Post;\s*/m', '', $funcs);
eval($funcs);

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
function present(string $haySquash, string $unit): bool
{
    $n = squash($unit);
    if ($n === '') return true;
    // Bengali vowel signs are combining marks, so a long sentence squashes to few
    // characters. Gate on the real length instead, and only skip ultra-short units.
    if (mb_strlen(trim($unit)) < 12) return true;
    if (mb_strlen($n) < 8) return true;
    if (mb_strpos($haySquash, mb_substr($n, 0, 50)) !== false) return true;

    // The restructuring pass dropped label prefixes ("Administration:", "উত্তর:", ...).
    // A unit whose body is already stored is not lost content, only its label is.
    if (preg_match('/^(.{2,45}?)\s*[:：]\s*(.+)$/u', $unit, $m)) {
        $rest = squash($m[2]);
        if (mb_strlen($rest) >= 8 && mb_strpos($haySquash, mb_substr($rest, 0, 50)) !== false) return true;
    }
    return false;
}

function jsonLeaves($node, array &$out): void
{
    if (is_string($node)) { $out[] = $node; return; }
    if (is_array($node)) { foreach ($node as $x) jsonLeaves($x, $out); }
}

function rowHaystack(array $row, array $skip): string
{
    $parts = [];
    foreach ($row as $k => $v) {
        if (in_array($k, $skip, true)) continue;
        jsonLeaves($v, $parts);
    }
    return squash(implode(' ', $parts));
}

/** FAQ written as paragraphs: "প্রশ্ন: ..." followed by the answer paragraph. */
function paragraphFaqPairs(array $paras): array
{
    $pairs = [];
    $cur = null;
    foreach ($paras as $p) {
        if (preg_match('/^(?:প্রশ্ন|Q)\s*[:：]\s*(.+)$/u', $p, $m)) {
            if ($cur !== null) $pairs[] = $cur;
            $cur = ['q' => trim($m[1]), 'a' => ''];
            continue;
        }
        if ($cur !== null) {
            $a = preg_replace('/^(?:উত্তর|A)\s*[:：]\s*/u', '', $p);
            $cur['a'] = $cur['a'] === '' ? $a : $cur['a'] . ' ' . $a;
        }
    }
    if ($cur !== null) $pairs[] = $cur;
    return array_values(array_filter($pairs, fn($x) => $x['q'] !== '' && $x['a'] !== ''));
}

/** Price lines that carry context the price card cannot show (pack size, brand, combination...). */
function priceLineIsNote(string $line, string $priceTablet, string $priceStrip): bool
{
    if (!preg_match('/বক্স|প্যাক|সাইজ|ব্র্যান্ড|কম্বিনেশন|টিউব|ব্লিস্টার|রিলিজ|কিট|box|pack|size|brand|combination|tube|blister|coating|kit/iu', $line)) {
        return false;
    }
    return priceLineIsNew($line, $priceTablet, $priceStrip);
}
function priceLineIsNew(string $line, string $priceTablet, string $priceStrip): bool
{
    $nums = amounts($line);
    if (!$nums) return false;
    $have = $priceTablet . ' ' . $priceStrip;
    foreach ($nums as $n) {
        if (mb_strpos($have, (string) $n) === false) return true;
    }
    return false;
}

// ---------------------------------------------------------------------------

$curDb = new PDO('sqlite:' . __DIR__ . '/../database/database.sqlite');
$curDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$oldDb = new PDO('sqlite:' . $BACKUP);
$oldDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$postSlugs = [];
foreach ($curDb->query('SELECT slug FROM posts') as $r) $postSlugs[$r['slug']] = true;

$cur = [];
foreach ($curDb->query('SELECT * FROM medicines ORDER BY id') as $r) $cur[$r['slug']] = $r;
$old = [];
foreach ($oldDb->query('SELECT * FROM medicines ORDER BY id') as $r) $old[$r['slug']] = $r;

$stats = ['rows' => 0, 'rows_changed' => 0, 'units' => 0, 'price_notes' => 0, 'faqs' => 0, 'leftovers' => 0, 'skipped_unparsed' => 0];
$log = '';

foreach ($old as $slug => $o) {
    if ($ONLY !== null && $slug !== $ONLY) continue;
    if (isset($postSlugs[$slug])) continue; // inert blog import rows: never rendered as medicines
    if (!isset($cur[$slug])) continue;
    $stats['rows']++;
    $c = $cur[$slug];

    foreach (['uses_items', 'side_effects_items', 'warnings', 'faqs', 'author'] as $jc) {
        if (isset($c[$jc]) && is_string($c[$jc])) {
            $d = json_decode($c[$jc], true);
            if (json_last_error() === JSON_ERROR_NONE) $c[$jc] = $d;
        }
    }

    $skip = ['id', 'slug', 'created_at', 'updated_at', 'image', 'gallery', 'sort_order', 'is_active', 'name', 'name_bn', 'meta_desc', 'meta_desc_bn', 'seo_title', 'seo_title_bn'];
    $hay = rowHaystack($c, $skip);

    $added = [];   // field => value to merge at the end
    $faqAdd = [];  // ['q'|'q_bn' => ..., 'a'|'a_bn' => ...]
    $leftEn = [];
    $leftBn = [];
    $priceNote = ['en' => [], 'bn' => []];
    $rowLog = [];

    foreach (['en' => 'seo_content', 'bn' => 'seo_content_bn'] as $lang => $col) {
        $isBn = $lang === 'bn';
        $html = trim((string) $o[$col]);
        if ($html === '') continue;

        $parsed = parseArticle(cleanHtml($html));
        if (!$parsed['ok']) {
            $stats['skipped_unparsed']++;
            $rowLog[] = "[$lang] article did not parse";
            continue;
        }
        if (in_array('--debug', $argv, true)) {
            echo "[$lang] sections=" . count($parsed['sections']) . ' preamble=' . count($parsed['preamble']) . PHP_EOL;
            foreach ($parsed['sections'] as $i => $s) {
                echo "  [$i] " . mb_substr($s['heading'], 0, 60) . ' => ' . var_export(classifyHeading($s['heading']), true) . PHP_EOL;
            }
        }

        $suffix = $isBn ? '_bn' : '';
        $priceT = (string) $c['price_per_tablet'];
        $priceS = (string) $c['price_per_strip'];

        $putLeftover = function (string $html, string $kind = 'text') use (&$leftEn, &$leftBn, $isBn) {
            if ($isBn) $leftBn[] = [$kind, $html];
            else $leftEn[] = [$kind, $html];
        };

        // ---- preamble -> intro (or uses items when the article starts with a bullet list) ----
        foreach ($parsed['preamble'] as $b) {
            if (!in_array($b['tag'], ['p', 'text'], true)) continue;
            $t = $b['text'];
            if ($t === '') continue;
            if (isBulletText($t)) {
                foreach (splitInlineBullets(stripBullet($t)) as $piece) {
                    if (present($hay, $piece)) continue;
                    [$label, $text] = splitLabel($piece);
                    $added['uses_items'][] = $isBn
                        ? ['label' => '', 'text' => '', 'label_bn' => $label, 'text_bn' => $text]
                        : ['label' => $label, 'text' => $text, 'label_bn' => '', 'text_bn' => ''];
                    $hay .= ' ' . squash($piece);
                    $stats['units']++;
                    $rowLog[] = "[$lang] uses bullet += " . mb_substr($piece, 0, 50);
                }
                continue;
            }
            if (present($hay, $t)) continue;
            $field = 'intro' . $suffix;
            $added[$field] = ($added[$field] ?? trim((string) $c[$field])) . "\n\n" . $t;
            $hay .= ' ' . squash($t);
            $stats['units']++;
            $rowLog[] = "[$lang] intro += " . mb_substr($t, 0, 50);
        }

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

            [$bullets, $paras, $extraHtml, $quotes] = sectionParts($s['body']);

            // ---- external links from any section ----
            if ($s['html'] !== '' && preg_match_all('/<a\b[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/is', $s['html'], $lm, PREG_SET_ORDER)) {
                foreach ($lm as $l) {
                    $href = html_entity_decode($l[1], ENT_QUOTES | ENT_HTML5, 'UTF-8');
                    $label = norm(strip_tags($l[2]));
                    if ($href === '' || $label === '' || str_contains($href, 'techdentalcare.com')) continue;
                    if (mb_strpos($hay, squash($href)) !== false) continue;
                    $item = '<li><a href="' . htmlspecialchars($href, ENT_QUOTES, 'UTF-8') . '" target="_blank" rel="noopener">'
                        . htmlspecialchars($label, ENT_QUOTES, 'UTF-8') . '</a></li>';
                    $putLeftover($item, 'ref');
                    $hay .= ' ' . squash($href . ' ' . $label);
                    $stats['units']++;
                    $rowLog[] = "[$lang] reference += $label";
                }
            }

            // ---- FAQ sections ----
            if ($kind === 'faq') {
                if (in_array('--debug', $argv, true)) {
                    echo "  faq paras=" . count($paras) . ' pairs=' . count(paragraphFaqPairs($paras)) . ' headingPairs=' . count(faqPairs($s['body'])) . PHP_EOL;
                }
                $consumed = [];
                foreach (paragraphFaqPairs($paras) as $pair) {
                    $qKey = $isBn ? 'q_bn' : 'q';
                    $aKey = $isBn ? 'a_bn' : 'a';
                    if (present($hay, $pair['q']) && present($hay, $pair['a'])) continue;
                    $faqAdd[] = [$qKey => $pair['q'], $aKey => $pair['a']];
                    $hay .= ' ' . squash($pair['q'] . ' ' . $pair['a']);
                    $stats['faqs']++;
                    $rowLog[] = "[$lang] faq += " . mb_substr($pair['q'], 0, 50);
                }
                // heading-style pairs (EN articles)
                foreach (faqPairs($s['body']) as $pair) {
                    $qKey = $isBn ? 'q_bn' : 'q';
                    $aKey = $isBn ? 'a_bn' : 'a';
                    if (present($hay, $pair['q']) && present($hay, $pair['a'])) continue;
                    $faqAdd[] = [$qKey => $pair['q'], $aKey => $pair['a']];
                    $hay .= ' ' . squash($pair['q'] . ' ' . $pair['a']);
                    $stats['faqs']++;
                    $rowLog[] = "[$lang] faq += " . mb_substr($pair['q'], 0, 50);
                }
                // paragraphs that are not part of a Q/A pair
                foreach ($paras as $p) {
                    if (preg_match('/^(?:প্রশ্ন|Q)\s*[:：]/u', $p)) continue;
                    if (present($hay, $p)) continue;
                    $putLeftover('<p>' . htmlspecialchars($p, ENT_QUOTES, 'UTF-8') . '</p>');
                    $hay .= ' ' . squash($p);
                    $stats['leftovers']++;
                    $rowLog[] = "[$lang] more-about += " . mb_substr($p, 0, 50);
                }
                foreach ($quotes as $q) {
                    if (preg_match('/disclaimer|educational information|শিক্ষামূলক|সতর্ক/u', $q['text'])) continue;
                    if (present($hay, $q['text'])) continue;
                    $putLeftover($q['html']);
                    $hay .= ' ' . squash($q['text']);
                    $stats['leftovers']++;
                }
                if ($extraHtml !== '') $putLeftover($extraHtml);
                continue;
            }

            // ---- unmapped section: keep the whole block in "More about" ----
            if ($kind === null) {
                $heading = trim($s['heading']);
                $all = array_merge($paras, $bullets);
                $missing = array_values(array_filter($all, fn($t) => !present($hay, $t)));
                if (!$missing && $extraHtml === '') continue;
                if ($heading !== '' && !present($hay, $heading)) {
                    $putLeftover('<h2>' . htmlspecialchars($heading, ENT_QUOTES, 'UTF-8') . '</h2>');
                    $hay .= ' ' . squash($heading);
                    $stats['leftovers']++;
                } else {
                    $heading = '';
                }
                foreach ($missing as $t) {
                    $putLeftover('<p>' . htmlspecialchars($t, ENT_QUOTES, 'UTF-8') . '</p>');
                    $hay .= ' ' . squash($t);
                    $stats['leftovers']++;
                    $rowLog[] = "[$lang] more-about += " . mb_substr($t, 0, 50);
                }
                if ($extraHtml !== '') {
                    $putLeftover($extraHtml);
                    $hay .= ' ' . squash(strip_tags($extraHtml));
                }
                continue;
            }

            // ---- mapped section ----
            $placeBullet = function (string $b) use ($kind, $isBn, $suffix, &$added, &$rowLog, $lang, &$priceNote, $priceT, $priceS) {
                if ($kind === 'uses') {
                    [$label, $text] = splitLabel($b);
                    $added['uses_items'][] = $isBn
                        ? ['label' => '', 'text' => '', 'label_bn' => $label, 'text_bn' => $text]
                        : ['label' => $label, 'text' => $text, 'label_bn' => '', 'text_bn' => ''];
                } elseif ($kind === 'side_effects') {
                    $added['side_effects_items'][] = $isBn
                        ? ['text' => '', 'text_bn' => $b]
                        : ['text' => $b, 'text_bn' => ''];
                } elseif ($kind === 'warnings') {
                    [$label, $text] = splitLabel($b);
                    $added['warnings'][] = [
                        'type' => 'warning',
                        'icon' => 'triangle-exclamation',
                        'label' => $isBn ? '' : $label,
                        'text' => $isBn ? '' : $text,
                        'label_bn' => $isBn ? $label : '',
                        'text_bn' => $isBn ? $text : '',
                    ];
                } elseif ($kind === 'dosage') {
                    [$label, $text] = splitLabel($b);
                    $lab = mb_strtolower($label);
                    if ($label !== '' && preg_match('/administration|how to take|direction|প্রয়োগ|সেবনের নিয়ম|খাওয়ার নিয়ম|নির্দেশনা/u', $lab)) {
                        $f = 'dosage_admin' . $suffix;
                        $added[$f] = trim(($added[$f] ?? '') . ' ' . $text);
                    } elseif ($label !== '' && preg_match('/timing|when|সময়|কখন|টাইমিং/u', $lab)) {
                        $f = 'dosage_timing' . $suffix;
                        $added[$f] = trim(($added[$f] ?? '') . ' ' . $text);
                    } else {
                        $f = 'dosage' . $suffix;
                        $added[$f] = trim(($added[$f] ?? '') . "\n\n" . ($label !== '' ? $label . ': ' : '') . $text);
                    }
                } elseif ($kind === 'price') {
                    if (priceLineIsNote($b, $priceT, $priceS)) {
                        $priceNote[$isBn ? 'bn' : 'en'][] = $b;
                        return true;
                    }
                    return false;
                }
                return true;
            };

            foreach ($bullets as $b) {
                if (present($hay, $b)) continue;
                $queued = $placeBullet($b);
                $hay .= ' ' . squash($b);
                if (!$queued) continue;
                if ($kind !== 'price') $stats['units']++;
                $rowLog[] = "[$lang] $kind bullet += " . mb_substr($b, 0, 50);
            }
            foreach ($paras as $p) {
                if (present($hay, $p)) continue;
                if ($kind === 'price') {
                    if (priceLineIsNote($p, $priceT, $priceS)) $priceNote[$isBn ? 'bn' : 'en'][] = $p;
                } elseif ($kind === 'uses' || $kind === 'side_effects') {
                    $f = ($kind === 'uses' ? 'uses_text' : 'side_effects') . $suffix;
                    $added[$f] = trim(($added[$f] ?? '') . "\n\n" . $p);
                } elseif ($kind === 'dosage') {
                    $f = 'dosage' . $suffix;
                    $added[$f] = trim(($added[$f] ?? '') . "\n\n" . $p);
                } else { // warnings
                    $added['warnings'][] = [
                        'type' => 'warning',
                        'icon' => 'triangle-exclamation',
                        'label' => $isBn ? '' : '',
                        'text' => $isBn ? '' : $p,
                        'label_bn' => '',
                        'text_bn' => $isBn ? $p : '',
                    ];
                }
                $hay .= ' ' . squash($p);
                if ($kind !== 'price') $stats['units']++;
                $rowLog[] = "[$lang] $kind para += " . mb_substr($p, 0, 50);
            }
            foreach ($quotes as $q) {
                if (preg_match('/disclaimer|educational information|শিক্ষামূলক|সতর্ক/u', $q['text'])) continue;
                if (present($hay, $q['text'])) continue;
                if ($kind === 'warnings') {
                    $added['warnings'][] = [
                        'type' => 'warning',
                        'icon' => 'triangle-exclamation',
                        'label' => '', 'text' => $isBn ? '' : $q['text'],
                        'label_bn' => '', 'text_bn' => $isBn ? $q['text'] : '',
                    ];
                } else {
                    $f = ($kind === 'uses' ? 'uses_text' : ($kind === 'side_effects' ? 'side_effects' : 'dosage')) . $suffix;
                    $added[$f] = trim(($added[$f] ?? '') . "\n\n" . $q['text']);
                }
                $hay .= ' ' . squash($q['text']);
                $stats['units']++;
            }
            if ($extraHtml !== '') {
                $putLeftover($extraHtml);
                $hay .= ' ' . squash(strip_tags($extraHtml));
            }
        }
    }

    // ---- price notes + leftovers become "More about" content ----
    foreach ([['en', &$leftEn, $priceNote['en']], ['bn', &$leftBn, $priceNote['bn']]] as [$lang, &$bucket, $notes]) {
        $isBn = $lang === 'bn';
        if ($notes) {
            $html = '<h3>' . ($isBn ? 'মূল্য নোট' : 'Price notes') . '</h3><ul>';
            foreach ($notes as $n) $html .= '<li>' . htmlspecialchars($n, ENT_QUOTES, 'UTF-8') . '</li>';
            $html .= '</ul>';
            $bucket[] = ['notes', $html];
            $stats['price_notes'] += count($notes);
        }
        if (!$bucket) continue;
        $html = '';
        foreach ($bucket as [$kind, $frag]) $html .= $frag;
        $field = $isBn ? 'seo_content_bn' : 'seo_content';
        $existing = trim((string) $c[$field]);
        $added[$field] = ($existing === '' ? '' : $existing . "\n") . $html;
    }
    unset($bucket);

    foreach (['uses_items', 'side_effects_items', 'warnings'] as $arrField) {
        if (!empty($added[$arrField])) {
            $base = is_array($c[$arrField] ?? null) ? $c[$arrField] : [];
            $added[$arrField] = array_merge($base, $added[$arrField]);
        }
    }

    if ($faqAdd) {
        $faqs = is_array($c['faqs']) ? $c['faqs'] : [];
        foreach ($faqAdd as $pair) $faqs[] = $pair;
        $added['faqs'] = $faqs;
    }

    if (!$added) continue;
    $stats['rows_changed']++;
    $log .= $slug . PHP_EOL . '  ' . implode(PHP_EOL . '  ', array_slice($rowLog, 0, 14)) . PHP_EOL;

    if ($APPLY) {
        $m = Medicine::where('slug', $slug)->first();
        if ($m) $m->update($added);
    }
}

echo json_encode($stats) . ' apply=' . ($APPLY ? 'yes' : 'no') . PHP_EOL;
file_put_contents(__DIR__ . '/../scratch/patch_leftovers_report.txt', $log);
echo 'report: scratch/patch_leftovers_report.txt' . PHP_EOL;
