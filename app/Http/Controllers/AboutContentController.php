<?php

namespace App\Http\Controllers;

use App\Models\AboutContent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AboutContentController extends Controller
{
    public function first(): AboutContent
    {
        $content = AboutContent::first();
        if (!$content) {
            $content = AboutContent::create([]);
        }
        return $content;
    }

    public function index()
    {
        return Inertia::render('About/AdminIndex', ['content' => $this->first()]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'hero_title' => 'nullable|string',
            'hero_subtitle' => 'nullable|string',
            'hero_bg' => 'nullable|string',
            'headline' => 'nullable|string',
            'founded_year' => 'nullable|string',
            'patients_count' => 'nullable|string',
            'story_p1' => 'nullable|string',
            'story_p2' => 'nullable|string',
            'video_thumb' => 'nullable|string',
            'video_url' => 'nullable|string',
            'services_cards' => 'nullable|array',
            'tech_headline' => 'nullable|string',
            'tech_subtext' => 'nullable|string',
            'tech_cards' => 'nullable|array',
            'vision_title' => 'nullable|string',
            'vision_text' => 'nullable|string',
            'mission_title' => 'nullable|string',
            'mission_text' => 'nullable|string',
            'team_banner' => 'nullable|string',
            'why_cards' => 'nullable|array',
            'seo_title' => 'nullable|string',
            'meta_desc' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'robots_index' => 'nullable|boolean',
            'robots_follow' => 'nullable|boolean',
            'schema_type' => 'nullable|string',
            'schema_json' => 'nullable|string',
            'faqs' => 'nullable|array',
        ]);

        if ($request->has('services_cards')) {
            $validated['services_cards'] = $request->input('services_cards') ?: [];
        }
        if ($request->has('tech_cards')) {
            $validated['tech_cards'] = $request->input('tech_cards') ?: [];
        }
        if ($request->has('why_cards')) {
            $validated['why_cards'] = $request->input('why_cards') ?: [];
        }

        $this->first()->update($validated);
        return back()->with('success', 'About page content updated successfully!');
    }

    // ---------- Public page ----------

    public function publicShow()
    {
        $content = $this->first();
        $doctors = \App\Models\Doctor::orderBy('rank_order')->get();
        $management = \App\Models\TeamMember::active()->where('section', 'management')->orderBy('sort_order')->get();
        return Inertia::render('About/PublicIndex', [
            'content' => $content,
            'doctors' => $doctors,
            'management' => $management,
            'locations' => \App\Models\Location::orderBy('sort_order')->get(),
            'nav_menu' => \App\Models\NavMenu::first(),
        ]);
    }
}
