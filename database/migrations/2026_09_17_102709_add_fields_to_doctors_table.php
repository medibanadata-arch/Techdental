<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->string('name')->nullable()->after('id');
            $table->string('spec')->nullable()->after('name');
            $table->string('deg')->nullable()->after('spec');
            $table->string('exp')->nullable()->after('deg');
            $table->string('img')->nullable()->after('exp');
            $table->string('branch')->nullable()->after('img');
            $table->text('bio')->nullable()->after('branch');
            $table->string('phone')->nullable()->after('bio');
        });
    }

    public function down(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->dropColumn(['name', 'spec', 'deg', 'exp', 'img', 'branch', 'bio', 'phone']);
        });
    }
};
