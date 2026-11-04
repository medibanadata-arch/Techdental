<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\DoctorSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DoctorController extends Controller
{
    public function index()
    {
        $data = Doctor::orderBy('rank_order', 'asc')->orderBy('id', 'asc')->get();
        $settings = DoctorSetting::firstOrCreate([]);
        return Inertia::render('Doctors/Index', [
            'data' => $data,
            'settings' => $settings,
        ]);
    }

    public function saveSettings(Request $request)
    {
        $validated = $request->validate([
            'page_title' => 'nullable|string|max:255',
            'seo_title' => 'nullable|string|max:255',
            'seo_content' => 'nullable|string',
            'meta_desc' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'robots_index' => 'nullable|boolean',
            'robots_follow' => 'nullable|boolean',
            'schema_type' => 'nullable|string',
            'schema_json' => 'nullable|string',
            'faqs' => 'nullable|array',
        ]);

        $settings = DoctorSetting::firstOrCreate([]);
        $settings->update([
            'page_title' => $validated['page_title'] ?? $settings->page_title,
            'seo_title' => $validated['seo_title'] ?? $settings->seo_title,
            'seo_content' => $validated['seo_content'] ?? $settings->seo_content,
            'meta_desc' => $validated['meta_desc'] ?? $settings->meta_desc,
            'canonical_url' => $validated['canonical_url'] ?? $settings->canonical_url,
            'robots_index' => $request->has('robots_index') ? $request->boolean('robots_index') : $settings->robots_index,
            'robots_follow' => $request->has('robots_follow') ? $request->boolean('robots_follow') : $settings->robots_follow,
            'schema_type' => $validated['schema_type'] ?? $settings->schema_type,
            'schema_json' => $validated['schema_json'] ?? $settings->schema_json,
            'faqs' => $validated['faqs'] ?? $settings->faqs,
        ]);

        return redirect()->back()->with('success', 'Doctors page SEO settings updated successfully!');
    }

    public function reorder(Request $request)
    {
        $items = $request->input('items', []);
        foreach ($items as $idx => $item) {
            $id = $item['id'] ?? null;
            $rank = isset($item['rank_order']) ? (int)$item['rank_order'] : ($idx + 1);
            if ($id) {
                Doctor::where('id', $id)->update(['rank_order' => $rank]);
            }
        }
        return back()->with('success', 'Doctors ranking updated successfully.');
    }

    public function create()
    {
        return Inertia::render('Doctors/Create');
    }

    public function store(Request $request)
    {
        $validated = $this->validateDoctor($request);

        Doctor::create($validated);
        return redirect()->route('doctors.index')->with('success', 'Doctor created successfully.');
    }

    public function show($id)
    {
        return $this->publicShow($id);
    }

    public function edit(Doctor $doctor)
    {
        return Inertia::render('Doctors/Edit', ['doctor' => $doctor]);
    }

    public function update(Request $request, Doctor $doctor)
    {
        $validated = $this->validateDoctor($request);
        if ($request->has('robots_index')) {
            $validated['robots_index'] = $request->boolean('robots_index');
        }
        if ($request->has('robots_follow')) {
            $validated['robots_follow'] = $request->boolean('robots_follow');
        }
        if ($request->has('verified')) {
            $validated['verified'] = $request->boolean('verified');
        }

        $doctor->update($validated);
        return redirect()->route('doctors.index')->with('success', 'Doctor updated successfully.');
    }

    public function destroy(Doctor $doctor)
    {
        $doctor->delete();
        return redirect()->route('doctors.index')->with('success', 'Doctor deleted successfully.');
    }

    private function validateDoctor(Request $request): array
    {
        return $request->validate([
            'name'   => 'required|string|max:255',
            'spec'   => 'nullable|string',
            'deg'    => 'nullable|string|max:255',
            'exp'    => 'nullable|string|max:255',
            'img'    => 'nullable|string',
            'branch' => 'nullable|string|max:255',
            'bio'    => 'nullable|string',
            'phone'  => 'nullable|string|max:50',
            'designation' => 'nullable|string|max:255',
            'specialty_banner' => 'nullable|string|max:255',
            'bmdc' => 'nullable|string|max:50',
            'visiting_time' => 'nullable|string|max:255',
            'experience_years' => 'nullable|string|max:50',
            'patients_treated' => 'nullable|string|max:50',
            'branch_location' => 'nullable|string|max:100',
            'verified' => 'nullable|boolean',
            'rank_order' => 'nullable|integer',
            'chamber_title' => 'nullable|string|max:255',
            'chamber_address' => 'nullable|string',
            'hotline' => 'nullable|string|max:50',
            'milestones' => 'nullable|array',
            'milestones.*.count' => 'nullable|string|max:50',
            'milestones.*.label' => 'nullable|string|max:150',
            'milestones.*.color' => 'nullable|string|max:50',
            'seo_title' => 'nullable|string|max:255',
            'seo_content' => 'nullable|string',
            'meta_desc' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'robots_index' => 'nullable|boolean',
            'robots_follow' => 'nullable|boolean',
            'schema_type' => 'nullable|string',
            'schema_json' => 'nullable|string',
            'faqs' => 'nullable|array',
        ]);
    }

    // ---------- Public pages ----------

    public function publicIndex()
    {
        $data = Doctor::orderBy('rank_order', 'asc')->orderBy('id', 'asc')->get();
        $settings = DoctorSetting::firstOrCreate([]);
        return Inertia::render('Doctors/PublicIndex', [
            'data' => $data,
            'settings' => $settings,
            'locations' => \App\Models\Location::orderBy('sort_order')->get(),
            'nav_menu' => \App\Models\NavMenu::first(),
        ]);
    }

    public function publicShow($id)
    {
        if (is_numeric($id)) {
            $item = Doctor::findOrFail($id);
        } else {
            $slugClean = str_replace(['dr-', 'dr.'], '', str_replace('-', ' ', strtolower($id)));
            $item = Doctor::where('name', 'like', "%{$slugClean}%")
                ->orWhere('id', $id)
                ->firstOrFail();
        }

        $hotline = $item->hotline ?: '09638000505';
        return Inertia::render('Doctors/PublicSingle', [
            'item' => $item,
            'hotline' => $hotline,
            'locations' => \App\Models\Location::orderBy('sort_order')->get(),
            'nav_menu' => \App\Models\NavMenu::first(),
        ]);
    }
}
