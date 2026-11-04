<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('locations', function (Blueprint $table) {
            if (!Schema::hasColumn('locations', 'location_id')) {
                $table->string('location_id')->nullable();
            }
            if (!Schema::hasColumn('locations', 'name')) {
                $table->string('name')->nullable();
            }
            if (!Schema::hasColumn('locations', 'short_name')) {
                $table->string('short_name')->nullable();
            }
            if (!Schema::hasColumn('locations', 'address')) {
                $table->text('address')->nullable();
            }
            if (!Schema::hasColumn('locations', 'phone')) {
                $table->string('phone')->nullable();
            }
            if (!Schema::hasColumn('locations', 'map_url')) {
                $table->text('map_url')->nullable();
            }
            if (!Schema::hasColumn('locations', 'review_url')) {
                $table->text('review_url')->nullable();
            }
            if (!Schema::hasColumn('locations', 'time')) {
                $table->string('time')->nullable();
            }
            if (!Schema::hasColumn('locations', 'status_text')) {
                $table->string('status_text')->nullable();
            }
            if (!Schema::hasColumn('locations', 'is_open_now')) {
                $table->boolean('is_open_now')->default(true);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->dropColumn([
                'location_id', 'name', 'short_name', 'address', 'phone', 
                'map_url', 'review_url', 'time', 'status_text', 'is_open_now'
            ]);
        });
    }
};
