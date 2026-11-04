<?php

namespace App\Http\Controllers;

use App\Models\TeamMember;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamMemberController extends Controller
{
    public function index()
    {
        $data = TeamMember::orderBy('sort_order')->get();
        return Inertia::render('Team/AdminIndex', ['data' => $data]);
    }

    public function create()
    {
        return Inertia::render('Team/AdminEdit', [
            'item' => null,
            'defaultSection' => request('section', 'management'),
        ]);
    }

    public function edit($id)
    {
        $member = TeamMember::findOrFail($id);
        return Inertia::render('Team/AdminEdit', [
            'item' => $member,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateMember($request);
        if (!array_key_exists('is_active', $validated)) {
            $validated['is_active'] = $request->boolean('is_active', true);
        }
        TeamMember::create($validated);
        return redirect()->route('team.admin')->with('success', 'Member added successfully.');
    }

    public function update(Request $request, $id)
    {
        $member = TeamMember::findOrFail($id);
        $validated = $this->validateMember($request);
        if (!array_key_exists('is_active', $validated)) {
            $validated['is_active'] = $request->boolean('is_active', true);
        }
        $member->update($validated);
        return redirect()->route('team.admin')->with('success', 'Member updated successfully.');
    }

    public function toggleActive($id)
    {
        $member = TeamMember::findOrFail($id);
        $member->update(['is_active' => !$member->is_active]);
        return back()->with('success', 'Status updated successfully.');
    }

    public function destroy($id)
    {
        TeamMember::findOrFail($id)->delete();
        return back()->with('success', 'Member deleted.');
    }

    private function validateMember(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'section' => 'required|string|in:management,ceo_assistant,digital_marketing,call_center',
            'image' => 'nullable|string',
            'quote' => 'nullable|string',
            'letter' => 'nullable|array',
            'photo_alt' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);
    }

    // ---------- Public pages ----------

    public function publicIndex()
    {
        $members = TeamMember::active()->orderBy('sort_order')->get();
        return Inertia::render('Team/PublicIndex', [
            'members' => $members,
            'locations' => \App\Models\Location::orderBy('sort_order')->get(),
            'nav_menu' => \App\Models\NavMenu::first(),
        ]);
    }

    public function publicShow($slug)
    {
        $member = TeamMember::where('section', 'management')
            ->where(function ($q) use ($slug) {
                $q->whereRaw('LOWER(REPLACE(REPLACE(REPLACE(name, \'.\', \'\'), \' \', \'-\'), \' \', \'-\')) LIKE ?', ['%' . $slug . '%'])
                    ->orWhere('id', $slug);
            })->firstOrFail();

        if (!$member->is_active && !auth()->check()) {
            abort(404);
        }

        return Inertia::render('Team/PublicSingle', [
            'member' => $member,
            'locations' => \App\Models\Location::orderBy('sort_order')->get(),
            'nav_menu' => \App\Models\NavMenu::first(),
        ]);
    }
}
