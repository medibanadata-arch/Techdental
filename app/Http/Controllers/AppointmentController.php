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
            'patient_name' => 'required_without:name|nullable|string|max:191',
            'name' => 'required_without:patient_name|nullable|string|max:191',
            'phone' => 'required|string|max:32',
            'branch' => 'required|string|max:191',
            'service' => 'required_without:service_or_doctor|nullable|string|max:191',
            'service_or_doctor' => 'required_without:service|nullable|string|max:191',
            'date' => 'required_without:preferred_date|nullable|string|max:64',
            'preferred_date' => 'required_without:date|nullable|string|max:64',
            'preferred_time' => 'required|string|max:64',
            'address' => 'required|string|max:500',
            'notes' => 'nullable|string',
        ], [
            'patient_name.required_without' => 'রোগীর নাম লিখুন।',
            'name.required_without' => 'রোগীর নাম লিখুন।',
            'phone.required' => 'মোবাইল নম্বর লিখুন।',
            'branch.required' => 'শাখা নির্বাচন করুন।',
            'service.required_without' => 'ট্রিটমেন্ট নির্বাচন করুন।',
            'service_or_doctor.required_without' => 'ট্রিটমেন্ট নির্বাচন করুন।',
            'date.required_without' => 'তারিখ নির্বাচন করুন।',
            'preferred_date.required_without' => 'তারিখ নির্বাচন করুন।',
            'preferred_time.required' => 'সময় নির্বাচন করুন।',
            'address.required' => 'ঠিকানা লিখুন।',
        ]);

        $name = $validated['patient_name'] ?? $validated['name'];
        $service = $validated['service_or_doctor'] ?? $validated['service'];
        $date = $validated['preferred_date'] ?? $validated['date'];
        $time = $validated['preferred_time'];
        $address = $validated['address'];
        $branch = $validated['branch'];

        $meta = 'Branch: ' . $branch . '. Time: ' . $time;
        if (!empty($validated['notes'])) {
            $meta .= '. ' . $validated['notes'];
        }

        $appointment = Appointment::create([
            'name' => $name,
            'phone' => $validated['phone'],
            'service' => $service,
            'date' => $date,
            'preferred_time' => $time,
            'address' => $address,
            'status' => 'Pending',
            'notes' => $meta,
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
