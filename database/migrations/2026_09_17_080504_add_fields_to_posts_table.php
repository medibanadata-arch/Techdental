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
            if (!Schema::hasColumn('posts', 'slug')) {
                $table->string('slug')->nullable();
            }
            if (!Schema::hasColumn('posts', 'title')) {
                $table->string('title')->nullable();
            }
            if (!Schema::hasColumn('posts', 'excerpt')) {
                $table->text('excerpt')->nullable();
            }
            if (!Schema::hasColumn('posts', 'content')) {
                $table->text('content')->nullable();
            }
            if (!Schema::hasColumn('posts', 'img')) {
                $table->string('img')->nullable();
            }
            if (!Schema::hasColumn('posts', 'category')) {
                $table->string('category')->nullable();
            }
            if (!Schema::hasColumn('posts', 'category_id')) {
                $table->integer('category_id')->nullable();
            }
            if (!Schema::hasColumn('posts', 'author_name')) {
                $table->string('author_name')->nullable();
            }
            if (!Schema::hasColumn('posts', 'author_avatar')) {
                $table->string('author_avatar')->nullable();
            }
            if (!Schema::hasColumn('posts', 'thumb_url')) {
                $table->string('thumb_url')->nullable();
            }
            if (!Schema::hasColumn('posts', 'published_at')) {
                $table->timestamp('published_at')->nullable();
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
                'slug', 'title', 'excerpt', 'content', 'img', 
                'category', 'category_id', 'author_name', 'author_avatar', 
                'thumb_url', 'published_at'
            ]);
        });
    }
};
