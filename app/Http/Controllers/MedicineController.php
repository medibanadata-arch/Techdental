<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicineController extends Controller
{
    public function index()
    {
        // The Medicines list must only contain real medicines. Older imports also
        // put blog articles/guides in this table; those are managed under
        // Blog > Others as posts, so hide the duplicates here.
        $postSlugs = \App\Models\Post::whereNotNull('slug')->pluck('slug')->all();

        $data = Medicine::orderBy('sort_order')
            ->when($postSlugs, fn ($q) => $q->whereNotIn('slug', $postSlugs))
            ->get();

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

    public function reorder(Request $request)
    {
        $items = $request->input('items', []);
        foreach ($items as $item) {
            if (isset($item['id'], $item['sort_order'])) {
                Medicine::whereKey($item['id'])->update(['sort_order' => (int) $item['sort_order']]);
            }
        }
        return back()->with('success', 'Medicine order updated.');
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

    public function publicIndex(Request $request)
    {
        $postSlugs = \App\Models\Post::whereNotNull('slug')->pluck('slug')->all();
        $medicines = Medicine::active()
            ->when($postSlugs, fn ($q) => $q->whereNotIn('slug', $postSlugs))
            ->orderBy('sort_order')->get();
        return Inertia::render('Medicines/PublicIndex', [
            'medicines' => $medicines,
            'locations' => \App\Models\Location::orderBy('sort_order')->get(),
            'nav_menu' => \App\Models\NavMenu::first(),
            'is_bn' => $request->is('bn/*'),
        ]);
    }

    public function publicShow(Request $request, $slug)
    {
        $isBn = $request->is('bn/*');

        // Blog articles that were imported into the medicines table must not appear as
        // duplicate medicine pages — send them to their real blog URL instead.
        $post = \App\Models\Post::where('slug', $slug)->first();
        if ($post) {
            $toBn = $isBn && trim((string) $post->content_bn) !== '';
            return redirect(($toBn ? '/bn/blog/' : '/blog/') . $slug, 301);
        }

        $item = Medicine::where('slug', $slug)->orWhere('id', $slug)->firstOrFail();

        // Deactivated duplicates stay in the database for history but must not
        // render. Send visitors to the canonical medicine when one is set.
        if (!$item->is_active) {
            $canonical = (string) $item->canonical_url;
            $path = $canonical !== '' ? parse_url($canonical, PHP_URL_PATH) : null;

            if ($path && $path !== "/medicines/{$item->slug}" && $path !== "/bn/medicines/{$item->slug}") {
                $target = $isBn && str_starts_with($path, '/medicines/') ? '/bn' . $path : $path;

                return redirect($target, 301);
            }

            return redirect('/medicines', 301);
        }

        $postSlugs = \App\Models\Post::whereNotNull('slug')->pluck('slug')->all();
        $related = Medicine::active()
            ->where('id', '!=', $item->id)
            ->when($postSlugs, fn ($q) => $q->whereNotIn('slug', $postSlugs))
            ->orderBy('sort_order')->take(4)->get();

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
