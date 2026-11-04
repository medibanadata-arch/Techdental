<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AiChatSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Default Settings if empty
        if (DB::table('ai_chat_settings')->count() === 0) {
            DB::table('ai_chat_settings')->insert([
                'gemini_api_key' => env('GEMINI_API_KEY', null),
                'gemini_model' => 'gemini-1.5-flash',
                'gemini_enabled' => false,
                'system_prompt' => "You are Tech Dental's smart, warm, and helpful AI assistant for patients in Dhaka, Bangladesh. Answer patient inquiries politely and concisely in clear Bengali (or English if asked). Help with dental problems, root canals, scaling, implants, braces, branch directions, and bookings. Always encourage visiting Tech Dental branches for direct clinical diagnosis. Hotline: 01400786162.",
                'chips' => json_encode([
                    "শাখার ঠিকানা কোথায়?",
                    "ফাঁকা দাঁতের চিকিৎসা",
                    "দাঁত ব্যথার চিকিৎসা",
                    "ডেন্টাল ইমপ্ল্যান্ট ও খরচ"
                ], JSON_UNESCAPED_UNICODE),
                'fallback_reply' => "টেক ডেন্টালের দক্ষ স্পেশালিস্ট সার্জন ও কনসালট্যান্টগণ আপনাকে নির্ভুল সেবা প্রদান করবেন। খরচ, ভিজিটিং সময় বা নির্দিষ্ট চিকিৎসার বিস্তারিত জানতে আমাদের হটলাইনে সরাসরি কথা বলুন অথবা অনলাইনে অ্যাপয়েন্টমেন্ট নিশ্চিত করুন।",
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 2. Seed Default Keyword Rules
        if (DB::table('ai_chat_replies')->count() === 0) {
            $rules = [
                [
                    'title' => 'শাখার ঠিকানা ও সময়সূচী',
                    'keywords' => 'ঠিকানা, শাখা, location, address, কোথায়, branch, মিরপুর, উত্তরা, বাড্ডা, যাত্রাবাড়ী, সময়, timing, hours',
                    'reply' => "ঢাকা শহরে টেক ডেন্টালের ৪টি প্রধান শাখা রয়েছে:\n\n• মিরপুর শাখা: ৮২৭ (২য় তলা), শেওড়াপাড়া, বেগম রোকেয়া সরণি (মেট্রোরেল ৩১৮ নং পিলারের পূর্ব পাশে)\n• উত্তরা শাখা: হাউস ১৮, রোড ১৪, সেক্টর ৩, উত্তরা\n• বাড্ডা শাখা: হাজী আব্দুর রশিদ ম্যানশন (৩য় তলা), উত্তর বাড্ডা বাজার\n• যাত্রাবাড়ী শাখা: শহীদ ফারুক রোড, দক্ষিণ যাত্রাবাড়ী\n\nপ্রতিটি শাখা প্রতিদিন সকাল ১০:০০ টা থেকে রাত ৯:০০ টা পর্যন্ত খোলা থাকে (শুক্রবার বন্ধ)।",
                    'icon' => 'fa-location-dot',
                    'icon_color' => 'text-blue-600',
                    'icon_bg' => 'bg-blue-100',
                    'action_type' => 'directions',
                    'action_label' => 'গুগল ম্যাপে দেখুন',
                    'action_url' => '/branches',
                    'is_active' => true,
                    'priority' => 10,
                    'match_count' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'title' => 'ফাঁকা দাঁতের আধুনিক চিকিৎসা',
                    'keywords' => 'ফাঁকা, gap, ব্রেসেস, braces, aligner, ক্লিপ, আঁকাবাঁকা, সোজা',
                    'reply' => "টেক ডেন্টালে ফাঁকা দাঁতের (Gap Teeth) জন্য স্থায়ী ও কসমেটিক চিকিৎসা রয়েছে:\n\n১. কম্পোজিট বন্ডিং / ভিনিয়ার্স: মাত্র ১ দিনেই দাঁত না কেটে ফাঁকা পূরণ।\n২. অর্থোডন্টিক ব্রেসেস (Braces): মেটাল ও সিরামিক ব্রেসেস দিয়ে ন্যাচারাল দাঁত সোজা করা।\n৩. ইনভিজিবল অ্যালাইনার্স (Clear Aligners): কোনো তার ছাড়া অদৃশ্য ক্লিপ পদ্ধতি।\n\nবিশেষজ্ঞ ডাক্তারের পরামর্শ নিতে আজই সিরিয়াল বুক করতে পারেন।",
                    'icon' => 'fa-tooth',
                    'icon_color' => 'text-blue-600',
                    'icon_bg' => 'bg-blue-100',
                    'action_type' => 'appointment',
                    'action_label' => 'সিরিয়াল বুক করুন',
                    'action_url' => '/appointment',
                    'is_active' => true,
                    'priority' => 9,
                    'match_count' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'title' => 'দাঁত ব্যথার ব্যথামুক্ত চিকিৎসা',
                    'keywords' => 'ব্যথা, পেইন, রুট ক্যানেল, rct, pain, শিরশির, ইনফেকশন',
                    'reply' => "দাঁতে তীব্র ব্যথা, শিরশির করা বা ইনফেকশনের জন্য টেক ডেন্টালে রয়েছে:\n\n• সিঙ্গেল সিটিং রোটারি রুট ক্যানেল (RCT) – অত্যাধুনিক রোটারি সিস্টেমে মাত্র এক ভিজিটেই ব্যথামুক্ত চিকিৎসা।\n• ইমার্জেন্সি পেইন রিলিফ ড্রেসিং।\n• জার্মানির ক্লাস-বি অটোক্লেভে জীবাণুমুক্ত পরিবেশে নিরাপদ চিকিৎসা।",
                    'icon' => 'fa-notes-medical',
                    'icon_color' => 'text-rose-600',
                    'icon_bg' => 'bg-rose-100',
                    'action_type' => 'appointment',
                    'action_label' => 'জরুরি সিরিয়াল নিন',
                    'action_url' => '/appointment',
                    'is_active' => true,
                    'priority' => 8,
                    'match_count' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'title' => 'দাঁত পরিষ্কার ও স্কেলিং',
                    'keywords' => 'স্কেলিং, scaling, ওয়াশ, পরিষ্কার, হলদে, whitening, পাথর, দুর্গন্ধ',
                    'reply' => "আল্ট্রাসনিক স্কেলারের সাহায্যে দাঁতের এনামেলের কোনো ক্ষতি না করে মাত্র ৩০ মিনিটে পাথর, দাগ ও দুর্গন্ধ দূর করা হয়। প্রতি ৬ মাসে অন্তত একবার স্কেলিং করা দাঁত ও মাড়ির সুস্বাস্থ্যের জন্য জরুরি।",
                    'icon' => 'fa-sparkles',
                    'icon_color' => 'text-emerald-600',
                    'icon_bg' => 'bg-emerald-100',
                    'action_type' => 'appointment',
                    'action_label' => 'স্কেলিং সিরিয়াল নিন',
                    'action_url' => '/appointment',
                    'is_active' => true,
                    'priority' => 7,
                    'match_count' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'title' => 'ডেন্টাল ইমপ্ল্যান্ট ও ব্রিজ',
                    'keywords' => 'ইমপ্ল্যান্ট, implant, বাঁধানো, bridge, ব্রিজ, ক্যাপ, crown, ফাইবার',
                    'reply' => "স্থায়ীভাবে দাঁত প্রতিস্থাপনের জন্য টেক ডেন্টালে রয়েছে বিশ্বমানের টাইটানিয়াম ডেন্টাল ইমপ্ল্যান্ট এবং এক ভিজিটেই ফাইবার রিইনফোর্সড ব্রিজ (FRB), যাতে পাশের কোনো ভালো দাঁত কাটার প্রয়োজন হয় না।",
                    'icon' => 'fa-tooth',
                    'icon_color' => 'text-indigo-600',
                    'icon_bg' => 'bg-indigo-100',
                    'action_type' => 'appointment',
                    'action_label' => 'ইমপ্ল্যান্ট সিরিয়াল',
                    'action_url' => '/appointment',
                    'is_active' => true,
                    'priority' => 6,
                    'match_count' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            ];

            DB::table('ai_chat_replies')->insert($rules);
        }
    }
}

