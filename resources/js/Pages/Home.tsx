import React, { useState, useMemo } from "react";
import { CalendarCheck } from "lucide-react";
import { Link, Head, router } from "@inertiajs/react";
import { TopHeader } from "@/Components/TopHeader";
import { NavPills, NavPillKey } from "@/Components/NavPills";
import { MediaStrip } from "@/Components/MediaStrip";
import { QuickActions } from "@/Components/QuickActions";
import { BranchesSection } from "@/Components/BranchesSection";
import { DoctorsSection } from "@/Components/DoctorsSection";
import { ServicesSection } from "@/Components/ServicesSection";
import { ReviewsStrip } from "@/Components/ReviewsStrip";
import { GuidesSection } from "@/Components/GuidesSection";
import { MoreAboutSection } from "@/Components/MoreAboutSection";
import { BranchPickerModal } from "@/Components/BranchPickerModal";
import { DoctorProfileModal } from "@/Components/DoctorProfileModal";
import { AppointmentModal } from "@/Components/AppointmentModal";
import { GlobalFooter } from "@/Components/GlobalFooter";
import { DoctorItem, BranchInfo, BRANCHES_DATA } from "@/data/dentalData";
import { getBranchStatus } from "@/utils/branchStatus";
import { PageProps } from '@inertiajs/core';

interface HomeProps extends PageProps {
  locations?: any[];
  services?: any[];
  doctors?: any[];
  posts?: any[];
  featured_images?: any[];
  nav_menu?: any;
  home_content?: any;
}

