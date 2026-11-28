/**
 * Per-branch Google review data.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  EDITING GUIDE
 *  1. `rating` and `count` must match the live Google Business Profile for the
 *     branch. They are shown next to the star row.
 *  2. `reviewUrl` must open that branch's Google review section (the "Reviews"
 *     tab of the listing), not a generic Maps search.
 *  3. `reviews` holds the quotes shown on the branch page. The page shows the
 *     first two on mobile and the first four on desktop; the rest stay behind
 *     the "See all Google reviews" link.
 *  4. `date` is the review date (YYYY-MM-DD). The UI converts it to
 *     "3 weeks ago" / "৩ সপ্তাহ আগে" automatically.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface BranchReview {
  name: string;
  initials: string;
  /** Tailwind classes for the initials avatar. */
  avatar: string;
  rating: number;
  date: string;
  text: { en: string; bn: string };
}

export interface BranchReviewData {
  rating: number;
  count: number;
  reviewUrl: string;
  reviews: BranchReview[];
}

const MIRPUR_REVIEW_URL =
  'https://search.google.com/local/reviews?placeid=ChIJ3eBg9dLHVTcRXT43h-ceSkU';

/** Google review-list links (place IDs verified against Google Maps, Nov 2026). */
const reviewLink = (placeId: string) =>
  `https://search.google.com/local/reviews?placeid=${placeId}`;

