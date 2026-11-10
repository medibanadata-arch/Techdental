<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            if (!Schema::hasColumn('services', 'slug_bn')) {
                $table->string('slug_bn')->nullable()->after('slug');
                $table->string('title_bn')->nullable()->after('title');
                $table->text('short_desc_bn')->nullable()->after('short_desc');
                $table->string('details_heading_bn')->nullable()->after('details_heading');
                $table->longText('details_html_bn')->nullable()->after('details_html');
                $table->text('faqs_bn')->nullable()->after('faqs');
                $table->string('seo_title_bn')->nullable()->after('seo_title');
                $table->text('meta_desc_bn')->nullable()->after('meta_desc');
                $table->text('slug_legacy')->nullable()->after('slug_bn');
            }
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            foreach ([
                'slug_bn', 'title_bn', 'short_desc_bn', 'details_heading_bn',
                'details_html_bn', 'faqs_bn', 'seo_title_bn', 'meta_desc_bn', 'slug_legacy',
            ] as $column) {
                if (Schema::hasColumn('services', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
