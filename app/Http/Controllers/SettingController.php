<?php

namespace App\Http\Controllers;

use App\Models\HomeContent;
use App\Models\Media;
use App\Models\NavMenu;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = HomeContent::first();
        if (!$settings) {
            $settings = HomeContent::create([
                'company_name' => 'Tech Dental',
                'brand_name_line1' => 'TECH',
                'brand_name_line2' => 'DENTAL',
                'tagline' => 'Your Trusted Dental Care Provider in Dhaka',
                'header_logo' => '/uploads/images/1793169843_gemini-generated-imagendh8oqnh8oqndh-removebg-preview.webp',
                'favicon' => '/favicon.ico',
                'contact_phone' => '09638000505',
                'contact_email' => 'info@techdentalcare.com',
                'address' => 'Dhaka, Bangladesh',
            ]);
        }

        $mediaList = Media::latest()->get();

        return Inertia::render('Settings/AdminIndex', [
            'settings' => $settings,
            'mediaList' => $mediaList,
        ]);
    }

    public function update(Request $request)
    {
        $settings = HomeContent::first();
        if (!$settings) {
            $settings = new HomeContent();
        }

        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'brand_name_line1' => 'nullable|string|max:100',
            'brand_name_line2' => 'nullable|string|max:100',
            'tagline' => 'nullable|string|max:255',
            'header_logo' => 'nullable|string',
            'favicon' => 'nullable|string',
            'contact_phone' => 'nullable|string|max:100',
            'contact_email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
        ]);

        // Handle direct file upload for logo if provided as file
        if ($request->hasFile('logo_file')) {
            $file = $request->file('logo_file');
            $filename = time() . '_logo_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file->getClientOriginalName());
            $destinationPath = public_path('uploads/images');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $file->move($destinationPath, $filename);
            $validated['header_logo'] = '/uploads/images/' . $filename;
        }

        // Handle direct file upload for favicon if provided as file
        if ($request->hasFile('favicon_file')) {
            $file = $request->file('favicon_file');
            $filename = time() . '_favicon_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file->getClientOriginalName());
            $destinationPath = public_path('uploads/images');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $file->move($destinationPath, $filename);
            $validated['favicon'] = '/uploads/images/' . $filename;
        }

        $settings->fill($validated);
        $settings->save();

        return redirect()->route('settings.admin')->with('success', 'Settings updated successfully.');
    }

    public function headerFooter()
    {
        $settings = HomeContent::first();
        if (!$settings) {
            $settings = HomeContent::create([
                'company_name' => 'Tech Dental',
                'brand_name_line1' => 'TECH',
                'brand_name_line2' => 'DENTAL',
                'contact_phone' => '01400786162',
                'contact_email' => 'info@techdentalcare.com',
                'address' => 'Dhaka, Bangladesh',
            ]);
        }

        $defaultHeaderSettings = [
            'global' => [
                'sticky' => true,
                'show_language' => true,
                'show_branch_picker' => true,
                'announcement_enabled' => false,
                'announcement_text' => 'Welcome to Tech Dental – Painless Digital Dental Care across Dhaka',
            ],
            'pages' => [
                'home' => [
                    'title' => 'Homepage',
                    'variant' => 'full',
                    'override_logo' => false,
                    'custom_logo' => '',
                    'show_branch_picker' => true,
                    'show_language' => true,
                    'menu_id' => '',
                ],
                'branch' => [
                    'title' => 'Branch Pages',
                    'variant' => 'full',
                    'override_logo' => false,
                    'custom_logo' => '',
                    'show_branch_picker' => true,
                    'show_language' => true,
                    'menu_id' => '',
                ],
                'services' => [
                    'title' => 'Services & Pricing',
                    'variant' => 'full',
                    'override_logo' => false,
                    'custom_logo' => '',
                    'show_branch_picker' => true,
                    'show_language' => true,
                    'menu_id' => '',
                ],
                'doctors' => [
                    'title' => 'Specialist Doctors',
                    'variant' => 'full',
                    'override_logo' => false,
                    'custom_logo' => '',
                    'show_branch_picker' => true,
                    'show_language' => true,
                    'menu_id' => '',
                ],
                'blog' => [
                    'title' => 'Blog & Dental Guides',
                    'variant' => 'full',
                    'override_logo' => false,
                    'custom_logo' => '',
                    'show_branch_picker' => false,
                    'show_language' => true,
                    'menu_id' => '',
                ],
                'appointment' => [
                    'title' => 'Appointments',
                    'variant' => 'minimal',
                    'override_logo' => false,
                    'custom_logo' => '',
                    'show_branch_picker' => false,
                    'show_language' => true,
                    'menu_id' => '',
                ],
                'about' => [
                    'title' => 'About & Corporate',
                    'variant' => 'full',
                    'override_logo' => false,
                    'custom_logo' => '',
                    'show_branch_picker' => true,
                    'show_language' => true,
                    'menu_id' => '',
                ],
                'default' => [
                    'title' => 'Other / Custom Pages',
                    'variant' => 'full',
                    'override_logo' => false,
                    'custom_logo' => '',
                    'show_branch_picker' => true,
                    'show_language' => true,
                    'menu_id' => '',
                ],
            ],
        ];

        $defaultQuickLinks = [
            ['label' => 'Home', 'url' => '/'],
            ['label' => 'Services & Pricing', 'url' => '/services'],
            ['label' => 'Specialist Doctors', 'url' => '/doctors'],
            ['label' => 'Treatment Price List', 'url' => '/price-list'],
            ['label' => 'Medicines & Care', 'url' => '/medicines'],
            ['label' => 'About Tech Dental', 'url' => '/about'],
            ['label' => 'Book Appointment', 'url' => '/appointment'],
        ];

        $defaultBranches = [
            ['name' => 'Mirpur Branch', 'address' => 'Shewrapara, Rokeya Sarani (Pillar 318)', 'url' => '/branch/mirpur'],
            ['name' => 'Uttara Branch', 'address' => 'Sector 7, Jasimuddin Avenue, Dhaka', 'url' => '/branch/uttara'],
            ['name' => 'Badda Branch', 'address' => 'Middle Badda, Pragati Sarani, Dhaka', 'url' => '/branch/badda'],
            ['name' => 'Jatrabari Branch', 'address' => 'Shahid Faruk Road, Jatrabari, Dhaka', 'url' => '/branch/jatrabari'],
        ];

        $defaultBottomLinks = [
            ['label' => 'Facebook', 'url' => 'https://facebook.com/techdentalbd'],
            ['label' => 'Privacy Policy', 'url' => '/privacy-policy'],
            ['label' => 'Terms of Service', 'url' => '/terms-of-service'],
        ];

        $defaultFooterSettings = [
            'enabled' => true,
            'brand_logo_text' => 'TD',
            'brand_logo_image' => '',
            'brand_name' => 'Tech Dental',
            'brand_badge' => 'ORAL HEALTHCARE',
            'tagline' => 'Painless Clinical Dentistry & Modern Maxillofacial Care in Dhaka',
            'about_text' => 'Tech Dental is a leading multi-branch dental care provider in Dhaka, dedicated to painless digital procedures, expert orthodontic solutions, and modern implant dentistry.',
            'hotline' => '01400786162',
            'whatsapp' => '+8801400786162',
            'whatsapp_label' => 'WhatsApp Direct Help',
            'email' => 'info@techdentalcare.com',
            'address' => 'Mirpur, Uttara, Badda & Jatrabari, Dhaka, Bangladesh',
            'hours' => 'Saturday – Thursday: 10:00 AM – 9:00 PM (Friday Closed)',
            'quick_links_title' => 'QUICK LINKS',
            'quick_links' => $defaultQuickLinks,
            'branches_title' => 'OUR BRANCHES',
            'branches' => $defaultBranches,
            'support_title' => 'EMERGENCY & SUPPORT',
            'support_subtext' => 'Need urgent assistance or want to schedule a dental checkup? Reach out directly:',
            'copyright' => '© ' . date('Y') . ' Tech Dental Care Center. All rights reserved.',
            'bottom_links' => $defaultBottomLinks,
            'facebook_url' => 'https://facebook.com/techdentalbd',
            'instagram_url' => '',
            'youtube_url' => '',
            'linkedin_url' => '',
            'show_cta_strip' => true,
            'cta_badge' => 'Painless Clinical Dentistry in Dhaka',
            'cta_title' => 'Ready to Restore Your Healthy Smile?',
            'cta_subtext' => 'Consult with our specialist oral surgeons across Mirpur, Uttara, Badda, and Jatrabari branches.',
            'cta_button_text' => 'Make Appointment',
            'cta_button_url' => '/appointment',
        ];

        $headerSettings = array_replace_recursive($defaultHeaderSettings, $settings->header_settings ?? []);
        $footerSettings = array_replace_recursive($defaultFooterSettings, $settings->footer_settings ?? []);

        $menus = NavMenu::all();
        $mediaList = Media::latest()->get();

        return Inertia::render('Settings/HeaderFooter', [
            'settings' => $settings,
            'headerSettings' => $headerSettings,
            'footerSettings' => $footerSettings,
            'menus' => $menus,
            'mediaList' => $mediaList,
        ]);
    }

    public function updateHeaderFooter(Request $request)
    {
        $settings = HomeContent::first();
        if (!$settings) {
            $settings = new HomeContent();
        }

        $validated = $request->validate([
            'header_settings' => 'required|array',
            'footer_settings' => 'required|array',
        ]);

        $settings->header_settings = $validated['header_settings'];
        $settings->footer_settings = $validated['footer_settings'];
        $settings->save();

        return back()->with('success', 'Header and Footer configurations saved successfully!');
    }
}
