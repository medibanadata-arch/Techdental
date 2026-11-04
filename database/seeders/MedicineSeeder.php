<?php

namespace Database\Seeders;

use App\Models\Medicine;
use Illuminate\Database\Seeder;

class MedicineSeeder extends Seeder
{
    /**
     * 14 listing medicines verbatim from "My project code.html" medicinesData (L117-314)
     * + Alatrol 10mg single-page detail (L396-1044, single medicine design).
     */
    public function run(): void
    {
        $listing = [
            ['slug' => 'napa-500', 'name' => 'Napa 500mg', 'generic' => 'Paracetamol 500 mg', 'category' => 'pain', 'tag' => 'Pain & Fever', 'image' => 'https://placehold.co/600x400/e2e8f0/475569?text=Napa+500mg', 'quick_use' => 'Post-extraction ache, mild pulpitis & fever relief.', 'pharma' => 'Beximco Pharma', 'dosage' => '1-2 tablets every 4 to 6 hrs (Max 4g/day).', 'dental_usage' => 'Safe first-choice analgesic for initial toothache and routine extraction recovery.', 'uses_text' => 'Mild to moderate dental discomfort, post-operative dental pain, headache and fever.', 'side_effects' => 'Safe at recommended doses. High doses can affect liver function.', 'sort_order' => 1],
            ['slug' => 'napa-extra', 'name' => 'Napa Extra', 'generic' => 'Paracetamol + Caffeine (500mg/65mg)', 'category' => 'pain', 'tag' => 'Fast Pain Relief', 'image' => 'https://placehold.co/600x400/e2e8f0/475569?text=Napa+Extra', 'quick_use' => 'Acute throbbing pain & wisdom tooth flare-ups.', 'pharma' => 'Beximco Pharma', 'dosage' => '1-2 tablets every 4-6 hours after meals.', 'dental_usage' => 'Caffeine accelerates paracetamol absorption for quicker relief during severe throbbing pain.', 'uses_text' => 'Acute wisdom tooth pain, dental nerve sensitivity, and post-surgery inflammation.', 'side_effects' => 'Mild insomnia, slight restlessness or gastric irritation from caffeine.', 'sort_order' => 2],
            ['slug' => 'naprosyn-500', 'name' => 'Naprosyn 500', 'generic' => 'Naproxen 500 mg', 'category' => 'pain', 'tag' => 'Anti-Inflammatory', 'image' => 'https://placehold.co/600x400/e2e8f0/475569?text=Naprosyn+500', 'quick_use' => 'Severe swelling, acute pulpitis & TMJ joint pain.', 'pharma' => 'Radiant Pharma', 'dosage' => '1 tablet twice daily with meals (take with PPI).', 'dental_usage' => 'Suppresses tissue inflammation and deep nerve pain associated with irreversible pulpitis.', 'uses_text' => 'Deep root toothaches, TMJ disorder pain, post-surgical swelling.', 'side_effects' => 'Gastrointestinal upset. Always take with meals and an antacid.', 'sort_order' => 3],
            ['slug' => 'tufnil-200', 'name' => 'Tufnil 200', 'generic' => 'Tolfenamic Acid 200 mg', 'category' => 'pain', 'tag' => 'Targeted NSAID', 'image' => 'https://placehold.co/600x400/e2e8f0/475569?text=Tufnil+200', 'quick_use' => 'Intense nerve pain & surgical impaction relief.', 'pharma' => 'Eskayef Pharma', 'dosage' => '1 tablet at pain onset; repeat once after 3-4 hours if needed.', 'dental_usage' => 'Useful for sharp trigeminal and surgical impaction pain that resists regular painkillers.', 'uses_text' => 'Acute severe dental pain, migraine episodes, surgical impactions.', 'side_effects' => 'Temporary stomach burning sensation or mild dizziness.', 'sort_order' => 4],
            ['slug' => 'amodis-400', 'name' => 'Amodis 400', 'generic' => 'Metronidazole 400 mg', 'category' => 'antibiotic', 'tag' => 'Anaerobic Antibiotic', 'image' => 'https://placehold.co/600x400/e2e8f0/475569?text=Amodis+400', 'quick_use' => 'Gum infections, dental abscess & ANUG.', 'pharma' => 'Square Pharma', 'dosage' => '1 tablet 3 times daily for 5-7 days after meals.', 'dental_usage' => 'Primary dental drug for anaerobic gum pockets, acute ulcerative gingivitis, and periapical abscess.', 'uses_text' => 'Deep periodontal pockets, foul oral odor infections, acute necrotizing ulcerative gingivitis.', 'side_effects' => 'Temporary metallic taste in mouth; strictly avoid alcohol.', 'sort_order' => 5],
            ['slug' => 'cef-3-200', 'name' => 'Cef-3 200mg', 'generic' => 'Cefixime 200 mg', 'category' => 'antibiotic', 'tag' => 'Broad Spectrum', 'image' => 'https://placehold.co/600x400/e2e8f0/475569?text=Cef-3+200mg', 'quick_use' => 'Spreading facial swelling & deep tissue infection.', 'pharma' => 'Square Pharma', 'dosage' => '1 capsule once or twice daily for 5-7 days.', 'dental_usage' => 'Prescribed when dental infections start spreading into surrounding facial spaces and soft tissues.', 'uses_text' => 'Odontogenic facial cellulitis, severe oral soft-tissue infections.', 'side_effects' => 'Occasional mild diarrhea, loose stools, or nausea.', 'sort_order' => 6],
            ['slug' => 'furoclav-500', 'name' => 'Furoclav 500', 'generic' => 'Cefuroxime + Clavulanic Acid (500/125mg)', 'category' => 'antibiotic', 'tag' => 'High-Potency Antibiotic', 'image' => 'https://placehold.co/600x400/e2e8f0/475569?text=Furoclav+500', 'quick_use' => 'Resistant bone infections & pre/post dental implants.', 'pharma' => 'Square Pharma', 'dosage' => '1 tablet twice daily with meals for 5-7 days.', 'dental_usage' => 'Protects surgical bone graft sites, deep socket osteitis, and dental implant osseointegration.', 'uses_text' => 'Complicated jawbone infections, persistent dental abscesses.', 'side_effects' => 'Mild stomach discomfort or altered oral flora.', 'sort_order' => 7],
            ['slug' => 'ciprocin-500', 'name' => 'Ciprocin 500', 'generic' => 'Ciprofloxacin 500 mg', 'category' => 'antibiotic', 'tag' => 'Bone Penetration', 'image' => 'https://placehold.co/600x400/e2e8f0/475569?text=Ciprocin+500', 'quick_use' => 'Jawbone osteomyelitis & resistant gram-negative bugs.', 'pharma' => 'Square Pharma', 'dosage' => '1 tablet every 12 hours with plenty of water.', 'dental_usage' => 'Excellent bone penetration for treating refractory mandibular jaw infections.', 'uses_text' => 'Mandibular bone infection, complex facial space abscesses.', 'side_effects' => 'Tenderness, light nausea, avoid direct sunlight exposure.', 'sort_order' => 8],
            ['slug' => 'sergel-20', 'name' => 'Sergel 20', 'generic' => 'Esomeprazole 20 mg', 'category' => 'gastric', 'tag' => 'Acid Reducer (PPI)', 'image' => 'https://placehold.co/600x400/e2e8f0/475569?text=Sergel+20', 'quick_use' => 'Protects stomach from strong painkillers & NSAIDs.', 'pharma' => 'Healthcare Pharma', 'dosage' => '1 capsule twice daily, 30 mins before meals.', 'dental_usage' => 'Co-prescribed with anti-inflammatory dental medications to avoid gastric mucosal irritation.', 'uses_text' => 'Prevents NSAID-induced ulcers, relieves GERD and acid reflux.', 'side_effects' => 'Generally well tolerated; rare mild headache or bloating.', 'sort_order' => 9],
            ['slug' => 'maxpro-20', 'name' => 'Maxpro 20', 'generic' => 'Esomeprazole 20 mg', 'category' => 'gastric', 'tag' => 'Stomach Protection', 'image' => 'https://placehold.co/600x400/e2e8f0/475569?text=Maxpro+20', 'quick_use' => 'Acid peptic control during dental antibiotic courses.', 'pharma' => 'Renata Limited', 'dosage' => '1 tablet once or twice daily before food.', 'dental_usage' => 'Protects gastric lining during multi-drug postoperative regimens.', 'uses_text' => 'Heartburn relief, gastric erosion prevention, acid control.', 'side_effects' => 'Occasional mild stomach gas or headache.', 'sort_order' => 10],
            ['slug' => 'traxyl-500', 'name' => 'Traxyl 500', 'generic' => 'Tranexamic Acid 500 mg', 'category' => 'dental_special', 'tag' => 'Stops Bleeding', 'image' => 'https://placehold.co/600x400/e2e8f0/475569?text=Traxyl+500', 'quick_use' => 'Halts prolonged bleeding after tooth extractions.', 'pharma' => 'Square Pharma', 'dosage' => '1 capsule 3x daily or used as localized compression rinse.', 'dental_usage' => 'Critical hemostatic used to stabilize blood clots after difficult surgical extractions or in bleeding disorders.', 'uses_text' => 'Persistent post-extraction bleeding, mucosal hemorrhage.', 'side_effects' => 'Do not use if having personal history of blood clots.', 'sort_order' => 11],
            ['slug' => 'bactrocin', 'name' => 'Bactrocin 2%', 'generic' => 'Mupirocin 2% Topical', 'category' => 'dental_special', 'tag' => 'Antiseptic Ointment', 'image' => 'https://placehold.co/600x400/e2e8f0/475569?text=Bactrocin+2%25', 'quick_use' => 'Cracked lip corners (angular cheilitis) & sores.', 'pharma' => 'Square Pharma', 'dosage' => 'Apply thinly around affected mouth corners 2-3x daily.', 'dental_usage' => 'Gold standard topical therapy for cracked, painful bacterial lesions at the corners of the lips.', 'uses_text' => 'Angular cheilitis, bacterial lip crusting, perioral sores.', 'side_effects' => 'Mild local burning or tingling on initial application.', 'sort_order' => 12],
            ['slug' => 'coralcal-dx', 'name' => 'CoralCal-DX', 'generic' => 'Coral Calcium + Vitamin D3', 'category' => 'supplement', 'tag' => 'Bone & Enamel', 'image' => 'https://placehold.co/600x400/e2e8f0/475569?text=CoralCal-DX', 'quick_use' => 'Strengthens jawbone density around dental implants.', 'pharma' => 'Radiant Pharma', 'dosage' => '1 tablet daily after food.', 'dental_usage' => 'Helps alveolar bone regeneration and stabilizes teeth in progressive periodontitis.', 'uses_text' => 'Jawbone remineralization, implant stability, tooth enamel support.', 'side_effects' => 'Mild constipation if not taken with adequate water.', 'sort_order' => 13],
            ['slug' => 'bicozin', 'name' => 'Bicozin', 'generic' => 'Vitamin B-Complex + Zinc', 'category' => 'supplement', 'tag' => 'Mouth Ulcer Healing', 'image' => 'https://placehold.co/600x400/e2e8f0/475569?text=Bicozin', 'quick_use' => 'Quickens healing of canker sores & oral cuts.', 'pharma' => 'Square Pharma', 'dosage' => '1 tablet once daily after a meal.', 'dental_usage' => 'Essential micronutrient therapy to accelerate healing of recurrent aphthous ulcers and gum abrasions.', 'uses_text' => 'Aphthous stomatitis (canker sores), oral mucosa repair, gum recovery.', 'side_effects' => 'Harmless bright yellow urine discoloration.', 'sort_order' => 14],
        ];

        // Full detail record for the single-medicine design (Alatrol 10 mg).
        $detail = [
            'slug' => 'alatrol-10mg',
            'name' => 'Alatrol 10mg',
            'generic' => 'Cetirizine HCl 10 mg',
            'category' => 'allergy',
            'tag' => 'Non-Drowsy Antihistamine',
            'image' => 'https://placehold.co/500x500/ffffff/8b1d41?text=Alatrol+10mg',
            'quick_use' => 'Fast relief from sneezing, hives & allergic itching.',
            'pharma' => 'Square Pharma PLC',
            'dosage' => 'For adults and children 6 years and older, standard dose is one 10 mg tablet once daily.',
            'dental_usage' => 'Also used before dental extraction for patients with drug allergies or hypersensitivity management.',
            'uses_text' => 'Alatrol contains 10 mg Cetirizine HCl and is commonly prescribed for:',
            'side_effects' => 'Alatrol is non-drowsy for most patients, but mild side effects may occasionally occur:',
            'subtitle' => 'Comprehensive prescription guide on Uses, Dosage, Side Effects, Safety Warnings & Prices in Bangladesh.',
            'verified_badge' => 'Medically Verified',
            'published_date' => 'May 20, 2026',
            'intro' => 'Alatrol is a widely used antihistamine containing Cetirizine Hydrochloride utilized for the effective, long-acting relief of diverse allergic conditions. It is a second-generation H1-receptor antagonist that works by selectively blocking peripheral histamine receptors, stopping allergic reactions before they compound. Produced by Square Pharmaceuticals PLC, here is an updated guide for 2026.',
            'uses_items' => [
                ['label' => 'Seasonal Allergic Rhinitis', 'text' => 'Fast relief from sneezing, runny nose, and watery eyes.'],
                ['label' => 'Perennial Allergic Rhinitis', 'text' => 'Year-round defense against dust mites and pet dander.'],
                ['label' => 'Chronic Idiopathic Urticaria', 'text' => 'Minimizes severe skin hives, itching, and red rash spots.'],
                ['label' => 'Allergen Asthma Support', 'text' => 'Supportive therapy for secondary allergy-related tightness.'],
            ],
            'dosage_admin' => 'Swallow the tablet whole with a glass of water. Do not crush or chew before swallowing.',
            'dosage_timing' => 'Can be taken with or without food. Taking it in the evening is often recommended.',
            'side_effects_items' => ['Mild Sleepiness', 'Dry Mouth', 'Mild Fatigue', 'Headache'],
            'warnings' => [
                ['icon' => 'triangle-exclamation', 'label' => 'Alertness Caution', 'text' => 'Avoid driving or heavy machinery operation until you know how Cetirizine affects your focus.'],
                ['icon' => 'ban', 'label' => 'Avoid Alcohol', 'text' => 'Concurrent alcohol intake may amplify drowsiness or impair mental alertness.'],
                ['icon' => 'user-doctor', 'label' => 'Kidney & Liver Care', 'text' => 'Patients with renal impairment require a reduced dosage (5 mg daily).'],
            ],
            'price_per_tablet' => '৳3.01',
            'price_per_strip' => '৳30.10',
            'price_manufacturer' => 'Square Pharma PLC',
            'gallery' => [
                ['src' => 'https://placehold.co/450x280/ffffff/8b1d41?text=Alatrol+10mg+Carton+%26+Blister', 'caption' => 'Alatrol 10 mg carton with tablet blister pack.'],
                ['src' => 'https://placehold.co/450x280/ffffff/8b1d41?text=Angled+View+Alatrol+10mg', 'caption' => 'Angled view of Alatrol 10 mg packaging.'],
            ],
            'faqs' => [
                ['q' => 'What is Alatrol used for?', 'a' => 'Alatrol is indicated for the symptomatic relief of seasonal and perennial allergic rhinitis, chronic hives, runny nose, sneezing, and skin itching.'],
                ['q' => 'Is cetirizine used for itchy skin?', 'a' => 'Yes, Cetirizine Hydrochloride (active ingredient in Alatrol) is highly effective in relieving itching, allergic rashes, and hives (urticaria).'],
                ['q' => 'What is the standard Alatrol dose per day?', 'a' => 'The standard dose for adults and children aged 6 years and above is one 10 mg tablet once daily.'],
                ['q' => 'What is the price of Alatrol in Bangladesh?', 'a' => 'Alatrol 10 mg costs approximately ৳3.01 per tablet and ৳30.10 for a strip of 10 tablets.'],
                ['q' => 'Is Alatrol effective for a cough?', 'a' => 'Alatrol helps if the cough is caused by upper airway cough syndrome (post-nasal drip) or an allergy. It is not effective for chest infections or bronchitis.'],
                ['q' => 'Does Alatrol make you sleepy?', 'a' => 'Alatrol is a second-generation non-drowsy antihistamine. However, mild drowsiness can occur in a small percentage of sensitive individuals.'],
                ['q' => 'What are the main side effects of Alatrol?', 'a' => 'Common mild side effects include mild sleepiness, dry mouth or throat, slight fatigue, and mild headache or dizziness.'],
                ['q' => 'How quickly does Alatrol start working?', 'a' => 'It is rapidly absorbed after oral intake, providing noticeable relief within 20 to 60 minutes, and stays active for 24 hours.'],
                ['q' => 'Are there alternative brands to Alatrol in Bangladesh?', 'a' => 'Yes, common alternative Cetirizine brands include Atrizin (Beximco), Rhinil (Aristopharma), Acitrin (ACI), Citin (Opsonin), and CTZ (Delta).'],
                ['q' => 'Does Alatrol treat the common cold?', 'a' => 'No, it only manages runny nose or sneezing caused by allergies; it does not cure or treat viral cold strains.'],
                ['q' => 'What should I do if I miss a dose?', 'a' => 'Take it as soon as you remember. If it is almost time for your next scheduled dose, skip the missed dose. Do not double the dose.'],
                ['q' => 'How can I reduce household allergy triggers?', 'a' => 'Regularly wash bed sheets in hot water, minimize indoor dust accumulation, use air filters, and avoid pet dander exposure.'],
            ],
            'author' => [
                'img' => 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
                'name' => 'Dr. Afsana Haque Joty',
                'bio' => 'Dr. Afsana Haque Joty is a highly skilled Senior Dental Surgeon at the Mirpur branch of Tech Dental, bringing over five years of clinical expertise to her practice. A distinguished alumna of the University of Dhaka, she completed her Post-Graduate Training (PGT) in Oral & Maxillofacial Surgery and Pediatric Dentistry at Dhaka Dental College. Registered with the BMDC (Registration No. 11071), Dr. Joty also holds specialized training in Aesthetic Dentistry. She is dedicated to providing modern, high-quality dental solutions for both children and adults with the utmost care and precision.',
                'reviewed_by' => 'Dr. Afsana Haque Joty',
                'last_updated' => 'Oct 22, 2026',
                'disclaimer' => 'Disclaimer: Educational information only. Not a substitute for professional medical advice.',
            ],
            'related' => [
                ['brand' => 'Beximco', 'name' => 'Napa 500mg', 'generic' => 'Paracetamol 500 mg', 'quick' => 'Post-extraction ache, mild pulpitis & fever relief.'],
                ['brand' => 'Beximco', 'name' => 'Napa Extra', 'generic' => 'Paracetamol + Caffeine', 'quick' => 'Acute throbbing pain & wisdom tooth flare-ups.'],
                ['brand' => 'Radiant', 'name' => 'Naprosyn 500', 'generic' => 'Naproxen 500 mg', 'quick' => 'Severe swelling, acute pulpitis & TMJ joint pain.'],
            ],
            'sort_order' => 0,
        ];

        foreach (array_merge([$detail], $listing) as $medicine) {
            Medicine::updateOrCreate(['slug' => $medicine['slug']], $medicine);
        }
    }
}
