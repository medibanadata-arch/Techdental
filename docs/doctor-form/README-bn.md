# ডাক্তারদের তথ্য তোলার Google Form — Tech Dental Care

সাইটের `/doctors/{id}` প্রোফাইলে ঠিক যে ফিল্ডগুলো দেখানো হয়, সেই ফিল্ডগুলোই ফর্মে রাখা হয়েছে।
তাই ডাক্তার যা লিখবেন, সরাসরি অ্যাডমিন প্যানেলের `Doctors → Edit` ফর্মে বসিয়ে দেওয়া যাবে।

---

## ১. ফর্মটি বানানোর সবচেয়ে সহজ উপায় (২ মিনিট)

1. ব্রাউজারে যান: <https://script.google.com> → **New project**
2. `doctor-profile-form.gs` ফাইলের **পুরো কোড** কপি করে এডিটরে পেস্ট করুন (পুরোনো `myFunction` মুছে দিন)
3. উপরে ফাংশন ড্রপডাউনে **`createDoctorProfileForm`** সিলেক্ট করে **Run** চাপুন
4. প্রথমবার **Review permissions → Allow** দিন (নিজের Google অ্যাকাউন্টে ফর্ম বানাচ্ছেন)
5. নিচের **Execution log**-এ ৩টি লিংক পাবেন:
   - `EDIT URL` → ফর্ম এডিট করার লিংক
   - `DOCTOR FORM` → ডাক্তারদের পাঠানোর পাবলিক লিংক
   - `SHORT URL` → `forms.gle/...` শর্ট লিংক (WhatsApp-এ পাঠানোর জন্য)
6. ফর্মের **Responses** ট্যাব → **Link to Sheets** → রেসপন্সগুলো Google Sheet-এ জমা হবে

> ফর্মটি আপনার Google Drive-এ যাবে। নাম বদলাতে চাইলে `form.setTitle(...)` বা Drive থেকে rename করতে পারবেন।

---

## ২. প্রশ্নের তালিকা ও সাইটের ফিল্ড ম্যাপিং

| # | সেকশন | প্রশ্ন (ফর্মে যেভাবে দেখাবে) | ধরন | বাধ্যতামূলক | অ্যাডমিন ফিল্ড (`doctors`) |
|---|--------|------------------------------|------|:---:|---------------------------|
| 1 | ১. ব্যক্তিগত | পুরো নাম (Full Name) | Short answer | ✅ | `name` |
| 2 | ১. ব্যক্তিগত | মোবাইল / WhatsApp নম্বর | Short answer (validation) | ✅ | `phone` |
| 3 | ১. ব্যক্তিগত | আপনি কোন ব্রাঞ্চে কর্মরত? | Dropdown — Mirpur / Badda / Uttara / Jatrabari | ✅ | `branch`, `branch_location` |
| 4 | ১. ব্যক্তিগত | পদবি (Designation) | Short answer | ✅ | `designation` |
| 5 | ১. ব্যক্তিগত | BMDC রেজিস্ট্রেশন নম্বর | Short answer (validation) | ✅ | `bmdc` |
| 6 | ২. পেশাগত | ডিগ্রি (Degree) | Paragraph | ✅ | `deg` |
| 7 | ২. পেশাগত | বিশেষত্ব / Expertise | Paragraph (কমা দিয়ে, সর্বোচ্চ ১০টি) | ✅ | `spec` |
| 8 | ২. পেশাগত | মোট অভিজ্ঞতা (বছর) | Short answer (number) | ✅ | `experience_years`, `exp` |
| 9 | ২. পেশাগত | এখন পর্যন্ত চিকিৎসা দেওয়া রোগীর সংখ্যা | Short answer (number) | ✅ | `patients_treated` |
| 10 | ২. পেশাগত | সংক্ষিপ্ত পরিচিতি (Short Bio) | Paragraph | ✅ | `bio` |
| 11 | ৩. চেম্বার | চেম্বারের নাম | Short answer | ✅ | `chamber_title` |
| 12 | ৩. চেম্বার | চেম্বারের সম্পূর্ণ ঠিকানা | Paragraph | ✅ | `chamber_address` |
| 13 | ৩. চেম্বার | রোগী দেখার সময় | Short answer | ✅ | `visiting_time` |
| 14 | ৩. চেম্বার | সাপ্তাহিক বন্ধের দিন | Short answer | ❌ | (মার্কেটিং/নোটে ব্যবহার) |
| 15 | ৩. চেম্বার | যোগাযোগের হটলাইন | Short answer | ❌ | `hotline` |
| 16–21 | ৪. মাইলস্টোন | মাইলস্টোন ১/২/৩ — সংখ্যা ও কী কাজ | Short answer ×2 প্রতি সেট | ১টি ✅, বাকি ❌ | `milestones` (`[{count,label}]`) |
| 22 | ৫. ছবি | পোর্ট্রেট ছবি আপলোড | File upload (image) | ✅ | `img` (মিডিয়া লাইব্রেরিতে আপলোড করে URL) |
| 23 | ৫. ছবি | অনুমতি (consent) | Checkbox | ✅ | — (রেকর্ড হিসেবে Sheet-এ থাকবে) |

