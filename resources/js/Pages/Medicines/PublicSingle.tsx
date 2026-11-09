import React, { useState, useEffect } from "react";
import { Link, Head } from "@inertiajs/react";
import { ChevronDown, ChevronUp, Home } from "lucide-react";
import { TopHeader } from "@/components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
import { PageProps } from '@inertiajs/core';
import { useLanguage } from "@/utils/useLanguage";

interface UseItem {
  label: string;
  label_bn?: string;
  text: string;
  text_bn?: string;
}

interface WarningItem {
  icon?: string;
  label: string;
  label_bn?: string;
  text: string;
  text_bn?: string;
}

interface FaqItem {
  q: string;
  q_bn?: string;
  a: string;
  a_bn?: string;
}

interface MedicineItem {
  id: number;
  slug: string;
  name: string;
  name_bn?: string;
  generic: string;
  generic_bn?: string;
  category: string;
  tag: string;
  tag_bn?: string;
  image: string;
  quick_use: string;
  quick_use_bn?: string;
  pharma: string;
  pharma_bn?: string;
  dosage: string;
  dosage_bn?: string;
  dental_usage: string;
  dental_usage_bn?: string;
  uses_text: string;
  uses_text_bn?: string;
  side_effects: string;
  side_effects_bn?: string;
  subtitle: string;
  subtitle_bn?: string;
  seo_title?: string;
  seo_title_bn?: string;
  seo_content?: string;
  seo_content_bn?: string;
  meta_desc?: string;
  canonical_url?: string;
  robots_index?: boolean;
  robots_follow?: boolean;
  schema_type?: string;
  schema_json?: string;
  verified_badge: string;
  verified_badge_bn?: string;
  published_date: string;
  intro: string;
  intro_bn?: string;
  uses_items: UseItem[];
  dosage_admin: string;
  dosage_admin_bn?: string;
  dosage_timing: string;
  dosage_timing_bn?: string;
  side_effects_items: (string | { text: string; text_bn?: string })[];
  warnings: WarningItem[];
  price_per_tablet: string;
  price_per_strip: string;
  price_manufacturer: string;
  gallery: { src: string; caption: string }[];
  faqs: FaqItem[];
  section_titles?: Record<string, string>;
  author: {
    img?: string;
    name?: string;
    name_bn?: string;
    bio?: string;
    bio_bn?: string;
    reviewed_by?: string;
    reviewed_by_bn?: string;
    last_updated?: string;
    disclaimer?: string;
    disclaimer_bn?: string;
  };
  related: { id: number; slug: string; brand: string; name: string; name_bn?: string; generic: string; generic_bn?: string; pharma?: string; pharma_bn?: string; quick_use?: string; quick_use_bn?: string }[];
}

interface Props extends PageProps {
  item: MedicineItem;
  related: MedicineItem[];
  locations?: any[];
  nav_menu?: any;
  is_bn?: boolean;
  canonical_url?: string;
  hreflang?: Record<string, string>;
}

const WarningIcon: React.FC<{ icon?: string; className?: string }> = ({ icon, className }) => {
  switch (icon) {
    case 'ban':
      return <i className={`fa-solid fa-ban ${className || 'text-[#8b1d41] mt-0.5 shrink-0'}`} />;
    case 'user-doctor':
      return <i className={`fa-solid fa-user-doctor ${className || 'text-[#8b1d41] mt-0.5 shrink-0'}`} />;
    default:
      return <i className={`fa-solid fa-triangle-exclamation ${className || 'text-[#8b1d41] mt-0.5 shrink-0'}`} />;
  }
};

const toBnDigit = (num: number | string): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => bnDigits[Number(d)] || d);
};

