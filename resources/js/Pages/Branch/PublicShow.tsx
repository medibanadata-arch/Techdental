import React, { useState, useRef, useMemo, useEffect } from "react";
import { Link, Head } from "@inertiajs/react";
import { TopHeader } from "@/Components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
import { PageProps } from '@inertiajs/core';
import { getBranchStatus } from "@/utils/branchStatus";
import {
  Phone,
  Send,
  CalendarCheck,
  Clock,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Eye,
  Building2,
  User,
  Award,
  Star,
  X,
  ZoomIn,
  ExternalLink,
  ArrowRight,
  Info
} from "lucide-react";

interface BranchItem {
  id: number;
  name: string;
  short_name: string;
  slug: string;
  address: string;
  address_main?: string;
  address_sub?: string;
  landmark?: string;
  phone: string;
  whatsapp?: string;
  booking_url?: string;
  call_label?: string;
  directions_label?: string;
  whatsapp_label?: string;
  book_label?: string;
  hours_text: string;
  morning_hours?: string;
  evening_hours?: string;
  working_days?: string;
  off_days?: string;
  time?: string;
  map_url: string;
  review_url?: string;
  reviews_text?: string;
  color_status?: string;
  appointment_btn_label?: string;
  more_about_title?: string;
  seo_title?: string;
  meta_desc?: string;
  canonical_url?: string;
  robots_index?: boolean;
  robots_follow?: boolean;
  schema_type?: string;
  schema_json?: string;
  faqs?: Array<{ q: string; a: string }>;
  seo_content?: string;
}

interface GalleryItem {
  id: number;
  src?: string;
  image?: string;
  url?: string;
  alt?: string;
  view_count?: number;
}

interface DoctorItem {
  id: number;
  name: string;
  deg: string;
  designation: string;
  img: string;
  visiting_time: string;
  experience_years: string;
  branch: string;
}

interface ServiceItem {
  id: number;
  title?: string;
  name?: string;
  desc?: string;
  price: string;
  image?: string;
}

interface Props extends PageProps {
  branch: BranchItem;
  gallery: GalleryItem[];
  doctors: DoctorItem[];
  services: ServiceItem[];
  locations?: any[];
  nav_menu?: any;
}

const BRAND = '#8B1538';

const DEFAULT_GALLERY = [
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&q=80&w=1200',
];

