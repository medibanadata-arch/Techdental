<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HomeContent;

class UpdateHomeSectionOrder extends Seeder
{
    public function run(): void
    {
        $c = HomeContent::first();
        if ($c) {
            $c->sections_config = [
                [
                    'key' => 'gallery',
                    'title' => 'Homepage Slider & Showcase Gallery',
                    'subtitle' => 'Hero banner showcase at the top of homepage',
                    'enabled' => true,
                    'order' => 1,
                ],
                [
                    'key' => 'quick_actions',
                    'title' => 'Quick Action Buttons',
                    'subtitle' => 'Call, Directions, WhatsApp & Book Now bar',
                    'enabled' => true,
                    'order' => 2,
                ],
                [
                    'key' => 'branches',
                    'title' => 'Our Branches',
                    'subtitle' => 'Mirpur, Uttara, Badda & Jatrabari branch tabs & timings',
                    'enabled' => true,
                    'order' => 3,
                ],
                [
                    'key' => 'doctors',
                    'title' => 'Specialist Doctors',
                    'subtitle' => 'Oral surgeons and dental specialists showcase cards',
                    'enabled' => true,
                    'order' => 4,
                ],
                [
                    'key' => 'services',
                    'title' => 'Services & Pricing',
                    'subtitle' => 'Treatments list with standard consultation prices',
                    'enabled' => true,
                    'order' => 5,
                ],
                [
                    'key' => 'reviews',
                    'title' => 'Patient Reviews & Rating',
                    'subtitle' => '4.9 Google rating & patient feedback strip',
                    'enabled' => true,
                    'order' => 6,
                ],
                [
                    'key' => 'guides',
                    'title' => 'Dental Care Guides',
                    'subtitle' => 'Articles and educational guides for patients',
                    'enabled' => true,
                    'order' => 7,
                ],
                [
                    'key' => 'appointment_cta',
                    'title' => 'Make Appointment CTA Button',
                    'subtitle' => 'Direct prominent booking CTA banner',
                    'enabled' => true,
                    'order' => 8,
                ],
                [
                    'key' => 'about_seo',
                    'title' => 'Tech Dental Care | Best Dental Clinic in Dhaka, Bangladesh (2026)',
                    'subtitle' => 'Clinic overview text and frequently asked questions',
                    'enabled' => true,
                    'order' => 9,
                ],
                [
                    'key' => 'opening_hours',
                    'title' => 'Opening Hours & Schedule',
                    'subtitle' => 'Real-time open/close schedule status accordion',
                    'enabled' => false,
                    'order' => 10,
                ],
            ];
            $c->save();
        }
    }
}