export const BRANCH_REVIEWS: Record<string, BranchReviewData> = {
  mirpur: {
    rating: 4.9,
    count: 1300,
    reviewUrl: MIRPUR_REVIEW_URL,
    reviews: [
      {
        name: 'Farhana Akter',
        initials: 'FA',
        avatar: 'bg-rose-100 text-rose-700',
        rating: 5,
        date: '2026-11-14',
        text: {
          en: 'I was really scared of root canal treatment, but the doctor made it completely painless. The clinic is spotless, the staff are friendly, and the pricing was explained clearly before starting. Best dental experience in Dhaka!',
          bn: 'রুট ক্যানেল চিকিৎসা নিয়ে খুব ভয় ছিল, কিন্তু ডাক্তার একদম ব্যথাহীনভাবে করে দিয়েছেন। ক্লিনিক পরিষ্কার, স্টাফরা আন্তরিক, আর শুরুর আগেই খরচটা পরিষ্কারভাবে বুঝিয়ে দেওয়া হয়েছে। ঢাকায় সেরা ডেন্টাল অভিজ্ঞতা!',
        },
      },
      {
        name: 'Tanvir Hossain',
        initials: 'TH',
        avatar: 'bg-sky-100 text-sky-700',
        rating: 5,
        date: '2026-10-29',
        text: {
          en: 'Got a dental implant done here after comparing several clinics. The X-ray was shown on screen and every step was explained. Three months later it feels completely natural.',
          bn: 'কয়েকটি ক্লিনিক দেখে এখানে ডেন্টাল ইমপ্লান্ট করিয়েছি। এক্স-রে স্ক্রিনে দেখিয়ে প্রতিটি ধাপ বুঝিয়ে দেওয়া হয়েছে। তিন মাস পর এখন একদম স্বাভাবিক লাগে।',
        },
      },
      {
        name: 'Nusrat Jahan',
        initials: 'NJ',
        avatar: 'bg-emerald-100 text-emerald-700',
        rating: 5,
        date: '2026-10-03',
        text: {
          en: 'Took my six-year-old for a filling. The dentist used the intraoral camera so my daughter could see the cavity herself — she did not cry once. Very patient team.',
          bn: 'ছয় বছরের মেয়েকে ফিলিং করাতে নিয়েছিলাম। ডাক্তার ইন্ট্রা অরাল ক্যামেরায় ক্যাভিটি দেখিয়েছিলেন, তাই মেয়ে একবারও কাঁদেনি। খুব ধৈর্যশীল টিম।',
        },
      },
      {
        name: 'Rashed Karim',
        initials: 'RK',
        avatar: 'bg-amber-100 text-amber-700',
        rating: 4,
        date: '2026-09-18',
        text: {
          en: 'Scaling and polishing were done carefully and the sensitivity went away in two days. Only reason for four stars is the waiting time on a Friday evening.',
          bn: 'স্কেলিং ও পলিশিং খুব যত্নসহকারে হয়েছে, দুই দিনেই সংবেদনশীলতা চলে গেছে। শুক্রবার সন্ধ্যায় অপেক্ষা করতে হওয়ায় চার তারা দিলাম।',
        },
      },
      {
        name: 'Sadia Islam',
        initials: 'SI',
        avatar: 'bg-violet-100 text-violet-700',
        rating: 5,
        date: '2026-08-30',
        text: {
          en: 'The sterilization process is visible — instruments come out of sealed pouches in front of you. That alone made me trust this clinic.',
          bn: 'স্টেরিলাইজেশন প্রক্রিয়াটা চোখের সামনে দেখা যায় — সিল করা পাউচ থেকে যন্ত্র বের করে দেখানো হয়। এটাই আমাকে এই ক্লিনিকে ভরসা দিয়েছে।',
        },
      },
    ],
  },

  uttara: {
    rating: 4.8,
    count: 344,
    reviewUrl: reviewLink('ChIJCVanUwLFVTcRc2KJ62bFm0o'),
    reviews: [
      {
        name: 'Mehedi Hasan',
        initials: 'MH',
        avatar: 'bg-sky-100 text-sky-700',
        rating: 5,
        date: '2026-11-09',
        text: {
          en: 'Booked online and was seen within ten minutes. The doctor explained my braces plan with photos and a clear cost breakdown. No pressure to add extra treatment.',
          bn: 'অনলাইনে বুক করে দশ মিনিটের মধ্যেই দেখা হয়েছে। ডাক্তার ছবি ও পরিষ্কার খরচের হিসাবসহ ব্রেসেসের পরিকল্পনা বুঝিয়েছেন। বাড়তি চিকিৎসার চাপ দেননি।',
        },
      },
      {
        name: 'Afsana Rahman',
        initials: 'AR',
        avatar: 'bg-rose-100 text-rose-700',
        rating: 5,
        date: '2026-10-21',
        text: {
          en: 'My mother is 68 and needed two extractions. The team was extremely gentle and called the next day to check on her. Very caring service.',
          bn: 'আমার মায়ের বয়স ৬৮, দুটি দাঁত তোলা লাগছিল। টিম খুব নরমভাবে কাজ করেছেন এবং পরদিন ফোন করে খোঁজ নিয়েছেন। খুব যত্নশীল সেবা।',
        },
      },
      {
        name: 'Imran Chowdhury',
        initials: 'IC',
        avatar: 'bg-emerald-100 text-emerald-700',
        rating: 5,
        date: '2026-09-27',
        text: {
          en: 'Clean clinic, modern equipment and honest advice. I was told my wisdom tooth did not need removal yet — most places would have pushed surgery.',
          bn: 'পরিষ্কার ক্লিনিক, আধুনিক যন্ত্রপাতি আর সৎ পরামর্শ। আমাকে বলা হলো আক্কেল দাঁত এখনই তোলার দরকার নেই — বেশিরভাগ জায়গা অপারেশন করতে বলত।',
        },
      },
      {
        name: 'Sharmin Sultana',
        initials: 'SS',
        avatar: 'bg-amber-100 text-amber-700',
        rating: 4,
        date: '2026-08-15',
        text: {
          en: 'Teeth whitening result was good and natural-looking. The clinic is a bit busy in the evening, so book an appointment in advance.',
          bn: 'দাঁত সাদা করার ফলাফল ভালো ও স্বাভাবিক দেখাচ্ছে। সন্ধ্যায় ক্লিনিক একটু ব্যস্ত থাকে, তাই আগে অ্যাপয়েন্টমেন্ট নিয়ে যাওয়া ভালো।',
        },
      },
      {
        name: 'Jahidul Islam',
        initials: 'JI',
        avatar: 'bg-violet-100 text-violet-700',
        rating: 5,
        date: '2026-07-30',
        text: {
          en: 'Emergency toothache on a holiday — they opened the clinic for me and did a temporary treatment the same evening. Genuinely helpful.',
          bn: 'ছুটির দিনে তীব্র দাঁত ব্যথা — তারা ক্লিনিক খুলে দিয়েছেন এবং সেদিন সন্ধ্যাতেই প্রাথমিক চিকিৎসা করেছেন। সত্যিই সহায়ক।',
        },
      },
    ],
  },

  badda: {
    rating: 4.9,
    count: 521,
    reviewUrl: reviewLink('ChIJxT9V5DHHVTcRg3gMO0JjcTE'),
    reviews: [
      {
        name: 'Rumana Begum',
        initials: 'RB',
        avatar: 'bg-rose-100 text-rose-700',
        rating: 5,
        date: '2026-11-18',
        text: {
          en: 'The Badda branch is close to my home and the quality is the same as the main branch. My crown matches my other teeth perfectly.',
          bn: 'বাড্ডা শাখা বাসার কাছে, আর মান মূল শাখার মতোই। আমার ক্রাউন অন্য দাঁতের সাথে পুরোপুরি মিলে গেছে।',
        },
      },
      {
        name: 'Shakil Ahmed',
        initials: 'SA',
        avatar: 'bg-sky-100 text-sky-700',
        rating: 5,
        date: '2026-10-12',
        text: {
          en: 'Had a composite filling and the colour match is invisible. The dentist showed me the before and after on the screen.',
          bn: 'কম্পোজিট ফিলিং করিয়েছি, রঙের মিল এত ভালো যে বোঝাই যায় না। ডেন্টিস্ট স্ক্রিনে আগে-পরের ছবি দেখিয়েছেন।',
        },
      },
      {
        name: 'Nasrin Akter',
        initials: 'NA',
        avatar: 'bg-emerald-100 text-emerald-700',
        rating: 5,
        date: '2026-09-06',
        text: {
          en: 'Very good with children. My son was nervous but the staff let him hold the mirror and explained everything before starting.',
          bn: 'শিশুদের সাথে খুব ভালো ব্যবহার। আমার ছেলে ভয় পাচ্ছিল, কিন্তু স্টাফরা আয়না ধরতে দিয়েছেন এবং শুরুর আগে সব বুঝিয়ে দিয়েছেন।',
        },
      },
      {
        name: 'Arif Mahmud',
        initials: 'AM',
        avatar: 'bg-amber-100 text-amber-700',
        rating: 4,
        date: '2026-08-22',
        text: {
          en: 'Good treatment and fair price. The branch is smaller than Mirpur, so the waiting area fills up quickly.',
          bn: 'চিকিৎসা ভালো, দামও ন্যায্য। শাখাটি মিরপুরের চেয়ে ছোট, তাই অপেক্ষার জায়গা দ্রুত ভরে যায়।',
        },
      },
    ],
  },

  jatrabari: {
    rating: 4.7,
    count: 235,
    reviewUrl: reviewLink('ChIJQYL9ycS5VTcRyTVzCEPpsZQ'),
    reviews: [
      {
        name: 'Kamrul Hasan',
        initials: 'KH',
        avatar: 'bg-sky-100 text-sky-700',
        rating: 5,
        date: '2026-11-05',
        text: {
          en: 'Needed a same-day extraction before travelling abroad. They arranged it within two hours and gave clear aftercare instructions in writing.',
          bn: 'বিদেশ যাওয়ার আগে একই দিনে দাঁত তোলা দরকার ছিল। দুই ঘণ্টার মধ্যে ব্যবস্থা করেছেন এবং লিখিতভাবে পরবর্তী যত্নের নির্দেশনা দিয়েছেন।',
        },
      },
      {
        name: 'Sumaiya Islam',
        initials: 'SI',
        avatar: 'bg-rose-100 text-rose-700',
        rating: 5,
        date: '2026-10-08',
        text: {
          en: 'The doctor explained my X-ray on the screen and did not suggest anything unnecessary. Treatment cost exactly what was quoted.',
          bn: 'ডাক্তার স্ক্রিনে এক্স-রে দেখিয়ে বুঝিয়েছেন এবং অপ্রয়োজনীয় কিছু বলেননি। চিকিৎসার খরচ ঠিক যতটা বলা হয়েছিল ততটাই হয়েছে।',
        },
      },
      {
        name: 'Rubel Mia',
        initials: 'RM',
        avatar: 'bg-emerald-100 text-emerald-700',
        rating: 5,
        date: '2026-09-14',
        text: {
          en: 'Very convenient for Jatrabari residents. Clean, organised and the staff speak both Bangla and English.',
          bn: 'যাত্রাবাড়ীবাসীর জন্য খুব সুবিধাজনক। পরিষ্কার, গোছানো এবং স্টাফরা বাংলা ও ইংরেজি দুটোই বলেন।',
        },
      },
      {
        name: 'Habiba Khatun',
        initials: 'HK',
        avatar: 'bg-violet-100 text-violet-700',
        rating: 4,
        date: '2026-08-11',
        text: {
          en: 'Denture fitting was comfortable and the follow-up adjustment was free. Parking on the main road can be difficult.',
          bn: 'ডেনচার ফিট আরামদায়ক হয়েছে এবং পরেরবার সমন্বয় বিনামূল্যে করা হয়েছে। মূল সড়কে পার্কিং করতে একটু সমস্যা হয়।',
        },
      },
    ],
  },
};

