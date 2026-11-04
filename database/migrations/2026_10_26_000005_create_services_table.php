<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('price')->nullable();        // ৳ 35,000
            $table->string('price_suffix')->default('Starting Price');
            $table->text('short_desc')->nullable();     // intro paragraph
            $table->string('hero_main')->nullable();    // main cover image
            $table->text('hero_thumbs')->nullable();    // JSON [3 imgs]
            $table->text('features')->nullable();       // JSON [{title,sub}]
            $table->text('pricing_cards')->nullable();  // JSON [{img,title,price,note,popular}]
            $table->text('results')->nullable();        // JSON [3 imgs]
            $table->string('details_heading')->nullable();
            $table->text('details_html')->nullable();
            $table->text('seo_images')->nullable();     // JSON [imgs]
            $table->text('faqs')->nullable();           // JSON [{q,a}]
            $table->text('reviews')->nullable();        // JSON [{text,by,stars}]
            $table->integer('rank_order')->default(0);
            $table->string('status')->default('Published');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
