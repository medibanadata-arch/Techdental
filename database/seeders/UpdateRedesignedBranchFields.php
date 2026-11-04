<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Location;

class UpdateRedesignedBranchFields extends Seeder
{
    public function run(): void
    {
        $mirpur = Location::where('slug', 'mirpur')->orWhere('id', 1)->first();
        if ($mirpur) {
            $mirpur->update([
                'address_main' => '827 (2nd Floor), Shewrapara, Begum Rokeya Sarani',
                'address_sub' => 'Mirpur, Dhaka – 1216',
                'landmark' => 'East side of Metro Rail Pillar No. 318',
                'morning_hours' => '10 AM – 2 PM',
                'evening_hours' => '4 PM – 9 PM',
                'working_days' => 'Saturday – Thursday',
                'off_days' => 'Friday closed',
            ]);
        }

        $uttara = Location::where('slug', 'uttara')->orWhere('id', 2)->first();
        if ($uttara) {
            $uttara->update([
                'address_main' => 'House 18, Road 14, Sector 3',
                'address_sub' => 'Uttara, Dhaka – 1230',
                'landmark' => 'Near Rajlaxmi Complex / Sector 3',
                'morning_hours' => null,
                'evening_hours' => '3:00 PM – 9:00 PM',
                'working_days' => 'Saturday – Thursday',
                'off_days' => 'Friday closed',
            ]);
        }

        $badda = Location::where('slug', 'badda')->orWhere('id', 3)->first();
        if ($badda) {
            $badda->update([
                'address_main' => 'Haji Abdur Rashid Mansion (3rd Floor), North Badda Bazar',
                'address_sub' => 'Badda, Dhaka – 1212',
                'landmark' => '3rd floor of Krishi Bank Building',
                'morning_hours' => null,
                'evening_hours' => '3:00 PM – 9:00 PM',
                'working_days' => 'Saturday – Thursday',
                'off_days' => 'Friday closed',
            ]);
        }

        $jatrabari = Location::where('slug', 'jatrabari')->orWhere('id', 4)->first();
        if ($jatrabari) {
            $jatrabari->update([
                'address_main' => 'Shahid Faruk Road, South Jatrabari',
                'address_sub' => 'Jatrabari, Dhaka – 1204',
                'landmark' => 'Centrally located near Jatrabari Chowrasta',
                'morning_hours' => null,
                'evening_hours' => '3:00 PM – 9:00 PM',
                'working_days' => 'Saturday – Thursday',
                'off_days' => 'Friday closed',
            ]);
        }
    }
}

