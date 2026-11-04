<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('about_content', function (Blueprint $table) {
            $table->id();
            // Hero tab
            $table->string('hero_title')->nullable();
            $table->string('hero_subtitle')->nullable();
            $table->string('hero_bg')->nullable();
            // About & Story tab
            $table->string('headline')->nullable();
            $table->string('founded_year')->nullable();
            $table->string('patients_count')->nullable();
            $table->text('story_p1')->nullable();
            $table->text('story_p2')->nullable();
            $table->string('video_thumb')->nullable();
            $table->string('video_url')->nullable();
            // Services & Tech tab
            $table->text('services_cards')->nullable(); // JSON [{img,title,desc}]
            // Doctors team = doctors table (managed there)
            // Advanced Technology tab
            $table->string('tech_headline')->nullable();
            $table->string('tech_subtext')->nullable();
            $table->text('tech_cards')->nullable();     // JSON [{img,title,desc}]
            // Vision & Mission tab
            $table->string('vision_title')->nullable();
            $table->text('vision_text')->nullable();
            $table->string('mission_title')->nullable();
            $table->text('mission_text')->nullable();
            $table->string('team_banner')->nullable();
            // Why choose tab
            $table->text('why_cards')->nullable();      // JSON [{img,desc}]
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('about_content');
    }
};
