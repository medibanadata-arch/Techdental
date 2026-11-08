<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\FeaturedImage;
use App\Models\Location;
use Inertia\Inertia;

class BranchController extends Controller
{
    /** Public branch page — /branch/{slug} */
    public function publicShow($slug)
    {
        $cleanSlug = str_replace(['branch-', '-branch', 'branch'], '', strtolower($slug));
        $cleanSlug = trim($cleanSlug, '- ');

        $branch = Location::where('slug', $slug)
            ->orWhere('slug', $cleanSlug)
            ->orWhere('short_name', $slug)
            ->orWhere('short_name', 'like', "%{$cleanSlug}%")
            ->orWhere('name', 'like', "%{$cleanSlug}%")
            ->orWhere('id', $slug)
            ->firstOrFail();

        $branchKey = strtolower(trim(str_ireplace(['branch', '-'], ['', ''], $branch->slug ?? $branch->short_name ?? $branch->name)));

        $gallery = FeaturedImage::where('is_active', true)
            ->where(function ($q) use ($branch, $branchKey) {
                $q->where('branch', $branch->short_name)
                  ->orWhere('branch', $branch->name)
                  ->orWhere('branch', $branch->slug)
                  ->orWhere('branch', 'like', "%{$branchKey}%")
                  ->orWhere('branch', 'all');
            })
            ->orderBy('sort_order')
            ->get();

        $doctors = Doctor::where('branch', 'LIKE', '%' . ($branch->short_name ?? $branch->name) . '%')
            ->orWhere('branch_location', ($branch->short_name ?? $branch->name))
            ->orderBy('rank_order')
            ->get();

        if ($doctors->isEmpty()) {
            $doctors = Doctor::orderBy('rank_order')->take(6)->get();
        }

        $services = \DB::table('pricing')->get();

        return Inertia::render('Branch/PublicShow', [
            'branch' => $branch,
            'gallery' => $gallery,
            'doctors' => $doctors,
            'services' => $services,
            'locations' => \App\Models\Location::orderBy('sort_order')->get(),
            'nav_menu' => \App\Models\NavMenu::first(),
        ]);
    }

    /** Public branch list — /branches */
    public function publicIndex()
    {
        $branches = Location::orderBy('sort_order')->get();
        return Inertia::render('Branch/PublicIndex', [
            'branches' => $branches,
            'nav_menu' => \App\Models\NavMenu::first(),
        ]);
    }

    /** Admin branch dashboard — /branch-admin */
    public function adminIndex()
    {
        $branches = Location::orderBy('sort_order')->get();
        $doctors = Doctor::orderBy('rank_order')->get();
        $services = \DB::table('pricing')->get();
        $gallery = FeaturedImage::orderBy('sort_order')->get();

        return Inertia::render('Branch/AdminIndex', [
            'branches' => $branches,
            'doctors' => $doctors,
            'services' => $services,
            'gallery' => $gallery,
        ]);
    }

    /** Create new branch — POST /branch-admin */
    public function adminStore(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'address_main' => 'nullable|string',
            'address_sub' => 'nullable|string',
            'landmark' => 'nullable|string',
            'phone' => 'nullable|string',
            'whatsapp' => 'nullable|string',
            'hours_text' => 'nullable|string',
            'morning_hours' => 'nullable|string',
            'evening_hours' => 'nullable|string',
            'working_days' => 'nullable|string',
            'off_days' => 'nullable|string',
        ]);

        $validated['location_id'] = \Illuminate\Support\Str::slug($validated['name']);
        $validated['short_name'] = $validated['name'];
        $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']);
        $validated['call_label'] = 'Call';
        $validated['directions_label'] = 'Directions';
        $validated['whatsapp_label'] = 'WhatsApp';
        $validated['book_label'] = 'Book';

        Location::create($validated);
        return back()->with('success', 'New branch created successfully!');
    }

    /** Delete branch — DELETE /branch-admin/{id} */
    public function adminDestroy($id)
    {
        $branch = Location::findOrFail($id);
        $branch->delete();
        return redirect()->route('branch.admin')->with('success', 'Branch removed successfully!');
    }

    /** Update branch info — PUT /branch-admin/{id} */
    public function adminUpdate(\Illuminate\Http\Request $request, $id)
    {
        $branch = Location::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'address_main' => 'nullable|string',
            'address_sub' => 'nullable|string',
            'landmark' => 'nullable|string',
            'phone' => 'nullable|string',
            'whatsapp' => 'nullable|string',
            'hours_text' => 'nullable|string',
            'morning_hours' => 'nullable|string',
            'evening_hours' => 'nullable|string',
            'working_days' => 'nullable|string',
            'off_days' => 'nullable|string',
            'map_url' => 'nullable|string',
            'review_url' => 'nullable|string',
            'reviews_text' => 'nullable|string',
            'booking_url' => 'nullable|string',
            'call_label' => 'nullable|string',
            'directions_label' => 'nullable|string',
            'whatsapp_label' => 'nullable|string',
            'book_label' => 'nullable|string',
            'appointment_btn_label' => 'nullable|string',
            'more_about_title' => 'nullable|string',
            'slug' => 'nullable|string',
            'seo_title' => 'nullable|string',
            'meta_desc' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'robots_index' => 'nullable|boolean',
            'robots_follow' => 'nullable|boolean',
            'schema_type' => 'nullable|string',
            'schema_json' => 'nullable|string',
            'faqs' => 'nullable|array',
            'seo_content' => 'nullable|string',
        ]);

        $branch->update($validated);
        return back()->with('success', 'Branch details updated successfully!');
    }
}
