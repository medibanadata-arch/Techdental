<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The article's own price lines (e.g. "Price per Strip (12 Tablets): Typically ৳30.00.")
 * are richer than the two numeric fields: they carry the pack size, the "approximately"
 * wording and extra notes. Store them verbatim so the price section can show the article
 * text without losing a single word.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('medicines', function (Blueprint $table) {
            if (!Schema::hasColumn('medicines', 'price_note')) {
                $table->longText('price_note')->nullable()->after('price_manufacturer');
            }
            if (!Schema::hasColumn('medicines', 'price_note_bn')) {
                $table->longText('price_note_bn')->nullable()->after('price_note');
            }
        });
    }

    public function down(): void
    {
        Schema::table('medicines', function (Blueprint $table) {
            $table->dropColumn(['price_note', 'price_note_bn']);
        });
    }
};
