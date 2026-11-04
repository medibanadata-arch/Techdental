<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('price_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('price_rows', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('category_id')->index();
            $table->string('service_name');
            $table->string('price_bdt')->nullable();
            $table->string('price_usd')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('price_settings', function (Blueprint $table) {
            $table->id();
            $table->string('page_title')->default('Tech Dental Treatment Price List in Bangladesh – 2026');
            $table->string('seo_title')->default('Additional Information');
            $table->text('seo_content')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('price_settings');
        Schema::dropIfExists('price_rows');
        Schema::dropIfExists('price_categories');
    }
};
