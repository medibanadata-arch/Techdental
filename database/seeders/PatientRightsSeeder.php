<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PatientRight;
use App\Models\PatientResponsibility;
use App\Models\PatientRightsSetting;

class PatientRightsSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Settings
        if (PatientRightsSetting::count() === 0) {
            PatientRightsSetting::create([
                'hero_title_en' => 'Tech Dental Patient Bill of Rights and Responsibilities',
                'hero_title_bn' => 'টেক ডেন্টাল রোগীর অধিকার ও দায়িত্বসমূহ',
                'hero_desc_en' => 'At Tech Dental, we are committed to providing high-quality, compassionate, and modern dental care in a comfortable and respectful environment. The following outlines your rights as our valued patient, along with the responsibilities we ask of you to help ensure the best possible experience and outcomes for everyone.',
                'hero_desc_bn' => 'টেক ডেন্টালে আমরা একটি আরামদায়ক ও শ্রদ্ধাশীল পরিবেশে উচ্চমানের, যত্নশীল এবং আধুনিক ডেন্টাল কেয়ার প্রদানের জন্য অঙ্গীকারবদ্ধ। নিচে আমাদের সম্মানিত রোগী হিসেবে আপনার অধিকারসমূহ এবং দায়িত্বসমূহ তুলে ধরা হলো।',
                'partnership_title_en' => 'Our Partnership',
                'partnership_title_bn' => 'আমাদের অংশীদারিত্ব',
                'partnership_text_en' => "We believe that a strong, trusting relationship between the patient and the dental team leads to the best oral health outcomes. If at any time you feel these rights have not been honored, please speak with our office manager or dentist directly. We are here to listen and improve.\n\nThank you for choosing Tech Dental — where technology meets compassionate care.",
                'partnership_text_bn' => "আমরা বিশ্বাস করি রোগী এবং ডেন্টাল টিমের মধ্যে দৃঢ় ও বিশ্বাসযোগ্য সম্পর্কই সেরা ফলাফল নিশ্চিত করে। আপনার যদি কখনো মনে হয় এই অধিকারগুলো যথাযথভাবে পূরণ হয়নি, তবে অনুগ্রহ করে আমাদের অফিস ম্যানেজার বা চিকিৎসকের সাথে সরাসরি কথা বলুন। আমরা শুনতে এবং উন্নত করতে সদা প্রস্তুত।\n\nটেক ডেন্টাল বেছে নেওয়ার জন্য ধন্যবাদ — যেখানে প্রযুক্তির সাথে সেবার মেলবন্ধন।",
                'author_name_en' => 'Tech Dental',
                'author_name_bn' => 'টেক ডেন্টাল',
                'author_bio_en' => 'Tech Dental is the largest dental chain in Bangladesh, with branches in cities like Dhaka (Badda, Mirpur, Uttara, Jatrabari). It emphasizes advanced technology (like Digital X-Ray, Intra Oral Cameras), strict 4-step sterilization protocols, and a commitment to providing affordable, high-quality care. They offer a comprehensive range of services, including routine check-ups, Root Canal Treatment (RCT), braces, dental implants, cosmetic dentistry, and more, all within a modern and patient-friendly environment, making it a popular choice for families and professionals.',
                'author_bio_bn' => 'টেক ডেন্টাল বাংলাদেশের অন্যতম শীর্ষস্থানীয় ডেন্টাল চেইন, যার শাখা রয়েছে ঢাকার মিরপুর, উত্তরা, বাড্ডা ও যাত্রাবাড়ীতে। অত্যাধুনিক প্রযুক্তি (যেমন ডিজিটাল এক্স-রে, ইন্ট্রা ওরাল ক্যামেরা), ৪-ধাপের কড়া জীবাণুমুক্তকরণ ব্যবস্থা এবং সাশ্রয়ী মূল্যে মানসম্মত সেবা প্রদানের জন্য টেক ডেন্টাল সুপরিচিত।',
                'author_image' => null,
                'meta_title_en' => 'Patient Bill of Rights and Responsibilities | Tech Dental Care',
                'meta_title_bn' => 'রোগীর অধিকার ও দায়িত্বসমূহ | টেক ডেন্টাল কেয়ার',
                'meta_desc_en' => 'Learn about patient rights and responsibilities at Tech Dental Care Bangladesh.',
                'meta_desc_bn' => 'টেক ডেন্টাল কেয়ারে রোগীর অধিকার এবং দায়িত্ব সম্পর্কে বিস্তারিত জানুন।',
            ]);
        }

        // 2. Rights
        if (PatientRight::count() === 0) {
            $rights = [
                [
                    'text_en' => 'Receive considerate and respectful care — free from discrimination based on race, color, religion, gender, sexual orientation, national origin, age, disability, or source of payment.',
                    'text_bn' => 'বর্ণ, ধর্ম, লিঙ্গ, জাতীয়তা, বয়স, শারীরিক অক্ষমতা বা অর্থপ্রদানের মাধ্যম নির্বিশেষে সমবেদনা ও শ্রদ্ধাশীল সেবা পাওয়ার অধিকার।',
                    'order' => 1,
                    'is_active' => true,
                ],
                [
                    'text_en' => 'Be treated in a clean, safe, and comfortable environment with appropriate infection control and sterilization procedures at all times.',
                    'text_bn' => 'সর্বদা যথাযথ জীবাণুমুক্তকরণ ও সংক্রমণ নিয়ন্ত্রণ ব্যবস্থাসম্পন্ন একটি পরিষ্কার, নিরাপদ এবং আরামদায়ক পরিবেশে চিকিৎসা গ্রহণ করার অধিকার।',
                    'order' => 2,
                    'is_active' => true,
                ],
                [
                    'text_en' => 'Receive clear, complete, and understandable information about your oral health condition, diagnosis, recommended treatment options, alternatives (including no treatment), foreseeable risks, benefits, and expected outcomes.',
                    'text_bn' => 'আপনার দাঁত ও মুখের স্বাস্থ্য পরিস্থিতি, রোগ নির্ণয়, প্রস্তাবিত চিকিৎসা পদ্ধতি, সম্ভাব্য বিকল্পসমূহ, সম্ভাব্য ঝুঁকি, সুবিধা এবং সম্ভাব্য ফলাফল সম্পর্কে স্পষ্ট ও বোধগম্য তথ্য জানার অধিকার।',
                    'order' => 3,
                    'is_active' => true,
                ],
                [
                    'text_en' => 'Give or withhold informed consent for any treatment, procedure, or service, and to receive a thorough explanation before any treatment begins.',
                    'text_bn' => 'যেকোনো চিকিৎসা বা প্রক্রিয়া শুরু করার আগে বিস্তারিত ব্যাখ্যা পাওয়ার এবং তাতে সম্মতি প্রদান বা প্রত্যাহার করার অধিকার।',
                    'order' => 4,
                    'is_active' => true,
                ],
                [
                    'text_en' => 'Ask questions about your care at any time and to receive prompt, honest, and respectful answers from our dental team.',
                    'text_bn' => 'চিকিৎসা সংক্রান্ত যেকোনো প্রশ্ন যেকোনো সময় জিজ্ঞাসা করার এবং ডেন্টাল টিমের কাছ থেকে দ্রুত, সৎ ও শ্রদ্ধাশীল উত্তর পাওয়ার অধিকার।',
                    'order' => 5,
                    'is_active' => true,
                ],
                [
                    'text_en' => 'Know the names, roles, and qualifications of the dentists, hygienists, assistants, and other team members involved in your care.',
                    'text_bn' => 'আপনার চিকিৎসায় নিয়োজিত ডেন্টিস্ট, হাইজিনিস্ট, সহকারী ও অন্যান্য কর্মীদের নাম, পদবী এবং যোগ্যতা জানার অধিকার।',
                    'order' => 6,
                    'is_active' => true,
                ],
                [
                    'text_en' => 'Receive prompt emergency dental care when needed (subject to our office hours and capabilities; after-hours emergency guidance will be provided).',
                    'text_bn' => 'জরুরি প্রয়োজনে তাৎক্ষণিক জরুরি ডেন্টাল কেয়ার পাওয়ার অধিকার (ক্লিনিকের সময়সূচী ও সক্ষমতা অনুযায়ী; ক্লিনিক বন্ধ থাকাকালীন জরুরি পরামর্শ প্রদান করা হবে)।',
                    'order' => 7,
                    'is_active' => true,
                ],
                [
                    'text_en' => 'Expect reasonable continuity of care — including appropriate referrals when specialized treatment is required.',
                    'text_bn' => 'চিকিৎসার ধারাবাহিকতা বজায় রাখা এবং বিশেষায়িত চিকিৎসার প্রয়োজন হলে উপযুক্ত বিশেষজ্ঞের কাছে রেফারেল পাওয়ার অধিকার।',
                    'order' => 8,
                    'is_active' => true,
                ],
                [
                    'text_en' => 'Review and receive an explanation of your treatment plan, fees, payment options, and an itemized bill — regardless of your insurance or payment source.',
                    'text_bn' => 'চিকিৎসা পরিকল্পনা, খরচ, পেমেন্টের সুযোগ এবং বিস্তারিত বিলের ব্যাখ্যা পাওয়ার অধিকার।',
                    'order' => 9,
                    'is_active' => true,
                ],
                [
                    'text_en' => 'Request a full or partial refund of a paid bill in instances where services were not rendered, or where clinical outcomes do not meet professional standards as determined by a clinical review.',
                    'text_bn' => 'সেবা প্রদান না করা হলে বা ক্লিনিকাল পর্যালোচনায় চিকিৎসার মান পেশাগত মানদণ্ড পূরণ না করলে প্রদত্ত বিলের সম্পূর্ণ বা আংশিক ফেরতের অনুরোধ করার অধিকার।',
                    'order' => 10,
                    'is_active' => true,
                ],
                [
                    'text_en' => 'Examine your dental records and receive copies of your records and radiographs (X-rays) upon request (reasonable copying fees may apply).',
                    'text_bn' => 'আপনার ডেন্টাল রেকর্ড পর্যালোচনা করার এবং অনুরোধ সাপেক্ষে এক্স-রে ও রেকর্ডের কপি গ্রহণ করার অধিকার।',
                    'order' => 11,
                    'is_active' => true,
                ],
                [
                    'text_en' => 'Privacy and confidentiality of all communications and records related to your care, in accordance with applicable privacy laws.',
                    'text_bn' => 'আপনার চিকিৎসা সংক্রান্ত সমস্ত যোগাযোগ এবং রেকর্ডের গোপনীয়তা ও সুরক্ষার নিশ্চয়তা পাওয়ার অধিকার।',
                    'order' => 12,
                    'is_active' => true,
                ],
                [
                    'text_en' => 'Express any concerns or complaints about your care or service without fear of reprisal, and to receive a timely response and resolution from our practice.',
                    'text_bn' => 'সেবা বা চিকিৎসার বিষয়ে যেকোনো অভিযোগ বা মতামত নির্ভয়ে প্রকাশ করার এবং দ্রুত প্রতিকার পাওয়ার অধিকার।',
                    'order' => 13,
                    'is_active' => true,
                ],
                [
                    'text_en' => 'Refuse treatment or any part of proposed care (understanding that refusal may affect your oral health outcomes), and to be informed of the consequences of such refusal.',
                    'text_bn' => 'যেকোনো প্রস্তাবিত চিকিৎসা প্রত্যাখ্যান করার এবং তার সম্ভাব্য পরিণতি সম্পর্কে অবহিত হওয়ার অধিকার।',
                    'order' => 14,
                    'is_active' => true,
                ],
            ];

            foreach ($rights as $r) {
                PatientRight::create($r);
            }
        }

        // 3. Responsibilities
        if (PatientResponsibility::count() === 0) {
            $responsibilities = [
                [
                    'title_en' => 'Provide accurate info',
                    'title_bn' => 'সঠিক তথ্য প্রদান করুন',
                    'text_en' => 'Give complete and honest information about your health history, medications, allergies, and current symptoms.',
                    'text_bn' => 'আপনার পূর্বের স্বাস্থ্য ইতিহাস, চলমান ওষুধ, অ্যালার্জি এবং বর্তমান উপসর্গ সম্পর্কে সম্পূর্ণ ও সত্য তথ্য প্রদান করুন।',
                    'order' => 1,
                    'is_active' => true,
                ],
                [
                    'title_en' => 'Respect our schedule',
                    'title_bn' => 'সময়সূচীর প্রতি শ্রদ্ধাশীল থাকুন',
                    'text_en' => 'Keep scheduled appointments and provide reasonable notice (at least 24–48 hours) if you need to cancel or reschedule.',
                    'text_bn' => 'নির্ধারিত অ্যাপয়েন্টমেন্ট মেনে চলুন এবং বাতিল বা পরিবর্তনের প্রয়োজন হলে কমপক্ষে ২৪-৪৮ ঘণ্টা আগে অবহিত করুন।',
                    'order' => 2,
                    'is_active' => true,
                ],
                [
                    'title_en' => 'Follow the plan',
                    'title_bn' => 'চিকিৎসা নির্দেশনা মেনে চলুন',
                    'text_en' => 'Adhere to the recommended treatment plan and home care instructions to the best of your ability.',
                    'text_bn' => 'ডেন্টিস্টের পরামর্শকৃত চিকিৎসা পরিকল্পনা এবং বাসায় যত্ন নেওয়ার নির্দেশিকা যথাযথভাবে মেনে চলুন।',
                    'order' => 3,
                    'is_active' => true,
                ],
                [
                    'title_en' => 'Financial accountability',
                    'title_bn' => 'আর্থিক দায়িত্বশীলতা',
                    'text_en' => 'Accept financial responsibility for the services provided, including payment of copays, deductibles, or full fees as agreed upon.',
                    'text_bn' => 'গৃহীত সেবাসমূহের জন্য নির্ধারিত ফি বা বিল সময়মতো পরিশোধের দায়িত্ব গ্রহণ করুন।',
                    'order' => 4,
                    'is_active' => true,
                ],
                [
                    'title_en' => 'Mutual respect',
                    'title_bn' => 'পারস্পরিক শ্রদ্ধা',
                    'text_en' => 'Treat our staff and other patients with courtesy and respect.',
                    'text_bn' => 'আমাদের চিকিৎসক, কর্মী এবং অন্যান্য রোগীদের সাথে ভদ্র ও সম্মানজনক আচরণ করুন।',
                    'order' => 5,
                    'is_active' => true,
                ],
                [
                    'title_en' => 'Communicate',
                    'title_bn' => 'যোগাযোগ বজায় রাখুন',
                    'text_en' => 'Speak openly if you have any concerns, questions, or changes in your health status.',
                    'text_bn' => 'স্বাস্থ্যের যেকোনো পরিবর্তন, প্রশ্ন বা উদ্বেগের বিষয়ে খোলামেলা আলোচনা করুন।',
                    'order' => 6,
                    'is_active' => true,
                ],
            ];

            foreach ($responsibilities as $res) {
                PatientResponsibility::create($res);
            }
        }
    }
}

