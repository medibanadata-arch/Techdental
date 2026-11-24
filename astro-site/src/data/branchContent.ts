/**
 * Branch page extras that are not part of the branch SEO body stored in the
 * database: the doctor-team introduction shown above "More About", the
 * price-free treatment-cost copy, and the patient video review playlist.
 *
 * Keeping these here lets the Laravel/legacy and Astro branch views share the
 * exact same copy without duplicating it inside `locations.seo_content`.
 */

export type BranchLang = 'en' | 'bn';

export type LocalizedText = Record<BranchLang, string>;

export interface BranchContent {
  /** Paragraph shown directly below the doctor cards. */
  team: LocalizedText;
  /** More About section: price-free cost/SEO copy (HTML). */
  cost: LocalizedText;
  /** Patient video review section heading and intro. */
  reviews: Record<BranchLang, { title: string; intro: string }>;
  /** Bangla/English meta used by the branch page when the locale changes. */
  seo: Record<BranchLang, { title: string; description: string }>;
}

const COST_CLOSING_EN = 'Call 09638-000505 or book an appointment online for an accurate, no-obligation estimate.';
const COST_CLOSING_BN = 'সঠিক ও বিনামূল্যে ধারণা পেতে ০৯৬৩৮-০০০৫০৫ নম্বরে কল করুন অথবা অনলাইনে অ্যাপয়েন্টমেন্ট বুক করুন।';

function costEn(branch: string, chamber: string, areas: string): string {
  return `<h2>Dental Treatment Cost in ${branch} — Clear Pricing, No Hidden Charges</h2>
<p>Cost is one of the first things patients ask about, so we keep it simple. At Tech Dental ${branch}, every treatment plan is explained in detail before it begins — the consultation, any digital X-ray, the procedure itself and the follow-up visits — so you know exactly what is included.</p>
<p>The final estimate depends on the tooth, the material you choose and how complex the case is. A single filling is very different from a full smile makeover or an implant. After a short examination, our dentist gives you a written plan with the exact cost, the available alternatives and the number of visits required.</p>
<p>We keep our pricing transparent and can stage larger treatments over time so they fit your budget. Patients come to our ${chamber} chamber from ${areas}. ${COST_CLOSING_EN}</p>`;
}

function costBn(branchLocative: string, chamber: string, areas: string): string {
  return `<h2>${branchLocative} দাঁতের চিকিৎসার খরচ — স্বচ্ছ মূল্য, কোনো লুকানো চার্জ নেই</h2>
<p>চিকিৎসার খরচ নিয়ে দুশ্চিন্তা থাকা স্বাভাবিক। তাই টেক ডেন্টাল ${branchLocative} চিকিৎসা শুরুর আগেই পুরো পরিকল্পনা বিস্তারিতভাবে বুঝিয়ে দেওয়া হয় — কনসালটেশন, প্রয়োজনে ডিজিটাল এক্স-রে, মূল চিকিৎসা এবং ফলো-আপ — কী কী অন্তর্ভুক্ত তা স্পষ্টভাবে জানানো হয়।</p>
<p>চূড়ান্ত খরচ নির্ভর করে দাঁতের অবস্থা, ব্যবহৃত উপকরণ এবং চিকিৎসার জটিলতার ওপর। একটি সাধারণ ফিলিং আর পূর্ণাঙ্গ স্মাইল মেকওভার বা ইমপ্ল্যান্টের খরচ স্বাভাবিকভাবেই আলাদা। সংক্ষিপ্ত পরীক্ষার পর আমাদের ডেন্টিস্ট লিখিত পরিকল্পনায় সঠিক খরচ, বিকল্প এবং কতবার আসতে হবে তা জানিয়ে দেন।</p>
<p>আমরা সবসময় স্বচ্ছ মূল্য রাখি এবং বড় চিকিৎসা কয়েক ধাপে ভাগ করে নেওয়ার সুযোগ দিই, যাতে আপনার বাজেটের সঙ্গে সহজে মিলে যায়। ${chamber} চেম্বারে ${areas} থেকে রোগীরা আসেন। ${COST_CLOSING_BN}</p>`;
}

