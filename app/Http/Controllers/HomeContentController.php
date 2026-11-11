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
    /** Extract the 11-character YouTube video ID from any YouTube URL (or raw ID). */
    public static function extractYouTubeId(?string $url): ?string
    {
        if (!$url) {
            return null;
        }
        $url = trim($url);
        if (preg_match('/^[a-zA-Z0-9_-]{11}$/', $url)) {
            return $url;
        }
        if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i', $url, $m)) {
            return $m[1];
        }
        return null;
    }

    public function index()
    {
        $content = HomeContent::first();
        if (!$content) {
            $content = HomeContent::create([]);
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
            'gallery' => FeaturedImage::where(function ($q) {
                $q->where('branch', 'homepage')
                  ->orWhere('branch', 'all')
                  ->orWhereNull('branch')
                  ->orWhere('branch', '');
            })->orderBy('sort_order')->orderBy('id')->get(),
            'branches' => $branches,
            'doctors' => $doctors,
            'services' => $services,
            'videos' => \App\Models\HomeVideo::orderBy('sort_order')->orderBy('id')->get(),
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
            'homepage_texts' => 'nullable|array',
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
        $data['branch'] = 'homepage';
        $data['badge'] = 'Homepage';
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
            'name' => 'nullable|string',
            'slug' => 'nullable|string',
            'image' => 'nullable|string',
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

    /** Homepage YouTube videos: Create, Update, Delete & Reorder */
    public function createVideo(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string',
            'youtube_url' => 'required|string',
            'branch' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $videoId = self::extractYouTubeId($validated['youtube_url']);
        if (!$videoId) {
            return back()->with('error', 'Please enter a valid YouTube video URL (e.g. https://www.youtube.com/watch?v=...)');
        }

        \App\Models\HomeVideo::create([
            'title' => $validated['title'] ?? null,
            'youtube_url' => $validated['youtube_url'],
            'video_id' => $videoId,
            'branch' => $validated['branch'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? ((\App\Models\HomeVideo::max('sort_order') ?? 0) + 1),
        ]);

        return back()->with('success', 'Video added to the homepage gallery.');
    }

    public function saveVideo(Request $request, $id)
    {
        $video = \App\Models\HomeVideo::findOrFail($id);
        $validated = $request->validate([
            'title' => 'nullable|string',
            'youtube_url' => 'nullable|string',
            'branch' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if (!empty($validated['youtube_url'])) {
            $videoId = self::extractYouTubeId($validated['youtube_url']);
            if (!$videoId) {
                return back()->with('error', 'Please enter a valid YouTube video URL.');
            }
            $validated['video_id'] = $videoId;
        }

        $video->update(array_filter($validated, fn ($v) => $v !== null));
        return back()->with('success', 'Video updated.');
    }

    public function deleteVideo($id)
    {
        \App\Models\HomeVideo::findOrFail($id)->delete();
        return back()->with('success', 'Video deleted.');
    }

    public function reorderVideos(Request $request)
    {
        $items = $request->input('items', []);
        foreach ($items as $item) {
            if (isset($item['id']) && isset($item['sort_order'])) {
                \App\Models\HomeVideo::where('id', $item['id'])->update(['sort_order' => (int)$item['sort_order']]);
            }
        }
        return back()->with('success', 'Video order updated.');
    }
}
