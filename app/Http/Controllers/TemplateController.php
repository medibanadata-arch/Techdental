<?php

namespace App\Http\Controllers;

use App\Models\Template;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class TemplateController extends Controller
{
    public function index()
    {
        $templates = Template::latest()->get();

        // Seed default templates if empty
        if ($templates->isEmpty()) {
            $defaultTemplates = [
                [
                    'name' => 'Single Post Layout (Default)',
                    'slug' => 'single-post-layout-default',
                    'type' => 'single_post',
                    'is_active' => true,
                    'conditions' => 'All Blog Posts',
                    'layout_config' => json_encode([
                        'header' => true,
                        'sidebar' => true,
                        'showAuthor' => true,
                        'showBreadcrumbs' => true,
                        'comments' => true
                    ])
                ],
                [
                    'name' => 'Dental Service Detail Page',
                    'slug' => 'dental-service-detail-page',
                    'type' => 'service_page',
                    'is_active' => true,
                    'conditions' => 'All Dental Services',
                    'layout_config' => json_encode([
                        'pricingBox' => true,
                        'appointmentCTA' => true,
                        'beforeAfterGallery' => true,
                        'doctorSection' => true
                    ])
                ],
                [
                    'name' => 'Custom Header Builder',
                    'slug' => 'custom-header-builder',
                    'type' => 'header',
                    'is_active' => true,
                    'conditions' => 'Entire Site',
                    'layout_config' => json_encode([
                        'stickyHeader' => true,
                        'topBarInfo' => true,
                        'logoPosition' => 'left'
                    ])
                ]
            ];
            foreach ($defaultTemplates as $tpl) {
                Template::create($tpl);
            }
            $templates = Template::latest()->get();
        }

        return Inertia::render('Templates/Index', [
            'templates' => $templates
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string',
            'conditions' => 'nullable|string',
            'layout_config' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        if (empty($validated['layout_config'])) {
            $validated['layout_config'] = json_encode([]);
        }

        Template::create($validated);
        return redirect()->route('templates.index')->with('success', 'Template created successfully.');
    }

    public function update(Request $request, $id)
    {
        $template = Template::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string',
            'conditions' => 'nullable|string',
            'layout_config' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $template->update($validated);
        return redirect()->route('templates.index')->with('success', 'Template updated successfully.');
    }

    public function destroy($id)
    {
        $template = Template::findOrFail($id);
        $template->delete();
        return redirect()->route('templates.index')->with('success', 'Template deleted successfully.');
    }
}