export const branchContent: Record<string, BranchContent> = {
  mirpur: {
    team: {
      en:
        'Our Mirpur branch is powered by some of the most experienced and qualified dental specialists in Dhaka. Our specialists offer a comprehensive range of dental treatments, including preventive care, restorative dentistry, cosmetic procedures and orthodontics. Are you looking for the best dentist in Mirpur? Check our doctor list for Mirpur 10, 11, 12, 14, Kazipara and Agargaon areas.',
      bn:
        'ঢাকার সবচেয়ে অভিজ্ঞ আর দক্ষ ডেন্টিস্টদের নিয়েই সাজানো হয়েছে আমাদের টেক ডেন্টাল-এর মিরপুর টিম। আমরা বিশ্বাস করি, সুন্দর একটা হাসি মানুষের আত্মবিশ্বাস বাড়িয়ে দেয় বহুগুণ। তাই দাঁতের নিয়মিত চেকআপ থেকে শুরু করে ফিলিং, হাসির উজ্জ্বলতা বাড়ানো কিংবা আঁকাবাঁকা দাঁত সোজা করা—সব ধরনের আধুনিক চিকিৎসাই আমরা দিই অত্যন্ত যত্নের সঙ্গে। আপনি কি মিরপুর ১০, ১১, ১২, ১৪ কিংবা কাজীপাড়া ও আগারগাঁও এলাকায় ভালো কোনো ডেন্টিস্ট খুঁজছেন? তাহলে নির্দ্বিধায় আমাদের এই অভিজ্ঞ ডাক্তারদের তালিকাটি একবার দেখে নিতে পারেন। আপনার দাঁতের সুরক্ষায় আমরা আছি আপনার পাশেই!',
    },
    cost: {
      en: costEn('Mirpur', 'Shewrapara', 'Mirpur 1–14, DOHS, Kazipara, Shewrapara, Agargaon and Kafrul'),
      bn: costBn('মিরপুরে', 'শেওড়াপাড়া', 'মিরপুর ১–১৪, ডিওএইচএস, কাজীপাড়া, শেওড়াপাড়া, আগারগাঁও ও কাফরুল'),
    },
    reviews: {
      en: {
        title: 'Patient Video Reviews',
        intro:
          'Hear it directly from our patients. These short videos were recorded at our chambers and show real experiences with root canals, braces, extractions and smile makeovers at Tech Dental Care.',
      },
      bn: {
        title: 'রোগীদের ভিডিও রিভিউ',
        intro:
          'সরাসরি আমাদের রোগীদের মুখ থেকেই শুনে নিন। টেক ডেন্টাল কেয়ারের চেম্বারে ধারণ করা এই ছোট ভিডিওগুলোতে রুট ক্যানেল, ব্রেসেস, দাঁত তোলা ও স্মাইল মেকওভারের বাস্তব অভিজ্ঞতা দেখতে পাবেন।',
      },
    },
    seo: {
      en: {
        title: 'Best Dental Clinic in Mirpur, Dhaka — Tech Dental Care',
        description:
          'Tech Dental Mirpur in Shewrapara — painless root canal, dental implants, braces & scaling near Metro Rail Pillar 318. Open Sat–Thu, 10 AM–9 PM.',
      },
      bn: {
        title: 'মিরপুরে সেরা ডেন্টাল ক্লিনিক ও ডেন্টিস্ট — টেক ডেন্টাল কেয়ার',
        description:
          'শেওড়াপাড়া (মেট্রো পিলার ৩১৮) অবস্থিত টেক ডেন্টাল মিরপুর শাখায় ব্যথামুক্ত রুট ক্যানেল, ডেন্টাল ইমপ্ল্যান্ট, ব্রেসেস ও স্কেলিং। শনি–বৃহস্পতি সকাল ১০টা–রাত ৯টা।',
      },
    },
  },
  uttara: {
    team: {
      en:
        'Our Uttara team brings together some of the most experienced and qualified dental specialists in Dhaka. From preventive check-ups and fillings to braces, implants and smile makeovers, every treatment is delivered under one roof with a gentle, patient-first approach. If you are looking for a trusted dentist in Uttara Sector 1–18, Khilkhet, Nikunja or the Airport area, our doctors are ready to help.',
      bn:
        'ঢাকার সবচেয়ে অভিজ্ঞ আর দক্ষ ডেন্টিস্টদের নিয়েই সাজানো হয়েছে আমাদের টেক ডেন্টাল-এর উত্তরা টিম। আমরা বিশ্বাস করি, সুন্দর একটা হাসি মানুষের আত্মবিশ্বাস বাড়িয়ে দেয় বহুগুণ। তাই নিয়মিত চেকআপ, ফিলিং, ব্রেসেস, ইমপ্ল্যান্ট কিংবা হাসির সৌন্দর্যবর্ধন—সব ধরনের আধুনিক চিকিৎসাই আমরা দিই অত্যন্ত যত্নের সঙ্গে। উত্তরা সেক্টর ১–১৮, খিলক্ষেত, নিকুঞ্জ বা এয়ারপোর্ট এলাকায় ভালো ডেন্টিস্ট খুঁজলে নির্দ্বিধায় আমাদের ডাক্তারদের তালিকাটি দেখে নিন।',
    },
    cost: {
      en: costEn('Uttara', 'Akash Plaza, Sector 9', 'Uttara 1–18, Khilkhet, Nikunja, Airport and Bashundhara R/A'),
      bn: costBn('উত্তরায়', 'আকাশ প্লাজা, সেক্টর ৯', 'উত্তরা ১–১৮, খিলক্ষেত, নিকুঞ্জ, এয়ারপোর্ট ও বসুন্ধরা আবাসিক এলাকা'),
    },
    reviews: {
      en: {
        title: 'Patient Video Reviews',
        intro:
          'Hear it directly from our patients. These short videos were recorded at our chambers and show real experiences with root canals, braces, extractions and smile makeovers at Tech Dental Care.',
      },
      bn: {
        title: 'রোগীদের ভিডিও রিভিউ',
        intro:
          'সরাসরি আমাদের রোগীদের মুখ থেকেই শুনে নিন। টেক ডেন্টাল কেয়ারের চেম্বারে ধারণ করা এই ছোট ভিডিওগুলোতে রুট ক্যানেল, ব্রেসেস, দাঁত তোলা ও স্মাইল মেকওভারের বাস্তব অভিজ্ঞতা দেখতে পাবেন।',
      },
    },
    seo: {
      en: {
        title: 'Best Dental Clinic in Uttara, Dhaka — Tech Dental Care',
        description:
          'Tech Dental Uttara at Akash Plaza, Sector 9 — braces, implants, root canal and children’s dentistry for Uttara, Khilkhet and Nikunja. Open Sat–Thu, 4–9 PM.',
      },
      bn: {
        title: 'উত্তরায় সেরা ডেন্টাল ক্লিনিক ও ডেন্টিস্ট — টেক ডেন্টাল কেয়ার',
        description:
          'উত্তরা সেক্টর ৯-এর আকাশ প্লাজায় টেক ডেন্টাল উত্তরী শাখায় ব্রেসেস, ইমপ্ল্যান্ট, রুট ক্যানেল ও শিশুদের দন্তচিকিৎসা। শনি–বৃহস্পতি বিকাল ৪টা–রাত ৯টা।',
      },
    },
  },
  badda: {
    team: {
      en:
        'Our Badda team is made up of experienced, BMDC-registered dentists who treat every patient with care and precision. From routine check-ups and scaling to braces, implants and cosmetic dentistry, we offer complete modern dental care under one roof. Patients visit us from Badda, Rampura, Merul Badda, Gulshan, Banani, Aftabnagar and Bashundhara R/A.',
      bn:
        'ঢাকার সবচেয়ে অভিজ্ঞ আর দক্ষ ডেন্টিস্টদের নিয়েই সাজানো হয়েছে আমাদের টেক ডেন্টাল-এর বাড্ডা টিম। আমরা বিশ্বাস করি, সুন্দর একটা হাসি মানুষের আত্মবিশ্বাস বাড়িয়ে দেয় বহুগুণ। তাই নিয়মিত চেকআপ, স্কেলিং, ফিলিং, ব্রেসেস, ইমপ্ল্যান্ট কিংবা কসমেটিক ডেন্টিস্ট্রি—সব ধরনের আধুনিক চিকিৎসাই আমরা দিই অত্যন্ত যত্নের সঙ্গে। বাড্ডা, রামপুরা, মেরুল বাড্ডা, গুলশান, বনানী, আফতাবনগর ও বসুন্ধরা থেকে রোগীরা আমাদের কাছে আসেন।',
    },
    cost: {
      en: costEn('Badda', 'North Badda Bazar', 'Badda, Rampura, Merul Badda, Gulshan, Banani, Aftabnagar and Bashundhara R/A'),
      bn: costBn('বাড্ডায়', 'উত্তর বাড্ডা বাজার', 'বাড্ডা, রামপুরা, মেরুল বাড্ডা, গুলশান, বনানী, আফতাবনগর ও বসুন্ধরা আবাসিক এলাকা'),
    },
    reviews: {
      en: {
        title: 'Patient Video Reviews',
        intro:
          'Hear it directly from our patients. These short videos were recorded at our chambers and show real experiences with root canals, braces, extractions and smile makeovers at Tech Dental Care.',
      },
      bn: {
        title: 'রোগীদের ভিডিও রিভিউ',
        intro:
          'সরাসরি আমাদের রোগীদের মুখ থেকেই শুনে নিন। টেক ডেন্টাল কেয়ারের চেম্বারে ধারণ করা এই ছোট ভিডিওগুলোতে রুট ক্যানেল, ব্রেসেস, দাঁত তোলা ও স্মাইল মেকওভারের বাস্তব অভিজ্ঞতা দেখতে পাবেন।',
      },
    },
    seo: {
      en: {
        title: 'Best Dental Clinic in Badda, Dhaka — Tech Dental Care',
        description:
          'Tech Dental Badda at North Badda Bazar — root canal, implants, braces and scaling for Badda, Rampura and Gulshan. Open Sat–Thu, 10 AM–9 PM.',
      },
      bn: {
        title: 'বাড্ডায় সেরা ডেন্টাল ক্লিনিক ও ডেন্টিস্ট — টেক ডেন্টাল কেয়ার',
        description:
          'উত্তর বাড্ডা বাজারে টেক ডেন্টাল বাড্ডা শাখায় রুট ক্যানেল, ইমপ্ল্যান্ট, ব্রেসেস ও স্কেলিং। বাড্ডা, রামপুরা ও গুলশানের জন্য শনি–বৃহস্পতি সকাল ১০টা–রাত ৯টা।',
      },
    },
  },
  jatrabari: {
    team: {
      en:
        'Our Jatrabari team combines senior specialists and caring support staff who make every visit calm and comfortable. Root canals, crowns, braces, implants and smile makeovers are all available in one chamber with modern sterilisation and digital diagnostics. Patients travel to us from Jatrabari, Chowrasta, Shanir Akhra, Dholaipar and the Mayor Hanif Flyover area.',
      bn:
        'ঢাকার সবচেয়ে অভিজ্ঞ আর দক্ষ ডেন্টিস্টদের নিয়েই সাজানো হয়েছে আমাদের টেক ডেন্টাল-এর যাত্রাবাড়ী টিম। আমরা বিশ্বাস করি, সুন্দর একটা হাসি মানুষের আত্মবিশ্বাস বাড়িয়ে দেয় বহুগুণ। তাই রুট ক্যানেল, ক্রাউন, ব্রেসেস, ইমপ্ল্যান্ট কিংবা স্মাইল মেকওভার—সব ধরনের আধুনিক চিকিৎসাই আমরা দিই অত্যন্ত যত্নের সঙ্গে। যাত্রাবাড়ী, চৌরাস্তা, শনির আখড়া, ধোলাইপাড় ও মেয়র হানিফ ফ্লাইওভার এলাকা থেকে রোগীরা আমাদের কাছে আসেন।',
    },
    cost: {
      en: costEn('Jatrabari', 'Shahid Faruk Road', 'Jatrabari, Chowrasta, Shanir Akhra, Dholaipar and the Mayor Hanif Flyover area'),
      bn: costBn('যাত্রাবাড়ীতে', 'শহীদ ফারুক সড়ক', 'যাত্রাবাড়ী, চৌরাস্তা, শনির আখড়া, ধোলাইপাড় ও মেয়র হানিফ ফ্লাইওভার এলাকা'),
    },
    reviews: {
      en: {
        title: 'Patient Video Reviews',
        intro:
          'Hear it directly from our patients. These short videos were recorded at our chambers and show real experiences with root canals, braces, extractions and smile makeovers at Tech Dental Care.',
      },
      bn: {
        title: 'রোগীদের ভিডিও রিভিউ',
        intro:
          'সরাসরি আমাদের রোগীদের মুখ থেকেই শুনে নিন। টেক ডেন্টাল কেয়ারের চেম্বারে ধারণ করা এই ছোট ভিডিওগুলোতে রুট ক্যানেল, ব্রেসেস, দাঁত তোলা ও স্মাইল মেকওভারের বাস্তব অভিজ্ঞতা দেখতে পাবেন।',
      },
    },
    seo: {
      en: {
        title: 'Best Dental Clinic in Jatrabari, Dhaka — Tech Dental Care',
        description:
          'Tech Dental Jatrabari on Shahid Faruk Road — painless root canal, implants, crowns and braces near Jatrabari Chowrasta. Open Sat–Thu, 3–9 PM.',
      },
      bn: {
        title: 'যাত্রাবাড়ীতে সেরা ডেন্টাল ক্লিনিক ও ডেন্টিস্ট — টেক ডেন্টাল কেয়ার',
        description:
          'শহীদ ফারুক সড়কে টেক ডেন্টাল যাত্রাবাড়ী শাখায় ব্যথামুক্ত রুট ক্যানেল, ইমপ্ল্যান্ট, ক্রাউন ও ব্রেসেস। যাত্রাবাড়ী চৌরাস্তার কাছে শনি–বৃহস্পতি বিকাল ৩টা–রাত ৯টা।',
      },
    },
  },
};

