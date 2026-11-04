<?php

namespace App\Http\Controllers;

use App\Models\PriceCategory;
use App\Models\PriceRow;
use App\Models\PriceSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PriceListController extends Controller
{
    // ---------- Public page ----------

    public function publicShow()
    {
        $settings = PriceSetting::first();
        if (!$settings) {
            $settings = PriceSetting::create([]);
        }
        $categories = PriceCategory::with('rows')->orderBy('sort_order')->get();
        return Inertia::render('PriceList/PublicIndex', [
            'categories' => $categories,
            'settings' => $settings,
            'locations' => \App\Models\Location::orderBy('sort_order')->get(),
            'nav_menu' => \App\Models\NavMenu::first(),
        ]);
    }

    // ---------- Admin ----------

    public function adminIndex()
    {
        $settings = PriceSetting::first();
        if (!$settings) {
            $settings = PriceSetting::create([]);
        }
        $categories = PriceCategory::with('rows')->orderBy('sort_order')->get();
        return Inertia::render('PriceList/AdminIndex', ['categories' => $categories, 'settings' => $settings]);
    }

    /** Save the entire tree (categories + rows + seo + pageTitle) — matches the design's state-save model */
    public function save(Request $request)
    {
        $payload = $request->validate([
            'pageTitle' => 'nullable|string',
            'seo.sectionTitle' => 'nullable|string|max:255',
            'seo.content' => 'nullable|string',
            'meta_desc' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'robots_index' => 'nullable|boolean',
            'robots_follow' => 'nullable|boolean',
            'schema_type' => 'nullable|string',
            'schema_json' => 'nullable|string',
            'faqs' => 'nullable|array',
            'categories' => 'nullable|array',
        ]);

        $settings = PriceSetting::first();
        if (!$settings) {
            $settings = PriceSetting::create([]);
        }
        $settings->update([
            'page_title' => $payload['pageTitle'] ?? $settings->page_title,
            'seo_title' => $payload['seo']['sectionTitle'] ?? $settings->seo_title,
            'seo_content' => $payload['seo']['content'] ?? $settings->seo_content,
            'meta_desc' => $payload['meta_desc'] ?? $settings->meta_desc,
            'canonical_url' => $payload['canonical_url'] ?? $settings->canonical_url,
            'robots_index' => $request->has('robots_index') ? $request->boolean('robots_index') : $settings->robots_index,
            'robots_follow' => $request->has('robots_follow') ? $request->boolean('robots_follow') : $settings->robots_follow,
            'schema_type' => $payload['schema_type'] ?? $settings->schema_type,
            'schema_json' => $payload['schema_json'] ?? $settings->schema_json,
            'faqs' => $payload['faqs'] ?? $settings->faqs,
        ]);

        if (isset($payload['categories']) && is_array($payload['categories']) && count($payload['categories']) > 0) {
            DB::transaction(function () use ($payload) {
                // Simple resync: delete missing, update existing, create new
                $incomingIds = collect($payload['categories'])->pluck('id')->filter(fn($id) => is_numeric($id) && $id > 0)->all();
                if (!empty($incomingIds)) {
                    PriceCategory::whereNotIn('id', $incomingIds)->delete();
                }

                foreach (collect($payload['categories'])->values() as $i => $catData) {
                    $categoryId = $catData['id'] ?? null;
                    if ($categoryId && is_numeric($categoryId)) {
                        $category = PriceCategory::find($categoryId);
                        if (!$category) {
                            $category = PriceCategory::create(['name' => $catData['name'] ?? 'New Category', 'sort_order' => $i]);
                        }
                    } else {
                        $category = PriceCategory::create(['name' => $catData['name'] ?? 'New Category', 'sort_order' => $i]);
                    }
                    $category->update(['name' => $catData['name'] ?? $category->name, 'sort_order' => $i]);

                    $incomingRowIds = collect($catData['treatments'] ?? [])->pluck('id')->filter(fn($id) => is_numeric($id) && $id > 0)->all();
                    if (!empty($incomingRowIds)) {
                        PriceRow::where('category_id', $category->id)->whereNotIn('id', $incomingRowIds)->delete();
                    }

                    foreach (collect($catData['treatments'] ?? [])->values() as $j => $rowData) {
                        if (!empty($rowData['id']) && is_numeric($rowData['id'])) {
                            $row = PriceRow::find($rowData['id']);
                            if ($row && $row->category_id == $category->id) {
                                $row->update([
                                    'service_name' => $rowData['name'] ?? '',
                                    'price_bdt' => $rowData['bdt'] ?? null,
                                    'price_usd' => $rowData['usd'] ?? null,
                                    'sort_order' => $j,
                                ]);
                                continue;
                            }
                        }
                        PriceRow::create([
                            'category_id' => $category->id,
                            'service_name' => $rowData['name'] ?? '',
                            'price_bdt' => $rowData['bdt'] ?? null,
                            'price_usd' => $rowData['usd'] ?? null,
                            'sort_order' => $j,
                        ]);
                    }
                }
            });
        }

        return redirect()->back()->with('success', 'Price list saved successfully!');
    }
}
