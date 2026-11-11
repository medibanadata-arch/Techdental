<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Medicine pages had an English `meta_desc` only, so every Bangla page
     * inherited the English meta description. Add the matching Bangla column.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('medicines', 'meta_desc_bn')) {
            Schema::table('medicines', function (Blueprint $table) {
                $table->text('meta_desc_bn')->nullable()->after('meta_desc');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('medicines', 'meta_desc_bn')) {
            Schema::table('medicines', function (Blueprint $table) {
                $table->dropColumn('meta_desc_bn');
            });
        }
    }
};