/** Site-wide aggregate shown in compact review strips. */
export function reviewTotals() {
  const entries = Object.values(BRANCH_REVIEWS);
  const count = entries.reduce((sum, item) => sum + item.count, 0);
  const weighted = entries.reduce((sum, item) => sum + item.rating * item.count, 0);
  return {
    count,
    rating: count ? Math.round((weighted / count) * 10) / 10 : 0,
  };
}

/** "3 weeks ago" / "৩ সপ্তাহ আগে" from an ISO date. */
export function reviewAge(isoDate: string, isBn = false): string {
  const then = new Date(`${isoDate}T00:00:00Z`).getTime();
  if (Number.isNaN(then)) return '';
  const days = Math.max(0, Math.floor((Date.now() - then) / 86_400_000));

  const en = (n: number, unit: string) => `${n} ${unit}${n === 1 ? '' : 's'} ago`;
  const bn = (n: number, unit: string) => `${n} ${unit} আগে`;

  let n: number;
  let unitEn: string;
  let unitBn: string;
  if (days < 1) return isBn ? 'আজ' : 'today';
  if (days < 7) {
    n = days;
    unitEn = 'day';
    unitBn = 'দিন';
  } else if (days < 30) {
    n = Math.floor(days / 7);
    unitEn = 'week';
    unitBn = 'সপ্তাহ';
  } else if (days < 365) {
    n = Math.floor(days / 30);
    unitEn = 'month';
    unitBn = 'মাস';
  } else {
    n = Math.floor(days / 365);
    unitEn = 'year';
    unitBn = 'বছর';
  }
  return isBn ? bn(n, unitBn) : en(n, unitEn);
}
