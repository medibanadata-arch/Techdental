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
        Schema::table('locations', function (Blueprint $table) {
            if (!Schema::hasColumn('locations', 'whatsapp')) {
                $table->string('whatsapp')->nullable()->after('phone');
            }
            if (!Schema::hasColumn('locations', 'booking_url')) {
                $table->string('booking_url')->nullable()->after('review_url');
            }
            if (!Schema::hasColumn('locations', 'call_label')) {
                $table->string('call_label')->nullable()->default('Call')->after('booking_url');
            }
            if (!Schema::hasColumn('locations', 'directions_label')) {
                $table->string('directions_label')->nullable()->default('Directions')->after('call_label');
            }
            if (!Schema::hasColumn('locations', 'whatsapp_label')) {
                $table->string('whatsapp_label')->nullable()->default('WhatsApp')->after('directions_label');
            }
            if (!Schema::hasColumn('locations', 'book_label')) {
                $table->string('book_label')->nullable()->default('Book')->after('whatsapp_label');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->dropColumn([
                'whatsapp',
                'booking_url',
                'call_label',
                'directions_label',
                'whatsapp_label',
                'book_label',
            ]);
        });
    }
};
