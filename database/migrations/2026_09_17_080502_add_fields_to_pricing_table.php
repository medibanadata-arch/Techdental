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
        Schema::table('pricing', function (Blueprint $table) {
            if (!Schema::hasColumn('pricing', 'category')) {
                $table->string('category')->nullable();
            }
            if (!Schema::hasColumn('pricing', 'title')) {
                $table->string('title')->nullable();
            }
            if (!Schema::hasColumn('pricing', 'name')) {
                $table->string('name')->nullable();
            }
            if (!Schema::hasColumn('pricing', 'desc')) {
                $table->text('desc')->nullable();
            }
            if (!Schema::hasColumn('pricing', 'price')) {
                $table->string('price')->nullable();
            }
            if (!Schema::hasColumn('pricing', 'image')) {
                $table->string('image')->nullable();
            }
            if (!Schema::hasColumn('pricing', 'popular')) {
                $table->boolean('popular')->default(false);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pricing', function (Blueprint $table) {
            $table->dropColumn(['category', 'title', 'name', 'desc', 'price', 'image', 'popular']);
        });
    }
};
