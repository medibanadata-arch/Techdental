<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\Medicine;

class BilingualDemoSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create or Update Fully Featured Bilingual Dental Blog Post
        $post = Post::updateOrCreate(
            ['slug' => 'root-canal-treatment-guide-dhaka'],
            [
                'title' => 'Complete Guide to Root Canal Treatment: Painless Dental Care in Dhaka',
                'title_bn' => 'রুট ক্যানেল চিকিৎসার পূর্ণাঙ্গ গাইড: ঢাকায় ব্যথাহীন আধুনিক দন্তচিকিৎসা',
                'excerpt' => 'Suffering from severe toothache? Learn why root canal treatment is essential, the step-by-step procedure, cost in Bangladesh, and recovery tips from senior dental specialists.',
                'excerpt_bn' => 'তীব্র দাঁতের ব্যথায় ভুগছেন? রুট ক্যানেল চিকিৎসা কেন প্রয়োজন, এর বিভিন্ন ধাপ, বাংলাদেশে এর খরচ এবং বিশেষজ্ঞদের পরামর্শ নিয়ে বিস্তারিত জানুন।',
                'category' => 'Root Canal & Surgery',
                'category_bn' => 'রুট ক্যানেল ও সার্জারি',
                'author_name' => 'Dr. Ayesha Siddika, BDS, PGT',
                'author_name_bn' => 'ডা. আয়েশা সিদ্দিকা, বিডিএস, পিজিটি',
                'author_bio' => 'Senior Dental Surgeon & Endodontist at Tech Dental Care Dhaka. Specialized in painless single-visit rotary root canals with over 8 years of clinical excellence.',
                'author_bio_bn' => 'টেক ডেন্টাল কেয়ার ঢাকা-এর সিনিয়র ডেন্টাল সার্জন ও এন্ডোডনটিস্ট। ব্যথাহীন সিঙ্গেল-ভিজিট রোটারি রুট ক্যানেলে ৮ বছরেরও বেশি ক্লিনিক্যাল অভিজ্ঞতাসম্পন্ন।',
                'author_avatar' => 'https://ui-avatars.com/api/?name=Dr.+Aysha+Siddika&background=881337&color=fff&size=160',
                'img' => 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80',
                'thumb_url' => 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80',
                'published_at' => now()->subDays(2),
                'status' => 'published',
                'content' => '
<p class="lead font-medium text-slate-700">Root canal therapy is one of the most effective dental procedures designed to save a natural tooth from extraction. When tooth decay reaches deep into the nerve pulp, intense throbbing pain and swelling occur. Modern rotary endodontics at Tech Dental makes this procedure virtually painless, fast, and remarkably successful.</p>

<h2>What is Root Canal Treatment (RCT)?</h2>
<p>A root canal treatment involves cleaning out infected or dead nerve tissue (the dental pulp) located within the tooth canals. Once meticulously disinfected and shaped using specialized flexible titanium instruments, the empty canals are sealed with a biocompatible material known as gutta-percha. This eliminates infection while preserving your natural tooth structure and chewing ability.</p>

<h2>Common Signs You Need Root Canal Therapy</h2>
<p>Patients who require endodontic therapy typically present with distinct clinical signs:</p>
<ul>
    <li><strong>Persistent Throbbing Pain:</strong> Pain that worsens when lying down or waking up at night.</li>
    <li><strong>Extreme Sensitivity:</strong> Lingering discomfort when drinking hot tea, coffee, or cold water that lasts more than 30 seconds.</li>
    <li><strong>Swelling and Gum Boil:</strong> A localized pimple-like bump on the gum discharging small amounts of fluid.</li>
    <li><strong>Dark Tooth Discoloration:</strong> Grayish or brownish darkening of a single tooth indicating nerve necrosis.</li>
</ul>

<h2>Step-by-Step Procedure at Tech Dental</h2>
<p>Our experienced dental team utilizes international sterilization standards and digital apex locators for pinpoint accuracy:</p>
<ol>
    <li><strong>Computerized Digital X-Ray:</strong> Precision 3D and periapical imaging to evaluate root canal anatomy and surrounding bone condition.</li>
    <li><strong>Painless Local Anesthesia:</strong> Ensuring complete numbness of the tooth and adjacent tissue prior to beginning.</li>
    <li><strong>Rotary Debridement:</strong> Micro-motor endodontic files gently remove bacterial colonies and infected pulp.</li>
    <li><strong>Laser-Assisted Disinfection:</strong> Eradicating microscopic bacteria deep inside the dentinal tubules.</li>
    <li><strong>Hermetic Gutta-Percha Obturation:</strong> Sealing the canals followed by permanent resin core restoration and a protective porcelain/zirconia crown.</li>
</ol>

<h2>Post-Treatment Care & Longevity</h2>
<p>Following the completion of your root canal, mild tenderness is normal for 24 to 48 hours and is easily managed with prescribed analgesic medications. A custom crown is strongly advised to reinforce the brittle tooth against strong biting forces, enabling the treated tooth to last a lifetime with regular flossing and biannual checkups.</p>
',
                'content_bn' => '
<p class="lead font-medium text-slate-700">রুট ক্যানেল ট্রিটমেন্ট (RCT) হলো আক্রান্ত বা ক্ষতিগ্রস্ত দাঁত তুলে না ফেলে বাঁচিয়ে রাখার সবচেয়ে নিরাপদ ও আধুনিক চিকিৎসাপদ্ধতি। যখন দাঁতের গভীরের মজ্জা বা পাল্পে ইনফেকশন ছড়িয়ে পড়ে, তখন অসহ্য তীব্র ব্যথা ও মাড়ি ফুলে যাওয়ার সমস্যা দেখা দেয়। টেক ডেন্টাল কেয়ারে রোটারি প্রযুক্তির মাধ্যমে এই চিকিৎসা সম্পূর্ণ ব্যথাহীন ও দ্রুত সম্পন্ন করা হয়।</p>

<h2>রুট ক্যানেল চিকিৎসা আসলে কী?</h2>
<p>প্রতিটি দাঁতের ভেতরে স্নায়ু ও রক্তনালী সমৃদ্ধ একটি নরম অংশ থাকে, যাকে পাল্প (Pulp) বলা হয়। ব্যাকটেরিয়া যখন এনামেল ও ডেনটিন ভেদ করে এই পাল্পে প্রবেশ করে, তখন ইনফেকশন তৈরি হয়। রুট ক্যানেল চিকিৎসায় অত্যন্ত সতর্কতার সাথে এই সংক্রমিত পাল্প অপসারণ করে বিশেষ অ্যান্টিসেপ্টিক দিয়ে ক্যানেল পরিষ্কার করা হয় এবং পরবর্তীতে স্থায়ী ‘গাটা-পার্চা’ সিল্যান্ট দিয়ে দাঁতটি সুরক্ষিত করা হয়।</p>

<h2>যেসব লক্ষণ দেখলে রুট ক্যানেল প্রয়োজন বুঝবেন</h2>
<p>দাঁতে জটিল সংক্রমণ সৃষ্টি হলে সাধারণত নিচের উপসর্গগুলো প্রকাশ পায়:</p>
<ul>
    <li><strong>অসহ্য তীব্র ব্যথা:</strong> বিশেষ করে রাতে ঘুমানোর সময় বা শুয়ে থাকলে ব্যথার তীব্রতা বৃদ্ধি পাওয়া।</li>
    <li><strong>দীর্ঘস্থায়ী সংবেদনশীলতা (শিরশিরানি):</strong> গরম চা-কফি বা বরফঠান্ডা পানি পানের পর ৩০ সেকেন্ডের বেশি সময় ধরে তীব্র চিনচিনে ব্যথা থাকা।</li>
    <li><strong>মাড়ি ফুলে যাওয়া ও পুঁজ বের হওয়া:</strong> দাঁতের গোড়ায় ছোট ফোঁড়ার মতো হওয়া যা চাপ দিলে অস্বস্তি বা পুঁজ নিঃসরণ হয়।</li>
    <li><strong>দাঁতের রঙ পরিবর্তন হওয়া:</strong> আঘাত বা স্নায়ু ক্ষতিগ্রস্ত হওয়ার কারণে দাঁত ধূসর বা কালো হয়ে যাওয়া।</li>
</ul>

<h2>টেক ডেন্টালে চিকিৎসার আধুনিক ধাপসমূহ</h2>
<p>আমাদের আধুনিক ক্লিনিকে আন্তর্জাতিক মানদণ্ড অনুসরণ করে সর্বোচ্চ সতর্কতায় রুট ক্যানেল সম্পন্ন করা হয়:</p>
<ol>
    <li><strong>ডিজিটাল এক্স-রে ও পর্যবেক্ষণ:</strong> ক্যানেলের দৈর্ঘ্য ও শিকড়ের গঠন নিখুঁতভাবে জানার জন্য ডিজিটাল আরভিজি এক্স-রে ব্যবহার।</li>
    <li><strong>ব্যথাহীন লোকাল অ্যানেস্থেশিয়া:</strong> আরামদায়ক চিকিৎসা নিশ্চিত করতে আক্রান্ত অংশে আধুনিক অ্যানেস্থেসিয়া প্রদান।</li>
    <li><strong>রোটারি অ্যান্ডোডন্টিক ক্লিনিং:</strong> মাইক্রো-মোটর চালিত স্বয়ংক্রিয় ফাইল দ্বারা দ্রুত ও নির্ভুলভাবে ক্যানেলের জীবাণু পরিষ্কার।</li>
    <li><strong>জীবাণুমুক্তকরণ ও ড্রেসিং:</strong> উচ্চক্ষমতাসম্পন্ন মেডিকেটেড ওয়াশ দিয়ে ভেতরের সব ধরণের ব্যাকটেরিয়া ধ্বংস করা।</li>
    <li><strong>স্থায়ী সিলিং ও ক্যাপ/ক্রাউন স্থাপন:</strong> ক্যানেল সিল করে কম্পোজিট ফিলিং এবং দাঁতের দীর্ঘস্থায়িত্ব নিশ্চিত করতে উন্নত মানের জিরকোনিয়া বা পোরসিলেন ক্রাউন লাগানো।</li>
</ol>

<h2>চিকিৎসা পরবর্তী যত্ন ও পরামর্শ</h2>
<p>রুট ক্যানেল সম্পন্ন হওয়ার পর প্রথম ১-২ দিন হালকা অস্বস্তি হতে পারে, যা চিকিৎসকের দেওয়া সাধারণ ব্যথানাশক ঔষধ খেলেই দ্রুত সেরে যায়। রুট ক্যানেল করা দাঁত স্বাভাবিক দাঁতের চেয়ে কিছুটা ভঙ্গুর হয়ে যায়, তাই ক্যাপ বা ক্রাউন লাগিয়ে নিলে দাঁতটি আজীবন সাধারণ দাঁতের মতোই স্বাভাবিক চিবানোর শক্তি প্রদান করে।</p>
',
                'faqs' => [
                    [
                        'q' => 'Is root canal treatment painful?',
                        'q_bn' => 'রুট ক্যানেল চিকিৎসায় কি প্রচণ্ড ব্যথা হয়?',
                        'a' => 'No. With modern local anesthetics and advanced rotary instruments at Tech Dental, the procedure is as comfortable and painless as getting a routine filling.',
                        'a_bn' => 'না, একদমই নয়। টেক ডেন্টালে আধুনিক লোকাল অ্যানেস্থেসিয়া ও ডিজিটাল রোটারি যন্ত্র ব্যবহারের ফলে চিকিৎসাটি সম্পূর্ণ ব্যথাহীন এবং সাধারণ ফিলিং করার মতোই আরামদায়ক।'
                    ],
                    [
                        'q' => 'How many visits are required to complete a root canal?',
                        'q_bn' => 'রুট ক্যানেল সম্পন্ন করতে কতটি ভিজিট বা সেশন লাগে?',
                        'a' => 'In most uncomplicated cases, our specialists complete the treatment in a single 45-minute session. Severe multi-root infections may require 2 visits.',
                        'a_bn' => 'বেশিরভাগ ক্ষেত্রে আমাদের অভিজ্ঞ চিকিৎসকরা মাত্র একটি ভিজিটেই (৪৫ মিনিটে) সম্পূর্ণ চিকিৎসা সম্পন্ন করেন। তবে খুব বেশি ইনফেকশন থাকলে ২টি সেশন লাগতে পারে।'
                    ],
                    [
                        'q' => 'Is putting a dental cap (crown) mandatory after root canal?',
                        'q_bn' => 'রুট ক্যানেল করার পর দাঁতে ক্যাপ বা ক্রাউন লাগানো কি বাধ্যতামূলক?',
                        'a' => 'Yes, highly recommended. Since the tooth loses its blood supply, it becomes brittle. A custom crown restores full chewing strength and prevents fracture.',
                        'a_bn' => 'হ্যাঁ, অত্যন্ত গুরুত্বপূর্ণ। রুট ক্যানেলের পর দাঁত রক্ত সঞ্চালনহীন হয়ে কিছুটা ভঙ্গুর হয়ে পড়ে। তাই ক্যাপ লাগালে দাঁতটি ভেঙে যাওয়ার ঝুঁকি থাকে না এবং আজীবন টিকে থাকে।'
                    ]
                ]
            ]
        );

        // 2. Create or Update Fully Featured Bilingual Dental Medicine
        $medicine = Medicine::updateOrCreate(
            ['slug' => 'keto-10mg-tablet'],
            [
                'name' => 'Keto 10mg Tablet',
                'name_bn' => 'কেটো ১০ মি.গ্রা. ট্যাবলেট',
                'generic' => 'Ketorolac Tromethamine 10 mg',
                'generic_bn' => 'কিটোরোলাক ট্রমিথামাইন ১০ মি.গ্রা.',
                'category' => 'pain',
                'tag' => 'ACUTE PAIN RELIEF',
                'tag_bn' => 'তীব্র ব্যথানাশক',
                'pharma' => 'Beximco Pharmaceuticals Ltd.',
                'pharma_bn' => 'বেক্সিমকো ফার্মাসিউটিক্যালস লিমিটেড',
                'subtitle' => 'High-potency non-steroidal anti-inflammatory prescription tablet for moderate to severe post-dental pain',
                'subtitle_bn' => 'দাঁতের তীব্র ব্যথা ও ডেন্টাল সার্জারি পরবর্তী দ্রুত উপশমে কার্যকর উচ্চক্ষমতাসম্পন্ন প্রেসক্রিপশন মেডিসিন',
                'image' => 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80',
                'quick_use' => 'Fast acute dental extraction pain, severe pulpitis discomfort & postoperative ache.',
                'quick_use_bn' => 'দাঁত তোলার পর তীব্র ব্যথা, জটিল রুট ক্যানেল ও ডেন্টাল সার্জারি পরবর্তী ব্যথায় দ্রুত উপশম।',
                'dosage' => 'One 10mg tablet every 4 to 6 hours as needed. Maximum 40mg per day. Do not exceed 5 days.',
                'dosage_bn' => 'প্রয়োজন অনুযায়ী ১টি ১০ মি.গ্রা. ট্যাবলেট প্রতি ৪ থেকে ৬ ঘণ্টা অন্তর সেব্য। দিনে সর্বোচ্চ ৪টি (৪০ মি.গ্রা.)। একটানা ৫ দিনের বেশি সেবন করবেন না।',
                'dosage_admin' => 'Take orally with or immediately after a meal with a full glass of water. Avoid taking on an empty stomach.',
                'dosage_admin_bn' => 'অবশ্যই ভরা পেটে অথবা খাবারের সাথে এক গ্লাস পানির সাথে সেবন করবেন। খালি পেটে সেবন করা সম্পূর্ণ নিষিদ্ধ।',
                'dosage_timing' => 'Initiate the first dose as the local dental anesthesia wears off to prevent acute pain spikes.',
                'dosage_timing_bn' => 'ডেন্টাল অ্যানেস্থেশিয়ার অসাড় ভাব কমে আসার আগেই প্রথম ডোজটি গ্রহণ করুন যাতে ব্যথার তীব্রতা বাড়তে না পারে।',
                'dental_usage' => 'Ketorolac provides analgesic efficacy comparable to mild opioids without addictive potential, making it the premier choice in dental surgery.',
                'dental_usage_bn' => 'কিটোরোলাক কোনো আসক্তি তৈরি না করেই ওপিওয়েড বা কড়া ব্যথানাশকের মতো দ্রুত দাঁতের তীব্র ব্যথা দূর করতে সক্ষম, যা ডেন্টাল চিকিৎসায় অত্যন্ত প্রশংসিত।',
                'uses_text' => 'Ketorolac tromethamine is indicated for the short-term (up to 5 days) management of moderate to severe acute dental pain requiring analgesia at the opioid level.',
                'uses_text_bn' => 'কিটোরোলাক ট্রমিথামাইন ডেন্টাল সার্জারি বা দাঁতের আঘাতজনিত তীব্র ও মাঝারি ব্যথা স্বল্পমেয়াদে (সর্বোচ্চ ৫ দিন) দ্রুত নিয়ন্ত্রণে রাখার জন্য নির্দেশিত।',
                'side_effects' => 'Common transient adverse reactions include gastrointestinal upset, nausea, headache, and mild dizziness.',
                'side_effects_bn' => 'সাধারণ সম্ভাব্য পার্শ্বপ্রতিক্রিয়ার মধ্যে পেটে হালকা গ্যাস, বমি বমি ভাব, মাথা ঘোরা বা হালকা ক্লান্তি অনুভব হতে পারে।',
                'uses_items' => [
                    [
                        'label' => 'Surgical Extraction Ache',
                        'label_bn' => 'সার্জিক্যাল দাঁত তোলার ব্যথা',
                        'text' => 'Rapidly subsides throbbing discomfort following complex wisdom tooth removal.',
                        'text_bn' => 'আক্কেল দাঁত বা জটিল দাঁত অপসারণের পর দ্রুত তীব্র চিনচিনে ব্যথা কমায়।'
                    ],
                    [
                        'label' => 'Acute Dental Pulpitis',
                        'label_bn' => 'তীব্র দাঁতের মজ্জার প্রদাহ',
                        'text' => 'Controls agonizing nerve pain prior to completing root canal instrumentation.',
                        'text_bn' => 'রুট ক্যানেল করার পূর্বে দাঁতের স্নায়ুর অসহ্য ব্যথা দ্রুত শান্ত করে।'
                    ],
                    [
                        'label' => 'Post-Periodontal Surgery',
                        'label_bn' => 'মাড়ির অপারেশনের পরবর্তী যত্ন',
                        'text' => 'Reduces swelling and inflammatory tenderness around treated gum tissues.',
                        'text_bn' => 'চিকিৎসাকৃত মাড়ির চারপাশের ফোলাভাব ও প্রদাহজনিত যন্ত্রণা উল্লেখযোগ্যভাবে কমায়।'
                    ]
                ],
                'side_effects_items' => [
                    ['text' => 'Epigastric discomfort or mild nausea if taken without meals', 'text_bn' => 'খাবারের আগে বা খালি পেটে খেলে পেটে জ্বালাপোড়া বা অস্বস্তি হতে পারে'],
                    ['text' => 'Occasional mild dizziness or drowsiness', 'text_bn' => 'কখনও কখনও হালকা মাথা ঘোরা বা সামান্য ঘুম ঘুম ভাব হতে পারে'],
                    ['text' => 'Slight headache or dry mouth', 'text_bn' => 'সামান্য মাথাব্যথা বা মুখের ভেতর হালকা শুষ্ক ভাব হতে পারে']
                ],
                'warnings' => [
                    [
                        'icon' => 'ban',
                        'label' => 'Active Peptic Ulcer Ban',
                        'label_bn' => 'সক্রিয় পেপটিক আলসার নিষেধ',
                        'text' => 'Strictly contraindicated in patients with active gastrointestinal bleeding or ulcer disease.',
                        'text_bn' => 'পাকস্থলী বা খাদ্যনালীতে আলসার বা রক্তক্ষরণের ইতিহাস থাকলে এটি সম্পূর্ণ নিষিদ্ধ।'
                    ],
                    [
                        'icon' => 'triangle',
                        'label' => '5-Day Maximum Limit',
                        'label_bn' => 'সর্বোচ্চ ৫ দিনের সতর্কতা',
                        'text' => 'Never exceed 5 days of combined therapy to avoid renal or gastrointestinal toxicity.',
                        'text_bn' => 'কিডনি ও পাকস্থলীর সুরক্ষায় একটানা ৫ দিনের বেশি কোনোভাবেই সেবন করা যাবে না।'
                    ],
                    [
                        'icon' => 'user-doctor',
                        'label' => 'Pregnancy & Kidney Caution',
                        'label_bn' => 'গর্ভাবস্থা ও কিডনি সতর্কতা',
                        'text' => 'Requires close dentist supervision in elderly patients and third-trimester pregnancy.',
                        'text_bn' => 'বয়স্ক রোগী ও গর্ভাবস্থায় চিকিৎসকের সুনির্দিষ্ট পরামর্শ ব্যতিরেকে সেবন করা যাবে না।'
                    ]
                ],
                'price_per_tablet' => '৳ 12.00',
                'price_per_strip' => '৳ 120.00 (10 Tablets)',
                'price_manufacturer' => 'Beximco Pharmaceuticals Ltd.',
                'verified_badge' => 'Medically Verified',
                'verified_badge_bn' => 'মেডিকেলি ভেরিফাইড',
                'published_date' => 'Updated 2026',
                'intro' => 'Keto (Ketorolac Tromethamine) is a non-steroidal anti-inflammatory drug (NSAID) widely prescribed in oral surgery for rapid, potent analgesia. Unlike narcotics, it carries no risk of dependence while maintaining high clinical efficacy.',
                'intro_bn' => 'কেটো (কিটোরোলাক ট্রমিথামাইন) হলো একটি শক্তিশালী নন-স্টেরয়েডাল অ্যান্টি-ইনফ্ল্যামেটরি (NSAID) ব্যথানাশক ঔষধ, যা ডেন্টাল চিকিৎসায় তীব্র ব্যথা দ্রুত নিয়ন্ত্রণে সবচেয়ে বেশি ব্যবহৃত হয়। এটি কোনো নেশা তৈরি করে না এবং দাঁতের ব্যথায় অত্যন্ত দ্রুত স্বস্তি এনে দেয়।',
                'faqs' => [
                    [
                        'q' => 'Can I take Keto 10mg on an empty stomach?',
                        'q_bn' => 'কেটো ১০ মি.গ্রা. কি খালি পেটে খাওয়া যাবে?',
                        'a' => 'No. Always take with meals or a glass of milk to protect your stomach lining from acid irritation.',
                        'a_bn' => 'না। কখনোই খালি পেটে খাওয়া উচিত নয়। সবসময় ভরা পেটে অথবা এক গ্লাস দুধ বা পর্যাপ্ত পানির সাথে সেবন করবেন।'
                    ],
                    [
                        'q' => 'How many days can I safely take this medicine?',
                        'q_bn' => 'আমি কতদিন একটানা এই ঔষধটি সেবন করতে পারব?',
                        'a' => 'The absolute maximum duration is 5 consecutive days. If dental pain persists, consult your Tech Dental doctor immediately.',
                        'a_bn' => 'চিকিৎসাবিজ্ঞান অনুযায়ী একটানা সর্বোচ্চ ৫ দিন সেবন করা নিরাপদ। ৫ দিনের বেশি ব্যথা থাকলে অবিলম্বে টেক ডেন্টালের চিকিৎসকের পরামর্শ নিন।'
                    ],
                    [
                        'q' => 'Does this medicine reduce dental swelling too?',
                        'q_bn' => 'এই ঔষধটি কি ব্যথার পাশাপাশি দাঁত বা মাড়ির ফোলাভাব কমায়?',
                        'a' => 'Yes. As an anti-inflammatory NSAID, it reduces both pain neurotransmitters and localized swelling around the tooth socket.',
                        'a_bn' => 'হ্যাঁ। এটি একটি অ্যান্টি-ইনফ্ল্যামেটরি ঔষধ হওয়ায় ব্যথার পাশাপাশি আক্রান্ত দাঁত ও মাড়ির চারপাশের ফোলাভাবও দ্রুত কমিয়ে আনে।'
                    ]
                ],
                'author' => [
                    'name' => 'Dr. Ayesha Siddika, BDS, PGT',
                    'bio' => 'Senior Dental Surgeon & Consultant at Tech Dental Care Dhaka with over 8 years clinical experience.',
                    'bio_bn' => 'টেক ডেন্টাল কেয়ার ঢাকা-এর সিনিয়র ডেন্টাল সার্জন ও কনসালট্যান্ট, ৮ বছরেরও বেশি ক্লিনিক্যাল অভিজ্ঞতাসম্পন্ন।',
                    'reviewed_by' => 'Dr. Farhana Ahmed, Clinical Director',
                    'reviewed_by_bn' => 'ডা. ফারহানা আহমেদ, ক্লিনিক্যাল ডিরেক্টর',
                    'last_updated' => 'January 2026',
                    'disclaimer' => 'Disclaimer: This information is for clinical and educational reference only. Consult a registered dentist before use.',
                    'disclaimer_bn' => 'সতর্কবার্তা: এই তথ্য শুধুমাত্র ক্লিনিক্যাল ও শিক্ষামূলক রেফারেন্সের জন্য। যেকোনো ঔষধ সেবনের পূর্বে অবশ্যই একজন রেজিস্টার্ড ডেন্টিস্টের পরামর্শ নিন।'
                ],
                'is_active' => true,
                'sort_order' => 1
            ]
        );

        echo "Seeded successfully:\n";
        echo "- Post ID: {$post->id} | {$post->title}\n";
        echo "- Medicine ID: {$medicine->id} | {$medicine->name}\n";
    }
}
