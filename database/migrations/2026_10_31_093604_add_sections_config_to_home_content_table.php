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
            if (!Schema::hasColumn('home_content', 'sections_config')) {
                $table->json('sections_config')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('home_content', function (Blueprint $table) {
            if (Schema::hasColumn('home_content', 'sections_config')) {
                $table->dropColumn('sections_config');
            }
        });
    }
};
