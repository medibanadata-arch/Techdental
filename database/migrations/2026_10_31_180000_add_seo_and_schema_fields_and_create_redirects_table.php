<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. locations (Branches)
        Schema::table('locations', function (Blueprint $table) {
            if (!Schema::hasColumn('locations', 'meta_desc')) {
                $table->text('meta_desc')->nullable();
            }
            if (!Schema::hasColumn('locations', 'canonical_url')) {
                $table->string('canonical_url')->nullable();
            }
            if (!Schema::hasColumn('locations', 'robots_index')) {
                $table->boolean('robots_index')->default(true);
            }
            if (!Schema::hasColumn('locations', 'robots_follow')) {
                $table->boolean('robots_follow')->default(true);
            }
            if (!Schema::hasColumn('locations', 'schema_type')) {
                $table->string('schema_type')->default('Dentist');
            }
            if (!Schema::hasColumn('locations', 'schema_json')) {
                $table->text('schema_json')->nullable();
            }
            if (!Schema::hasColumn('locations', 'faqs')) {
                $table->json('faqs')->nullable();
            }
        });

        // 2. services
        Schema::table('services', function (Blueprint $table) {
            if (!Schema::hasColumn('services', 'seo_title')) {
                $table->string('seo_title')->nullable();
            }
            if (!Schema::hasColumn('services', 'meta_desc')) {
                $table->text('meta_desc')->nullable();
            }
            if (!Schema::hasColumn('services', 'canonical_url')) {
                $table->string('canonical_url')->nullable();
            }
            if (!Schema::hasColumn('services', 'robots_index')) {
                $table->boolean('robots_index')->default(true);
            }
            if (!Schema::hasColumn('services', 'robots_follow')) {
                $table->boolean('robots_follow')->default(true);
            }
            if (!Schema::hasColumn('services', 'schema_type')) {
                $table->string('schema_type')->default('MedicalBusiness');
            }
            if (!Schema::hasColumn('services', 'schema_json')) {
                $table->text('schema_json')->nullable();
            }
        });

        // 3. pages (Custom Pages)
        Schema::table('pages', function (Blueprint $table) {
            if (!Schema::hasColumn('pages', 'seo_title')) {
                $table->string('seo_title')->nullable();
            }
            if (!Schema::hasColumn('pages', 'meta_desc')) {
                $table->text('meta_desc')->nullable();
            }
            if (!Schema::hasColumn('pages', 'canonical_url')) {
                $table->string('canonical_url')->nullable();
            }
            if (!Schema::hasColumn('pages', 'robots_index')) {
                $table->boolean('robots_index')->default(true);
            }
            if (!Schema::hasColumn('pages', 'robots_follow')) {
                $table->boolean('robots_follow')->default(true);
            }
            if (!Schema::hasColumn('pages', 'schema_type')) {
                $table->string('schema_type')->default('WebPage');
            }
            if (!Schema::hasColumn('pages', 'schema_json')) {
                $table->text('schema_json')->nullable();
            }
            if (!Schema::hasColumn('pages', 'faqs')) {
                $table->json('faqs')->nullable();
            }
        });

        // 4. home_content
        Schema::table('home_content', function (Blueprint $table) {
            if (!Schema::hasColumn('home_content', 'meta_desc')) {
                $table->text('meta_desc')->nullable();
            }
            if (!Schema::hasColumn('home_content', 'canonical_url')) {
                $table->string('canonical_url')->nullable();
            }
            if (!Schema::hasColumn('home_content', 'robots_index')) {
                $table->boolean('robots_index')->default(true);
            }
            if (!Schema::hasColumn('home_content', 'robots_follow')) {
                $table->boolean('robots_follow')->default(true);
            }
            if (!Schema::hasColumn('home_content', 'schema_type')) {
                $table->string('schema_type')->default('Dentist');
            }
            if (!Schema::hasColumn('home_content', 'schema_json')) {
                $table->text('schema_json')->nullable();
            }
        });

        // 5. about_content
        Schema::table('about_content', function (Blueprint $table) {
            if (!Schema::hasColumn('about_content', 'seo_title')) {
                $table->string('seo_title')->nullable();
            }
            if (!Schema::hasColumn('about_content', 'meta_desc')) {
                $table->text('meta_desc')->nullable();
            }
            if (!Schema::hasColumn('about_content', 'canonical_url')) {
                $table->string('canonical_url')->nullable();
            }
            if (!Schema::hasColumn('about_content', 'robots_index')) {
                $table->boolean('robots_index')->default(true);
            }
            if (!Schema::hasColumn('about_content', 'robots_follow')) {
                $table->boolean('robots_follow')->default(true);
            }
            if (!Schema::hasColumn('about_content', 'schema_type')) {
                $table->string('schema_type')->default('MedicalClinic');
            }
            if (!Schema::hasColumn('about_content', 'schema_json')) {
                $table->text('schema_json')->nullable();
            }
            if (!Schema::hasColumn('about_content', 'faqs')) {
                $table->json('faqs')->nullable();
            }
        });

        // 6. price_settings
        Schema::table('price_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('price_settings', 'meta_desc')) {
                $table->text('meta_desc')->nullable();
            }
            if (!Schema::hasColumn('price_settings', 'canonical_url')) {
                $table->string('canonical_url')->nullable();
            }
            if (!Schema::hasColumn('price_settings', 'robots_index')) {
                $table->boolean('robots_index')->default(true);
            }
            if (!Schema::hasColumn('price_settings', 'robots_follow')) {
                $table->boolean('robots_follow')->default(true);
            }
            if (!Schema::hasColumn('price_settings', 'schema_type')) {
                $table->string('schema_type')->default('MedicalBusiness');
            }
            if (!Schema::hasColumn('price_settings', 'schema_json')) {
                $table->text('schema_json')->nullable();
            }
            if (!Schema::hasColumn('price_settings', 'faqs')) {
                $table->json('faqs')->nullable();
            }
        });

        // 7. redirects table
        if (!Schema::hasTable('redirects')) {
            Schema::create('redirects', function (Blueprint $table) {
                $table->id();
                $table->string('source_url')->index();
                $table->string('target_url');
                $table->integer('status_code')->default(301);
                $table->boolean('is_active')->default(true);
                $table->unsignedBigInteger('hits')->default(0);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('redirects');
    }
};
