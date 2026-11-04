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
            if (!Schema::hasColumn('locations', 'appointment_btn_label')) {
                $table->string('appointment_btn_label')->nullable()->default('Book Now');
            }
            if (!Schema::hasColumn('locations', 'more_about_title')) {
                $table->string('more_about_title')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('locations', function (Blueprint $table) {
            if (Schema::hasColumn('locations', 'appointment_btn_label')) {
                $table->dropColumn('appointment_btn_label');
            }
            if (Schema::hasColumn('locations', 'more_about_title')) {
                $table->dropColumn('more_about_title');
            }
        });
    }
};
