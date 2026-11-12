import React, { useState, useMemo } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  ChevronDown, MapPin, Clock, Award, ShieldCheck,
  Check, ArrowRight, Phone, CalendarCheck, UserCheck, Star
} from "lucide-react";
import { TopHeader } from "@/components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
import Seo from "@/Components/Seo";
import { WHATSAPP_URL } from "@/utils/contact";
import { PageProps } from '@inertiajs/core';
import { getWebsiteTexts } from '@/data/websiteTexts';

interface ServiceItem {
  id: number;
  slug: string;
  slug_bn?: string;
  title: string;
  title_bn?: string;
  category?: string;
  price: string;
  price_suffix: string;
  short_desc: string;
  short_desc_bn?: string;
  hero_main: string;
  hero_thumbs: string[];
  features: { title: string; sub: string }[];
  pricing_cards: { img: string; title: string; price: string; note: string; popular?: boolean }[];
  results: string[];
  details_heading: string;
  details_heading_bn?: string;
  details_html: string;
  details_html_bn?: string;
  seo_images: string[];
  faqs: { q: string; a: string }[];
  faqs_bn?: { q: string; a: string }[];
  reviews: { stars: number; text: string; by: string }[];
  seo_title?: string;
  seo_title_bn?: string;
  meta_desc?: string;
  meta_desc_bn?: string;
  canonical_url?: string;
  robots_index?: boolean;
  robots_follow?: boolean;
  schema_type?: string;
  schema_json?: string;
}

interface Props extends PageProps {
  item: ServiceItem;
  doctors: any[];
  locations: any[];
  related: ServiceItem[];
  nav_menu?: any;
  is_bn?: boolean;
  language_urls?: { en: string; bn: string | null };
}

type TabKey = 'details' | 'doctors' | 'branches' | 'review' | 'faq';