export function getBranchContent(slug: string | undefined | null): BranchContent {
  const key = String(slug || '').toLowerCase().replace(/branch/gi, '').replace(/-/g, '').trim();
  if (branchContent[key]) return branchContent[key];
  const first = Object.keys(branchContent).find((name) => key.includes(name));
  return branchContent[first || 'mirpur'];
}

/** The same patient-review videos are shown on every branch page. */
export const BRANCH_VIDEOS = [
  { id: 'IFyQ6CI01lg', label: { en: 'Patient review 1', bn: 'রোগীর রিভিউ ১' } },
  { id: 'BpEuixW0zNI', label: { en: 'Patient review 2', bn: 'রোগীর রিভিউ ২' } },
  { id: 'LcxdR9q_KXs', label: { en: 'Patient review 3', bn: 'রোগীর রিভিউ ৩' } },
  { id: 'vsFwTf9S6Zw', label: { en: 'Patient review 4', bn: 'রোগীর রিভিউ ৪' } },
  { id: 'vpn1QuwAGRQ', label: { en: 'Patient review 5', bn: 'রোগীর রিভিউ ৫' } },
] as const;

export const FAQ_CATEGORY_ORDER = ['appointments', 'treatments', 'facilities', 'payment', 'general'] as const;

/** Branch place names as they should read in each language. */
export const BRANCH_PLACE_NAMES: Record<string, { en: string; bn: string }> = {
  mirpur: { en: 'Mirpur', bn: 'মিরপুর' },
  uttara: { en: 'Uttara', bn: 'উত্তরা' },
  badda: { en: 'Badda', bn: 'বাড্ডা' },
  jatrabari: { en: 'Jatrabari', bn: 'যাত্রাবাড়ী' },
};

