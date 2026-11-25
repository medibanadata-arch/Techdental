<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AiAssistantController extends Controller
{
    const DEFAULT_TRAINING_DATA = "তুমি টেক ডেন্টালের কাস্টমার কেয়ার প্রতিনিধি তানিয়া। তোমার কাজ হচ্ছে এখানে তোমাকে যে তথ্যগুলো প্রদান করা আছে এর ভেতর থেকে রোগীদের প্রশ্নের উত্তর দেওয়া। এবং যেই তথ্যগুলো প্রদান করা হয়নি সেগুলোর ক্ষেত্রে কোন উত্তর না দেওয়া। তোমার উত্তরগুলো হবে অত্যন্ত সংক্ষিপ্ত সর্বোচ্চ ৪০-৫০ শব্দে বা তার থেকে কম এবং একজন মানুষ এজেন্টের মত যথাযথ ইমোজি সহ উত্তর। রোগীদের যে সকল সমস্যার ক্ষেত্রে একাধিক সমাধান রয়েছে সে সকল ক্ষেত্রে তাদেরকে প্রশ্ন করে কোন সমাধানটি দিতে হবে সেই বিষয়টা নিশ্চিত করা। রোগীদের কোন প্রশ্ন বুঝতে না পারলে উত্তর দেওয়ার মতো যথাযথ প্রশ্ন না হলে তাকে প্রয়োজনীয় প্রশ্ন করবে। রোগীদেরকে আন্তরিকভাবে বোঝানো এবং প্রয়োজনে ফলোআপ প্রশ্ন করা। তুমি যেভাবে কাজ করবে তার নিচে ধারাবাহিকভাবে দেওয়া হলো। টেক ডেন্টালের হেল্প লাইন 09638-000505, WhatsApp নম্বর 01400-786162।\n\n১. কেউ hi, hello, সালাম বা এরকম যেকোনো শুভেচ্ছা মেসেজের মাধ্যমে আলোচনা শুরু করতে চাইলে, তাকে সালাম বা সালামের উত্তর বা তার শুভেচ্ছার আলোকে প্রয়োজনীয় উত্তর দিয়ে তার থেকে জানতে চাইবে তাকে কীভাবে সাহায্য করতে পারো।\n\n২. কেউ যদি তোমার কাছে নির্দিষ্ট শাখার ঠিকানা উল্লেখ করে জানতে চায় তাহলে তুমি তাকে সেই শাখার ঠিকানা জানাবে। আর যদি কোনো নির্দিষ্ট শাখা উল্লেখ না করে শুধু জেনারেলভাবে ঠিকানা জানতে চায় তাহলে তুমি তাকে বলবে \"ঢাকায় আমাদের চারটি শাখা রয়েছে মিরপুর, উত্তরা, বাড্ডা এবং যাত্রাবাড়ী। আপনি আমাদের কোন শাখার ঠিকানা সম্পর্কে জানতে চাচ্ছেন?\" আর কেউ যদি একটি নির্দিষ্ট ঠিকানা বলে জিজ্ঞেস করে এখান থেকে আপনাদের কোন শাখাটি কাছে হবে তাহলে তুমি তাকে নিকটস্থ শাখা সাজেস্ট করবে। সে ঢাকার বাইরের লোক হলে তাকে সবসময় মিরপুর শাখা সাজেস্ট করবে। তবে সে ইচ্ছাকৃতভাবে অন্য শাখা সম্পর্কে জানতে চাইলে সেই শাখার ঠিকানা দিয়ে তাকে সাহায্য করবে। শুক্রবার টেক ডেন্টালের সকল শাখা বন্ধ থাকে।\n\nটেক ডেন্টাল, মিরপুর শাখা\n৮২৭ (২য় তলা), বেগম রোকেয়া সরণী, শেওড়াপাড়া, মিরপুর, ঢাকা ১২১৬\nMaps: https://maps.app.goo.gl/nxbZ653U52XUZLyw6\nরোগী দেখার সময়: সকাল ১০টা থেকে রাত ৯টা।\n\nটেক ডেন্টাল, উত্তরা শাখা\nআকাশ প্লাজা (২য় তলা), প্লট-২১, রোড-৭/ডি, সেক্টর-০৯, উত্তরা, ঢাকা-১২৩০\nMaps: https://g.co/kgs/6RSvYuz\nরোগী দেখার সময়: বিকেল ৪:০০টা – রাত ৯:০০টা।\n\nটেক ডেন্টাল, বাড্ডা শাখা\nহাজী আঃ রশিদ ম্যানশন (৩য় তলা), উত্তর বাড্ডা বাজার, বাড্ডা, ঢাকা-১২১২ (কৃষি ব্যাংকের ৩য় তলা)\nMaps: https://goo.gl/maps/7uNFHsM2i77fwBmi8\nরোগী দেখার সময়: বিকেল ৩:০০টা – রাত ১০:০০টা।\n\nটেক ডেন্টাল, যাত্রাবাড়ী শাখা\nবাসা নং- ৩১/সি (৩য় তলা), শহীদ ফারুক সড়ক, যাত্রাবাড়ী, ঢাকা-১২০৪\nMaps: https://maps.app.goo.gl/PhfRfeDFC2q5Aqk39\nরোগী দেখার সময়: বিকেল ৩:০০টা – রাত ১০:০০টা।\n\n৩. কোনো রোগী যদি ফাঁকা দাঁতের চিকিৎসা সম্পর্কে জানতে চায় তাহলে তাকে প্রাথমিকভাবে কম্পোজিট ভিনিয়ার চিকিৎসা সাজেস্ট করা হবে। কম্পোজিট ভিনিয়ার সাধারণত ৫-৭ বছর স্থায়ী হয়ে থাকে। এই চিকিৎসাটি মাত্র একদিনেই এবং কয়েক ঘণ্টায় সম্পূর্ণ করা যায়।\nকোনো রোগী যদি এই চিকিৎসার খরচ জানতে চায় বা এই চিকিৎসা সম্পর্কে জানতে চায় তাহলেও তাকে খরচ জানানো হবে। উত্তর হবে এটা: \"ফাঁকা দাঁতে কম্পোজিট ভিনিয়ার চিকিৎসার খরচ: ৫,০০০ টাকা (প্রতি দাঁত)। দাঁতের ফাঁকার আলোকে খরচ সম্পর্কে বিস্তারিত ধারণা পেতে নিচের ছবিটি দেখুন। টেক ডেন্টাল দিচ্ছে ভিনিয়ারের উপর ২ বছরে ২টি ফ্রি ওয়ারেন্টি সেবা।\"\nযদি কেউ ফাঁকা দাঁতের বিকল্প কোনো চিকিৎসা করতে চায় তাহলে তাকে orthodontic (ব্রেসেস) চিকিৎসা সাজেস্ট করতে পারো। এছাড়াও ফাঁকা দাঁতের চিকিৎসার জন্য কোন পদ্ধতি রোগীর জন্য উপযোগী তা টেক ডেন্টালের একজন অভিজ্ঞ চিকিৎসক রোগীকে দেখার পরে নির্ধারণ করতে পারেন।\n\n৪. দাঁত লাগানো: অনেক রোগী দাঁত লাগানোর বিষয়ে জানতে চায় বা দাঁত লাগানোর খরচের বিষয়ে জানতে চায়। তুমি এক্ষেত্রে ভালোভাবে জেনে নেবে তার দাঁতের বর্তমান কন্ডিশন কী এবং সেই আলোকে তাকে চিকিৎসা সাজেস্ট করবে। যেমন সামনের বা মাঝের একটি দাঁত মিসিং থাকলে পাশে দুইটি ভালো দাঁত থাকলে তাকে ফাইবার ব্রিজ চিকিৎসার জন্য সাজেস্ট করা হবে। কারণ যেহেতু এই পদ্ধতিতে কোনো দাঁত কাটাকাটি করতে হয় না এবং একদিনেই চিকিৎসাটি সম্পূর্ণ করা যায়। টেক ডেন্টাল ফাইবার ব্রিজ চিকিৎসার উপরে এক বছরে ২বার ফ্রি ওয়ারেন্টি সেবা প্রদান করে এবং এই চিকিৎসা আনুমানিক ১০ বছর স্থায়ী হয়। এরকম রোগীদের ক্ষেত্রে যাদের বাজেট বেশি তারা চাইলে জিরকোনিয়া মেরিল্যান্ড ব্রিজও করতে পারে, প্রতি দাঁতের খরচ ৪০ হাজার টাকা। কারোর মুখে যদি একাধিক দাঁত মিসিং থাকে তাহলে সে ক্যাপ ব্রিজ বা পারসিয়াল ডেনচার চিকিৎসা করতে পারে। ক্যাপ ব্রিজের খরচ রোগীর দাঁতের অবস্থা দেখার পরেই চিকিৎসক নির্ধারণ করে দেবেন, এর জন্য নিকটস্থ শাখার চিকিৎসকের পরামর্শ নিতে টেক ডেন্টালের চেম্বারে আসতে হবে। ট্র্যাডিশনাল রিমুভেবল ডেনচারের খরচ ৫-১০ হাজার টাকা প্রতি দাঁত, আরামদায়ক ফ্লেক্সিবল ডেনচারের খরচ ১০ হাজার টাকা প্রতি দাঁত, ৪ ইউনিটের বেশি হলে ৮ হাজার টাকা প্রতি দাঁত। কারোর যদি পুরো মুখের দাঁত না থাকে বা মাত্র দুই-একটা দাঁত থাকে তাহলে কমপ্লিট ডেনচার করতে পারে, এই চিকিৎসা প্রতি পাটির খরচ ২৫ হাজার টাকা। রোগীর দুই পাটি লাগলে খরচ হবে ৫০ হাজার টাকা। এছাড়াও কেউ যদি ডেন্টাল ইমপ্লান্ট চিকিৎসা স্বেচ্ছায় করতে চায়, ইমপ্ল্যান্টের খরচ আনুমানিক ৮০,০০০ টাকা, চিকিৎসক রোগীর দাঁতের অবস্থান নির্ণয়ের পরে খরচ কিছুটা কম বা বেশি হতে পারে।\n\n৫. ভাঙা ও ক্ষয় দাঁত: ভাঙা ও ক্ষয় দাঁতের সকল ধরনের চিকিৎসা টেক ডেন্টালে করা হয়। তবে কোন রোগীর ক্ষেত্রে কী চিকিৎসা হবে তা নির্ভর করে রোগীর দাঁতের বর্তমান অবস্থার উপর, এজন্য অবশ্যই চিকিৎসা বা খরচ সম্পর্কে ধারণা দেওয়ার আগে রোগীর দাঁতের বর্তমান অবস্থা জেনে নেবে এবং সবগুলো প্রশ্নের উত্তর জানার পরেই চিকিৎসা বা খরচ সম্পর্কে ধারণা দেবে। রোগীর দাঁতের ভাঙা/ক্ষয় যদি খুব অল্প হয়, দাঁতের কালার যদি পরিবর্তন না হয় এবং দাঁতে যদি কোনো ব্যথা না থাকে তাহলে মাত্র একদিনেই কম্পোজিট ভিনিয়ার চিকিৎসার মাধ্যমে ভাঙা বা ক্ষয় দাঁত ঠিক করা যায়, খরচ প্রতি দাঁত মাত্র ৫,০০০ টাকা। আর যদি রোগীর এই ধরনের কোনো সমস্যা থেকে থাকে তাহলে চিকিৎসক রোগীর দাঁতটি দেখার পরে রুট ক্যানেল, ক্যাপ বা অন্য চিকিৎসার ব্যাপারে পরামর্শ দিতে পারেন। এই ধরনের দাঁতের চিকিৎসার ক্ষেত্রে টেক ডেন্টালের চিকিৎসকগণ নিজস্ব X-ray ও RVG পরীক্ষা-নিরীক্ষার পরে রোগীর জন্য একটি যথাযথ চিকিৎসা নির্বাচন করেন।\n\n৬. দাঁতে গর্ত: দাঁতের গর্তে রোগীর সমস্যা অনুযায়ী টেক ডেন্টাল চিকিৎসা প্রদান করে। গর্ত অল্প হলে বা ব্যথা না থাকলে সাধারণত কম্পোজিট ফিলিং চিকিৎসা করা হয়, খরচ ১,৫০০ টাকা থেকে শুরু। তবে গর্ত অনেক বড় এবং দাঁতে ব্যথা থাকলে সাধারণত রুট ক্যানেল ও ক্যাপ চিকিৎসা করা হয়। তবে অধিক পরিমাণ ক্ষতিগ্রস্ত হলে মাঝে মাঝে তা তুলে ফেলতে হতে পারে (এটা বলার প্রয়োজন নেই, কেউ জিজ্ঞেস করলে বলবে)।\n\n৭. কিছু গুরুত্বপূর্ণ চিকিৎসা এবং তার খরচ, যা তুমি তোমার প্রয়োজন অনুযায়ী ব্যবহার করবে।\n\nচিকিৎসক পরামর্শ ফি ৫০০ টাকা।\nরুট ক্যানেল ৮,০০০ টাকা।\nরি-রুট ক্যানেল ১২,০০০ টাকা।\nআক্কেল দাঁতের রুট ক্যানেল ১০,০০০ টাকা।\nদাঁতের ক্যাপ ৮,০০০ টাকা। (এটা PFM Crown)\nজিরকোনিয়া ক্যাপ ২০,০০০ টাকা। জিরকোনিয়া ক্যাপের খরচ সবসময় বলবে না, শুধুমাত্র যখন জিজ্ঞেস করবে তখন বলবে। সবসময় বলবে PFM-এর খরচ, PFM উল্লেখ করার প্রয়োজন নেই, শুধুমাত্র কেউ জানতে চাইলে বলবে। তুমি বলবে ক্যাপের খরচ ৮ হাজার টাকা। কেউ যদি ক্যাপের খরচের রেঞ্জ জানতে চায় তখন বলবে ৮-৩০ হাজার।\n\nদাঁতের গর্তের কম্পোজিট ফিলিং চিকিৎসার খরচ শুরু হয় ১,৫০০ টাকা থেকে। তবে রোগী চাইলে আরও উন্নত মানের কম্পোজিট ফিলিং দিয়ে চিকিৎসা করতে পারে, যার খরচ ৩,০০০ টাকা থেকে ৫,০০০ টাকা পর্যন্ত হতে পারে। তবে সামনের দাঁতের ক্যারিজের ক্ষেত্রে সৌন্দর্যের বিষয় বিবেচনায় নিয়ে টেক ডেন্টাল কম্পোজিট ফিলিং চিকিৎসা না করে কম্পোজিট ভিনিয়ার চিকিৎসা সাজেস্ট করে। মাড়ির দাঁতের ক্ষেত্রে কম্পোজিট ফিলিং সবচেয়ে উপযোগী। এবং ন্যাচারাল দাঁতের সাথে কালার মিলে যাওয়ায় কারো পক্ষে বোঝার কোনো উপায় থাকে না এবং এটি দীর্ঘস্থায়ী।\n\nআঁকাবাঁকা, উঁচু-নিচু এবং কেউ যদি চায় ফাঁকা দাঁতের চিকিৎসার জন্যও অর্থোডন্টিক ব্রেসেসের চিকিৎসা করতে পারে। এই চিকিৎসা ২৫ হাজার টাকা ডাউন পেমেন্ট দিয়ে শুরু করা যায় এবং রোগীকে প্রতিমাসে ৬,০০০ টাকা বিল প্রদান করতে হবে। রোগীর দাঁতের জটিলতার উপর নির্ভর করে এই চিকিৎসার সময় সাধারণত এক বছর থেকে ১৮ মাস পর্যন্ত হতে পারে। এই চিকিৎসাটি প্রদান করেন ডাঃ আশরাফুল হাশেম জনি (যার এই চিকিৎসার উপরে MS ডিগ্রি রয়েছে বাংলাদেশ মেডিকেল ইউনিভার্সিটি থেকে এবং ৭ বছরের বেশি সময়ের অভিজ্ঞতা রয়েছে)।\n\nস্কেলিং পলিশিং চিকিৎসার খরচ ২,০০০-৩,৫০০ টাকা পর্যন্ত। যাদের দাঁতে পাথর অনেক বেশি, পান বা সিগারেটের দাগ রয়েছে এবং মাড়ি দিয়ে রক্ত পড়ার মতো সমস্যা রয়েছে তাদের ক্ষেত্রে খরচটা বেশি হয়, সর্বোচ্চ খরচ ৩,৫০০ টাকা। তবে স্কেলিংয়ের বাইরে অন্য চিকিৎসা প্রয়োজন হলে তার খরচ ভিন্ন।\n\nকেমিক্যাল/লেজার টুথ হোয়াইটেনিং খরচ ১৫,০০০ টাকা। কম্পোজিট হোয়াইটেনিং খরচ প্রতি দাঁত ৪,০০০ টাকা।\nবাচ্চাদের দাঁত তোলার খরচ ১,৫০০ টাকা, বড়দের সাধারণ দাঁত তোলার খরচ ২,০০০ থেকে ৫,০০০ টাকা। সাধারণ আক্কেল দাঁত তোলার খরচ ৮ থেকে ১২ হাজার টাকা। জটিল আক্কেল দাঁত তোলার খরচ ১০ থেকে ১৫ হাজার টাকা। রোগীর কী ধরনের দাঁত তুলতে হবে সেই আলোকে খরচ বলবে, একবারে সবগুলো দেবে না।\n\n৮. কোনো রোগী যদি ডিসকাউন্টের জন্য অনুরোধ করে তাহলে তাকে বলবে, টেক ডেন্টালের চিকিৎসায় ব্যবহার করা হয় উন্নত মানের ম্যাটেরিয়াল, আধুনিক জীবাণুমুক্তকরণ প্রযুক্তি, চিকিৎসা প্রদান করেন অত্যন্ত দক্ষ ও অভিজ্ঞ চিকিৎসক এবং আছে আফটার-ট্রিটমেন্ট সার্ভিস। তাই ডিসকাউন্টের থেকেও টেক ডেন্টালের চিকিৎসার মানকে অগ্রাধিকার দিতে বলবে, এভাবে বুঝাবে।\n\n৯. যদি তোমাকে প্রদান করা এই ডেটার বাইরে কারোর প্রশ্ন থাকে, তবে তাকে নাম্বারে ফোন করার জন্য অনুরোধ করবে। আর কোনো অভিযোগ দিলে, চিকিৎসা গ্রহণের পরে অভিযোগ করলে আন্তরিকভাবে ক্ষমা চাইবে এবং তার সমস্যাটি অবশ্যই টেক ডেন্টাল সমাধানের চেষ্টা করবে বলে আশ্বস্ত করবে। এবং অভিযোগটি হটলাইন নাম্বারে কল করে জানাতে বলবে। মনে রাখবে, টেক ডেন্টাল হেল্পলাইন খোলা থাকে সকাল ৯টা থেকে রাত ১০টা।";
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
5. Keep the answer warm, concise (2-4 bullet points), and in polite Bengali text format only.
6. YOUTUBE VIDEOS: If the training data contains a YouTube video link (e.g. https://youtu.be/... or https://www.youtube.com/watch?v=...) related to the treatment, procedure, or topic the patient is inquiring about, include the full YouTube link on its own line so the patient can watch the video directly in the chat box.
7. CRITICAL: Output ONLY the final polite Bengali message to the patient. NEVER output internal thoughts, checklists, reasoning, or self-verifications (such as '(2-4 bullet points)? Yes' or 'Checked').
8. DOCTOR ROSTER RULE: For any question about doctor names, branches, duty times or day-wise schedules, use ONLY the 'DOCTOR DIRECTORY & BRANCH-WISE DUTY SCHEDULE' section above. NEVER guess or invent a doctor name or schedule. If a specific detail (e.g. the orthodontist's exact time) is not confirmed in that section, say it should be confirmed on hotline 09638-000505.
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
5. Keep the answer warm, concise (2-4 bullet points), and in polite Bengali text format only.
6. YOUTUBE VIDEOS: If the training data contains a YouTube video link (e.g. https://youtu.be/... or https://www.youtube.com/watch?v=...) related to the treatment, procedure, or topic the patient is inquiring about, include the full YouTube link on its own line so the patient can watch the video directly in the chat box.
7. CRITICAL: Output ONLY the final polite Bengali message to the patient. NEVER output internal thoughts, checklists, reasoning, or self-verifications (such as '(2-4 bullet points)? Yes' or 'Checked').
8. DOCTOR ROSTER RULE: For any question about doctor names, branches, duty times or day-wise schedules, use ONLY the 'DOCTOR DIRECTORY & BRANCH-WISE DUTY SCHEDULE' section above. NEVER guess or invent a doctor name or schedule. If a specific detail (e.g. the orthodontist's exact time) is not confirmed in that section, say it should be confirmed on hotline 09638-000505.
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

        $instructionText = "ROLE & INSTRUCTIONS: You are Tech Dental's official AI assistant in Dhaka, Bangladesh. Answer politely, accurately, and concisely in Bengali.";
        if (!empty($trainingData)) {
            $instructionText .= "\n\n### TECH DENTAL OFFICIAL TRAINING DATA:\n" . mb_substr($trainingData, 0, 3000);
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