export default function Home({
  locations = [],
  services = [],
  doctors = [],
  posts = [],
  featured_images = [],
  nav_menu,
  home_content,
}: HomeProps) {
  const [selectedBranch, setSelectedBranch] = useState("mirpur");
  const [activeNavPill, setActiveNavPill] = useState<NavPillKey>("overview");

  // Format branches dynamically with real-time open status
  const branchesData = useMemo(() => {
    const data: Record<string, BranchInfo> = {};
    Object.entries(BRANCHES_DATA).forEach(([k, b]) => {
      const st = getBranchStatus({ shortName: b.shortName, time: b.time });
      data[k] = {
        ...b,
        isOpenNow: st.isOpenNow,
        statusText: st.statusText,
      };
    });

    if (Array.isArray(locations) && locations.length > 0) {
      locations.forEach((loc) => {
        const key = loc.location_id || loc.id || loc.slug;
        const bStatus = getBranchStatus({
          shortName: loc.short_name || loc.name,
          time: loc.time || loc.hours_text,
        });
        const rawName = loc.name || loc.branch_name || loc.city || data[key]?.name || "Mirpur Branch";
        const fullName = rawName.includes("Branch") ? rawName : `${rawName} Branch`;
        if (key) {
          data[key] = {
            id: String(key),
            name: fullName,
            shortName: (loc.short_name || rawName).replace(/\bbranch\b/gi, '').trim(),
            address: loc.address || data[key]?.address || "",
            time: loc.time || data[key]?.time || "10:00 AM – 9:00 PM",
            phone: loc.phone || data[key]?.phone || "01400786162",
            whatsapp: loc.whatsapp || data[key]?.whatsapp || "01400786162",
            bookingUrl: loc.booking_url || data[key]?.bookingUrl || "/appointment",
            callLabel: loc.call_label || data[key]?.callLabel || "Call",
            directionsLabel: loc.directions_label || data[key]?.directionsLabel || "Directions",
            whatsappLabel: loc.whatsapp_label || data[key]?.whatsappLabel || "WhatsApp",
            bookLabel: loc.book_label || data[key]?.bookLabel || "Book",
            mapUrl: loc.map_url || data[key]?.mapUrl || "#",
            reviewUrl: loc.review_url || data[key]?.reviewUrl || "#",
            statusText: loc.status_text || bStatus.statusText,
            isOpenNow: loc.is_open_now !== undefined ? Boolean(loc.is_open_now) : bStatus.isOpenNow,
          };
        }
      });
    }
    return data;
  }, [locations]);

  // Normalize Doctors for DoctorsSection
  const normalizedDoctors = useMemo(() => {
    if (Array.isArray(doctors) && doctors.length > 0) {
      return doctors.map((d: any) => {
        const cleanBranch = d.branch_location || d.branch || "Mirpur";
        const role = d.specialty_banner || d.designation || d.spec || "Senior Dental Surgeon";
        const degrees = d.deg || d.qualification || "BDS (DU), PGT";
        const visitingTime = d.visiting_time || d.visiting_hours || d.time || "10:00 AM - 08:00 PM";
        const photo = d.img || d.photo_url || d.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80";

        return {
          id: d.id,
          name: d.name || "Doctor",
          branch: cleanBranch,
          branchTitle: cleanBranch,
          spec: role,
          degree: degrees,
          time: visitingTime,
          visiting_time: visitingTime,
          img: photo,
          profileUrl: `/doctors/${d.id}`,
          raw: d,
        };
      });
    }
    return [];
  }, [doctors]);

  // Modal States
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [appointmentService, setAppointmentService] = useState("");
  const [isBranchPickerOpen, setIsBranchPickerOpen] = useState(false);
  const [branchPickerType, setBranchPickerType] = useState<"directions" | "reviews">("directions");
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorItem | null>(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

  const currentBranch = branchesData[selectedBranch] || branchesData["mirpur"] || Object.values(branchesData)[0];

  // Branch synchronization
  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId);
  };

  // Nav pills smooth scroll with sticky header offset
  const handleSelectNavPill = (key: NavPillKey) => {
    setActiveNavPill(key);
    if (key === "overview") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(key);
      if (el) {
        const header = document.querySelector("header");
        const headerHeight = header ? header.offsetHeight : 72;
        const targetOffset = headerHeight + 16;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - targetOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth",
        });
      }
    }
  };

  // Quick Action Directions Trigger
  const handleOpenDirections = () => {
    setBranchPickerType("directions");
    setIsBranchPickerOpen(true);
  };

  // Reviews Branch Picker Trigger
  const handleOpenReviews = () => {
    setBranchPickerType("reviews");
    setIsBranchPickerOpen(true);
  };

  // Appointment Triggers
  const handleOpenBooking = (serviceOrDoctor?: string) => {
    if (serviceOrDoctor) {
      router.visit(`/appointment?service=${encodeURIComponent(serviceOrDoctor)}`);
    } else {
      router.visit("/appointment");
    }
  };

  // Doctor Profile Modal Trigger
  const handleViewDoctor = (doctor: any) => {
    setSelectedDoctor(doctor);
    setIsDoctorModalOpen(true);
  };

  const handleBookSpecificDoctor = (doctor: DoctorItem) => {
    setIsDoctorModalOpen(false);
    router.visit(`/appointment?doctor=${encodeURIComponent(doctor.name)}`);
  };

  const homeCanonical = home_content?.canonical_url || "https://techdentalbd.com";
  const homeTitle = home_content?.seo_title || "Tech Dental Care | Best Dental Clinic in Dhaka, Bangladesh (2026)";
  const homeDesc = home_content?.meta_desc || "টেক ডেন্টাল কেয়ার - মিরপুর, উত্তরা, বাড্ডা ও যাত্রাবাড়ী শাখায় অভিজ্ঞ ডেন্টাল সার্জনদের তত্ত্বাবধানে বিশ্বমানের ব্যথামুক্ত চিকিৎসা।";
  const homeRobots = `${home_content?.robots_index !== false ? "index" : "noindex"}, ${home_content?.robots_follow !== false ? "follow" : "nofollow"}`;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col w-full selection:bg-[#800038] selection:text-white font-['Hind_Siliguri','Inter',sans-serif]">
      <Head>
        <title>{homeTitle}</title>
        <meta name="description" content={homeDesc} />
        <link rel="canonical" href={homeCanonical} />
        <meta name="robots" content={homeRobots} />
        <meta property="og:title" content={homeTitle} />
        <meta property="og:description" content={homeDesc} />
        <meta property="og:url" content={homeCanonical} />
        <meta property="og:type" content="website" />
      </Head>

      {/* Main Viewport Container */}
      <main className="w-full bg-[#f8fafc] flex flex-col pb-8">
        
        {/* 1. Header with Brand & Synchronized Branch Selector */}
        <TopHeader
          locations={locations}
          selectedBranch={selectedBranch}
          onBranchChange={handleBranchChange}
          navMenu={nav_menu}
        />

        {/* 2. Navigation Pills (Overview, Branch, Doctors, Services) */}
        <div className="w-full max-w-5xl mx-auto">
          <NavPills
            activePill={activeNavPill}
            onSelectPill={handleSelectNavPill}
          />
        </div>

        {/* 3. Hero Image Gallery */}
        <div className="w-full max-w-5xl mx-auto">
          <MediaStrip initialImages={featured_images} />
        </div>

        {/* 4. Action Buttons (Call, Directions, WhatsApp, Book) */}
        <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 my-2">
          <QuickActions
            currentBranch={currentBranch}
            onOpenDirections={handleOpenDirections}
            onOpenBooking={() => handleOpenBooking()}
          />
        </div>

        {/* 5. Vertically Stacked Sections (Niche Niche / One below another - Full Width) */}
        <div className="w-full max-w-5xl mx-auto px-2 sm:px-6 space-y-4 md:space-y-6 mt-2">
          
          {/* SECTION 1: Our Branches */}
          <div id="branch-section" className="w-full bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <BranchesSection
              locations={locations}
              selectedBranch={selectedBranch}
              onSelectBranch={handleBranchChange}
            />
          </div>

          {/* SECTION 2: Specialist Doctors */}
          <div id="doctors-section" className="w-full bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <DoctorsSection
              doctors={normalizedDoctors}
              onViewDoctorProfile={handleViewDoctor}
            />
          </div>

          {/* SECTION 3: Services & Pricing */}
          <div id="services-wrapper" className="w-full">
            <ServicesSection
              services={services}
              onSelectServiceForBooking={(srv) => handleOpenBooking(srv)}
            />
          </div>

          {/* SECTION 4: Google Review */}
          <div id="reviews-section" className="w-full">
            <ReviewsStrip
              onOpenReviews={handleOpenReviews}
            />
          </div>

          {/* SECTION 5: Dental Guide */}
          <div id="blogs-section" className="w-full">
            <GuidesSection
              posts={posts}
              onSelectGuide={(guide: any) => handleOpenBooking(`Inquiry: ${guide.title}`)}
            />
          </div>

          {/* SECTION 6: Appointment CTA */}
          <div id="appointment-sec" className="w-full px-1 sm:px-4 py-2">
            <Link
              href="/appointment"
              className="w-full bg-[#800038] hover:bg-[#66002c] text-white py-3.5 px-4 rounded-2xl text-[0.95rem] font-bold flex items-center justify-center gap-2.5 shadow-md shadow-[#800038]/20 hover:shadow-lg transition-all duration-200 active:scale-98 cursor-pointer"
            >
              <CalendarCheck className="w-5 h-5" />
              <span>Make Appointment</span>
            </Link>
          </div>

          {/* SECTION 7: Tech Dental Care | Best Dental Clinic in Dhaka, Bangladesh (2026) */}
          <div id="about-sec" className="w-full">
            <MoreAboutSection content={home_content} />
          </div>

        </div>

      </main>

      {/* BRANCH PICKER MODAL (FOR DIRECTIONS & GOOGLE REVIEWS) */}
      <BranchPickerModal
        locations={locations}
        isOpen={isBranchPickerOpen}
        onClose={() => setIsBranchPickerOpen(false)}
        actionType={branchPickerType}
      />

      {/* DOCTOR PROFILE MODAL */}
      <DoctorProfileModal
        doctor={selectedDoctor}
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        onBookDoctor={handleBookSpecificDoctor}
      />

      {/* APPOINTMENT BOOKING MODAL */}
      <AppointmentModal
        locations={locations}
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        defaultBranch={selectedBranch}
        defaultService={appointmentService}
      />

      {/* Global Footer */}
      <GlobalFooter hideCtaStrip={true} />
    </div>
  );
}
