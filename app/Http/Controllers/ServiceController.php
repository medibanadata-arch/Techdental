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

    public function publicIndex()
    {
        $services = Service::where('status', 'Published')->orderBy('rank_order')->get();
        $categories = Service::where('status', 'Published')->whereNotNull('category')->distinct()->pluck('category');
        return Inertia::render('Services/PublicIndex', [
            'services' => $services,
            'categories' => $categories,
            'locations' => \App\Models\Location::orderBy('sort_order')->get(),
            'nav_menu' => \App\Models\NavMenu::first(),
        ]);
    }

    public function publicShow($slug)
    {
        $item = null;
        if (is_numeric($slug)) {
            $item = Service::find($slug);
        }
        if (!$item) {
            $item = Service::where('slug', $slug)->first();
        }
        if (!$item) {
            $item = Service::where('slug', 'like', "%{$slug}%")->first();
        }
        if (!$item) {
            $cleanTerm = str_replace('-', ' ', $slug);
            $item = Service::where('title', 'like', "%{$cleanTerm}%")->first();
        }
        if (!$item) {
            // Graceful fallback to first published service
            $item = Service::where('status', 'Published')->first() ?: Service::firstOrFail();
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
        ]);
    }
}
