<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            if (!Schema::hasColumn('posts', 'faqs')) {
                $table->json('faqs')->nullable();
            }
            if (!Schema::hasColumn('posts', 'author_name_bn')) {
                $table->string('author_name_bn')->nullable();
            }
            if (!Schema::hasColumn('posts', 'author_bio')) {
                $table->text('author_bio')->nullable();
            }
            if (!Schema::hasColumn('posts', 'author_bio_bn')) {
                $table->text('author_bio_bn')->nullable();
            }
        });

        Schema::table('medicines', function (Blueprint $table) {
            if (!Schema::hasColumn('medicines', 'dosage_admin_bn')) {
                $table->text('dosage_admin_bn')->nullable();
            }
            if (!Schema::hasColumn('medicines', 'dosage_timing_bn')) {
                $table->text('dosage_timing_bn')->nullable();
            }
            if (!Schema::hasColumn('medicines', 'verified_badge_bn')) {
                $table->string('verified_badge_bn')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['faqs', 'author_name_bn', 'author_bio', 'author_bio_bn']);
        });

        Schema::table('medicines', function (Blueprint $table) {
            $table->dropColumn(['dosage_admin_bn', 'dosage_timing_bn', 'verified_badge_bn']);
        });
    }
};
