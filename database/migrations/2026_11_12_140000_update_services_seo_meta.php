<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Normalise English SEO titles and meta descriptions for all 20 services.
     *
     * Many old titles were lower-case or missing the year/keyword, and several
     * meta descriptions were raw feature dumps from the page template
     * ("Comfortable Pain-free Care Treatment Time 3–6 Months…") which read
     * badly in Google. Four services also had no English FAQs.
     */
    public function up(): void
    {
        $now = now();

        $meta = [
            1 => ['Dental Implant Cost in Bangladesh (2026)', 'Dental implant cost in Bangladesh starts from ৳60,000 for Osstem and ৳1,00,000+ for premium systems. Painless placement at Tech Dental Dhaka. Book now.'],
            2 => ['Teeth Replacement Cost in Bangladesh 2026', 'Compare teeth replacement costs in Bangladesh — implants, bridges and dentures — with a written quote from Tech Dental Care in Dhaka. Call 09638-000505.'],
            3 => ['Flexible Denture Cost in Bangladesh 2026', 'Flexible denture cost in Bangladesh starts from ৳10,000. Lightweight, metal-free partial dentures fitted at Tech Dental Care, Dhaka. Book a consultation.'],
            4 => ['Broken Tooth Treatment Cost in Bangladesh', 'Broken or chipped tooth? Composite restoration and crowns at Tech Dental Dhaka restore shape and colour, often in one visit. Call 09638-000505 for a quote.'],
            5 => ['Dental Bridge Cost in Bangladesh 2026', 'Dental bridge cost in Bangladesh starts from ৳8,000 per unit. Fixed, natural-looking tooth replacement at Tech Dental Care in Mirpur, Uttara, Badda & Jatrabari.'],
            6 => ['Zirconia Crown Price in Bangladesh 2026', 'Zirconia crown price in Bangladesh is ৳20,000–৳25,000 at Tech Dental. Metal-free, natural-looking caps fitted in two visits across Dhaka. Book now.'],
            7 => ['Wisdom Tooth Removal Cost in Bangladesh', 'Painless wisdom tooth removal under local anaesthesia at Tech Dental Dhaka. Surgical and impacted cases handled by experienced oral surgeons. Call 09638-000505.'],
            8 => ['Orthodontic Treatment Cost in Bangladesh', 'Orthodontic treatment cost in Bangladesh ranges from ৳40,000 for metal braces to ৳5,00,000 for Invisalign. Specialist orthodontist in Dhaka. Book a consultation.'],
            9 => ['Composite Filling Cost in Bangladesh 2026', 'Composite filling cost in Bangladesh starts from ৳1,500. Tooth-coloured nano-composite fillings at Tech Dental Care, Dhaka — same-day appointments available.'],
            10 => ['Composite Veneer Price in Bangladesh 2026', 'Composite veneer price in Bangladesh starts from ৳5,000 per tooth. Close gaps, chips and stains in one visit at Tech Dental Care, Dhaka. Book a smile consult.'],
            11 => ['Invisalign Price in Bangladesh 2026', 'Invisalign clear aligner price in Bangladesh starts from ৳3,50,000, with instalment options. 3D scan and USA treatment plan at Tech Dental Care, Dhaka.'],
            12 => ['Porcelain Crown Price in Bangladesh 2026', 'Porcelain crown price in Bangladesh starts from ৳8,000 (PFM) at Tech Dental. Natural-looking caps for damaged teeth, fitted in two visits across Dhaka.'],
            13 => ['Braces Cost in Bangladesh 2026 – Metal & Ceramic', 'Braces cost ৳40,000–৳70,000 for metal and ৳50,000–৳90,000 for ceramic in Bangladesh. Specialist orthodontist and instalment plans at Tech Dental Care, Dhaka.'],
            14 => ['Dental Crown / Teeth Cap Price in Bangladesh', 'Teeth cap price in Bangladesh from ৳6,000 for metal and ৳20,000 for zirconia. Protect root-treated and broken teeth at Tech Dental Care, Dhaka. Book now.'],
            15 => ['Teeth Gap Filling Cost in Bangladesh 2026', 'Close teeth gaps without braces from ৳3,500 with direct composite veneers at Tech Dental Care, Dhaka. Painless, single-visit treatment. Book a consultation.'],
            16 => ['Teeth Scaling & Polishing Price in Bangladesh', 'Teeth scaling and polishing in Dhaka from ৳1,990. Remove tartar, stains and bad breath with ultrasonic cleaning at Tech Dental Care. Book an appointment.'],
            17 => ['Tooth Extraction Cost in Bangladesh 2026', 'Tooth extraction in Dhaka with modern anaesthesia — simple and surgical wisdom tooth removal by experienced dentists at Tech Dental Care. Call 09638-000505.'],
            18 => ['Tooth Filling Cost in Bangladesh 2026', 'Tooth filling cost in Bangladesh starts from ৳1,500 for composite. Repair cavities and chipped teeth at Tech Dental Care, Dhaka. Same-day appointments.'],
            19 => ['Root Canal Treatment Cost in Bangladesh 2026', 'Root canal treatment cost in Bangladesh starts from ৳8,000; single-visit RCT ৳10,000. Painless laser and rotary treatment at Tech Dental Care, Dhaka.'],
            20 => ['Teeth Whitening Cost in Bangladesh 2026', 'Teeth whitening cost in Bangladesh is ৳15,000 per session at Tech Dental. Laser in-clinic whitening with instant results across Dhaka. Book a consultation.'],
        ];

        foreach ($meta as $id => [$title, $desc]) {
            $slug = DB::table('services')->where('id', $id)->value('slug');
            DB::table('services')->where('id', $id)->update([
                'seo_title' => $title,
                'meta_desc' => $desc,
                'canonical_url' => 'https://techdentalcare.com/service/' . $slug,
                'robots_index' => 1,
                'robots_follow' => 1,
                'updated_at' => $now,
            ]);
        }

        $faqs = [
            10 => [
                ['q' => 'How much do composite veneers cost in Bangladesh?', 'a' => 'Direct composite veneers start from ৳5,000 per tooth at Tech Dental Care. The final cost depends on how many teeth are treated and whether gap closure or whitening is combined.'],
                ['q' => 'Can composite veneers be done in one visit?', 'a' => 'In most cases yes. Direct composite veneers are built and shaped directly on the tooth in a single appointment of one to two hours, with no laboratory waiting time.'],
                ['q' => 'How long do composite veneers last?', 'a' => 'With good oral hygiene and regular polishing, composite veneers typically last 5 to 10 years. They can be repaired or polished without replacing the whole veneer.'],
            ],
            11 => [
                ['q' => 'How much does Invisalign cost in Bangladesh?', 'a' => 'Invisalign at Tech Dental Care starts from ৳3,50,000 and can go up to ৳5,00,000 depending on case complexity. Local clear aligner options start from ৳1,80,000.'],
                ['q' => 'Is Invisalign available with instalments?', 'a' => 'Yes. Invisalign treatment can be paid in instalments; the schedule is explained in your written orthodontic plan after the 3D scan and consultation.'],
                ['q' => 'How long does Invisalign treatment take?', 'a' => 'Most cases take 12 to 24 months. You change aligners every one to two weeks and wear them 20–22 hours a day for the plan to stay on schedule.'],
            ],
            15 => [
                ['q' => 'How much does teeth gap filling cost in Bangladesh?', 'a' => 'Direct composite gap closure at Tech Dental Care starts from ৳3,500 and depends on the number of gaps and how much composite build-up is needed.'],
                ['q' => 'Can gaps be closed without braces?', 'a' => 'Small gaps and chipped edges can often be closed with direct composite veneers in one visit. Large gaps, missing teeth or bite problems may need braces, aligners or a bridge instead.'],
                ['q' => 'Are composite gap fillings permanent?', 'a' => 'They are long-lasting but not permanent. With good hygiene and regular polishing they usually last 5 to 10 years and can be repaired without replacing the whole restoration.'],
            ],
            16 => [
                ['q' => 'How much does scaling and polishing cost in Dhaka?', 'a' => 'Ultrasonic scaling and polishing starts at ৳1,990 at Tech Dental Care; advanced scaling is ৳3,500 and deep scaling per jaw is ৳5,000–৳8,000.'],
                ['q' => 'How often should I get scaling done?', 'a' => 'Most patients benefit from scaling every 6 to 12 months. Smokers, diabetics and patients with gum disease may need it more often, as advised by the dentist.'],
                ['q' => 'Does scaling make teeth loose or weak?', 'a' => 'No. Scaling removes hardened tartar, not tooth structure. Teeth may feel sensitive for a day or two because the tartar that covered the gum line has been removed.'],
            ],
        ];

        foreach ($faqs as $id => $list) {
            DB::table('services')->where('id', $id)->update([
                'faqs' => json_encode($list, JSON_UNESCAPED_UNICODE),
                'updated_at' => $now,
            ]);
        }

        // Use the canonical singular /service/{slug} URL inside existing content.
        DB::table('doctor_settings')->where('id', 1)->update([
            'seo_content' => DB::raw("replace(seo_content, 'href=\"/services/', 'href=\"/service/')"),
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
