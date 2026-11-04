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
        Schema::table('home_content', function (Blueprint $table) {
            if (!Schema::hasColumn('home_content', 'favicon')) {
                $table->string('favicon')->nullable()->after('header_logo');
            }
            if (!Schema::hasColumn('home_content', 'company_name')) {
                $table->string('company_name')->nullable()->default('Tech Dental')->after('brand_name_line2');
            }
            if (!Schema::hasColumn('home_content', 'tagline')) {
                $table->string('tagline')->nullable()->after('company_name');
            }
            if (!Schema::hasColumn('home_content', 'contact_phone')) {
                $table->string('contact_phone')->nullable()->after('tagline');
            }
            if (!Schema::hasColumn('home_content', 'contact_email')) {
                $table->string('contact_email')->nullable()->after('contact_phone');
            }
            if (!Schema::hasColumn('home_content', 'address')) {
                $table->text('address')->nullable()->after('contact_email');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('home_content', function (Blueprint $table) {
            $table->dropColumn(['favicon', 'company_name', 'tagline', 'contact_phone', 'contact_email', 'address']);
        });
    }
};