export default function MedicinesPublicSingle({
  item,
  related = [],
  locations = [],
  nav_menu,
  is_bn,
  canonical_url,
  hreflang,
}: Props) {
  const [selectedBranch, setSelectedBranch] = useState("mirpur");
  const [tocOpen, setTocOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const { isBn, setLanguage } = useLanguage();

  useEffect(() => {
    if (typeof is_bn === 'boolean') {
      setLanguage(is_bn ? 'bn' : 'en');
    }
  }, [is_bn]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const h = window.location.hash;
      if (h === '#more-about' || h === '#faq' || h.startsWith('#faq-')) {
        setInfoOpen(true);
      }
    }
  }, []);

  // Strict Language Separation: English mode shows ONLY English; Bangla mode shows ONLY Bangla
  const displayName = isBn ? (item.name_bn || item.name) : item.name;
  const displayGeneric = isBn ? (item.generic_bn || item.generic) : item.generic;
  const displayPharma = isBn ? (item.pharma_bn || item.pharma) : item.pharma;
  const displaySubtitle = isBn ? (item.subtitle_bn || 'ব্যবহারবিধি, সেবনমাত্রা, পার্শ্বপ্রতিক্রিয়া ও মূল্যতালিকা') : item.subtitle;
  const displayIntro = isBn ? (item.intro_bn || item.intro) : item.intro;
  const displayTag = isBn ? (item.tag_bn || 'প্রেসক্রিপশন ঔষধ') : item.tag;
  const displayUsesText = isBn ? (item.uses_text_bn || `${displayName} এর প্রধান নির্দেশনাসমূহ:`) : item.uses_text;
  const displayDosage = isBn ? (item.dosage_bn || 'দৈনিক ১টি ট্যাবলেট চিকিৎসকের পরামর্শ অনুযায়ী সেব্য।') : item.dosage;
  const displayDosageAdmin = isBn ? (item.dosage_admin_bn || 'এক গ্লাস পানির সাথে সম্পূর্ণ ট্যাবলেট গিলে ফেলুন। খালি পেটে সেবন করবেন না।') : item.dosage_admin;
  const displayDosageTiming = isBn ? (item.dosage_timing_bn || 'প্রতিদিন নির্দিষ্ট সময়ে ভরা পেটে বা খাবারের পর সেবন করুন।') : item.dosage_timing;
  const displayDentalUsage = isBn ? (item.dental_usage_bn || 'ডেন্টাল চিকিৎসা বা দাঁতের অস্ত্রোপচারের পর ইনফেকশন ও ব্যথা নিয়ন্ত্রণে সহায়ক।') : item.dental_usage;
  const displaySideEffects = isBn ? (item.side_effects_bn || 'সাধারণত সহনশীল, তবে কিছু রোগীর ক্ষেত্রে মৃদু পার্শ্বপ্রতিক্রিয়া দেখা দিতে পারে:') : item.side_effects;
  const displayVerifiedBadge = isBn ? (item.verified_badge_bn || 'মেডিকেলি ভেরিফাইড') : (item.verified_badge || 'Medically Verified');
  const displayPublishedDate = isBn ? 'হালনাগাদ ২০২৬' : (item.published_date || 'Updated 2026');

  // Check if dosage form already exists in name to prevent duplicate "Tablet Tablet"
  const hasDosageFormInName = /tablet|ট্যাবলেট|capsule|ক্যাপসুল|syrup|সিরাপ|gel|জেল|suspension|mouthwash/i.test(displayName || '');

  // Section Headings: Strict separation by language
  const sec = item.section_titles || {};
  const titleUses = isBn
    ? (sec.uses_bn || `${displayName} এর ব্যবহার ও ক্লিনিক্যাল প্রয়োগ`)
    : (sec.uses || `What is ${displayName} Used For?`);

  const titleDosage = isBn
    ? (sec.dosage_bn || 'সেবনবিধি ও মাত্রা')
    : (sec.dosage || 'Recommended Dosage');

  const titleSideEffects = isBn
    ? (sec.side_effects_bn || 'সাধারণ পার্শ্বপ্রতিক্রিয়া')
    : (sec.side_effects || 'Common Side Effects');

  const titleWarnings = isBn
    ? (sec.warnings_bn || 'জরুরি সতর্কতা ও সাবধানতা')
    : (sec.warnings || 'Important Warnings & Precautions');

  const titlePrice = isBn
    ? (sec.price_bn || `${displayName} এর বর্তমান বাজারমূল্য`)
    : (sec.price || `${displayName} Price in Bangladesh`);

  const titleGallery = isBn
    ? (sec.gallery_bn || `${displayName} প্যাকেট ও ফটো রেফারেন্স`)
    : (sec.gallery || `${displayName} Tablet Packet`);

  const titleFaq = isBn
    ? (sec.faq_bn || 'সাধারণ প্রশ্নোত্তর (FAQ)')
    : (sec.faq || 'Frequently Asked Questions (FAQ)');

  const titleAuthor = isBn
    ? (sec.author_bn || 'মেডিকেল রিভিউয়ার ও বিশেষজ্ঞ পরিচিতি')
    : (sec.author || 'Medical Reviewer & Specialist');

  const titleToc = isBn
    ? (sec.toc_bn || 'সূচিপত্র')
    : (sec.toc || 'Table of Contents');

  // Format clean name for "More about {Name}" (e.g. "Xyril 25 Tablet" -> "Xyril 25")
  const cleanMedicineName = (displayName || item.name || '')
    .replace(/(?:\s+Tablet|\s+Capsule|\s+Ointment|\s+Suspension|\s+ট্যাবলেট|\s+ক্যাপসুল|\s+মলম)+$/i, '')
    .trim() || displayName;

  const displaySeoTitle = `More about ${cleanMedicineName}`;

  const displaySeoContent = isBn
    ? (item.seo_content_bn || item.seo_content)
    : (item.seo_content || item.seo_content_bn);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const apply = () => setTocOpen(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Table of Contents Numbers: English (1., 2.) in EN mode; Bengali (১., ২.) in BN mode
  const tocTopItems = isBn
    ? [
        { href: '#overview', label: `১. ${titleUses}` },
        { href: '#dosage', label: `২. ${titleDosage}` },
        { href: '#side-effects', label: `৩. ${titleSideEffects}` },
        { href: '#warnings', label: `৪. ${titleWarnings}` },
        { href: '#price', label: `৫. ${titlePrice}` },
        { href: '#more-about', label: `৬. More about ${cleanMedicineName}` },
      ]
    : [
        { href: '#overview', label: `1. ${titleUses}` },
        { href: '#dosage', label: `2. ${titleDosage}` },
        { href: '#side-effects', label: `3. ${titleSideEffects}` },
        { href: '#warnings', label: `4. ${titleWarnings}` },
        { href: '#price', label: `5. ${titlePrice}` },
        { href: '#more-about', label: `6. More about ${cleanMedicineName}` },
      ];

  // Author details
  const authorName = isBn
    ? (item.author?.name_bn || item.author?.name || 'ডা. আফসানা হক জ্যোতি')
    : (item.author?.name || 'Dr. Afsana Haque Joty');

  const authorBio = isBn
    ? (item.author?.bio_bn || 'টেক ডেন্টাল মিরপুর শাখার সিনিয়র ডেন্টাল সার্জন, যিনি ৫ বছরেরও বেশি সময় ধরে দন্তচিকিৎসা ও ওরাল সার্জারিতে সেবা দিচ্ছেন।')
    : (item.author?.bio || 'Dr. Afsana Haque Joty is a Senior Dental Surgeon at Tech Dental with extensive expertise in oral health and dental surgery.');

  const authorReviewedBy = isBn
    ? (item.author?.reviewed_by_bn || authorName)
    : (item.author?.reviewed_by || authorName);

  const authorDisclaimer = isBn
    ? (item.author?.disclaimer_bn || 'সতর্কবার্তা: শুধুমাত্র শিক্ষামূলক তথ্য। এটি কোনো পেশাদার চিকিৎসা পরামর্শের বিকল্প নয়।')
    : (item.author?.disclaimer || 'Disclaimer: Educational information only. Not a substitute for professional medical advice.');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', 'SolaimanLipi', 'Noto Sans Bengali', sans-serif" }}>
      <Head>
        <title>{item.seo_title ? `${displayName} – ${item.seo_title}` : `${displayName || 'Medicine'} - Dental Medicine & Usage | Tech Dental`}</title>
        <meta name="description" content={item.meta_desc || displaySubtitle || displayIntro} />
        {canonical_url && <link rel="canonical" href={canonical_url} />}
        {hreflang?.en && <link rel="alternate" hrefLang="en" href={hreflang.en} />}
        {hreflang?.bn && <link rel="alternate" hrefLang="bn" href={hreflang.bn} />}
        {hreflang?.['x-default'] && <link rel="alternate" hrefLang="x-default" href={hreflang['x-default']} />}
      </Head>

      <TopHeader
        locations={locations}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        navMenu={nav_menu}
        showBranchPicker={false}
        showLanguageSwitcher={true}
        showBookButton={false}
      />

      <div className="w-full px-4 sm:px-8 py-6 space-y-6">

        {/* Hero Card */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
          <div className="relative space-y-4">
            {/* Top Navigation & Verified Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
              <nav className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 font-medium">
                <Link href="/" className="hover:text-[#8b1d41] transition flex items-center gap-1">
                  <Home className="text-[11px] text-[#8b1d41]" width={11} height={11} /> {isBn ? 'হোম' : 'Home'}
                </Link>
                <span className="text-slate-300">/</span>
                <Link href="/medicines" className="hover:text-[#8b1d41] transition">{isBn ? 'ঔষধ' : 'Medicine'}</Link>
                <span className="text-slate-300">/</span>
                <span className="text-[#721533] font-semibold truncate">{displayName}</span>
              </nav>

              <span className="bg-[#fdf2f4] text-[#721533] text-[11px] font-bold px-3 py-1 rounded-full border border-[#fce7ea] inline-flex items-center gap-1.5">
                <i className="fa-solid fa-shield-halved text-[#8b1d41]" /> {displayVerifiedBadge}
              </span>

              {item.published_date && (
                <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-3 py-1 rounded-full border border-slate-200 inline-flex items-center gap-1.5">
                  <i className="fa-regular fa-calendar-check text-[#8b1d41]" /> {displayPublishedDate}
                </span>
              )}
            </div>

            {/* Main Title & Subtitle */}
            <div className="space-y-1.5 text-center sm:text-left">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {displayName} {!hasDosageFormInName && <span className="text-[#8b1d41]">{isBn ? 'ট্যাবলেট' : 'Tablet'}</span>}
              </h1>
              {displaySubtitle && (
                <p className="text-xs sm:text-sm text-slate-600 font-medium">{displaySubtitle}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* TOC Sidebar */}
          <aside className="lg:col-span-3 border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-xs lg:sticky lg:top-6">
            <button
              onClick={() => setTocOpen((prev) => !prev)}
              aria-expanded={tocOpen}
              className="w-full p-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between font-bold text-slate-900 text-xs sm:text-sm"
            >
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-list-ul text-[#8b1d41]" />
                <span>{titleToc}</span>
              </span>
              {tocOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>

            {tocOpen && (
              <div className="p-4 bg-white text-xs sm:text-sm font-medium text-slate-700 space-y-2.5">
                {tocTopItems.map((t) => (
                  <p key={t.href}>
                    <a
                      href={t.href}
                      onClick={() => {
                        if (t.href === '#more-about') setInfoOpen(true);
                      }}
                      className="hover:text-[#8b1d41] transition block py-0.5"
                    >
                      {t.label}
                    </a>
                  </p>
                ))}

                {Array.isArray(item.faqs) && item.faqs.length > 0 && (
                  <div className="pl-3 space-y-1.5 text-xs text-slate-600 border-l-2 border-[#fce7ea] mt-2 pt-1">
                    {item.faqs.map((f, i) => {
                      const qText = isBn ? (f.q_bn || f.q) : f.q;
                      const prefix = isBn ? `৬.${toBnDigit(i + 1)}.` : `6.${i + 1}.`;
                      return (
                        <p key={i}>
                          <a
                            href={`#faq-${i + 1}`}
                            onClick={() => setInfoOpen(true)}
                            className="hover:text-[#8b1d41] transition block truncate"
                          >
                            {prefix} {qText}
                          </a>
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </aside>

          <main className="lg:col-span-9 space-y-6">

            {/* Top Overview Box */}
            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
              <div className="md:col-span-5 flex flex-col items-center justify-center space-y-3 w-full mx-auto">
                <div className="aspect-square w-48 sm:w-56 lg:w-64 bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-center overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#fdf2f4] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img
                    src={item.image?.replace(/^\/public\//, '/')}
                    alt={`${displayName} Packaging`}
                    className="max-h-full max-w-full object-contain relative z-10 hover:scale-105 transition-transform duration-300"
                    onError={(e: any) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://placehold.co/600x400/f1f5f9/64748b?text=' + encodeURIComponent(displayName);
                    }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 font-medium text-center">
                  {item.gallery?.[0]?.caption || `${displayName} ${isBn ? 'প্যাকেজিং রেফারেন্স।' : 'packaging.'}`}
                </p>
              </div>

              <div className="md:col-span-7 space-y-3">
                <h2 className="text-[#721533] font-bold text-xl">{displayName}</h2>
                <div className="text-xs text-slate-500 font-medium">
                  <strong>{isBn ? 'জেনেরিক:' : 'Generic:'}</strong> {displayGeneric} | <strong>{isBn ? 'কোম্পানি:' : 'Pharma:'}</strong> {displayPharma}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{displayIntro}</p>
              </div>
            </div>

            {/* Section 1: Uses */}
            <section id="overview" className="scroll-mt-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-5 bg-[#8b1d41] rounded-full inline-block" />
                <span>{titleUses}</span>
              </h2>
              {displayUsesText && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{displayUsesText}</p>
              )}

              {item.uses_items?.length > 0 && (
                <div className="space-y-2 text-xs sm:text-sm text-slate-700 pt-1">
                  {item.uses_items.map((u, i) => {
                    const labelText = isBn ? (u.label_bn || u.label) : u.label;
                    const descText = isBn ? (u.text_bn || u.text) : u.text;
                    return (
                      <div key={i} className="flex items-start gap-2.5 py-1">
                        <i className="fa-solid fa-circle-check text-[#8b1d41] mt-0.5 shrink-0" />
                        <div><strong>{labelText}:</strong> {descText}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Section 2: Dosage */}
            <section id="dosage" className="scroll-mt-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-5 bg-[#8b1d41] rounded-full inline-block" />
                <span>{titleDosage}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">{displayDosage}</p>
              <div className="space-y-3 text-xs sm:text-sm pt-1">
                {displayDosageAdmin && (
                  <div className="py-1">
                    <strong className="text-slate-900 block mb-0.5 flex items-center gap-1.5">
                      <i className="fa-solid fa-glass-water text-[#8b1d41]" /> {isBn ? 'সেবন নির্দেশিকা:' : 'Administration:'}
                    </strong>
                    <p className="text-slate-600 leading-relaxed">{displayDosageAdmin}</p>
                  </div>
                )}
                {displayDosageTiming && (
                  <div className="py-1">
                    <strong className="text-slate-900 block mb-0.5 flex items-center gap-1.5">
                      <i className="fa-solid fa-clock text-[#8b1d41]" /> {isBn ? 'উপযুক্ত সময়:' : 'Optimal Timing:'}
                    </strong>
                    <p className="text-slate-600 leading-relaxed">{displayDosageTiming}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Section 3: Side Effects */}
            <section id="side-effects" className="scroll-mt-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-5 bg-[#8b1d41] rounded-full inline-block" />
                <span>{titleSideEffects}</span>
              </h2>
              {displaySideEffects && (
                <p className="text-xs sm:text-sm text-slate-600">{displaySideEffects}</p>
              )}
              {item.side_effects_items?.length > 0 && (
                <div className="space-y-2 text-xs sm:text-sm pt-1">
                  {item.side_effects_items.map((s, i) => {
                    const text = isBn
                      ? (typeof s === 'object' && s.text_bn ? s.text_bn : (typeof s === 'string' ? s : s.text))
                      : (typeof s === 'object' ? s.text : s);
                    return (
                      <div key={i} className="flex items-center gap-2 py-0.5">
                        <i className="fa-solid fa-circle text-[6px] text-[#8b1d41]" />
                        <span className="font-semibold text-[#8b1d41]">{text}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Section 4: Warnings */}
            <section id="warnings" className="scroll-mt-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-5 bg-[#8b1d41] rounded-full inline-block" />
                <span>{titleWarnings}</span>
              </h2>
              {item.warnings?.length > 0 && (
                <div className="space-y-3 text-xs sm:text-sm text-slate-700 pt-1">
                  {item.warnings.map((w, i) => {
                    const label = isBn ? (w.label_bn || w.label) : w.label;
                    const text = isBn ? (w.text_bn || w.text) : w.text;
                    return (
                      <div key={i} className="flex items-start gap-2.5 py-1">
                        <WarningIcon icon={w.icon} />
                        <span><strong>{label}:</strong> {text}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Section 5: Price */}
            <section id="price" className="scroll-mt-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-5 bg-[#8b1d41] rounded-full inline-block" />
                  <span>{titlePrice}</span>
                </h2>
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 sm:py-1 rounded-xl sm:rounded-full text-center shrink-0 leading-tight">
                  {displayPublishedDate}
                </span>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 pt-1">
                {item.price_per_tablet && (
                  <div className="flex items-center gap-2.5 py-1">
                    <i className="fa-solid fa-coins text-[#8b1d41] w-4 text-center" />
                    <span><strong>{isBn ? 'প্রতি ট্যাবলেটের মূল্য:' : 'Price per Tablet:'}</strong> {isBn ? toBnDigit(item.price_per_tablet) : item.price_per_tablet}</span>
                  </div>
                )}
                {item.price_per_strip && (
                  <div className="flex items-center gap-2.5 py-1">
                    <i className="fa-solid fa-tablets text-[#8b1d41] w-4 text-center" />
                    <span><strong>{isBn ? 'প্রতি পাতার মূল্য (১০টি):' : 'Price per Strip (10 Tabs):'}</strong> {isBn ? toBnDigit(item.price_per_strip) : item.price_per_strip}</span>
                  </div>
                )}
                {(item.price_manufacturer || item.pharma) && (
                  <div className="flex items-center gap-2.5 py-1">
                    <i className="fa-solid fa-industry text-[#8b1d41] w-4 text-center" />
                    <span><strong>{isBn ? 'প্রস্তুতকারক কোম্পানি:' : 'Manufacturer:'}</strong> {displayPharma || item.price_manufacturer}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Product Visual Reference Grid */}
            {item.gallery?.length > 0 && (
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-4 bg-[#8b1d41] rounded-full inline-block" />
                  <span>{titleGallery}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {item.gallery.map((g, i) => (
                    <div key={i} className="flex flex-col items-center text-center space-y-2">
                      <div className="w-full h-48 sm:h-56 bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-center overflow-hidden">
                        <img src={g.src} alt={g.caption} className="max-h-full max-w-full object-contain" />
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">{g.caption}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Medical Reviewer Profile */}
            {item.author && (
              <section id="author" className="scroll-mt-6 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-4 bg-[#8b1d41] rounded-full inline-block" />
                    <span>{titleAuthor}</span>
                  </h3>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 text-left w-full sm:w-auto">
                    <img src={item.author.img || 'https://ui-avatars.com/api/?name=Dr.+Aysha+Siddika&background=881337&color=fff&size=160'} alt={authorName} className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-[#fdf2f4] shadow-2xs mt-0.5" />
                    <div className="space-y-1 text-xs">
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        {authorName}
                      </h4>
                      <p className="text-slate-600 font-medium text-[11px] leading-relaxed">
                        {authorBio}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-1 shrink-0 w-full sm:w-auto pt-3 sm:pt-0 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5 w-full">
                      <i className="fa-solid fa-circle-check text-[#8b1d41] w-4 text-center shrink-0" />
                      <span className="inline-block">
                        {isBn ? 'পর্যালোচনা করেছেন: ' : 'Reviewed by: '}
                        <strong className="text-slate-900 font-semibold">
                          {authorReviewedBy}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 w-full">
                      <i className="fa-regular fa-clock text-[#8b1d41] w-4 text-center shrink-0" />
                      <span className="inline-block">
                        {isBn ? 'সর্বশেষ হালনাগাদ: ' : 'Last Updated: '}
                        <strong className="text-slate-900 font-semibold">{isBn ? 'অক্টোবর ২০২৬' : (item.author.last_updated || 'Oct 2026')}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Additional Information Accordion (Bottom SEO Box) */}
            <div id="more-about" className="border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden scroll-mt-6 mb-6">
              <button
                type="button"
                onClick={() => setInfoOpen(!infoOpen)}
                aria-expanded={infoOpen}
                className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none cursor-pointer hover:bg-slate-50/70 transition-colors"
              >
                <span className="text-sm sm:text-[15px] text-slate-800 font-bold leading-none">
                  {displaySeoTitle}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transform transition-transform duration-300 flex-shrink-0 ${infoOpen ? 'rotate-180' : ''}`} />
              </button>

              {infoOpen && (
                <div className="border-t border-slate-100 px-5 py-5 bg-white space-y-6">
                  {/* SEO Content / Rich Content View */}
                  {displaySeoContent && (
                    <div
                      className="rich-content-view wp-editor-content prose prose-slate max-w-none text-slate-700 leading-relaxed text-xs sm:text-sm"
                      dangerouslySetInnerHTML={{ __html: displaySeoContent }}
                    />
                  )}

                  {/* Frequently Asked Questions (FAQs) */}
                  {Array.isArray(item.faqs) && item.faqs.length > 0 && (
                    <div id="faq" className="pt-5 border-t border-slate-100 scroll-mt-6">
                      <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-3.5 bg-[#8b1d41] rounded-full" />
                        {titleFaq}
                      </h4>
                      <div className="space-y-2.5">
                        {item.faqs.map((f, i) => {
                          const qText = isBn ? (f.q_bn || f.q) : f.q;
                          const aText = isBn ? (f.a_bn || f.a) : f.a;
                          return (
                            <div key={i} id={`faq-${i + 1}`} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 scroll-mt-6">
                              <p className="font-bold text-xs sm:text-sm text-slate-900 flex items-start gap-2">
                                <span className="text-[#8b1d41] font-extrabold">{isBn ? `প্রশ্ন ${toBnDigit(i + 1)}:` : `Q${i + 1}:`}</span>
                                <span>{qText}</span>
                              </p>
                              {aText && (
                                <p className="text-xs sm:text-sm text-slate-600 mt-1 pl-6 leading-relaxed whitespace-pre-line">
                                  {aText}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {authorDisclaimer && (
                    <p className="text-[11px] text-slate-400 italic pt-2 text-center">
                      {authorDisclaimer}
                    </p>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <GlobalFooter hideCtaStrip={true} />
    </div>
  );
}
