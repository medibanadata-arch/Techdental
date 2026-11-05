import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { TopHeader } from '@/components/TopHeader';
import { GlobalFooter } from '@/Components/GlobalFooter';
import { useLanguage } from '@/utils/useLanguage';

interface RightItem {
  id: number;
  text_en: string;
  text_bn?: string | null;
  order: number;
  is_active: boolean;
}

interface ResponsibilityItem {
  id: number;
  title_en: string;
  title_bn?: string | null;
  text_en: string;
  text_bn?: string | null;
  order: number;
  is_active: boolean;
}

interface Settings {
  id?: number;
  hero_title_en?: string | null;
  hero_title_bn?: string | null;
  hero_desc_en?: string | null;
  hero_desc_bn?: string | null;
  partnership_title_en?: string | null;
  partnership_title_bn?: string | null;
  partnership_text_en?: string | null;
  partnership_text_bn?: string | null;
  author_name_en?: string | null;
  author_name_bn?: string | null;
  author_bio_en?: string | null;
  author_bio_bn?: string | null;
  author_image?: string | null;
  meta_title_en?: string | null;
  meta_title_bn?: string | null;
  meta_desc_en?: string | null;
  meta_desc_bn?: string | null;
}

interface Props {
  settings: Settings;
  rights: RightItem[];
  responsibilities: ResponsibilityItem[];
  locations?: any[];
  nav_menu?: any;
  is_bn?: boolean;
  canonical_url?: string;
  hreflang?: Record<string, string>;
}

// Helper to convert number to 2-digit Bengali or English
function formatIndex(index: number, isBn: boolean): string {
  const num = index + 1;
  const padded = num < 10 ? `0${num}` : `${num}`;
  if (!isBn) return padded;
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return padded.split('').map(d => bnDigits[parseInt(d, 10)] ?? d).join('');
}

