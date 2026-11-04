<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role');                 // designation
            $table->string('section')->default('management'); // management | ceo_assistant | digital_marketing | call_center
            $table->string('image')->nullable();
            $table->text('quote')->nullable();      // CEO gold quote
            $table->text('letter')->nullable();     // JSON [paragraphs] for message-from-ceo
            $table->string('photo_alt')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_members');
    }
};
