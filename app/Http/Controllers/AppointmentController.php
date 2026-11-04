<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    public function index()
    {
        if (! auth()->check()) {
            return redirect('/appointment');
        }

        $appointments = Appointment::latest()->get();
        return Inertia::render('Appointments/Index', ['appointments' => $appointments]);
    }

    /** Public booking page — /appointment */
    public function publicBook()
    {
        return Inertia::render('BookAppointment/PublicIndex', [
            'locations' => \App\Models\Location::orderBy('sort_order')->get(),
            'nav_menu' => \App\Models\NavMenu::first(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_name' => 'nullable|string',
            'name' => 'nullable|string',
            'phone' => 'required|string',
            'branch' => 'nullable|string',
            'service' => 'nullable|string',
            'service_or_doctor' => 'nullable|string',
            'date' => 'nullable|string',
            'preferred_date' => 'nullable|string',
            'preferred_time' => 'nullable|string',
            'address' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $name = $validated['patient_name'] ?? $validated['name'] ?? 'Patient';
        $service = $validated['service_or_doctor'] ?? $validated['service'] ?? 'General Consultation';
        $date = $validated['preferred_date'] ?? $validated['date'] ?? now()->addDay()->toDateString();
        $time = $validated['preferred_time'] ?? null;
        $address = $validated['address'] ?? null;
        $branch = $validated['branch'] ?? null;
        $notes = $validated['notes'] ?? ((($branch ? 'Branch: ' . $branch . '. ' : '') . ($time ? 'Time: ' . $time : '')) ?: null);

        $appointment = Appointment::create([
            'name' => $name,
            'phone' => $validated['phone'],
            'service' => $service,
            'date' => $date,
            'preferred_time' => $time,
            'address' => $address,
            'status' => 'Pending',
            'notes' => $notes,
        ]);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'id' => $appointment->id, 'message' => 'Appointment booked successfully']);
        }

        return redirect()->back()->with('success', 'Appointment saved successfully');
    }

    public function update(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);

        $validated = $request->validate([
            'status' => 'nullable|string',
            'notes' => 'nullable|string',
            'date' => 'nullable|string',
            'service' => 'nullable|string',
        ]);

        $appointment->update(array_filter($validated));

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'message' => 'Appointment updated']);
        }

        return redirect()->back()->with('success', 'Appointment updated successfully');
    }

    public function destroy($id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->delete();

        return redirect()->back()->with('success', 'Appointment deleted successfully');
    }
}
