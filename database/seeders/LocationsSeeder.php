<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationsSeeder extends Seeder
{
    /**
     * Update the 4 existing branch rows with real design addresses/hours
     * verbatim from the branch page (L11247-12123) and single-service branch cards (L10362-10439).
     */
    public function run(): void
    {
        $branches = [
            [
                'short_name' => 'Mirpur',
                'name' => 'Mirpur',
                'location_id' => 'Mirpur',
                'slug' => 'mirpur',
                'address' => '827 (2nd Floor), Shewrapara, Begum Rokeya Sarani, Mirpur, Dhaka- 1216 (East side of Metro Rail Pillar No. 318)',
                'phone' => '09638000505',
                'hours_text' => 'Morning: 10:00 AM – 2:00 PM | Evening: 4:00 PM – 9:00 PM',
                'time' => '10 AM - 9 PM',
                'status_text' => 'Open Now',
                'is_open_now' => 1,
                'color_status' => 'emerald',
                'sort_order' => 1,
                'seo_title' => 'Best Dentist in Mirpur, Dhaka',
                'seo_content' => 'Tech Dental Care Mirpur branch is the main hub of our dental network in Dhaka, located beside Metro Pillar 318 in Shewrapara. Our experienced doctors provide painless root canals, braces, implants, kid\'s dentistry, and emergency dental services.',
                'reviews_text' => '2,237+ Verified Patient Reviews',
                'map_url' => 'https://maps.google.com/?q=827+Shewrapara+Mirpur+Dhaka',
            ],
            [
                'short_name' => 'Uttara',
                'name' => 'Uttara',
                'location_id' => 'Uttara Branch',
                'slug' => 'uttara',
                'address' => 'House 18, Road 14, Sector 3, Uttara, Dhaka',
                'phone' => '09638000505',
                'hours_text' => 'Evening: 3:00 PM – 9:00 PM',
                'time' => '3 PM - 9 PM',
                'status_text' => 'Opening soon',
                'is_open_now' => 0,
                'color_status' => 'amber',
                'sort_order' => 2,
                'seo_title' => 'Best Dentist in Uttara, Dhaka',
                'seo_content' => 'Tech Dental Care Uttara branch (Sector 3) brings the same painless, world-class dental treatments closer to Uttara residents — from orthodontics to full-mouth dental implants.',
                'reviews_text' => '850+ Verified Patient Reviews',
                'map_url' => 'https://maps.google.com/?q=House+18+Road+14+Sector+3+Uttara+Dhaka',
            ],
            [
                'short_name' => 'Badda',
                'name' => 'Badda',
                'location_id' => 'Badda Branch',
                'slug' => 'badda',
                'address' => 'Haji Abdur Rashid Mansion (3rd Floor), North Badda Bazar, Badda, Dhaka 1212 (3rd floor of Krishi Bank Building)',
                'phone' => '09638000505',
                'hours_text' => 'Morning: 10:00 AM – 2:00 PM | Evening: 4:00 PM – 9:00 PM',
                'time' => '10 AM - 9 PM',
                'status_text' => 'Open Now',
                'is_open_now' => 1,
                'color_status' => 'emerald',
                'sort_order' => 3,
                'seo_title' => 'Best Dentist in Badda, Dhaka',
                'seo_content' => 'Tech Dental Care Badda branch at North Badda Bazar offers braces, veneers, painless extraction, and complete oral surgery services with modern equipment.',
                'reviews_text' => '1,854+ Verified Patient Reviews',
                'map_url' => 'https://maps.google.com/?q=Haji+Abdur+Rashid+Mansion+North+Badda+Dhaka',
            ],
            [
                'short_name' => 'Jatrabari',
                'name' => 'Jatrabari',
                'location_id' => 'Jatrabari Branch',
                'slug' => 'jatrabari',
                'address' => 'Shahid Faruk Road, South Jatrabari, Dhaka',
                'phone' => '09638000505',
                'hours_text' => 'Evening: 3:00 PM – 9:00 PM',
                'time' => '3 PM - 9 PM',
                'status_text' => 'Open Now',
                'is_open_now' => 1,
                'color_status' => 'emerald',
                'sort_order' => 4,
                'seo_title' => 'Best Dentist in Jatrabari, Dhaka',
                'seo_content' => 'Tech Dental Care Jatrabari branch (Shahid Faruk Road) specializes in oral surgery, gum treatment, implants, and aesthetic dentistry for south Dhaka patients.',
                'reviews_text' => '1,120+ Verified Patient Reviews',
                'map_url' => 'https://maps.google.com/?q=Shahid+Faruk+Road+Jatrabari+Dhaka',
            ],
        ];

        foreach ($branches as $b) {
            // Key on short_name so existing rows (mirpur dhaka etc.) get upgraded, not duplicated.
            $existing = Location::where('short_name', $b['short_name'])->first();
            if ($existing) {
                $existing->update($b);
            } else {
                Location::updateOrCreate(['short_name' => $b['short_name']], $b);
            }
        }
    }
}
