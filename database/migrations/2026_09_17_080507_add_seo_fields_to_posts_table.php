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
        Schema::table('posts', function (Blueprint $table) {
            if (!Schema::hasColumn('posts', 'focus_keyword')) {
                $table->string('focus_keyword')->nullable();
            }
            if (!Schema::hasColumn('posts', 'seo_title')) {
                $table->string('seo_title')->nullable();
            }
            if (!Schema::hasColumn('posts', 'meta_desc')) {
                $table->text('meta_desc')->nullable();
            }
            if (!Schema::hasColumn('posts', 'canonical_url')) {
                $table->string('canonical_url')->nullable();
            }
            if (!Schema::hasColumn('posts', 'breadcrumb_title')) {
                $table->string('breadcrumb_title')->nullable();
            }
            if (!Schema::hasColumn('posts', 'robots_index')) {
                $table->boolean('robots_index')->default(true);
            }
            if (!Schema::hasColumn('posts', 'robots_follow')) {
                $table->boolean('robots_follow')->default(true);
            }
            if (!Schema::hasColumn('posts', 'schema_json')) {
                $table->text('schema_json')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn([
                'focus_keyword', 'seo_title', 'meta_desc', 'canonical_url', 
                'breadcrumb_title', 'robots_index', 'robots_follow', 'schema_json'
            ]);
        });
    }
};