const FeatureIcon: React.FC<{ index: number; className?: string }> = ({ index, className }) => {
  const paths = [
    "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", // smile — aesthetic
    "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", // clock — treatment time
    "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z", // shield/ribbon — durability
    "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z", // badge — warranty
  ];
  return (
    <svg className={className || "w-4 h-4 sm:w-5 sm:h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths[Math.min(index, paths.length - 1)]} />
    </svg>
  );
};

const BN_FEATURE_TITLES: Record<string, string> = {
  'Comfortable': 'আরামদায়ক',
  'Treatment Time': 'চিকিৎসার সময়',
  'SUCCESS RATE': 'সফলতার হার',
  'PRESERVATION': 'দাঁত সংরক্ষণ',
  'Aesthetic Result': 'সৌন্দর্য ফলাফল',
  'Durability': 'স্থায়িত্ব',
  'Warranty': 'ওয়ারেন্টি',
  'CONVENIENCE': 'সুবিধা',
  'PROTECTION': 'সুরক্ষা',
  'Durability & Protection': 'স্থায়িত্ব ও সুরক্ষা',
  'Premium Quality': 'প্রিমিয়াম মান',
  'ORAL HEALTH BENEFITS': 'মুখের স্বাস্থ্য উপকারিতা',
  'RECOMMENDED FREQUENCY': 'প্রস্তাবিত সময়',
  'Procedure': 'চিকিৎসা পদ্ধতি',
  'Visits': 'ভিজিট',
  'Success Rate': 'সফলতার হার',
  'Highest Hygiene': 'সর্বোচ্চ পরিচ্ছন্নতা',
  'PROCEDURE SAFETY': 'প্রক্রিয়ার নিরাপত্তা',
};

const BN_FEATURE_SUBS: Record<string, string> = {
  'Pain-free Care': 'ব্যথামুক্ত সেবা',
  '3–6 Months Full Process': '৩–৬ মাসে সম্পূর্ণ প্রক্রিয়া',
  '98%': '৯৮%',
  'Bone Protection': 'হাড়ের সুরক্ষা',
  'Matches Natural Teeth Perfectly': 'প্রাকৃতিক দাঁতের সাথে নিখুঁত মিল',
  '3–5 days': '৩–৫ দিন',
  'Unbreakable & Flexible Strength': 'ভাঙনরোধী ও নমনীয় শক্তি',
  '2–5 Years Limited Warranty': '২–৫ বছরের সীমিত ওয়ারেন্টি',
  'Blends Naturally with Gums': 'মাড়ির সাথে প্রাকৃতিকভাবে মিশে যায়',
  '3–5 Days': '৩–৫ দিন',
  'Restores Natural Shape & Color': 'স্বাভাবিক আকৃতি ও রঙ ফিরিয়ে দেয়',
  '1 to 3 Working Days': '১–৩ কর্মদিবস',
  '10–15 Years Long Lasting': '১০–১৫ বছর দীর্ঘস্থায়ী',
  '2-Year Service Warranty': '২ বছরের সার্ভিস ওয়ারেন্টি',
  'Blends Seamlessly with Real Teeth': 'আসল দাঁতের সাথে অনায়াসে মিশে যায়',
  '2–3 Days': '২–৩ দিন',
  '10–15 Years Reliable Support': '১০–১৫ বছর নির্ভরযোগ্য সহায়তা',
  '5–10 Years Limited Warranty': '৫–১০ বছরের সীমিত ওয়ারেন্টি',
  'Ultra-Natural Translucent Finish': 'অতি প্রাকৃতিক স্বচ্ছ ফিনিশ',
  '15–20 Years': '১৫–২০ বছর',
  '10–15 Years Limited Warranty': '১০–১৫ বছরের সীমিত ওয়ারেন্টি',
  'Preserves Natural Jaw Alignment': 'চোয়ালের স্বাভাবিক অবস্থান রক্ষা করে',
  '30–60 Minutes / 1 Day Only': '৩০–৬০ মিনিট / মাত্র ১ দিন',
  'Permanent Relief & Solution': 'স্থায়ী উপশম ও সমাধান',
  'Post-Extraction Care Support': 'এক্সট্রাকশনের পর যত্ন ও সহায়তা',
  'Aligns Natural Teeth & Jaw': 'দাঁত ও চোয়ালের স্বাভাবিক অবস্থান ঠিক করে',
  '6–24 Months (Depends on Case)': '৬–২৪ মাস (রোগীর অবস্থার ওপর নির্ভরশীল)',
  'Permanent Smile Correction': 'স্থায়ী হাসি সংশোধন',
  'Life-long Post-Care Support': 'আজীবন পরবর্তী যত্ন ও সহায়তা',
  'Matches Natural Tooth Color': 'প্রাকৃতিক দাঁতের রঙের সাথে মিল',
  '30–60 Minutes': '৩০–৬০ মিনিট',
  '5–10 Years Long Lasting': '৫–১০ বছর দীর্ঘস্থায়ী',
  '1-Year Service Warranty': '১ বছরের সার্ভিস ওয়ারেন্টি',
  '1 Hours / 1 Day Only': '১ ঘণ্টা / মাত্র ১ দিন',
  '2-Year, 2 Times Replacement': '২ বছর, ২ বার প্রতিস্থাপন',
  'Virtually Invisible & Discreet': 'প্রায় অদৃশ্য ও অস্পষ্ট',
  '6–18 Months (Varies)': '৬–১৮ মাস (ভিন্ন হতে পারে)',
  'Removable & Comfortable': 'খুলে ফেলা যায় ও আরামদায়ক',
  '100% Removable for Eating & Brushing': 'খাওয়া ও ব্রাশের জন্য ১০০% খোলা যায়',
  'Superior Translucency & Natural Look': 'উন্নত স্বচ্ছতা ও প্রাকৃতিক রূপ',
  '2 Sessions (Typically 7–10 Days)': '২ সেশন (সাধারণত ৭–১০ দিন)',
  '10–15 Years High Strength': '১০–১৫ বছর উচ্চ শক্তি',
  'Restores Full Biting & Chewing Power': 'সম্পূর্ণ কামড় ও চিবানোর ক্ষমতা ফিরিয়ে দেয়',
  'Nearly Invisible Aligners Available': 'প্রায় অদৃশ্য অ্যালাইনার পাওয়া যায়',
  '6–18 Months on Average': 'গড়ে ৬–১৮ মাস',
  'Long-Lasting Permanent Correction': 'দীর্ঘস্থায়ী স্থায়ী সংশোধন',
  'Lifelike & Natural Tooth Appearance': 'প্রাণবন্ত ও প্রাকৃতিক দাঁতের চেহারা',
  '2 Visits for a Custom Precision Fit': 'নিখুঁত ফিটের জন্য ২ ভিজিট',
  'Strengthens Teeth for 10-15+ Years': '১০–১৫+ বছর দাঁতকে শক্তিশালী রাখে',
  'Crafted from Zirconia & E.max': 'জিরকোনিয়া ও ই-ম্যাক্স দিয়ে তৈরি',
  'Removes Stains & Restores Shine': 'দাগ দূর করে উজ্জ্বলতা ফিরিয়ে দেয়',
  '30–45 Minutes': '৩০–৪৫ মিনিট',
  'Prevents Gum Disease & Bad Breath': 'মাড়ির রোগ ও মুখের দুর্গন্ধ প্রতিরোধ করে',
  'Every 6–12 Months': 'প্রতি ৬–১২ মাসে',
  'Preserves Natural Facial Structure': 'মুখের স্বাভাবিক গঠন রক্ষা করে',
  'Permanent Solution (with Implant/Bridge)': 'স্থায়ী সমাধান (ইমপ্লান্ট/ব্রিজসহ)',
  'Post-Extraction Care & Support': 'এক্সট্রাকশনের পর যত্ন ও সহায়তা',
  '7–10 Years Long Lasting': '৭–১০ বছর দীর্ঘস্থায়ী',
  '1-Year Quality Guarantee': '১ বছরের মানের নিশ্চয়তা',
  'PAIN-FREE TREATMENT': 'ব্যথামুক্ত চিকিৎসা',
  '1–2 SESSIONS ONLY': 'মাত্র ১–২ সেশন',
  'LIFETIME SUCCESS': 'আজীবন সফলতা',
  '100% STERILE TOOLS': '১০০% জীবাণুমুক্ত যন্ত্র',
  '4 to 8 Shades Whiter Smile': '৪–৮ শেড উজ্জ্বল হাসি',
  '45–60 Minutes': '৪৫–৬০ মিনিট',
  '6 Months to 2 Years': '৬ মাস থেকে ২ বছর',
  'Enamel Safe & Pain-Free': 'এনামেলের জন্য নিরাপদ ও ব্যথামুক্ত',
};

const bnFeatureTitle = (text: string) => BN_FEATURE_TITLES[text] || text;
const bnFeatureSub = (text: string) => BN_FEATURE_SUBS[text] || text;

export default function ServicesPublicSingle({
  item,
  doctors = [],
  locations = [],
  related = [],
  nav_menu,
  is_bn = false,
  language_urls,
}: Props) {
  const page = usePage();
  const siteUrl = String((page.props as any)?.site_url || 'https://techdentalcare.com').replace(/\/+$/, '');
  const copy = getWebsiteTexts((page.props as any)?.site_settings?.website_texts);
  const isBn = Boolean(is_bn);

  const [selectedBranch, setSelectedBranch] = useState("");
  const [seoOpen, setSeoOpen] = useState(false);
  const [mainImg, setMainImg] = useState<string>(
    item?.hero_main || "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1000&q=80"
  );
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [appointmentDoctor, setAppointmentDoctor] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!item) return null;

  const L = isBn
    ? {
        details: 'বিস্তারিত',
        doctors: 'ডাক্তার',
        branches: 'শাখা',
        review: 'রিভিউ',
        faq: 'প্রশ্ন',
        book: 'অ্যাপয়েন্টমেন্ট নিন',
        whatsapp: 'হোয়াটসঅ্যাপ',
        popular: 'জনপ্রিয়',
        results: 'বাস্তব রোগীর ফলাফল',
        faqHeading: 'সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)',
        startingPrice: 'শুরুর মূল্য',
        category: 'ডেন্টাল',
        moreAbout: 'সম্পর্কে আরও জানুন',
        demoNote: 'ডেমো মূল্য, প্রয়োজনে সম্পাদনা করুন',
        detailTab: 'বিস্তারিত',
      }
    : {
        details: 'Details',
        doctors: 'Doctors',
        branches: 'Branches',
        review: 'Review',
        faq: 'FAQ',
        book: 'Book Appointment',
        whatsapp: 'WhatsApp',
        popular: 'Popular',
        results: 'Real cases',
        faqHeading: 'Frequently Asked Questions (FAQ)',
        startingPrice: 'Starting Price',
        category: item.category || 'Dental',
        moreAbout: 'More About',
        demoNote: 'Demo price, edit as needed',
        detailTab: 'Details',
      };

  const title = isBn ? (item.title_bn || item.title) : item.title;
  const shortDesc = isBn
    ? (item.short_desc_bn || item.meta_desc_bn || item.short_desc)
    : item.short_desc;
  const detailsHeading = isBn
    ? (item.details_heading_bn || `${title} সম্পর্কে আরও জানুন`)
    : (item.details_heading || `More About ${title}`);
  const detailsHtml = isBn ? (item.details_html_bn || item.details_html) : item.details_html;

  // Dynamic item data from database — no fallback to hardcoded mock arrays on deletion
  const features = (Array.isArray(item.features) ? item.features : []).map((f) =>
    isBn ? { title: bnFeatureTitle(f.title), sub: bnFeatureSub(f.sub) } : f
  );
  const pricingCards = (Array.isArray(item.pricing_cards) ? item.pricing_cards : []).map((card) => {
    if (!isBn) return card;
    const tier = (card.title || '').split(' - ').pop() || '';
    const tierBn: Record<string, string> = { Basic: 'বেসিক', Standard: 'স্ট্যান্ডার্ড', Premium: 'প্রিমিয়াম' };
    const shortBn = (item.details_heading_bn || `${title} সম্পর্কে আরও জানুন`).replace(/\s*সম্পর্কে আরও জানুন\s*$/, '').trim();
    return { ...card, title: `${shortBn} - ${tierBn[tier] || tier}`, note: L.demoNote };
  });
  const results = Array.isArray(item.results) ? item.results : [];
  const reviews = Array.isArray(item.reviews) ? item.reviews : [];
  const faqs = isBn
    ? (Array.isArray(item.faqs_bn) && item.faqs_bn.length ? item.faqs_bn : (Array.isArray(item.faqs) ? item.faqs : []))
    : (Array.isArray(item.faqs) ? item.faqs : []);

  const shortName = (() => {
    const heading = isBn
      ? (item.details_heading_bn || `${title} সম্পর্কে আরও জানুন`)
      : (item.details_heading || item.title || 'Treatment');
    return heading
      .replace(/^More About\s+/i, '')
      .replace(/\s*সম্পর্কে আরও জানুন\s*$/, '')
      .trim();
  })();

  const pricingHeading = isBn
    ? `${shortName} এর ধরন ও মূল্য`
    : `Types of ${shortName} with prices`;

  const displayThumbs = [
    item.hero_main,
    ...(Array.isArray(item.hero_thumbs) ? item.hero_thumbs : [])
  ].filter(Boolean) as string[];

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'details', label: L.details },
    { key: 'doctors', label: L.doctors },
    { key: 'branches', label: L.branches },
    ...(reviews.length > 0 ? [{ key: 'review' as TabKey, label: L.review }] : []),
    ...(faqs.length > 0 ? [{ key: 'faq' as TabKey, label: L.faq }] : []),
  ];

  const displayDoctors = doctors.slice(0, 2).length ? doctors.slice(0, 2) : [
    {
      id: 1,
      name: "Dr. Aysha Siddika",
      degree: "BDS, PGT (Oral & Maxillofacial Surgery)",
      designation: "Assistant Medical Director",
      branch: "Mirpur",
      bmdc: "7897",
      visiting_time: "4.00 PM – 9.00 PM",
      experience: "8 Years",
      specialty: "Root Canal, Aesthetic & Kids Dentistry",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      name: "Dr. Afsana Haque Joty",
      degree: "BDS (DU), PGT (Paediatric Dentistry)",
      designation: "Branch In Charge & Senior Surgeon",
      branch: "Mirpur",
      bmdc: "11071",
      visiting_time: "4.00 PM – 8.00 PM",
      experience: "5.5 Years",
      specialty: "Paediatric Dentistry, Crown & Root Canal",
      image: "https://images.unsplash.com/photo-1594824432258-0056637b77ab?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const pagePath = isBn
    ? `/bn/service/${item.slug_bn || item.slug}`
    : `/service/${item.slug}`;
  const pageTitle = isBn
    ? (item.seo_title_bn || title)
    : (item.seo_title || title);
  const pageDesc = isBn
    ? (item.meta_desc_bn || item.short_desc_bn || item.short_desc || '')
    : (item.meta_desc || item.short_desc || `Learn more about ${item.title} at Tech Dental Care. Specialist dental treatments with modern equipment in Dhaka.`);
  const pageRobots = `${item.robots_index !== false ? 'index' : 'noindex'}, ${item.robots_follow !== false ? 'follow' : 'nofollow'}`;

  const alternates = {
    en: `${siteUrl}/service/${item.slug}`,
    ...(item.slug_bn ? { bn: `${siteUrl}/bn/service/${item.slug_bn}` } : {}),
    'x-default': `${siteUrl}/service/${item.slug}`,
  };

  const serviceJsonLd = useMemo(() => {
    const url = `${siteUrl}${pagePath}`;
    const graph: any[] = [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        "name": title,
        "description": pageDesc,
        "serviceType": shortName,
        "url": url,
        ...(item.hero_main ? { "image": `${siteUrl}${item.hero_main}` } : {}),
        "provider": {
          "@type": "Dentist",
          "name": "Tech Dental Care",
          "url": siteUrl,
          "telephone": "+8809638000505",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "827 (2nd Floor), Shewrapara, Begum Rokeya Sarani",
            "addressLocality": "Mirpur, Dhaka",
            "postalCode": "1216",
            "addressCountry": "BD",
          },
        },
        "areaServed": { "@type": "City", "name": "Dhaka" },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "BDT",
          ...((item.price || '').replace(/[^\d]/g, '') ? { "price": (item.price || '').replace(/[^\d]/g, '') } : {}),
          "availability": "https://schema.org/InStock",
          "url": url,
        },
      },
    ];

    if (faqs.filter((f) => f.q).length > 0) {
      graph.push({
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        "mainEntity": faqs.filter((f) => f.q).map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      });
    }

    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": isBn ? 'হোম' : 'Home', "item": siteUrl },
        { "@type": "ListItem", "position": 2, "name": isBn ? 'সেবাসমূহ' : 'Services', "item": `${siteUrl}${isBn ? '/bn/services' : '/services'}` },
        { "@type": "ListItem", "position": 3, "name": title, "item": url },
      ],
    });

    return { "@context": "https://schema.org", "@graph": graph };
  }, [isBn, title, shortName, pageDesc, pagePath, faqs, item, siteUrl]);

  return (
    <div className="min-h-screen bg-white text-gray-800 antialiased font-sans" style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', 'SolaimanLipi', 'Noto Sans Bengali', sans-serif" }}>
      <Seo
        title={pageTitle}
        description={pageDesc}
        path={pagePath}
        image={item.hero_main}
        type="website"
        robots={pageRobots}
        alternates={alternates}
        schema={serviceJsonLd}
        noSuffix={isBn}
      />

      {/* 1. Header with Brand & Synchronized Branch Selector & Navigation Drawer */}
      <TopHeader
        locations={locations.length ? locations : []}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        navMenu={nav_menu}
        showLanguageSwitcher={true}
        languageUrls={language_urls}
      />

      {/* HERO SECTION */}
      <section className="w-full px-4 sm:px-8 lg:px-16 py-8 lg:py-10 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left: Images */}
          <div className="space-y-4">
            <div className="w-full h-80 sm:h-96 md:h-[450px] rounded-3xl overflow-hidden shadow-lg bg-gray-100">
              <img src={mainImg} alt={title} className="w-full h-full object-cover transition-all duration-300" />
            </div>

            {displayThumbs.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {displayThumbs.slice(1, 4).map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setMainImg(img)}
                    className={`h-24 sm:h-32 rounded-2xl overflow-hidden cursor-pointer border-2 transition ${mainImg === img ? 'border-[#f43f5e]' : 'border-transparent hover:border-[#f43f5e]'
                      }`}
                  >
                    <img src={img} alt={`${title} view ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Content */}
          <div className="flex flex-col justify-center">
            {item.category && (
              <span className="inline-block bg-rose-50 text-[#8f163b] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 w-fit border border-rose-100">
                {L.category}
              </span>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              {title}
            </h1>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl sm:text-4xl font-bold text-[#e11d48]">
                {item.price || "৳ 35,000"}
              </span>
              <span className="text-gray-500 text-sm font-medium">
                {isBn ? L.startingPrice : (item.price_suffix || "Starting Price")}
              </span>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {shortDesc || "A titanium implant replaces the root of a missing tooth and holds a natural-looking crown. It feels, looks and works like your own tooth, with no need to grind down healthy neighbours."}
            </p>

            {/* Features Grid */}
            {features.length > 0 && (
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-10">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-4 p-2.5 sm:p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                    <div className="bg-[#ffe4e6] p-1.5 sm:p-2 rounded-full text-[#e11d48] shrink-0">
                      <FeatureIcon index={i} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-[12px] sm:text-sm leading-tight">{f.title}</h4>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 leading-tight">{f.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/appointment?service=${encodeURIComponent(title)}`}
                className="flex-1 bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold py-3.5 px-6 rounded-xl shadow-md transition flex justify-center items-center gap-2 cursor-pointer"
              >
                <CalendarCheck size={18} />
                <span>{L.book}</span>
              </Link>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-[#128C7E] hover:bg-[#075E54] text-white font-semibold py-3.5 px-6 rounded-xl shadow-md transition flex justify-center items-center gap-2"
              >
                <Phone size={18} />
                <span>{L.whatsapp}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      {pricingCards.length > 0 && (
        <section className="bg-gray-50 py-8 lg:py-10 border-y border-gray-200">
          <div className="w-full px-4 sm:px-8 lg:px-16 mx-auto">
            <div className="text-left md:text-center max-w-3xl mx-auto mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {pricingHeading}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingCards.map((card, i) => (
                <div
                  key={i}
                  className={`bg-white rounded-3xl p-8 shadow-sm flex flex-col relative ${card.popular ? 'border-2 border-[#f43f5e]' : 'border border-gray-100'
                    }`}
                >
                  {card.popular && (
                    <div className="absolute -top-3 left-8 bg-[#ffe4e6] text-[#e11d48] text-xs font-bold px-3 py-1 rounded-full z-10">
                      {L.popular}
                    </div>
                  )}

                  <div className="w-full h-40 mb-6 rounded-2xl overflow-hidden bg-gray-100 shrink-0 group mt-2">
                    <img
                      src={card.img}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-6">{card.title}</h3>

                  <div className="mb-8 flex-grow">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-[#e11d48]">{card.price}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{card.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RESULTS SECTION */}
      {results.length > 0 && (
        <section className="pt-8 pb-3 bg-white">
          <div className="w-full px-4 sm:px-8 lg:px-16 mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{L.results}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-2">
              {results.map((img, i) => (
                <div key={i} className="group">
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 relative">
                    <img
                      src={img}
                      alt={isBn ? `চিকিৎসার আগে ও পরে ${i + 1}` : `Before and after case ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEO CONTENT SECTION (Tabbed Accordion) */}
      <section className="pt-1 pb-6 sm:pb-8 bg-white">
        <div className="w-full px-4 sm:px-8 lg:px-16 mx-auto">
          <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

            {/* Accordion Toggle Header */}
            <button
              type="button"
              onClick={() => setSeoOpen(!seoOpen)}
              aria-expanded={seoOpen}
              className="w-full flex justify-between items-center p-4 sm:p-5 focus:outline-none hover:bg-gray-50 transition cursor-pointer gap-3"
            >
              <span className="font-bold text-gray-900 text-left text-sm sm:text-base md:text-lg">
                {detailsHeading}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 shrink-0 ${seoOpen ? 'rotate-180' : ''
                  }`}
              />
            </button>

            {/* Accordion Body: Pure SEO Content */}
            {seoOpen && (
              <div className="p-6 sm:p-8 border-t border-gray-100 animate-in fade-in duration-200">
                <div className="w-full text-gray-700 text-sm sm:text-base leading-relaxed">
                  {detailsHtml ? (
                    <div
                      className="rich-content-view wp-editor-content prose max-w-none text-slate-800 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: detailsHtml }}
                    />
                  ) : (
                    <div className="space-y-4 text-slate-700">
                      <p>
                        <strong>{isBn ? `উন্নত ${title} – নিখুঁত হাসির জন্য` : `Advanced ${title || 'Dental Treatments'} for a Perfect Smile:`}</strong>{' '}
                        {isBn
                          ? 'আপনার হাসির সৌন্দর্য ও মুখের স্বাভাবিক কার্যকারিতা ফিরিয়ে আনা এখন আরও সহজ। আমরা আধুনিক প্রযুক্তি ও অভিজ্ঞ চিকিৎসকের মাধ্যমে দীর্ঘস্থায়ী ও প্রাকৃতিক ফলাফল নিশ্চিত করি।'
                          : 'Reclaiming your beautiful smile and optimal oral functionality has never been more achievable. We provide precision procedures and robust clinical outcomes that look, feel, and function naturally.'}
                      </p>
                      <p>
                        {isBn
                          ? 'ঢাকার মিরপুর, উত্তরা, বাদ্দা ও যাত্রাবাড়ী শাখায় আমাদের বিশেষজ্ঞ দল আন্তর্জাতিক মানের স্টেরিলাইজেশন ও ডিজিটাল প্রযুক্তি ব্যবহার করে।'
                          : 'Our expert dental team utilizes precision digital technology and advanced sterilization protocols across Mirpur, Uttara, Badda, and Jatrabari clinics in Dhaka.'}
                      </p>
                    </div>
                  )}
                </div>

                {faqs.filter(f => f.q).length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h2 className="font-bold text-gray-900 text-base sm:text-lg md:text-xl mb-3">
                      {L.faqHeading}
                    </h2>
                    <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                      {faqs.filter(f => f.q).map((f, i) => (
                        <div key={i}>
                          <button
                            type="button"
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            aria-expanded={openFaq === i}
                            className="w-full flex justify-between items-start gap-4 p-4 text-left hover:bg-gray-50 transition cursor-pointer"
                          >
                            <span className="font-semibold text-gray-900 text-sm sm:text-base">
                              {i + 1}. {f.q}
                            </span>
                            <ChevronDown
                              className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 shrink-0 ${openFaq === i ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {openFaq === i && (
                            <div className="px-4 pb-4 -mt-1">
                              {f.a ? (
                                <div
                                  className="rich-content-view wp-editor-content prose max-w-none text-slate-700 text-sm sm:text-base leading-relaxed"
                                  dangerouslySetInnerHTML={{ __html: f.a }}
                                />
                              ) : null}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      <GlobalFooter hideCtaStrip={true} />

      {/* Appointment Modal */}
      {appointmentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setAppointmentModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              ✕
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold text-sm">
                <CalendarCheck size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">{isBn ? 'অ্যাপয়েন্টমেন্ট নিন' : 'Book Appointment'}</h3>
                <p className="text-xs text-pink-700 font-medium">{appointmentDoctor || title}</p>
              </div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setAppointmentModalOpen(false); alert(isBn ? 'অ্যাপয়েন্টমেন্ট অনুরোধ জমা হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।' : 'Appointment request submitted! We will contact you shortly.'); }} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{isBn ? 'আপনার নাম' : 'Your Name'}</label>
                <input type="text" required placeholder={isBn ? 'যেমন: তানভীর হাসান' : 'e.g. Tanvir Hasan'} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{isBn ? 'ফোন নম্বর' : 'Phone Number'}</label>
                <input type="tel" required placeholder="017XXXXXXXX" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{isBn ? 'তারিখ' : 'Date'}</label>
                  <input type="date" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{isBn ? 'সময়' : 'Time Slot'}</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none">
                    <option>{copy.service_time_1}</option>
                    <option>{copy.service_time_2}</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex justify-center items-center gap-2 mt-3 cursor-pointer">
                <CalendarCheck size={14} /> {isBn ? 'অ্যাপয়েন্টমেন্ট নিশ্চিত করুন' : 'Confirm Appointment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
