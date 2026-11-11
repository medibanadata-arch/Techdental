<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Unique, keyword-focused "More About" content for all 14 doctor profiles.
     *
     * Previous rows reused one template (and many had seo_title set to the
     * doctor's own name, producing titles like "Dr. X – Dr. X"). Each profile
     * now targets "{specialty} in {area}, Dhaka" with its own copy and FAQs.
     */
    public function up(): void
    {
        $now = now();

        $doctors = [
            1 => [
                'seo_title' => 'Aesthetic Dentist in Mirpur, Dhaka',
                'meta_desc' => 'Dr. Aysha Siddika is Assistant Medical Director at Tech Dental Mirpur — aesthetic dentistry and painless laser root canal. BMDC 7897. Call 09638-000505.',
                'content' => <<<'HTML'
<div class="space-y-4">
  <p><strong>Dr. Aysha Siddika</strong> is the Assistant Medical Director of Tech Dental Care and a senior aesthetic dentist at our <a href="/branch/mirpur">Mirpur branch in Shewrapara, Dhaka</a>. With 8 years of clinical experience and BMDC registration no. 7897, she is best known for natural-looking smile makeovers and painless single-visit laser root canal treatment.</p>

  <h3>About Dr. Aysha Siddika</h3>
  <p>She completed her BDS at Shaheed Suhrawardy Medical College and Hospital, followed by post-graduate training in Oral &amp; Maxillofacial Surgery and Conservative Dentistry, plus special training in aesthetic dentistry. That combination lets her treat both the function and the appearance of a tooth — a filling that matches the enamel, a crown that sits naturally, or a veneer that fits the smile line.</p>

  <h3>Treatments & Expertise</h3>
  <ul>
    <li><strong>Smile design:</strong> direct composite veneers, Hollywood smile packages and tooth-gap closure without braces.</li>
    <li><strong>Root canal treatment:</strong> laser and rotary RCT, including single-visit treatment for painful molars.</li>
    <li><strong>Aesthetic fillings:</strong> nano-composite and biomimetic restorations that match the natural tooth shade.</li>
    <li><strong>Crowns and bridges:</strong> zirconia, E-max and fiber-reinforced bridges.</li>
    <li><strong>Professional whitening:</strong> in-clinic laser whitening with shade assessment.</li>
    <li><strong>Children's and family dentistry:</strong> check-ups, fluoride and preventive care.</li>
  </ul>

  <h3>Chamber, Hours & Appointment</h3>
  <p>You can see Dr. Aysha at <strong>Tech Dental Care, 827 (2nd Floor), Begum Rokeya Sarani, Shewrapara, Mirpur, Dhaka 1216</strong> — beside Metro Rail Pillar 318 — on Saturday to Thursday, <strong>4:00 PM–9:00 PM</strong>. Call <strong>09638-000505</strong> or <a href="/appointment">book online</a> and ask for her by name.</p>

  <h3>What to Expect at Your Visit</h3>
  <p>Every appointment starts with a full examination of teeth, gums and bite, followed by a digital X-ray when needed. You receive a written treatment plan with prices before anything begins, and all instruments are autoclaved or single-use. Follow-up reviews are scheduled for root canals, crowns and veneer cases.</p>
</div>
HTML,
                'faqs' => [
                    ['q' => 'What is Dr. Aysha Siddika known for?', 'a' => 'She is known for aesthetic dentistry — composite veneers, smile design and tooth-coloured fillings — and for painless laser root canal treatment. She is also the Assistant Medical Director of Tech Dental Care.'],
                    ['q' => 'Where can I consult Dr. Aysha Siddika?', 'a' => 'She consults at the Tech Dental Mirpur branch, 827 (2nd Floor), Begum Rokeya Sarani, Shewrapara, Dhaka 1216, Saturday to Thursday from 4:00 PM to 9:00 PM.'],
                    ['q' => 'How do I book an appointment with Dr. Aysha?', 'a' => 'Call 09638-000505 or use the online appointment form and mention her name. Our team will confirm the next available slot.'],
                ],
            ],
            2 => [
                'seo_title' => 'Paediatric & Aesthetic Dentist in Mirpur',
                'meta_desc' => 'Dr. Afsana Haque Joty is branch in-charge at Tech Dental Mirpur, specialising in children\'s dentistry and smile design. BMDC 11071. Call 09638-000505.',
                'content' => <<<'HTML'
<div class="space-y-4">
  <p><strong>Dr. Afsana Haque Joty</strong> is the branch in-charge of <a href="/branch/mirpur">Tech Dental Care Mirpur</a> and a dental surgeon with 5.5 years of experience. BMDC registration no. 11071. She combines paediatric dentistry with aesthetic dentistry, which makes her a popular choice for families who want one dentist for both parents and children.</p>

  <h3>About Dr. Afsana Haque Joty</h3>
  <p>After completing her BDS at the University of Dhaka, she trained in Oral &amp; Maxillofacial Surgery and Paediatric Dentistry, with special training in aesthetic dentistry. Her approach with children is calm and step-by-step: explain, show, then treat — so a first dental visit does not become a frightening memory.</p>

  <h3>Treatments & Expertise</h3>
  <ul>
    <li><strong>Children's dentistry:</strong> first check-ups, fluoride application, sealants and milk-tooth fillings.</li>
    <li><strong>Pulpotomy and milk-tooth root canal:</strong> saving decayed baby teeth so adult teeth erupt correctly.</li>
    <li><strong>Aesthetic dentistry:</strong> composite veneers, tooth-gap closure and smile design for adults.</li>
    <li><strong>Root canal treatment:</strong> rotary RCT for infected and painful teeth.</li>
    <li><strong>Scaling and gum care:</strong> ultrasonic cleaning and bleeding-gum treatment.</li>
    <li><strong>Preventive advice:</strong> brushing technique, diet and habit correction for children.</li>
  </ul>

  <h3>Chamber, Hours & Appointment</h3>
  <p>Dr. Afsana consults at <strong>827 (2nd Floor), Begum Rokeya Sarani, Shewrapara, Mirpur, Dhaka 1216</strong>, Saturday to Thursday from <strong>4:00 PM to 8:00 PM</strong>. Call <strong>09638-000505</strong> or <a href="/appointment">book an appointment</a>; for children, mention their age so we can allow extra time.</p>

  <h3>What to Expect at Your Visit</h3>
  <p>Children are examined in a relaxed, unhurried way, and parents stay beside them. Treatment is explained in simple language, with costs confirmed in writing first. Adult patients receive the same detailed examination, digital X-ray support and follow-up planning as any specialist consultation.</p>
</div>
HTML,
                'faqs' => [
                    ['q' => 'Does Dr. Afsana Haque Joty treat children?', 'a' => 'Yes. She has post-graduate training in paediatric dentistry and handles first check-ups, fluoride, fillings, pulpotomy and habit correction for children, as well as general and aesthetic treatment for adults.'],
                    ['q' => 'What are her consulting hours at Mirpur?', 'a' => 'She consults at Tech Dental Mirpur, Shewrapara, Saturday to Thursday from 4:00 PM to 8:00 PM.'],
                    ['q' => 'Can I book a family appointment with her?', 'a' => 'Yes. Call 09638-000505 and tell us how many family members need treatment so we can reserve enough time in one visit.'],
                ],
            ],
            3 => [
                'seo_title' => 'Dental Surgeon in Mirpur, Dhaka',
                'meta_desc' => 'Dr Saima Binte Zaman Shoili is a dental surgeon at Tech Dental Mirpur with training in conservative dentistry and aesthetics. BMDC 11070. Call 09638-000505.',
                'content' => <<<'HTML'
<div class="space-y-4">
  <p><strong>Dr Saima Binte Zaman Shoili</strong> is a dental surgeon at <a href="/branch/mirpur">Tech Dental Care Mirpur</a> with 4 years of clinical experience and BMDC registration no. 11070. She works mainly in conservative dentistry — saving natural teeth with precise fillings, root canals and aesthetic restorations — and holds a morning chamber for patients who prefer daytime appointments.</p>

  <h3>About Dr Saima Binte Zaman Shoili</h3>
  <p>She completed her BDS at the University of Dhaka and post-graduate training in Oral &amp; Maxillofacial Surgery and Conservative Dentistry, with special training in aesthetic dentistry. Her clinical focus is minimally invasive treatment: remove only what is decayed, preserve as much natural tooth as possible, and restore the shape and colour so the repair is hard to notice.</p>

  <h3>Treatments & Expertise</h3>
  <ul>
    <li><strong>Tooth-coloured fillings:</strong> composite and GI restorations for cavities and chipped teeth.</li>
    <li><strong>Root canal treatment:</strong> rotary endodontic treatment for infected pulp and abscesses.</li>
    <li><strong>Aesthetic dentistry:</strong> composite veneers, diastema closure and polish.</li>
    <li><strong>Scaling and polishing:</strong> tartar removal and gum-health review.</li>
    <li><strong>Extractions:</strong> simple and surgical removal, including wisdom teeth.</li>
    <li><strong>Crowns and bridges:</strong> restoring heavily broken-down teeth after root canal.</li>
  </ul>

  <h3>Chamber, Hours & Appointment</h3>
  <p>Her chamber is at <strong>827 (2nd Floor), Begum Rokeya Sarani, Shewrapara, Mirpur, Dhaka 1216</strong>, beside Metro Rail Pillar 318, on Saturday to Thursday, <strong>10:00 AM–2:00 PM</strong>. Call <strong>09638-000505</strong> or <a href="/appointment">book online</a>.</p>

  <h3>What to Expect at Your Visit</h3>
  <p>A first visit includes a full oral examination, a discussion of symptoms and a digital X-ray if the tooth needs one. You will see the treatment options and prices in writing before consenting. Preventive advice — brushing, flossing and diet — is part of every appointment so the same problem does not return.</p>
</div>
HTML,
                'faqs' => [
                    ['q' => 'What does Dr Saima Binte Zaman Shoili specialise in?', 'a' => 'She focuses on conservative dentistry — composite fillings, root canal treatment, aesthetic restorations, scaling and crowns — with post-graduate training in Conservative Dentistry and Oral & Maxillofacial Surgery.'],
                    ['q' => 'When is her Mirpur chamber open?', 'a' => 'She sees patients at Tech Dental Mirpur, Shewrapara, Saturday to Thursday from 10:00 AM to 2:00 PM.'],
                    ['q' => 'How do I book with Dr Saima?', 'a' => 'Call 09638-000505 or submit the online appointment form and request her morning chamber.'],
                ],
            ],
            4 => [
                'seo_title' => 'Root Canal Specialist in Mirpur, Dhaka',
                'meta_desc' => 'Dr Sayera Tabassum Elmee is a Mirpur dentist with post-graduate training in Conservative Dentistry & Endodontics. BMDC 11735. Call 09638-000505.',
                'content' => <<<'HTML'
<div class="space-y-4">
  <p><strong>Dr Sayera Tabassum Elmee</strong> is a dental surgeon at <a href="/branch/mirpur">Tech Dental Care Mirpur</a> with 4 years of experience and BMDC registration no. 11735. Her post-graduate training in Conservative Dentistry &amp; Endodontics makes her the dentist to see when a tooth is painful, infected or badly broken down but still worth saving.</p>

  <h3>About Dr Sayera Tabassum Elmee</h3>
  <p>She completed her BDS at the University of Dhaka, followed by post-graduate training in Oral &amp; Maxillofacial Surgery and Conservative Dentistry &amp; Endodontics, plus special training in aesthetic dentistry. She works with rotary endodontic systems and apex locators to clean and seal canals accurately, then restores the tooth with a filling or crown so it can chew normally again.</p>

  <h3>Treatments & Expertise</h3>
  <ul>
    <li><strong>Root canal treatment:</strong> front and back teeth, re-treatment of failed RCT and post-and-core build-ups.</li>
    <li><strong>Deep caries management:</strong> pulp capping and stepwise excavation to avoid unnecessary extraction.</li>
    <li><strong>Composite fillings:</strong> functional and aesthetic restoration of cavities and fractures.</li>
    <li><strong>Crowns:</strong> zirconia and PFM caps after root canal treatment.</li>
    <li><strong>Scaling and gum treatment:</strong> ultrasonic cleaning and periodontal review.</li>
    <li><strong>Pain diagnosis:</strong> identifying whether pain comes from a tooth, gum, sinus or jaw joint.</li>
  </ul>

  <h3>Chamber, Hours & Appointment</h3>
  <p>Consult her at <strong>827 (2nd Floor), Begum Rokeya Sarani, Shewrapara, Mirpur, Dhaka 1216</strong>, Saturday to Thursday from <strong>10:00 AM to 2:00 PM</strong>. For severe toothache, call <strong>09638-000505</strong> and mention the pain so we can prioritise your slot. Online booking is available on the <a href="/appointment">appointment page</a>.</p>

  <h3>What to Expect at Your Visit</h3>
  <p>Endodontic appointments include a pulpal diagnosis supported by digital RVG X-ray, an explanation of how many visits the tooth will need, and a written cost estimate. Most cases are completed with modern rotary files and effective local anaesthesia, with a review scheduled after the final restoration.</p>
</div>
HTML,
                'faqs' => [
                    ['q' => 'Is Dr Sayera a root canal specialist?', 'a' => 'She has post-graduate training in Conservative Dentistry & Endodontics and handles routine, multi-canal and re-treatment root canal cases at the Mirpur branch.'],
                    ['q' => 'How many visits does a root canal take?', 'a' => 'Many front and back teeth can be completed in one or two visits depending on the infection. She will confirm the number of visits and the cost after examining and X-raying the tooth.'],
                    ['q' => 'How do I get an urgent appointment for tooth pain?', 'a' => 'Call 09638-000505 and say that you have severe tooth pain. Our reception team will arrange the earliest available slot with her or another dentist on duty.'],
                ],
            ],
            11 => [
                'seo_title' => 'Endodontic Dentist in Mirpur, Dhaka',
                'meta_desc' => 'Dr. Nowshin Faria Khan Chowdhury is a Mirpur dentist with training in endodontics and aesthetic dentistry. BMDC 11497. Book on 09638-000505.',
                'content' => <<<'HTML'
<div class="space-y-4">
  <p><strong>Dr. Nowshin Faria Khan Chowdhury</strong> is a dental surgeon at <a href="/branch/mirpur">Tech Dental Care Mirpur</a> with 5 years of experience and BMDC registration no. 11497. She handles general dentistry with a strong focus on endodontics and aesthetic restorations, and keeps an evening chamber for patients who cannot attend during office hours.</p>

  <h3>About Dr. Nowshin Faria Khan Chowdhury</h3>
  <p>She completed her BDS at the University of Dhaka, followed by post-graduate training in Oral &amp; Maxillofacial Surgery and Conservative Dentistry &amp; Endodontics, with special training in aesthetic dentistry. She is known for a careful diagnostic approach — checking the bite, gum condition and X-ray before deciding whether a tooth needs a filling, a root canal or a crown.</p>

  <h3>Treatments & Expertise</h3>
  <ul>
    <li><strong>Root canal treatment:</strong> single and multi-visit RCT with rotary instrumentation.</li>
    <li><strong>Aesthetic fillings:</strong> composite restorations for cavities, chips and worn edges.</li>
    <li><strong>Veneers and smile correction:</strong> composite veneers and gap closure.</li>
    <li><strong>Scaling and polishing:</strong> preventive cleaning for gum bleeding and bad breath.</li>
    <li><strong>Tooth extraction:</strong> simple and surgical removal with local anaesthesia.</li>
    <li><strong>Crowns and bridges:</strong> restoring function after root canal or tooth loss.</li>
  </ul>

  <h3>Chamber, Hours & Appointment</h3>
  <p>Her evening chamber runs at <strong>827 (2nd Floor), Begum Rokeya Sarani, Shewrapara, Mirpur, Dhaka 1216</strong>, Saturday to Thursday, <strong>4:00 PM–9:00 PM</strong>. Call <strong>09638-000505</strong> or <a href="/appointment">book online</a>.</p>

  <h3>What to Expect at Your Visit</h3>
  <p>You will be examined, told what is causing the problem, and given options with prices before treatment starts. Infection control follows the same protocol at every branch: autoclave sterilisation, fresh gloves and single-use suction tips. A review appointment is arranged for root canal and crown cases.</p>
</div>
HTML,
                'faqs' => [
                    ['q' => 'What are Dr. Nowshin Faria Khan Chowdhury\'s main treatments?', 'a' => 'Root canal treatment, aesthetic composite fillings, veneers, scaling, extractions and crowns, supported by post-graduate training in Conservative Dentistry & Endodontics.'],
                    ['q' => 'Does she have an evening chamber?', 'a' => 'Yes. She consults at Tech Dental Mirpur, Shewrapara, Saturday to Thursday from 4:00 PM to 9:00 PM.'],
                    ['q' => 'How can I book an appointment with her?', 'a' => 'Call 09638-000505 or use the online booking form and request Dr. Nowshin by name.'],
                ],
            ],
            12 => [
                'seo_title' => 'Dentist in Jatrabari, Dhaka',
                'meta_desc' => 'Dr Afsana Mim treats fillings, root canals, crowns, scaling and tooth gaps at Tech Dental Jatrabari. BMDC 13680. Book on 09638-000505.',
                'content' => <<<'HTML'
<div class="space-y-4">
  <p><strong>Dr Afsana Mim</strong> is the dental surgeon at <a href="/branch/jatrabari">Tech Dental Care Jatrabari</a>, serving patients from Jatrabari, Sayedabad, Dhalpur, Konapara and Demra. She has 3 years of clinical experience and BMDC registration no. 13680, with a practice built around everyday dental problems: fillings, root canals, crowns, scaling and closing gaps without braces.</p>

  <h3>About Dr Afsana Mim</h3>
  <p>She completed her BDS at the University of Dhaka and post-graduate training in Oral &amp; Maxillofacial Surgery at Dhaka Medical College Hospital, with special training in aesthetic dentistry. Patients often come to her with a broken or discoloured front tooth before a wedding or interview; her single-visit composite work is designed to restore the shape and shade in one appointment where the case allows.</p>

  <h3>Treatments & Expertise</h3>
  <ul>
    <li><strong>Dental fillings:</strong> tooth-coloured composite and GI fillings for cavities.</li>
    <li><strong>Root canal treatment:</strong> relieving pain and saving infected teeth.</li>
    <li><strong>Crown and bridge:</strong> zirconia, PFM and metal-ceramic restorations.</li>
    <li><strong>Scaling and polishing:</strong> cleaning for tartar, bleeding gums and bad breath.</li>
    <li><strong>Single-visit tooth gap correction:</strong> composite build-up to close small gaps without braces.</li>
    <li><strong>General oral care:</strong> extractions, preventive advice and children's check-ups.</li>
  </ul>

  <h3>Chamber, Hours & Appointment</h3>
  <p>Her chamber is at <strong>Shahid Faruk Road, South Jatrabari, Dhaka 1204</strong>, near Jatrabari Chowrasta, Saturday to Thursday, <strong>4:00 PM–9:00 PM</strong>. Call <strong>09638-000505</strong> or <a href="/appointment">book online</a>.</p>

  <h3>What to Expect at Your Visit</h3>
  <p>The visit starts with examination and, where needed, a digital X-ray. You will be shown the problem and the options in plain language, with the cost confirmed before treatment. Emergency toothache and broken-tooth cases are given priority when you mention them while booking.</p>
</div>
HTML,
                'faqs' => [
                    ['q' => 'Where does Dr Afsana Mim practise?', 'a' => 'She practises at Tech Dental Jatrabari, Shahid Faruk Road, South Jatrabari, Dhaka 1204, Saturday to Thursday from 4:00 PM to 9:00 PM.'],
                    ['q' => 'Can she close a tooth gap without braces?', 'a' => 'Yes, for suitable cases she uses direct composite build-up to close small gaps in a single visit. Larger gaps or bite problems may need orthodontic treatment instead.'],
                    ['q' => 'Does she treat children?', 'a' => 'Yes. She provides children\'s check-ups, fillings and milk-tooth extraction at the Jatrabari branch.'],
                ],
            ],
            13 => [
                'seo_title' => 'Dentist in Uttara, Dhaka',
                'meta_desc' => 'Dr. Roquaya Akhter provides general, aesthetic and preventive dentistry at Tech Dental Uttara, Sector 3. BMDC 12501. Call 09638-000505.',
                'content' => <<<'HTML'
<div class="space-y-4">
  <p><strong>Dr. Roquaya Akhter</strong> is the dental surgeon at <a href="/branch/uttara">Tech Dental Care Uttara</a>, House 18, Road 14, Sector 3. She has 3 years of clinical experience and BMDC registration no. 12501, and treats families across Uttara, Nikunja, Khilkhet and Airport with general, aesthetic and preventive dentistry.</p>

  <h3>About Dr. Roquaya Akhter</h3>
  <p>She completed her BDS at the University of Dhaka and post-graduate training in Oral &amp; Maxillofacial Surgery at Dhaka Dental College and Hospital, with special training in aesthetic dentistry. Her consultations focus on finding the cause of the problem rather than only treating the symptom — for example, checking whether sensitivity is caused by gum recession, a cracked filling or nighttime grinding.</p>

  <h3>Treatments & Expertise</h3>
  <ul>
    <li><strong>Dental check-ups:</strong> full-mouth examination, X-ray review and preventive plan.</li>
    <li><strong>Composite fillings:</strong> natural-shade restorations for cavities and chipped teeth.</li>
    <li><strong>Root canal treatment:</strong> pain relief and tooth preservation.</li>
    <li><strong>Scaling and polishing:</strong> cleaning for tartar, staining and gum bleeding.</li>
    <li><strong>Aesthetic dentistry:</strong> composite veneers and minor smile corrections.</li>
    <li><strong>Children's dentistry:</strong> first visits, fluoride and fillings.</li>
  </ul>

  <h3>Chamber, Hours & Appointment</h3>
  <p>Her chamber runs at <strong>House 18, Road 14, Sector 3, Uttara, Dhaka 1230</strong>, Saturday to Thursday, <strong>4:00 PM–9:00 PM</strong>. Call <strong>09638-000505</strong> or use the <a href="/appointment">online appointment form</a>.</p>

  <h3>What to Expect at Your Visit</h3>
  <p>Examination, digital X-ray if required, a written treatment plan and a clear cost estimate come before any procedure. Children and nervous patients are given extra time, and preventive advice is tailored to the family's daily routine rather than a generic leaflet.</p>
</div>
HTML,
                'faqs' => [
                    ['q' => 'Where is Dr. Roquaya Akhter\'s chamber?', 'a' => 'She consults at Tech Dental Uttara, House 18, Road 14, Sector 3, Uttara, Dhaka 1230, Saturday to Thursday from 4:00 PM to 9:00 PM.'],
                    ['q' => 'What treatments does she provide in Uttara?', 'a' => 'General check-ups, composite fillings, root canal treatment, scaling and polishing, aesthetic composite work, extractions and children\'s dentistry.'],
                    ['q' => 'Can I bring my child to the same appointment?', 'a' => 'Yes. Mention your child\'s age when booking so the chamber allows time for both examinations.'],
                ],
            ],
            14 => [
                'seo_title' => 'Dentist in Badda, Dhaka',
                'meta_desc' => 'Dr. Hasna Hena Bhuiyan Nishi provides general and aesthetic dentistry at Tech Dental Badda, North Badda Bazar. BMDC 12808. Call 09638-000505.',
                'content' => <<<'HTML'
<div class="space-y-4">
  <p><strong>Dr. Hasna Hena Bhuiyan Nishi</strong> is a dental surgeon at <a href="/branch/badda">Tech Dental Care Badda</a>, North Badda Bazar, serving patients from Badda, Rampura, Gulshan 1 and Hatirjheel. She has 3 years of experience and BMDC registration no. 12808, and provides general, aesthetic and preventive dental care for adults and children.</p>

  <h3>About Dr. Hasna Hena Bhuiyan Nishi</h3>
  <p>She completed her BDS at the University of Dhaka and post-graduate training in Oral &amp; Maxillofacial Surgery at Dhaka Dental College and Hospital, with special training in aesthetic dentistry. She is known for explaining procedures step by step, which helps first-time patients and those who have previously avoided dental treatment.</p>

  <h3>Treatments & Expertise</h3>
  <ul>
    <li><strong>General dentistry:</strong> check-ups, fillings, extractions and preventive care.</li>
    <li><strong>Root canal treatment:</strong> treating infected teeth and relieving pain.</li>
    <li><strong>Scaling and polishing:</strong> tartar removal, gum care and stain removal.</li>
    <li><strong>Crowns and bridges:</strong> restoring broken or missing teeth.</li>
    <li><strong>Aesthetic dentistry:</strong> composite veneers, gap closure and smile polish.</li>
    <li><strong>Children's dentistry:</strong> first check-ups, fluoride and milk-tooth fillings.</li>
  </ul>

  <h3>Chamber, Hours & Appointment</h3>
  <p>Her chamber is at <strong>Haji Abdur Rashid Mansion (3rd Floor), North Badda Bazar, Badda, Dhaka 1212</strong> — above Krishi Bank — Saturday to Thursday, <strong>4:00 PM–9:00 PM</strong>. Call <strong>09638-000505</strong> or <a href="/appointment">book online</a>.</p>

  <h3>What to Expect at Your Visit</h3>
  <p>Your first appointment includes a complete examination, a discussion of your main concern and a digital X-ray when needed. Treatment options and prices are written down before you decide. For nervous patients, treatment can be planned across shorter visits.</p>
</div>
HTML,
                'faqs' => [
                    ['q' => 'Where does Dr. Hasna Hena Bhuiyan Nishi practise?', 'a' => 'She practises at Tech Dental Badda, Haji Abdur Rashid Mansion (3rd Floor), North Badda Bazar, Dhaka 1212, Saturday to Thursday from 4:00 PM to 9:00 PM.'],
                    ['q' => 'Does she see children?', 'a' => 'Yes. She provides children\'s check-ups, fluoride treatment and fillings alongside adult general and aesthetic dentistry.'],
                    ['q' => 'How do I book an appointment with her?', 'a' => 'Call 09638-000505 or submit the online appointment form and request Dr. Hasna at the Badda branch.'],
                ],
            ],
            15 => [
                'seo_title' => 'Orthodontist in Dhaka – Braces & Aligners',
                'meta_desc' => 'Dr. Md. Ashraful Hashem Johny is an orthodontist (MS, BMU) at Tech Dental Mirpur for metal, ceramic and clear aligner treatment. BMDC 8742. Call 09638-000505.',
                'content' => <<<'HTML'
<div class="space-y-4">
  <p><strong>Dr. Md. Ashraful Hashem Johny</strong> is the orthodontist at <a href="/branch/mirpur">Tech Dental Care Mirpur</a>, treating crooked teeth, gaps, overbite and underbite with braces and clear aligners. He holds BDS (SOMC), MCPS (Dental Surgery) and MS in Orthodontics from Bangabandhu Sheikh Mujib Medical University, with 7 years of clinical experience and BMDC registration no. 8742.</p>

  <h3>About Dr. Md. Ashraful Hashem Johny</h3>
  <p>Orthodontics is not only about straight teeth; it is about a bite that works and a smile line that fits the face. He plans each case with photographs, study models and X-rays, then explains the expected treatment time, the appliances available and the retainer plan needed to keep the result. Complex surgical-orthodontic cases are coordinated with our maxillofacial team.</p>

  <h3>Treatments & Expertise</h3>
  <ul>
    <li><strong>Metal braces:</strong> traditional and self-ligating brackets for moderate to severe crowding.</li>
    <li><strong>Ceramic braces:</strong> tooth-coloured brackets for adults who want a discreet fixed option.</li>
    <li><strong>Clear aligners:</strong> removable aligner treatment, including Invisalign, for suitable cases.</li>
    <li><strong>Overbite and underbite correction:</strong> bite correction with elastics and functional appliances.</li>
    <li><strong>Gap closure and space management:</strong> closing spacing or opening space for implants.</li>
    <li><strong>Retainers:</strong> fixed and removable retainers after active treatment.</li>
    <li><strong>Growth modulation:</strong> early orthodontic guidance for children.</li>
  </ul>

  <h3>Chamber, Hours & Appointment</h3>
  <p>Orthodontic consultations are held at <strong>827 (2nd Floor), Begum Rokeya Sarani, Shewrapara, Mirpur, Dhaka 1216</strong> by schedule. Call <strong>09638-000505</strong> or <a href="/appointment">book an orthodontic consultation</a> and mention that you need braces or aligners.</p>

  <h3>What to Expect at Your Consultation</h3>
  <p>The consultation includes a bite assessment, photographs and X-rays where indicated. You will receive a written orthodontic plan with the appliance type, estimated duration and total cost, plus the payment schedule. Retainer instructions and review intervals are explained before treatment begins.</p>
</div>
HTML,
                'faqs' => [
                    ['q' => 'Which braces does Dr. Ashraful provide?', 'a' => 'Traditional metal braces, self-ligating braces, ceramic tooth-coloured braces, lingual braces and clear aligners including Invisalign, depending on the case.'],
                    ['q' => 'How long does braces treatment take?', 'a' => 'Most cases take 12 to 24 months. The exact duration depends on crowding, bite and how consistently elastics and retainers are used.'],
                    ['q' => 'How much do braces cost at Tech Dental?', 'a' => 'Metal braces start from ৳40,000 and ceramic braces from ৳50,000. The final quote is confirmed after the orthodontic consultation and X-rays.'],
                ],
            ],
            16 => [
                'seo_title' => 'Dentist in Mirpur, Dhaka',
                'meta_desc' => 'Dr. Mahmuda-Maimuna provides general and aesthetic dentistry at Tech Dental Mirpur, with evening appointments. BMDC 10926. Call 09638-000505.',
                'content' => <<<'HTML'
<div class="space-y-4">
  <p><strong>Dr. Mahmuda-Maimuna</strong> is a dental surgeon at <a href="/branch/mirpur">Tech Dental Care Mirpur</a> with BMDC registration no. 10926. She provides general and aesthetic dentistry for families in Shewrapara, Kazipara and Mirpur, with an evening chamber that suits patients coming after work or university.</p>

  <h3>About Dr. Mahmuda-Maimuna</h3>
  <p>She completed her BDS at the University of Dhaka and post-graduate training in Oral &amp; Maxillofacial Surgery at Dhaka Medical College Hospital, with special training in aesthetic dentistry. Her approach is preventive first: identify early decay and gum problems before they become painful, and explain home care that actually fits the patient's routine.</p>

  <h3>Treatments & Expertise</h3>
  <ul>
    <li><strong>Check-ups and cleaning:</strong> examination, scaling and polishing.</li>
    <li><strong>Fillings:</strong> composite and GI restorations for cavities and fractures.</li>
    <li><strong>Root canal treatment:</strong> saving infected and painful teeth.</li>
    <li><strong>Aesthetic dentistry:</strong> composite veneers and minor smile corrections.</li>
    <li><strong>Extractions:</strong> simple and surgical tooth removal.</li>
    <li><strong>Crowns:</strong> protecting root-treated and heavily restored teeth.</li>
  </ul>

  <h3>Chamber, Hours & Appointment</h3>
  <p>Consult her at <strong>827 (2nd Floor), Begum Rokeya Sarani, Shewrapara, Mirpur, Dhaka 1216</strong>, Saturday to Thursday, <strong>4:00 PM–9:00 PM</strong>. Call <strong>09638-000505</strong> or use the <a href="/appointment">online form</a>.</p>

  <h3>What to Expect at Your Visit</h3>
  <p>A full examination comes first, followed by a clear explanation of what needs treatment now, what can wait and what can be prevented. Costs are confirmed before treatment, and preventive advice is given in writing where useful.</p>
</div>
HTML,
                'faqs' => [
                    ['q' => 'What are Dr. Mahmuda-Maimuna\'s consulting hours?', 'a' => 'She consults at Tech Dental Mirpur, Shewrapara, Saturday to Thursday from 4:00 PM to 9:00 PM.'],
                    ['q' => 'What treatments does she provide?', 'a' => 'General check-ups, scaling, composite fillings, root canal treatment, extractions, crowns and aesthetic composite work.'],
                    ['q' => 'How do I book an appointment?', 'a' => 'Call 09638-000505 or use the online appointment form and request her evening chamber.'],
                ],
            ],
            17 => [
                'seo_title' => 'Dentist in Badda, Dhaka',
                'meta_desc' => 'Dr. Reshma Islam provides preventive, general and aesthetic dental care at Tech Dental Badda, North Badda Bazar. BMDC 12028. Call 09638-000505.',
                'content' => <<<'HTML'
<div class="space-y-4">
  <p><strong>Dr. Reshma Islam</strong> is a dental surgeon at <a href="/branch/badda">Tech Dental Care Badda</a>, North Badda Bazar, with BMDC registration no. 12028. She treats patients from Badda, Rampura, Merul Badda and Gulshan 1, with a focus on preventive care, general dentistry and aesthetic restorations.</p>

  <h3>About Dr. Reshma Islam</h3>
  <p>She completed her BDS at the University of Dhaka and post-graduate training in Oral &amp; Maxillofacial Surgery at Dhaka Dental College and Hospital, with special training in aesthetic dentistry. She is particularly careful with first-time patients, taking time to explain what the instruments do and what will be felt, so the visit is predictable rather than stressful.</p>

  <h3>Treatments & Expertise</h3>
  <ul>
    <li><strong>Preventive care:</strong> check-ups, scaling, polishing and fluoride.</li>
    <li><strong>Fillings:</strong> tooth-coloured composite restorations.</li>
    <li><strong>Root canal treatment:</strong> pain relief and tooth preservation.</li>
    <li><strong>Crowns and bridges:</strong> restoring function and appearance.</li>
    <li><strong>Aesthetic dentistry:</strong> composite veneers and gap closure.</li>
    <li><strong>Children's check-ups:</strong> gentle first visits and preventive advice.</li>
  </ul>

  <h3>Chamber, Hours & Appointment</h3>
  <p>Her chamber is at <strong>Haji Abdur Rashid Mansion (3rd Floor), North Badda Bazar, Badda, Dhaka 1212</strong>, Saturday to Thursday in the evening. Call <strong>09638-000505</strong> or <a href="/appointment">book online</a> to confirm the exact slot.</p>

  <h3>What to Expect at Your Visit</h3>
  <p>Expect a full examination, a digital X-ray if required, and an explanation of the diagnosis with treatment options and prices. Preventive advice covers brushing technique, flossing and diet, and follow-up is arranged for any treatment that needs review.</p>
</div>
HTML,
                'faqs' => [
                    ['q' => 'Where can I see Dr. Reshma Islam?', 'a' => 'She consults at Tech Dental Badda, Haji Abdur Rashid Mansion (3rd Floor), North Badda Bazar, Dhaka 1212, in the evening Saturday to Thursday.'],
                    ['q' => 'Does she treat nervous patients?', 'a' => 'Yes. She explains each step before starting and can spread treatment across shorter appointments for patients who find dental visits stressful.'],
                    ['q' => 'How do I book with Dr. Reshma?', 'a' => 'Call 09638-000505 or submit the online appointment form and request her at the Badda branch.'],
                ],
            ],
            18 => [
                'seo_title' => 'Senior Dental Surgeon in Badda, Dhaka',
                'meta_desc' => 'Dr. Sanjida Farabi is a senior dental surgeon at Tech Dental Badda with training in endodontics and oral surgery. BMDC 9155. Call 09638-000505.',
                'content' => <<<'HTML'
<div class="space-y-4">
  <p><strong>Dr. Sanjida Farabi</strong> is a senior dental surgeon at <a href="/branch/badda">Tech Dental Care Badda</a> with BMDC registration no. 9155. Her post-graduate training in Conservative Dentistry &amp; Endodontics and Oral &amp; Maxillofacial Surgery lets her handle both routine restorative work and more complex surgical cases under one roof.</p>

  <h3>About Dr. Sanjida Farabi</h3>
  <p>She completed her BDS at the University of Dhaka, followed by post-graduate training in Conservative Dentistry &amp; Endodontics and Oral &amp; Maxillofacial Surgery at Shaheed Suhrawardy Medical College and Hospital, with special training in aesthetic dentistry. She is the dentist to consult when a tooth has had repeated fillings, a previous root canal has failed, or a wisdom tooth needs surgical removal.</p>

  <h3>Treatments & Expertise</h3>
  <ul>
    <li><strong>Complex root canal treatment:</strong> multi-canal and re-treatment cases.</li>
    <li><strong>Oral surgery:</strong> surgical and impacted wisdom tooth extraction.</li>
    <li><strong>Restorative dentistry:</strong> post-and-core, crowns and large composite build-ups.</li>
    <li><strong>Gum treatment:</strong> deep scaling and periodontal review.</li>
    <li><strong>Aesthetic dentistry:</strong> veneers and tooth-coloured restoration of front teeth.</li>
    <li><strong>Emergency care:</strong> abscess drainage and pain management.</li>
  </ul>

  <h3>Chamber, Hours & Appointment</h3>
  <p>Her chamber is at <strong>Haji Abdur Rashid Mansion (3rd Floor), North Badda Bazar, Badda, Dhaka 1212</strong>, Saturday to Thursday in the evening. Call <strong>09638-000505</strong> or <a href="/appointment">book an appointment</a>; for facial swelling or severe pain, say so when calling.</p>

  <h3>What to Expect at Your Visit</h3>
  <p>Complex cases begin with a detailed history, clinical examination and X-ray review. You will be told whether the tooth can be saved, what the alternatives are, and what each option costs. Surgical appointments include written aftercare instructions and a review visit.</p>
</div>
HTML,
                'faqs' => [
                    ['q' => 'What does Dr. Sanjida Farabi specialise in?', 'a' => 'Complex root canal treatment, re-treatment, oral surgery including impacted wisdom teeth, crowns and large restorative build-ups.'],
                    ['q' => 'Can she remove an impacted wisdom tooth?', 'a' => 'Yes. She has post-graduate training in Oral & Maxillofacial Surgery and performs surgical wisdom tooth removal at the Badda branch.'],
                    ['q' => 'How do I book a surgical consultation?', 'a' => 'Call 09638-000505 and mention that you need a surgical or wisdom-tooth consultation so the team allocates enough time.'],
                ],
            ],
            19 => [
                'seo_title' => 'Dentist in Mirpur, Dhaka',
                'meta_desc' => 'Dr. Tasnova Rahman Mohona provides general and aesthetic dentistry at Tech Dental Mirpur, Shewrapara. BMDC 9440. Call 09638-000505.',
                'content' => <<<'HTML'
<div class="space-y-4">
  <p><strong>Dr. Tasnova Rahman Mohona</strong> is a dental surgeon at <a href="/branch/mirpur">Tech Dental Care Mirpur</a> with BMDC registration no. 9440. She completed her BDS at Rajshahi University and post-graduate training in Oral &amp; Maxillofacial Surgery at Shaheed Suhrawardy Medical College &amp; Hospital, with special training in aesthetic dentistry.</p>

  <h3>About Dr. Tasnova Rahman Mohona</h3>
  <p>She handles everyday dental needs — cavities, sensitivity, bleeding gums, stained teeth and missing teeth — with a preventive mindset. Her consultations include a full-mouth check rather than only the painful tooth, because gum disease and decay often start silently in another quadrant.</p>

  <h3>Treatments & Expertise</h3>
  <ul>
    <li><strong>General dentistry:</strong> check-ups, fillings and extractions.</li>
    <li><strong>Root canal treatment:</strong> saving infected teeth and relieving pain.</li>
    <li><strong>Scaling and polishing:</strong> gum-health cleaning and stain removal.</li>
    <li><strong>Aesthetic dentistry:</strong> composite veneers, whitening advice and smile polish.</li>
    <li><strong>Crowns and bridges:</strong> replacing lost tooth structure and missing teeth.</li>
    <li><strong>Preventive care:</strong> brushing, flossing and diet guidance.</li>
  </ul>

  <h3>Chamber, Hours & Appointment</h3>
  <p>Consult her at <strong>827 (2nd Floor), Begum Rokeya Sarani, Shewrapara, Mirpur, Dhaka 1216</strong>, Saturday to Thursday in the evening. Call <strong>09638-000505</strong> or <a href="/appointment">book online</a> to confirm the slot.</p>

  <h3>What to Expect at Your Visit</h3>
  <p>You will receive a full examination, an explanation of the findings, and a written plan with prices before treatment. Digital X-ray support is available in the clinic, and follow-up is scheduled for root canal, crown and extraction cases.</p>
</div>
HTML,
                'faqs' => [
                    ['q' => 'Where does Dr. Tasnova Rahman Mohona practise?', 'a' => 'She practises at Tech Dental Mirpur, 827 (2nd Floor), Begum Rokeya Sarani, Shewrapara, Dhaka 1216, in the evening Saturday to Thursday.'],
                    ['q' => 'What treatments does she offer?', 'a' => 'Check-ups, composite fillings, root canal treatment, scaling, extractions, crowns and aesthetic composite work.'],
                    ['q' => 'How can I book an appointment?', 'a' => 'Call 09638-000505 or use the online appointment form.'],
                ],
            ],
            20 => [
                'seo_title' => 'Implant Specialist & Medical Director in Dhaka',
                'meta_desc' => 'Prof. Dr. Nafees Uddin Chowdhury, Medical Director of Tech Dental, has 23+ years in dental implants and oral surgery. BMDC 1293. Call 09638-000505.',
                'content' => <<<'HTML'
<div class="space-y-4">
  <p><strong>Prof. Dr. Nafees Uddin Chowdhury</strong> is the Medical Director of Tech Dental Care and one of the most experienced dental implant surgeons in Dhaka, with 23+ years of clinical practice and BMDC registration no. 1293. He consults at our <a href="/branch/mirpur">Mirpur branch</a> and leads complex implant, bone-graft and oral surgery cases across the network.</p>

  <h3>About Prof. Dr. Nafees Uddin Chowdhury</h3>
  <p>He completed his BDS at Pioneer Dental College, University of Dhaka, followed by a PhD at Tokyo Medical and Dental University, Japan, and fellowships in dental implants in Japan, the USA and South Korea. That international training is reflected in his treatment planning: every implant case begins with bone assessment, digital imaging and a discussion of long-term maintenance, not just the placement appointment.</p>

  <h3>Treatments & Expertise</h3>
  <ul>
    <li><strong>Single and multiple dental implants:</strong> Korean Osstem, USA premium and German Nobel systems.</li>
    <li><strong>Full-mouth rehabilitation:</strong> All-on-4 and All-on-6 implant-supported arches.</li>
    <li><strong>Bone grafting and sinus lift:</strong> rebuilding bone before implant placement.</li>
    <li><strong>Oral and maxillofacial surgery:</strong> impacted wisdom teeth, cysts and complex extractions.</li>
    <li><strong>Implant rescue:</strong> assessment and management of failing or infected implants.</li>
    <li><strong>Second opinions:</strong> review of implant plans and quotes from other clinics.</li>
  </ul>

  <h3>Chamber, Hours & Appointment</h3>
  <p>His chamber is at <strong>Tech Dental Care, 827 (2nd Floor), Begum Rokeya Sarani, Shewrapara, Mirpur, Dhaka 1216</strong>, Saturday to Thursday, <strong>4:00 PM–9:00 PM</strong>. Implant consultations require an OPG or CBCT review, so call <strong>09638-000505</strong> in advance or <a href="/appointment">book online</a>.</p>

  <h3>What to Expect at Your Implant Consultation</h3>
  <p>The consultation covers medical history, bone quality, bite, gum health and expectations. You will receive a written plan showing the implant system, whether grafting is needed, the number of visits, the total cost and the maintenance schedule. Alternatives such as bridges or dentures are explained honestly so you can compare.</p>
</div>
HTML,
                'faqs' => [
                    ['q' => 'How experienced is Prof. Dr. Nafees Uddin Chowdhury?', 'a' => 'He has 23+ years of clinical experience, a PhD from Tokyo Medical and Dental University and implant fellowships in Japan, the USA and South Korea. He is the Medical Director of Tech Dental Care.'],
                    ['q' => 'Which implant brands does he use?', 'a' => 'Korean Osstem, USA premium and German Nobel implant systems, selected according to bone quality, budget and the clinical situation.'],
                    ['q' => 'How do I book an implant consultation?', 'a' => 'Call 09638-000505 or use the online appointment form. An OPG or CBCT X-ray is usually arranged before the consultation so the implant plan can be discussed in one visit.'],
                ],
            ],
        ];

        foreach ($doctors as $id => $doctor) {
            DB::table('doctors')->where('id', $id)->update([
                'seo_title' => $doctor['seo_title'],
                'meta_desc' => $doctor['meta_desc'],
                'seo_content' => $doctor['content'],
                'faqs' => json_encode($doctor['faqs'], JSON_UNESCAPED_UNICODE),
                'canonical_url' => 'https://techdentalcare.com/doctors/' . $id,
                'robots_index' => 1,
                'robots_follow' => 1,
                'schema_type' => 'Physician',
                'updated_at' => $now,
            ]);
        }
    }

    /**
     * Content migration — intentionally irreversible.
     */
    public function down(): void
    {
        //
    }
};
