<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Brings a fresh database in line with the production schema.
 *
 * Some columns exist in the live database but were never added by any migration
 * (so `migrate:fresh`, new installs and the test suite were broken).
 * Every column is guarded with hasColumn(), so this is a no-op on the existing DB.
 */
return new class extends Migration
{
    public function up(): void
    {
        $columns = [
            'appointments' => function (Blueprint $table) {
                if (! Schema::hasColumn('appointments', 'name')) {
                    $table->string('name')->default('');
                }
                if (! Schema::hasColumn('appointments', 'phone')) {
                    $table->string('phone')->default('');
                }
                if (! Schema::hasColumn('appointments', 'date')) {
                    $table->date('date')->nullable();
                }
                if (! Schema::hasColumn('appointments', 'service')) {
                    $table->string('service')->nullable();
                }
                if (! Schema::hasColumn('appointments', 'status')) {
                    $table->string('status')->default('Pending');
                }
                if (! Schema::hasColumn('appointments', 'notes')) {
                    $table->text('notes')->nullable();
                }
            },
            'pages' => function (Blueprint $table) {
                if (! Schema::hasColumn('pages', 'slug')) {
                    $table->string('slug')->default('');
                }
                if (! Schema::hasColumn('pages', 'title')) {
                    $table->string('title')->default('');
                }
                if (! Schema::hasColumn('pages', 'content')) {
                    $table->text('content')->nullable();
                }
            },
            'pricing' => function (Blueprint $table) {
                if (! Schema::hasColumn('pricing', 'slug')) {
                    $table->string('slug')->nullable();
                }
            },
            'services' => function (Blueprint $table) {
                if (! Schema::hasColumn('services', 'category')) {
                    $table->string('category')->nullable();
                }
            },
            'home_content' => function (Blueprint $table) {
                if (! Schema::hasColumn('home_content', 'desktop_content')) {
                    $table->text('desktop_content')->nullable();
                }
            },
        ];

        foreach ($columns as $tableName => $callback) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, $callback);
            }
        }
    }

    public function down(): void
    {
        // Intentionally left empty: these columns hold live data and must not be dropped.
    }
};

