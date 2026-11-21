<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('legacy_pages')) {
            return;
        }

        Schema::create('legacy_pages', function (Blueprint $table) {
            $table->id();
            $table->string('path', 500)->unique();
            $table->string('lang', 5)->default('en');
            $table->unsignedSmallInteger('status_code')->default(200);
            $table->string('title', 500)->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();
            $table->string('robots', 255)->nullable();
            $table->string('canonical', 500)->nullable();
            $table->longText('og_json')->nullable();
            $table->longText('twitter_json')->nullable();
            $table->longText('hreflang_json')->nullable();
            $table->longText('schema_json')->nullable();
            $table->string('h1', 500)->nullable();
            $table->longText('headings_json')->nullable();
            $table->longText('body_html')->nullable();
            $table->longText('faqs_json')->nullable();
            $table->string('source_url', 500)->nullable();
            $table->string('snapshot_at', 64)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('legacy_pages');
    }
};
