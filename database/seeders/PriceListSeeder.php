<?php

namespace Database\Seeders;

use App\Models\PriceCategory;
use App\Models\PriceRow;
use App\Models\PriceSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PriceListSeeder extends Seeder
{
    /**
     * 17 categories / 111 rows verbatim from the public price list design (L7634-8683).
     * Prices eyeballed from the real design tables.
     */
    public function run(): void
    {
        $data = [
            'All Treatment Price List' => [
                ['Doctor Consultation', '৳500', '$5'],
                ['Teeth Scaling & Polishing', '৳1,990 – ৳3,500', '$19 – $35'],
                ['Composite Dental Filling', '৳1,500 – ৳6,000', '$15 – $50'],
                ['Standard Root Canal (RCT)', '৳8,000', '$80'],
                ['PFM Crown (Standard)', '৳8,000', '$80'],
                ['Zirconia Crown', '৳20,000', '$150'],
                ['Dental Implant (Osstem)', '৳60,000 – ৳80,000', '$600 – $800'],
                ['Teeth Braces', '৳40,000 – ৳70,000', '$400 – $700'],
            ],
            'Consultation & Diagnostics' => [
                ['General Consultation (BDS Dentist)', '৳500', '$5'],
                ['Senior Consultant Fee (Specialist)', '৳1,000', '$10'],
                ['Digital X-Ray (RVG - Single Tooth)', '৳200', '$2'],
                ['OPG (Full Mouth Panoramic X-Ray)', '৳400', '$4'],
            ],
            'Preventive & Hygiene (Scaling/Cleaning)' => [
                ['Ultrasonic Scaling & Polishing', '৳1,990', '$19'],
                ['Advance Scaling & Polishing', '৳3,500', '$35'],
                ['Polishing', '৳1,000', '$10'],
                ['Deep Root Planing (Per Quadrant)', '৳2,500', '$25'],
                ['Fluoride Treatment', '৳5,000', '$50'],
            ],
            'Dental Fillings' => [
                ['Temporary Filling', '৳1,000', '$10'],
                ['Standard Bio GI Filling', '৳2,000', '$15'],
                ['Durable GI Filling', '৳4,000', '$15'],
                ['Standard Composite Filling', '৳1,500', '$13'],
                ['Advanced Nano-Composite Filling', '৳3,000', '$25'],
                ['Biomimetic Fiber-Composite Filling', '৳6,000', '$50'],
            ],
            'Root Canal Treatment (RCT)' => [
                ['Front Tooth RCT (Single Canal)', '৳8,000', '$60'],
                ['Back Tooth RCT (Multi-Canal)', '৳8,000', '$60'],
                ['Single Visit RCT', '৳10,000', '$100'],
                ['Re-RCT (Failed Case Correction)', '৳12,000', '$100'],
                ['Root Canal on Wisdom Tooth', '৳10,000', '$100'],
            ],
            'Dental Crowns (Caps)' => [
                ['Temporary / Interim Crowns', '৳3,000', '$30'],
                ['Full Metal Crown', '৳6,000', '$60'],
                ['PFM Standard', '৳8,000', '$80'],
                ['PFM Premium', '৳10,000', '$100'],
                ['Direct Composite Crown', '৳10,000', '$100'],
                ['Zirconia Standard', '৳20,000', '$150'],
                ['Zirconia Plus', '৳25,000', '$250'],
                ['E-Max Crown', '৳30,000', '$250'],
                ['Metal Post & Core Build-up', '৳2,000', '$20'],
                ['Fiber Post & Core Build-up', '৳3,000', '$30'],
            ],
            'Dental Veneers' => [
                ['Direct Composite Veneer', '৳5,000', '$50'],
                ['U-Veneer', '৳6,000', '$60'],
                ['Zirconia Veneer', '৳12,000', '$100'],
                ['E-Max Veneer', '৳25,000', '$250'],
                ['Lumineers (No-Prep Veneers)', '৳1,00,000', '$1,000'],
                ['Hollywood Smile (By DCV)', '৳70,000', '$700'],
            ],
            'Dental Implants & Surgery' => [
                ['Mini Dental Implant', '৳35,000 – ৳50,000', '$350 – $500'],
                ['Korean Implant - Osstem', '৳60,000 – ৳80,000', '$600 – $800'],
                ['USA Premium Implant', '৳1,00,000 – ৳1,20,000', '$1,000 – $1,200'],
                ['German Implant - Nobel', '৳1,20,000 – ৳1,50,000', '$1,200 – $1,500'],
                ['All-on-4 Full Mouth (Per Jaw)', '৳3,50,000 – ৳5,00,000', '$3,500 – $5,000'],
                ['All-on-6 Full Mouth (Per Jaw)', '৳4,50,000 – ৳6,50,000', '$4,500 – $6,500'],
                ['Bone Grafting (Per Area)', '৳20,000 – ৳50,000', '$200 – $500'],
                ['Sinus Lift Surgery', '৳30,000 – ৳50,000', '$300 – $500'],
            ],
            'Orthodontics (Braces & Aligners)' => [
                ['Traditional Metal Braces', '৳40,000 – ৳70,000', '$400 – $700'],
                ['Ceramic Braces (Tooth Colored)', '৳50,000 – ৳90,000', '$500 – $900'],
                ['Lingual Braces (Tongue Side)', '৳1,20,000 – ৳1,50,000', '$1,200 – $1,500'],
                ['Local Clear Aligners (Indian)', '৳1,80,000 – ৳2,50,000', '$1,800 – $2,500'],
                ['Invisalign (Premium USA Brand)', '৳3,50,000 – ৳5,00,000', '$3,500 – $5,000'],
                ['Fixed Retainers (Per Jaw)', '৳5,000', '$50'],
                ['Removable Retainers (Per Jaw)', '৳6,000', '$60'],
            ],
            'Tooth Extraction' => [
                ['Child Tooth Extraction (Milk Tooth)', '৳1,500', '$15'],
                ['Simple Tooth Extraction (Permanent Tooth)', '৳2,000 – ৳5,000', '$20 – $50'],
                ['Wisdom Tooth Extraction (Fully Erupted)', '৳3,000 – ৳6,000', '$30 – $60'],
                ['Surgical Wisdom Tooth Extraction (Impacted)', '৳8,000 – ৳12,000', '$80 – $120'],
                ['Complex Surgical Extraction (Broken Roots)', '৳10,000 – ৳15,000', '$100 – $150'],
            ],
            'Oral Surgery' => [
                ['Abscess Drainage (Infection Control)', '৳1,500 – ৳2,500', '$15 – $25'],
                ['Operculectomy (Gum Flap Removal)', '৳3,000 – ৳5,000', '$30 – $50'],
                ['Gingivectomy (Gum Reshaping)', '৳10,000 – ৳20,000', '$100 – $200'],
                ['Frenectomy (Lip Tie Release)', '৳5,000 – ৳8,000', '$50 – $80'],
                ['Apicectomy (Root-End Surgery)', '৳15,000 – ৳25,000', '$150 – $250'],
                ['Cyst or Tumor Removal (Minor)', '৳10,000 – ৳25,000', '$100 – $250'],
                ['Alveoloplasty (Jawbone Smoothing)', '৳2,000 – ৳5,000', '$20 – $50'],
                ['Bone Grafting (Per Area)', '৳20,000 – ৳40,000', '$200 – $400'],
            ],
            'Aesthetic Dentistry' => [
                ['Midline Diastema Closure (Front Teeth - Minor Gap)', '৳10,000', '$40'],
                ['Midline Diastema Closure (Large Gap)', '৳15,000', '$150'],
                ['Side Teeth Gap Closure (Per Space)', '৳5,000', '$50'],
                ['Laser Teeth Whitening in Office', '৳15,000', '$120'],
                ['Chemical Teeth Whitening in Office', '৳15,000', '$120'],
                ['Smile Makeover Composite Whitening 12-Unit Package', '৳45,000', '$365'],
                ['Smile Makeover Composite Whitening 16-Unit Package', '৳60,000', '$500'],
                ['Blackish Gum Treatment (Each Jaw - Per Session)', '৳10,000', '$100'],
                ['Tooth Jewelry Placement', '৳3,000 – ৳5,000', '$30 – $50'],
            ],
            'Dental Prosthesis' => [
                ['Removable Partial Denture (Acrylic)', '৳5,000 – ৳10,000', '$50 – $100'],
                ['Flexible Denture (1-4 units / Per Unit)', '৳10,000', '$100'],
                ['Flexible Denture (More than 4 units / Per Unit)', '৳8,000', '$80'],
                ['Complete Denture (Standard - Per Jaw)', '৳25,000', '$210'],
                ['Complete Denture (Premium - Per Jaw)', '৳40,000', '$350'],
                ['Dental Bridge (PFM - 3 Units)', '৳30,000', '$300'],
                ['Dental Bridge (Zirconia - 3 Units)', '৳70,000', '$600'],
                ['Fiber Bridge (No-Grinding Solution / Per Unit)', '৳25,000', '$250'],
                ['Maryland Bridge (Per Unit)', '৳20,000', '$150'],
                ['Cantilever Bridge (Per Unit)', '৳20,000', '$150'],
            ],
            "Pediatric (Children's) Dentistry" => [
                ['Pit & Fissure Sealant (Per Tooth)', '৳1,500', '$15'],
                ['Fluoride Varnish (Full Mouth)', '৳3,000', '$30'],
                ['Pulpotomy (Baby Tooth Root Canal)', '৳5,000', '$50'],
                ['Pulpectomy (Advanced Baby RCT)', '৳6,000', '$60'],
                ['Stainless Steel Crown (For Kids)', '৳6,000', '$60'],
                ['Space Maintainer (Fixed)', '৳8,000 – ৳15,000', '$80 – $150'],
            ],
            'Periodontics (Advanced Gum Treatment)' => [
                ['Deep Scaling / Curettage (Per Jaw)', '৳5,000 – ৳8,000', '$50 – $80'],
                ['Gum Grafting (For Receding Gums)', '৳15,000 – ৳25,000', '$150 – $250'],
                ['Flap Surgery (Per Quadrant)', '৳10,000 – ৳15,000', '$100 – $150'],
                ["Laser Gum Depigmentation (Smoker's Gums)", '৳10,000', '$100'],
            ],
            'Protective Gear & Indirect Fillings' => [
                ['Night Guard (For Teeth Grinding/Bruxism)', '৳5,000 – ৳8,000', '$50 – $80'],
                ['Sports Mouth Guard (Custom Fit)', '৳8,000', '$80'],
                ['Ceramic Inlay (Indirect Filling)', '৳6,000', '$60'],
                ['Ceramic Onlay (Partial Crown)', '৳6,000', '$60'],
            ],
            'Premium & Specialized Care (Additional Charge with Treatment Bill)' => [
                ['VIP Trust with all New Set of Instruments', '৳20,000', '$200'],
                ['V-VIP Trust with all New Instruments, Micromotor, Handpieces', '৳35,000', '$350'],
                ['Emergency Appointment (24/7 On-Call)', '৳4,000', '$40'],
                ['Viral Disease Patient Care (Hepatitis B/C, HIV)', '৳5,000', '$50'],
                ['Special Needs Patient Care (Autism/Behavioral Management)', '৳5,000', '$50'],
                ['Home Dental Visit (House Call)', '৳5,000', '$50'],
            ],
        ];

        DB::transaction(function () use ($data) {
            // Settings singleton — only create if none exists
            $seoContent = '<h3>Comprehensive Dental Care & Treatment Guide in Bangladesh (2026)</h3>'
                . '<p>Finding a trusted and affordable dental clinic in Dhaka can be challenging. Tech Dental Care provides state-of-the-art dental procedures ranging from routine preventive checkups, ultrasonic scaling, and tooth-colored composite fillings to advanced treatments like root canal therapy (RCT), Zirconia and E-Max dental crowns, dental implants (Korean and Swiss systems), braces, clear aligners, and complex oral surgery.</p>'
                . '<h4>Why Choose Tech Dental Care?</h4>'
                . '<ul>'
                . '<li>Experienced and qualified BDS dentists and specialist consultants.</li>'
                . '<li>Strict sterilization protocols and modern digital diagnostic tools (RVG &amp; OPG X-Rays).</li>'
                . '<li>Transparent pricing in BDT and USD with no hidden charges.</li>'
                . '<li>Specialized care options including VIP instrument sets, pediatric dentistry, and emergency services.</li>'
                . '</ul>'
                . '<p>Prices listed above are standard estimates for 2026. For exact diagnosis and personalized treatment plans, we recommend booking a consultation with our specialists in Dhaka.</p>';

            if (PriceSetting::count() === 0) {
                PriceSetting::create([
                    'page_title' => 'Tech Dental Treatment Price List in Bangladesh – 2026',
                    'seo_title' => 'Additional Information',
                    'seo_content' => $seoContent,
                ]);
            }

            // Only seed categories once
            if (PriceCategory::count() > 0) {
                return;
            }

            $catSort = 0;
            foreach ($data as $catName => $rows) {
                $category = PriceCategory::create(['name' => $catName, 'sort_order' => $catSort++]);
                $rowSort = 0;
                foreach ($rows as [$name, $bdt, $usd]) {
                    PriceRow::create([
                        'category_id' => $category->id,
                        'service_name' => $name,
                        'price_bdt' => $bdt,
                        'price_usd' => $usd,
                        'sort_order' => $rowSort++,
                    ]);
                }
            }
        });
    }
}
