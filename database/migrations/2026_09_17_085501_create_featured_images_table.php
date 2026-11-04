<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('featured_images', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->text('src');
            $table->string('badge')->nullable();
            $table->string('branch')->nullable();
            $table->string('alt')->nullable();
            $table->string('type')->default('half-size');
            $table->integer('sort_order')->default(1);
            $table->integer('view_count')->default(350);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('featured_images');
    }
};
