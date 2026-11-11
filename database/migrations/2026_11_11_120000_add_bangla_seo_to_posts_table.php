<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            if (!Schema::hasColumn('posts', 'seo_title_bn')) {
                $table->string('seo_title_bn')->nullable()->after('seo_title');
            }
            if (!Schema::hasColumn('posts', 'meta_desc_bn')) {
                $table->text('meta_desc_bn')->nullable()->after('meta_desc');
            }
            if (!Schema::hasColumn('posts', 'focus_keyword_bn')) {
                $table->string('focus_keyword_bn')->nullable()->after('focus_keyword');
            }
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['seo_title_bn', 'meta_desc_bn', 'focus_keyword_bn']);
        });
    }
};
