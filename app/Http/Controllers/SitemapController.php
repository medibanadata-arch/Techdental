<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Location;
use App\Models\Medicine;
use App\Models\Post;
use App\Models\Service;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * XML sitemap with English + Bangla URLs and hreflang alternates.
     * Thin/empty articles are deliberately left out so Google only sees
     * pages that have real content.
     */
    public function index(): Response
    {
        $base = rtrim((string) config('site.url'), '/');
        $urls = [];

        $add = function (string $path, ?string $lastmod = null, ?string $priority = null, array $alternates = []) use (&$urls, $base) {
            $urls[] = [
                'loc' => $base . '/' . ltrim($path, '/'),
                'lastmod' => $lastmod,
                'priority' => $priority,
                'alternates' => $alternates,
            ];
        };

        // Core pages
        $static = [
            ['', '1.0'], ['/doctors', '0.9'], ['/medicines', '0.9'],
            ['/blog', '0.9'], ['/blog/others', '0.7'], ['/branches', '0.8'], ['/about', '0.8'],
            ['/price-list', '0.8'], ['/patient-rights', '0.6'], ['/how-to-pay', '0.6'],
            ['/appointment', '0.8'], ['/team', '0.6'],
        ];
        foreach ($static as [$path, $priority]) {
            $add($path, null, $priority);
        }

        // Services listing (English + Bangla)
        $serviceListAlternates = ['en' => $base . '/services', 'bn' => $base . '/bn/services', 'x-default' => $base . '/services'];
        $add('/services', null, '0.9', $serviceListAlternates);
        $add('/bn/services', null, '0.7', $serviceListAlternates);

        // Branches
        foreach (Location::orderBy('sort_order')->get() as $branch) {
            if ($branch->slug) {
                $add('/branch/' . $branch->slug, optional($branch->updated_at)->toAtomString(), '0.7');
            }
        }

        // Services — canonical pattern matches the old product sitemap
        foreach (Service::where('status', 'Published')->orderBy('rank_order')->get() as $service) {
            if (!$service->slug) {
                continue;
            }
            $enPath = '/service/' . $service->slug;
            $bnPath = $service->slug_bn ? '/bn/service/' . $service->slug_bn : null;
            $lastmod = optional($service->updated_at)->toAtomString();
            $alternates = $bnPath
                ? ['en' => $base . $enPath, 'bn' => $base . $bnPath, 'x-default' => $base . $enPath]
                : [];

            $add($enPath, $lastmod, '0.8', $alternates);
            if ($bnPath) {
                $add($bnPath, $lastmod, '0.7', $alternates);
            }
        }

        // Doctors
        foreach (Doctor::orderBy('rank_order')->get() as $doctor) {
            $add('/doctors/' . $doctor->id, optional($doctor->updated_at)->toAtomString(), '0.7');
        }

        // Medicines (real medicines only — articles live on the blog)
        $postSlugs = Post::whereNotNull('slug')->pluck('slug')->all();
        $medicines = Medicine::active()
            ->when($postSlugs, fn ($q) => $q->whereNotIn('slug', $postSlugs))
            ->orderBy('sort_order')
            ->get();
        foreach ($medicines as $medicine) {
            $slug = $medicine->slug ?: $medicine->id;
            $alternates = [];
            if (trim((string) $medicine->intro_bn) !== '') {
                $alternates = ['en' => $base . '/medicines/' . $slug, 'bn' => $base . '/bn/medicines/' . $slug];
            }
            $add('/medicines/' . $slug, optional($medicine->updated_at)->toAtomString(), '0.7', $alternates);
        }

        // Blog posts: skip trashed and thin/empty ones
        $posts = Post::where(function ($q) {
                $q->whereNull('status')->orWhereIn('status', ['Published', 'published', '1', 1]);
            })
            ->whereNotNull('slug')
            ->orderBy('id')
            ->get();

        foreach ($posts as $post) {
            $plain = trim(strip_tags((string) $post->content));
            if (mb_strlen($plain) < 300) {
                continue;
            }
            $alternates = [];
            if (trim((string) $post->content_bn) !== '') {
                $alternates = ['en' => $base . '/blog/' . $post->slug, 'bn' => $base . '/bn/blog/' . $post->slug];
            }
            $add('/blog/' . $post->slug, optional($post->updated_at)->toAtomString(), '0.7', $alternates);
        }

        // Translated core pages
        $add('/bn/blog', null, '0.7');
        $add('/bn/patient-rights', null, '0.5');
        foreach ($posts as $post) {
            if (trim((string) $post->content_bn) !== '') {
                $add('/bn/blog/' . $post->slug, optional($post->updated_at)->toAtomString(), '0.6');
            }
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' . "\n";
        foreach ($urls as $url) {
            $xml .= "  <url>\n";
            $xml .= '    <loc>' . htmlspecialchars($url['loc'], ENT_XML1) . "</loc>\n";
            if (!empty($url['lastmod'])) {
                $xml .= '    <lastmod>' . htmlspecialchars($url['lastmod'], ENT_XML1) . "</lastmod>\n";
            }
            if (!empty($url['priority'])) {
                $xml .= '    <priority>' . $url['priority'] . "</priority>\n";
            }
            foreach ($url['alternates'] as $lang => $href) {
                $xml .= '    <xhtml:link rel="alternate" hreflang="' . $lang . '" href="' . htmlspecialchars($href, ENT_XML1) . "\"/>\n";
            }
            $xml .= "  </url>\n";
        }
        $xml .= '</urlset>';

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }
}
