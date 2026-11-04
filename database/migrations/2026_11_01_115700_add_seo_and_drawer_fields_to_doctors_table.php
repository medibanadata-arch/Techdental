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
        Schema::table('doctors', function (Blueprint $table) {
            if (!Schema::hasColumn('doctors', 'meta_desc')) {
                $table->text('meta_desc')->nullable();
            }
            if (!Schema::hasColumn('doctors', 'canonical_url')) {
                $table->string('canonical_url')->nullable();
            }
            if (!Schema::hasColumn('doctors', 'robots_index')) {
                $table->boolean('robots_index')->default(true);
            }
            if (!Schema::hasColumn('doctors', 'robots_follow')) {
                $table->boolean('robots_follow')->default(true);
            }
            if (!Schema::hasColumn('doctors', 'schema_type')) {
                $table->string('schema_type')->default('Physician')->nullable();
            }
            if (!Schema::hasColumn('doctors', 'schema_json')) {
                $table->text('schema_json')->nullable();
            }
            if (!Schema::hasColumn('doctors', 'faqs')) {
                $table->json('faqs')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->dropColumn([
                'meta_desc',
                'canonical_url',
                'robots_index',
                'robots_follow',
                'schema_type',
                'schema_json',
                'faqs',
            ]);
        });
    }
};
