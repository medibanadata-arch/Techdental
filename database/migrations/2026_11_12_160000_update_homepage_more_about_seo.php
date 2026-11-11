<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Homepage "More about Tech Dental" SEO rewrite.
     *
     * The old FAQ block carried wrong branch addresses (Uttara Sector 7,
     * Badda Pragati Sarani), the old hotline (01400786162) and the retired
     * techdentalbd.com domain. The new copy targets "best dental clinic in
     * Dhaka", "dentist in Mirpur / Uttara / Badda / Jatrabari" and the
     * high-intent treatment + price queries.
     */
    public function up(): void
    {
        $now = now();

        $content = <<<'HTML'
<div class="space-y-4">
  <h3>Best Dental Clinic in Dhaka — Four Branches, One Standard of Care</h3>
  <p><strong>Looking for the best dental clinic in Dhaka?</strong> Tech Dental Care has been treating families since 2018 and now runs four full-service dental clinics in <a href="/branch/mirpur">Mirpur (Shewrapara)</a>, <a href="/branch/uttara">Uttara</a>, <a href="/branch/badda">Badda</a> and <a href="/branch/jatrabari">Jatrabari</a>. Fourteen BMDC-registered dental surgeons — including implantologists, orthodontists, endodontists and oral &amp; maxillofacial surgeons — work to one clinical protocol, so you can move from a ৳500 check-up to a full-mouth implant case without changing clinics or repeating tests.</p>

  <h3>Dental Treatments We Offer in Dhaka</h3>
  <ul>
    <li><strong>Root canal treatment (RCT):</strong> rotary and laser RCT, often completed in a single visit — from ৳8,000. See the <a href="/service/tooth-root-canal-cost-bd">root canal cost in Dhaka</a>.</li>
    <li><strong>Dental implants:</strong> Osstem, Nobel and All-on-4 full-mouth rehabilitation — from ৳60,000. See the <a href="/service/dental-implants-cost-in-bangladesh">dental implant price in Bangladesh</a>.</li>
    <li><strong>Braces and clear aligners:</strong> metal, ceramic and self-ligating braces plus Invisalign — from ৳40,000. See the <a href="/service/orthodontic-treatment-cost-bangladesh">orthodontic treatment cost</a>.</li>
    <li><strong>Scaling and polishing:</strong> ultrasonic cleaning for tartar, bleeding gums and bad breath — from ৳1,990.</li>
    <li><strong>Crowns, bridges and veneers:</strong> zirconia, E-max and porcelain restorations matched to your natural shade.</li>
    <li><strong>Tooth extraction and wisdom tooth surgery:</strong> painless simple and surgical removal, including impacted molars.</li>
    <li><strong>Teeth whitening and smile design:</strong> in-clinic laser whitening, composite veneers and Hollywood smile packages.</li>
    <li><strong>Children's dentistry:</strong> first check-ups, fluoride, fillings and milk-tooth extraction.</li>
  </ul>

  <h3>Your First Appointment, Step by Step</h3>
  <ol>
    <li><strong>Book a slot:</strong> call <strong>09638-000505</strong>, message on WhatsApp or use the <a href="/appointment">online appointment form</a>. Tell us your main concern so the right specialist is scheduled.</li>
    <li><strong>Consultation and examination:</strong> the dentist listens to your history, examines the teeth and gums, and explains what is happening in plain language.</li>
    <li><strong>Digital imaging if needed:</strong> an RVG X-ray (৳200) or full-mouth OPG (৳400) is taken only when it will change the diagnosis or treatment plan.</li>
    <li><strong>Written treatment plan:</strong> you receive the recommended options, the number of visits and a transparent cost estimate before anything begins.</li>
    <li><strong>Treatment and follow-up:</strong> care is delivered in the fewest comfortable visits possible, with aftercare instructions and a review appointment.</li>
  </ol>

  <h3>Meet Our Dentists in Dhaka</h3>
  <p><a href="/doctors">Fourteen dental surgeons</a> cover every major specialty, and twelve of them are women — so patients who prefer a lady dentist can request one at any branch. <strong>Prof. Dr. Nafees Uddin Chowdhury</strong> (BDS, PhD — Tokyo Medical and Dental University) is the Medical Director with 23+ years in implants and oral surgery. <strong>Dr. Md. Ashraful Hashem Johny</strong> (MS in Orthodontics) leads braces and aligner cases, and <strong>Dr. Aysha Siddika</strong>, Assistant Medical Director, specialises in aesthetic dentistry and painless laser root canal treatment.</p>

  <h3>Clear Pricing and Payment Options</h3>
  <p>Dental treatment should never come with surprise bills. Every fee is published on our <a href="/price-list">dental treatment price list</a> in BDT and USD, and each plan is quoted in writing before treatment starts. We accept cash, debit and credit cards, bKash, Nagad and Rocket, and instalment options can be discussed for braces, aligners and implant cases. Corporate and insurance patients can use cashless benefits at any branch.</p>

  <h3>Safety, Sterilisation and Patient Rights</h3>
  <p>Every patient is treated under a published bill of rights covering privacy, informed consent and the right to a second opinion. Instruments are autoclaved, disposables are single-use, and every clinic follows the same infection-control checklist. Digital records let any branch pick up your treatment exactly where the last visit stopped.</p>

  <h3>Care for International and Out-of-City Patients</h3>
  <p>Patients travelling from outside Dhaka, and Bangladeshis living abroad, can start with an online or video consultation. Records and X-rays can be shared in advance, a provisional plan and budget prepared before travel, and appointments grouped into a short visit so treatment fits around a trip home.</p>

  <h3>Book a Dentist in Dhaka Today</h3>
  <p>Call our hotline <strong>09638-000505</strong> or <a href="/appointment">book an appointment online</a>. For toothache, swelling, a broken tooth or a dental emergency, mention it while booking so we can prioritise your visit. Not sure which treatment you need? Start with a ৳500 consultation and digital X-ray — our dentist will explain every option before anything begins.</p>
</div>
HTML;

        $faqs = [
            ['q' => 'Which is the best dental clinic in Dhaka for implants and braces?', 'a' => 'Tech Dental Care is a four-branch dental network in Dhaka with 14 BMDC-registered dentists, including a dedicated implantologist and an MS-qualified orthodontist. Implants start from ৳60,000 and braces from ৳40,000, with a written treatment plan and price before treatment begins.'],
            ['q' => 'Where are the Tech Dental Care branches in Dhaka?', 'a' => 'Mirpur: 827 (2nd Floor), Begum Rokeya Sarani, Shewrapara, Dhaka 1216 — beside Metro Rail Pillar 318. Uttara: House 18, Road 14, Sector 3, Dhaka 1230. Badda: Haji Abdur Rashid Mansion (3rd Floor), North Badda Bazar, Dhaka 1212. Jatrabari: Shahid Faruk Road, South Jatrabari, Dhaka 1204.'],
            ['q' => 'What are the opening hours of Tech Dental Care?', 'a' => 'Mirpur is open Saturday to Thursday, 10:00 AM–2:00 PM and 4:00 PM–9:00 PM. Uttara, Badda and Jatrabari hold evening chambers from 3:00 PM to 9:00 PM. All branches are closed on Friday.'],
            ['q' => 'How much does a dental check-up cost in Dhaka?', 'a' => 'A general consultation with a BDS dentist costs ৳500 and a senior specialist consultation ৳1,000. A digital RVG X-ray is ৳200 and a full-mouth OPG is ৳400. Scaling and polishing starts at ৳1,990.'],
            ['q' => 'How do I book an appointment at Tech Dental Care?', 'a' => 'Call or WhatsApp 09638-000505, or use the online appointment form at techdentalcare.com/appointment. Share your name, phone number, preferred branch and time, and our team confirms the slot by phone.'],
            ['q' => 'Do you have female dentists in Dhaka?', 'a' => 'Yes. Twelve of our 14 dental surgeons are women, including Assistant Medical Director Dr. Aysha Siddika. Female patients, mothers and children can request a lady doctor at any branch when booking.'],
            ['q' => 'Do you provide emergency dental care?', 'a' => 'Yes. We keep slots for severe toothache, swelling, broken teeth and post-extraction problems, and offer 24/7 on-call advice on the hotline. Call 09638-000505 and describe the problem so we can arrange the earliest visit.'],
            ['q' => 'Which payment methods do you accept?', 'a' => 'We accept cash, debit and credit cards, bKash, Nagad, Rocket and Bangla QR. Instalment options can be discussed for braces, aligners and implant treatment, and corporate or insurance patients can use cashless benefits.'],
        ];

        DB::table('home_content')->update([
            'about_caption' => 'More About Tech Dental Care — Dental Clinic in Dhaka',
            'about_text' => $content,
            'faqs' => json_encode($faqs, JSON_UNESCAPED_UNICODE),
            'canonical_url' => 'https://techdentalcare.com/',
            'updated_at' => $now,
        ]);
    }

    /**
     * Content migration — intentionally irreversible.
     */
    public function down(): void
    {
        //
    }
};