export default function BranchPublicShow({ branch, gallery = [], doctors = [], services = [], locations = [], nav_menu }: Props) {
  const [selectedBranch, setSelectedBranch] = useState(branch?.short_name?.toLowerCase() || 'mirpur');
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [isMoreAboutOpen, setIsMoreAboutOpen] = useState(false);

  // Safe gallery images extraction
  const safeGallery = Array.isArray(gallery) ? gallery : [];
  const mappedGallery = safeGallery
    .map((g: any) => (typeof g === 'string' ? g : g?.src || g?.image || g?.url || ''))
    .filter(Boolean);
  const galleryImages: string[] = mappedGallery.length > 0 ? mappedGallery : DEFAULT_GALLERY;

  // Lightbox Modal state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
      } else if (e.key === "Escape") {
        setLightboxOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, galleryImages.length]);

  const sliderRef = useRef<HTMLDivElement>(null);

  const rawBranchName = branch?.short_name || branch?.name || 'Mirpur';
  const cleanBranch = rawBranchName.replace(/branch/gi, '').trim();
  const branchName = `${cleanBranch} Branch`;
  const hotline = branch?.phone || '09638000505';
  const rawWa = branch?.whatsapp || hotline;
  let waNumber = rawWa.replace(/[^0-9]/g, '');
  if (waNumber.startsWith('01')) {
    waNumber = '88' + waNumber;
  }
  const mapUrl = branch?.map_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch?.address || '')}`;
  const callLabel = branch?.call_label || 'Call';
  const directionsLabel = branch?.directions_label || 'Directions';
  const whatsappLabel = branch?.whatsapp_label || 'WhatsApp';
  const bookLabel = branch?.book_label || 'Book';
  const bookingUrl = branch?.booking_url || '/appointment';

  const branchStatus = React.useMemo(() => {
    return getBranchStatus({
      shortName: branch?.short_name || branch?.name,
      time: branch?.hours_text || branch?.time,
    });
  }, [branch]);

  const addressMain = branch?.address_main || (
    branch?.address ? branch.address.split('(')[0].trim() : `${cleanBranch}, Dhaka`
  );
  const addressSub = branch?.address_sub || (
    branch?.address_main ? '' : ''
  );
  const landmarkText = branch?.landmark || (
    branch?.address && branch.address.includes('(')
      ? branch.address.substring(branch.address.indexOf('(') + 1).replace(')', '').trim()
      : ''
  );
  const morningHours = branch?.morning_hours;
  const eveningHours = branch?.evening_hours || branch?.hours_text || branch?.time || '4 PM – 9 PM';
  const workingDays = branch?.working_days || 'Saturday – Thursday';
  const workingDaysShort = workingDays
    .replace(/Saturday/gi, 'Sat')
    .replace(/Thursday/gi, 'Thu')
    .replace(/Wednesday/gi, 'Wed')
    .replace(/Tuesday/gi, 'Tue')
    .replace(/Monday/gi, 'Mon')
    .replace(/Sunday/gi, 'Sun');
  const offDays = branch?.off_days || 'Friday closed';

  const slideGallery = (direction: number) => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth * 0.55;
      sliderRef.current.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const visibleServices = servicesExpanded ? services.slice(0, 7) : services.slice(0, 3);

  const pageCanonical = branch?.canonical_url || `https://techdentalbd.com/branch/${branch?.slug || branch?.id}`;
  const metaTitle = branch?.seo_title || `Best Dental Clinic in ${branchName} — Tech Dental Care`;
  const metaDescription = branch?.meta_desc || `Visit Tech Dental ${branchName} in Dhaka for painless root canal therapy, dental implants, cosmetic veneers and general dental treatments.`;
  const robotsContent = `${branch?.robots_index !== false ? 'index' : 'noindex'}, ${branch?.robots_follow !== false ? 'follow' : 'nofollow'}`;

  const safeFaqs = useMemo(() => {
    if (!branch?.faqs) return [];
    if (Array.isArray(branch.faqs)) return branch.faqs;
    try {
      const p = typeof branch.faqs === 'string' ? JSON.parse(branch.faqs) : branch.faqs;
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }, [branch?.faqs]);

  const jsonLdSchema = useMemo(() => {
    if (branch?.schema_json) {
      try {
        return JSON.parse(branch.schema_json);
      } catch (e) { }
    }
    const type = branch?.schema_type || 'Dentist';
    const schema: any = {
      "@context": "https://schema.org",
      "@type": type,
      "name": `Tech Dental Care — ${branchName}`,
      "description": metaDescription,
      "url": pageCanonical,
      "telephone": hotline,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": branch?.address || '',
        "addressLocality": "Dhaka",
        "addressCountry": "BD"
      },
      "priceRange": "৳৳"
    };
    if (safeFaqs.length > 0) {
      return {
        "@context": "https://schema.org",
        "@graph": [
          schema,
          {
            "@type": "FAQPage",
            "mainEntity": safeFaqs.filter(f => f && f.q).map(f => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": f.a || ""
              }
            }))
          }
        ]
      };
    }
    return schema;
  }, [branch, pageCanonical, metaDescription, branchName, hotline, safeFaqs]);

  return (
    <div
      className="min-h-screen antialiased w-full"
      style={{ backgroundColor: '#F8F9FA', color: '#1E293B', fontFamily: "'Inter', sans-serif" }}
    >
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={pageCanonical} />
        <meta name="robots" content={robotsContent} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={pageCanonical} />
        <meta property="og:type" content="business.business" />
        <script type="application/ld+json">
          {JSON.stringify(jsonLdSchema)}
        </script>
      </Head>

      {/* 1. Header with Full Width */}
      <TopHeader
        locations={locations.length ? locations : [branch]}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        navMenu={nav_menu}
      />

      {/* Main Full Width Responsive Content */}
      <main className="w-full px-3.5 sm:px-6 md:px-8 lg:px-12 xl:px-16 mt-4 sm:mt-6 pb-6 sm:pb-8">

        {/* 2. Gallery Slider Section with View Counts & Arrows */}
        <div className="relative w-full mb-4 sm:mb-6 group/gallery">
          <div
            ref={sliderRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 sm:pb-3 scroll-smooth rounded-2xl sm:rounded-[2rem]"
          >
            {galleryImages.map((src, i) => (
              <div
                key={i}
                onClick={() => openLightbox(i)}
                className="relative flex-none w-[88vw] sm:w-[84vw] md:w-[60%] lg:w-[46%] h-[260px] sm:h-[320px] md:h-[450px] snap-center sm:snap-start rounded-2xl sm:rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow group/item"
              >
                <img
                  src={src}
                  alt={`${branchName} gallery ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-105"
                />

                {/* View Count Badge */}
                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                  <Eye size={14} className="text-slate-200" />
                  <span>{1800 + i * 340}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Slider Left / Right Navigation Buttons */}
          <button
            type="button"
            onClick={() => slideGallery(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 backdrop-blur text-white opacity-0 group-hover/gallery:opacity-100 transition-all duration-200 hover:bg-black/90 hover:scale-110 z-10 hidden md:flex items-center justify-center cursor-pointer shadow-lg"
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={() => slideGallery(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 backdrop-blur text-white opacity-80 group-hover/gallery:opacity-100 transition-all duration-200 hover:bg-black/90 hover:scale-110 z-10 hidden md:flex items-center justify-center cursor-pointer shadow-lg"
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* 3. Quick Actions & Status Bar (Mobile Only) */}
        <div className="w-full flex flex-col lg:hidden justify-between items-center mb-6 gap-3 relative z-20">
          <nav className="w-full grid grid-cols-4 gap-2 text-center py-2 select-none" aria-label={`Quick actions for ${cleanBranch} branch`}>
            {/* 1. Call */}
            <a
              href={`tel:${hotline}`}
              className="flex flex-col items-center group cursor-pointer transition-transform duration-180 active:scale-95 no-underline"
              aria-label={`${callLabel} ${cleanBranch}`}
            >
              <div className="w-14 h-14 rounded-full bg-white border border-slate-200/90 flex items-center justify-center text-blue-600 shadow-2xs group-hover:bg-slate-50 transition-all">
                <svg className="w-6 h-6 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
                </svg>
              </div>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight mt-1.5 transition-colors">
                {callLabel}
              </span>
            </a>

            {/* 2. Directions */}
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center group cursor-pointer transition-transform duration-180 active:scale-95 no-underline"
              role="button"
              tabIndex={0}
              aria-label={`${directionsLabel} ${cleanBranch}`}
            >
              <div className="w-14 h-14 rounded-full bg-white border border-slate-200/90 flex items-center justify-center text-blue-600 shadow-2xs group-hover:bg-slate-50 transition-all">
                <svg className="w-6 h-6 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 2 11 13" />
                  <path d="M22 2 15 22l-4-9-9-4z" />
                </svg>
              </div>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight mt-1.5 transition-colors">
                {directionsLabel}
              </span>
            </a>

            {/* 3. WhatsApp */}
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center group cursor-pointer transition-transform duration-180 active:scale-95 no-underline"
              aria-label={`${whatsappLabel} Tech Dental`}
            >
              <div className="w-14 h-14 rounded-full bg-white border border-slate-200/90 flex items-center justify-center shadow-2xs group-hover:bg-emerald-50/50 group-hover:border-emerald-300 group-hover:shadow-xs transition-all">
                <svg className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 448 512" fill="#25D366" style={{ color: '#25D366', fill: '#25D366' }} aria-hidden="true">
                  <path fill="#25D366" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                </svg>
              </div>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight mt-1.5 transition-colors">
                {whatsappLabel}
              </span>
            </a>

            {/* 4. Book */}
            <Link
              href={bookingUrl}
              className="flex flex-col items-center group cursor-pointer transition-transform duration-180 active:scale-95 no-underline"
              aria-label={`${bookLabel} Appointment`}
            >
              <div className="w-14 h-14 rounded-full bg-white border border-slate-200/90 flex items-center justify-center text-[#8B1038] shadow-2xs group-hover:bg-slate-50 transition-all">
                <svg className="w-6 h-6 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="3" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                  <path d="m9 16 2 2 4-4" />
                </svg>
              </div>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight mt-1.5 transition-colors">
                {bookLabel}
              </span>
            </Link>
          </nav>

          <div className={`w-full flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl border transition-colors ${branchStatus.isOpenNow
              ? 'bg-gradient-to-r from-emerald-50/90 to-teal-50/60 border-emerald-200/70'
              : branchStatus.isOpenSoon
                ? 'bg-gradient-to-r from-amber-50/90 to-orange-50/60 border-amber-200/70'
                : 'bg-slate-50 border-slate-200/80'
            }`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-xs border flex items-center justify-center relative shrink-0 ${branchStatus.isOpenNow
                  ? 'text-emerald-600 border-emerald-150'
                  : branchStatus.isOpenSoon
                    ? 'text-amber-600 border-amber-150'
                    : 'text-slate-400 border-slate-200'
                }`}>
                <Clock size={19} className="stroke-[2]" />
                {branchStatus.isOpenNow && (
                  <span className="absolute inset-0 rounded-full border border-emerald-400 animate-ping opacity-25" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${branchStatus.isOpenNow ? 'bg-emerald-500 animate-pulse' : branchStatus.isOpenSoon ? 'bg-amber-500' : 'bg-slate-400'
                    }`} />
                  <span className={`text-[13.5px] sm:text-[14.5px] font-extrabold tracking-tight truncate ${branchStatus.isOpenNow ? 'text-emerald-800' : branchStatus.isOpenSoon ? 'text-amber-900' : 'text-slate-800'
                    }`}>
                    {branchStatus.statusText}
                  </span>
                </div>
                <p className={`text-[11.5px] sm:text-[12.5px] font-medium truncate ${branchStatus.isOpenNow ? 'text-emerald-700/90' : branchStatus.isOpenSoon ? 'text-amber-800/90' : 'text-slate-500'
                  }`}>
                  {branchStatus.subText}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Quick Actions & Status Bar (Desktop Full Width) */}
        <div className="hidden lg:flex w-full bg-white p-3.5 rounded-3xl shadow-sm border border-slate-100 mb-8 relative z-20 gap-3.5 items-stretch">
          <a href={`tel:${hotline}`} className="flex-1 flex justify-center items-center gap-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer group py-3.5">
            <Phone size={18} className="text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-[15px] font-bold text-slate-800">{callLabel}</span>
          </a>

          <a href={mapUrl} target="_blank" rel="noreferrer" className="flex-1 flex justify-center items-center gap-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer group py-3.5">
            <Send size={18} className="text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-[15px] font-bold text-slate-800">{directionsLabel}</span>
          </a>

          <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer" className="flex-1 flex justify-center items-center gap-2.5 rounded-full bg-[#188B50] hover:bg-[#137442] text-white transition-all shadow-sm cursor-pointer group py-3.5 border border-[#188B50]">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.983zm11.455-7.394c-.068-.113-.25-.181-.524-.318-.274-.137-1.62-.8-1.871-.891-.25-.092-.432-.137-.614.137-.182.274-.707.891-.866 1.073-.16.182-.319.205-.593.068-.274-.137-1.157-.426-2.203-1.359-.815-.726-1.365-1.623-1.524-1.897-.16-.274-.017-.422.12-.559.123-.122.274-.319.41-.478.137-.16.182-.274.274-.457.091-.182.046-.342-.023-.478-.068-.137-.614-1.482-.841-2.031-.222-.535-.447-.462-.614-.471l-.524-.01c-.182 0-.478.068-.729.342-.25.274-.956.935-.956 2.28 0 1.345.979 2.645 1.116 2.828.137.182 1.928 2.943 4.671 4.128 2.743 1.185 2.743.79 3.245.744.502-.046 1.62-.662 1.848-1.3.228-.639.228-1.186.16-1.301z" />
            </svg>
            <span className="font-extrabold text-sm">{whatsappLabel}</span>
          </a>

          <Link href={bookingUrl} className="flex-1 flex justify-center items-center gap-2.5 rounded-full bg-[#C31E4D] hover:bg-[#A31840] text-white transition-all shadow-sm cursor-pointer group py-3.5 border border-[#C31E4D]">
            <CalendarCheck size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-[15px] font-bold">{bookLabel}</span>
          </Link>

          <div className={`flex-1 flex items-center justify-center gap-3 rounded-full border py-2.5 ${branchStatus.isOpenNow
              ? 'bg-[#ECFDF3] border-emerald-100/60'
              : branchStatus.isOpenSoon
                ? 'bg-[#FFFBEB] border-amber-100'
                : 'bg-slate-50 border-slate-200'
            }`}>
            <div className={`w-[38px] h-[38px] rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border ${branchStatus.isOpenNow ? 'text-[#059669] border-emerald-50' : branchStatus.isOpenSoon ? 'text-amber-600 border-amber-100' : 'text-slate-400 border-slate-100'
              }`}>
              <Clock size={17} />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${branchStatus.isOpenNow ? 'bg-[#059669]' : branchStatus.isOpenSoon ? 'bg-amber-500' : 'bg-slate-400'
                  }`} />
                <span className={`text-[14px] font-bold tracking-tight leading-none mt-0.5 ${branchStatus.isOpenNow ? 'text-[#059669]' : branchStatus.isOpenSoon ? 'text-amber-800' : 'text-slate-700'
                  }`}>
                  {branchStatus.statusText}
                </span>
              </div>
              <p className={`text-[12px] font-medium leading-none ${branchStatus.isOpenNow ? 'text-[#059669]/80' : branchStatus.isOpenSoon ? 'text-amber-700/80' : 'text-slate-500'
                }`}>
                {branchStatus.subText}
              </p>
            </div>
          </div>
        </div>

        {/* 4. Main Body Content (Fluid Column Layout) */}
        <div className="w-full flex flex-col gap-6">

          {/* Redesigned Branch Card from mirpur-branch (3).html */}
          <style>{`
            .td-branch-card {
              width: 100%;
              background: #fff;
              border-radius: 28px;
              border: 1px solid #ECE6E9;
              box-shadow: 0 24px 60px -30px rgba(120,20,50,.25);
              overflow: hidden;
              font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            }
            .td-branch-head {
              background: #7E1736;
              color: #fff;
              padding: 40px 48px;
              display: flex;
              align-items: center;
              gap: 20px;
            }
            .td-branch-head-icon {
              width: 64px;
              height: 64px;
              border-radius: 18px;
              background: rgba(255,255,255,.14);
              display: flex;
              align-items: center;
              justify-content: center;
              flex: none;
            }
            .td-branch-eyebrow {
              font-size: 13px;
              font-weight: 600;
              letter-spacing: .14em;
              text-transform: uppercase;
              color: #F6D3DD;
            }
            .td-branch-h1 {
              margin: 4px 0 0;
              font-size: 40px;
              line-height: 1.1;
              font-weight: 800;
              letter-spacing: -.02em;
              color: #ffffff;
            }
            .td-branch-body {
              padding: 40px 48px 48px;
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
              gap: 32px;
            }
            .td-branch-col {
              display: flex;
              flex-direction: column;
              gap: 20px;
            }
            .td-branch-label {
              font-size: 13px;
              font-weight: 700;
              letter-spacing: .12em;
              text-transform: uppercase;
              color: #5E5663;
            }
            .td-branch-addr {
              display: flex;
              gap: 16px;
              align-items: flex-start;
            }
            .td-branch-pin {
              flex: none;
              width: 44px;
              height: 44px;
              border-radius: 14px;
              background: #FBE9EF;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .td-branch-addr-main {
              display: block;
              font-size: 20px;
              font-weight: 700;
              line-height: 1.4;
              color: #1B1520;
            }
            .td-branch-addr-sub {
              display: block;
              font-size: 17px;
              line-height: 1.5;
              color: #4A4350;
              margin-top: 4px;
            }
            .td-branch-landmark {
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 16px 18px;
              border-radius: 16px;
              background: #F8F5F6;
              border: 1px dashed #D9CDD3;
              font-size: 15px;
              line-height: 1.45;
              color: #3A3340;
            }
            .td-branch-landmark svg {
              flex: none;
            }
            .td-branch-shifts {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
              gap: 14px;
            }
            .td-branch-shift {
              padding: 20px;
              border-radius: 18px;
            }
            .td-branch-shift.morning {
              background: #FBE9EF;
            }
            .td-branch-shift.morning .shift-n {
              color: #7E1736;
            }
            .td-branch-shift.morning .shift-t {
              color: #1B1520;
            }
            .td-branch-shift.evening {
              background: #7E1736;
              color: #fff;
            }
            .td-branch-shift.evening .shift-n {
              color: #F6D3DD;
            }
            .td-branch-shift.evening .shift-t {
              color: #fff;
            }
            .td-branch-shift .shift-n {
              font-size: 14px;
              font-weight: 700;
            }
            .td-branch-shift .shift-t {
              font-size: 20px;
              font-weight: 800;
              letter-spacing: -.01em;
              margin-top: 8px;
              line-height: 1.25;
              white-space: nowrap;
            }
            .td-branch-days {
              display: flex;
              align-items: center;
              gap: 16px;
              flex-wrap: wrap;
            }
            .td-branch-range {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 8px 14px;
              border-radius: 999px;
              background: #F2EEF0;
              font-size: 14px;
              font-weight: 700;
              color: #3A3340;
            }
            .td-branch-off {
              font-size: 14px;
              font-weight: 500;
              color: #6B6370;
            }
            @media(max-width: 600px) {
              .td-branch-card {
                border-radius: 24px;
              }
              .td-branch-head {
                padding: 16px 18px;
                gap: 12px;
              }
              .td-branch-head-icon {
                width: 40px;
                height: 40px;
                border-radius: 12px;
              }
              .td-branch-head-icon svg {
                width: 22px;
                height: 22px;
              }
              .td-branch-eyebrow, .td-branch-label, .td-branch-lm-label {
                display: none;
              }
              .td-branch-h1 {
                margin: 0;
                font-size: 22px;
              }
              .td-branch-body {
                padding: 16px 18px 18px;
                gap: 14px;
              }
              .td-branch-col {
                gap: 14px;
              }
              .td-branch-addr {
                gap: 10px;
              }
              .td-branch-pin {
                width: auto;
                height: auto;
                background: none;
                border-radius: 0;
                margin-top: 2px;
              }
              .td-branch-pin svg {
                width: 20px;
                height: 20px;
              }
              .td-branch-addr-main, .td-branch-addr-sub {
                display: inline;
                font-size: 14px;
                line-height: 1.5;
                margin: 0;
              }
              .td-branch-addr-main {
                color: #1B1520;
              }
              .td-branch-addr-sub {
                color: #4A4350;
                font-weight: 400;
              }
              .td-branch-addr-sub::before {
                content: ", ";
              }
              .td-branch-landmark {
                padding: 0;
                background: none;
                border: 0;
                border-radius: 0;
                gap: 8px;
                font-size: 13px;
                font-weight: 600;
                color: #7E1736;
              }
              .td-branch-landmark svg {
                width: 16px;
                height: 16px;
              }
              .td-branch-shifts {
                gap: 10px;
              }
              .td-branch-shift {
                padding: 12px 14px;
                border-radius: 16px;
              }
              .td-branch-shift .shift-n {
                font-size: 12px;
              }
              .td-branch-shift .shift-t {
                font-size: 16px;
                margin-top: 4px;
                line-height: 1.3;
              }
              .td-branch-days {
                justify-content: flex-start;
                gap: 12px;
              }
              .td-branch-range {
                padding: 7px 12px;
                font-size: 13px;
                gap: 7px;
              }
              .td-branch-range svg {
                width: 15px;
                height: 15px;
              }
              .td-branch-range .full-range {
                display: none;
              }
              .td-branch-range .short-range {
                display: inline;
              }
              .td-branch-off {
                font-size: 13px;
              }
            }
            @media(min-width: 601px) {
              .td-branch-range .short-range {
                display: none;
              }
            }
          `}</style>

          <section className="td-branch-card">
            <div className="td-branch-head">
              <div className="td-branch-head-icon">
                <svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16"/>
                  <path d="M14 10h5a1 1 0 0 1 1 1v10"/>
                  <path d="M2 21h20"/>
                  <path d="M8 8h2M8 12h2M8 16h2M17 14h1M17 17h1"/>
                </svg>
              </div>
              <div>
                <div className="td-branch-eyebrow">Our Branch</div>
                <h1 className="td-branch-h1">{branchName}</h1>
              </div>
            </div>

            <div className="td-branch-body">
              <div className="td-branch-col">
                <div className="td-branch-label">Location</div>
                <div className="td-branch-addr">
                  <div className="td-branch-pin">
                    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B4234A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <strong className="td-branch-addr-main">{addressMain}</strong>
                    {addressSub ? (
                      <span className="td-branch-addr-sub">{addressSub}</span>
                    ) : null}
                  </div>
                </div>
                {landmarkText ? (
                  <div className="td-branch-landmark">
                    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7E1736" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="3" width="16" height="13" rx="3"/>
                      <path d="M4 11h16M8 16l-2 5M16 16l2 5"/>
                    </svg>
                    <div><strong className="td-branch-lm-label">Landmark: </strong>{landmarkText}</div>
                  </div>
                ) : null}
              </div>

              <div className="td-branch-col">
                <div className="td-branch-label">Opening Hours</div>
                <div className="td-branch-shifts">
                  {morningHours && (
                    <div className="td-branch-shift morning">
                      <div className="shift-n">Morning</div>
                      <div className="shift-t">{morningHours}</div>
                    </div>
                  )}
                  <div className="td-branch-shift evening">
                    <div className="shift-n">{morningHours ? 'Evening' : 'Operating Hours'}</div>
                    <div className="shift-t">{eveningHours}</div>
                  </div>
                </div>
                <div className="td-branch-days">
                  <div className="td-branch-range">
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7E1736" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="3"/>
                      <path d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                    <span className="full-range">{workingDays}</span>
                    <span className="short-range">{workingDaysShort}</span>
                  </div>
                  <div className="td-branch-off">{offDays}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Specialist Doctors Section */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100 mb-4 relative group">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2.5">
                <User size={22} className="text-[#8B1538]" />
                <h2 className="text-xl font-bold text-slate-800">Specialist Doctors</h2>
              </div>
              <Link href="/doctors" className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline inline-flex items-center gap-1 whitespace-nowrap">
                View All →
              </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 scroll-smooth snap-x">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="w-[205px] min-w-[205px] max-w-[205px] sm:w-[225px] sm:min-w-[225px] sm:max-w-[225px] border-[1.5px] rounded-2xl p-3 flex flex-col relative shrink-0 bg-white shadow-2xs hover:shadow-md transition-shadow snap-start"
                  style={{ borderColor: BRAND }}
                >
                  <div className="relative w-full h-[130px] sm:h-[145px] rounded-xl overflow-hidden mb-2.5 bg-slate-100">
                    <img
                      src={doc.img || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'}
                      alt={doc.name}
                      className="w-full h-full object-cover object-[center_20%]"
                    />
                  </div>

                  <h3 className="text-[14.5px] sm:text-[15.5px] font-bold text-teal-700 text-center tracking-tight leading-snug line-clamp-1" title={doc.name}>
                    {doc.name}
                  </h3>
                  <p className="text-[11.5px] font-bold text-[#800038] mt-1 text-center line-clamp-1">
                    {doc.designation || 'Dental Specialist'}
                  </p>
                  {doc.deg && (
                    <p className="text-[10px] text-slate-500 mt-0.5 text-center line-clamp-1" title={doc.deg}>
                      {doc.deg.split(',')[0].trim()}
                    </p>
                  )}

                  <div className="w-full flex items-center justify-center gap-1.5 text-[10.5px] font-semibold text-slate-600 my-2.5 bg-slate-50 py-1.5 px-2 rounded-lg border border-slate-100">
                    <Clock size={11} className="text-slate-400 shrink-0" />
                    <span className="truncate">{doc.visiting_time || '4.00 PM - 9.00 PM'}</span>
                  </div>

                  <div className="flex gap-2 mt-auto w-full pt-1">
                    <Link
                      href={`/doctors/${doc.id}`}
                      className="flex-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center shadow-2xs text-center"
                    >
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/appointment"
                      className="flex-1 py-1.5 px-2 text-white text-[11px] font-bold rounded-lg transition-opacity hover:opacity-95 flex items-center justify-center shadow-2xs text-center"
                      style={{ backgroundColor: BRAND }}
                    >
                      <span>Book</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Services & Pricing */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-4 relative transition-all duration-500">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2.5 min-w-0">
                <Sparkles size={22} className="text-[#8B1538] shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold text-slate-800 whitespace-nowrap">Services &amp; Pricing</h2>
              </div>
              <div className="flex items-center gap-3">
                {servicesExpanded && (
                  <button
                    type="button"
                    onClick={() => setServicesExpanded(false)}
                    className="p-1.5 text-primary-maroon hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Collapse list"
                    aria-label="Collapse services list"
                  >
                    <ChevronUp size={20} className="stroke-[2.5]" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col relative">
              {visibleServices.map((svc, i) => (
                <Link
                  key={svc.id || i}
                  href={`/services/${svc.slug || svc.id}`}
                  className="flex items-center justify-between p-3.5 mb-3 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md hover:border-slate-200 hover:-translate-y-0.5 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={svc.image || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=100&h=100&fit=crop'}
                        className="w-full h-full object-cover"
                        alt={svc.title || svc.name || 'Treatment'}
                      />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-slate-800 group-hover:text-[#8B1538] transition-colors">
                        {(svc.title || svc.name || 'Treatment').split(/[-–—:]/)[0].trim()}
                      </h3>
                    </div>
                  </div>
                  <div className="text-right pl-2 shrink-0">
                    <span className="inline-block bg-[#fdf2f5] text-[#8B1538] text-sm font-bold px-3 py-1.5 rounded-xl whitespace-nowrap">
                      ৳ {String(svc.price || '1,500').replace(/^[৳\sBDTtk.]+/i, '').trim()}
                    </span>
                  </div>
                </Link>
              ))}

              {services.length > 3 && (
                <div className="mt-2 space-y-2">
                  {!servicesExpanded && (
                    <button
                      type="button"
                      onClick={() => setServicesExpanded(true)}
                      className="w-full py-2.5 rounded-xl border border-slate-200 text-primary-maroon font-bold text-xs hover:bg-rose-50/50 transition-colors flex justify-center items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <span>See more</span>
                      <ChevronDown size={14} />
                    </button>
                  )}

                  {servicesExpanded && (
                    <Link
                      href="/services"
                      className="group w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-[#800038]/5 via-[#800038]/10 to-[#800038]/5 hover:from-[#800038] hover:via-[#800038] hover:to-[#a01246] border border-[#800038]/20 hover:border-[#800038] text-[#800038] hover:text-white font-extrabold text-[0.84rem] shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                    >
                      <span>View All Services</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Google Reviews Section (Exact Card Style) */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-100 mb-4">
            {/* Top Rating Header */}
            <div className="flex items-center gap-3.5 sm:gap-4">
              {/* Star Icon Badge */}
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#fff7ed] flex items-center justify-center shrink-0 border border-amber-100/80 shadow-2xs">
                <Star size={26} className="text-[#f97316] fill-[#f97316]" />
              </div>

              {/* Rating Text & Stars */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
                    4.9
                  </span>
                  <div className="flex text-[#f97316] gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={15} fill="#f97316" color="#f97316" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[12.5px] sm:text-[13.5px] font-semibold text-slate-600">
                    2,500+ Verified Patient Reviews
                  </span>
                  {/* Blue Verified Badge */}
                  <svg className="w-4 h-4 text-[#1d9bf0] fill-[#1d9bf0] shrink-0" viewBox="0 0 24 24">
                    <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm3.707 7.293a1 1 0 0 0-1.414 0L10.5 13.086l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4.5-4.5a1 1 0 0 0 0-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Testimonial Quote Box with left rounded red/maroon accent */}
            <div className="bg-[#f8fafc] rounded-2xl p-4 sm:p-5 my-4 border-l-4 border-[#d62858]">
              <p className="italic text-slate-700 text-[13.5px] sm:text-[14.5px] leading-relaxed">
                "{branch?.reviews_text || 'Extremely gentle and painless treatment! The doctors explained every procedure clearly, and the clinic environment was spotless and reassuring.'}"
              </p>
            </div>

            {/* See All Google Reviews Button */}
            <a
              href={branch?.review_url || branch?.map_url || 'https://maps.google.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2.5 shadow-2xs group cursor-pointer"
            >
              {/* Google 4-Color 'G' Logo */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="text-slate-800 font-bold text-sm sm:text-[15px] group-hover:text-slate-900">
                See All Google Reviews
              </span>
            </a>
          </div>

          {/* CTA & Collapsible More About Section */}
          <div className="flex flex-col gap-4">
            <Link
              href={branch.booking_url || "/appointment"}
              className="w-full py-4 rounded-2xl text-white font-bold shadow-lg shadow-[#8B1538]/20 hover:opacity-95 transition-all flex justify-center items-center gap-2 text-base sm:text-lg text-center cursor-pointer active:scale-98"
              style={{ backgroundColor: BRAND }}
            >
              <CalendarCheck size={20} />
              <span>{branch.appointment_btn_label || "Book Now"}</span>
            </Link>

            <div className="w-full border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setIsMoreAboutOpen(!isMoreAboutOpen)}
                className="w-full py-4 px-5 sm:px-6 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base transition-all flex items-center justify-between text-left cursor-pointer active:scale-[0.99]"
              >
                <span className="text-left font-bold text-slate-800 text-sm sm:text-base">
                  {branch.more_about_title || `More About ${(branch.short_name || branch.name || '').replace(/\s*branch\s*$/i, '').trim()}`}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-slate-500 transition-transform duration-300 shrink-0 ${isMoreAboutOpen ? 'rotate-180 text-rose-700' : ''}`}
                />
              </button>

              {isMoreAboutOpen && (
                <div className="px-5 pb-6 border-t border-slate-100 animate-fade-in space-y-4">
                  {branch.seo_content ? (
                    <div
                      className="rich-content-view wp-editor-content prose prose-slate max-w-none text-slate-700 leading-relaxed mt-4"
                      dangerouslySetInnerHTML={{ __html: branch.seo_content }}
                    />
                  ) : (
                    <div className="text-sm text-slate-600 mt-4 space-y-3 leading-relaxed">
                      <h3 className="text-base font-bold text-slate-800 mb-1">
                        Premier Digital Dentistry & Comprehensive Oral Care in {branchName}
                      </h3>
                      <p>
                        Welcome to <strong>Tech Dental ({branchName})</strong>, your trusted destination for comprehensive, high-precision dental treatments in Dhaka. Conveniently situated with state-of-the-art dental chairs, German autoclaves, and certified specialists.
                      </p>
                      <p>
                        Our treatments include single-visit Rotary Root Canal, laser teeth whitening, aesthetic veneers, and durable dental implants adhering strictly to European sterilization protocols.
                      </p>
                    </div>
                  )}

                  {/* Patient FAQs */}
                  {safeFaqs.length > 0 && (
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <h4 className="text-sm font-bold text-slate-800">
                        Frequently Asked Questions ({cleanBranch} Clinic)
                      </h4>
                      <div className="space-y-2">
                        {safeFaqs.filter(f => f && f.q).map((faq, i) => (
                          <div key={i} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                            <div className="font-bold text-xs text-slate-900 mb-1">Q: {faq.q}</div>
                            <div className="text-xs text-slate-600 leading-relaxed">{faq.a}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* FULL-SCREEN GOOGLE BUSINESS / PHOTO GALLERY MODAL VIEWER */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 text-white flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-200 select-none">
          {/* DESKTOP LEFT SIDEBAR: THUMBNAIL LIST (PC VIEW ONLY) */}
          <div className="hidden md:flex flex-col w-[320px] lg:w-[360px] bg-neutral-950 border-r border-neutral-800 shrink-0 h-full">
            {/* Sidebar Title */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-white tracking-wide">
                  {branchName} Photos
                </h3>
                <p className="text-[0.68rem] text-neutral-400">
                  Tech Dental Care • {galleryImages.length} photos
                </p>
              </div>
            </div>

            {/* Vertical Scrollable Thumbnail Grid */}
            <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2.5 custom-scrollbar">
              {galleryImages.map((src, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer group bg-neutral-900 ${
                    idx === lightboxIndex
                      ? "border-sky-500 ring-2 ring-sky-500/50 scale-[0.98]"
                      : "border-transparent opacity-65 hover:opacity-100 hover:scale-[1.02]"
                  }`}
                >
                  <img
                    src={src}
                    alt={`${branchName} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {idx === lightboxIndex && (
                    <div className="absolute inset-0 bg-sky-500/10 pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN FULL PHOTO CONTAINER (PC & MOBILE) */}
          <div className="flex-1 flex flex-col h-full bg-black relative min-w-0">
            {/* Top Modal Header */}
            <div className="p-3 md:p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between z-20 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-900/80 border border-rose-500/40 flex items-center justify-center text-rose-300 font-extrabold text-xs">
                  TD
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-extrabold text-white leading-tight">
                    Tech Dental Care
                  </h4>
                  <p className="text-[0.65rem] md:text-[0.7rem] text-neutral-400">
                    {branchName} • Dhaka
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Center Image Viewing Area (Top Selection Image on Mobile / Full Area on Desktop) */}
            <div className="h-[42vh] md:h-auto md:flex-1 relative flex items-center justify-center p-2 md:p-6 bg-black shrink-0">
              {/* Previous Image Navigation Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
                }}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xl"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
              </button>

              {/* Active Image */}
              <img
                src={galleryImages[lightboxIndex] || galleryImages[0] || ''}
                alt={`${branchName} photo ${lightboxIndex + 1}`}
                className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300"
              />

              {/* Next Image Navigation Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xl"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
              </button>
            </div>

            {/* Footer Information Line (Desktop Only) */}
            <div className="hidden md:flex p-3 md:p-4 bg-neutral-950/80 border-t border-neutral-800 text-[0.68rem] md:text-xs text-neutral-400 items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-neutral-500" />
                <span>Images may be subject to copyright • Tech Dental Care</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[0.68rem] text-neutral-400">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{branch?.address || `${branchName}, Dhaka`}</span>
              </div>
            </div>

            {/* MOBILE BOTTOM SCROLLABLE GRID (MATCHING USER SCREENSHOT: 3-COLUMN ALL IMAGES GRID) */}
            <div className="md:hidden flex-1 min-h-0 bg-neutral-950 border-t border-neutral-800 flex flex-col overflow-hidden">
              <div className="px-3 pt-2.5 pb-1.5 text-[0.68rem] text-neutral-400 font-bold flex items-center justify-between uppercase tracking-wider shrink-0 border-b border-neutral-900">
                <span>ALL PHOTOS ({lightboxIndex + 1}/{galleryImages.length})</span>
                <span className="text-[0.62rem] text-neutral-500 font-normal">TAP TO VIEW</span>
              </div>

              {/* Vertical Scrollable 3-Column Grid */}
              <div className="flex-1 overflow-y-auto p-2.5 grid grid-cols-3 gap-2 custom-scrollbar">
                {galleryImages.map((src, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className={`relative aspect-square w-full rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-neutral-900 group ${
                      idx === lightboxIndex
                        ? "border-sky-500 ring-2 ring-sky-500/60 scale-[0.97]"
                        : "border-transparent opacity-65 hover:opacity-100 hover:scale-[1.02]"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {idx === lightboxIndex && (
                      <div className="absolute inset-0 bg-sky-500/15 pointer-events-none" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unified Global Footer (CTA strip hidden on branch page per user request) */}
      <GlobalFooter hideCtaStrip={true} />
    </div>
  );
}