export function getBranchPlaceName(slug: string | undefined | null, lang: 'en' | 'bn', fallback = ''): string {
  const key = String(slug || '').toLowerCase().replace(/branch/gi, '').replace(/-/g, '').trim();
  const match = Object.keys(BRANCH_PLACE_NAMES).find((name) => key.includes(name));
  return match ? BRANCH_PLACE_NAMES[match][lang] : fallback;
}

export const BRANCH_LABELS = {
  en: {
    moreAbout: 'More About Our Dental Clinic in',
    moreAboutFallback: 'More About',
    faq: 'Frequently Asked Questions',
    videoReviews: 'Patient Video Reviews',
    categories: {
      appointments: 'Appointments',
      treatments: 'Treatments',
      facilities: 'Facilities',
      payment: 'Payment',
      general: 'General',
    },
  },
  bn: {
    moreAbout: 'ব্রাঞ্চ সম্পর্কে বিস্তারিত',
    moreAboutFallback: 'আরও জানুন',
    faq: 'সাধারণ জিজ্ঞাসা (FAQ)',
    videoReviews: 'রোগীদের ভিডিও রিভিউ',
    categories: {
      appointments: 'অ্যাপয়েন্টমেন্ট',
      treatments: 'চিকিৎসা',
      facilities: 'সুবিধা',
      payment: 'পেমেন্ট',
      general: 'সাধারণ',
    },
  },
} as const;
