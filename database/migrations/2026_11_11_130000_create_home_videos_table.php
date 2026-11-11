<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('home_videos', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('youtube_url')->nullable();
            $table->string('video_id', 32)->nullable();
            $table->string('branch')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Seed the videos that were previously hardcoded on the homepage so they
        // appear in the new admin Video Gallery tab for editing/reordering.
        if (\Illuminate\Support\Facades\DB::table('home_videos')->count() === 0) {
            $now = now();
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
                \Illuminate\Support\Facades\DB::table('home_videos')->insert([
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
    }

    public function down(): void
    {
        Schema::dropIfExists('home_videos');
    }
};
