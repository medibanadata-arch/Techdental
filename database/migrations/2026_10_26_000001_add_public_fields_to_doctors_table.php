<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            if (!Schema::hasColumn('doctors', 'designation')) {
                $table->string('designation')->nullable()->after('name');
            }
            if (!Schema::hasColumn('doctors', 'specialty_banner')) {
                $table->string('specialty_banner')->nullable()->after('spec');
            }
            if (!Schema::hasColumn('doctors', 'bmdc')) {
                $table->string('bmdc')->nullable()->after('deg');
            }
            if (!Schema::hasColumn('doctors', 'visiting_time')) {
                $table->string('visiting_time')->nullable()->after('exp');
            }
            if (!Schema::hasColumn('doctors', 'experience_years')) {
                $table->string('experience_years')->nullable()->after('visiting_time');
            }
            if (!Schema::hasColumn('doctors', 'patients_treated')) {
                $table->string('patients_treated')->nullable()->after('experience_years');
            }
            if (!Schema::hasColumn('doctors', 'branch_location')) {
                $table->string('branch_location')->default('Mirpur')->after('branch');
            }
            if (!Schema::hasColumn('doctors', 'verified')) {
                $table->boolean('verified')->default(true)->after('branch_location');
            }
            if (!Schema::hasColumn('doctors', 'rank_order')) {
                $table->integer('rank_order')->default(0)->after('verified');
            }
            if (!Schema::hasColumn('doctors', 'mil_suggest')) {
                $table->string('mil_suggest')->nullable()->after('rank_order');
            }
            if (!Schema::hasColumn('doctors', 'chamber_title')) {
                $table->string('chamber_title')->nullable()->after('mil_suggest');
            }
            if (!Schema::hasColumn('doctors', 'chamber_address')) {
                $table->text('chamber_address')->nullable()->after('chamber_title');
            }
            if (!Schema::hasColumn('doctors', 'hotline')) {
                $table->string('hotline')->nullable()->after('chamber_address');
            }
            if (!Schema::hasColumn('doctors', 'milestones')) {
                $table->text('milestones')->nullable()->after('hotline');
            }
            if (!Schema::hasColumn('doctors', 'seo_title')) {
                $table->string('seo_title')->nullable()->after('milestones');
            }
            if (!Schema::hasColumn('doctors', 'seo_content')) {
                $table->text('seo_content')->nullable()->after('seo_title');
            }
        });
    }

    public function down(): void
    {
        // Keep columns (backward compatible).
    }
};
