<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('locations', function (Blueprint $table) {
            if (!Schema::hasColumn('locations', 'slug')) {
                $table->string('slug')->nullable()->after('location_id');
            }
            if (!Schema::hasColumn('locations', 'hours_text')) {
                $table->string('hours_text')->nullable()->after('time');
            }
            if (!Schema::hasColumn('locations', 'color_status')) {
                $table->string('color_status')->default('emerald')->after('is_open_now');
            }
            if (!Schema::hasColumn('locations', 'sort_order')) {
                $table->integer('sort_order')->default(0)->after('color_status');
            }
            if (!Schema::hasColumn('locations', 'seo_title')) {
                $table->string('seo_title')->nullable()->after('sort_order');
            }
            if (!Schema::hasColumn('locations', 'seo_content')) {
                $table->text('seo_content')->nullable()->after('seo_title');
            }
            if (!Schema::hasColumn('locations', 'seo_images')) {
                $table->text('seo_images')->nullable()->after('seo_content');
            }
            if (!Schema::hasColumn('locations', 'reviews_text')) {
                $table->string('reviews_text')->default('2,500+ Verified Patient Reviews')->after('seo_images');
            }
        });
    }

    public function down(): void
    {
        // Keep columns (backward compatible).
    }
};
