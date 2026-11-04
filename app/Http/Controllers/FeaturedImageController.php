<?php

namespace App\Http\Controllers;

use App\Models\FeaturedImage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeaturedImageController extends Controller
{
    public function index()
    {
        return redirect()->route('homepage.admin');
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

    public function create()
    {
        return Inertia::render('FeaturedImages/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string',
            'src' => 'required|string',
            'badge' => 'nullable|string',
            'branch' => 'nullable|string',
            'alt' => 'nullable|string',
            'type' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'view_count' => 'nullable',
        ]);

        if (empty($validated['branch']) && !empty($validated['badge'])) {
            $validated['branch'] = $validated['badge'];
        }
        if (empty($validated['badge']) && !empty($validated['branch'])) {
            $validated['badge'] = $validated['branch'];
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

        return redirect()->route('featured-images.index')->with('success', 'Featured image added successfully');
    }

    public function edit($id)
    {
        $image = FeaturedImage::findOrFail($id);
        return Inertia::render('FeaturedImages/Edit', ['image' => $image]);
    }

    public function update(Request $request, $id)
    {
        $image = FeaturedImage::findOrFail($id);

        $validated = $request->validate([
            'title' => 'nullable|string',
            'src' => 'required|string',
            'badge' => 'nullable|string',
            'branch' => 'nullable|string',
            'alt' => 'nullable|string',
            'type' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'view_count' => 'nullable',
        ]);

        if (isset($validated['view_count'])) {
            $validated['view_count'] = (int) preg_replace('/[^\d]/', '', (string)$validated['view_count']);
        }

        if (empty($validated['branch']) && !empty($validated['badge'])) {
            $validated['branch'] = $validated['badge'];
        }
        if (empty($validated['badge']) && !empty($validated['branch'])) {
            $validated['badge'] = $validated['branch'];
        }

        $image->update($validated);

        return redirect()->route('featured-images.index')->with('success', 'Featured image updated successfully');
    }

    public function destroy($id)
    {
        $image = FeaturedImage::findOrFail($id);
        $image->delete();

        return redirect()->route('featured-images.index')->with('success', 'Featured image deleted successfully');
    }
}