**অটো-ফিল্ড (ফর্মে লাগবে না, আমরাই বসাই):** `seo_title`, `meta_desc`, `seo_content`, `faqs`, `schema_json`, `rank_order`, `verified`, `canonical_url`।

---

## ৩. ডাক্তারদের ছবির নিয়ম (একই ভাষায় তাদের জানিয়ে দিন)

- সাদা বা হালকা ব্যাকগ্রাউন্ড, মুখ সম্পূর্ণ স্পষ্ট ও আন-ক্রপড
- মিনিমাম **৮০০ × ১০০০ px**, পোর্ট্রেট (৩:৪), JPG/PNG
- ওয়াটারমার্ক, হেভি ফিল্টার, সেলফি অ্যাঙ্গেল বা গ্রুপ ছবি নয়
- চোখের লেভেলে ক্যামেরা, প্রফেশনাল পোশাক (অ্যাপ্রন/কোট)
- সাইটে ছবিটি **৪:৩ (মোবাইলে ৩:৪)** ফ্রেমে দেখায় — তাই মুখটি ছবির উপরের ২/৩ অংশে রাখলে ভালো

> Google Forms-এ ফাইল আপলোডের জন্য রেসপন্ডেন্টকে Google অ্যাকাউন্টে সাইন-ইন করতে হয়।
> যাদের Google অ্যাকাউন্ট নেই, তারা ছবি **WhatsApp (01400786162)**-এ পাঠাবে — ফর্মের শেষ সেকশনেও এটা লেখা আছে।

---

## ৪. রেসপন্স পাওয়ার পর আমাদের কাজ

1. Google Sheet → নতুন রেসপন্স দেখে তথ্য যাচাই
2. অ্যাডমিন: `Doctors → Edit` → ফিল্ডগুলো বসানো (`name, phone, branch, designation, bmdc, deg, spec, experience_years, patients_treated, bio, chamber_title, chamber_address, visiting_time, hotline, milestones`)
3. ছবি: ড্রাইভ থেকে নামিয়ে **Media Library**-তে আপলোড (সাইট নিজেই WebP-তে কনভার্ট করে) → `img` ফিল্ডে সেট
4. `seo_title`, `meta_desc` টিম লিখে দেবে (BMDC নম্বর + ব্রাঞ্চ + বিশেষত্ব রেখে)
5. সেভ → লাইভ সাইটে প্রোফাইল আপডেট

---

## ৫. চাইলে হাতে (ক্লিক করে) বানানোর চেকলিস্ট

Apps Script ব্যবহার করতে না চাইলে Google Forms-এ নতুন ফর্ম খুলে এই সেটিংসগুলো দিন:

