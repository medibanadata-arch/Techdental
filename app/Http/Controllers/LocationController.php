<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationController extends Controller
{
    public function index()
    {
        return redirect()->route('branch.admin');
    }

    public function create()
    {
        return Inertia::render('Locations/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'location_id' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'nullable|string|max:255',
            'map_url' => 'nullable|string',
            'review_url' => 'nullable|string',
            'whatsapp' => 'nullable|string|max:255',
            'booking_url' => 'nullable|string|max:255',
            'call_label' => 'nullable|string|max:255',
            'directions_label' => 'nullable|string|max:255',
            'whatsapp_label' => 'nullable|string|max:255',
            'book_label' => 'nullable|string|max:255',
            'appointment_btn_label' => 'nullable|string|max:255',
            'more_about_title' => 'nullable|string|max:255',
        ]);

        if (empty($validated['short_name'])) {
            $validated['short_name'] = $validated['name'];
        }

        Location::create($validated);
        return redirect()->route('locations.index')->with('success', 'Location created successfully.');
    }

    public function show($id)
    {
        $item = Location::findOrFail($id);
        return Inertia::render('Locations/Show', ['item' => $item]);
    }

    public function edit(Location $location)
    {
        return Inertia::render('Locations/Edit', ['location' => $location]);
    }

    public function update(Request $request, Location $location)
    {
        $validated = $request->validate([
            'location_id' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'nullable|string|max:255',
            'map_url' => 'nullable|string',
            'review_url' => 'nullable|string',
            'whatsapp' => 'nullable|string|max:255',
            'booking_url' => 'nullable|string|max:255',
            'call_label' => 'nullable|string|max:255',
            'directions_label' => 'nullable|string|max:255',
            'whatsapp_label' => 'nullable|string|max:255',
            'book_label' => 'nullable|string|max:255',
            'appointment_btn_label' => 'nullable|string|max:255',
            'more_about_title' => 'nullable|string|max:255',
        ]);

        if (empty($validated['short_name'])) {
            $validated['short_name'] = $validated['name'];
        }

        $location->update($validated);
        return redirect()->route('locations.index')->with('success', 'Location & Quick Action Buttons updated successfully.');
    }

    public function destroy(Location $location)
    {
        $location->delete();
        return redirect()->route('locations.index')->with('success', 'Location deleted successfully.');
    }
}
