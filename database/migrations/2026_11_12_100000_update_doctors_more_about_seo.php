<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Rewrite the /doctors "More About" drawer as a ranking-oriented SEO block
     * for the doctors-listing page (not a single doctor profile).
     *
     * Keyword targets: best dentist in Dhaka, dental surgeons in Dhaka,
     * dentist in Mirpur / Uttara / Badda / Jatrabari, BMDC registered dentist,
     * female dentist Dhaka, braces / implant / root canal specialist Dhaka.
     */
    public function up(): void
    {
        $now = now();

        $content = <<<'HTML'
<div class="space-y-4">
  <p><strong>Looking for the best dentist in Dhaka?</strong> Tech Dental Care runs four dental clinics in Mirpur (Shewrapara), Uttara, Badda and Jatrabari, staffed by 14 BMDC-registered dental surgeons. Every doctor listed above holds a Bachelor of Dental Surgery (BDS) degree, a valid BMDC registration number and post-graduate training in the treatment they perform — from a ৳500 check-up to full-mouth dental implants.</p>

  <h3>Meet Our 14 Dental Surgeons in Dhaka</h3>
  <p>Our team covers every major dental specialty, so one clinic can handle your whole treatment plan. <strong>Prof. Dr. Nafees Uddin Chowdhury</strong> (BDS, PhD — Tokyo Medical and Dental University) is the Medical Director, with 23+ years of experience in dental implants and oral surgery. <strong>Dr. Md. Ashraful Hashem Johny</strong> (MS in Orthodontics) leads braces, clear aligners and jaw-alignment cases, while <strong>Dr. Aysha Siddika</strong>, Assistant Medical Director, is known for aesthetic dentistry and painless laser root canal treatment.</p>
  <p>Twelve of our 14 dentists are women, so patients who prefer a female dentist in Dhaka — including mothers, children and students — can choose a lady doctor at any branch.</p>

  <h3>Dental Treatments Our Specialists Provide</h3>
  <ul>
    <li><strong>Root canal treatment (RCT):</strong> single-visit laser and rotary RCT for infected or painful teeth — see the <a href="/services/tooth-root-canal-cost-bd">root canal cost in Dhaka</a>.</li>
    <li><strong>Dental implants:</strong> Osstem, Nobel and All-on-4 / All-on-6 full-mouth rehabilitation — see the <a href="/services/dental-implants-cost-in-bangladesh">dental implant price in Bangladesh</a>.</li>
    <li><strong>Braces &amp; clear aligners:</strong> metal, ceramic and self-ligating braces plus Invisalign — see the <a href="/services/teeth-braces-cost-bangladesh">braces cost in Dhaka</a>.</li>
    <li><strong>Scaling &amp; polishing:</strong> ultrasonic cleaning for tartar, gum bleeding and bad breath — see the <a href="/services/teeth-scaling-polishing-price-bd">scaling and polishing price</a>.</li>
    <li><strong>Crowns, bridges &amp; veneers:</strong> zirconia, E-max and porcelain caps matched to your natural tooth shade.</li>
    <li><strong>Tooth extraction &amp; wisdom tooth surgery:</strong> painless removal, including impacted third molars — see the <a href="/services/wisdom-teeth-removal-cost-in-bangladesh">wisdom tooth removal cost</a>.</li>
    <li><strong>Teeth whitening &amp; smile design:</strong> professional whitening, composite veneers and Hollywood smile packages.</li>
    <li><strong>Children's dentistry:</strong> check-ups, fluoride, fillings and milk-tooth extraction in a child-friendly setting.</li>
  </ul>

  <h3>Find a Dentist Near You in Dhaka</h3>
  <p>All four branches run Saturday to Thursday with evening chambers, so you can see a dentist after office hours or school.</p>
  <ul>
    <li><strong>Mirpur:</strong> 827 (2nd floor), Begum Rokeya Sarani, Shewrapara, Dhaka 1216 — beside Metro Rail Pillar 318. Morning 10 AM–2 PM, evening 4 PM–9 PM. <a href="/branch/mirpur">Best dental clinic in Mirpur</a>.</li>
    <li><strong>Uttara:</strong> House 18, Road 14, Sector 3, Uttara, Dhaka 1230 — evening chamber 3 PM–9 PM. <a href="/branch/uttara">Dental clinic in Uttara</a>.</li>
    <li><strong>Badda:</strong> Haji Abdur Rashid Mansion (3rd floor), North Badda Bazar, Dhaka 1212 — evening chamber 3 PM–9 PM. <a href="/branch/badda">Dental clinic in Badda</a>.</li>
    <li><strong>Jatrabari:</strong> Shahid Faruk Road, South Jatrabari, Dhaka 1204 — evening chamber 3 PM–9 PM. <a href="/branch/jatrabari">Dental clinic in Jatrabari</a>.</li>
  </ul>

  <h3>Why Patients Choose Tech Dental Care</h3>
  <ul>
    <li><strong>Verified qualifications:</strong> BDS degrees and BMDC registration numbers are published on every doctor profile above.</li>
    <li><strong>Specialist-led care:</strong> 23+ years of senior experience in implants, orthodontics, endodontics and aesthetic dentistry.</li>
    <li><strong>Hospital-grade sterilisation:</strong> autoclave cycles and single-use disposables for every patient.</li>
    <li><strong>Digital diagnosis:</strong> RVG X-ray (৳200) and full-mouth OPG (৳400) before any treatment plan is written.</li>
    <li><strong>Painless techniques:</strong> laser root canals, rotary endodontics and modern local anaesthesia.</li>
    <li><strong>Transparent pricing:</strong> every fee is published on our <a href="/price-list">dental treatment price list</a> — no surprise bills.</li>
    <li><strong>Trusted by patients:</strong> 6,000+ verified patient reviews across the four Dhaka branches.</li>
  </ul>

  <h3>Dental Check-up &amp; Treatment Cost in Dhaka</h3>
  <p>You can compare real starting prices before you visit: doctor consultation ৳500, ultrasonic scaling and polishing from ৳1,990, composite filling from ৳1,500, standard root canal ৳8,000, zirconia crown ৳20,000, braces ৳40,000–৳70,000 and a Korean Osstem implant ৳60,000–৳80,000. Your final quote depends on the tooth, bone condition and material chosen, and is confirmed in writing after examination and X-ray.</p>

  <h3>How to Choose the Best Dentist in Dhaka</h3>
  <ol>
    <li>Check BMDC registration and the doctor's BDS degree — not just the clinic signboard.</li>
    <li>Match the specialty: an orthodontist for braces, an implantologist for missing teeth, an endodontist for root canals.</li>
    <li>Ask how instruments are sterilised and whether disposables are single-use.</li>
    <li>Look for digital X-ray and OPG facilities inside the clinic.</li>
    <li>Request a written treatment plan with prices before treatment starts.</li>
    <li>Confirm follow-up visits and warranty terms for crowns, bridges and implants.</li>
  </ol>

  <h3>Book a Dentist Appointment in Dhaka</h3>
  <p>Call our hotline <strong>09638-000505</strong> or <a href="/appointment">book a dental appointment online</a>. Share your name, phone number, preferred branch and time — our team confirms your slot by phone. For tooth pain, swelling or a broken tooth, mention it while booking so we can prioritise your visit.</p>
  <p>Not sure which treatment you need? Start with a ৳500 consultation and digital X-ray, and our dentist will explain every option in plain language before anything begins.</p>
</div>
HTML;

        $faqs = [
            [
                'q' => 'Who are the best dentists in Dhaka at Tech Dental Care?',
                'a' => 'Our team includes Prof. Dr. Nafees Uddin Chowdhury (Medical Director, 23+ years, dental implants), Dr. Md. Ashraful Hashem Johny (MS in Orthodontics, braces and aligners) and Dr. Aysha Siddika (Assistant Medical Director, aesthetic dentistry and laser root canal). All 14 doctors are BMDC-registered dental surgeons with BDS degrees and post-graduate training.',
            ],
            [
                'q' => 'Are all Tech Dental Care dentists BMDC registered?',
                'a' => 'Yes. Every dentist on this page holds a Bachelor of Dental Surgery (BDS) degree and a valid Bangladesh Medical and Dental Council (BMDC) registration number, which is published on each doctor profile along with their qualifications, specialty and visiting hours.',
            ],
            [
                'q' => 'How do I book a dentist appointment in Dhaka?',
                'a' => 'Call 09638-000505 or use our online appointment form. Choose your preferred branch — Mirpur, Uttara, Badda or Jatrabari — and a time between Saturday and Thursday. Our team confirms your slot by phone. Mirpur runs 10 AM–2 PM and 4 PM–9 PM; Uttara, Badda and Jatrabari hold evening chambers from 3 PM to 9 PM.',
            ],
            [
                'q' => 'Do you have female dentists in Dhaka?',
                'a' => 'Yes. Twelve of our 14 dental surgeons are women, including our Assistant Medical Director Dr. Aysha Siddika. Female patients, mothers and children can request a lady doctor at any branch when booking.',
            ],
            [
                'q' => 'How much does a dental check-up cost in Dhaka?',
                'a' => 'A general consultation with a BDS dentist costs ৳500 and a specialist consultation ৳1,000. A digital RVG X-ray is ৳200 and a full-mouth OPG is ৳400. Scaling and polishing starts at ৳1,990, and all fees are listed on our treatment price list before treatment begins.',
            ],
            [
                'q' => 'Is root canal treatment painful?',
                'a' => 'Modern root canal treatment is virtually painless. Our dentists use laser and rotary endodontic systems with effective local anaesthesia, and many cases are completed in a single visit (৳10,000). You may feel mild tenderness for a day or two afterwards, which usually settles with regular painkillers.',
            ],
            [
                'q' => 'Do you provide braces and clear aligners in Dhaka?',
                'a' => 'Yes. Our orthodontic team fits traditional metal braces (৳40,000–৳70,000), ceramic braces (৳50,000–৳90,000), lingual braces, local clear aligners and Invisalign. Retainers, overbite correction and gap closure are included in the treatment plan where needed.',
            ],
            [
                'q' => 'Do you treat children at Tech Dental Care?',
                'a' => 'Yes. Our paediatric dental service covers check-ups, fluoride treatment, fillings, milk-tooth extraction (from ৳1,500) and habit correction. Children can be seen at any branch, and parents can request a female dentist for a calmer first visit.',
            ],
        ];

        $doctors = DB::table('doctors')->orderBy('rank_order')->orderBy('id')->get(['id', 'name']);

        $specialties = [
            'Nafees' => 'Implant Dentistry',
            'Ashraful' => 'Orthodontics',
            'Aysha' => 'Aesthetic Dentistry',
            'Sanjida' => 'Endodontics',
        ];

        $itemList = [];
        foreach ($doctors as $i => $doctor) {
            $specialty = 'Dentistry';
            foreach ($specialties as $needle => $value) {
                if (str_contains($doctor->name, $needle)) {
                    $specialty = $value;
                    break;
                }
            }

            $itemList[] = [
                '@type' => 'ListItem',
                'position' => $i + 1,
                'item' => [
                    '@type' => 'Physician',
                    'name' => $doctor->name,
                    'url' => 'https://techdentalcare.com/doctors/' . $doctor->id,
                    'medicalSpecialty' => $specialty,
                ],
            ];
        }

        $schema = [
            '@context' => 'https://schema.org',
            '@graph' => [
                [
                    '@type' => 'Dentist',
                    '@id' => 'https://techdentalcare.com/#organization',
                    'name' => 'Tech Dental Care',
                    'url' => 'https://techdentalcare.com/doctors',
                    'telephone' => '+8809638000505',
                    'priceRange' => '৳৳',
                    'medicalSpecialty' => 'Dentistry',
                    'areaServed' => ['Mirpur', 'Uttara', 'Badda', 'Jatrabari', 'Dhaka'],
                    'address' => [
                        '@type' => 'PostalAddress',
                        'streetAddress' => '827 (2nd Floor), Begum Rokeya Sarani, Shewrapara',
                        'addressLocality' => 'Mirpur, Dhaka',
                        'postalCode' => '1216',
                        'addressCountry' => 'BD',
                    ],
                    'employee' => array_map(fn ($item) => $item['item'], $itemList),
                ],
                [
                    '@type' => 'ItemList',
                    '@id' => 'https://techdentalcare.com/doctors#dentists',
                    'name' => 'Dental surgeons at Tech Dental Care in Dhaka',
                    'numberOfItems' => count($itemList),
                    'itemListElement' => $itemList,
                ],
            ],
        ];

        DB::table('doctor_settings')->updateOrInsert(
            ['id' => 1],
            [
                'page_title' => 'Best Dentists in Dhaka – Tech Dental Specialists',
                'seo_title' => 'Best Dentists in Dhaka – Meet Our 14 Specialist Dental Surgeons',
                'seo_content' => $content,
                'meta_desc' => 'Looking for the best dentist in Dhaka? Meet 14 BMDC-registered dental surgeons in Mirpur, Uttara, Badda & Jatrabari. Book a ৳500 check-up today.',
                'canonical_url' => 'https://techdentalcare.com/doctors',
                'robots_index' => 1,
                'robots_follow' => 1,
                'schema_type' => 'Dentist',
                'schema_json' => json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                'faqs' => json_encode($faqs, JSON_UNESCAPED_UNICODE),
                'updated_at' => $now,
                'created_at' => $now,
            ]
        );

        // Clean up the awkward doctors-page H1 while keeping it editable in
        // Settings > Website Texts.
        $home = DB::table('home_content')->first();
        if ($home) {
            $texts = json_decode($home->website_texts ?? '{}', true) ?: [];
            $texts['doctors_h1'] = 'Best Dentists in Dhaka, Bangladesh';
            DB::table('home_content')->where('id', $home->id)->update([
                'website_texts' => json_encode($texts, JSON_UNESCAPED_UNICODE),
                'updated_at' => $now,
            ]);
        }
    }

    /**
     * Content migration — intentionally irreversible so a rollback never
     * resurrects the old single-doctor placeholder text.
     */
    public function down(): void
    {
        //
    }
};