export default function PatientRightsPublicShow({
  settings = {},
  rights = [],
  responsibilities = [],
  locations = [],
  nav_menu,
  canonical_url,
  hreflang,
}: Props) {
  const { isBn } = useLanguage();

  // Dynamic texts based on language
  const heroTitle = isBn
    ? (settings.hero_title_bn || settings.hero_title_en || 'টেক ডেন্টাল রোগীর অধিকার ও দায়িত্বসমূহ')
    : (settings.hero_title_en || 'Tech Dental Patient Bill of Rights and Responsibilities');

  const heroDesc = isBn
    ? (settings.hero_desc_bn || settings.hero_desc_en || 'টেক ডেন্টালে আমরা একটি আরামদায়ক ও শ্রদ্ধাশীল পরিবেশে উচ্চমানের, যত্নশীল এবং আধুনিক ডেন্টাল কেয়ার প্রদানের জন্য অঙ্গীকারবদ্ধ। নিচে আমাদের সম্মানিত রোগী হিসেবে আপনার অধিকারসমূহ এবং দায়িত্বসমূহ তুলে ধরা হলো।')
    : (settings.hero_desc_en || 'At Tech Dental, we are committed to providing high-quality, compassionate, and modern dental care in a comfortable and respectful environment. The following outlines your rights as our valued patient, along with the responsibilities we ask of you to help ensure the best possible experience and outcomes for everyone.');

  const partnershipTitle = isBn
    ? (settings.partnership_title_bn || settings.partnership_title_en || 'আমাদের অংশীদারিত্ব')
    : (settings.partnership_title_en || 'Our Partnership');

  const partnershipText = isBn
    ? (settings.partnership_text_bn || settings.partnership_text_en || "আমরা বিশ্বাস করি রোগী এবং ডেন্টাল টিমের মধ্যে দৃঢ় ও বিশ্বাসযোগ্য সম্পর্কই সেরা ফলাফল নিশ্চিত করে। আপনার যদি কখনো মনে হয় এই অধিকারগুলো যথাযথভাবে পূরণ হয়নি, তবে অনুগ্রহ করে আমাদের অফিস ম্যানেজার বা চিকিৎসকের সাথে সরাসরি কথা বলুন। আমরা শুনতে এবং উন্নত করতে সদা প্রস্তুত।\n\nটেক ডেন্টাল বেছে নেওয়ার জন্য ধন্যবাদ — যেখানে প্রযুক্তির সাথে সেবার মেলবন্ধন।")
    : (settings.partnership_text_en || "We believe that a strong, trusting relationship between the patient and the dental team leads to the best oral health outcomes. If at any time you feel these rights have not been honored, please speak with our office manager or dentist directly. We are here to listen and improve.\n\nThank you for choosing Tech Dental — where technology meets compassionate care.");

  const authorName = isBn
    ? (settings.author_name_bn || settings.author_name_en || 'টেক ডেন্টাল')
    : (settings.author_name_en || 'Tech Dental');

  const authorBio = isBn
    ? (settings.author_bio_bn || settings.author_bio_en || 'টেক ডেন্টাল বাংলাদেশের অন্যতম শীর্ষস্থানীয় ডেন্টাল চেইন, যার শাখা রয়েছে ঢাকার মিরপুর, উত্তরা, বাড্ডা ও যাত্রাবাড়ীতে। অত্যাধুনিক প্রযুক্তি (যেমন ডিজিটাল এক্স-রে, ইন্ট্রা ওরাল ক্যামেরা), ৪-ধাপের কড়া জীবাণুমুক্তকরণ ব্যবস্থা এবং সাশ্রয়ী মূল্যে মানসম্মত সেবা প্রদানের জন্য টেক ডেন্টাল সুপরিচিত।')
    : (settings.author_bio_en || 'Tech Dental is the largest dental chain in Bangladesh, with branches in cities like Dhaka (Badda, Mirpur, Uttara, Jatrabari). It emphasizes advanced technology (like Digital X-Ray, Intra Oral Cameras), strict 4-step sterilization protocols, and a commitment to providing affordable, high-quality care. They offer a comprehensive range of services, including routine check-ups, Root Canal Treatment (RCT), braces, dental implants, cosmetic dentistry, and more, all within a modern and patient-friendly environment, making it a popular choice for families and professionals.');

  const metaTitle = isBn
    ? (settings.meta_title_bn || 'রোগীর অধিকার ও দায়িত্বসমূহ | টেক ডেন্টাল কেয়ার')
    : (settings.meta_title_en || 'Patient Bill of Rights and Responsibilities | Tech Dental Care');

  const metaDesc = isBn
    ? (settings.meta_desc_bn || 'টেক ডেন্টাল কেয়ারে রোগীর অধিকার এবং দায়িত্ব সম্পর্কে বিস্তারিত জানুন।')
    : (settings.meta_desc_en || 'Learn about patient rights and responsibilities at Tech Dental Care Bangladesh.');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        {canonical_url && <link rel="canonical" href={canonical_url} />}
        {hreflang?.en && <link rel="alternate" hrefLang="en" href={hreflang.en} />}
        {hreflang?.bn && <link rel="alternate" hrefLang="bn" href={hreflang.bn} />}
        {hreflang?.['x-default'] && <link rel="alternate" hrefLang="x-default" href={hreflang['x-default']} />}
      </Head>

      {/* Global Top Header with English / Bengali switcher */}
      <TopHeader
        locations={locations}
        nav_menu={nav_menu}
        showLanguageSwitcher={true}
      />

      {/* Breadcrumb & Meta Info Bar */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-gray-500 gap-2">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-semibold text-gray-700 hover:text-sky-600">
              {isBn ? 'হোম' : 'Home'}
            </Link>
            <span>/</span>
            <span className="text-gray-500">
              {isBn ? 'রোগীর অধিকার ও দায়িত্ব' : 'Patient Bill of Rights'}
            </span>
          </div>
          
          <div className="flex items-center gap-5 text-gray-500 text-xs sm:text-sm">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {isBn ? 'আপডেট: ৫ নভেম্বর ২০২৬' : 'Updated: Nov 5, 2026'}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {isBn ? 'কর্তৃক: টেক ডেন্টাল' : 'By: Tech Dental'}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-14 sm:py-20 text-white bg-gradient-to-br from-sky-500 to-sky-700">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dental-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="white" strokeWidth="2" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dental-pattern)" />
          </svg>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block px-3.5 py-1 mb-4 text-xs sm:text-sm font-semibold tracking-wide uppercase bg-white/20 backdrop-blur-sm rounded-full text-white">
            {isBn ? 'স্বচ্ছতা ও রোগীর সুরক্ষা' : 'Transparency & Patient Safety'}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5">
            {heroTitle}
          </h1>
          <p className="text-base sm:text-lg text-sky-100 max-w-3xl mx-auto font-light leading-relaxed whitespace-pre-line">
            {heroDesc}
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="w-full py-12 sm:py-16 bg-white flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            
            {/* LEFT COLUMN: RIGHTS */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-sky-100">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 flex-shrink-0">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {isBn ? 'আপনার অধিকারসমূহ' : 'Your Rights'}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    {isBn ? 'সম্মানিত রোগী হিসেবে আপনার প্রাপ্য অধিকার' : 'Essential rights guaranteed to every patient'}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 font-medium text-sm sm:text-base">
                {isBn ? 'আমাদের এখানে সেবা গ্রহণের সময় আপনার অধিকার রয়েছে:' : 'You have the right to:'}
              </p>
              
              <div className="space-y-3.5">
                {rights.map((item, idx) => {
                  const text = isBn ? (item.text_bn || item.text_en) : item.text_en;
                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 sm:p-5 bg-gray-50 hover:bg-sky-50/50 rounded-xl border border-gray-100 hover:border-sky-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                    >
                      <span className="text-sky-600 font-bold text-lg sm:text-xl flex-shrink-0 min-w-[28px]">
                        {formatIndex(idx, isBn)}
                      </span>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                        {text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: RESPONSIBILITIES & EXTRA */}
            <div className="space-y-10">
              
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-sky-100">
                  <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {isBn ? 'আপনার দায়িত্বসমূহ' : 'Your Responsibilities'}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                      {isBn ? 'সঠিক চিকিৎসার সফলতার জন্য রোগীর সহযোগিতা' : 'Cooperation requested to ensure optimal outcomes'}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 font-medium text-sm sm:text-base">
                  {isBn
                    ? 'আপনাকে সর্বোচ্চ মানসম্পন্ন সেবা প্রদানের সুবিধার্থে আমরা বিনীত অনুরোধ জানাই:'
                    : 'To help us provide you with the best possible care, we respectfully ask that you:'}
                </p>
                
                <div className="space-y-3.5">
                  {responsibilities.map((item, idx) => {
                    const title = isBn ? (item.title_bn || item.title_en) : item.title_en;
                    const text = isBn ? (item.text_bn || item.text_en) : item.text_en;
                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 sm:p-5 bg-white shadow-sm border border-gray-100 hover:border-sky-200 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center font-bold text-sm">
                          {isBn ? ['১','২','৩','৪','৫','৬','৭','৮','৯'][idx] || (idx + 1) : (idx + 1)}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                            {title}
                          </h4>
                          <p className="text-gray-600 mt-1 text-xs sm:text-sm leading-relaxed">
                            {text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Partnership Box */}
              <div className="bg-sky-50 rounded-2xl p-6 sm:p-8 border border-sky-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sky-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-sky-950">
                    {partnershipTitle}
                  </h3>
                </div>
                <p className="text-sky-900 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {partnershipText}
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Author & Practice Profile Info */}
      <section className="w-full py-12 sm:py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block p-3 bg-white rounded-full shadow-sm border border-gray-200 mb-5">
            {settings.author_image ? (
              <img
                src={settings.author_image}
                alt={authorName}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <svg className="w-14 h-14 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              {isBn ? `লেখক পরিচিতি: ${authorName}` : `About the Author: ${authorName}`}
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base max-w-3xl mx-auto whitespace-pre-line">
              {authorBio}
            </p>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <GlobalFooter />
    </div>
  );
}
