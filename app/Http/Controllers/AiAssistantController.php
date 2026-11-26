<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AiAssistantController extends Controller
{
    const DEFAULT_TRAINING_DATA = "১. রোল ও আচরণের নিয়ম (System Prompt)\nতুমি টেক ডেন্টাল (Tech Dental)-এর কাস্টমার কেয়ার প্রতিনিধি তানিয়া। তোমার কাজ হলো নিচে প্রদত্ত নলেজ বেইজের ভেতর থেকে রোগীদের প্রশ্নের উত্তর দেওয়া। প্রদত্ত তথ্যের বাইরে কোনো তথ্য বানিয়ে বা অনুমান করে উত্তর দেবে না। দাঁতের চিকিৎসা এবং টেক ডেন্টালের বাইরে কোনো প্রশ্ন করলে উত্তর না দিয়ে বিনয়ভাবে জানিয়ে দেবে।\n\nআচরণ ও কথাবার্তার নিয়ম:\nভাষার নিয়ম: রোগী বাংলায় বা বাংলিশে (যেমন: ami, koto, ki, hi, hello ইত্যাদি) প্রশ্ন করলে সবসময় বাংলায় উত্তর দেবে। রোগী ইংরেজিতে প্রশ্ন করলে ইংরেজিতে উত্তর দেবে (নলেজ বেইজের তথ্য ও রেট অপরিবর্তিত রেখে)।\nসংক্ষিপ্ততা: সাধারণ উত্তর ৪০-৫০ শব্দ বা তার কম রাখবে। তবে ঠিকানা, ম্যাপ লিংক বা একাধিক বিকল্প বোঝাতে হলে প্রয়োজনে ৬০-৭০ শব্দ পর্যন্ত যেতে পারো। শব্দসীমার কারণে কোনো গুরুত্বপূর্ণ তথ্য (যেমন—ওয়ারেন্টি, সময়কাল বা বিকল্প) বাদ পড়লে উত্তর শেষে সংক্ষেপে জানতে চাইবে—\"এ বিষয়ে আরও বিস্তারিত তথ্য জানতে চান?\" (ইংরেজিতে হলে সমার্থকভাবে)। রোগী চাইলে তখন সেগুলো দেবে।\nটোন ও ইমোজি: একজন আন্তরিক, সহানুভূতিশীল ও পেশাদার মানুষ প্রতিনিধির মতো কথা বলবে এবং মানানসই ইমোজি ব্যবহার করবে (যেমন: 😊, 🦷, ✨, 📍, 📞)।\nপ্রশ্ন করে নিশ্চিত করা: যেসব সমস্যার একাধিক সমাধান বা ভিন্ন খরচ আছে, সেগুলোতে সরাসরি উত্তর না দিয়ে একবারে অনেকগুলো প্রশ্ন না করে ১ বা ২টি করে প্রশ্ন করে রোগীর বর্তমান অবস্থা (ব্যথা আছে কি না, কোন দাঁত, বয়স/ধরন কী ইত্যাদি) জেনে নেবে।\nঅস্পষ্ট প্রশ্ন: প্রশ্ন বুঝতে না পারলে বা অসম্পূর্ণ হলে বিনয়ের সাথে স্পষ্ট প্রশ্ন করে জেনে নেবে।\nফলো-আপ: রোগীকে আন্তরিকভাবে বুঝিয়ে প্রাসঙ্গিক ফলো-আপ প্রশ্ন করবে (যেমন: কোন শাখায় যেতে চান বা আরও কিছু জানার আছে কি না)।\nতথ্যের বাইরে প্রশ্ন: দাঁতের চিকিৎসা ও টেক ডেন্টালের বাইরে কোনো প্রশ্ন এলে বা নলেজ বেইজে না থাকা কোনো প্রশ্ন এলে উত্তর না দিয়ে বিনয়ের সাথে জানিয়ে দেবে এবং প্রয়োজনে 09638-000505 হেল্পলাইনে কল করতে বলবে।\nঅভিযোগ: চিকিৎসা গ্রহণের পর কোনো অভিযোগ করলে আন্তরিকভাবে দুঃখ প্রকাশ করবে, সমাধানে সর্বোচ্চ চেষ্টার আশ্বাস দেবে এবং 09638-000505 হেল্পলাইনে (সকাল ৯টা – রাত ১০টা) কল করে অভিযোগ জানাতে বলবে।\nযোগাযোগের তথ্য:\nহেল্পলাইন: 09638-000505 (খোলা: সকাল ৯টা – রাত ১০টা)\nWhatsApp: 01400-786162\n২. নলেজ বেইজ (Knowledge Base)\nক. শুভেচ্ছা বার্তা\nরোগী সালাম (সালাম, আসসালামু আলাইকুম, salam, aoa, assalamu alaikum) দিলে আন্তরিকভাবে সালামের উত্তর দেবে; আর hi, hello, হাই, হ্যালো বা অন্য কোনো শুভেচ্ছা জানালে বন্ধুত্বপূর্ণ শুভেচ্ছা জানাবে।\nশুভেচ্ছার উত্তরের পর রোগী কোনো প্রশ্ন না করলে বা শুধু শুভেচ্ছা বিনিময় হলে বলবে—\"জী, বলুন কীভাবে সাহায্য করতে পারি?\" (ইংরেজিতে হলে বন্ধুত্বপূর্ণভাবে কীভাবে সাহায্য করতে পারে তা জানতে চাইবে)।\nশুভেচ্ছার সাথেই কোনো প্রশ্ন বা সমস্যা উল্লেখ করলে সংক্ষেপে শুভেচ্ছা জানিয়ে সরাসরি সেই প্রশ্নের উত্তরে চলে যাবে।\nখ. শাখার ঠিকানা ও সময়সূচি\nশুক্রবার টেক ডেন্টালের সকল শাখা বন্ধ থাকে।\nসাধারণভাবে ঠিকানা চাইলে: \"ঢাকায় আমাদের চারটি শাখা রয়েছে—মিরপুর, উত্তরা, বাড্ডা এবং যাত্রাবাড়ী। আপনি আমাদের কোন শাখার ঠিকানা সম্পর্কে জানতে চাচ্ছেন?\"\nনির্দিষ্ট শাখা চাইলে: সেই শাখার ঠিকানা, গুগল ম্যাপ লিংক ও রোগী দেখার সময় দেবে।\nকাছের শাখা জানতে চাইলে: রোগীর দেওয়া এলাকার ভিত্তিতে নিকটস্থ শাখা সাজেস্ট করবে। ঢাকার বাইরের রোগী হলে সাধারণভাবে মিরপুর শাখা সাজেস্ট করবে যেহেতু মিরপুর প্রধান শাখা (তবে অন্য শাখা জানতে চাইলে সেটির ঠিকানা দেবে)।\nমিরপুর শাখা (প্রধান শাখা): ৮২৭ (২য় তলা), বেগম রোকেয়া সরণী, শেওড়াপাড়া, মিরপুর, ঢাকা-১২১৬ | Maps: https://maps.app.goo.gl/nxbZ653U52XUZLyw6 | সময়: সকাল ১০টা – রাত ৯টা।\nউত্তরা শাখা: আকাশ প্লাজা (২য় তলা), প্লট-২১, রোড-৭/ডি, সেক্টর-০৯, উত্তরা, ঢাকা-১২৩০ | Maps: https://g.co/kgs/6RSvYuz | সময়: বিকেল ৪:০০টা – রাত ৯:০০টা।\nবাড্ডা শাখা: হাজী আঃ রশিদ ম্যানশন (৩য় তলা), উত্তর বাড্ডা বাজার, বাড্ডা, ঢাকা-১২১২ (কৃষি ব্যাংকের ৩য় তলা) | Maps: https://goo.gl/maps/7uNFHsM2i77fwBmi8 | সময়: বিকেল ৩:০০টা – রাত ১০:০০টা।\nযাত্রাবাড়ী শাখা: বাসা নং-৩১/সি (৩য় তলা), শহীদ ফারুক সড়ক, যাত্রাবাড়ী, ঢাকা-১২০৪ | Maps: https://maps.app.goo.gl/PhfRfeDFC2q5Aqk39 | সময়: বিকেল ৩:০০টা – রাত ১০:০০টা।\nগ. ফাঁকা দাঁতের চিকিৎসা\nপ্রাথমিকভাবে কম্পোজিট ভিনিয়ার সাজেস্ট করা যায়। এটি সাধারণত ৫-৭ বছর স্থায়ী হয় এবং এক দিনেই কয়েক ঘণ্টায় করা যায়।\nখরচ বা চিকিৎসা জানতে চাইলে জানাবে: প্রতি দাঁত ৫,০০০ টাকা। দাঁতের ফাঁকার আলোকে খরচের ধারণা পেতে ভিনিয়ার চার্ট/ছবি দেখতে বলবে। টেক ডেন্টাল ভিনিয়ারে ২ বছরে ২টি ফ্রি ওয়ারেন্টি দেয়।\nবিকল্প হিসেবে অর্থোডন্টিক (ব্রেসেস) সাজেস্ট করা যায়। ফাঁকা দাঁতের চিকিৎসায় রোগী ব্রেসেস করতে চাইলে ব্রেসেসের নির্ধারিত খরচই বলবে। তবে রোগীর জন্য কোনটি উপযোগী, তা চিকিৎসক রোগী দেখে নির্ধারণ করবেন।\nঘ. দাঁত লাগানো\nদাঁত লাগানো বা খরচের বিষয়ে জানতে চাইলে সরাসরি উত্তর না দিয়ে ১-২টি করে প্রশ্ন করে দাঁতের বর্তমান অবস্থা জেনে নেবে (যেমন—কয়টি দাঁত লাগাতে চান, কোথায়/কোন দাঁত, পাশে ভালো দাঁত আছে কি না বা ডেনচার/ইমপ্লান্টের কথা বলছেন কি না)।\nএকটি দাঁত মিসিং ও পাশে দুটি ভালো দাঁত থাকলে:\nপ্রথমে সাশ্রয়ী ও দ্রুত সমাধান হিসেবে ফাইবার ব্রিজ সাজেস্ট করবে (দাঁত কাটার প্রয়োজন হয় না, একদিনেই হয়, আনুমানিক ১০ বছর স্থায়ী, ১ বছরে ২বার ফ্রি ওয়ারেন্টি)। এরপর বিনয়ের সাথে জিজ্ঞেস করবে—\"আপনি কি আরও প্রিমিয়াম বা স্থায়ী কোনো অপশন সম্পর্কেও জানতে চাচ্ছেন?\"\nরোগী যদি ইতিবাচক সাড়া দেয়, বাজেট ভালো হয় বা আরও উন্নত/স্থায়ী সমাধান সম্পর্কে জানতে চায়, তখন প্রিমিয়াম অপশন হিসেবে জিরকোনিয়া মেরিল্যান্ড ব্রিজ (৪০,০০০ টাকা/দাঁত) এবং ডেন্টাল ইমপ্লান্ট (আনুমানিক ৮০,০০০ টাকা, চিকিৎসক দাঁতের অবস্থান দেখে কম-বেশি নির্ধারণ করবেন) সম্পর্কে জানাবে।\nএকাধিক দাঁত মিসিং থাকলে: ক্যাপ ব্রিজ বা রিমোভেবল/ফ্লেক্সিবল ডেনচার। ক্যাপ ব্রিজের খরচ দাঁতের অবস্থা দেখে চিকিৎসক নির্ধারণ করবেন (চেম্বারে আসতে হবে)।\nট্রেডিশনাল রিমোভেবল ডেনচার: ৫,০০০ টাকা/দাঁত।\nফ্লেক্সিবল ডেনচার: ১০,০০০ টাকা/দাঁত (৪ ইউনিটের বেশি হলে ৮,০০০ টাকা/দাঁত)।\nপুরো মুখের দাঁত না থাকলে বা ১-২টি থাকলে: কমপ্লিট ডেনচার — প্রতি পাটি ২৫,০০০ টাকা, দুই পাটি ৫০,০০০ টাকা।\nডেন্টাল ইমপ্লান্ট: স্বেচ্ছায় চাইলে আনুমানিক ৮০,০০০ টাকা (চিকিৎসক দাঁতের অবস্থান দেখে কম-বেশি নির্ধারণ করতে পারেন)।\nঙ. ভাঙা ও ক্ষয় দাঁত\nচিকিৎসা বা খরচের আগে ১-২টি করে প্রশ্ন করে দাঁতের বর্তমান অবস্থা, রঙ বদলেছে কি না এবং ব্যথা আছে কি না—তা জেনে নেবে।\nসামান্য ভাঙা/ক্ষয়, রঙ পরিবর্তন না হলে এবং ব্যথা না থাকলে: একদিনেই কম্পোজিট ভিনিয়ার — ৫,০০০ টাকা/দাঁত।\nব্যথা বা জটিল সমস্যা থাকলে: চিকিৎসক X-ray / RVG পরীক্ষার পর রুট ক্যানেল, ক্যাপ বা প্রয়োজনীয় চিকিৎসা নির্ধারণ করবেন।\nচ. দাঁতে গর্ত (ও সামনের দাঁতের দাগ/গর্তের পার্থক্য)\nরোগীর সমস্যা ও ব্যথা আছে কি না ১-২টি করে প্রশ্ন করে জেনে নেবে।\nরোগী যদি সামনের দাঁতে দাগ বা গর্ত/ক্ষয়ের কথা বলে, তবে বিভ্রান্ত না হয়ে আগে নিশ্চিত করবে—এটা কি শুধু রঙের দাগ/হোয়াইটেনিংয়ের বিষয়, নাকি গর্ত/ক্ষয় বা ব্যথা আছে?\nসামনের দাঁতের ক্যারিজ/ক্ষয়ে সৌন্দর্যের দিক বিবেচনায় কম্পোজিট ভিনিয়ার (৫,০০০ টাকা/দাঁত) সাজেস্ট করবে। শুধু রঙের দাগ হলে টুথ হোয়াইটেনিং-এর কথা বলবে।\nমাড়ির দাঁতে গর্ত হলে কম্পোজিট ফিলিং সবচেয়ে উপযোগী।\nছোট গর্ত বা ব্যথা না থাকলে: কম্পোজিট ফিলিং — সাধারণভাবে খরচ জানতে চাইলে বলবে ১,৫০০ টাকা থেকে শুরু। রোগী যদি আরও ভালো অপশন বা খরচের বিস্তারিত রেঞ্জ জানতে চায়, তখন বলবে উন্নত মানের কম্পোজিট ফিলিং ৩,০০০ – ৫,০০০ টাকা।\nগর্ত বড় ও ব্যথা থাকলে সাধারণত রুট ক্যানেল ও ক্যাপ প্রয়োজন হয়।\nগুরুত্বপূর্ণ: গর্তের কথা বললে নিজ থেকে দাঁত তোলার কথা বলবে না (রোগী ভয় পেতে পারেন)। রোগী নিজে দাঁত তোলার কথা জিজ্ঞেস করলে তবেই নম্রভাবে বলবে যে খুব বেশি ক্ষতিগ্রস্ত হলে কখনো কখনো তুলতে হতে পারে, তবে চিকিৎসকরা দাঁত বাঁচানোর সর্বোচ্চ চেষ্টা করেন।\nছ. অন্যান্য গুরুত্বপূর্ণ চিকিৎসা ও খরচ\nডাক্তার পরামর্শ ফি: ৫০০ টাকা।\nরুট ক্যানেল: ৮,০০০ টাকা | রি-রুট ক্যানেল: ১২,০০০ টাকা | আক্কেল দাঁতের রুট ক্যানেল: ১০,০০০ টাকা।\nদাঁতের ক্যাপ: সাধারণভাবে জানতে চাইলে ৮,০০০ টাকা বলবে (PFM নাম আগে বলবে না; জানতে চাইলে বলবে)। দামের রেঞ্জ জানতে চাইলে ৮,০০০ – ৩০,০০০ টাকা বলবে। জিরকোনিয়া ক্যাপ: ২০,০০০ টাকা (জিজ্ঞেস করলে বলবে)। ই-ম্যাক্স (E-max) ক্যাপ: ৩০,০০০ টাকা (জিজ্ঞেস করলে বা রেঞ্জের বিস্তারিত চাইলে বলবে)।\nকম্পোজিট ফিলিং: সাধারণভাবে খরচ জানতে চাইলে ১,৫০০ টাকা থেকে শুরু বলবে; আরও ভালো অপশন বা খরচের বিস্তারিত রেঞ্জ জানতে চাইলে উন্নত মানের কম্পোজিট ফিলিং ৩,০০০ – ৫,০০০ টাকা বলবে। সামনের দাঁতের ক্যারিজের চিকিৎসায় সৌন্দর্যের দিক বিবেচনায় ভিনিয়ার সাজেস্ট করবে, মাড়ির দাঁতে কম্পোজিট ফিলিং উপযোগী।\nঅর্থোডন্টিক ব্রেসেস (আঁকাবাঁকা/উঁচু-নিচু/ফাঁকা দাঁত): শুরু ২৫,০০০ টাকা ডাউন পেমেন্ট দিয়ে, মাসিক ৬,০০০ টাকা। সময় সাধারণত ১ বছর থেকে ১৮ মাস। চিকিৎসক: ডাঃ আশরাফুল হাশেম জনি (BMU থেকে MS ডিগ্রি ও ৭+ বছরের অভিজ্ঞতা)।\nস্কেলিং ও পলিশিং: ২,০০০ – ৩,৫০০ টাকা (পাথর, পান/সিগারেটের দাগ বা মাড়ি থেকে রক্ত পড়া বেশি হলে সর্বোচ্চ ৩,৫০০ টাকা; অতিরিক্ত চিকিৎসা যেমন গাম থেরাপি লাগলে খরচ ভিন্ন)।\nটুথ হোয়াইটেনিং: কেমিক্যাল/লেজার ১৫,০০০ টাকা; কম্পোজিট হোয়াইটেনিং ৪,০০০ টাকা/দাঁত।\nদাঁত তোলা (শুধুমাত্র দাঁত তোলার প্রসঙ্গ এলে): আগে দাঁতের ধরন/বয়স ১-২টি প্রশ্নে জেনে নেবে, একবারে সব রেট দেবে না।\nবাচ্চার দাঁত তোলা: ১,৫০০ টাকা\nবড়দের সাধারণ দাঁত তোলা: ২,০০০ – ৫,০০০ টাকা\nসাধারণ আক্কেল দাঁত তোলা: ৮,০০০ – ১২,০০০ টাকা\nজটিল আক্কেল দাঁত তোলা: ১০,০০০ – ১৫,০০০ টাকা\nজ. ডিসকাউন্ট প্রসঙ্গ\nডিসকাউন্ট চাইলে বুঝাবে যে টেক ডেন্টালে উন্নত ম্যাটেরিয়াল, আধুনিক জীবাণুমুক্তকরণ প্রযুক্তি, অভিজ্ঞ চিকিৎসক এবং আফটার ট্রিটমেন্ট সেবা দেওয়া হয়—তাই ডিসকাউন্টের চেয়ে চিকিৎসার মান ও নিরাপত্তাকে অগ্রাধিকার দেওয়া হয়।";
    /**
     * Admin Dashboard view for AI Assistant
     */
    public function adminIndex()
    {
        $settings = DB::table('ai_chat_settings')->first();
        if (!$settings) {
            DB::table('ai_chat_settings')->insert([
                'gemini_api_key' => env('GEMINI_API_KEY', null),
                'gemini_model' => 'gemini-1.5-flash',
                'gemini_enabled' => false,
                'system_prompt' => '',
                'chips' => json_encode(["শাখার ঠিকানা কোথায়?", "ফাঁকা দাঁতের চিকিৎসা", "দাঁত ব্যথার চিকিৎসা"], JSON_UNESCAPED_UNICODE),
                'fallback_reply' => "টেক ডেন্টালের দক্ষ স্পেশালিস্ট সার্জন ও কনসালট্যান্টগণ আপনাকে নির্ভুল সেবা প্রদান করবেন। বিস্তারিত জানতে আমাদের হটলাইনে (09638-000505) সরাসরি কথা বলুন অথবা অনলাইনে অ্যাপয়েন্টমেন্ট নিন।",
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $settings = DB::table('ai_chat_settings')->first();
        }

        $rules = DB::table('ai_chat_replies')
            ->orderBy('priority', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        $logs = DB::table('ai_chat_logs')
            ->orderBy('id', 'desc')
            ->limit(50)
            ->get();

        return Inertia::render('AiAssistant/AdminIndex', [
            'settings' => $settings,
            'rules' => $rules,
            'logs' => $logs,
        ]);
    }

    /**
     * Update Gemini API & Chat settings
     */
    public function updateSettings(Request $request)
    {
        $request->validate([
            'gemini_model' => 'nullable|string',
            'system_prompt' => 'nullable|string',
            'training_data' => 'nullable|string',
            'fallback_reply' => 'nullable|string',
            'bot_name' => 'nullable|string|max:100',
            'bot_avatar' => 'nullable',
        ]);

        $updateData = [
            'updated_at' => now(),
        ];

        if ($request->has('gemini_api_key')) {
            $updateData['gemini_api_key'] = $request->input('gemini_api_key');
        }
        if ($request->has('gemini_model')) {
            $updateData['gemini_model'] = $request->input('gemini_model', 'gemini-1.5-flash');
        }
        if ($request->has('gemini_enabled')) {
            $updateData['gemini_enabled'] = (bool)$request->input('gemini_enabled', false);
        }
        if ($request->has('system_prompt')) {
            $updateData['system_prompt'] = $request->input('system_prompt');
        }
        if ($request->has('training_data')) {
            $updateData['training_data'] = $request->input('training_data');
        }
        if ($request->has('fallback_reply')) {
            $updateData['fallback_reply'] = $request->input('fallback_reply');
        }
        if ($request->has('bot_name')) {
            $updateData['bot_name'] = $request->input('bot_name') ?: 'Tech Dental Agent';
        }

        // Handle Avatar upload or string path
        if ($request->hasFile('bot_avatar')) {
            $file = $request->file('bot_avatar');
            $filename = time() . '_bot_avatar.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('uploads/images');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $file->move($destinationPath, $filename);
            $updateData['bot_avatar'] = '/uploads/images/' . $filename;
        } elseif ($request->has('bot_avatar') && is_string($request->input('bot_avatar'))) {
            $updateData['bot_avatar'] = $request->input('bot_avatar');
        }

        // Handle Starter questions (appearing sequentially before chat starts)
        if ($request->has('starter_questions')) {
            $starterQuestions = $this->normalizeStringList($request->input('starter_questions'));
            $updateData['starter_questions'] = json_encode($starterQuestions ?: [
                'ফিলিং চিকিৎসার খরচ কত?',
                'দাঁতে গর্ত হলে কি করা উচিৎ?',
                'রুট ক্যানেল করতে কত খরচ হয়?',
                'দাঁত সোজা করার উপায় কি?'
            ], JSON_UNESCAPED_UNICODE);
        }

        if ($request->has('chips')) {
            $chips = $this->normalizeStringList($request->input('chips'));
            $updateData['chips'] = json_encode($chips ?: ["শাখার ঠিকানা কোথায়?", "ফাঁকা দাঁতের চিকিৎসা", "দাঁত ব্যথার চিকিৎসা"], JSON_UNESCAPED_UNICODE);
        }

        DB::table('ai_chat_settings')->updateOrInsert(
            ['id' => 1],
            $updateData
        );

        return back()->with('success', 'AI Assistant সেটিংস ও ব্র্যান্ডিং সফলভাবে সংরক্ষিত হয়েছে।');
    }

    /**
     * Turn a submitted chips / starter-questions value into a clean list of labels.
     *
     * The admin form sends JSON, older forms sent comma/newline separated text, and
     * previously-saved rows may contain JSON fragments with stray quotes or brackets.
     */
    private function normalizeStringList(mixed $value): array
    {
        if (is_string($value)) {
            $value = trim($value);
            if (str_starts_with($value, '[')) {
                $decoded = json_decode($value, true);
                $value = is_array($decoded) ? $decoded : explode(',', $value);
            } else {
                $value = preg_split('/[\r\n,]+/', $value) ?: [];
            }
        }

        if (!is_array($value)) {
            return [];
        }

        $clean = [];
        foreach ($value as $item) {
            if (!is_scalar($item)) {
                continue;
            }
            $item = trim((string) $item);
            // Remove leftover JSON punctuation from previously corrupted rows.
            do {
                $previous = $item;
                $item = trim($item, " \t\n\r\0\x0B\"'");
                $item = trim($item, '[]');
                $item = trim($item);
            } while ($item !== $previous);
            if ($item !== '') {
                $clean[] = $item;
            }
        }

        return array_values(array_unique($clean));
    }

    /**
     * Add new Keyword Rule
     */
    public function storeRule(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'keywords' => 'required|string',
            'reply' => 'required|string',
            'icon' => 'nullable|string',
            'action_type' => 'nullable|string',
            'action_label' => 'nullable|string',
            'action_url' => 'nullable|string',
            'priority' => 'nullable|integer',
        ]);

        DB::table('ai_chat_replies')->insert([
            'title' => $validated['title'],
            'keywords' => $validated['keywords'],
            'reply' => $validated['reply'],
            'icon' => $validated['icon'] ?? 'fa-tooth',
            'icon_color' => $request->input('icon_color', 'text-blue-600'),
            'icon_bg' => $request->input('icon_bg', 'bg-blue-100'),
            'action_type' => $validated['action_type'] ?? 'none',
            'action_label' => $validated['action_label'] ?? null,
            'action_url' => $validated['action_url'] ?? null,
            'priority' => (int)($validated['priority'] ?? 0),
            'is_active' => true,
            'match_count' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'নতুন কিওয়ার্ড রুল সফলভাবে যুক্ত হয়েছে।');
    }

    /**
     * Update Keyword Rule
     */
    public function updateRule(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'keywords' => 'required|string',
            'reply' => 'required|string',
            'icon' => 'nullable|string',
            'action_type' => 'nullable|string',
            'action_label' => 'nullable|string',
            'action_url' => 'nullable|string',
            'priority' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        DB::table('ai_chat_replies')->where('id', $id)->update([
            'title' => $validated['title'],
            'keywords' => $validated['keywords'],
            'reply' => $validated['reply'],
            'icon' => $validated['icon'] ?? 'fa-tooth',
            'icon_color' => $request->input('icon_color', 'text-blue-600'),
            'icon_bg' => $request->input('icon_bg', 'bg-blue-100'),
            'action_type' => $validated['action_type'] ?? 'none',
            'action_label' => $validated['action_label'] ?? null,
            'action_url' => $validated['action_url'] ?? null,
            'priority' => (int)($validated['priority'] ?? 0),
            'is_active' => $request->has('is_active') ? (bool)$request->input('is_active') : true,
            'updated_at' => now(),
        ]);

        return back()->with('success', 'কিওয়ার্ড রুল আপডেট করা হয়েছে।');
    }

    /**
     * Delete Keyword Rule
     */
    public function deleteRule($id)
    {
        DB::table('ai_chat_replies')->where('id', $id)->delete();
        return back()->with('success', 'কিওয়ার্ড রুল মুছে ফেলা হয়েছে।');
    }

    /**
     * Toggle Rule Status
     */
    public function toggleRule($id)
    {
        $rule = DB::table('ai_chat_replies')->where('id', $id)->first();
        if ($rule) {
            DB::table('ai_chat_replies')->where('id', $id)->update([
                'is_active' => !$rule->is_active,
                'updated_at' => now(),
            ]);
        }
        return back();
    }

    /**
     * Public AI Chat Streaming API Endpoint (POST /api/ai-chat/stream)
     * Real-time streaming response using Google Gemini streamGenerateContent (SSE)
     */
    public function streamChatApi(Request $request)
    {
        $query = trim($request->input('query') ?: $request->input('message') ?: '');
        if (empty($query)) {
            return response()->json([
                'error' => 'অনুগ্রহ করে প্রশ্ন লিখুন।',
            ], 422);
        }

        $settings = DB::table('ai_chat_settings')->first();
        $apiKey = trim($settings->gemini_api_key ?? env('GEMINI_API_KEY', ''));

        return response()->stream(function () use ($request, $query, $settings, $apiKey) {
            // Disable output buffering for instant flushing
            while (ob_get_level() > 0) {
                @ob_end_flush();
            }

            $sendEvent = function ($payload) {
                echo "data: " . json_encode($payload, JSON_UNESCAPED_UNICODE) . "\n\n";
                if (ob_get_level() > 0) {
                    @ob_flush();
                }
                flush();
            };

            $isAskingWhatsapp = (bool)preg_match('/whatsapp|হোয়াটসঅ্যাপ|হোয়াটসএপ|হোয়াটসঅ্যাপ|watsapp|what\'s app/ui', $query);

            // 1. Google Gemini AI Streaming
            if ($settings && $settings->gemini_enabled && !empty($apiKey)) {
                $trainingData = !empty($settings->training_data) ? $settings->training_data : self::DEFAULT_TRAINING_DATA;

                $instructionText = "ROLE & INSTRUCTIONS FOR TECH DENTAL AI ASSISTANT:\n{$trainingData}\n\nSTRICT GUIDELINES:
1. Always answer the patient's questions using the above official company training data.
2. For treatment costs (e.g. scaling, root canal, dental caps, implants), quote the exact prices from the training data.
3. Mention our relevant branch locations (মিরপুর, উত্তরা, বাড্ডা, যাত্রাবাড়ী) and official hotline 09638-000505 when helpful.
4. STRICT WHATSAPP RULE: NEVER provide the WhatsApp number (01400-786162) in normal replies. Only provide WhatsApp if the patient specifically asks for WhatsApp or mobile number.
5. Keep the answer warm and concise, and reply in the patient's own language: Bangla or Banglish questions get a polite Bangla answer; English questions get an English answer (prices and facts stay exactly the same).
6. YOUTUBE VIDEOS: If the training data contains a YouTube video link (e.g. https://youtu.be/... or https://www.youtube.com/watch?v=...) related to the treatment, procedure, or topic the patient is inquiring about, include the full YouTube link on its own line so the patient can watch the video directly in the chat box.
7. CRITICAL: Output ONLY the final polite message to the patient. NEVER output internal thoughts, checklists, reasoning, or self-verifications (such as '(2-4 bullet points)? Yes' or 'Checked').
8. DOCTOR & SCHEDULE RULE: For any question about doctor names, duty times or branch schedules, use ONLY the information given in the training data above. NEVER guess or invent a doctor name, duty time or schedule. If a detail is not confirmed there, say it should be confirmed on hotline 09638-000505.
9. BOOKING RULE: If the patient wants an appointment or serial - including how-to questions such as 'সিরিয়াল কিভাবে নেব', 'serial nibo kivabe', 'serial nite chai' - there are exactly TWO options: (a) call the official hotline 09638-000505, or (b) fill the online booking form on the appointment page (the 'অনলাইন বুকিং' button shown with the reply). NEVER provide any booking format or fill-in-the-blank template. NEVER ask for or accept name, phone, branch, date, time, service or address in the chat. NEVER claim a booking is confirmed and NEVER say the patient's details have been 'noted', 'recorded' or 'saved in the system' - the chat cannot save bookings.";

                $candidateModels = array_values(array_unique(array_merge(
                    [$settings->gemini_model ?? 'gemini-3.1-flash-lite'],
                    $this->resolveGeminiModelCandidates($settings->gemini_model ?? 'gemini-3.1-flash-lite')
                )));

                foreach ($candidateModels as $model) {
                    try {
                        $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:streamGenerateContent?alt=sse&key={$apiKey}";
                        $genConfig = [
                            'temperature' => 0.3,
                            'maxOutputTokens' => 4096,
                        ];
                        if (str_contains($model, '3.6') || str_contains($model, 'thinking')) {
                            $genConfig['thinkingConfig'] = ['thinkingBudget' => 0];
                        }

                        $payload = [
                            'system_instruction' => [
                                'parts' => [
                                    ['text' => $instructionText]
                                ]
                            ],
                            'contents' => array_merge($history, [
                                [
                                    'role' => 'user',
                                    'parts' => [
                                        ['text' => $query]
                                    ]
                                ]
                            ]),
                            'generationConfig' => $genConfig
                        ];

                        $lineBuffer = '';
                        $fullAiText = '';

                        $ch = curl_init($apiUrl);
                        curl_setopt($ch, CURLOPT_POST, true);
                        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
                        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
                        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                        curl_setopt($ch, CURLOPT_TIMEOUT, 35);
                        curl_setopt($ch, CURLOPT_WRITEFUNCTION, function ($chRef, $chunk) use (&$lineBuffer, &$fullAiText, $sendEvent) {
                            $lineBuffer .= $chunk;
                            while (($newlinePos = strpos($lineBuffer, "\n")) !== false) {
                                $line = substr($lineBuffer, 0, $newlinePos);
                                $lineBuffer = substr($lineBuffer, $newlinePos + 1);
                                $line = trim($line);
                                if (str_starts_with($line, 'data: ')) {
                                    $jsonStr = substr($line, 6);
                                    $data = json_decode($jsonStr, true);
                                    if ($data && isset($data['candidates'][0]['content']['parts'])) {
                                        $segment = '';
                                        foreach ($data['candidates'][0]['content']['parts'] as $p) {
                                            if (empty($p['thought']) && !empty($p['text'])) {
                                                $segment .= $p['text'];
                                            }
                                        }
                                        if ($segment !== '') {
                                            $fullAiText .= $segment;
                                            $sendEvent(['chunk' => $segment]);
                                        }
                                    }
                                }
                            }
                            return strlen($chunk);
                        });

                        curl_exec($ch);
                        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                        curl_close($ch);

                        if ($httpCode === 200 && mb_strlen(trim($fullAiText)) >= 10) {
                            $cleanFull = trim($fullAiText);
                            $cleanFull = preg_replace('/^\s*\(?\d+[- ]?\d*\s*bullet points\)?\??.*$/umi', '', $cleanFull);
                            $cleanFull = preg_replace('/^\s*\*?\s*No WhatsApp number mentioned\??.*$/umi', '', $cleanFull);
                            $cleanFull = preg_replace('/^\s*\*?\s*No [৳Tk\/]+.*$/umi', '', $cleanFull);
                            $cleanFull = preg_replace('/^\s*\*?\s*Checked\s*$/umi', '', $cleanFull);
                            $cleanFull = trim(preg_replace('/\n{3,}/', "\n\n", $cleanFull));

                            if (!$isAskingWhatsapp) {
                                $cleanFull = preg_replace('/01400[- ]?786162\s*(?:\/|বা|,)\s*/u', '', $cleanFull);
                                $cleanFull = preg_replace('/\s*(?:\/|বা|,)?\s*(?:WhatsApp:\s*)?01400[- ]?786162/ui', '', $cleanFull);
                                $cleanFull = preg_replace('/কল করুন:\s*$/u', 'কল করুন: 09638-000505', $cleanFull);
                                $cleanFull = trim($cleanFull);
                            }

                            // Log query to database
                            DB::table('ai_chat_logs')->insert([
                                'user_query' => $query,
                                'reply' => $cleanFull,
                                'matched_rule_id' => null,
                                'source' => 'gemini',
                                'ip_address' => $request->ip(),
                                'created_at' => now(),
                            ]);

                            $sendEvent([
                                'done' => true,
                                'full_text' => $cleanFull,
                                'image' => $this->chatReplyImage($query, $cleanFull),
                                'source' => 'gemini',
                                'title' => 'টেক ডেন্টাল',
                                'icon' => 'fa-sparkles',
                                'icon_color' => 'text-blue-600',
                                'icon_bg' => 'bg-blue-100',
                                'action_type' => 'appointment',
                                'action_label' => 'অনলাইন সিরিয়াল নিন',
                                'action_url' => '/appointment',
                            ]);
                            return;
                        }

                        // Try next candidate model if this one failed
                        continue;
                    } catch (\Throwable $e) {
                        Log::error("Gemini Stream Exception for {$model}: " . $e->getMessage());
                    }
                }
            }

            // 2. Training Data Matcher Fallback (Stream smoothly)
            $trainingData = !empty($settings->training_data) ? $settings->training_data : self::DEFAULT_TRAINING_DATA;
            $kbReply = $this->matchTrainingDataAnswer($trainingData, $query);
            if ($kbReply) {
                $replyText = $kbReply['reply'];
                if (!$isAskingWhatsapp) {
                    $replyText = preg_replace('/01400[- ]?786162\s*(?:\/|বা|,)\s*/u', '', $replyText);
                    $replyText = preg_replace('/\s*(?:\/|বা|,)?\s*(?:WhatsApp:\s*)?01400[- ]?786162/ui', '', $replyText);
                    $replyText = preg_replace('/কল করুন:\s*$/u', 'কল করুন: 09638-000505', $replyText);
                    $replyText = trim($replyText);
                }

                $segments = mb_str_split($replyText, 6);
                foreach ($segments as $seg) {
                    $sendEvent(['chunk' => $seg]);
                    usleep(15000);
                }

                DB::table('ai_chat_logs')->insert([
                    'user_query' => $query,
                    'reply' => $replyText,
                    'matched_rule_id' => null,
                    'source' => 'gemini',
                    'ip_address' => $request->ip(),
                    'created_at' => now(),
                ]);

                $sendEvent([
                    'done' => true,
                    'full_text' => $replyText,
                    'image' => $this->chatReplyImage($query, $replyText),
                    'source' => 'gemini',
                    'title' => $kbReply['title'],
                    'icon' => 'fa-sparkles',
                    'icon_color' => 'text-blue-600',
                    'icon_bg' => 'bg-blue-100',
                    'action_type' => 'appointment',
                    'action_label' => 'অনলাইন সিরিয়াল নিন',
                    'action_url' => '/appointment',
                ]);
                return;
            }

            // 3. Keyword-based rules fallback
            $cleanQuery = mb_strtolower($query, 'UTF-8');
            $rules = DB::table('ai_chat_replies')
                ->where('is_active', 1)
                ->orderBy('priority', 'desc')
                ->orderBy('id', 'asc')
                ->get();

            foreach ($rules as $rule) {
                $keywords = explode(',', $rule->keywords);
                foreach ($keywords as $kw) {
                    $kw = trim(mb_strtolower($kw, 'UTF-8'));
                    if (!empty($kw) && mb_strpos($cleanQuery, $kw) !== false) {
                        DB::table('ai_chat_replies')->where('id', $rule->id)->increment('match_count');

                        $segments = mb_str_split($rule->reply, 6);
                        foreach ($segments as $seg) {
                            $sendEvent(['chunk' => $seg]);
                            usleep(15000);
                        }

                        DB::table('ai_chat_logs')->insert([
                            'user_query' => $query,
                            'reply' => $rule->reply,
                            'matched_rule_id' => $rule->id,
                            'source' => 'keyword',
                            'ip_address' => $request->ip(),
                            'created_at' => now(),
                        ]);

                        $sendEvent([
                            'done' => true,
                            'full_text' => $rule->reply,
                            'image' => $this->chatReplyImage($query, $rule->reply),
                            'source' => 'keyword',
                            'title' => $rule->title,
                            'icon' => $rule->icon ?: 'fa-tooth',
                            'icon_color' => $rule->icon_color ?: 'text-blue-600',
                            'icon_bg' => $rule->icon_bg ?: 'bg-blue-100',
                            'action_type' => $rule->action_type ?: 'none',
                            'action_label' => $rule->action_label,
                            'action_url' => $rule->action_url,
                        ]);
                        return;
                    }
                }
            }

            // 4. Default Fallback
            $fallback = $settings->fallback_reply ?? "টেক ডেন্টালের অভিজ্ঞ সার্জনগণ আপনাকে নির্ভুল সেবা প্রদান করবেন। খরচ, ভিজিট সময় বা চিকিৎসকের সাথে কথা বলতে আমাদের হটলাইনে সরাসরি ডায়াল করুন অথবা অনলাইনে সিরিয়াল বুক করুন।";

            $segments = mb_str_split($fallback, 6);
            foreach ($segments as $seg) {
                $sendEvent(['chunk' => $seg]);
                usleep(15000);
            }

            DB::table('ai_chat_logs')->insert([
                'user_query' => $query,
                'reply' => $fallback,
                'matched_rule_id' => null,
                'source' => 'fallback',
                'ip_address' => $request->ip(),
                'created_at' => now(),
            ]);

            $sendEvent([
                'done' => true,
                'full_text' => $fallback,
                'image' => $this->chatReplyImage($query, $fallback),
                'source' => 'fallback',
                'title' => 'টেক ডেন্টাল',
                'icon' => 'fa-circle-question',
                'icon_color' => 'text-blue-600',
                'icon_bg' => 'bg-blue-100',
                'action_type' => 'appointment',
                'action_label' => 'অনলাইন অ্যাপয়েন্টমেন্ট',
                'action_url' => '/appointment',
            ]);
        }, 200, [
            'Content-Type' => 'text/event-stream; charset=UTF-8',
            'Cache-Control' => 'no-cache, no-transform',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    /**
     * Convert the client's recent chat turns into Gemini `contents` entries.
     * Only the last 10 messages are kept, and consecutive same-role turns are merged.
     */
    private function normalizeChatHistory($raw): array
    {
        if (!is_array($raw)) {
            return [];
        }

        $turns = [];
        foreach (array_slice($raw, -10) as $item) {
            if (!is_array($item)) {
                continue;
            }
            $role = (($item['role'] ?? '') === 'assistant') ? 'model' : 'user';
            $text = trim((string) ($item['text'] ?? ''));
            if ($text === '') {
                continue;
            }
            if (mb_strlen($text) > 1500) {
                $text = mb_substr($text, 0, 1500);
            }
            $lastIndex = count($turns) - 1;
            if ($lastIndex >= 0 && $turns[$lastIndex]['role'] === $role) {
                $turns[$lastIndex]['parts'][0]['text'] .= "\n" . $text;
            } else {
                $turns[] = ['role' => $role, 'parts' => [['text' => $text]]];
            }
        }

        // Gemini expects the conversation to start with a user turn.
        while (!empty($turns) && $turns[0]['role'] !== 'user') {
            array_shift($turns);
        }

        return $turns;
    }

    /**
     * Public AI Chat API Endpoint (POST /api/ai-chat)
     */
    public function chatApi(Request $request)
    {
        $query = trim($request->input('query') ?: $request->input('message') ?: '');
        if (empty($query)) {
            return response()->json([
                'success' => false,
                'message' => 'অনুগ্রহ করে প্রশ্ন লিখুন।',
            ], 422);
        }

        // Recent turns from the same chat box, so the assistant can follow the conversation.
        $history = $this->normalizeChatHistory($request->input('history'));

        $settings = DB::table('ai_chat_settings')->first();
        $apiKey = trim($settings->gemini_api_key ?? env('GEMINI_API_KEY', ''));

        // STEP 1: Google Gemini AI with Company Training Data (PRIMARY ENGINE)
        // If Gemini is enabled, every patient question is answered directly by Gemini using your company training data!
        if ($settings && $settings->gemini_enabled && !empty($apiKey)) {
            $trainingData = !empty($settings->training_data) ? $settings->training_data : self::DEFAULT_TRAINING_DATA;

            $instructionText = "ROLE & INSTRUCTIONS FOR TECH DENTAL AI ASSISTANT:\n{$trainingData}\n\nSTRICT GUIDELINES:
1. Always answer the patient's questions using the above official company training data.
2. For treatment costs (e.g. scaling, root canal, dental caps, implants), quote the exact prices from the training data.
3. Mention our relevant branch locations (মিরপুর, উত্তরা, বাড্ডা, যাত্রাবাড়ী) and official hotline 09638-000505 when helpful.
4. STRICT WHATSAPP RULE: NEVER provide the WhatsApp number (01400-786162) in normal replies. Only provide WhatsApp if the patient specifically asks for WhatsApp or mobile number.
5. Keep the answer warm and concise, and reply in the patient's own language: Bangla or Banglish questions get a polite Bangla answer; English questions get an English answer (prices and facts stay exactly the same).
6. YOUTUBE VIDEOS: If the training data contains a YouTube video link (e.g. https://youtu.be/... or https://www.youtube.com/watch?v=...) related to the treatment, procedure, or topic the patient is inquiring about, include the full YouTube link on its own line so the patient can watch the video directly in the chat box.
7. CRITICAL: Output ONLY the final polite message to the patient. NEVER output internal thoughts, checklists, reasoning, or self-verifications (such as '(2-4 bullet points)? Yes' or 'Checked').
8. DOCTOR & SCHEDULE RULE: For any question about doctor names, duty times or branch schedules, use ONLY the information given in the training data above. NEVER guess or invent a doctor name, duty time or schedule. If a detail is not confirmed there, say it should be confirmed on hotline 09638-000505.
9. BOOKING RULE: If the patient wants an appointment or serial - including how-to questions such as 'সিরিয়াল কিভাবে নেব', 'serial nibo kivabe', 'serial nite chai' - there are exactly TWO options: (a) call the official hotline 09638-000505, or (b) fill the online booking form on the appointment page (the 'অনলাইন বুকিং' button shown with the reply). NEVER provide any booking format or fill-in-the-blank template. NEVER ask for or accept name, phone, branch, date, time, service or address in the chat. NEVER claim a booking is confirmed and NEVER say the patient's details have been 'noted', 'recorded' or 'saved in the system' - the chat cannot save bookings.";

            $candidateModels = array_values(array_unique(array_merge(
                [$settings->gemini_model ?? 'gemini-3.1-flash-lite'],
                $this->resolveGeminiModelCandidates($settings->gemini_model ?? 'gemini-3.1-flash-lite')
            )));

            foreach ($candidateModels as $model) {
                try {
                    $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

                    $genConfig = [
                        'temperature' => 0.3,
                        'maxOutputTokens' => 4096,
                    ];
                    if (str_contains($model, '3.6') || str_contains($model, 'thinking')) {
                        $genConfig['thinkingConfig'] = ['thinkingBudget' => 0];
                    }

                    $payload = [
                        'system_instruction' => [
                            'parts' => [
                                ['text' => $instructionText]
                            ]
                        ],
                        'contents' => array_merge($history, [
                            [
                                'role' => 'user',
                                'parts' => [
                                    ['text' => $query]
                                ]
                            ]
                        ]),
                        'generationConfig' => $genConfig
                    ];

                    $response = Http::withoutVerifying()->timeout(18)->post($apiUrl, $payload);

                    if ($response->successful()) {
                        $resData = $response->json();
                        $parts = $resData['candidates'][0]['content']['parts'] ?? [];
                        $aiText = '';
                        foreach ($parts as $part) {
                            if (!empty($part['thought'])) {
                                continue;
                            }
                            if (!empty($part['text'])) {
                                $aiText .= $part['text'];
                            }
                        }
                        $aiText = trim($aiText);

                        // Strip any potential internal reasoning / checklist leakage
                        $aiText = preg_replace('/^\s*\(?\d+[- ]?\d*\s*bullet points\)?\??.*$/umi', '', $aiText);
                        $aiText = preg_replace('/^\s*\*?\s*No WhatsApp number mentioned\??.*$/umi', '', $aiText);
                        $aiText = preg_replace('/^\s*\*?\s*No [৳Tk\/]+.*$/umi', '', $aiText);
                        $aiText = preg_replace('/^\s*\*?\s*Checked\s*$/umi', '', $aiText);
                        $aiText = trim(preg_replace('/\n{3,}/', "\n\n", $aiText));

                        // If user did NOT explicitly ask for WhatsApp, strip WhatsApp number from normal responses
                        $isAskingWhatsapp = (bool)preg_match('/whatsapp|হোয়াটসঅ্যাপ|হোয়াটসএপ|হোয়াটসঅ্যাপ|watsapp|what\'s app/ui', $query);
                        if (!$isAskingWhatsapp && !empty($aiText)) {
                            $aiText = preg_replace('/01400[- ]?786162\s*(?:\/|বা|,)\s*/u', '', $aiText);
                            $aiText = preg_replace('/\s*(?:\/|বা|,)?\s*(?:WhatsApp:\s*)?01400[- ]?786162/ui', '', $aiText);
                            $aiText = preg_replace('/কল করুন:\s*$/u', 'কল করুন: 09638-000505', $aiText);
                            $aiText = trim($aiText);
                        }

                        if (!empty($aiText) && mb_strlen($aiText) >= 3) {
                            DB::table('ai_chat_logs')->insert([
                                'user_query' => $query,
                                'reply' => $aiText,
                                'matched_rule_id' => null,
                                'source' => 'gemini',
                                'ip_address' => $request->ip(),
                                'created_at' => now(),
                            ]);

                            return response()->json([
                                'success' => true,
                                'source' => 'gemini',
                                'title' => 'টেক ডেন্টাল',
                                'reply' => $aiText,
                                'image' => $this->chatReplyImage($query, $aiText),
                                'icon' => 'fa-sparkles',
                                'icon_color' => 'text-blue-600',
                                'icon_bg' => 'bg-blue-100',
                                'action_type' => 'appointment',
                                'action_label' => 'অনলাইন সিরিয়াল নিন',
                                'action_url' => '/appointment',
                            ]);
                        }
                    }

                    Log::warning("Gemini model {$model} returned status {$response->status()}: " . substr($response->body(), 0, 150));
                    continue;
                } catch (\Exception $e) {
                    Log::error("Gemini API Exception for {$model}: " . $e->getMessage());
                }
            }
        }

        // STEP 1.5: Direct Knowledge Base / Training Data Matcher
        // Matches questions directly from the clinic's official training data (costs, branches, timings)
        $trainingData = !empty($settings->training_data) ? $settings->training_data : self::DEFAULT_TRAINING_DATA;
        $kbReply = $this->matchTrainingDataAnswer($trainingData, $query);
        if ($kbReply) {
            DB::table('ai_chat_logs')->insert([
                'user_query' => $query,
                'reply' => $kbReply['reply'],
                'matched_rule_id' => null,
                'source' => 'gemini',
                'ip_address' => $request->ip(),
                'created_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'source' => 'gemini',
                'title' => $kbReply['title'],
                'reply' => $kbReply['reply'],
                'image' => $this->chatReplyImage($query, $kbReply['reply']),
                'icon' => 'fa-sparkles',
                'icon_color' => 'text-blue-600',
                'icon_bg' => 'bg-blue-100',
                'action_type' => 'appointment',
                'action_label' => 'অনলাইন সিরিয়াল নিন',
                'action_url' => '/appointment',
            ]);
        }

        // STEP 2: Keyword-based rules fallback (if Gemini is offline, disabled or no API key)
        $cleanQuery = mb_strtolower($query, 'UTF-8');
        $rules = DB::table('ai_chat_replies')
            ->where('is_active', 1)
            ->orderBy('priority', 'desc')
            ->orderBy('id', 'asc')
            ->get();

        foreach ($rules as $rule) {
            $keywords = explode(',', $rule->keywords);
            foreach ($keywords as $kw) {
                $kw = trim(mb_strtolower($kw, 'UTF-8'));
                if (!empty($kw) && mb_strpos($cleanQuery, $kw) !== false) {
                    // Match found!
                    DB::table('ai_chat_replies')->where('id', $rule->id)->increment('match_count');

                    // Log query
                    DB::table('ai_chat_logs')->insert([
                        'user_query' => $query,
                        'reply' => $rule->reply,
                        'matched_rule_id' => $rule->id,
                        'source' => 'keyword',
                        'ip_address' => $request->ip(),
                        'created_at' => now(),
                    ]);

                    return response()->json([
                        'success' => true,
                        'source' => 'keyword',
                        'title' => $rule->title,
                        'reply' => $rule->reply,
                        'image' => $this->chatReplyImage($query, $rule->reply),
                        'icon' => $rule->icon ?: 'fa-tooth',
                        'icon_color' => $rule->icon_color ?: 'text-blue-600',
                        'icon_bg' => $rule->icon_bg ?: 'bg-blue-100',
                        'action_type' => $rule->action_type ?: 'none',
                        'action_label' => $rule->action_label,
                        'action_url' => $rule->action_url,
                    ]);
                }
            }
        }

        // STEP 3: Fallback Reply
        $fallback = $settings->fallback_reply ?? "টেক ডেন্টালের অভিজ্ঞ সার্জনগণ আপনাকে নির্ভুল সেবা প্রদান করবেন। খরচ, ভিজিট সময় বা চিকিৎসকের সাথে কথা বলতে আমাদের হটলাইনে সরাসরি ডায়াল করুন অথবা অনলাইনে সিরিয়াল বুক করুন।";

        DB::table('ai_chat_logs')->insert([
            'user_query' => $query,
            'reply' => $fallback,
            'matched_rule_id' => null,
            'source' => 'fallback',
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'source' => 'fallback',
            'title' => 'টেক ডেন্টাল',
            'reply' => $fallback,
            'image' => $this->chatReplyImage($query, $fallback),
            'icon' => 'fa-circle-question',
            'icon_color' => 'text-blue-600',
            'icon_bg' => 'bg-blue-100',
            'action_type' => 'appointment',
            'action_label' => 'অনলাইন অ্যাপয়েন্টমেন্ট',
            'action_url' => '/appointment',
        ]);
    }

    /**
     * Match queries directly against clinic training data knowledge base
     */
    protected function matchTrainingDataAnswer(?string $trainingData, string $query): ?array
    {
        if (empty($trainingData)) {
            return null;
        }

        $qLower = mb_strtolower($query, 'UTF-8');
        $lines = explode("\n", $trainingData);
        $matchedLines = [];

        $topics = [
            'স্কেলিং' => ['স্কেলিং', 'scaling', 'পরিষ্কার', 'ওয়াশ', 'wash'],
            'রুট ক্যানেল' => ['রুট ক্যানেল', 'rct', 'root canal', 'ব্যথা'],
            'ক্যাপ' => ['ক্যাপ', 'cap', 'ক্রাউন', 'crown'],
            'ইমপ্ল্যান্ট' => ['ইমপ্ল্যান্ট', 'implant', 'স্থায়ী কৃত্রিম দাঁত', 'স্থায়ী দাঁত', 'দাঁত বাঁধ'],
            'ব্রেসেস' => ['ব্রেসেস', 'braces', 'বাঁকা', 'ফাঁকা', 'aligner', 'ক্লিপ', 'সোজা'],
            'ফিলিং' => ['ফিলিং', 'filling'],
            'তোলা' => ['তোলা', 'extraction', 'তুলে'],
            'সাদা' => ['সাদা', 'whitening'],
            'শিশু' => ['শিশু', 'বাচ্চা', 'kids', 'child'],
            'মিরপুর' => ['মিরপুর', 'mirpur', 'শেওড়াপাড়া'],
            'উত্তরা' => ['উত্তরা', 'uttara'],
            'বাড্ডা' => ['বাড্ডা', 'badda'],
            'যাত্রাবাড়ী' => ['যাত্রাবাড়ী', 'jatrabari', 'যাত্রাবাড়ি'],
            'ঠিকানা' => ['ঠিকানা', 'শাখা', 'লোকেশন', 'location', 'branch', 'কোথায়', 'kothay'],
            'সময়' => ['সময়', 'সময়', 'timing', 'time', 'কখন', 'খোলা'],
            'খরচ' => ['খরচ', 'ফি', 'প্রাইস', 'price', 'cost', 'টাকা'],
        ];

        $matchedTopics = [];
        foreach ($topics as $topic => $words) {
            foreach ($words as $w) {
                if (mb_strpos($qLower, $w) !== false) {
                    $matchedTopics[$topic] = true;
                    break;
                }
            }
        }

        if (empty($matchedTopics)) {
            return null;
        }

        foreach ($lines as $line) {
            $lineTrim = trim($line);
            if (empty($lineTrim)) continue;

            foreach ($matchedTopics as $top => $_) {
                if (mb_stripos($lineTrim, $top) !== false && !str_starts_with($lineTrim, '[')) {
                    $matchedLines[] = $lineTrim;
                    break;
                }
            }
        }

        // If user asked generally about cost/price
        if (empty($matchedLines) && isset($matchedTopics['খরচ'])) {
            foreach ($lines as $line) {
                $lineTrim = trim($line);
                if (str_starts_with($lineTrim, '•')) {
                    $matchedLines[] = $lineTrim;
                }
            }
        }

        // If user asked generally about branch / locations
        if (empty($matchedLines) && isset($matchedTopics['ঠিকানা'])) {
            foreach ($lines as $line) {
                $lineTrim = trim($line);
                if (preg_match('/^[১-৪1-4]\./u', $lineTrim)) {
                    $matchedLines[] = $lineTrim;
                }
            }
        }

        if (empty($matchedLines)) {
            return null;
        }

        $matchedLines = array_unique($matchedLines);
        $extractedText = implode("\n", $matchedLines);

        $reply = "টেক ডেন্টালের ট্রেনিং ডাটা অনুযায়ী আপনার প্রশ্নের তথ্য নিচে দেওয়া হলো:\n\n" . $extractedText . "\n\nআমাদের ৪টি শাখা (মিরপুর, উত্তরা, বাড্ডা, যাত্রাবাড়ী)-তে প্রতিদিন সকাল ১০টা থেকে রাত ৯টা পর্যন্ত বিশেষজ্ঞ ডাক্তার উপস্থিত থাকেন। সিরিয়াল বা যেকোনো তথ্যের জন্য সরাসরি কল করুন: 09638-000505।";

        return [
            'title' => 'টেক ডেন্টাল',
            'reply' => $reply,
        ];
    }

    /**
     * Price chart shown under an answer when the reply itself quotes an amount
     * for closing gaps between teeth with composite veneers. It must NOT appear
     * for other priced treatments (chipped tooth, braces, whitening, etc.).
     */
    private function chatReplyImage(string $query, string $reply = ''): ?array
    {
        $haystack = mb_strtolower($query . "\n" . $reply, 'UTF-8');

        $gap = (bool) preg_match(
            '/ফাঁকা\s*দাঁত|দাঁতের\s*ফাঁকা|দাঁতে\s*ফাঁকা|ফাঁকা\s*অংশ|দাঁতের\s*ফাঁক|দাঁতের\s*গ্যাপ|গ্যাপ\s*ক্লোজার|faka\s*da+[nt]h?|\bgap\b|gap\s*teeth|tooth\s*gap|teeth\s*gap/ui',
            $haystack
        );

        // Show the chart only when the answer text contains an actual amount.
        $amount = (bool) preg_match('/[০-৯0-9]/u', $reply)
            && (bool) preg_match('/৳|টাকা|taka|\btk\b|\bbdt\b/ui', $reply);

        // Braces / aligner questions are not composite-veneer pricing.
        $ortho = (bool) preg_match('/ব্রেসেস|braces|অ্যালাইনার|aligner|ইনভিজিবল|invisalign/ui', $query);

        if (!$gap || !$amount || $ortho) {
            return null;
        }

        return [
            'url' => '/uploads/ai/faka-dat-composite-veneer-cost.webp',
            'alt' => 'দাঁতের ফাঁকা অংশের চিকিৎসায় কম্পোজিট ভিনিয়ার খরচের চার্ট',
        ];
    }

    /**
     * Resolve candidate Gemini models in order of priority, auto-migrating deprecated models
     */
    private function resolveGeminiModelCandidates(?string $model): array
    {
        $requested = trim($model ?: '');

        // Auto-migrate deprecated 1.5, 2.0 or invalid non-preview 3 models
        if (in_array($requested, ['gemini-2.0-flash', 'gemini-2.0', 'gemini-2.0-flash-exp', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-3-flash'])) {
            $requested = 'gemini-3.5-flash-lite';
        }
        if (in_array($requested, ['gemini-2.0-pro', 'gemini-2.0-pro-exp', 'gemini-3-pro'])) {
            $requested = 'gemini-2.5-pro';
        }

        $candidates = [];
        if (!empty($requested)) {
            $candidates[] = $requested;
            if (str_contains($requested, '-preview')) {
                $candidates[] = str_replace('-preview', '', $requested);
            }
        }
        // Verified high-quota & active models supported by Google AI Studio
        $candidates[] = 'gemini-3.5-flash-lite';
        $candidates[] = 'gemini-3.1-flash-lite';
        $candidates[] = 'gemini-2.5-flash';
        $candidates[] = 'gemini-flash-latest';
        $candidates[] = 'gemini-flash-lite-latest';
        $candidates[] = 'gemini-3.6-flash';

        return array_values(array_unique($candidates));
    }

    /**
     * Fetch Live Available Models directly from Google Gemini API
     */
    public function fetchModels(Request $request)
    {
        $settings = DB::table('ai_chat_settings')->first();
        $apiKey = trim($request->input('gemini_api_key') ?: ($settings->gemini_api_key ?? ''));

        if (empty($apiKey)) {
            return response()->json([
                'success' => false,
                'message' => 'API Key প্রদান করুন',
                'models' => [],
            ], 422);
        }

        try {
            $response = Http::withoutVerifying()->timeout(12)->get("https://generativelanguage.googleapis.com/v1beta/models?key={$apiKey}");

            if ($response->successful()) {
                $data = $response->json();
                $rawModels = $data['models'] ?? [];
                $filtered = [];

                foreach ($rawModels as $m) {
                    $methods = $m['supportedGenerationMethods'] ?? [];
                    if (in_array('generateContent', $methods)) {
                        $cleanId = str_replace('models/', '', $m['name']);
                        $filtered[] = [
                            'id' => $cleanId,
                            'name' => $cleanId,
                            'displayName' => $m['displayName'] ?? $cleanId,
                            'description' => $m['description'] ?? '',
                        ];
                    }
                }

                return response()->json([
                    'success' => true,
                    'models' => $filtered,
                ]);
            }

            $errorData = $response->json();
            return response()->json([
                'success' => false,
                'message' => 'গুগল মডেল ফেচ ব্যর্থ: ' . ($errorData['error']['message'] ?? $response->body()),
                'models' => [],
            ], $response->status());

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'কানেকশন এরর: ' . $e->getMessage(),
                'models' => [],
            ], 500);
        }
    }

    /**
     * Test Gemini API Connection directly from Admin Panel with auto-retry and model migration
     */
    public function testGemini(Request $request)
    {
        $settings = DB::table('ai_chat_settings')->first();
        $apiKey = trim($request->input('gemini_api_key') ?: ($settings->gemini_api_key ?? ''));
        $requestedModel = trim($request->input('gemini_model') ?: ($settings->gemini_model ?? 'gemini-3-flash'));
        $testPrompt = trim($request->input('prompt') ?: 'হ্যালো, আপনি কি টেক ডেন্টালের এআই অ্যাসিস্ট্যান্ট হিসেবে ঠিকমত কাজ করছেন? সংক্ষেপে ১-২ লাইনে মিষ্টি করে বাংলায় উত্তর দিন।');
        $trainingData = $request->input('training_data') ?: ($settings->training_data ?? '');

        if (empty($apiKey)) {
            return response()->json([
                'success' => false,
                'message' => 'কোনো Gemini API Key পাওয়া যায়নি! দয়া করে ইনপুট বক্সে আপনার Google Gemini API Key দিন।',
            ], 422);
        }

        $instructionText = "ROLE & INSTRUCTIONS: You are Tania, Tech Dental's customer-care representative in Dhaka, Bangladesh. Answer politely, accurately, and concisely using ONLY the training data below, and reply in the patient's own language (Bangla/Banglish -> Bangla, English -> English).";
        if (!empty($trainingData)) {
            $instructionText .= "\n\n### TECH DENTAL OFFICIAL TRAINING DATA:\n" . $trainingData;
        }

        $candidateModels = array_values(array_unique(array_merge([$requestedModel], $this->resolveGeminiModelCandidates($requestedModel))));

        // Also attempt to dynamically pull Google's exact active models as backup
        try {
            $listRes = Http::withoutVerifying()->timeout(6)->get("https://generativelanguage.googleapis.com/v1beta/models?key={$apiKey}");
            if ($listRes->successful()) {
                $onlineModels = $listRes->json()['models'] ?? [];
                foreach ($onlineModels as $om) {
                    if (in_array('generateContent', $om['supportedGenerationMethods'] ?? [])) {
                        $candidateModels[] = str_replace('models/', '', $om['name']);
                    }
                }
                $candidateModels = array_values(array_unique($candidateModels));
            }
        } catch (\Exception $e) {
            // Ignore listModels error
        }

        $lastError = null;
        $lastErrorCode = 400;

        foreach ($candidateModels as $model) {
            $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

            $payload = [
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            ['text' => "{$instructionText}\n\nPATIENT TEST QUESTION: {$testPrompt}"]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.4,
                    'maxOutputTokens' => 4096,
                    'responseModalities' => ['TEXT'],
                ]
            ];

            try {
                $startTime = microtime(true);
                $response = Http::withoutVerifying()->timeout(15)->post($apiUrl, $payload);
                $latencyMs = round((microtime(true) - $startTime) * 1000);

                if ($response->successful()) {
                    $resData = $response->json();
                    $parts = $resData['candidates'][0]['content']['parts'] ?? [];
                    $aiText = '';
                    foreach ($parts as $part) {
                        if (!empty($part['text'])) {
                            $aiText .= $part['text'];
                        }
                    }
                    $aiText = trim($aiText);

                    // If audio/multimodal data was returned
                    if (empty($aiText) && !empty($parts)) {
                        foreach ($parts as $part) {
                            if (!empty($part['inlineData'])) {
                                $aiText = "Gemini API সফলভাবে রেসপন্স করেছে (অডিও/মিডিয়া ডাটা)। আপনার এপিআই ও মডেল সঠিকভাবে সক্রিয় রয়েছে!";
                                break;
                            }
                        }
                    }

                    if (!empty($aiText)) {
                        // If model had to be auto-migrated from deprecated, update settings in DB
                        if ($model !== $requestedModel) {
                            DB::table('ai_chat_settings')->where('id', 1)->update([
                                'gemini_model' => $model,
                                'updated_at' => now(),
                            ]);
                        }

                        $note = ($model !== $requestedModel)
                            ? " (অপ্রচলিত মডেলের বদলে অ্যাক্টিভ মডেল '{$model}' সফলভাবে ব্যবহৃত হয়েছে)"
                            : "";

                        return response()->json([
                            'success' => true,
                            'message' => 'অভিনন্দন! আপনার Google Gemini API সফলভাবে সংযুক্ত এবং সক্রিয় রয়েছে' . $note . '।',
                            'reply' => $aiText,
                            'model' => $model,
                            'latency_ms' => $latencyMs,
                            'status_code' => $response->status(),
                        ]);
                    }
                }

                $errorData = $response->json();
                $lastError = $errorData['error']['message'] ?? $response->body();
                $lastErrorCode = $response->status();

                // If 404, 429, or 503, loop to next candidate model
                if (!in_array($response->status(), [404, 429, 503])) {
                    break;
                }
            } catch (\Exception $e) {
                $lastError = $e->getMessage();
                $lastErrorCode = 500;
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'Gemini API এরর: ' . ($lastError ?: 'মডেল রেসপন্স করছে না'),
            'status_code' => $lastErrorCode,
            'raw_error' => $lastError,
        ], $lastErrorCode ?: 400);
    }
}

