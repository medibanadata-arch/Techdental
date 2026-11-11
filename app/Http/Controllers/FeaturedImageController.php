<?php

namespace App\Http\Controllers;

use App\Models\FeaturedImage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeaturedImageController extends Controller
{
    public function index(Request $request)
    {
        $branch = $request->query('branch', 'all');
        $query = FeaturedImage::orderBy('sort_order')->orderBy('id', 'desc');

        if ($branch && $branch !== 'all') {
            if ($branch === 'homepage') {
                $query->where(function ($q) {
                    $q->where('branch', 'homepage')
                      ->orWhereNull('branch')
                      ->orWhere('branch', '');
                });
            } else {
                $branchKey = strtolower(trim(str_ireplace('branch', '', $branch)));
                $query->where(function ($q) use ($branch, $branchKey) {
                    $q->where('branch', $branch)
                      ->orWhere('branch', 'like', "%{$branchKey}%");
                });
            }
        }

        $locations = \App\Models\Location::orderBy('sort_order')->get();

        return Inertia::render('FeaturedImages/Index', [
            'images' => $query->get(),
            'locations' => $locations,
            'selectedBranch' => $branch,
        ]);
    }

    public function incrementRealView($id)
    {
        $image = FeaturedImage::find($id);
        if ($image) {
            $image->increment('real_views');
            return response()->json([
                'success' => true,
                'real_views' => $image->real_views,
            ]);
        }
        return response()->json(['success' => false, 'message' => 'Image not found'], 404);
    }

    public function create(Request $request)
    {
        $branch = $request->query('branch', 'homepage');
        $locations = \App\Models\Location::orderBy('sort_order')->get();
        return Inertia::render('FeaturedImages/Create', [
            'locations' => $locations,
            'defaultBranch' => $branch,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string',
            'src' => 'required|string',
            'badge' => 'nullable|string',
            'branch' => 'required|string',
            'alt' => 'nullable|string',
            'type' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'view_count' => 'nullable',
        ]);

        if (empty($validated['badge'])) {
            $validated['badge'] = $validated['branch'] === 'homepage' ? 'Homepage' : ucfirst($validated['branch']);
        }
        if (empty($validated['sort_order'])) {
            $validated['sort_order'] = FeaturedImage::count() + 1;
        }

        if (isset($validated['view_count'])) {
            $validated['view_count'] = (int) preg_replace('/[^\d]/', '', (string)$validated['view_count']);
        } else {
            $validated['view_count'] = 1000;
        }

        $validated['real_views'] = 0;

        FeaturedImage::create($validated);

        return redirect()->route('featured-images.index', ['branch' => $validated['branch']])
            ->with('success', 'Slider image added successfully');
    }

    public function edit($id)
    {
        $image = FeaturedImage::findOrFail($id);
        $locations = \App\Models\Location::orderBy('sort_order')->get();
        return Inertia::render('FeaturedImages/Edit', [
            'image' => $image,
            'locations' => $locations,
        ]);
    }

    public function update(Request $request, $id)
    {
        $image = FeaturedImage::findOrFail($id);

        $validated = $request->validate([
            'title' => 'nullable|string',
            'src' => 'required|string',
            'badge' => 'nullable|string',
            'branch' => 'required|string',
            'alt' => 'nullable|string',
            'type' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'view_count' => 'nullable',
        ]);

        if (isset($validated['view_count'])) {
            $validated['view_count'] = (int) preg_replace('/[^\d]/', '', (string)$validated['view_count']);
        }

        if (empty($validated['badge'])) {
            $validated['badge'] = $validated['branch'] === 'homepage' ? 'Homepage' : ucfirst($validated['branch']);
        }

        $image->update($validated);

        return redirect()->route('featured-images.index', ['branch' => $validated['branch']])
            ->with('success', 'Slider image updated successfully');
    }

    public function destroy($id)
    {
        $image = FeaturedImage::findOrFail($id);
        $image->delete();

        return redirect()->route('featured-images.index')->with('success', 'Featured image deleted successfully');
    }

    public function reorder(Request $request)
    {
        $items = $request->input('items', []);
        foreach ($items as $item) {
            if (isset($item['id'], $item['sort_order'])) {
                FeaturedImage::whereKey($item['id'])->update(['sort_order' => (int) $item['sort_order']]);
            }
        }
        return back()->with('success', 'Slider order updated.');
    }
}
