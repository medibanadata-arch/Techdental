<?php

namespace App\Http\Controllers;

use App\Models\HomeContent;
use App\Models\NavMenu;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PublicHomeController extends Controller
{
    /**
     * Public homepage. Also used by old URLs that map to the homepage so they
     * render the same page at their original path.
     */
    public function index()
    {
        $homeContent = HomeContent::first();
        $aiSettings = DB::table('ai_chat_settings')->first();
        $aiChips = $aiSettings && !empty($aiSettings->chips) ? json_decode($aiSettings->chips, true) : null;

        return Inertia::render('Home', [
            'locations' => DB::table('locations')->orderBy('sort_order')->orderBy('id')->get(),
            'services' => DB::table('pricing')->orderBy('sort_order')->orderBy('id')->get(),
            'doctors' => DB::table('doctors')->orderBy('rank_order')->orderBy('id')->get(),
            'posts' => DB::table('posts')
                ->where(function ($q) {
                    $q->whereNull('status')->orWhere('status', '!=', 'trash');
                })
                ->orderBy('published_at', 'desc')
                ->orderBy('id', 'desc')
                ->get(),
            'featured_images' => DB::table('featured_images')
                ->where('is_active', 1)
                ->where(function ($q) {
                    $q->where('branch', 'homepage')
                        ->orWhere('branch', 'all')
                        ->orWhereNull('branch')
                        ->orWhere('branch', '');
                })
                ->orderBy('sort_order')
                ->get()
                ->unique('src')
                ->values(),
            'nav_menu' => NavMenu::first(),
            'videos' => DB::table('home_videos')
                ->where('is_active', 1)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get(),
            'home_content' => $homeContent,
            'ai_chips' => $aiChips,
            'ai_settings' => [
                'bot_name' => $aiSettings->bot_name ?? 'Tech Dental Agent',
                'bot_avatar' => $aiSettings->bot_avatar ?? null,
                'starter_questions' => !empty($aiSettings->starter_questions) ? json_decode($aiSettings->starter_questions, true) : [
                    'ফিলিং চিকিৎসার খরচ কত?',
                    'দাঁতে গর্ত হলে কি করা উচিৎ?',
                    'রুট ক্যানেল করতে কত খরচ হয়?',
                    'দাঁত সোজা করার উপায় কি?'
                ],
                'gemini_enabled' => (bool)($aiSettings->gemini_enabled ?? false),
            ],
        ]);
    }
}
