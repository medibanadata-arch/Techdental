<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Fix meta descriptions created by the previous medicine migration: the
     * first version appended a long suffix and then trimmed the result, which
     * left descriptions ending in a comma ("… price in Bangladesh,.").
     */
    public function up(): void
    {
        $now = now();
        $suffix = ' Uses, dosage & price in Bangladesh.';

        foreach (DB::table('medicines')->orderBy('id')->get(['id', 'intro']) as $medicine) {
            $intro = trim(preg_replace('/\s+/', ' ', strip_tags((string) $medicine->intro)));
            if ($intro === '') {
                continue;
            }

            $sentence = trim(preg_split('/(?<=[.!?])\s+/', $intro)[0] ?? $intro);
            $sentence = rtrim($sentence, ". \t\n\r\0\x0B") . '.';

            $limit = 158 - mb_strlen($suffix);
            if (mb_strlen($sentence) > $limit) {
                $sentence = mb_substr($sentence, 0, $limit - 1);
                $sentence = mb_substr($sentence, 0, mb_strrpos($sentence, ' ')) . '…';
            }

            DB::table('medicines')->where('id', $medicine->id)->update([
                'meta_desc' => $sentence . $suffix,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        //
    }
};
