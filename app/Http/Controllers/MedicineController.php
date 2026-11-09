<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicineController extends Controller
{
    public function index()
    {
        $data = Medicine::orderBy('sort_order')->get();
        return Inertia::render('Medicines/AdminIndex', ['data' => $data]);
    }

    public function create()
    {
        return Inertia::render('Medicines/AdminEdit', ['item' => null]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateMedicine($request);
        $validated['slug'] = $validated['slug'] ?? \Illuminate\Support\Str::slug($validated['name']);
        Medicine::create($validated);
        return redirect()->route('medicines.admin')->with('success', 'Medicine saved successfully.');
    }

    public function edit($id)
    {
        return Inertia::render('Medicines/AdminEdit', ['item' => Medicine::findOrFail($id)]);
    }

    public function update(Request $request, $id)
    {
        $medicine = Medicine::findOrFail($id);
        $validated = $this->validateMedicine($request);
        $validated['slug'] = $validated['slug'] ?? \Illuminate\Support\Str::slug($validated['name']);
        $medicine->update($validated);
        return redirect()->route('medicines.admin')->with('success', 'Medicine updated successfully.');
    }

    public function destroy($id)
    {
        Medicine::findOrFail($id)->delete();
        return back()->with('success', 'Medicine deleted.');
    }

    private function validateMedicine(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'name_bn' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255',
            'generic' => 'nullable|string',
            'generic_bn' => 'nullable|string',
            'category' => 'nullable|string',
            'tag' => 'nullable|string',
            'tag_bn' => 'nullable|string',
            'image' => 'nullable|string',
            'quick_use' => 'nullable|string',
            'quick_use_bn' => 'nullable|string',
            'pharma' => 'nullable|string',
            'pharma_bn' => 'nullable|string',
            'dosage' => 'nullable|string',
            'dosage_bn' => 'nullable|string',
            'dental_usage' => 'nullable|string',
            'dental_usage_bn' => 'nullable|string',
            'uses_text' => 'nullable|string',
            'uses_text_bn' => 'nullable|string',
            'side_effects' => 'nullable|string',
            'side_effects_bn' => 'nullable|string',
            'subtitle' => 'nullable|string',
            'subtitle_bn' => 'nullable|string',
            'seo_title' => 'nullable|string|max:255',
            'seo_title_bn' => 'nullable|string|max:255',
            'seo_content' => 'nullable|string',
            'seo_content_bn' => 'nullable|string',
            'meta_desc' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'robots_index' => 'nullable|boolean',
            'robots_follow' => 'nullable|boolean',
            'schema_type' => 'nullable|string',
            'schema_json' => 'nullable|string',
            'published_date' => 'nullable|string',
            'intro' => 'nullable|string',
            'intro_bn' => 'nullable|string',
            'uses_items' => 'nullable|array',
            'dosage_admin' => 'nullable|string',
            'dosage_admin_bn' => 'nullable|string',
            'dosage_timing' => 'nullable|string',
            'dosage_timing_bn' => 'nullable|string',
            'verified_badge' => 'nullable|string',
            'verified_badge_bn' => 'nullable|string',
            'side_effects_items' => 'nullable|array',
            'warnings' => 'nullable|array',
            'price_per_tablet' => 'nullable|string',
            'price_per_strip' => 'nullable|string',
            'price_manufacturer' => 'nullable|string',
            'gallery' => 'nullable|array',
            'faqs' => 'nullable|array',
            'author' => 'nullable|array',
            'related' => 'nullable|array',
            'section_titles' => 'nullable|array',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);
    }

    // ---------- Public pages ----------

    public function publicIndex()
    {
        $medicines = Medicine::active()->orderBy('sort_order')->get();
        return Inertia::render('Medicines/PublicIndex', [
            'medicines' => $medicines,
            'locations' => \App\Models\Location::orderBy('sort_order')->get(),
            'nav_menu' => \App\Models\NavMenu::first(),
        ]);
    }

    public function publicShow(Request $request, $slug)
    {
        $item = Medicine::where('slug', $slug)->orWhere('id', $slug)->firstOrFail();
        $related = Medicine::active()->where('id', '!=', $item->id)->orderBy('sort_order')->take(4)->get();

        $isBn = $request->is('bn/*');
        $medSlug = $item->slug ?: $item->id;
        $canonicalUrl = $isBn ? url("bn/medicines/{$medSlug}") : url("medicines/{$medSlug}");
        $hreflang = [
            'en' => url("medicines/{$medSlug}"),
            'bn' => url("bn/medicines/{$medSlug}"),
            'x-default' => url("medicines/{$medSlug}"),
        ];

        return Inertia::render('Medicines/PublicSingle', [
            'item' => $item,
            'related' => $related,
            'locations' => \App\Models\Location::orderBy('sort_order')->get(),
            'nav_menu' => \App\Models\NavMenu::first(),
            'is_bn' => $isBn,
            'canonical_url' => $canonicalUrl,
            'hreflang' => $hreflang,
        ]);
    }
}
