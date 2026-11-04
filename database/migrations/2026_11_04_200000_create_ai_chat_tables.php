<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Settings Table
        Schema::create('ai_chat_settings', function (Blueprint $table) {
            $table->id();
            $table->string('gemini_api_key')->nullable();
            $table->string('gemini_model')->default('gemini-1.5-flash');
            $table->boolean('gemini_enabled')->default(false);
            $table->text('system_prompt')->nullable();
            $table->json('chips')->nullable();
            $table->text('fallback_reply')->nullable();
            $table->timestamps();
        });

        // 2. Keyword Rules Table
        Schema::create('ai_chat_replies', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('keywords'); // Comma-separated keywords
            $table->text('reply');
            $table->string('icon')->default('fa-tooth');
            $table->string('icon_color')->default('text-blue-600');
            $table->string('icon_bg')->default('bg-blue-100');
            $table->string('action_type')->default('none'); // none, appointment, call, directions, whatsapp, custom_link
            $table->string('action_label')->nullable();
            $table->string('action_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('priority')->default(0);
            $table->unsignedBigInteger('match_count')->default(0);
            $table->timestamps();
        });

        // 3. User Chat Log
        Schema::create('ai_chat_logs', function (Blueprint $table) {
            $table->id();
            $table->text('user_query');
            $table->text('reply')->nullable();
            $table->unsignedBigInteger('matched_rule_id')->nullable();
            $table->string('source')->default('keyword'); // keyword, gemini, fallback
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_chat_logs');
        Schema::dropIfExists('ai_chat_replies');
        Schema::dropIfExists('ai_chat_settings');
    }
};

