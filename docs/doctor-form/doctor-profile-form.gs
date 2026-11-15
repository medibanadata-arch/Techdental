/**
 * Tech Dental Care — Doctor Profile Google Form
 * ---------------------------------------------
 * এই স্ক্রিপ্টটি একবার রান করলেই সম্পূর্ণ ফর্ম (সেকশন, ভ্যালিডেশন, ড্রপডাউন,
 * ছবি আপলোড, কনসেন্ট) অটোমেটিক তৈরি হয়ে যাবে।
 *
 * ব্যবহার:
 *   1. https://script.google.com  →  New project
 *   2. এই ফাইলের পুরো কোড পেস্ট করে Save
 *   3. Run → createDoctorProfileForm() → Permission দিন
 *   4. Execution log-এ Edit URL + Published (doctor-facing) URL পাবেন
 *   5. ফর্মের Responses → "Link to Sheets" দিয়ে রেসপন্স শিট বানিয়ে নিন
 *
 * ফিল্ডগুলো সাইটের doctors টেবিলের সাথে ম্যাপ করা:
 *   name, phone, branch, designation, bmdc, deg, spec, experience_years,
 *   patients_treated, chamber_title, chamber_address, visiting_time,
 *   hotline, bio, img (photo), milestones[{count,label}]
 */

var BRANCHES = ['Mirpur', 'Badda', 'Uttara', 'Jatrabari'];
var HOTLINE = '09638000505';
var WHATSAPP = '01400786162';

