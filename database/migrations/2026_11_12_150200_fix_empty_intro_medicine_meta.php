<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * 33 medicines have an empty `intro`, so their meta description was only
     * the generic suffix. Build a unique description from the medicine name
     * and its real indication labels instead.
     */
    public function up(): void
    {
        $now = now();

        foreach (DB::table('medicines')->orderBy('id')->get(['id', 'name', 'intro', 'uses_items']) as $medicine) {
            $isBlank = trim(strip_tags((string) $medicine->intro)) === '';
            if (!$isBlank) {
                continue;
            }

            $uses = json_decode((string) $medicine->uses_items, true) ?: [];
            $labels = [];
            foreach (array_slice($uses, 0, 3) as $use) {
                $label = trim((string) ($use['label'] ?? ''));
                if ($label !== '') {
                    $labels[] = $label;
                }
            }
            if (!$labels) {
                continue;
            }

            $name = trim((string) $medicine->name);
            $meta = $name . ' — used for ' . implode(', ', $labels);
            if (mb_strlen($meta) > 118) {
                $meta = mb_substr($meta, 0, 115);
                $meta = mb_substr($meta, 0, mb_strrpos($meta, ',')) . ' and more';
            }
            $meta .= '. Uses, dosage & price in Bangladesh.';

            DB::table('medicines')->where('id', $medicine->id)->update([
                'meta_desc' => $meta,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        //
    }
};
