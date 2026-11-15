/**
 * Tech Dental Care — Doctor Profile Form (MINIMAL VERSION)
 * সবচেয়ে সহজ, ছোট কোড — শুধু ফর্মটা বানায়, ভ্যালিডেশন নেই।
 *
 * 1. https://script.google.com/home/projects/create
 * 2. Code.gs-এর সব মুছে এই কোড পেস্ট করুন
 * 3. Ctrl+S (Save)
 * 4. পেজ রিফ্রেশ করুন → উপরে ফাংশন লিস্টে createForm দেখাবে
 * 5. Run → Allow → View → Logs (Ctrl+Enter) এ লিংক দেখুন
 */
function createForm() {
  var form = FormApp.create('Tech Dental Care — ডাক্তার প্রোফাইল তথ্য ফর্ম');
  form.setDescription('প্রিয় ডাক্তার সাহেব, ওয়েবসাইটের প্রোফাইলের জন্য নিচের তথ্যগুলো দিন। সময় লাগবে ৫–৭ মিনিট। ছবি আপলোডে সমস্যা হলে WhatsApp: 01400786162');
  form.setCollectEmail(true);
  form.setProgressBar(true);

  form.addPageBreakItem().setTitle('১. ব্যক্তিগত তথ্য');

  form.addTextItem().setTitle('পুরো নাম (Full Name)')
    .setHelpText('যেমন: Dr. Aysha Siddika').setRequired(true);

  form.addTextItem().setTitle('মোবাইল / WhatsApp নম্বর')
    .setHelpText('যেমন: 01712345678').setRequired(true);

  form.addListItem().setTitle('ব্রাঞ্চ')
    .setChoiceValues(['Mirpur', 'Badda', 'Uttara', 'Jatrabari']).setRequired(true);

  form.addTextItem().setTitle('পদবি (Designation)')
    .setHelpText('যেমন: Dental Surgeon at Tech Dental, Mirpur Branch').setRequired(true);

  form.addTextItem().setTitle('BMDC রেজিস্ট্রেশন নম্বর')
    .setHelpText('যেমন: 7897').setRequired(true);

  form.addPageBreakItem().setTitle('২. শিক্ষা ও অভিজ্ঞতা');

  form.addParagraphTextItem().setTitle('ডিগ্রি (Degree)')
    .setHelpText('যেমন: BDS, PGT (Oral & Maxillofacial Surgery)').setRequired(true);

  form.addParagraphTextItem().setTitle('বিশেষত্ব / Expertise')
    .setHelpText('কমা দিয়ে আলাদা করুন, যেমন: Dental Filling, Root Canal, Crown & Bridge').setRequired(true);

  form.addTextItem().setTitle('মোট অভিজ্ঞতা (বছর)')
    .setHelpText('শুধু সংখ্যা, যেমন: 8').setRequired(true);

  form.addTextItem().setTitle('চিকিৎসা দেওয়া রোগীর সংখ্যা')
    .setHelpText('শুধু সংখ্যা, যেমন: 2858').setRequired(true);

  form.addParagraphTextItem().setTitle('সংক্ষিপ্ত পরিচিতি (Short Bio)')
    .setHelpText('৩–৫ বাক্য, তৃতীয় পুরুষে (Dr. ... is an experienced ...)').setRequired(true);

  form.addPageBreakItem().setTitle('৩. চেম্বার ও সময়');

  form.addTextItem().setTitle('চেম্বারের নাম')
    .setHelpText('যেমন: Tech Dental Care (Mirpur Branch)').setRequired(true);

  form.addParagraphTextItem().setTitle('চেম্বারের সম্পূর্ণ ঠিকানা').setRequired(true);

  form.addTextItem().setTitle('রোগী দেখার সময়')
    .setHelpText('যেমন: 4.00PM – 9.00PM').setRequired(true);

  form.addTextItem().setTitle('সাপ্তাহিক বন্ধের দিন (থাকলে)');

  form.addTextItem().setTitle('যোগাযোগের হটলাইন')
    .setHelpText('সাধারণত 09638000505');

  form.addPageBreakItem().setTitle('৪. উল্লেখযোগ্য কাজ (Milestones)');

  form.addTextItem().setTitle('মাইলস্টোন ১ — সংখ্যা').setHelpText('যেমন: 597+');
  form.addTextItem().setTitle('মাইলস্টোন ১ — কী কাজ').setHelpText('যেমন: Veneers & Laminates');
  form.addTextItem().setTitle('মাইলস্টোন ২ — সংখ্যা');
  form.addTextItem().setTitle('মাইলস্টোন ২ — কী কাজ');
  form.addTextItem().setTitle('মাইলস্টোন ৩ — সংখ্যা');
  form.addTextItem().setTitle('মাইলস্টোন ৩ — কী কাজ');

  form.addPageBreakItem().setTitle('৫. ছবি ও অনুমতি');

  form.addFileUploadItem().setTitle('পোর্ট্রেট ছবি আপলোড করুন')
    .setHelpText('সাদা ব্যাকগ্রাউন্ড, মিনিমাম ৮০০×১০০০ px, ওয়াটারমার্ক ছাড়া, সর্বোচ্চ ২টি ছবি। Google অ্যাকাউন্ট লাগবে; সমস্যা হলে WhatsApp: 01400786162')
    .setRequired(true);

  form.addCheckboxItem().setTitle('অনুমতি')
    .setChoiceValues(['আমি সম্মতি দিচ্ছি যে আমার তথ্য ও ছবি Tech Dental Care-এর ওয়েবসাইট ও মার্কেটিং কনটেন্টে প্রকাশ করা যাবে।'])
    .setRequired(true);

  var url = form.getPublishedUrl();
  Logger.log('FORM LINK : ' + url);
  Logger.log('SHORT LINK: ' + form.shortenFormUrl(url));
  Logger.log('EDIT LINK : ' + form.getEditUrl());
}
