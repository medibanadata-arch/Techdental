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

        {/* Scoped CSS from branch-mirpur (1).html */}
        <style>{`
          .hero-mirpur {
            display: flex;
            gap: 16px;
            width: 100%;
          }
          .hero-stage {
            flex: 3 1 0;
            min-width: 0;
            height: 480px;
            position: relative;
            border-radius: 32px;
            overflow: hidden;
            background: #EBC3D0;
            cursor: pointer;
          }
          .hero-stage-bg {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            transition: background-image 0.25s ease;
          }
          .hero-chips-top {
            position: absolute;
            left: 24px;
            right: 24px;
            top: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            z-index: 2;
            pointer-events: auto;
          }
          .hero-chip {
            height: 36px;
            padding: 0 14px;
            border-radius: 999px;
            font-size: 13px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .hero-chip-open {
            background: #fff;
            color: #146C43;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          }
          .hero-chip-open i {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #1E9E62;
            box-shadow: 0 0 0 4px rgba(30,158,98,.2);
          }
          .hero-chip-open span {
            color: #6B6065;
            font-weight: 600;
          }
          .hero-chip-dark {
            background: rgba(33,26,29,.55);
            backdrop-filter: blur(8px);
            color: #fff;
          }
          .hero-stage-body {
            position: absolute;
            left: 32px;
            right: 32px;
            bottom: 28px;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 24px;
            flex-wrap: wrap;
            color: #fff;
            z-index: 2;
            pointer-events: none;
          }
          .hero-stage-info {
            min-width: 0;
            flex: 1 1 360px;
            pointer-events: none;
          }
          .hero-rating {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            height: 34px;
            padding: 0 14px;
            border-radius: 999px;
            background: rgba(16,12,14,.68);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255,255,255,.3);
            font-size: 13px;
            font-weight: 600;
            color: #fff;
            box-shadow: 0 4px 14px rgba(0,0,0,0.25);
          }
          .hero-stage h1 {
            margin: 12px 0 0;
            font-size: 46px;
            line-height: 1.05;
            font-weight: 800;
            letter-spacing: -.025em;
            color: #fff;
            text-shadow: 0 2px 14px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.95);
          }
          .hero-stage-ctrl {
            display: flex;
            align-items: center;
            gap: 12px;
            pointer-events: auto;
          }
          .hero-counter {
            font-size: 14px;
            font-weight: 700;
            margin-right: 6px;
            color: #fff;
          }
          .hero-counter span {
            opacity: .6;
          }
          .hero-round {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: rgba(255,255,255,.2);
            border: 1px solid rgba(255,255,255,.35);
            display: grid;
            place-items: center;
            color: #fff;
            cursor: pointer;
            transition: background .15s, transform .15s;
          }
          .hero-round:hover {
            background: rgba(255,255,255,.34);
            transform: scale(1.05);
          }
          .hero-dots {
            display: none;
          }
          .hero-thumbs {
            flex: 1 1 0;
            min-width: 0;
            max-width: 340px;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .hero-thumb {
            flex: 1;
            min-height: 0;
            position: relative;
            border-radius: 28px;
            overflow: hidden;
            padding: 0;
            text-align: left;
            border: 0;
            cursor: pointer;
            background-size: cover;
            background-position: center;
            transition: transform .15s, filter .15s;
          }
          .hero-thumb:hover {
            transform: translateY(-2px);
            filter: brightness(.98);
          }
          .hero-thumb-label {
            position: absolute;
            left: 14px;
            bottom: 14px;
            height: 32px;
            padding: 0 12px;
            border-radius: 999px;
            background: rgba(255,255,255,.92);
            backdrop-filter: blur(4px);
            font-size: 12.5px;
            font-weight: 700;
            color: #211A1D;
            display: flex;
            align-items: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
          }

          /* Actions (Web / Desktop Grid matching columns above) */
          .hero-actions {
            position: relative;
            margin: 16px 0 0;
            padding: 0;
            background: none;
            box-shadow: none;
            border-radius: 0;
            display: flex;
            gap: 16px;
            width: 100%;
            z-index: 10;
          }
          .hero-actions-left {
            flex: 3 1 0;
            min-width: 0;
            background: #fff;
            border-radius: 28px;
            padding: 10px;
            box-shadow: 0 14px 34px -14px rgba(70,20,40,.18), 0 0 0 1px #EFE6E9;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }
          .hero-actions-right {
            flex: 1 1 0;
            min-width: 0;
            max-width: 340px;
            display: flex;
          }
          .hero-actions-right .hero-act-book {
            width: 100%;
            height: 100%;
            min-height: 56px;
            border-radius: 24px;
            background: #861A3D !important;
            color: #fff !important;
            font-weight: 800;
            font-size: 15.5px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            box-shadow: 0 10px 22px -10px #861A3D;
            text-decoration: none;
            transition: transform .15s, filter .15s;
          }
          .hero-actions-right .hero-act-book:hover {
            transform: translateY(-1px);
            filter: brightness(.97);
          }
          .hero-act {
            height: 56px;
            border-radius: 18px;
            background: #F8F2F4;
            font-size: 15px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            color: #211A1D;
            transition: transform .15s, filter .15s;
            text-decoration: none;
          }
          .hero-act:hover {
            transform: translateY(-1px);
            filter: brightness(.97);
          }
          .hero-act svg {
            color: #861A3D;
          }
          .hero-act-wa {
            background: #E6F5EC;
            color: #0F6A41;
          }
          .hero-act-wa svg {
            color: currentColor;
          }
          .hero-act-book {
            background: #861A3D !important;
            color: #fff !important;
            font-weight: 800;
            box-shadow: 0 10px 22px -10px #861A3D;
          }
          .hero-act-book svg {
            color: #fff !important;
            stroke: #fff !important;
          }
          .hero-act-book span {
            color: #fff !important;
          }

          /* Branch Info Section */
          .branch-info-sec {
            margin-top: 28px;
            margin-bottom: 24px;
          }
          .branch-info-card {
            background: #fff;
            border-radius: 32px;
            border: 1px solid #EFE6E9;
            padding: 56px;
            display: flex;
            flex-direction: column;
            gap: 48px;
            box-shadow: 0 4px 24px -10px rgba(70,20,40,.06);
          }
          .branch-eyebrow {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: .16em;
            color: #861A3D;
            text-transform: uppercase;
          }
          .branch-info-card h2 {
            margin: 14px 0 0;
            font-size: 40px;
            line-height: 1.1;
            font-weight: 800;
            letter-spacing: -.025em;
            color: #211A1D;
          }
          .branch-cols {
            display: flex;
            gap: 64px;
          }
          .branch-col {
            flex: 1 1 0;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          .branch-divider {
            width: 1px;
            flex: none;
            background: #F0E6E9;
          }
          .branch-label {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: .14em;
            color: #6B6065;
            text-transform: uppercase;
          }
          .branch-label svg {
            color: #861A3D;
          }
          .branch-addr {
            font-size: 22px;
            line-height: 1.4;
            font-weight: 700;
            color: #211A1D;
          }
          .branch-addr-sub {
            margin-top: 6px;
            font-size: 16px;
            color: #6B6065;
            font-weight: 500;
          }
          .branch-landmark {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            color: #6B6065;
            font-weight: 500;
          }
          .branch-landmark svg {
            width: 18px;
            height: 18px;
            color: #861A3D;
            flex-shrink: 0;
          }
          .branch-shifts {
            display: flex;
            flex-direction: column;
            gap: 14px;
          }
          .branch-shift {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 20px 24px;
            border-radius: 20px;
            background: #F8F2F4;
          }
          .branch-shift small {
            font-size: 15px;
            font-weight: 600;
            color: #6B6065;
          }
          .branch-shift b {
            font-size: 22px;
            font-weight: 800;
            letter-spacing: -.02em;
            color: #211A1D;
          }
          .branch-shift-eve {
            background: #861A3D;
            color: #fff;
          }
          .branch-shift-eve small {
            color: #fff;
            opacity: .85;
          }
          .branch-shift-eve b {
            color: #fff;
          }
          .branch-note {
            font-size: 14px;
            color: #6B6065;
            font-weight: 500;
          }
          .branch-note b {
            color: #211A1D;
          }

          /* Mobile responsive rules matching branch-mirpur (1).html */
          @media (max-width: 760px) {
            .hero-mirpur {
              display: block;
            }
            .hero-thumbs {
              display: none;
            }
            .hero-stage {
              height: 420px;
              border-radius: 28px;
            }
            .hero-chips-top {
              left: 16px;
              right: 16px;
              top: 16px;
            }
            .hero-chip {
              height: 34px;
              padding: 0 12px;
              font-size: 12.5px;
            }
            .hero-chip-views {
              display: none;
            }
            .hero-stage-body {
              left: 20px;
              right: 20px;
              bottom: 20px;
              display: block;
            }
            .hero-rating {
              height: 32px;
              padding: 0 12px;
              font-size: 12.5px;
            }
            .hero-stage h1 {
              font-size: 32px;
              margin: 8px 0 0;
              line-height: 1.15;
            }
            .hero-stage-ctrl {
              margin-top: 12px;
              justify-content: space-between;
            }
            .hero-counter {
              display: none;
            }
            .hero-round {
              width: 44px;
              height: 44px;
            }
            .hero-dots {
              display: flex;
              gap: 6px;
              align-items: center;
              order: -1;
            }
            .hero-dot {
              height: 28px;
              width: 14px;
              padding: 0;
              background: transparent;
              border: 0;
              cursor: pointer;
              display: grid;
              place-items: center;
            }
            .hero-dot::after {
              content: "";
              display: block;
              height: 6px;
              width: 6px;
              border-radius: 999px;
              background: rgba(255,255,255,.5);
              transition: width .2s;
            }
            .hero-dot.on {
              width: 30px;
            }
            .hero-dot.on::after {
              width: 22px;
              background: #fff;
            }
            .hero-actions {
              display: flex;
              flex-direction: column;
              margin: 14px 0 0;
              padding: 0;
              background: none;
              box-shadow: none;
              border-radius: 0;
              gap: 10px;
              width: 100%;
            }
            .hero-actions-left {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 10px;
              background: none;
              padding: 0;
              box-shadow: none;
              border-radius: 0;
            }
            .hero-actions-right {
              display: block;
              max-width: none;
              width: 100%;
            }
            .hero-act {
              height: 80px;
              border-radius: 22px;
              background: #fff;
              border: 1px solid #EFE6E9;
              flex-direction: column;
              gap: 8px;
              font-size: 13px;
            }
            .hero-act svg {
              width: 22px;
              height: 22px;
            }
            .hero-act-wa {
              background: #E6F5EC;
              border-color: #CFEBDB;
            }
            .hero-actions-right .hero-act-book,
            .hero-act-book {
              width: 100% !important;
              height: 58px !important;
              flex-direction: row !important;
              gap: 10px !important;
              font-size: 16px !important;
              border: 0 !important;
              border-radius: 20px !important;
              background: #861A3D !important;
              color: #ffffff !important;
              box-shadow: 0 10px 22px -10px #861A3D !important;
            }
            .hero-act-book span {
              color: #ffffff !important;
              font-weight: 800 !important;
            }
            .hero-act-book svg {
              color: #ffffff !important;
              stroke: #ffffff !important;
            }
            .branch-info-sec {
              margin-top: 22px;
              margin-bottom: 24px;
            }
            .branch-info-card {
              border-radius: 28px;
              padding: 28px 24px;
              gap: 32px;
            }
            .branch-info-card h2 {
              font-size: 30px;
              margin-top: 12px;
            }
            .branch-cols {
              flex-direction: column;
              gap: 32px;
            }
            .branch-divider {
              width: auto;
              height: 1px;
            }
            .branch-col {
              gap: 16px;
            }
            .branch-label {
              font-size: 11.5px;
              gap: 8px;
            }
            .branch-addr {
              font-size: 18px;
            }
            .branch-addr-sub {
              font-size: 14.5px;
              margin-top: 4px;
            }
            .branch-landmark {
              font-size: 13.5px;
              gap: 8px;
            }
            .branch-shifts {
              gap: 12px;
            }
            .branch-shift {
              padding: 18px 20px;
              border-radius: 18px;
              gap: 12px;
            }
            .branch-shift small {
              font-size: 14px;
            }
            .branch-shift b {
              font-size: 18px;
            }
            .branch-note {
              font-size: 13.5px;
            }
          }
        `}</style>

        {/* 1. HERO SLIDER */}
        <section className="hero-mirpur" aria-label="Branch photos">
          <div
            className="hero-stage group/stage"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => openLightbox(activeSlide)}
            title="Click to view full photo"
          >
            <div
              className="hero-stage-bg"
              style={{
                backgroundImage: `url('${galleryImages[activeSlide]}')`,
                backgroundColor: '#EBC3D0',
              }}
            />

            {/* Top Status & Views Chips */}
            <div className="hero-chips-top" onClick={(e) => e.stopPropagation()}>
              <div className="hero-chip hero-chip-open">
                <i />
                <span>
                  {branchStatus.isOpenNow
                    ? `Open now · ${branchStatus.subText || 'closes 9 PM'}`
                    : branchStatus.isOpenSoon
                      ? `Opening soon · ${branchStatus.subText || 'opens 10 AM'}`
                      : `Closed · ${branchStatus.subText || 'opens 10 AM'}`}
                </span>
              </div>
              <div className="hero-chip hero-chip-dark hero-chip-views">
                <Eye size={16} className="text-white" />
                <span>{(1800 + activeSlide * 340).toLocaleString()}</span>
              </div>
            </div>

            {/* Stage Body */}
            <div className="hero-stage-body">
              <div className="hero-stage-info">
                <div className="hero-rating">
                  <Star size={14} className="fill-[#FFB547] stroke-none text-[#FFB547]" />
                  <b>4.9</b>
                  <span>· {branch?.reviews_text || '2,500+ verified reviews'}</span>
                </div>
                <h1>{branchName}</h1>
              </div>

              {/* Controls */}
              <div className="hero-stage-ctrl" onClick={(e) => e.stopPropagation()}>
                <div className="hero-counter">
                  <b>{activeSlide + 1}</b> <span>/ {galleryImages.length}</span>
                </div>
                <div className="hero-dots">
                  {galleryImages.map((_, k) => (
                    <button
                      key={k}
                      type="button"
                      className={`hero-dot ${k === activeSlide ? 'on' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlide(k);
                      }}
                      aria-label={`Slide ${k + 1}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    className="hero-round"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevSlide();
                    }}
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    className="hero-round"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextSlide();
                    }}
                    aria-label="Next photo"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Right Side Thumbnails */}
          <div className="hero-thumbs">
            {[1, 2].map((offset) => {
              const k = (activeSlide + offset) % galleryImages.length;
              const imgUrl = galleryImages[k];
              const label =
                (gallery[k] as any)?.alt ||
                (gallery[k] as any)?.label ||
                slideLabels[k % slideLabels.length];
              return (
                <button
                  key={offset}
                  type="button"
                  className="hero-thumb"
                  onClick={() => setActiveSlide(k)}
                  style={{ backgroundImage: `url('${imgUrl}')`, backgroundColor: '#FAF7F5' }}
                  aria-label={`Show photo: ${label}`}
                >
                  <span className="hero-thumb-label">{label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. ACTIONS BAR */}
        <nav className="hero-actions" aria-label="Quick actions">
          <div className="hero-actions-left">
            <a href={`tel:${hotline}`} className="hero-act">
              <Phone size={18} />
              <span>{callLabel}</span>
            </a>
            <a href={mapUrl} target="_blank" rel="noreferrer" className="hero-act">
              <Send size={18} />
              <span>{directionsLabel}</span>
            </a>
            <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer" className="hero-act hero-act-wa">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.983zm11.455-7.394c-.068-.113-.25-.181-.524-.318-.274-.137-1.62-.8-1.871-.891-.25-.092-.432-.137-.614.137-.182.274-.707.891-.866 1.073-.16.182-.319.205-.593.068-.274-.137-1.157-.426-2.203-1.359-.815-.726-1.365-1.623-1.524-1.897-.16-.274-.017-.422.12-.559.123-.122.274-.319.41-.478.137-.16.182-.274.274-.457.091-.182.046-.342-.023-.478-.068-.137-.614-1.482-.841-2.031-.222-.535-.447-.462-.614-.471l-.524-.01c-.182 0-.478.068-.729.342-.25.274-.956.935-.956 2.28 0 1.345.979 2.645 1.116 2.828.137.182 1.928 2.943 4.671 4.128 2.743 1.185 2.743.79 3.245.744.502-.046 1.62-.662 1.848-1.3.228-.639.228-1.186.16-1.301z" />
              </svg>
              <span>{whatsappLabel}</span>
            </a>
          </div>
          <div className="hero-actions-right">
            <Link
              href={bookingUrl}
              className="hero-act hero-act-book !bg-[#861A3D] !text-white hover:opacity-95"
            >
              <CalendarCheck size={18} className="text-white shrink-0" />
              <span className="text-white font-extrabold">{bookLabel} appointment</span>
            </Link>
          </div>
        </nav>

        {/* 3. BRANCH INFO CARD */}
        <section className="branch-info-sec">
          <div className="branch-info-card">
            <div>
              <div className="branch-eyebrow">OUR BRANCH</div>
              <h2>{branchName}</h2>
            </div>

            <div className="branch-cols">
              {/* Location Column */}
              <div className="branch-col">
                <div className="branch-label">
                  <MapPin size={18} />
                  <span>LOCATION</span>
                </div>
                <div>
                  <div className="branch-addr">{addressMain}</div>
                  <div className="branch-addr-sub">
                    {addressSub || `${cleanBranch}, Dhaka`}
                  </div>
                </div>
                {landmarkText && (
                  <div className="branch-landmark">
                    <svg className="w-4.5 h-4.5 text-[#861A3D] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="3" width="14" height="14" rx="3" />
                      <path d="M5 11h14M9 21l2-4M15 21l-2-4" />
                    </svg>
                    <span>Landmark: {landmarkText}</span>
                  </div>
                )}
              </div>

              <div className="branch-divider" role="presentation" />

              {/* Opening Hours Column */}
              <div className="branch-col">
                <div className="branch-label">
                  <Clock size={18} />
                  <span>OPENING HOURS</span>
                </div>
                <div className="branch-shifts">
                  {morningHours && (
                    <div className="branch-shift">
                      <small>Morning</small>
                      <b>{morningHours}</b>
                    </div>
                  )}
                  <div className="branch-shift branch-shift-eve">
                    <small>{morningHours ? 'Evening' : 'Operating Hours'}</small>
                    <b>{eveningHours}</b>
                  </div>
                </div>
                <div className="branch-note">
                  {workingDays} · <b>{offDays}</b>
                </div>
              </div>
            </div>
          </div>
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
