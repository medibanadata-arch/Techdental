<?php

namespace App\Http\Controllers;

use App\Models\LegacyPage;
use Illuminate\Http\Request;

class LegacyPageController extends Controller
{
    /**
     * Serve an old techdentalcare.com URL at its exact original path with the
     * original title, meta description, Open Graph/Twitter tags and JSON-LD.
     * These rows are imported from the archived WordPress pages.
     */
    public function show(Request $request, $path = '')
    {
        $clean = '/' . trim((string) $path, '/');
        if ($clean === '/') {
            return redirect('/', 301);
        }

        $page = $this->findByPath($clean);

        if (!$page) {
            abort(404);
        }

        return $this->serve($page);
    }

    /**
     * Used by the old-URL redirect routes: serve the archived page when we have
     * it, otherwise fall back to the original 301 target.
     */
    public static function resolveOrRedirect(Request $request, string $path, string $fallback)
    {
        $page = (new self())->findByPath('/' . trim($path, '/'));

        if ($page) {
            return (new self())->serve($page);
        }

        return redirect($fallback, 301);
    }

    private function findByPath(string $path): ?LegacyPage
    {
        return LegacyPage::where('is_active', true)
            ->where(function ($q) use ($path) {
                $q->where('path', $path)->orWhere('path', $path . '/');
            })
            ->first();
    }

    private function serve(LegacyPage $page)
    {
        $schema = $this->decodeArray($page->schema_json);
        $og = $this->decodeArray($page->og_json);
        $twitter = $this->decodeArray($page->twitter_json);
        $hreflang = $this->decodeArray($page->hreflang_json);
        $faqs = $this->decodeArray($page->faqs_json);

        $isBn = $page->lang === 'bn';
        $title = trim((string) ($page->title ?: $page->h1));
        $h1 = trim((string) ($page->h1 ?: $page->title));
        $canonical = $page->canonical ?: ('https://techdentalcare.com' . $page->path);

        $legacySeo = [
            'title' => $title,
            'description' => (string) $page->meta_description,
            'keywords' => (string) $page->meta_keywords,
            'robots' => $page->robots ?: 'index, follow',
            'canonical' => $canonical,
            'lang' => $isBn ? 'bn' : 'en',
            'og' => $og,
            'twitter' => $twitter,
            'hreflang' => $hreflang,
            'schema' => $schema,
        ];

        return \Inertia\Inertia::render('Legacy/Show', [
            'legacy' => [
                'path' => $page->path,
                'title' => $title,
                'h1' => $h1,
                'body_html' => $this->prepareBody((string) $page->body_html),
                'faqs' => $faqs,
                'snapshot_at' => $page->snapshot_at,
                'is_bn' => $isBn,
            ],
            'legacy_seo' => $legacySeo,
            'locations' => \App\Models\Location::orderBy('sort_order')->get(),
            'nav_menu' => \App\Models\NavMenu::first(),
        ]);
    }

    /** Archived HTML: keep internal links relative and normalise headings/images. */
    private function prepareBody(string $html): string
    {
        $html = preg_replace('#https?://web\.archive\.org/web/\d+(?:[a-z_]{0,4})?/#i', '', $html);
        $html = preg_replace('#(href=["\'])(?:https?:)?//techdentalcare\.com#i', '$1', $html);

        // One H1 per page: the page template prints the archived H1, so demote
        // every H1 inside the archived body to H2 (text is preserved).
        $html = preg_replace_callback('#<h1(\s[^>]*)?>(.*?)</h1>#is', function ($m) {
            return '<h2' . ($m[1] ?? '') . '>' . $m[2] . '</h2>';
        }, $html);

        return $html;
    }

    /**
     * Render an archived legacy page for a path when one exists. Used by the
     * 404 handler so entity routes that no longer resolve (removed doctors,
     * renamed service slugs, ...) still serve their original URL instead of 404.
     */
    public static function serveIfExists(string $path)
    {
        $decoded = rawurldecode($path);
        $clean = '/' . trim($decoded, '/');
        if ($clean === '/') {
            return null;
        }

        $controller = new self();
        $page = $controller->findByPath($clean);
        if (!$page) {
            return null;
        }

        return $controller->serve($page);
    }

    private function decodeArray($value): array
    {
        if (empty($value)) {
            return [];
        }
        $decoded = json_decode($value, true);
        return is_array($decoded) ? $decoded : [];
    }

    /** Keep archived internal links on the live domain; images keep their original host. */
    private function localizeLinks(string $html): string
    {
        $html = preg_replace('#https?://web\.archive\.org/web/\d+(?:[a-z_]{0,4})?/#i', '', $html);
        $html = preg_replace('#(href=["\'])(?:https?:)?//techdentalcare\.com#i', '$1', $html);

        return $html;
    }
}
