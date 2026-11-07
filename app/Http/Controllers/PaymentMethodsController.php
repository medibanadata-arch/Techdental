<?php

namespace App\Http\Controllers;

use App\Models\HomeContent;
use App\Models\Location;
use App\Models\NavMenu;
use App\Models\PaymentMethodSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentMethodsController extends Controller
{
    /**
     * Show the public How to Pay / Payment methods by branch page
     */
    public function publicShow(Request $request)
    {
        $locations = Location::orderBy('sort_order')->get();
        $navMenu = NavMenu::first();
        $homeContent = HomeContent::first();
        $paymentSettings = PaymentMethodSetting::getSingleton();

        return Inertia::render('HowToPay/PublicShow', [
            'locations' => $locations,
            'nav_menu' => $navMenu,
            'home_content' => $homeContent,
            'payment_settings' => $paymentSettings,
            'initial_branch' => $request->query('branch', ''),
            'canonical_url' => url('/how-to-pay'),
        ]);
    }

    /**
     * Admin: Show How to Pay CMS Dashboard
     */
    public function adminIndex(Request $request)
    {
        $paymentSettings = PaymentMethodSetting::getSingleton();
        $locations = Location::orderBy('sort_order')->get();

        return Inertia::render('HowToPay/AdminIndex', [
            'settings' => $paymentSettings,
            'locations' => $locations,
        ]);
    }

    /**
     * Admin: Update general text & SEO settings
     */
    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'tagline' => 'nullable|string|max:255',
            'title_main' => 'nullable|string|max:255',
            'title_highlight' => 'nullable|string|max:255',
            'lead_text' => 'nullable|string',
            'branches_section_title' => 'nullable|string|max:255',
            'branches_section_sub' => 'nullable|string|max:255',
            'matrix_section_title' => 'nullable|string|max:255',
            'matrix_section_sub' => 'nullable|string|max:255',
            'notice_text' => 'nullable|string',
            'seo_title' => 'nullable|string|max:255',
            'meta_desc' => 'nullable|string',
        ]);

        $setting = PaymentMethodSetting::getSingleton();
        $setting->update($validated);

        return back()->with('success', 'Page settings updated successfully!');
    }

    /**
     * Admin: Update payment methods list (including custom uploaded icon images)
     */
    public function updateMethods(Request $request)
    {
        $validated = $request->validate([
            'methods' => 'required|array',
            'methods.*.id' => 'required|string',
            'methods.*.name' => 'required|string',
            'methods.*.badge' => 'nullable|string',
            'methods.*.color' => 'nullable|string',
            'methods.*.image' => 'nullable|string',
            'methods.*.steps' => 'nullable|array',
            'methods.*.sort_order' => 'nullable|integer',
            'methods.*.is_active' => 'nullable|boolean',
        ]);

        $setting = PaymentMethodSetting::getSingleton();
        $setting->update([
            'methods_data' => $validated['methods'],
        ]);

        return back()->with('success', 'Payment methods and icons saved successfully!');
    }

    /**
     * Admin: Update branch availability & account numbers matrix
     */
    public function updateBranches(Request $request)
    {
        $validated = $request->validate([
            'branches' => 'required|array',
            'branches.*.id' => 'required|string',
            'branches.*.name' => 'required|string',
            'branches.*.fullName' => 'nullable|string',
            'branches.*.addr' => 'nullable|string',
            'branches.*.hours' => 'nullable|string',
            'branches.*.phone' => 'nullable|string',
            'branches.*.has' => 'nullable|array',
            'branches.*.acct' => 'nullable|array',
        ]);

        $setting = PaymentMethodSetting::getSingleton();
        $setting->update([
            'branches_data' => $validated['branches'],
        ]);

        return back()->with('success', 'Branch availability and merchant accounts saved successfully!');
    }
}
