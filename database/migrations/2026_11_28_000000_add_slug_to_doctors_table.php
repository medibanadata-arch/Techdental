<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Give every doctor the exact public slug the old WordPress site used, so the
 * profile has a single, stable canonical URL (/doctors/<slug>) instead of the
 * numeric /doctors/<id>.
 */
return new class extends Migration
{
    /** @var array<int, string> */
    private array $slugs = [
        1 => 'dr-aysha-siddika',
        3 => 'dr-saima-binte-zaman-shoili',
        4 => 'dr-sayera-tabassum-elmee',
        11 => 'dr-nowshin-faria-khan-chowdhury',
        12 => 'dr-afsana-mim',
        13 => 'dr-roquaya-akhter',
        14 => 'dr-hasna-hena-bhuiy-nishi',
        15 => 'dr-md-ashraful-hashem-johny',
        16 => 'dr-mahmuda-maimuna',
        18 => 'sanjida-farabi',
        20 => 'prof-dr-nafees-uddin-chowdhury',
    ];

    public function up(): void
    {
        if (! Schema::hasTable('doctors')) {
            return;
        }

        if (! Schema::hasColumn('doctors', 'slug')) {
            Schema::table('doctors', function (Blueprint $table) {
                $table->string('slug', 255)->nullable()->after('name');
            });
        }

        foreach ($this->slugs as $id => $slug) {
            DB::table('doctors')->where('id', $id)->update([
                'slug' => $slug,
                'canonical_url' => 'https://techdentalcare.com/doctors/'.$slug,
            ]);
        }

        Schema::table('doctors', function (Blueprint $table) {
            $table->unique('slug');
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('doctors')) {
            return;
        }

        if (Schema::hasColumn('doctors', 'slug')) {
            Schema::table('doctors', function (Blueprint $table) {
                $table->dropUnique(['slug']);
                $table->dropColumn('slug');
            });
        }
    }
};
