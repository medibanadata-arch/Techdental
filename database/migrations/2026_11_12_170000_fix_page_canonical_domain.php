<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * The live domain is techdentalcare.com, but canonical URLs stored in the
     * legacy `pages` table still pointed at techdentalbd.com. Canonicals must
     * never point at a different host.
     */
    public function up(): void
    {
        foreach (DB::table('pages')->whereNotNull('canonical_url')->get(['id', 'canonical_url']) as $page) {
            if (!str_contains((string) $page->canonical_url, 'techdentalbd.com')) {
                continue;
            }

            DB::table('pages')->where('id', $page->id)->update([
                'canonical_url' => str_replace('techdentalbd.com', 'techdentalcare.com', (string) $page->canonical_url),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        //
    }
};
