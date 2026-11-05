<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Patient Rights
        Schema::create('patient_rights', function (Blueprint $table) {
            $table->id();
            $table->text('text_en');
            $table->text('text_bn')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Patient Responsibilities
        Schema::create('patient_responsibilities', function (Blueprint $table) {
            $table->id();
            $table->string('title_en');
            $table->string('title_bn')->nullable();
            $table->text('text_en');
            $table->text('text_bn')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. Patient Rights Page Content & Settings
        Schema::create('patient_rights_settings', function (Blueprint $table) {
            $table->id();
            $table->string('hero_title_en')->nullable();
            $table->string('hero_title_bn')->nullable();
            $table->text('hero_desc_en')->nullable();
            $table->text('hero_desc_bn')->nullable();

            $table->string('partnership_title_en')->nullable();
            $table->string('partnership_title_bn')->nullable();
            $table->text('partnership_text_en')->nullable();
            $table->text('partnership_text_bn')->nullable();

            $table->string('author_name_en')->nullable();
            $table->string('author_name_bn')->nullable();
            $table->text('author_bio_en')->nullable();
            $table->text('author_bio_bn')->nullable();
            $table->string('author_image')->nullable();

            $table->string('meta_title_en')->nullable();
            $table->string('meta_title_bn')->nullable();
            $table->text('meta_desc_en')->nullable();
            $table->text('meta_desc_bn')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patient_rights_settings');
        Schema::dropIfExists('patient_responsibilities');
        Schema::dropIfExists('patient_rights');
    }
};
