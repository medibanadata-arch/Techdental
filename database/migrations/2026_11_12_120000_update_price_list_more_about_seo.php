<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * SEO rewrite of the /price-list "More About" drawer.
     *
     * Targets commercial-intent price queries: dental treatment price in
     * Bangladesh, root canal cost in Dhaka, dental implant price, braces cost.
     * All figures come from `price_rows` so the page stays truthful.
     */
    public function up(): void
    {
        $now = now();

        $content = <<<'HTML'
<div class="space-y-4">
  <p><strong>How much does dental treatment cost in Bangladesh?</strong> At Tech Dental Care the answer is published, not negotiated at the chair. Every treatment we offer — from a ৳500 consultation to a full-mouth implant case — is listed below and on the price table above in both BDT and USD, across our Mirpur, Uttara, Badda and Jatrabari branches in Dhaka.</p>

  <h3>Dental Treatment Prices in Dhaka (2026)</h3>
  <ul>
    <li><strong>Doctor consultation:</strong> ৳500 (BDS dentist) / ৳1,000 (senior specialist)</li>
    <li><strong>Digital X-ray:</strong> ৳200 for a single-tooth RVG, ৳400 for a full-mouth OPG</li>
    <li><strong>Ultrasonic scaling &amp; polishing:</strong> ৳1,990; advanced scaling ৳3,500</li>
    <li><strong>Composite filling:</strong> ৳1,500 – ৳6,000 depending on material and tooth</li>
    <li><strong>Standard root canal (RCT):</strong> ৳8,000; single-visit RCT ৳10,000</li>
    <li><strong>Crowns:</strong> PFM from ৳8,000; zirconia from ৳20,000; E-max ৳30,000</li>
    <li><strong>Braces:</strong> ৳40,000 – ৳70,000 for traditional metal braces</li>
    <li><strong>Dental implant:</strong> ৳60,000 – ৳80,000 for a Korean Osstem implant</li>
    <li><strong>Laser teeth whitening:</strong> ৳15,000 per session</li>
  </ul>

  <h3>Root Canal Treatment Cost in Dhaka</h3>
  <p>Root canal treatment removes the infected nerve from a painful or abscessed tooth and saves it from extraction. A front-tooth or back-tooth RCT is <strong>৳8,000</strong>, a single-visit RCT is <strong>৳10,000</strong>, re-treatment of a failed root canal is <strong>৳12,000</strong>, and a root canal on a wisdom tooth costs <strong>৳10,000</strong>. The final fee depends on the number of canals, whether the tooth needs a post, and whether a crown is placed afterwards. See the full <a href="/services/tooth-root-canal-cost-bd">root canal treatment guide</a>.</p>

  <h3>Dental Implant Price in Bangladesh</h3>
  <p>Implant cost is driven mainly by the implant brand and whether bone grafting is needed. Mini implants start at <strong>৳35,000–৳50,000</strong>, Korean Osstem implants at <strong>৳60,000–৳80,000</strong>, USA premium implants at <strong>৳1,00,000–৳1,20,000</strong> and German Nobel implants at <strong>৳1,20,000–৳1,50,000</strong>. Full-mouth All-on-4 treatment is <strong>৳3,50,000–৳5,00,000</strong> per jaw, and bone grafting is <strong>৳20,000–৳50,000</strong> per area when required. Read the <a href="/services/dental-implants-cost-in-bangladesh">dental implant cost guide</a> before booking a consultation.</p>

  <h3>Braces and Clear Aligner Cost in Bangladesh</h3>
  <p>Traditional metal braces cost <strong>৳40,000–৳70,000</strong>, ceramic tooth-coloured braces <strong>৳50,000–৳90,000</strong> and lingual braces <strong>৳1,20,000–৳1,50,000</strong>. If you prefer removable aligners, local clear aligners are <strong>৳1,80,000–৳2,50,000</strong> and Invisalign <strong>৳3,50,000–৳5,00,000</strong>. Retainers cost ৳5,000–৳6,000 per jaw. Compare options on our <a href="/services/teeth-braces-cost-bangladesh">braces cost page</a>.</p>

  <h3>Crown, Bridge and Veneer Prices</h3>
  <p>A full metal crown starts at <strong>৳6,000</strong>, PFM crowns at <strong>৳8,000–৳10,000</strong>, zirconia crowns at <strong>৳20,000–৳25,000</strong> and E-max crowns at <strong>৳30,000</strong>. Direct composite veneers start at <strong>৳5,000</strong> per tooth, zirconia veneers at <strong>৳12,000</strong> and E-max veneers at <strong>৳25,000</strong>. A Hollywood smile package using direct composite veneers is <strong>৳70,000</strong>.</p>

  <h3>What Changes the Final Price?</h3>
  <ul>
    <li><strong>Tooth position and canal count:</strong> molars take longer than front teeth.</li>
    <li><strong>Material choice:</strong> zirconia and E-max cost more than metal or PFM.</li>
    <li><strong>Bone quality:</strong> grafting or a sinus lift adds to implant cost.</li>
    <li><strong>Extra visits:</strong> re-treatment, posts and temporary crowns.</li>
    <li><strong>Specialist involvement:</strong> implantology and orthodontics carry a specialist fee.</li>
  </ul>
  <p>Nothing is added silently. After examination and X-ray, you receive a written estimate that lists every procedure, material and follow-up before treatment begins.</p>

  <h3>Payment, Instalments and Warranty</h3>
  <p>We accept cash, debit and credit cards, bKash, Nagad and Rocket. Instalment options can be discussed for braces, aligners and implant cases at consultation. Crown, bridge and implant warranty terms are explained in writing with your treatment plan, along with the follow-up schedule.</p>

  <h3>Get an Exact Quote for Your Treatment</h3>
  <p>Book a ৳500 consultation at your nearest branch — <a href="/branch/mirpur">Mirpur</a>, <a href="/branch/uttara">Uttara</a>, <a href="/branch/badda">Badda</a> or <a href="/branch/jatrabari">Jatrabari</a> — or call <strong>09638-000505</strong>. We will examine the tooth, take a digital X-ray if needed, and give you a written quote the same day.</p>
</div>
HTML;

        $faqs = [
            ['q' => 'How much does a dental check-up cost in Dhaka?', 'a' => 'A general consultation with a BDS dentist costs ৳500 and a senior specialist consultation ৳1,000. A digital RVG X-ray is ৳200 and a full-mouth OPG is ৳400.'],
            ['q' => 'What is the cost of root canal treatment in Bangladesh?', 'a' => 'A standard root canal costs ৳8,000, a single-visit RCT ৳10,000, re-treatment ৳12,000 and a root canal on a wisdom tooth ৳10,000. The final price depends on the number of canals and whether a crown is needed.'],
            ['q' => 'How much do dental implants cost in Bangladesh?', 'a' => 'Mini implants start at ৳35,000–৳50,000, Korean Osstem implants at ৳60,000–৳80,000, USA premium implants at ৳1,00,000–৳1,20,000 and German Nobel implants at ৳1,20,000–৳1,50,000. Bone grafting, if required, costs ৳20,000–৳50,000 per area.'],
            ['q' => 'How much do braces cost in Dhaka?', 'a' => 'Metal braces cost ৳40,000–৳70,000, ceramic braces ৳50,000–৳90,000 and lingual braces ৳1,20,000–৳1,50,000. Local clear aligners are ৳1,80,000–৳2,50,000 and Invisalign ৳3,50,000–৳5,00,000.'],
            ['q' => 'Are prices the same at every Tech Dental branch?', 'a' => 'Yes. Our published price list applies across Mirpur, Uttara, Badda and Jatrabari. Any difference is explained in your written estimate before treatment starts.'],
            ['q' => 'Are there hidden charges after treatment begins?', 'a' => 'No. After examination and X-ray you receive a written estimate listing every procedure, material and follow-up. Additional treatment is only added with your approval.'],
            ['q' => 'Which payment methods do you accept?', 'a' => 'We accept cash, debit and credit cards, bKash, Nagad and Rocket. Instalment options can be discussed for braces, aligners and implant cases.'],
        ];

        DB::table('price_settings')->updateOrInsert(
            ['id' => 1],
            [
                'page_title' => 'Dental Treatment Price List in Bangladesh – 2026',
                'seo_title' => 'Dental Treatment Price List in Bangladesh (2026) — Tech Dental',
                'seo_content' => $content,
                'meta_desc' => 'Updated dental treatment prices in Dhaka for root canal, implants, braces, crowns and scaling. Transparent BDT & USD rates at Tech Dental Care.',
                'canonical_url' => 'https://techdentalcare.com/price-list',
                'robots_index' => 1,
                'robots_follow' => 1,
                'schema_type' => 'MedicalBusiness',
                'faqs' => json_encode($faqs, JSON_UNESCAPED_UNICODE),
                'updated_at' => $now,
                'created_at' => $now,
            ]
        );
    }

    /**
     * Content migration — intentionally irreversible so a rollback never
     * restores the one-line placeholder copy.
     */
    public function down(): void
    {
        //
    }
};
