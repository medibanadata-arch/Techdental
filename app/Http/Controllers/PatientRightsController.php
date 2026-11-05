<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\NavMenu;
use App\Models\PatientRight;
use App\Models\PatientResponsibility;
use App\Models\PatientRightsSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientRightsController extends Controller
{
    /**
     * Public page display (supports English and Bengali)
     */
    public function publicShow(Request $request)
    {
        $settings = PatientRightsSetting::first();
        if (!$settings) {
            $settings = new PatientRightsSetting([
                'hero_title_en' => 'Tech Dental Patient Bill of Rights and Responsibilities',
                'hero_title_bn' => 'টেক ডেন্টাল রোগীর অধিকার ও দায়িত্বসমূহ',
                'hero_desc_en' => 'At Tech Dental, we are committed to providing high-quality, compassionate, and modern dental care in a comfortable and respectful environment.',
                'hero_desc_bn' => 'টেক ডেন্টালে আমরা একটি আরামদায়ক ও শ্রদ্ধাশীল পরিবেশে উচ্চমানের, যত্নশীল এবং আধুনিক ডেন্টাল কেয়ার প্রদানের জন্য অঙ্গীকারবদ্ধ।',
                'partnership_title_en' => 'Our Partnership',
                'partnership_title_bn' => 'আমাদের অংশীদারিত্ব',
                'author_name_en' => 'Tech Dental',
                'author_name_bn' => 'টেক ডেন্টাল',
            ]);
        }

        $rights = PatientRight::where('is_active', true)->orderBy('order')->orderBy('id')->get();
        $responsibilities = PatientResponsibility::where('is_active', true)->orderBy('order')->orderBy('id')->get();

        $isBn = $request->is('bn/*');
        $canonicalUrl = $isBn ? url('bn/patient-rights') : url('patient-rights');
        $hreflang = [
            'en' => url('patient-rights'),
            'bn' => url('bn/patient-rights'),
            'x-default' => url('patient-rights'),
        ];

        return Inertia::render('PatientRights/PublicShow', [
            'settings' => $settings,
            'rights' => $rights,
            'responsibilities' => $responsibilities,
            'locations' => Location::orderBy('sort_order')->get(),
            'nav_menu' => NavMenu::first(),
            'is_bn' => $isBn,
            'canonical_url' => $canonicalUrl,
            'hreflang' => $hreflang,
        ]);
    }

    /**
     * Admin CMS Dashboard
     */
    public function adminIndex()
    {
        $settings = PatientRightsSetting::firstOrCreate([], [
            'hero_title_en' => 'Tech Dental Patient Bill of Rights and Responsibilities',
            'hero_title_bn' => 'টেক ডেন্টাল রোগীর অধিকার ও দায়িত্বসমূহ',
            'hero_desc_en' => 'At Tech Dental, we are committed to providing high-quality, compassionate, and modern dental care in a comfortable and respectful environment. The following outlines your rights as our valued patient, along with the responsibilities we ask of you to help ensure the best possible experience and outcomes for everyone.',
            'hero_desc_bn' => 'টেক ডেন্টালে আমরা একটি আরামদায়ক ও শ্রদ্ধাশীল পরিবেশে উচ্চমানের, যত্নশীল এবং আধুনিক ডেন্টাল কেয়ার প্রদানের জন্য অঙ্গীকারবদ্ধ। নিচে আমাদের সম্মানিত রোগী হিসেবে আপনার অধিকারসমূহ এবং দায়িত্বসমূহ তুলে ধরা হলো।',
            'partnership_title_en' => 'Our Partnership',
            'partnership_title_bn' => 'আমাদের অংশীদারিত্ব',
            'author_name_en' => 'Tech Dental',
            'author_name_bn' => 'টেক ডেন্টাল',
        ]);

        $rights = PatientRight::orderBy('order')->orderBy('id')->get();
        $responsibilities = PatientResponsibility::orderBy('order')->orderBy('id')->get();

        return Inertia::render('PatientRights/AdminIndex', [
            'settings' => $settings,
            'rights' => $rights,
            'responsibilities' => $responsibilities,
        ]);
    }

    /**
     * Update settings & page content
     */
    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'hero_title_en' => 'nullable|string|max:255',
            'hero_title_bn' => 'nullable|string|max:255',
            'hero_desc_en' => 'nullable|string',
            'hero_desc_bn' => 'nullable|string',
            'partnership_title_en' => 'nullable|string|max:255',
            'partnership_title_bn' => 'nullable|string|max:255',
            'partnership_text_en' => 'nullable|string',
            'partnership_text_bn' => 'nullable|string',
            'author_name_en' => 'nullable|string|max:255',
            'author_name_bn' => 'nullable|string|max:255',
            'author_bio_en' => 'nullable|string',
            'author_bio_bn' => 'nullable|string',
            'author_image' => 'nullable|string|max:500',
            'meta_title_en' => 'nullable|string|max:255',
            'meta_title_bn' => 'nullable|string|max:255',
            'meta_desc_en' => 'nullable|string',
            'meta_desc_bn' => 'nullable|string',
        ]);

        $settings = PatientRightsSetting::first();
        if (!$settings) {
            PatientRightsSetting::create($validated);
        } else {
            $settings->update($validated);
        }

        return back()->with('success', 'Page settings saved successfully.');
    }

    /**
     * Store new Right
     */
    public function storeRight(Request $request)
    {
        $validated = $request->validate([
            'text_en' => 'required|string',
            'text_bn' => 'nullable|string',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if (!isset($validated['order'])) {
            $validated['order'] = (PatientRight::max('order') ?? 0) + 1;
        }
        $validated['is_active'] = $request->boolean('is_active', true);

        PatientRight::create($validated);

        return back()->with('success', 'Patient right added successfully.');
    }

    /**
     * Update Right
     */
    public function updateRight(Request $request, $id)
    {
        $right = PatientRight::findOrFail($id);

        $validated = $request->validate([
            'text_en' => 'required|string',
            'text_bn' => 'nullable|string',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);
        $right->update($validated);

        return back()->with('success', 'Patient right updated successfully.');
    }

    /**
     * Delete Right
     */
    public function deleteRight($id)
    {
        $right = PatientRight::findOrFail($id);
        $right->delete();

        return back()->with('success', 'Patient right deleted successfully.');
    }

    /**
     * Store new Responsibility
     */
    public function storeResponsibility(Request $request)
    {
        $validated = $request->validate([
            'title_en' => 'required|string|max:255',
            'title_bn' => 'nullable|string|max:255',
            'text_en' => 'required|string',
            'text_bn' => 'nullable|string',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if (!isset($validated['order'])) {
            $validated['order'] = (PatientResponsibility::max('order') ?? 0) + 1;
        }
        $validated['is_active'] = $request->boolean('is_active', true);

        PatientResponsibility::create($validated);

        return back()->with('success', 'Patient responsibility added successfully.');
    }

    /**
     * Update Responsibility
     */
    public function updateResponsibility(Request $request, $id)
    {
        $resp = PatientResponsibility::findOrFail($id);

        $validated = $request->validate([
            'title_en' => 'required|string|max:255',
            'title_bn' => 'nullable|string|max:255',
            'text_en' => 'required|string',
            'text_bn' => 'nullable|string',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);
        $resp->update($validated);

        return back()->with('success', 'Patient responsibility updated successfully.');
    }

    /**
     * Delete Responsibility
     */
    public function deleteResponsibility($id)
    {
        $resp = PatientResponsibility::findOrFail($id);
        $resp->delete();

        return back()->with('success', 'Patient responsibility deleted successfully.');
    }
}
