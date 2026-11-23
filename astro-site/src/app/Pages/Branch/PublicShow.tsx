import React, { useState, useRef, useMemo, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { TopHeader } from "@/Components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
import Seo from "@/Components/Seo";
import type { PageProps } from '@inertiajs/core';
import { getBranchStatus, parseAllBranchShifts } from "@/utils/branchStatus";
import { HOTLINE, WHATSAPP, buildWhatsAppUrl } from "@/utils/contact";
import {
  CalendarCheck,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building2,
  User,
  Award,
  Star,
  X,
  ZoomIn,
  ExternalLink,
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
  slug?: string;
  title?: string;
  title_bn?: string;
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

  // Small tooth mark used by the Services & Pricing heading
  const ToothIcon = ({ className = '' }: { className?: string }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7.5 3C4.9 3 3 4.9 3 7.6c0 1.7.6 3 1.2 4.4.7 1.6.9 3.3 1.3 5.1.3 1.5 1 2.6 2.2 2.6 1.3 0 1.6-1.5 2-3.1.2-.9.7-1.4 1.3-1.4s1.1.5 1.3 1.4c.4 1.6.7 3.1 2 3.1 1.2 0 1.9-1.1 2.2-2.6.4-1.8.6-3.5 1.3-5.1.6-1.4 1.2-2.7 1.2-4.4C21 4.9 19.1 3 16.5 3c-1.7 0-2.8.7-4.5.7S9.2 3 7.5 3z" />
    </svg>
  );

  // Helpers for the Services & Pricing cards
  const serviceName = (s: any) => String((s && (s.title || s.name)) || 'Dental Treatment').split(/[-–—:]/)[0].trim();
  const svcImage = (s: any) =>
    (s && s.image) ||
    'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80';
  const servicePrice = (s: any) => {
    const raw = String((s && s.price) || '').trim();
    if (!raw) return '৳ 1,500';
    return raw.startsWith('৳') ? raw : `৳ ${raw.replace(/^[৳\sBDTtk.]+/i, '').trim()}`;
  };
  const serviceBlurb = (s: any) => {
    const text = String((s && (s.short_desc || s.desc)) || '').replace(/\s+/g, ' ').trim();
    return text.length > 58 ? `${text.slice(0, 55).replace(/[\s,.;:-]+$/, '')}…` : text;
  };
  const serviceHref = (s: any) => `/service/${(s && (s.slug || s.id)) || ''}`;
  const [isMoreAboutOpen, setIsMoreAboutOpen] = useState(false);

  // Safe gallery images extraction — show each photo once even if it is attached twice.
  const seenGallery = new Set<string>();
  const safeGallery = (Array.isArray(gallery) ? gallery : []).filter((g: any) => {
    const raw = typeof g === 'string' ? g : g?.src || g?.image || g?.url || '';
    const key = String(raw).trim().replace(/^https?:\/\/[^/]+/i, '').replace(/\/+$/, '').toLowerCase();
    if (!key || seenGallery.has(key)) return false;
    seenGallery.add(key);
    return true;
  });
  const mappedGallery = safeGallery
    .map((g: any) => (typeof g === 'string' ? g : g?.src || g?.image || g?.url || ''))
    .filter(Boolean);
  const galleryImages: string[] = mappedGallery.length > 0 ? mappedGallery : DEFAULT_GALLERY;

  // Active slide state & touch swipe handlers for branch hero
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const slideLabels = [
    'Promotion banner',
    'Treatment room',
    'Reception area',
    'Consultation room',
    'Dental equipment',
    'Sterilization room',
  ];

  const prevSlide = () => {
    setActiveSlide((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) {
        setActiveSlide((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
      } else {
        setActiveSlide((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
      }
    }
    touchStartX.current = null;
  };

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
  const hotline = branch?.phone || HOTLINE;
  const waUrl = buildWhatsAppUrl(branch?.whatsapp || WHATSAPP);
  const mapUrl = branch?.map_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch?.address || '')}`;
  const callLabel = branch?.call_label || 'Call';
  const directionsLabel = branch?.directions_label || 'Directions';
  const whatsappLabel = branch?.whatsapp_label || 'WhatsApp';
  const bookLabel = branch?.book_label || 'Book';
  const bookingUrl = branch?.booking_url || '/appointment';

  const branchStatus = React.useMemo(() => {
    return getBranchStatus({
      shortName: branch?.short_name || branch?.name,
      time:
        [branch?.morning_hours, branch?.evening_hours].filter(Boolean).join(' | ') ||
        branch?.hours_text ||
        branch?.time,
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
  const cleanTimeStr = (str?: string | null) => {
    if (!str) return '';
    return str.replace(/:00\b/g, '');
  };
  const morningHours = cleanTimeStr(branch?.morning_hours);
  const eveningHours = cleanTimeStr(branch?.evening_hours || branch?.hours_text || branch?.time || '4 PM – 9 PM');
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

  // Services & Pricing: four treatments in the list, the fifth as its own feature card; the rest live on /services.
  const topServices = useMemo(() => (Array.isArray(services) ? services.slice(0, 4) : []), [services]);
  const featuredService = useMemo(
    () => (Array.isArray(services) ? services[4] || services[0] : null),
    [services]
  );

  const page = usePage();
  const siteUrl = String((page.props as any)?.site_url || 'https://techdentalcare.com').replace(/\/+$/, '');
  const branchPath = `/branch/${branch?.slug || branch?.id}`;
  const pageCanonical = `${siteUrl}${branchPath}`;
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

  // Shift schedule (supports split shifts such as Mirpur: 10 AM – 2 PM | 4 PM – 9 PM)
  const scheduleString = [morningHours, eveningHours].filter(Boolean).join(' | ') || branch?.hours_text || branch?.time || '';
  const { shifts: branchShifts } = useMemo(
    () => parseAllBranchShifts(scheduleString, branch?.short_name || branch?.name || ''),
    [scheduleString, branch]
  );

  const shiftLabelOf = (openMinutes: number) => {
    if (openMinutes < 12 * 60) return 'Morning';
    if (openMinutes < 16 * 60) return 'Afternoon';
    return 'Evening';
  };

  const statusPill = branchStatus.isOpenNow
    ? `Open now · ${branchStatus.subText || 'closes 9 PM'}`
    : branchStatus.isOpenSoon
      ? `Opening soon · ${branchStatus.subText || 'opens 3 PM'}`
      : branchStatus.isFriday
        ? 'Closed today · opens Saturday'
        : `Closed · ${branchStatus.subText || 'opens 3 PM'}`;

  // Auto-advance the photo carousel unless the lightbox is open
  useEffect(() => {
    if (lightboxOpen || galleryImages.length < 2) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % galleryImages.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [lightboxOpen, galleryImages.length]);

  return (
    <div
      className="min-h-screen antialiased w-full"
      style={{ backgroundColor: '#F8F9FA', color: '#1E293B', fontFamily: "'Inter', 'Plus Jakarta Sans', 'SolaimanLipi', 'Noto Sans Bengali', sans-serif" }}
    >
      <Seo
        title={metaTitle}
        description={metaDescription}
        canonical={pageCanonical}
        type="website"
        robots={robotsContent}
        image={branch?.image}
        schema={jsonLdSchema}
        noSuffix
      />

      {/* 1. Header with Full Width */}
      <TopHeader
        locations={locations.length ? locations : [branch]}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        navMenu={nav_menu}
      />

      {/* Main Full Width Responsive Content */}
      <main className="w-full px-3.5 sm:px-6 md:px-8 lg:px-12 xl:px-16 mt-4 sm:mt-6 pb-6 sm:pb-8">

                {/* Scoped CSS — branch hero & address (from supplied Jatrabari design) */}
        <style>{`
          .bs-page {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0;
            width: 100%;
            margin-bottom: 4px;
          }
          .bs-arch {
            position: relative;
            overflow: hidden;
            aspect-ratio: 1 / 1;
            background: #F8E9EE;
            border-radius: 28px;
          }
          .bs-track {
            position: absolute;
            inset: 0;
            display: flex;
            transition: transform .5s cubic-bezier(.22, 1, .36, 1);
            will-change: transform;
          }
          .bs-slide {
            flex: 0 0 100%;
            height: 100%;
            padding: 0;
            border: 0;
            background: none;
            cursor: zoom-in;
            display: block;
          }
          .bs-slide img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }
          .bs-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            background: rgba(255,255,255,.94);
            color: #1B1620;
            z-index: 3;
            border: 0;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(20,6,12,.16);
            transition: transform .15s, background .15s;
          }
          .bs-nav:hover {
            background: #fff;
            transform: translateY(-50%) scale(1.06);
          }
          .bs-nav.p { left: 14px; }
          .bs-nav.n { right: 14px; }
          .bs-dots {
            position: absolute;
            left: 50%;
            bottom: 16px;
            transform: translateX(-50%);
            display: flex;
            gap: 6px;
            z-index: 3;
            pointer-events: none;
          }
          .bs-dots i {
            width: 7px;
            height: 7px;
            border-radius: 9px;
            background: rgba(255,255,255,.6);
            transition: width .25s, background .25s;
          }
          .bs-dots i.on {
            width: 20px;
            background: #fff;
          }
          .bs-info {
            text-align: center;
            margin-top: 22px;
          }
          .bs-status {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #E3F5EC;
            color: #1E8E5A;
            font-weight: 700;
            font-size: 13px;
            padding: 7px 13px;
            border-radius: 99px;
          }
          .bs-status i {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: currentColor;
            box-shadow: 0 0 0 4px rgba(30,142,90,.14);
          }
          .bs-status.closed {
            background: #FBF0D9;
            color: #8A5A00;
          }
          .bs-status.closed i {
            box-shadow: 0 0 0 4px rgba(138,90,0,.12);
          }
          .bs-h1 {
            font-family: 'Playfair Display', Georgia, serif;
            font-weight: 600;
            font-size: clamp(34px, 8.5vw, 58px);
            line-height: 1.06;
            margin: 12px 0 0;
            letter-spacing: -.01em;
            color: #1B1620;
          }
          .bs-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin: 20px 0 0;
            padding: 0;
            list-style: none;
          }
          .bs-actions > li { display: contents; }
          .bs-act {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            height: 52px;
            padding: 0 24px;
            border-radius: 16px;
            border: 1px solid #E3DDE0;
            background: #fff;
            color: #1B1B22;
            font: 500 15px/1 Inter, system-ui, sans-serif;
            letter-spacing: .1px;
            text-decoration: none;
            cursor: pointer;
            white-space: nowrap;
            -webkit-tap-highlight-color: transparent;
            transition: transform .18s ease, border-color .18s ease, background .18s ease, color .18s ease;
          }
          .bs-act svg {
            width: 20px;
            height: 20px;
            flex: none;
            stroke: currentColor;
            fill: none;
            stroke-width: 1.8;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
          .bs-act:hover { transform: translateY(-1px); border-color: #8B1538; color: #8B1538; }
          .bs-act:active { transform: scale(.97); }
          .bs-act:focus-visible { outline: 2px solid #8B1538; outline-offset: 3px; }
          .bs-act.wa svg { color: #25D366; }
          .bs-act.wa:hover svg { color: #25D366; }
          .bs-act.wa:hover { border-color: #25D366; color: #128C4A; }
          .bs-act svg.fill { fill: currentColor; stroke: none; }
          .bs-act.book { background: #8B1538; border-color: #8B1538; color: #fff; }
          .bs-act.book:hover { background: #6E102C; border-color: #6E102C; color: #fff; }
          @media (max-width: 640px) {
            .bs-actions { gap: 10px; }
            .bs-act { flex: 1 1 0; min-width: 0; padding: 0; }
            .bs-act .bs-act-label {
              position: absolute;
              width: 1px;
              height: 1px;
              margin: -1px;
              padding: 0;
              overflow: hidden;
              clip: rect(0 0 0 0);
              white-space: nowrap;
              border: 0;
            }
          }
          .bs-list {
            list-style: none;
            padding: 0;
            margin: 22px 0 0;
            border-top: 1px solid #E8E6EC;
            text-align: left;
          }
          .bs-list > li {
            display: flex;
            gap: 14px;
            padding: 18px 0;
            border-bottom: 1px solid #E8E6EC;
          }
          .bs-lead {
            color: #8A1538;
            width: 22px;
            height: 22px;
            margin-top: 2px;
            flex: none;
          }
          .bs-grow {
            flex: 1;
            min-width: 0;
          }
          .bs-lbl {
            color: #6B6573;
            font-size: 13px;
            font-weight: 600;
          }
          .bs-addr {
            font-weight: 700;
            font-size: 16px;
            color: #1B1620;
            line-height: 1.4;
          }
          .bs-sub {
            color: #6B6573;
            font-size: 14px;
            margin-top: 2px;
          }
          .bs-shifts {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
          }
          .bs-shift {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            background: #FBF1F4;
            border: 1px solid #F1DFE6;
            border-radius: 12px;
            padding: 6px 11px;
          }
          .bs-shift em {
            font-style: normal;
            font-size: 9.5px;
            font-weight: 800;
            letter-spacing: .07em;
            text-transform: uppercase;
            color: #A16B7E;
          }
          .bs-shift strong {
            font-family: 'Plus Jakarta Sans', 'Inter', 'SolaimanLipi', 'Noto Sans Bengali', sans-serif;
            font-size: 14px;
            font-weight: 800;
            line-height: 1.2;
            white-space: nowrap;
            color: #1B1620;
            letter-spacing: -.01em;
          }
          @media (min-width: 900px) {
            .bs-page {
              grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
              gap: 56px;
              align-items: stretch;
              margin-top: 6px;
            }
            .bs-arch {
              position: sticky;
              top: 24px;
              aspect-ratio: auto;
            }
            .bs-info {
              text-align: left;
              margin-top: 0;
              max-width: none;
              justify-self: stretch;
            }
            .bs-actions { margin-top: 26px; }
            .bs-nav.p { left: 18px; }
            .bs-nav.n { right: 18px; }
          }
          @media (max-width: 899px) {
            .bs-nav { display: none; }
            .bs-arch { border-radius: 24px; }
          }
          @media (max-width: 480px) {
            .bs-info { margin-top: 20px; }
            .bs-shift { padding: 5px 9px; }
            .bs-shift strong { font-size: 13px; }
          }
        `}</style>

                {/* 1. HERO + BRANCH ADDRESS (Jatrabari design, DB-driven for all branches) */}
        <section className="bs-page" aria-label={`${branchName} photos and details`}>
          <div className="bs-arch">
            <div
              className="bs-track"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {galleryImages.map((src, i) => (
                <button
                  type="button"
                  key={`${src}-${i}`}
                  className="bs-slide"
                  onClick={() => openLightbox(i)}
                  aria-label={`Open photo ${i + 1} of ${galleryImages.length}`}
                  tabIndex={i === activeSlide ? 0 : -1}
                >
                  <img
                    src={src}
                    alt={(gallery[i] as any)?.alt || `${branchName} photo ${i + 1}`}
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                </button>
              ))}
            </div>

            <button type="button" className="bs-nav p" onClick={prevSlide} aria-label="Previous photo">
              <ChevronLeft size={20} />
            </button>
            <button type="button" className="bs-nav n" onClick={nextSlide} aria-label="Next photo">
              <ChevronRight size={20} />
            </button>

            <div className="bs-dots" aria-hidden="true">
              {galleryImages.map((_, k) => (
                <i key={k} className={k === activeSlide ? 'on' : ''} />
              ))}
            </div>
          </div>

          <section className="bs-info" aria-label="Branch address and opening hours">
            <span className={`bs-status ${branchStatus.isOpenNow ? '' : 'closed'}`}>
              <i />
              <span>{statusPill}</span>
            </span>

            <h1 className="bs-h1">{branch?.short_name || branch?.name || `${cleanBranch} Branch`}</h1>

            <ul className="bs-actions">
              <li>
                <a className="bs-act" href={`tel:${hotline}`} aria-label={callLabel} title={callLabel}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>
                  <span className="bs-act-label">{callLabel}</span>
                </a>
              </li>
              <li>
                <a className="bs-act" href={mapUrl} target="_blank" rel="noopener noreferrer" aria-label={directionsLabel} title={directionsLabel}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l18-8-8 18-2-8-8-2z" /></svg>
                  <span className="bs-act-label">{directionsLabel}</span>
                </a>
              </li>
              <li>
                <a className="bs-act wa" href={waUrl} target="_blank" rel="noopener noreferrer" aria-label={whatsappLabel} title={whatsappLabel}>
                  <svg className="fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                  <span className="bs-act-label">{whatsappLabel}</span>
                </a>
              </li>
              <li>
                <Link href={bookingUrl} className="bs-act book" aria-label={bookLabel} title={bookLabel}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="3" /><path d="M8 2v4M16 2v4M3 10h18M9 15l2 2 4-4" /></svg>
                  <span className="bs-act-label">{bookLabel}</span>
                </Link>
              </li>
            </ul>

            <ul className="bs-list">
              <li>
                <MapPin size={22} className="bs-lead" />
                <div className="bs-grow">
                  <div className="bs-lbl">Location</div>
                  <div className="bs-addr">{addressMain}</div>
                  {addressSub && <div className="bs-sub">{addressSub}</div>}
                </div>
              </li>

              {landmarkText && (
                <li>
                  <Building2 size={22} className="bs-lead" />
                  <div className="bs-grow">
                    <div className="bs-lbl">Landmark</div>
                    <div className="bs-addr">{landmarkText}</div>
                  </div>
                </li>
              )}

              <li>
                <Clock size={22} className="bs-lead" />
                <div className="bs-grow">
                  <div className="bs-lbl">Opening hours</div>
                  <div className="bs-sub">{workingDays}</div>

                  <div className="bs-shifts">
                    {branchShifts.map((s, i) => (
                      <span className="bs-shift" key={`${s.openMinutes}-${i}`}>
                        <em>{shiftLabelOf(s.openMinutes)}</em>
                        <strong>{s.displayStart} – {s.displayEnd}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            </ul>
          </section>
        </section>

        {/* 4. Main Body Content (Doctors, Services, Reviews) */}
        <div className="w-full flex flex-col gap-6 mt-6">

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
          {topServices.length > 0 && (
          <div className="bg-white rounded-3xl md:rounded-[28px] p-5 sm:p-6 md:p-9 shadow-sm md:shadow-none border border-slate-100 md:border-[#eadfe2] mb-4 relative">
            <div className="flex items-center gap-2.5 md:gap-3 mb-5 md:mb-6">
              <ToothIcon className="w-[22px] h-[22px] md:w-[30px] md:h-[30px] text-[#8B1538] md:text-[#9b1445] shrink-0" />
              <h2 className="text-lg sm:text-xl md:text-[28px] md:font-semibold md:tracking-tight md:text-[#1b2434] font-bold text-slate-800">Services &amp; Pricing</h2>
            </div>

            {/* Desktop: list rows + feature card + pill CTA */}
            <div className="hidden md:block">
              <div className="grid md:grid-cols-[1fr_1.05fr] gap-[22px] items-stretch">
                <div className="flex flex-col border-t border-[#eadfe2]">
                  {topServices.map((svc, i) => (
                    <Link
                      key={svc.id || i}
                      href={serviceHref(svc)}
                      className="grid grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-[18px] px-2 py-4 border-b border-[#eadfe2] no-underline text-inherit rounded-[14px] transition-colors hover:bg-[#fbeaf0] focus-visible:bg-[#fbeaf0] focus-visible:outline-none group"
                    >
                      <img
                        src={svcImage(svc)}
                        alt=""
                        loading="lazy"
                        className="w-[72px] h-[72px] rounded-[16px] object-cover bg-[#fbeaf0]"
                      />
                      <div className="min-w-0">
                        <h3 className="text-[18px] leading-snug font-semibold text-[#2a1a20] truncate">
                          {serviceName(svc)}
                        </h3>
                        <small className="block text-[14px] text-[#7a6a70] truncate">
                          {serviceBlurb(svc)}
                        </small>
                      </div>
                      <div className="text-right whitespace-nowrap">
                        <span className="block text-[12px] text-[#7a6a70]">from</span>
                        <span className="text-[18px] font-semibold text-[#6e0d31]">{servicePrice(svc)}</span>
                      </div>
                    </Link>
                  ))}
                </div>

                {featuredService && (
                  <Link
                    href={serviceHref(featuredService)}
                    className="relative rounded-[22px] overflow-hidden flex flex-col justify-end no-underline text-white min-h-[420px] bg-[#3a2a31] group focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#9b1445] focus-visible:outline-offset-[3px]"
                  >
                    <img
                      src={svcImage(featuredService)}
                      alt={serviceName(featuredService)}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(30,8,18,.9) 0%, rgba(30,8,18,0) 52%)' }}
                    />
                    <div className="relative flex items-end justify-between gap-4 px-6 py-[22px]">
                      <div className="min-w-0">
                        <h3
                          className="text-[24px] leading-[1.2] max-w-[20ch]"
                          style={{ fontFamily: 'Fraunces, Georgia, "Times New Roman", serif' }}
                        >
                          {serviceName(featuredService)}
                        </h3>
                        <span className="inline-block mt-2 text-[14px] opacity-90 border-b border-white/50">
                          View treatment details
                        </span>
                      </div>
                      <span className="bg-white text-[#6e0d31] font-semibold text-[18px] px-4 py-2 rounded-full whitespace-nowrap">
                        {servicePrice(featuredService)}
                      </span>
                    </div>
                  </Link>
                )}
              </div>

              <div className="flex justify-center mt-[26px]">
                <Link
                  href="/services"
                  className="bg-[#9b1445] hover:bg-[#6e0d31] text-white font-semibold px-[34px] py-[13px] rounded-full transition-all hover:-translate-y-px active:translate-y-0"
                >
                  See all services
                </Link>
              </div>
            </div>

            {/* Mobile: first four treatments, two per row (unchanged) */}
            <div className="grid grid-cols-2 gap-3 md:hidden">
              {topServices.map((svc, i) => (
                <Link key={svc.id || i} href={serviceHref(svc)} className="min-w-0 group rounded-2xl border border-slate-200 bg-white overflow-hidden">
                  <div className="aspect-[4/3] rounded-t-2xl overflow-hidden bg-slate-100">
                    <img
                      src={svcImage(svc)}
                      alt={serviceName(svc)}
                      className="w-full h-full object-cover transition-transform duration-300 group-active:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2.5">
                    <div className="text-[12px] leading-[1.25] font-bold text-slate-800 line-clamp-2">
                      {serviceName(svc)}
                    </div>
                    <div className="mt-1 text-[11px] font-bold text-[#8B1538] truncate">
                      {servicePrice(svc)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* See more → full services category page (plain link, no dropdown) */}
            <Link
              href="/services"
              className="md:hidden mt-4 w-full py-2.5 rounded-xl border border-slate-200 text-primary-maroon font-bold text-xs hover:bg-rose-50/50 transition-colors flex justify-center items-center cursor-pointer shadow-2xs"
            >
              <span>See more</span>
            </Link>
          </div>
          )}

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

            {/* Testimonial Quotes: one on mobile, two side by side (with a gap) on web */}
            <div className="grid md:grid-cols-2 gap-4 md:gap-6 my-4">
              {[
                branch?.reviews_text || 'Extremely gentle and painless treatment! The doctors explained every procedure clearly, and the clinic environment was spotless and reassuring.',
                'The doctors are very professional and the clinic is spotless. I got my braces treatment here and the follow-up care was excellent. Highly recommended!',
              ].map((text, i) => (
                <div
                  key={i}
                  className={`bg-[#f8fafc] rounded-2xl p-4 sm:p-5 border-l-4 border-[#d62858] ${i === 1 ? 'hidden md:block' : ''}`}
                >
                  <p className="italic text-slate-700 text-[13.5px] sm:text-[14.5px] leading-relaxed">
                    "{text}"
                  </p>
                </div>
              ))}
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
              <h2 className="m-0">
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
              </h2>

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
