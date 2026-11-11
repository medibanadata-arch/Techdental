<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Replace the placeholder homepage videos with the 16 most popular
     * long-form videos from the official channel:
     * https://www.youtube.com/@TechDentalCare/videos
     *
     * Ordered by view count (highest first) at the time of import.
     */
    public function up(): void
    {
        $now = now();

        $videos = [
            ['1kWoVmDk9CY', 'Permanent Solution & Cost for Teeth Gaps', null],
            ['Zfx9Xf1pLdY', 'Black Spots on Teeth? Cavity (Dental Caries) Treatment', null],
            ['GrHC3C4aTHU', 'Teeth Gap Treatment: Cost & Procedure', null],
            ['m5VKI0MeNAU', 'Fiber Bridge Dental Treatment', null],
            ['Q8OfeXy7lso', 'How to Reach Tech Dental Mirpur Branch', 'Mirpur'],
            ['xGoEUOz5tRg', 'Dhaka Dental College & Hospital: Costs & Doctors', null],
            ['jDmB22TwjnY', 'Teeth Whitening: Procedure & Cost 2026', null],
            ['JFb7ny2KUTE', 'ফাঁকা দাঁতের সমাধান মাত্র ১ দিনে | Gap Teeth Treatment & Cost', null],
            ['jNYTb8F-cbA', 'Dental Braces: Pros, Cons & Side Effects', null],
            ['IqCED4MN8LM', 'Tech Dental Uttara Location Guide', 'Uttara'],
            ['Tkvql2_EZJw', 'Teeth Gap Treatment with Composite Veneers', null],
            ['szdRKLSLzOE', 'How Much Does It Cost to Fix Gap Teeth?', null],
            ['VHxYf-zrAh8', 'Teeth Whitening vs Scaling: Which Do You Need?', null],
            ['BlEIP3ildDc', 'How to Remove Teeth Tartar & Plaque', null],
            ['kyXZpswv7Zk', 'Scaling & Polishing Treatment', null],
            ['C0GRCEveoec', 'How Are Dental Fillings Done? Cost & Procedure', null],
        ];

        DB::table('home_videos')->delete();

        foreach ($videos as $index => [$videoId, $title, $branch]) {
            DB::table('home_videos')->insert([
                'title' => $title,
                'youtube_url' => 'https://www.youtube.com/watch?v=' . $videoId,
                'video_id' => $videoId,
                'branch' => $branch,
                'sort_order' => $index + 1,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        $now = now();

        DB::table('home_videos')->delete();

        $seed = [
            ['আল্ট্রাসনিক স্কেলিং ও আধুনিক পলিশিং', 'Mirpur'],
            ['কম্পিউটারাইজড পেইনলেস রুট ক্যানেল', 'Uttara'],
            ['জার্মান প্রযুক্তির ডেন্টাল ইমপ্ল্যান্ট সার্জারি', 'Badda'],
            ['দাঁত ফাঁকা ও আঁকাবাঁকা চিকিৎসা (ব্রেসেস)', 'Mirpur'],
            ['ডিজিটাল স্মাইল ডিজাইন ও ভিনিয়ার্স', 'Uttara'],
            ['বাচ্চাদের দাঁতের যত্ন ও ক্যাভিটি ফিলিং', 'Badda'],
            ['আধুনিক ডিজিটাল ৩ডি ওপিজি এক্স-রে রুম', 'Uttara'],
            ['ক্লাস-বি অটোক্লেভ ১০০% জীবাণুমুক্তকরণ ব্যবস্থা', 'Mirpur'],
        ];

        foreach ($seed as $index => [$title, $branch]) {
            DB::table('home_videos')->insert([
                'title' => $title,
                'youtube_url' => 'https://www.youtube.com/watch?v=szdRKLSLzOE',
                'video_id' => 'szdRKLSLzOE',
                'branch' => $branch,
                'sort_order' => $index + 1,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }
};
