<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * `chamber_title` was still "Tech Dental Care (Mirpur Branch)" on doctors
     * working at Uttara, Badda and Jatrabari. Keep the chamber label in sync
     * with the doctor's real branch.
     */
    public function up(): void
    {
        $now = now();

        foreach (DB::table('doctors')->orderBy('id')->get(['id', 'branch']) as $doctor) {
            $branch = trim((string) $doctor->branch);

            if ($branch === '') {
                continue;
            }

            DB::table('doctors')->where('id', $doctor->id)->update([
                'chamber_title' => "Tech Dental Care ({$branch} Branch)",
                'updated_at' => $now,
            ]);
        }
    }

    /**
     * Data correction — intentionally irreversible.
     */
    public function down(): void
    {
        //
    }
};
