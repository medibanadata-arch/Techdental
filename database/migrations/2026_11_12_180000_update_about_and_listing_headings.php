<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * About page SEO + the remaining listing H1s.
     *
     * - About: weak title ("ABOUT - Best Dental In Dhaka") and a story that
     *   claimed five branches when there are four.
     * - Blog / Services: generic H1s ("Dental Blog & Guides", "Our Services")
     *   replaced with keyword-first headings that still read naturally.
     */
    public function up(): void
    {
        $now = now();

        DB::table('about_content')->where('id', 1)->update([
            'seo_title' => 'About Tech Dental Care — Dental Clinic in Dhaka Since 2018',
            'meta_desc' => 'Tech Dental Care has treated families in Dhaka since 2018 — 4 branches, 14 BMDC-registered dentists, digital X-ray and modern painless dentistry.',
            'canonical_url' => 'https://techdentalcare.com/about',
            'robots_index' => 1,
            'robots_follow' => 1,
            'updated_at' => $now,
        ]);

        $about = DB::table('about_content')->where('id', 1)->first();
        if ($about) {
            $story = (string) $about->story_p1;
            $story = str_replace(
                ['five modern branches located in Mirpur, Uttara, Badda, Jatrabari', 'five modern branches'],
                ['four modern branches in Mirpur, Uttara, Badda and Jatrabari', 'four modern branches'],
                $story
            );
            DB::table('about_content')->where('id', 1)->update([
                'story_p1' => $story,
                'updated_at' => $now,
            ]);
        }

        $home = DB::table('home_content')->first();
        if ($home) {
            $texts = json_decode((string) $home->website_texts, true) ?: [];
            $texts['blog_h1'] = 'Dental Blog & Oral Health Guides in Dhaka';
            $texts['services_h1'] = 'Dental Services & Treatments in Dhaka';
            $texts['team_seo_title'] = 'Our Dental Team in Dhaka — Management, Doctors & Support Staff';

            DB::table('home_content')->where('id', $home->id)->update([
                'website_texts' => json_encode($texts, JSON_UNESCAPED_UNICODE),
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        //
    }
};