**ফর্ম সেটিংস**
- Collect email addresses: **চালু** (ফাইল আপলোডের জন্য লাগে)
- Limit to 1 response: **চালু**
- Progress bar: **চালু**
- Confirmation message: ধন্যবাদ! আপনার তথ্য আমরা পেয়েছি। ২–৩ কর্মদিবসের মধ্যে প্রোফাইল আপডেট হবে।

**সেকশন ১ — ব্যক্তিগত ও যোগাযোগ তথ্য**
- Short answer: পুরো নাম (required)
- Short answer: মোবাইল / WhatsApp নম্বর → Response validation → Regular expression → `^\+?[0-9][0-9 \-]{8,14}$` (required)
- Dropdown: আপনি কোন ব্রাঞ্চে কর্মরত? → Mirpur, Badda, Uttara, Jatrabari (required)
- Short answer: পদবি (required)
- Short answer: BMDC রেজিস্ট্রেশন নম্বর → Regular expression → `^[0-9A-Za-z/\-]{2,15}$` (required)

**সেকশন ২ — শিক্ষা, বিশেষত্ব ও অভিজ্ঞতা**
- Paragraph: ডিগ্রি (required)
- Paragraph: বিশেষত্ব / Expertise (required)
- Short answer: মোট অভিজ্ঞতা (বছর) → Number → between 0 and 60 (required)
- Short answer: রোগীর সংখ্যা → Number → between 0 and 1000000 (required)
- Paragraph: সংক্ষিপ্ত পরিচিতি (required)

**সেকশন ৩ — চেম্বার ও রোগী দেখার সময়**
- Short answer: চেম্বারের নাম (required)
- Paragraph: চেম্বারের সম্পূর্ণ ঠিকানা (required)
- Short answer: রোগী দেখার সময় (required)
- Short answer: সাপ্তাহিক বন্ধের দিন
- Short answer: যোগাযোগের হটলাইন

**সেকশন ৪ — উল্লেখযোগ্য কাজ (Milestones)**
- Short answer: মাইলস্টোন ১ — সংখ্যা → `^[0-9][0-9,]*\+?$` (required)
- Short answer: মাইলস্টোন ১ — কী কাজ (required)
- একইভাবে ২ ও ৩ (optional)

**সেকশন ৫ — প্রোফাইল ছবি ও অনুমতি**
- File upload: আপনার পোর্ট্রেট ছবি আপলোড করুন → Allow only specific file types → Image; Maximum 2 files (required)
- Checkbox: অনুমতি — "আমি সম্মতি দিচ্ছি যে আমার নাম, ছবি, ডিগ্রি, অভিজ্ঞতা ও চেম্বারের তথ্য Tech Dental Care-এর ওয়েবসাইট ও মার্কেটিং কনটেন্টে প্রকাশ করা যাবে।" (required)

---

## ৬. WhatsApp-এ পাঠানোর মেসেজ (কপি-পেস্ট)

```
প্রিয় ডাক্তার সাহেব,
Tech Dental Care-এর ওয়েবসাইটে আপনার প্রোফাইল হালনাগাদ করতে ৫ মিনিটের একটি ফর্ম পূরণ করুন।

ফর্ম: [এখানে SHORT URL বসান]

যা যা লাগবে: নাম, মোবাইল, ব্রাঞ্চ, পদবি, BMDC নম্বর, ডিগ্রি, বিশেষত্ব, অভিজ্ঞতা (বছর),
রোগীর সংখ্যা, চেম্বারের ঠিকানা, রোগী দেখার সময় এবং একটি পোর্ট্রেট ছবি।

ছবি: সাদা ব্যাকগ্রাউন্ড, মিনিমাম ৮০০×১০০০ px, ওয়াটারমার্ক ছাড়া।
ছবি আপলোডে সমস্যা হলে এই নম্বরে WhatsApp করুন: 01400786162

ধন্যবাদ,
Tech Dental Care
```
