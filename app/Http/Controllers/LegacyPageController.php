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

        // Old URLs whose page already exists in the current site render that
        // existing page (same component, design and content) at the old URL.
        if ($response = $this->serveMappedEntity($request, $clean)) {
            return $response;
        }

        $page = $this->findByPath($clean);

        if (!$page) {
            abort(404);
        }

        return $this->serve($page);
    }

    /**
     * Used by the old-URL redirect routes: serve the matching current page or
     * archived page when we have it, otherwise fall back to the 301 target.
     */
    public static function resolveOrRedirect(Request $request, string $path, string $fallback)
    {
        $clean = '/' . trim($path, '/');
        $controller = new self();

        if ($response = $controller->serveMappedEntity($request, $clean)) {
            return $response;
        }

        $page = $controller->findByPath($clean);

        if ($page) {
            return $controller->serve($page);
        }

        return redirect($fallback, 301);
    }

    /**
     * Old URL -> existing entity map (generated from the archived WordPress
     * paths). Returns null when the URL is legacy-only.
     */
    private function serveMappedEntity(Request $request, string $path)
    {
        $map = $this->entityMap();
        if (!$map) {
            return null;
        }

        $key = rtrim($path, '/');
        $entry = $map[$key] ?? $map[$key . '/'] ?? null;
        if (!$entry) {
            $decodedKey = rtrim(rawurldecode($path), '/');
            $entry = $map[$decodedKey] ?? $map[$decodedKey . '/'] ?? null;
        }
        if (!$entry) {
            return null;
        }

        try {
            switch ($entry['type']) {
                case 'medicine':
                    return app(MedicineController::class)->publicShow($request, $entry['slug'], true);
                case 'post':
                    return app(BlogController::class)->publicShow($request, $entry['slug'], true);
                case 'service':
                    return app(ServiceController::class)->publicShow($request, $entry['slug'], true);
                case 'doctor':
                    return app(DoctorController::class)->publicShow($entry['id']);
                case 'page':
                    return app(PageController::class)->publicShow($entry['slug'], true);
                case 'appointment':
                    return app(AppointmentController::class)->publicBook();
                case 'home':
                    return app(PublicHomeController::class)->index();
                case 'about':
                    return app(AboutContentController::class)->publicShow();
                case 'branches':
                    return app(BranchController::class)->publicIndex();
                case 'branch':
                    return app(BranchController::class)->publicShow($entry['slug']);
                case 'doctors':
                    return app(DoctorController::class)->publicIndex();
                case 'price_list':
                    return app(PriceListController::class)->publicShow();
            }
        } catch (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e) {
            return null;
        }

        return null;
    }

    private function entityMap(): array
    {
        static $map = null;
        if ($map !== null) {
            return $map;
        }

        $file = resource_path('data/legacy-entity-map.json');
        if (!is_file($file)) {
            return $map = [];
        }

        $decoded = json_decode((string) file_get_contents($file), true);
        if (!is_array($decoded)) {
            return $map = [];
        }

        // Normalise keys so "/napa-500mg/" and "/napa-500mg" both resolve.
        $map = [];
        foreach ($decoded as $p => $entry) {
            $map[rtrim((string) $p, '/')] = $entry;
        }

        return $map;
    }

    /** True when an old URL is served by an existing page of the current site. */
    public static function hasMappedEntity(string $path): bool
    {
        $file = resource_path('data/legacy-entity-map.json');
        if (!is_file($file)) {
            return false;
        }

        $decoded = json_decode((string) file_get_contents($file), true);
        if (!is_array($decoded)) {
            return false;
        }

        // Paths may arrive percent-encoded (e.g. Bengali slugs) from the raw
        // request URI, so check both the decoded and raw forms.
        foreach (array_unique([$path, rawurldecode($path)]) as $candidate) {
            $key = rtrim('/' . trim($candidate, '/'), '/');
            if (isset($decoded[$key]) || isset($decoded[$key . '/'])) {
                return true;
            }
        }

        return false;
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

    /** Archived HTML: keep text and images only, never archived buttons/forms. */
    private function prepareBody(string $html): string
    {
        $html = preg_replace('#https?://web\.archive\.org/web/\d+(?:[a-z_]{0,4})?/#i', '', $html);
        $html = preg_replace('#(href=["\'])(?:https?:)?//techdentalcare\.com#i', '$1', $html);

        // Only text, images, lists and tables are wanted from the old pages.
        // Drop every archived button, form and call-to-action widget: those were
        // the old site's controls and do not belong in the current design.
        $html = preg_replace('#<(script|style|noscript|form|button|input|select|textarea|iframe)\b[^>]*>.*?</\1>#is', '', $html);
        $html = preg_replace('#<(input|select|textarea|button|iframe)\b[^>]*/?>#i', '', $html);

        // Elementor button / CTA / form widgets (nested, so loop until stable).
        for ($i = 0; $i < 6; $i++) {
            $before = $html;
            $html = preg_replace(
                '#<div\b[^>]*class="[^"]*(?:elementor-widget-button|elementor-widget-form|elementor-widget-call-to-action|elementor-widget-nav-menu|elementor-widget-search-form)[^"]*"[^>]*>.*?</div>#is',
                '',
                $html
            );
            if ($html === $before) break;
        }

        // Anchors that are styled as buttons keep their text but lose the button look.
        $html = preg_replace_callback('#<a\b([^>]*)>(.*?)</a>#is', function ($m) {
            $attrs = $m[1];
            if (preg_match('#class="[^"]*(?:btn|button|elementor-button|add-to-cart|order-now|book-online|call-now)[^"]*"#i', $attrs)) {
                return '<span>' . $m[2] . '</span>';
            }
            return $m[0];
        }, $html);

        // Old floating hotline / sticky CTA strips.
        $html = preg_replace('#<div\b[^>]*(?:elementor-widget-fixed|sticky|floating|hotline-box|call-now-box)[^>]*>.*?</div>#is', '', $html);

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

        if ($response = $controller->serveMappedEntity(request(), $clean)) {
            return $response;
        }

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
