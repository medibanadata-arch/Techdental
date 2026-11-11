<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('home_content', 'homepage_texts')) {
            Schema::table('home_content', function (Blueprint $table) {
                $table->text('homepage_texts')->nullable();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('home_content', 'homepage_texts')) {
            Schema::table('home_content', function (Blueprint $table) {
                $table->dropColumn('homepage_texts');
            });
        }
    }
};
