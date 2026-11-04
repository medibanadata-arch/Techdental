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
            $table->longText('header_settings')->nullable()->after('address');
            $table->longText('footer_settings')->nullable()->after('header_settings');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('home_content', function (Blueprint $table) {
            $table->dropColumn(['header_settings', 'footer_settings']);
        });
    }
};
