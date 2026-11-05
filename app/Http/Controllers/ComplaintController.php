<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\Models\Location;
use App\Models\NavMenu;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ComplaintController extends Controller
{
    /**
     * Show the public complaint / feedback submission page
     */
    public function publicShow()
    {
        return Inertia::render('Complaints/PublicShow', [
            'locations' => Location::orderBy('sort_order')->get(),
            'nav_menu' => NavMenu::first(),
        ]);
    }

    /**
     * Store new submitted complaint
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fullName' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'visitDate' => 'required|string|max:50',
            'branch' => 'nullable|string|max:100',
            'category' => 'required|string|max:255',
            'details' => 'required|string',
        ]);

        Complaint::create([
            'full_name' => $validated['fullName'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'visit_date' => $validated['visitDate'],
            'branch' => $validated['branch'] ?? null,
            'category' => $validated['category'],
            'details' => $validated['details'],
            'status' => 'pending',
        ]);

        return back()->with('success', 'Your report has been submitted successfully.');
    }

    /**
     * Admin view for complaints
     */
    public function adminIndex(Request $request)
    {
        $complaints = Complaint::orderBy('created_at', 'desc')->get();

        return Inertia::render('Complaints/AdminIndex', [
            'complaints' => $complaints,
        ]);
    }

    /**
     * Update complaint status & admin notes
     */
    public function updateStatus(Request $request, $id)
    {
        $complaint = Complaint::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:pending,under_review,resolved,dismissed',
            'admin_notes' => 'nullable|string',
        ]);

        $complaint->update($validated);

        return back()->with('success', 'Complaint updated successfully.');
    }

    /**
     * Delete complaint
     */
    public function destroy($id)
    {
        $complaint = Complaint::findOrFail($id);
        $complaint->delete();

        return back()->with('success', 'Complaint deleted successfully.');
    }
}
