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
        Schema::table('medicines', function (Blueprint $table) {
            if (!Schema::hasColumn('medicines', 'seo_title')) {
                $table->string('seo_title')->nullable()->after('subtitle_bn');
            }
            if (!Schema::hasColumn('medicines', 'seo_title_bn')) {
                $table->string('seo_title_bn')->nullable()->after('seo_title');
            }
            if (!Schema::hasColumn('medicines', 'seo_content')) {
                $table->longText('seo_content')->nullable()->after('seo_title_bn');
            }
            if (!Schema::hasColumn('medicines', 'seo_content_bn')) {
                $table->longText('seo_content_bn')->nullable()->after('seo_content');
            }
            if (!Schema::hasColumn('medicines', 'meta_desc')) {
                $table->text('meta_desc')->nullable()->after('seo_content_bn');
            }
            if (!Schema::hasColumn('medicines', 'canonical_url')) {
                $table->string('canonical_url')->nullable()->after('meta_desc');
            }
            if (!Schema::hasColumn('medicines', 'robots_index')) {
                $table->boolean('robots_index')->default(true)->after('canonical_url');
            }
            if (!Schema::hasColumn('medicines', 'robots_follow')) {
                $table->boolean('robots_follow')->default(true)->after('robots_index');
            }
            if (!Schema::hasColumn('medicines', 'schema_type')) {
                $table->string('schema_type')->default('MedicalWebPage')->nullable()->after('robots_follow');
            }
            if (!Schema::hasColumn('medicines', 'schema_json')) {
                $table->text('schema_json')->nullable()->after('schema_type');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('medicines', function (Blueprint $table) {
            $cols = [
                'seo_title',
                'seo_title_bn',
                'seo_content',
                'seo_content_bn',
                'meta_desc',
                'canonical_url',
                'robots_index',
                'robots_follow',
                'schema_type',
                'schema_json',
            ];
            foreach ($cols as $col) {
                if (Schema::hasColumn('medicines', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
