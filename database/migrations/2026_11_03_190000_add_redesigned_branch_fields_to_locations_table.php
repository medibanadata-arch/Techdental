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
            $table->string('address_main')->nullable()->after('address');
            $table->string('address_sub')->nullable()->after('address_main');
            $table->string('landmark')->nullable()->after('address_sub');
            $table->string('morning_hours')->nullable()->after('hours_text');
            $table->string('evening_hours')->nullable()->after('morning_hours');
            $table->string('working_days')->nullable()->default('Saturday – Thursday')->after('evening_hours');
            $table->string('off_days')->nullable()->default('Friday closed')->after('working_days');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->dropColumn([
                'address_main',
                'address_sub',
                'landmark',
                'morning_hours',
                'evening_hours',
                'working_days',
                'off_days',
            ]);
        });
    }
};

