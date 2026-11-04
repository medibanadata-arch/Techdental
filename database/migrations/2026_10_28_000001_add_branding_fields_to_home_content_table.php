<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('home_content', function (Blueprint $table) {
            if (!Schema::hasColumn('home_content', 'header_logo')) {
                $table->string('header_logo')->nullable()->after('id');
            }
            if (!Schema::hasColumn('home_content', 'brand_name_line1')) {
                $table->string('brand_name_line1')->default('TECH')->after('header_logo');
            }
            if (!Schema::hasColumn('home_content', 'brand_name_line2')) {
                $table->string('brand_name_line2')->default('DENTAL')->after('brand_name_line1');
            }
        });
    }

    public function down(): void
    {
        Schema::table('home_content', function (Blueprint $table) {
            $table->dropColumn(['header_logo', 'brand_name_line1', 'brand_name_line2']);
        });
    }
};
