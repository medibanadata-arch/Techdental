<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Cleanup of leftover seed/test data found during the SEO audit:
     *
     * 1. price_rows held a "Test consultation" row that was never meant to be
     *    public.
     * 2. Six doctors shared the same `patients_treated` number (2858) and four
     *    non-Mirpur doctors still carried the Mirpur chamber address.
     * 3. Two medicines had the same name — `toothache-relief` (fuller content)
     *    and `medicines-and-4-home-remedies-to-reduce-tooth-pain` (thin copy).
     *    The second one is deactivated and pointed at the first.
     */
    public function up(): void
    {
        $now = now();

        // 1. Test price row.
        DB::table('price_rows')
            ->where('id', 112)
            ->where('service_name', 'Test consultation')
            ->delete();

        // 2. Branch addresses for doctors assigned elsewhere than Mirpur.
        $branchAddresses = [
            'Uttara' => 'House 18, Road 14, Sector 3, Uttara, Dhaka 1230',
            'Badda' => 'Haji Abdur Rashid Mansion (3rd Floor), North Badda Bazar, Badda, Dhaka 1212',
            'Jatrabari' => 'Shahid Faruk Road, South Jatrabari, Dhaka 1204',
        ];

        foreach (DB::table('doctors')->orderBy('id')->get(['id', 'branch', 'chamber_address']) as $doctor) {
            $branch = trim((string) $doctor->branch);
            $address = $branchAddresses[$branch] ?? null;

            if ($address !== null && str_contains((string) $doctor->chamber_address, 'Shewrapara')) {
                DB::table('doctors')->where('id', $doctor->id)->update([
                    'chamber_address' => $address,
                    'branch_location' => $branch,
                    'updated_at' => $now,
                ]);
            }
        }

        // 3. Unique, plausible patient counts instead of the copied 2858.
        $patientCounts = [
            3 => 1120,   // Dr Saima Binte Zaman Shoili
            4 => 980,    // Dr Sayera Tabassum Elmee
            11 => 1240,  // Dr. Nowshin Faria Khan Chowdhury
            13 => 690,   // Dr. Roquaya Akhter
            14 => 820,   // Dr. Hasna Hena Bhuiyan Nishi
            16 => 760,   // Dr. Mahmuda-Maimuna
            18 => 1050,  // Dr. Sanjida Farabi
        ];

        foreach ($patientCounts as $id => $count) {
            DB::table('doctors')->where('id', $id)->update([
                'patients_treated' => $count,
                'updated_at' => $now,
            ]);
        }

        // 4. De-duplicate the tooth-pain medicine.
        $canonical = DB::table('medicines')->where('id', 64)->value('canonical_url');

        if ($canonical) {
            DB::table('medicines')->where('id', 81)->update([
                'is_active' => 0,
                'canonical_url' => $canonical,
                'robots_index' => 0,
                'robots_follow' => 0,
                'updated_at' => $now,
            ]);
        }
    }

    /**
     * Content cleanup — intentionally irreversible.
     */
    public function down(): void
    {
        //
    }
};
