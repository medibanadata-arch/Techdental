<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * SEO rewrite of the four branch "More About" drawers.
     *
     * Fixes incorrect addresses/hours that existed in the old FAQ copy and
     * targets local-intent keywords such as "dental clinic in Mirpur",
     * "dentist in Uttara", "dental clinic in Badda" and "dentist Jatrabari".
     */
    public function up(): void
    {
        $now = now();

        $branches = [
            'mirpur' => [
                'seo_title' => 'Best Dental Clinic in Mirpur, Dhaka — Tech Dental Care',
                'meta_desc' => 'Tech Dental Mirpur in Shewrapara — painless root canal, dental implants, braces & scaling near Metro Rail Pillar 318. Open Sat–Thu, 10 AM–9 PM.',
                'more_about_title' => 'More About Our Dental Clinic in Mirpur',
                'content' => <<<'HTML'
<div class="space-y-4">
  <p><strong>Looking for the best dental clinic in Mirpur, Dhaka?</strong> Tech Dental Care's Mirpur branch is on the 2nd floor of 827 Begum Rokeya Sarani, Shewrapara — directly in front of Metro Rail Pillar No. 318 and a two-minute walk from Shewrapara Metro Station. Our BMDC-registered dental surgeons treat patients from Shewrapara, Kazipara, Mirpur 1, 2, 10, 11 and 12, Agargaon and Pirerbag with painless root canal treatment, dental implants, braces, crowns and scaling.</p>

  <h3>Dental Clinic in Shewrapara, Mirpur — Address, Hours & Contact</h3>
  <p>You will find us at <strong>827 (2nd Floor), Begum Rokeya Sarani, Shewrapara, Mirpur, Dhaka 1216</strong>, on the east side of the metro line. The chamber runs <strong>Saturday to Thursday, 10:00 AM–2:00 PM and 4:00 PM–9:00 PM</strong>; Friday is closed. For appointments call <strong>09638-000505</strong> or <a href="/appointment">book online</a>. Because the clinic sits beside the metro corridor, patients from Kazipara, Agargaon and Farmgate can reach us without a car, and there is roadside parking for cars and bikes on Begum Rokeya Sarani.</p>

  <h3>Dental Treatments at Our Mirpur Branch</h3>
  <ul>
    <li><strong>Root canal treatment:</strong> single-visit rotary and laser RCT from ৳8,000 for infected, aching teeth.</li>
    <li><strong>Dental implants:</strong> Osstem, Nobel and All-on-4 full-mouth solutions from ৳60,000.</li>
    <li><strong>Braces and aligners:</strong> metal, ceramic and clear aligner treatment from ৳40,000.</li>
    <li><strong>Crowns and bridges:</strong> zirconia, E-max and porcelain crowns from ৳6,000.</li>
    <li><strong>Scaling and polishing:</strong> ultrasonic cleaning from ৳1,990 for tartar, gum bleeding and bad breath.</li>
    <li><strong>Tooth extraction and wisdom tooth surgery:</strong> painless removal, including impacted molars.</li>
    <li><strong>Children's dentistry:</strong> check-ups, fluoride, fillings and milk-tooth extraction.</li>
    <li><strong>Teeth whitening and smile design:</strong> professional whitening, composite veneers and Hollywood smile packages.</li>
  </ul>

  <h3>Meet Our Dentists in Mirpur</h3>
  <p>Mirpur is our largest chamber and the base of our Medical Director, <strong>Prof. Dr. Nafees Uddin Chowdhury</strong> (BDS, PhD — Tokyo Medical and Dental University), who has 23+ years of experience in dental implants and oral surgery. <strong>Dr. Aysha Siddika</strong>, Assistant Medical Director, leads aesthetic dentistry and laser root canal cases, and <strong>Dr. Afsana Haque Joty</strong> is the branch in-charge. Orthodontic cases are handled by <strong>Dr. Md. Ashraful Hashem Johny</strong> (MS in Orthodontics) by schedule. You can compare every profile on our <a href="/doctors">doctors page</a>.</p>

  <h3>Why Patients in Mirpur Choose Tech Dental</h3>
  <ul>
    <li>BMDC-registered dentists with published registration numbers.</li>
    <li>Hospital-grade autoclave sterilisation and single-use disposables.</li>
    <li>Digital RVG X-ray (৳200) and full-mouth OPG (৳400) on site.</li>
    <li>Female dentists available for patients who prefer a lady doctor.</li>
    <li>Published, transparent pricing on our <a href="/price-list">treatment price list</a>.</li>
    <li>2,237+ verified patient reviews and evening hours for working patients.</li>
  </ul>

  <h3>How to Book a Dental Appointment in Mirpur</h3>
  <p>Call <strong>09638-000505</strong>, use the <a href="/appointment">online booking form</a>, or walk in during chamber hours. For severe toothache, swelling or a broken tooth, tell the receptionist when you call so we can arrange the earliest slot. Bring any previous X-rays, reports and a list of medicines you take. We accept cash, debit and credit cards, bKash, Nagad and Rocket.</p>
</div>
HTML,
                'faqs' => [
                    ['q' => 'Where is Tech Dental Mirpur located?', 'a' => 'Tech Dental Mirpur is at 827 (2nd Floor), Begum Rokeya Sarani, Shewrapara, Mirpur, Dhaka 1216 — on the east side of the metro line, in front of Metro Rail Pillar No. 318 and near Shewrapara Metro Station.'],
                    ['q' => 'What are the opening hours of the Mirpur branch?', 'a' => 'The Mirpur chamber is open Saturday to Thursday, 10:00 AM–2:00 PM and 4:00 PM–9:00 PM. Friday is closed.'],
                    ['q' => 'How much does a dental check-up cost in Mirpur?', 'a' => 'A general consultation costs ৳500 and a specialist consultation ৳1,000. A digital RVG X-ray is ৳200 and a full-mouth OPG is ৳400. Scaling and polishing starts at ৳1,990.'],
                    ['q' => 'Are female dentists available at the Mirpur branch?', 'a' => 'Yes. Most of our Mirpur dentists are women, including Assistant Medical Director Dr. Aysha Siddika and branch in-charge Dr. Afsana Haque Joty. You can request a female dentist when booking.'],
                    ['q' => 'Can I get dental implants and braces in Mirpur?', 'a' => 'Yes. Prof. Dr. Nafees Uddin Chowdhury performs dental implants and oral surgery at Mirpur, and our orthodontic team provides metal, ceramic and clear aligner treatment by schedule.'],
                    ['q' => 'How do I book an appointment at Tech Dental Mirpur?', 'a' => 'Call 09638-000505 or use the online appointment form. Share your preferred date and time and our team will confirm the slot by phone.'],
                ],
            ],
            'uttara' => [
                'seo_title' => 'Best Dental Clinic in Uttara, Dhaka — Tech Dental Care',
                'meta_desc' => 'Tech Dental Uttara at House 18, Road 14, Sector 3 — braces, implants, root canal & kids dentistry. Evening chamber 3–9 PM, Sat–Thu. Call 09638-000505.',
                'more_about_title' => 'More About Our Dental Clinic in Uttara',
                'content' => <<<'HTML'
<div class="space-y-4">
  <p><strong>Searching for a dental clinic in Uttara, Dhaka?</strong> Tech Dental Care's Uttara branch is at House 18, Road 14, Sector 3 — a short drive from Airport Road, House Building and Jasimuddin Avenue. Our BMDC-registered dentists serve families in Uttara Sectors 1–14, Nikunja, Khilkhet and Airport with braces, dental implants, root canal treatment, crowns and children's dentistry.</p>

  <h3>Dental Clinic in Uttara — Address, Hours & Contact</h3>
  <p>Our address is <strong>House 18, Road 14, Sector 3, Uttara, Dhaka 1230</strong>, close to Rajlaxmi Complex. The evening chamber runs <strong>Saturday to Thursday, 3:00 PM–9:00 PM</strong>; Friday is closed. Call <strong>09638-000505</strong> or <a href="/appointment">book online</a>. Roadside parking is available on Road 14, and the clinic is easy to reach from the Airport Road bus corridor and Uttara Sector 3 rickshaw stand.</p>

  <h3>Dental Treatments Available in Uttara</h3>
  <ul>
    <li><strong>Orthodontic treatment:</strong> metal braces, ceramic braces and clear aligners for children, teens and adults.</li>
    <li><strong>Dental implants:</strong> single-tooth and multiple-tooth replacement with Korean and European implant systems.</li>
    <li><strong>Root canal treatment:</strong> rotary and laser RCT, including single-visit treatment for front and back teeth.</li>
    <li><strong>Crowns, bridges and veneers:</strong> zirconia, porcelain and E-max restorations.</li>
    <li><strong>Scaling and polishing:</strong> ultrasonic cleaning and stain removal from ৳1,990.</li>
    <li><strong>Tooth extraction and wisdom tooth removal:</strong> painless surgical and simple extractions.</li>
    <li><strong>Children's dentistry:</strong> first check-ups, fluoride, fillings and habit correction.</li>
    <li><strong>Teeth whitening:</strong> in-clinic whitening and smile design packages.</li>
  </ul>

  <h3>Our Dentists in Uttara</h3>
  <p><strong>Dr. Roquaya Akhter</strong> (BDS, DU; PGT Oral &amp; Maxillofacial Surgery) sees general and aesthetic dental cases at the Uttara chamber, supported by our wider specialist team. Complex implant and orthodontic cases are planned with the Medical Director and our orthodontist, so you do not need to travel to another clinic for a second opinion. See all profiles on the <a href="/doctors">Tech Dental doctors page</a>.</p>

  <h3>Why Uttara Families Choose Tech Dental</h3>
  <ul>
    <li>BMDC-registered dental surgeons and published qualifications.</li>
    <li>Autoclave sterilisation and single-use instruments for every patient.</li>
    <li>Digital X-ray and OPG support for accurate diagnosis before treatment.</li>
    <li>Evening-only hours that fit school and office schedules.</li>
    <li>Transparent prices published on our <a href="/price-list">dental price list</a>.</li>
    <li>850+ verified patient reviews from the Uttara community.</li>
  </ul>

  <h3>How to Book a Dentist in Uttara</h3>
  <p>Call <strong>09638-000505</strong>, submit the <a href="/appointment">appointment form</a>, or visit during chamber hours. Tell us if you need braces consultation, an implant opinion or a child's first dental visit so we can allocate the right specialist and enough time. We accept cash, cards, bKash, Nagad and Rocket.</p>
</div>
HTML,
                'faqs' => [
                    ['q' => 'Where is Tech Dental Uttara located?', 'a' => 'Tech Dental Uttara is at House 18, Road 14, Sector 3, Uttara, Dhaka 1230, near Rajlaxmi Complex and within easy reach of Airport Road and House Building.'],
                    ['q' => 'What time does the Uttara branch open?', 'a' => 'The Uttara chamber operates Saturday to Thursday, 3:00 PM–9:00 PM. Friday is closed.'],
                    ['q' => 'Do you offer braces and clear aligners in Uttara?', 'a' => 'Yes. We provide metal braces, ceramic braces, self-ligating braces and clear aligners. An orthodontic consultation includes a bite assessment and a written treatment plan with cost.'],
                    ['q' => 'Can I get a dental implant in Uttara?', 'a' => 'Yes. Implant cases are planned with digital X-ray or OPG assessment and placed by our implant team. Korean Osstem implants start from ৳60,000.'],
                    ['q' => 'Is there a female dentist at the Uttara branch?', 'a' => 'Yes. Dr. Roquaya Akhter and other female dentists see patients at Uttara. Request a lady doctor when booking if you prefer.'],
                    ['q' => 'How do I book an appointment at Tech Dental Uttara?', 'a' => 'Call 09638-000505 or use the online appointment form. Our team confirms your slot by phone.'],
                ],
            ],
            'badda' => [
                'seo_title' => 'Best Dental Clinic in Badda, Dhaka — Tech Dental Care',
                'meta_desc' => 'Tech Dental Badda at North Badda Bazar — root canal, implants, braces & scaling for Badda, Rampura & Gulshan. Open 3–9 PM, Sat–Thu. Call 09638-000505.',
                'more_about_title' => 'More About Our Dental Clinic in Badda',
                'content' => <<<'HTML'
<div class="space-y-4">
  <p><strong>Looking for a trusted dental clinic in Badda, Dhaka?</strong> Tech Dental Care's Badda branch is on the 3rd floor of Haji Abdur Rashid Mansion, North Badda Bazar — the building above Krishi Bank. Patients come to us from Badda, Rampura, Merul Badda, Gulshan 1, Hatirjheel and Aftabnagar for painless root canal treatment, dental implants, braces, crowns and scaling.</p>

  <h3>Dental Clinic in North Badda — Address, Hours & Contact</h3>
  <p>Find us at <strong>Haji Abdur Rashid Mansion (3rd Floor), North Badda Bazar, Badda, Dhaka 1212</strong>, on the 3rd floor of the Krishi Bank building. The chamber is open <strong>Saturday to Thursday, 3:00 PM–9:00 PM</strong>; Friday is closed. Call <strong>09638-000505</strong> or <a href="/appointment">book an appointment online</a>. The clinic is a short ride from Rampura Bridge and Hatirjheel, with easy access from Pragati Sarani and Gulshan 1.</p>

  <h3>Dental Treatments at Our Badda Branch</h3>
  <ul>
    <li><strong>Root canal treatment:</strong> single-visit rotary and laser RCT from ৳8,000.</li>
    <li><strong>Dental implants:</strong> single and multiple tooth replacement, including All-on-4 consultation.</li>
    <li><strong>Braces and aligners:</strong> metal, ceramic and invisible aligner treatment from ৳40,000.</li>
    <li><strong>Crowns and bridges:</strong> zirconia, porcelain and metal-ceramic crowns.</li>
    <li><strong>Scaling and polishing:</strong> ultrasonic cleaning from ৳1,990 for gum health and fresh breath.</li>
    <li><strong>Wisdom tooth surgery:</strong> painless removal of impacted and partially erupted molars.</li>
    <li><strong>Composite fillings and veneers:</strong> tooth-coloured restorations and smile correction.</li>
    <li><strong>Children's dentistry:</strong> check-ups, fluoride and milk-tooth treatment.</li>
  </ul>

  <h3>Our Dentists in Badda</h3>
  <p><strong>Dr. Hasna Hena Bhuiyan Nishi</strong> and <strong>Dr. Reshma Islam</strong> see general, aesthetic and paediatric cases at the Badda chamber, while <strong>Dr. Sanjida Farabi</strong> (PGT Conservative Dentistry &amp; Endodontics) handles root canal and restorative work. Implant and orthodontic cases are planned with our specialist team. Browse every profile on the <a href="/doctors">doctors page</a>.</p>

  <h3>Why Patients in Badda Choose Tech Dental</h3>
  <ul>
    <li>BMDC-registered dentists with BDS degrees and post-graduate training.</li>
    <li>Hospital-grade sterilisation and single-use disposables.</li>
    <li>Digital X-ray and OPG for accurate diagnosis.</li>
    <li>Female dentists available for women and children.</li>
    <li>Transparent pricing on our <a href="/price-list">treatment price list</a>.</li>
    <li>1,854+ verified patient reviews and evening hours after office.</li>
  </ul>

  <h3>How to Book a Dentist in Badda</h3>
  <p>Call <strong>09638-000505</strong>, use the <a href="/appointment">online form</a>, or walk in between 3:00 PM and 9:00 PM. For toothache, swelling or a broken tooth, mention it while booking so we can prioritise you. We accept cash, debit and credit cards, bKash, Nagad and Rocket.</p>
</div>
HTML,
                'faqs' => [
                    ['q' => 'Where is Tech Dental Badda located?', 'a' => 'Tech Dental Badda is at Haji Abdur Rashid Mansion (3rd Floor), North Badda Bazar, Badda, Dhaka 1212 — the building above Krishi Bank.'],
                    ['q' => 'What are the Badda branch opening hours?', 'a' => 'The Badda chamber is open Saturday to Thursday, 3:00 PM–9:00 PM. Friday is closed.'],
                    ['q' => 'Which areas do patients come from to the Badda clinic?', 'a' => 'Most patients travel from Badda, Rampura, Merul Badda, Gulshan 1, Hatirjheel and Aftabnagar. The clinic is close to Rampura Bridge and Pragati Sarani.'],
                    ['q' => 'Do you provide braces and aligners in Badda?', 'a' => 'Yes. Metal braces, ceramic braces and clear aligners are available. Orthodontic consultations include a bite assessment and a written plan with cost.'],
                    ['q' => 'How much does scaling and polishing cost in Badda?', 'a' => 'Ultrasonic scaling and polishing starts at ৳1,990. The final price depends on tartar buildup and gum condition, and is confirmed before treatment.'],
                    ['q' => 'How do I book an appointment at Tech Dental Badda?', 'a' => 'Call 09638-000505 or submit the online appointment form. Our team will confirm your preferred time by phone.'],
                ],
            ],
            'jatrabari' => [
                'seo_title' => 'Best Dental Clinic in Jatrabari, Dhaka — Tech Dental Care',
                'meta_desc' => 'Tech Dental Jatrabari on Shahid Faruk Road — painless root canal, implants, crowns & braces near Jatrabari Chowrasta. Open 3–9 PM, Sat–Thu. Call 09638-000505.',
                'more_about_title' => 'More About Our Dental Clinic in Jatrabari',
                'content' => <<<'HTML'
<div class="space-y-4">
  <p><strong>Need a dental clinic in Jatrabari, Dhaka?</strong> Tech Dental Care's Jatrabari branch is on Shahid Faruk Road, South Jatrabari — close to Jatrabari Chowrasta and the Mayor Hanif Flyover. Our BMDC-registered dentists serve families from Jatrabari, Sayedabad, Dhalpur, Konapara, Demra and Shanir Akhra with painless root canal treatment, crowns, braces, dental implants and scaling.</p>

  <h3>Dental Clinic in South Jatrabari — Address, Hours & Contact</h3>
  <p>Our address is <strong>Shahid Faruk Road, South Jatrabari, Dhaka 1204</strong>, centrally located near Jatrabari Chowrasta. The chamber runs <strong>Saturday to Thursday, 3:00 PM–9:00 PM</strong>; Friday is closed. Call <strong>09638-000505</strong> or <a href="/appointment">book online</a>. The clinic is easy to reach by bus from Sayedabad, Demra and Motijheel, and by rickshaw from Dhalpur and Konapara.</p>

  <h3>Dental Treatments Available in Jatrabari</h3>
  <ul>
    <li><strong>Root canal treatment:</strong> single-visit rotary and laser RCT from ৳8,000 for painful, infected teeth.</li>
    <li><strong>Crowns and bridges:</strong> zirconia, porcelain and metal-ceramic caps that restore chewing.</li>
    <li><strong>Teeth braces:</strong> metal and ceramic braces for crooked teeth, gaps and overbite.</li>
    <li><strong>Dental implants:</strong> permanent tooth replacement with Korean and European systems.</li>
    <li><strong>Scaling and polishing:</strong> ultrasonic cleaning from ৳1,990 for bleeding gums and bad breath.</li>
    <li><strong>Tooth extraction and wisdom tooth surgery:</strong> painless simple and surgical extractions.</li>
    <li><strong>Fillings and veneers:</strong> tooth-coloured composite restorations and gap closure.</li>
    <li><strong>Children's dentistry:</strong> check-ups, fluoride and milk-tooth extraction.</li>
  </ul>

  <h3>Our Dentists in Jatrabari</h3>
  <p><strong>Dr. Afsana Mim</strong> (BDS, DU; PGT Oral &amp; Maxillofacial Surgery) leads the Jatrabari chamber, with a focus on fillings, root canal treatment, crowns and bridges, scaling and single-visit tooth-gap correction. Complex implant and orthodontic cases are planned with our Medical Director and orthodontist. See all profiles on the <a href="/doctors">doctors page</a>.</p>

  <h3>Why Families in Jatrabari Choose Tech Dental</h3>
  <ul>
    <li>BMDC-registered dental surgeons with published qualifications.</li>
    <li>Autoclave sterilisation and single-use instruments.</li>
    <li>Digital X-ray for accurate, same-day diagnosis.</li>
    <li>Female dentist available for women and children.</li>
    <li>Transparent prices on our <a href="/price-list">dental treatment price list</a>.</li>
    <li>1,120+ verified patient reviews and evening hours for working families.</li>
  </ul>

  <h3>How to Book a Dentist in Jatrabari</h3>
  <p>Call <strong>09638-000505</strong>, submit the <a href="/appointment">appointment form</a>, or visit during chamber hours. Tell us about tooth pain, swelling or a broken tooth when booking so we can arrange an early slot. We accept cash, cards, bKash, Nagad and Rocket.</p>
</div>
HTML,
                'faqs' => [
                    ['q' => 'Where is Tech Dental Jatrabari located?', 'a' => 'Tech Dental Jatrabari is on Shahid Faruk Road, South Jatrabari, Dhaka 1204, close to Jatrabari Chowrasta and the Mayor Hanif Flyover.'],
                    ['q' => 'What are the opening hours of the Jatrabari branch?', 'a' => 'The Jatrabari chamber is open Saturday to Thursday, 3:00 PM–9:00 PM. Friday is closed.'],
                    ['q' => 'Do you offer painless tooth extraction in Jatrabari?', 'a' => 'Yes. Our dentists perform simple and surgical extractions, including impacted wisdom teeth, with modern local anaesthesia to keep the procedure comfortable.'],
                    ['q' => 'Can I get braces or a root canal in Jatrabari?', 'a' => 'Yes. Root canal treatment is available at the chamber, and orthodontic cases are assessed and planned with our orthodontist. Braces start from ৳40,000.'],
                    ['q' => 'How much is a dental consultation in Jatrabari?', 'a' => 'A general consultation costs ৳500 and a specialist consultation ৳1,000. A digital X-ray is ৳200 and OPG is ৳400.'],
                    ['q' => 'How do I book an appointment at Tech Dental Jatrabari?', 'a' => 'Call 09638-000505 or use the online booking form. Our team will confirm your slot by phone.'],
                ],
            ],
        ];

        foreach ($branches as $slug => $branch) {
            DB::table('locations')->where('slug', $slug)->update([
                'seo_title' => $branch['seo_title'],
                'meta_desc' => $branch['meta_desc'],
                'more_about_title' => $branch['more_about_title'],
                'seo_content' => $branch['content'],
                'faqs' => json_encode($branch['faqs'], JSON_UNESCAPED_UNICODE),
                'canonical_url' => 'https://techdentalcare.com/branch/' . $slug,
                'robots_index' => 1,
                'robots_follow' => 1,
                'updated_at' => $now,
            ]);
        }
    }

    /**
     * Content migration — intentionally irreversible so a rollback never
     * brings back the mismatched addresses and hours from the old copy.
     */
    public function down(): void
    {
        //
    }
};
