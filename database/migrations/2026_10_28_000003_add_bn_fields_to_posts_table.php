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
            if (!Schema::hasColumn('posts', 'title_bn')) {
                $table->string('title_bn')->nullable()->after('title');
            }
            if (!Schema::hasColumn('posts', 'excerpt_bn')) {
                $table->text('excerpt_bn')->nullable()->after('excerpt');
            }
            if (!Schema::hasColumn('posts', 'content_bn')) {
                $table->longText('content_bn')->nullable()->after('content');
            }
            if (!Schema::hasColumn('posts', 'category_bn')) {
                $table->string('category_bn')->nullable()->after('category');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['title_bn', 'excerpt_bn', 'content_bn', 'category_bn']);
        });
    }
};
