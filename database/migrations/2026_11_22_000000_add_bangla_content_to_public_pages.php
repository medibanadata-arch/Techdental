<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Branch, price-list, doctors and homepage pages used one shared text
     * column for both languages, so every /bn/ URL rendered the English copy.
     * Add the matching Bangla columns; the public controllers pick them when
     * the request locale is Bangla and fall back to the English column.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('locations', 'seo_content_bn')) {
            Schema::table('locations', function (Blueprint $table) {
                $table->text('seo_content_bn')->nullable()->after('seo_content');
            });
        }
        if (!Schema::hasColumn('locations', 'faqs_bn')) {
            Schema::table('locations', function (Blueprint $table) {
                $table->text('faqs_bn')->nullable()->after('faqs');
            });
        }

        if (!Schema::hasColumn('price_settings', 'seo_content_bn')) {
            Schema::table('price_settings', function (Blueprint $table) {
                $table->text('seo_content_bn')->nullable()->after('seo_content');
            });
        }
        if (!Schema::hasColumn('price_settings', 'faqs_bn')) {
            Schema::table('price_settings', function (Blueprint $table) {
                $table->text('faqs_bn')->nullable()->after('faqs');
            });
        }

        if (!Schema::hasColumn('doctor_settings', 'seo_content_bn')) {
            Schema::table('doctor_settings', function (Blueprint $table) {
                $table->text('seo_content_bn')->nullable()->after('seo_content');
            });
        }
        if (!Schema::hasColumn('doctor_settings', 'faqs_bn')) {
            Schema::table('doctor_settings', function (Blueprint $table) {
                $table->text('faqs_bn')->nullable()->after('faqs');
            });
        }

        if (!Schema::hasColumn('doctors', 'bio_bn')) {
            Schema::table('doctors', function (Blueprint $table) {
                $table->text('bio_bn')->nullable()->after('bio');
            });
        }
        if (!Schema::hasColumn('doctors', 'seo_content_bn')) {
            Schema::table('doctors', function (Blueprint $table) {
                $table->text('seo_content_bn')->nullable()->after('seo_content');
            });
        }
        if (!Schema::hasColumn('doctors', 'faqs_bn')) {
            Schema::table('doctors', function (Blueprint $table) {
                $table->text('faqs_bn')->nullable()->after('faqs');
            });
        }

        if (!Schema::hasColumn('home_content', 'about_text_bn')) {
            Schema::table('home_content', function (Blueprint $table) {
                $table->text('about_text_bn')->nullable()->after('about_text');
            });
        }
        if (!Schema::hasColumn('home_content', 'faqs_bn')) {
            Schema::table('home_content', function (Blueprint $table) {
                $table->text('faqs_bn')->nullable()->after('faqs');
            });
        }
    }

    public function down(): void
    {
        foreach ([
            ['locations', ['seo_content_bn', 'faqs_bn']],
            ['price_settings', ['seo_content_bn', 'faqs_bn']],
            ['doctor_settings', ['seo_content_bn', 'faqs_bn']],
            ['doctors', ['bio_bn', 'seo_content_bn', 'faqs_bn']],
            ['home_content', ['about_text_bn', 'faqs_bn']],
        ] as [$tableName, $columns]) {
            foreach ($columns as $column) {
                if (Schema::hasColumn($tableName, $column)) {
                    Schema::table($tableName, function (Blueprint $table) use ($column) {
                        $table->dropColumn($column);
                    });
                }
            }
        }
    }
};
