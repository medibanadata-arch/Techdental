<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_methods_settings', function (Blueprint $table) {
            $table->id();
            $table->string('tagline')->default('Payment methods by branch');
            $table->string('title_main')->default('How to pay');
            $table->string('title_highlight')->default('at our clinic');
            $table->text('lead_text')->nullable();
            $table->string('branches_section_title')->default('Select your branch');
            $table->string('branches_section_sub')->default('Payment options differ from branch to branch.');
            $table->string('matrix_section_title')->default('All branches at a glance');
            $table->string('matrix_section_sub')->default('Tap a branch name to jump to its details.');
            $table->text('notice_text')->nullable();
            $table->string('seo_title')->nullable();
            $table->text('meta_desc')->nullable();

            // JSON fields for payment methods list and branches availability
            $table->json('methods_data')->nullable();
            $table->json('branches_data')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_methods_settings');
    }
};
