<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {
        $data = Service::orderBy('rank_order')->get();
        return Inertia::render('Services/AdminIndex', ['data' => $data]);
    }

    public function create()
    {
        return Inertia::render('Services/AdminEdit', ['item' => null]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateService($request);
        $validated['slug'] = $validated['slug'] ?? \Illuminate\Support\Str::slug($validated['title']);
        $validated['pricing_cards'] = $request->input('pricing_cards', []);
        $validated['features'] = $request->input('features', []);
        $validated['faqs'] = $request->input('faqs', []);
        $validated['seo_images'] = $request->input('seo_images', []);
        $validated['hero_thumbs'] = $request->input('hero_thumbs', []);
        Service::create($validated);
        return redirect()->route('services.admin')->with('success', 'Service created successfully.');
    }

    public function edit($id)
    {
        return Inertia::render('Services/AdminEdit', ['item' => Service::findOrFail($id)]);
    }

    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);
        $validated = $this->validateService($request);
        $validated['slug'] = $validated['slug'] ?? \Illuminate\Support\Str::slug($validated['title']);
        $validated['pricing_cards'] = $request->input('pricing_cards', []);
        $validated['features'] = $request->input('features', []);
        $validated['faqs'] = $request->input('faqs', []);
        $validated['seo_images'] = $request->input('seo_images', []);
        $validated['hero_thumbs'] = $request->input('hero_thumbs', []);
        $service->update($validated);
        return redirect()->route('services.admin')->with('success', 'Service updated successfully.');
    }

    public function destroy($id)
    {
        Service::findOrFail($id)->delete();
        return back()->with('success', 'Service deleted.');
    }

    public function reorder(Request $request)
    {
        $items = $request->input('items', []);
        foreach ($items as $item) {
            if (isset($item['id'], $item['rank_order'])) {
                Service::whereKey($item['id'])->update(['rank_order' => (int) $item['rank_order']]);
            }
        }
        return back()->with('success', 'Service ranking updated.');
    }

    private function validateService(Request $request): array
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255',
            'price' => 'nullable|string',
            'price_suffix' => 'nullable|string',
            'short_desc' => 'nullable|string',
            'hero_main' => 'nullable|string',
            'hero_thumbs' => 'nullable|array',
            'features' => 'nullable|array',
            'pricing_cards' => 'nullable|array',
            'results' => 'nullable|array',
            'details_heading' => 'nullable|string',
            'details_html' => 'nullable|string',
            'seo_images' => 'nullable|array',
            'faqs' => 'nullable|array',
            'reviews' => 'nullable|array',
            'seo_title' => 'nullable|string|max:255',
            'meta_desc' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'robots_index' => 'nullable|boolean',
            'robots_follow' => 'nullable|boolean',
            'schema_type' => 'nullable|string',
            'schema_json' => 'nullable|string',
            'rank_order' => 'nullable|integer',
            'status' => 'nullable|string|max:50',
        ]);
    }

    // ---------- Public pages ----------

    public function publicIndex(Request $request)
    {
        $isBn = $request->is('bn/*');
        $services = Service::where('status', 'Published')->orderBy('rank_order')->get();
        $categories = Service::where('status', 'Published')->whereNotNull('category')->distinct()->pluck('category');
        return Inertia::render('Services/PublicIndex', [
            'services' => $services,
            'categories' => $categories,
            'locations' => \App\Models\Location::orderBy('sort_order')->get(),
            'nav_menu' => \App\Models\NavMenu::first(),
            'is_bn' => $isBn,
        ]);
    }

    /**
     * Resolve a service by its English or Bangla slug, including slugs that
     * existed before the URL structure was aligned with the old sitemap.
     */
    private function resolveService(string $slug, bool $isBn): ?Service
    {
        if (is_numeric($slug)) {
            return Service::find($slug);
        }

        if ($isBn) {
            $item = Service::where('slug_bn', $slug)->first();
            if ($item) {
                return $item;
            }
            // Allow an English slug on a /bn/ URL and redirect to the Bangla one.
            return Service::where('slug', $slug)->first();
        }

        $item = Service::where('slug', $slug)->first();
        if ($item) {
            return $item;
        }

        foreach (Service::whereNotNull('slug_legacy')->get() as $service) {
            $legacy = json_decode((string) $service->slug_legacy, true) ?: [];
            if (in_array($slug, $legacy, true)) {
                return $service;
            }
        }

        return null;
    }

    public function publicShow(Request $request, $slug)
    {
        $isBn = $request->is('bn/*');
        $item = $this->resolveService((string) $slug, $isBn);

        if (!$item || ($isBn && trim((string) $item->details_html_bn) === '')) {
            abort(404);
        }

        $canonicalSlug = $isBn ? ($item->slug_bn ?: $item->slug) : $item->slug;
        $prefix = $isBn ? '/bn/service/' : '/service/';

        if ((string) $slug !== (string) $canonicalSlug) {
            return redirect($prefix . $canonicalSlug, 301);
        }

        $doctors = \App\Models\Doctor::orderBy('rank_order')->get();
        $locations = \App\Models\Location::orderBy('sort_order')->get();
        $related = Service::where('status', 'Published')->where('id', '!=', $item->id)->orderBy('rank_order')->take(4)->get();
        return Inertia::render('Services/PublicSingle', [
            'item' => $item,
            'doctors' => $doctors,
            'locations' => $locations,
            'related' => $related,
            'nav_menu' => \App\Models\NavMenu::first(),
            'is_bn' => $isBn,
            'language_urls' => [
                'en' => '/service/' . $item->slug,
                'bn' => $item->slug_bn ? '/bn/service/' . $item->slug_bn : null,
            ],
        ]);
    }

    /** 301 old /services/{slug} URLs to the sitemap-aligned /service/{slug}. */
    public function legacyShow($slug)
    {
        $item = $this->resolveService((string) $slug, false);
        if (!$item) {
            abort(404);
        }
        return redirect('/service/' . $item->slug, 301);
    }

    /** 301 old /bn/services/{slug} URLs to /bn/service/{slug}. */
    public function legacyShowBn($slug)
    {
        $item = $this->resolveService((string) $slug, true);
        if (!$item || trim((string) $item->details_html_bn) === '') {
            abort(404);
        }
        return redirect('/bn/service/' . ($item->slug_bn ?: $item->slug), 301);
    }
}
