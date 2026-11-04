<?php

namespace App\Http\Controllers;

use App\Models\Pricing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PricingController extends Controller
{
    public function index()
    {
        $data = Pricing::latest()->get();
        return Inertia::render('Pricing/Index', ['data' => $data]);
    }

    public function create()
    {
        return Inertia::render('Pricing/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'desc' => 'required|string',
            'price' => 'required|numeric',
        ]);

        $validated['name'] = $validated['title'];

        Pricing::create($validated);
        return redirect()->route('pricing.index')->with('success', 'Pricing added successfully.');
    }

    public function show($id)
    {
        $item = Pricing::findOrFail($id);
        return Inertia::render('Pricing/Show', ['item' => $item]);
    }

    public function edit(Pricing $pricing)
    {
        return Inertia::render('Pricing/Edit', ['pricing' => $pricing]);
    }

    public function update(Request $request, Pricing $pricing)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'desc' => 'required|string',
            'price' => 'required|numeric',
        ]);

        $validated['name'] = $validated['title'];

        $pricing->update($validated);
        return redirect()->route('pricing.index')->with('success', 'Pricing updated successfully.');
    }

    public function destroy(Pricing $pricing)
    {
        $pricing->delete();
        return redirect()->route('pricing.index')->with('success', 'Pricing deleted successfully.');
    }
}
