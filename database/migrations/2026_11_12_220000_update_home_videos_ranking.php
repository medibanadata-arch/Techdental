<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Replace the homepage video gallery with the 12 ranked Tech Dental videos.
     * Videos that are not part of the new ranking are kept (so nothing is lost)
     * but deactivated so the public gallery shows exactly these 12.
     */
    public function up(): void
    {
        $now = now();

        $videos = [
            ['GrHC3C4aTHU', 'Teeth Gap Treatment: Cost & Procedure'],
            ['yGA1vY7GXEk', 'Composite Filling for Cavities: Cost & Benefits'],
            ['2H3tSY5o-1Y', 'Simple Solution for Gap Teeth'],
            ['6nucOqkNo40', 'Does Scaling & Polishing Damage Teeth?'],
            ['UDjpQ8YT3DI', 'Root Canal Treatment: Procedure & Cost'],
            ['JFb7ny2KUTE', 'Gap Teeth Treatment in 1 Day: Cost & Procedure'],
            ['Zfx9Xf1pLdY', 'Black Spots on Teeth? Cavity Treatment'],
            ['lo4__Dmu_Jk', 'Dental Mouthwash: What It Is & Cost'],
            ['rSrzPYs9s6E', 'Fiber Bridge Treatment in 1 Day'],
            ['IJiLo7U8iQw', '1-Day Gap Teeth Treatment: Cost & Details'],
            ['WUr_dlWztdY', 'Tooth Scaling to Remove Tartar'],
            ['TRrNSkAre4w', 'Wisdom Tooth Extraction Procedure'],
        ];

        $ids = [];

        foreach ($videos as $index => $video) {
            [$videoId, $title] = $video;
            $ids[] = $videoId;

            DB::table('home_videos')->updateOrInsert(
                ['video_id' => $videoId],
                [
                    'title' => $title,
                    'youtube_url' => 'https://www.youtube.com/watch?v=' . $videoId,
                    'branch' => null,
                    'sort_order' => $index + 1,
                    'is_active' => 1,
                    'updated_at' => $now,
                    'created_at' => $now,
                ]
            );
        }

        DB::table('home_videos')
            ->whereNotIn('video_id', $ids)
            ->update(['is_active' => 0, 'updated_at' => $now]);
    }

    public function down(): void
    {
        // Non-destructive: reactivate the four videos that were replaced.
        DB::table('home_videos')
            ->whereIn('video_id', ['VHxYf-zrAh8', 'BlEIP3ildDc', 'kyXZpswv7Zk', 'C0GRCEveoec'])
            ->update(['is_active' => 1]);
    }
};
