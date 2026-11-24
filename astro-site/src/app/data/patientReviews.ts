/**
 * Genuine Google reviews shown on the doctors index and on the Bangla
 * "Special Offer" price page — both pages carried this widget on the old
 * WordPress site, so the quotes are kept verbatim.
 */

export interface PatientReview {
  name: string;
  /** Colour class for the initials avatar. */
  tone: string;
  text: string;
  reply?: string;
}

export const PATIENT_REVIEWS: PatientReview[] = [
  {
    name: 'Shuvra C.',
    tone: 'bg-rose-100 text-rose-700',
    text: 'Got special care and good behaviour. Thanks Dr. Afsana Haque Joty for good services.',
    reply: "We truly appreciate your feedback! Delighted to know you're satisfied with our service. 🌿",
  },
  {
    name: 'Sayful I.',
    tone: 'bg-sky-100 text-sky-700',
    text:
      'I have taken treatment from Tech Dental for myself, my son and daughter and all my family members, specially Dr. Joty treatment is very good and I feel her approach is sincere. My children have become her fans. Thank you Tech Dental team.',
    reply:
      "Thank you so much for your wonderful feedback! 🌸 We're delighted to know that you and your family are happy with our treatment and care. Dr. Joty and the entire Tech Dental team truly appreciate your trust and kind words. We're always here to take care of your smiles! 😊🦷",
  },
  {
    name: 'MD JAHIDUL I.',
    tone: 'bg-emerald-100 text-emerald-700',
    text:
      "I recently had a root canal done here and I couldn't be more pleased with the experience. From the moment I walked into her office, she made me feel completely at ease. She took the time to explain every step of the procedure, which really helped reduce any anxiety I had. During the root canal itself, Dr. was gentle and professional. She ensured I was comfortable the entire time, and I barely felt any pain! The whole process was much smoother than I anticipated, and the results were perfect. My tooth feels great, and I'm so grateful for her expertise and care. I highly recommend to anyone looking for a skilled and caring dentist. Thank you for such an excellent experience!",
  },
  {
    name: 'anne K.',
    tone: 'bg-amber-100 text-amber-700',
    text: 'I think Dr. Aysha mam is a best dentist in the this branch.',
    reply: 'Thank you so much for your kind words! We’re glad to know you had a great experience with Dr. Aysha. 😊',
  },
  {
    name: 'Ehsanul Siddiq A.',
    tone: 'bg-violet-100 text-violet-700',
    text: 'Best service, professionalism, process, painless surgery, consultancy and most importantly behaviour.',
    reply:
      'Thank you so much for your kind words! 🌟 We’re glad you’re satisfied with our service, professionalism, and care. Your appreciation truly motivates our team to keep providing the best dental experience! 🦷✨',
  },
  {
    name: 'Abu Talha F.',
    tone: 'bg-teal-100 text-teal-700',
    text:
      'I had fillings and wisdom teeth extracted from Tech Dental. The doctors are very professional and friendly. All over the service was amazing. I would recommend Tech Dental.',
  },
  {
    name: 'Lucy L.',
    tone: 'bg-pink-100 text-pink-700',
    text: 'Thank you so much for your juty 🤗',
    reply: 'Thanks for your lovely review! Your satisfaction means a lot to us.',
  },
  {
    name: 'Junaid Khan P.',
    tone: 'bg-indigo-100 text-indigo-700',
    text: 'Friendly environment. Both dentist and staffs are professional.',
  },
  {
    name: 'Rifa Tasnim O.',
    tone: 'bg-lime-100 text-lime-700',
    text: 'Very good service and great treatment. Highly recommended!!',
  },
  {
    name: 'MD Rakibul Hassan M.',
    tone: 'bg-cyan-100 text-cyan-700',
    text: 'Rakibul – Already take the treatment. Hope it will be good.',
  },
  {
    name: 'Lija A.',
    tone: 'bg-fuchsia-100 text-fuchsia-700',
    text: 'Dr. Joty mem onk valo treatment den.',
  },
  {
    name: 'Abu T.',
    tone: 'bg-orange-100 text-orange-700',
    text: 'Treatment was amazing.',
  },
];

export const REVIEWS_COPY = {
  en: {
    eyebrow: 'Patient Stories',
    heading: 'Discover why our patients are smiling!',
    intro:
      'Check out genuine Google reviews from satisfied patients who trust our care.',
    cta: 'Have questions or need help? Get in touch with us today - we\'re here to assist you!',
    owner: 'Response from the owner',
    rating: '4.8',
    count: 'Based on 455 Google reviews',
    book: 'Book an Appointment',
  },
  bn: {
    eyebrow: 'রোগীদের অভিজ্ঞতা',
    heading: 'আমাদের রোগীরা কেন হাসিমুখে ফিরছেন!',
    intro:
      'আমাদের সেবায় সন্তুষ্ট রোগীদের সত্যিকারের গুগল রিভিউগুলো দেখে নিন।',
    cta: 'কোনো প্রশ্ন আছে বা সাহায্য দরকার? আজই আমাদের সাথে যোগাযোগ করুন — আমরা আছি আপনার পাশে!',
    owner: 'প্রতিষ্ঠানের উত্তর',
    rating: '৪.৮',
    count: '৪৫৫টি গুগল রিভিউয়ের ভিত্তিতে',
    book: 'অ্যাপয়েন্টমেন্ট নিন',
  },
} as const;
