<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('home_content', function (Blueprint $table) {
            if (!Schema::hasColumn('home_content', 'website_texts')) {
                $table->json('website_texts')->nullable()->after('homepage_texts');
            }
        });
    }

    public function down(): void
    {
        Schema::table('home_content', function (Blueprint $table) {
            if (Schema::hasColumn('home_content', 'website_texts')) {
                $table->dropColumn('website_texts');
            }
        });
    }
};
