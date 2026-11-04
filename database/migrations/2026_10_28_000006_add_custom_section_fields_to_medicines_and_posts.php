<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('medicines', function (Blueprint $table) {
            if (!Schema::hasColumn('medicines', 'section_titles')) {
                $table->json('section_titles')->nullable()->after('related');
            }
        });

        Schema::table('posts', function (Blueprint $table) {
            if (!Schema::hasColumn('posts', 'section_titles')) {
                $table->json('section_titles')->nullable()->after('faqs');
            }
            if (!Schema::hasColumn('posts', 'cta_box')) {
                $table->json('cta_box')->nullable()->after('section_titles');
            }
        });
    }

    public function down(): void
    {
        Schema::table('medicines', function (Blueprint $table) {
            if (Schema::hasColumn('medicines', 'section_titles')) {
                $table->dropColumn('section_titles');
            }
        });

        Schema::table('posts', function (Blueprint $table) {
            if (Schema::hasColumn('posts', 'cta_box')) {
                $table->dropColumn('cta_box');
            }
            if (Schema::hasColumn('posts', 'section_titles')) {
                $table->dropColumn('section_titles');
            }
        });
    }
};