function createDoctorProfileForm() {
  var form = FormApp.create('Tech Dental Care — ডাক্তার প্রোফাইল তথ্য ফর্ম');

  form.setDescription(
    'প্রিয় ডাক্তার সাহেব, Tech Dental Care-এর ওয়েবসাইটে আপনার প্রোফাইলটি হালনাগাদ করতে নিচের তথ্যগুলো পূরণ করুন।\n\n' +
    '⏱ সময় লাগবে: ৫–৭ মিনিট\n' +
    '📌 যে তথ্যগুলো লাগবে: নাম, মোবাইল, ব্রাঞ্চ, পদবি, BMDC নম্বর, ডিগ্রি, বিশেষত্ব, অভিজ্ঞতা, রোগীর সংখ্যা, চেম্বারের ঠিকানা, রোগী দেখার সময় এবং একটি পোর্ট্রেট ছবি।\n\n' +
    'ছবি আপলোডে সমস্যা হলে WhatsApp করুন: ' + WHATSAPP + '\n' +
    'যেকোনো প্রশ্নে কল: ' + HOTLINE
  );

  // ছবি আপলোডের জন্য ইমেইল সংগ্রহ বাধ্যতামূলক
  form.setCollectEmail(true);
  form.setLimitOneResponsePerUser(true);
  form.setProgressBar(true);
  form.setConfirmationMessage(
    'ধন্যবাদ! আপনার তথ্য আমরা পেয়েছি। যাচাই করে ২–৩ কর্মদিবসের মধ্যে ওয়েবসাইটে প্রোফাইলটি আপডেট করা হবে। ' +
    'কোনো তথ্য ভুল থাকলে ' + WHATSAPP + ' (WhatsApp) নম্বরে জানাবেন।'
  );

  /* ---------------- Section 1: ব্যক্তিগত তথ্য ---------------- */
  form.addPageBreakItem()
    .setTitle('১. ব্যক্তিগত ও যোগাযোগ তথ্য')
    .setHelpText('আপনার নাম ও যোগাযোগের তথ্য দিন।');

  form.addTextItem()
    .setTitle('পুরো নাম (Full Name)')
    .setHelpText('ডিগ্রি সহ পুরো নাম লিখুন, যেমন: Dr. Aysha Siddika')
    .setRequired(true);

  form.addTextItem()
    .setTitle('মোবাইল / WhatsApp নম্বর')
    .setHelpText('যে নম্বরে আমরা যোগাযোগ করতে পারব, যেমন: 01712345678')
    .setValidation(
      FormApp.createTextValidation()
        .setHelpText('সঠিক নম্বর দিন (১০–১৫ সংখ্যা), যেমন 01712345678')
        .requireTextMatchesPattern('^\\+?[0-9][0-9 \\-]{8,14}$')
        .build()
    )
    .setRequired(true);

  form.addListItem()
    .setTitle('আপনি কোন ব্রাঞ্চে কর্মরত?')
    .setChoiceValues(BRANCHES)
    .setRequired(true);

  form.addTextItem()
    .setTitle('পদবি (Designation)')
    .setHelpText('যেমন: Dental Surgeon at Tech Dental, Mirpur Branch / Assistant Medical Director')
    .setRequired(true);

  form.addTextItem()
    .setTitle('BMDC রেজিস্ট্রেশন নম্বর')
    .setHelpText('শুধু নম্বরটি লিখুন, যেমন: 7897')
    .setValidation(
      FormApp.createTextValidation()
        .setHelpText('BMDC নম্বরটি সংখ্যায় দিন (যেমন 7897)')
        .requireTextMatchesPattern('^[0-9A-Za-z/\\-]{2,15}$')
        .build()
    )
    .setRequired(true);

  /* ---------------- Section 2: পেশাগত তথ্য ---------------- */
  form.addPageBreakItem()
    .setTitle('২. শিক্ষা, বিশেষত্ব ও অভিজ্ঞতা')
    .setHelpText('এই অংশের তথ্যগুলোই ওয়েবসাইটের প্রোফাইলে সবচেয়ে বেশি দেখা যায়।');

  form.addParagraphTextItem()
    .setTitle('ডিগ্রি (Degree)')
    .setHelpText('সব ডিগ্রি ও পিজিটি একসাথে লিখুন, যেমন: BDS (Shaheed Suhrawardy Medical College), PGT: Oral & Maxillofacial Surgery')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('বিশেষত্ব / Expertise')
    .setHelpText('কমা (,) দিয়ে আলাদা করে সর্বোচ্চ ১০টি লিখুন, যেমন: Dental Filling, Root Canal Treatment, Crown & Bridge, Scaling & Polishing, Tooth Extraction')
    .setRequired(true);

  form.addTextItem()
    .setTitle('মোট অভিজ্ঞতা (বছর)')
    .setHelpText('শুধু সংখ্যা লিখুন, যেমন: 8')
    .setValidation(
      FormApp.createTextValidation()
        .setHelpText('০ থেকে ৬০-এর মধ্যে একটি সংখ্যা দিন')
        .requireNumberBetween(0, 60)
        .build()
    )
    .setRequired(true);

  form.addTextItem()
    .setTitle('এখন পর্যন্ত চিকিৎসা দেওয়া রোগীর সংখ্যা')
    .setHelpText('শুধু সংখ্যা লিখুন, যেমন: 2858')
    .setValidation(
      FormApp.createTextValidation()
        .setHelpText('শুধু সংখ্যা লিখুন (কমা বা + ছাড়া), যেমন 2858')
        .requireNumberBetween(0, 1000000)
        .build()
    )
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('সংক্ষিপ্ত পরিচিতি (Short Bio)')
    .setHelpText('৩–৫ বাক্যে নিজের পরিচয়, কাজের ধরন ও বিশেষ দক্ষতা লিখুন। তৃতীয় পুরুষে লিখুন (যেমন: Dr. ... is an experienced dental surgeon ...)। ৮০০ অক্ষরের মধ্যে।')
    .setRequired(true);

  /* ---------------- Section 3: চেম্বার ও সময়সূচি ---------------- */
  form.addPageBreakItem()
    .setTitle('৩. চেম্বার ও রোগী দেখার সময়')
    .setHelpText('রোগীরা এই তথ্য দেখে সরাসরি চেম্বারে আসেন, তাই সঠিকভাবে দিন।');

  form.addTextItem()
    .setTitle('চেম্বারের নাম')
    .setHelpText('যেমন: Tech Dental Care (Mirpur Branch)')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('চেম্বারের সম্পূর্ণ ঠিকানা')
    .setHelpText('যেমন: 827, 2nd Floor, Shewrapara, Begum Rokeya Sarani (Beside Metro Pillar 318), Dhaka')
    .setRequired(true);

  form.addTextItem()
    .setTitle('রোগী দেখার সময় (Visiting Time)')
    .setHelpText('যেমন: 4.00PM – 9.00PM (শুক্রবার বন্ধ লিখে দিতে পারেন)')
    .setRequired(true);

  form.addTextItem()
    .setTitle('সাপ্তাহিক বন্ধের দিন (যদি থাকে)')
    .setHelpText('যেমন: শুক্রবার — না থাকলে "নেই" লিখুন')
    .setRequired(false);

  form.addTextItem()
    .setTitle('যোগাযোগের হটলাইন')
    .setHelpText('সাধারণত ' + HOTLINE + ' — আলাদা নম্বর থাকলে লিখুন')
    .setRequired(false);

  /* ---------------- Section 4: ক্লিনিক্যাল মাইলস্টোন ---------------- */
  form.addPageBreakItem()
    .setTitle('৪. উল্লেখযোগ্য কাজ (Milestones)')
    .setHelpText(
      'ওয়েবসাইটে আপনার প্রোফাইলে ৩টি কার্ডে আপনার কাজের পরিসংখ্যান দেখানো হয়। ' +
      'প্রথম কার্ডটি বাধ্যতামূলক, বাকি দুটি ইচ্ছামতো।'
    );

  addMilestone(form, '১', true);
  addMilestone(form, '২', false);
  addMilestone(form, '৩', false);

  /* ---------------- Section 5: ছবি ও সম্মতি ---------------- */
  form.addPageBreakItem()
    .setTitle('৫. প্রোফাইল ছবি ও অনুমতি')
    .setHelpText('ছবিটি ওয়েবসাইট, Google Business Profile ও আমাদের সোশ্যাল পেজে ব্যবহার করা হবে।');

  form.addFileUploadItem()
    .setTitle('আপনার পোর্ট্রেট ছবি আপলোড করুন')
    .setHelpText(
      'নিয়ম:\n' +
      '• সাদা বা হালকা ব্যাকগ্রাউন্ড, মুখ পুরোপুরি স্পষ্ট\n' +
      '• সিরিয়াস/প্রফেশনাল ভাব, স্মাইল করলেও সমস্যা নেই\n' +
      '• মিনিমাম ৮০০ × ১০০০ পিক্সেল (পোর্ট্রেট), JPG বা PNG\n' +
      '• ওয়াটারমার্ক, হেভি ফিল্টার বা সেলফি অ্যাঙ্গেল নয়\n' +
      '• সর্বোচ্চ ২টি ছবি (একটি মূল, চাইলে একটি বিকল্প)\n\n' +
      'Google অ্যাকাউন্টে সাইন-ইন থাকা লাগবে। সমস্যা হলে WhatsApp: ' + WHATSAPP
    )
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('অনুমতি')
    .setChoiceValues([
      'আমি সম্মতি দিচ্ছি যে আমার নাম, ছবি, ডিগ্রি, অভিজ্ঞতা ও চেম্বারের তথ্য Tech Dental Care-এর ওয়েবসাইট ও মার্কেটিং কনটেন্টে প্রকাশ করা যাবে।',
    ])
    .setRequired(true);

  /* ---------------- Output ---------------- */
  var published = form.getPublishedUrl();
  var edit = form.getEditUrl();

  Logger.log('EDIT URL      : ' + edit);
  Logger.log('DOCTOR FORM   : ' + published);
  Logger.log('SHORT URL     : ' + form.shortenFormUrl(published));
  Logger.log('FORM ID       : ' + form.getId());

  return { editUrl: edit, publishedUrl: published, formId: form.getId() };
}

/** একটি মাইলস্টোন কার্ডের ২টি প্রশ্ন যোগ করে (সংখ্যা + কাজের নাম) */
function addMilestone(form, no, required) {
  form.addTextItem()
    .setTitle('মাইলস্টোন ' + no + ' — সংখ্যা')
    .setHelpText('যেমন: 597+ / 1,200+ / 85+')
    .setValidation(
      FormApp.createTextValidation()
        .setHelpText('সংখ্যা লিখুন, প্রয়োজনে শেষে + দিন (যেমন 597+)')
        .requireTextMatchesPattern('^[0-9][0-9,]*\\+?$')
        .build()
    )
    .setRequired(required);

  form.addTextItem()
    .setTitle('মাইলস্টোন ' + no + ' — কী কাজ')
    .setHelpText('যেমন: Veneers & Laminates / Complex Root Canals / Braces Cases')
    .setRequired(required);
}
