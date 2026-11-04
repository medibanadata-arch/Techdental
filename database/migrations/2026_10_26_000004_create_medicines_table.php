<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medicines', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('generic')->nullable();
            $table->string('category')->nullable();     // pain, antibiotic, gastric, dental_special, supplement
            $table->string('tag')->nullable();          // chip label
            $table->string('image')->nullable();
            $table->string('quick_use')->nullable();
            $table->string('pharma')->nullable();
            $table->string('dosage')->nullable();
            $table->text('dental_usage')->nullable();
            $table->text('uses_text')->nullable();
            $table->text('side_effects')->nullable();

            // Single-page fields
            $table->string('subtitle')->nullable();
            $table->string('verified_badge')->default('Medically Verified');
            $table->string('published_date')->nullable();
            $table->text('intro')->nullable();
            $table->text('uses_items')->nullable();       // JSON [{label,text}]
            $table->text('dosage_admin')->nullable();
            $table->text('dosage_timing')->nullable();
            $table->text('side_effects_items')->nullable(); // JSON [4]
            $table->text('warnings')->nullable();          // JSON [{icon,text}]
            $table->string('price_per_tablet')->nullable();
            $table->string('price_per_strip')->nullable();
            $table->string('price_manufacturer')->nullable();
            $table->text('gallery')->nullable();           // JSON [{src,caption}]
            $table->text('faqs')->nullable();              // JSON [{q,a}]
            $table->text('author')->nullable();            // JSON {img,name,bio,reviewed_by,last_updated,see_more}
            $table->text('related')->nullable();           // JSON [{brand,name,generic,quick}]
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};
