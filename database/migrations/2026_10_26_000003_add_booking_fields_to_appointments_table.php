<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            if (!Schema::hasColumn('appointments', 'preferred_time')) {
                $table->string('preferred_time')->nullable()->after('date');
            }
            if (!Schema::hasColumn('appointments', 'address')) {
                $table->text('address')->nullable()->after('preferred_time');
            }
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            if (Schema::hasColumn('appointments', 'address')) {
                $table->dropColumn('address');
            }
            if (Schema::hasColumn('appointments', 'preferred_time')) {
                $table->dropColumn('preferred_time');
            }
        });
    }
};
