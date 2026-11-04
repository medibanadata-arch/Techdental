<?php

namespace App\Http\Controllers;

use App\Models\Redirect;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RedirectController extends Controller
{
    public function index(Request $request)
    {
        $query = Redirect::latest();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('source_url', 'like', "%{$search}%")
                  ->orWhere('target_url', 'like', "%{$search}%");
            });
        }

        $redirects = $query->paginate(20)->withQueryString();

        return Inertia::render('Redirects/Index', [
            'redirects' => $redirects,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'source_url' => 'required|string|max:500',
            'target_url' => 'required|string|max:500',
            'status_code' => 'required|integer|in:301,302',
            'is_active' => 'boolean',
        ]);

        // Normalize source url: ensure leading slash if path
        if (!str_starts_with($validated['source_url'], 'http://') && !str_starts_with($validated['source_url'], 'https://')) {
            $validated['source_url'] = '/' . ltrim($validated['source_url'], '/');
        }

        Redirect::create($validated);

        return redirect()->route('redirects.index')->with('success', 'URL redirect rule added successfully.');
    }

    public function update(Request $request, $id)
    {
        $redirect = Redirect::findOrFail($id);

        $validated = $request->validate([
            'source_url' => 'required|string|max:500',
            'target_url' => 'required|string|max:500',
            'status_code' => 'required|integer|in:301,302',
            'is_active' => 'boolean',
        ]);

        if (!str_starts_with($validated['source_url'], 'http://') && !str_starts_with($validated['source_url'], 'https://')) {
            $validated['source_url'] = '/' . ltrim($validated['source_url'], '/');
        }

        $redirect->update($validated);

        return redirect()->route('redirects.index')->with('success', 'Redirect rule updated successfully.');
    }

    public function destroy($id)
    {
        $redirect = Redirect::findOrFail($id);
        $redirect->delete();

        return redirect()->route('redirects.index')->with('success', 'Redirect rule deleted.');
    }

    public function toggle($id)
    {
        $redirect = Redirect::findOrFail($id);
        $redirect->is_active = !$redirect->is_active;
        $redirect->save();

        return redirect()->back()->with('success', 'Redirect status updated.');
    }
}
