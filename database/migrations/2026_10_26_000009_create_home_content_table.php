<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('home_content', function (Blueprint $table) {
            $table->id();
            $table->string('seo_title')->default('Your Trusted Dental Care Provider in Dhaka');
            $table->text('about_text')->nullable();
            $table->string('about_image')->nullable();
            $table->string('about_caption')->nullable();
            $table->text('faqs')->nullable(); // JSON [{q,a}]
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('home_content');
    }
};
