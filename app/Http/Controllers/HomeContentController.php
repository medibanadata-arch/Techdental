<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\FeaturedImage;
use App\Models\HomeContent;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class HomeContentController extends Controller
{
    public static function getDefaultSectionsConfig()
    {
        return [
            ['key' => 'gallery', 'title' => 'Homepage Slider & Showcase Gallery', 'subtitle' => 'Hero banner showcase at the top of homepage', 'enabled' => true, 'order' => 1],
            ['key' => 'quick_actions', 'title' => 'Quick Action Buttons', 'subtitle' => 'Call, Directions, WhatsApp & Book Now bar', 'enabled' => true, 'order' => 2],
            ['key' => 'opening_hours', 'title' => 'Opening Hours & Schedule', 'subtitle' => 'Real-time open/close schedule status accordion', 'enabled' => true, 'order' => 3],
            ['key' => 'branches', 'title' => 'Our Branches', 'subtitle' => 'Mirpur, Uttara, Badda & Jatrabari branch tabs & timings', 'enabled' => true, 'order' => 4],
            ['key' => 'doctors', 'title' => 'Specialist Doctors', 'subtitle' => 'Oral surgeons and dental specialists showcase cards', 'enabled' => true, 'order' => 5],
            ['key' => 'services', 'title' => 'Services & Pricing', 'subtitle' => 'Treatments list with standard consultation prices', 'enabled' => true, 'order' => 6],
            ['key' => 'reviews', 'title' => 'Patient Reviews & Rating', 'subtitle' => '4.9 Google rating & patient feedback strip', 'enabled' => true, 'order' => 7],
            ['key' => 'appointment_cta', 'title' => 'Make Appointment CTA Button', 'subtitle' => 'Direct prominent booking CTA banner', 'enabled' => true, 'order' => 8],
            ['key' => 'guides', 'title' => 'Dental Care Guides', 'subtitle' => 'Articles and educational guides for patients', 'enabled' => true, 'order' => 9],
            ['key' => 'about_seo', 'title' => 'More About Tech Dental & FAQs', 'subtitle' => 'Clinic overview text and frequently asked questions', 'enabled' => true, 'order' => 10],
        ];
    }

    public function index()
    {
        $content = HomeContent::first();
        if (!$content) {
            $content = HomeContent::create([]);
        }

        if (empty($content->sections_config)) {
            $content->sections_config = self::getDefaultSectionsConfig();
            $content->save();
        }

        // Initialize services sort_order if not set
        $services = DB::table('pricing')->orderBy('sort_order')->orderBy('id')->get();
        if ($services->where('sort_order', '>', 0)->count() === 0) {
            foreach ($services as $idx => $s) {
                DB::table('pricing')->where('id', $s->id)->update(['sort_order' => $idx + 1]);
            }
            $services = DB::table('pricing')->orderBy('sort_order')->orderBy('id')->get();
        }

        // Initialize doctors rank_order if not set
        $doctors = Doctor::orderBy('rank_order')->orderBy('id')->get();
        if ($doctors->where('rank_order', '>', 0)->count() === 0) {
            foreach ($doctors as $idx => $d) {
                $d->update(['rank_order' => $idx + 1]);
            }
            $doctors = Doctor::orderBy('rank_order')->orderBy('id')->get();
        }

        // Initialize branches sort_order if not set
        $branches = Location::orderBy('sort_order')->orderBy('id')->get();
        if ($branches->where('sort_order', '>', 0)->count() === 0) {
            foreach ($branches as $idx => $b) {
                $b->update(['sort_order' => $idx + 1]);
            }
            $branches = Location::orderBy('sort_order')->orderBy('id')->get();
        }

        $data = [
            'content' => $content,
            'gallery' => FeaturedImage::orderBy('sort_order')->orderBy('id')->get(),
            'branches' => $branches,
            'doctors' => $doctors,
            'services' => $services,
            'posts' => DB::table('posts')
                ->where(function ($q) {
                    $q->whereNull('status')->orWhere('status', '!=', 'trash');
                })
                ->orderBy('id', 'desc')
                ->take(12)
                ->get(),
        ];
        return Inertia::render('HomeContent/AdminIndex', $data);
    }

    /** Save Sections Order & Visibility */
    public function saveSectionsOrder(Request $request)
    {
        $validated = $request->validate([
            'sections' => 'required|array',
        ]);
        $content = HomeContent::first();
        if (!$content) {
            $content = HomeContent::create([]);
        }
        $content->sections_config = $validated['sections'];
        $content->save();
        return back()->with('success', 'Homepage sections arrangement saved successfully!');
    }

    /** Save SEO, branding & FAQ section (home_content singleton) */
    public function saveContent(Request $request)
    {
        $validated = $request->validate([
            'header_logo' => 'nullable|string',
            'brand_name_line1' => 'nullable|string',
            'brand_name_line2' => 'nullable|string',
            'seo_title' => 'nullable|string',
            'meta_desc' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'robots_index' => 'nullable|boolean',
            'robots_follow' => 'nullable|boolean',
            'schema_type' => 'nullable|string',
            'schema_json' => 'nullable|string',
            'about_text' => 'nullable|string',
            'about_image' => 'nullable|string',
            'about_caption' => 'nullable|string',
            'faqs' => 'nullable|array',
            'sections_config' => 'nullable|array',
        ]);
        $content = HomeContent::first();
        if (!$content) {
            $content = HomeContent::create([]);
        }
        $content->update($validated);
        return back()->with('success', 'Homepage content & settings saved successfully!');
    }

    /** Update a single featured image row (gallery manager tab) */
    public function saveGalleryRow(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'nullable|string',
            'src' => 'nullable|string',
            'badge' => 'nullable|string',
            'alt' => 'nullable|string',
            'view_count' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);
        $img = FeaturedImage::findOrFail($id);
        $update = array_filter($validated, fn($v) => $v !== null);
        if (isset($update['view_count'])) {
            $update['view_count'] = (int) preg_replace('/[^\d]/', '', (string)$update['view_count']);
        }
        $img->update($update);
        return back()->with('success', 'Gallery image updated.');
    }

    public function deleteGalleryRow($id)
    {
        FeaturedImage::findOrFail($id)->delete();
        return back()->with('success', 'Gallery image deleted.');
    }

    public function createGalleryRow(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string',
            'src' => 'nullable|string',
            'badge' => 'nullable|string',
            'alt' => 'nullable|string',
            'view_count' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);
        $data = array_filter($validated, fn($v) => $v !== null);
        $data['sort_order'] = (FeaturedImage::max('sort_order') ?? 0) + 1;
        if (isset($data['view_count'])) {
            $data['view_count'] = (int) preg_replace('/[^\d]/', '', (string)$data['view_count']);
        }
        FeaturedImage::create($data);
        return back()->with('success', 'Gallery image added.');
    }

    public function reorderGallery(Request $request)
    {
        $items = $request->input('items', []);
        foreach ($items as $item) {
            if (isset($item['id']) && isset($item['sort_order'])) {
                FeaturedImage::where('id', $item['id'])->update(['sort_order' => (int)$item['sort_order']]);
            }
        }
        return back()->with('success', 'Gallery order updated.');
    }

    /** Branches: Edit & Reorder */
    public function saveBranch(Request $request, $id)
    {
        $branch = Location::findOrFail($id);
        $validated = $request->validate([
            'name' => 'nullable|string',
            'short_name' => 'nullable|string',
            'address' => 'nullable|string',
            'address_main' => 'nullable|string',
            'address_sub' => 'nullable|string',
            'landmark' => 'nullable|string',
            'phone' => 'nullable|string',
            'whatsapp' => 'nullable|string',
            'time' => 'nullable|string',
            'hours_text' => 'nullable|string',
            'morning_hours' => 'nullable|string',
            'evening_hours' => 'nullable|string',
            'working_days' => 'nullable|string',
            'off_days' => 'nullable|string',
            'map_url' => 'nullable|string',
            'booking_url' => 'nullable|string',
            'call_label' => 'nullable|string',
            'directions_label' => 'nullable|string',
            'whatsapp_label' => 'nullable|string',
            'book_label' => 'nullable|string',
            'appointment_btn_label' => 'nullable|string',
            'more_about_title' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'seo_title' => 'nullable|string',
            'seo_content' => 'nullable|string',
        ]);
        $branch->update(array_filter($validated, fn($v) => $v !== null));
        return back()->with('success', 'Branch details updated.');
    }

    public function reorderBranches(Request $request)
    {
        $items = $request->input('items', []);
        foreach ($items as $item) {
            if (isset($item['id']) && isset($item['sort_order'])) {
                Location::where('id', $item['id'])->update(['sort_order' => (int)$item['sort_order']]);
            }
        }
        return back()->with('success', 'Branch ranking updated.');
    }

    /** Doctors: Edit & Reorder */
    public function saveDoctor(Request $request, $id)
    {
        $doctor = Doctor::findOrFail($id);
        $validated = $request->validate([
            'name' => 'nullable|string',
            'designation' => 'nullable|string',
            'deg' => 'nullable|string',
            'branch' => 'nullable|string',
            'visiting_time' => 'nullable|string',
            'img' => 'nullable|string',
            'rank_order' => 'nullable|integer',
        ]);
        $doctor->update(array_filter($validated, fn($v) => $v !== null));
        return back()->with('success', 'Doctor updated successfully.');
    }

    public function reorderDoctors(Request $request)
    {
        $items = $request->input('items', []);
        foreach ($items as $item) {
            if (isset($item['id']) && isset($item['rank_order'])) {
                Doctor::where('id', $item['id'])->update(['rank_order' => (int)$item['rank_order']]);
            }
        }
        return back()->with('success', 'Doctors ranking updated.');
    }

    /** Services: Edit & Reorder */
    public function saveService(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'nullable|string',
            'category' => 'nullable|string',
            'price' => 'nullable|string',
            'desc' => 'nullable|string',
            'popular' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);
        DB::table('pricing')->where('id', $id)->update(array_filter($validated, fn($v) => $v !== null));
        return back()->with('success', 'Service updated successfully.');
    }

    public function reorderServices(Request $request)
    {
        $items = $request->input('items', []);
        foreach ($items as $item) {
            if (isset($item['id']) && isset($item['sort_order'])) {
                DB::table('pricing')->where('id', $item['id'])->update(['sort_order' => (int)$item['sort_order']]);
            }
        }
        return back()->with('success', 'Services ranking updated.');
    }
}
