import React, { useState, useMemo } from "react";
import { Head } from "@inertiajs/react";
import { TopHeader } from "@/Components/TopHeader";
import { BranchPickerModal } from "@/Components/BranchPickerModal";
import { AppointmentModal } from "@/Components/AppointmentModal";
import { BranchInfo, BRANCHES_DATA } from "@/data/dentalData";
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

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  actionUrl?: string;
  actionText?: string;
  onAction?: () => void;
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
  const [aiInputValue, setAiInputValue] = useState("");
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Modal State
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: "",
    message: "",
    icon: "fa-tooth",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
  });

  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isBranchPickerOpen, setIsBranchPickerOpen] = useState(false);

  // Format branches dynamically
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

  const currentBranch = branchesData[selectedBranch] || branchesData["mirpur"] || Object.values(branchesData)[0];
  const hotline = currentBranch?.phone || home_content?.contact_phone || "09638000505";
  const rawWa = currentBranch?.whatsapp || hotline;
  let cleanWa = rawWa.replace(/[^0-9]/g, "");
  if (cleanWa.startsWith("01")) {
    cleanWa = "88" + cleanWa;
  }
  const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent("হ্যালো টেক ডেন্টাল, আমি চিকিৎসার বিষয়ে জানতে চাচ্ছি।")}`;

  // Gallery items matching screenshot style
  const galleryItems = useMemo(() => {
    if (Array.isArray(featured_images) && featured_images.length > 0) {
      return featured_images;
    }
    return [
      {
        id: 1,
        title: "টেক ডেন্টাল হেড অফিস",
        src: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
        branch: "Uttara",
        badge: "টেক ডেন্টাল হেড অফিস",
        badgeColor: "bg-[#e43324]",
        view_count: 2537,
      },
      {
        id: 2,
        title: "আধুনিক মাইক্রোস্কোপিক ডেন্টাল কেয়ার",
        src: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
        branch: "Badda",
        badge: "আধুনিক মাইক্রোস্কোপিক ডেন্টাল কেয়ার",
        badgeColor: "bg-[#1a73e8]",
        view_count: 1890,
      },
      {
        id: 3,
        title: "উন্নত ও আরামদায়ক চিকিৎসা পরিবেশ",
        src: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80",
        branch: "Uttara",
        badge: "বিশেষজ্ঞ পরামর্শ কেন্দ্র",
        badgeColor: "bg-[#059669]",
        view_count: 2237,
      },
    ];
  }, [featured_images]);

  // Handle Question Chips & AI input
  const handleSelectSuggestion = (text: string) => {
    setAiInputValue(text);
    processAIQuestion(text);
  };

  const handleAISubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiInputValue.trim()) {
      setModal({
        isOpen: true,
        title: "অনুগ্রহ করে লিখুন",
        message: "দাঁতের সমস্যা, খরচ কিংবা ঠিকানা সম্পর্কে জানতে বক্সে কিছু লিখে সাবমিট করুন।",
        icon: "fa-circle-exclamation",
        iconColor: "text-amber-600",
        iconBg: "bg-amber-100",
      });
      return;
    }
    processAIQuestion(aiInputValue.trim());
  };

  const processAIQuestion = (query: string) => {
    const q = query.toLowerCase();

    if (q.includes("ঠিকানা") || q.includes("শাখা") || q.includes("location") || q.includes("address") || q.includes("কোথায়")) {
      setModal({
        isOpen: true,
        title: "টেক ডেন্টালের শাখাসমূহ",
        message: `ঢাকা শহরে টেক ডেন্টালের ৪টি প্রধান শাখা রয়েছে:\n\n• মিরপুর শাখা: ৮২৭ (২য় তলা), শেওড়াপাড়া, বেগম রোকেয়া সরণি (মেট্রোরেল ৩১৮ নং পিলারের পূর্ব পাশে)\n• উত্তরা শাখা: হাউস ১৮, রোড ১৪, সেক্টর ৩, উত্তরা\n• বাড্ডা শাখা: হাজী আব্দুর রশিদ ম্যানশন (৩য় তলা), উত্তর বাড্ডা বাজার\n• যাত্রাবাড়ী শাখা: শহীদ ফারুক রোড, দক্ষিণ যাত্রাবাড়ী\n\nপ্রতিটি শাখা প্রতিদিন সকাল ১০:০০ টা থেকে রাত ৯:০০ টা পর্যন্ত খোলা থাকে (শুক্রবার বন্ধ)।`,
        icon: "fa-location-dot",
        iconColor: "text-blue-600",
        iconBg: "bg-blue-100",
        actionText: "গুগল ম্যাপে দেখুন",
        onAction: () => {
          setModal((prev) => ({ ...prev, isOpen: false }));
          setIsBranchPickerOpen(true);
        },
      });
    } else if (q.includes("ফাঁকা") || q.includes("gap") || q.includes("ব্রেসেস") || q.includes("aligner")) {
      setModal({
        isOpen: true,
        title: "ফাঁকা দাঁতের আধুনিক চিকিৎসা",
        message: `টেক ডেন্টালে ফাঁকা দাঁতের (Gap Teeth) জন্য স্থায়ী ও কসমেটিক চিকিৎসা রয়েছে:\n\n১. কম্পোজিট বন্ডিং / ভিনিয়ার্স: মাত্র ১ দিনেই দাঁত না কেটে ফাঁকা পূরণ।\n২. অর্থোডন্টিক ব্রেসেস (Braces): মেটাল ও সিরামিক ব্রেসেস দিয়ে ন্যাচারাল দাঁত সোজা করা।\n৩. ইনভিজিবল অ্যালাইনার্স (Clear Aligners): কোনো তার ছাড়া অদৃশ্য ক্লিপ পদ্ধতি।\n\nবিশেষজ্ঞ ডাক্তারের পরামর্শ নিতে আজই সিরিয়াল বুক করতে পারেন।`,
        icon: "fa-tooth",
        iconColor: "text-blue-600",
        iconBg: "bg-blue-100",
        actionText: "সিরিয়াল বুক করুন",
        onAction: () => {
          setModal((prev) => ({ ...prev, isOpen: false }));
          setIsAppointmentOpen(true);
        },
      });
    } else if (q.includes("ব্যথা") || q.includes("পেইন") || q.includes("রুট ক্যানেল") || q.includes("rct") || q.includes("pain")) {
      setModal({
        isOpen: true,
        title: "দাঁত ব্যথার ব্যথামুক্ত চিকিৎসা",
        message: `দাঁতে তীব্র ব্যথা, শিরশির করা বা ইনফেকশনের জন্য টেক ডেন্টালে রয়েছে:\n\n• সিঙ্গেল সিটিং রোটারি রুট ক্যানেল (RCT) – অত্যাধুনিক রোটারি সিস্টেমে মাত্র এক ভিজিটেই ব্যথামুক্ত চিকিৎসা।\n• ইমার্জেন্সি পেইন রিলিফ ড্রেসিং।\n• জার্মানির ক্লাস-বি অটোক্লেভে জীবাণুমুক্ত পরিবেশে নিরাপদ চিকিৎসা।`,
        icon: "fa-notes-medical",
        iconColor: "text-rose-600",
        iconBg: "bg-rose-100",
        actionText: "জরুরি সিরিয়াল নিন",
        onAction: () => {
          setModal((prev) => ({ ...prev, isOpen: false }));
          setIsAppointmentOpen(true);
        },
      });
    } else {
      setModal({
        isOpen: true,
        title: "টেক ডেন্টাল এআই অ্যাসিস্ট্যান্ট",
        message: `আপনার প্রশ্ন: "${query}"\n\nটেক ডেন্টালের দক্ষ স্পেশালিস্ট সার্জন ও কনসালট্যান্টগণ আপনাকে নির্ভুল সেবা প্রদান করবেন। খরচ, ভিজিটিং সময় বা নির্দিষ্ট চিকিৎসার বিস্তারিত জানতে আমাদের হটলাইনে সরাসরি কথা বলুন অথবা অনলাইনে অ্যাপয়েন্টমেন্ট নিশ্চিত করুন।`,
        icon: "fa-robot",
        iconColor: "text-blue-600",
        iconBg: "bg-blue-100",
        actionText: "অনলাইন অ্যাপয়েন্টমেন্ট",
        onAction: () => {
          setModal((prev) => ({ ...prev, isOpen: false }));
          setIsAppointmentOpen(true);
        },
      });
    }
  };

  // Action Buttons Modals
  const handleActionModal = (type: "Call" | "Directions" | "WhatsApp" | "Book") => {
    if (type === "Call") {
      window.location.href = `tel:${hotline}`;
      setModal({
        isOpen: true,
        title: "কল করুন (Call)",
        message: `টেক ডেন্টাল হটলাইন নম্বরে কল করতে ডায়াল করুন:\n${hotline}`,
        icon: "fa-phone",
        iconColor: "text-blue-600",
        iconBg: "bg-blue-100",
        actionText: `এখনই কল করুন (${hotline})`,
        onAction: () => {
          window.location.href = `tel:${hotline}`;
        },
      });
    } else if (type === "Directions") {
      setIsBranchPickerOpen(true);
    } else if (type === "WhatsApp") {
      window.open(waUrl, "_blank");
    } else if (type === "Book") {
      setIsAppointmentOpen(true);
    }
  };

  const seoTitle = home_content?.seo_title || "Tech Dental Care | Best Dental Clinic in Dhaka, Bangladesh";
  const seoDesc = home_content?.meta_desc || "টেক ডেন্টাল কেয়ার - মিরপুর, উত্তরা, বাড্ডা ও যাত্রাবাড়ী শাখায় অভিজ্ঞ ডেন্টাল সার্জনদের তত্ত্বাবধানে বিশ্বমানের ব্যথামুক্ত চিকিৎসা।";

  return (
    <div className="bg-gradient-to-b from-[#f4f7fc] to-[#dae9f6] md:from-sky-50/80 md:via-white md:to-blue-50/40 min-h-screen flex flex-col justify-between text-slate-800 antialiased selection:bg-blue-500 selection:text-white font-['Hind_Siliguri','Inter',sans-serif]">
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
      </Head>

      {/* Top Header Navigation (Integrated seamlessly) */}
      <TopHeader
        locations={locations}
        selectedBranch={selectedBranch}
        onBranchChange={(bId) => setSelectedBranch(bId)}
        navMenu={nav_menu}
      />

      {/* Main Container */}
      <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-10 flex-grow flex flex-col justify-between">
        
        {/* Top Section: AI Assistant Box */}
        <header className="w-full max-w-2xl mx-auto text-center flex flex-col items-center mb-10 md:mb-14 pt-2 md:pt-4">
          
          {/* Teeth Logo */}
          <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-blue-500 drop-shadow-md mb-8 md:mb-10 animate-pulse">
            <i className="fa-solid fa-tooth text-5xl md:text-6xl" />
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight mb-8 md:mb-10 leading-snug">
            টেক ডেন্টালের চিকিৎসা বিষয়ে কিভাবে সাহায্য করতে পারি?
          </h1>

          {/* Suggested Questions / Chips */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-start md:justify-center gap-2 md:gap-3 mb-8 w-full px-4 md:px-0 md:w-auto mx-auto md:max-w-none">
            <button
              type="button"
              onClick={() => handleSelectSuggestion("শাখার ঠিকানা কোথায়?")}
              className="flex items-center justify-start gap-3 md:gap-2 px-1 md:px-4 py-1.5 md:py-2.5 bg-transparent md:bg-white/80 hover:md:bg-white border-0 md:border border-slate-200/80 hover:border-blue-300 rounded-none md:rounded-full text-[12px] md:text-sm font-medium text-slate-600 md:text-slate-700 md:shadow-xs transition-all duration-200 hover:md:shadow-sm cursor-pointer"
            >
              <i className="fa-solid fa-location-dot text-slate-500 md:text-blue-500 w-4 text-center text-[14px] md:text-base" />
              <span>শাখার ঠিকানা কোথায়?</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectSuggestion("ফাঁকা দাঁতের চিকিৎসা")}
              className="flex items-center justify-start gap-3 md:gap-2 px-1 md:px-4 py-1.5 md:py-2.5 bg-transparent md:bg-white/80 hover:md:bg-white border-0 md:border border-slate-200/80 hover:border-blue-300 rounded-none md:rounded-full text-[12px] md:text-sm font-medium text-slate-600 md:text-slate-700 md:shadow-xs transition-all duration-200 hover:md:shadow-sm cursor-pointer"
            >
              <i className="fa-solid fa-tooth text-slate-500 md:text-blue-500 w-4 text-center text-[14px] md:text-base" />
              <span>ফাঁকা দাঁতের চিকিৎসা</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectSuggestion("দাঁত ব্যথার চিকিৎসা")}
              className="flex items-center justify-start gap-3 md:gap-2 px-1 md:px-4 py-1.5 md:py-2.5 bg-transparent md:bg-white/80 hover:md:bg-white border-0 md:border border-slate-200/80 hover:border-blue-300 rounded-none md:rounded-full text-[12px] md:text-sm font-medium text-slate-600 md:text-slate-700 md:shadow-xs transition-all duration-200 hover:md:shadow-sm cursor-pointer"
            >
              <i className="fa-solid fa-notes-medical text-slate-500 md:text-blue-500 w-4 text-center text-[14px] md:text-base" />
              <span>দাঁত ব্যথার চিকিৎসা</span>
            </button>
          </div>

          {/* AI Ask Box / Message Box */}
          <form
            onSubmit={handleAISubmit}
            className="w-full relative shadow-xl shadow-blue-500/5 rounded-full border border-slate-200/80 bg-white flex items-center px-6 py-3.5 md:py-4 transition-all focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent"
          >
            <input
              type="text"
              id="aiInput"
              value={aiInputValue}
              onChange={(e) => setAiInputValue(e.target.value)}
              placeholder="খরচ, ঠিকানা, ডাক্তার..."
              className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-base md:text-lg focus:outline-none"
            />
            <button
              type="submit"
              className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-blue-600 transition ml-2 shrink-0 cursor-pointer"
              aria-label="Send query"
            >
              <i className="fa-solid fa-paper-plane text-xl md:text-lg" />
            </button>
          </form>
        </header>

        {/* Middle Section: Screenshot-like Images & Banners */}
        <section className="w-full mb-10 md:mb-14 pt-6 border-t border-slate-200/40">
          <div className="flex items-center justify-between mb-5 px-1">
            <h2 className="text-base md:text-xl font-bold text-slate-800 flex items-center gap-2">
              আমাদের শাখাসমূহ ও আধুনিক প্রযুক্তি
            </h2>
            <span className="text-xs text-slate-500 font-medium hidden md:inline-block">
              স্লাইড করুন <i className="fa-solid fa-arrow-right ml-1" />
            </span>
          </div>

          {/* Horizontal Scroll Cards matching screenshot */}
          <div className="flex overflow-x-auto gap-3 md:gap-4 hide-scrollbar pb-3 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
            {galleryItems.map((item: any, idx: number) => {
              const branchName = item.branch || item.badge || "Uttara";
              const titleBadge = item.badge || item.title || (idx === 0 ? "টেক ডেন্টাল হেড অফিস" : idx === 1 ? "আধুনিক মাইক্রোস্কোপিক ডেন্টাল কেয়ার" : "উন্নত চিকিৎসা পরিবেশ");
              const views = item.view_count || item.real_views || (2000 + idx * 300);
              const imgSrc = item.src || item.image || item.url || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80";

              return (
                <div
                  key={item.id || idx}
                  className="relative rounded-[20px] overflow-hidden shadow-xs border border-slate-200/80 bg-slate-100 flex-shrink-0 w-[74vw] sm:w-[280px] md:w-[320px] aspect-[4/3] md:aspect-auto md:h-[240px] snap-start group"
                >
                  <img
                    src={imgSrc}
                    alt={titleBadge}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Top Badge */}
                  <div
                    className={`absolute top-3 left-3 text-white text-[11px] md:text-xs font-bold px-3 py-1 rounded-md shadow-xs ${
                      idx === 0 ? "bg-[#e43324]" : idx === 1 ? "bg-[#1a73e8]" : "bg-[#059669]"
                    }`}
                  >
                    {titleBadge}
                  </div>

                  {/* Bottom Info matching screenshot style */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-1.5 bg-[#202124]/75 backdrop-blur-sm text-white px-3 py-1.5 rounded-[10px] text-[13px] font-medium">
                      <i className="fa-solid fa-building text-blue-400" />
                      <span>{branchName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#202124]/75 backdrop-blur-sm text-white px-3 py-1.5 rounded-[10px] text-[13px] font-medium">
                      <i className="fa-solid fa-eye" />
                      <span>{Number(views).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom Section: Call to Action (CTA) Section */}
        <footer className="w-full py-4 mt-auto">
          
          {/* Action Buttons matched exactly to screenshot */}
          <div className="flex justify-between items-center max-w-[340px] mx-auto mb-10 w-full px-2">
            
            {/* Call CTA */}
            <button
              type="button"
              onClick={() => handleActionModal("Call")}
              className="flex flex-col items-center gap-2 focus:outline-none group cursor-pointer"
            >
              <div className="w-[54px] h-[54px] rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-xs group-hover:shadow-sm group-active:bg-slate-50 transition">
                <i className="fa-solid fa-phone text-[#1a73e8] text-xl" />
              </div>
              <span className="text-[13px] font-semibold text-[#001d35]">Call</span>
            </button>

            {/* Directions CTA */}
            <button
              type="button"
              onClick={() => handleActionModal("Directions")}
              className="flex flex-col items-center gap-2 focus:outline-none group cursor-pointer"
            >
              <div className="w-[54px] h-[54px] rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-xs group-hover:shadow-sm group-active:bg-slate-50 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-[22px] h-[22px] text-[#1a73e8]"
                >
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
              </div>
              <span className="text-[13px] font-semibold text-[#001d35]">Directions</span>
            </button>

            {/* WhatsApp CTA */}
            <button
              type="button"
              onClick={() => handleActionModal("WhatsApp")}
              className="flex flex-col items-center gap-2 focus:outline-none group cursor-pointer"
            >
              <div className="w-[54px] h-[54px] rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-xs group-hover:shadow-sm group-active:bg-slate-50 transition">
                <i className="fa-brands fa-whatsapp text-[#25d366] text-2xl" />
              </div>
              <span className="text-[13px] font-semibold text-[#001d35]">WhatsApp</span>
            </button>

            {/* Book CTA */}
            <button
              type="button"
              onClick={() => handleActionModal("Book")}
              className="flex flex-col items-center gap-2 focus:outline-none group cursor-pointer"
            >
              <div className="w-[54px] h-[54px] rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-xs group-hover:shadow-sm group-active:bg-slate-50 transition">
                <i className="fa-regular fa-calendar-check text-[#881337] text-xl" />
              </div>
              <span className="text-[13px] font-semibold text-[#001d35]">Book</span>
            </button>

          </div>

          {/* Very Bottom: More about Tech Dental Accordion Section */}
          <div className="max-w-xl mx-auto w-full">
            <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden transition-all">
              
              {/* Toggle Header Button */}
              <button
                type="button"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="w-full px-6 py-4 flex items-center justify-between text-slate-800 font-semibold text-base md:text-lg hover:bg-slate-50 transition cursor-pointer"
              >
                <span>More about Tech Dental</span>
                <i
                  className={`fa-solid fa-chevron-down text-slate-500 transition-transform duration-300 ${
                    isMoreOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Collapsible Content Box */}
              {isMoreOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 text-left text-slate-600 text-sm md:text-base leading-relaxed space-y-4 animate-in fade-in duration-200">
                  <div>
                    <h4 className="font-bold text-rose-900 text-base md:text-lg mb-1">
                      Tech Dental – ঢাকা শহরের অন্যতম বিশ্বস্ত ডেন্টাল নেটওয়ার্ক
                    </h4>
                    <p>
                      টেক ডেন্টাল (Tech Dental) অভিজ্ঞ বিডিএস ও স্পেশালিস্ট ডেন্টাল সার্জনদের তত্ত্বাবধানে আন্তর্জাতিক মানের যন্ত্রপাতি এবং শতভাগ জীবাণুমুক্ত পরিবেশে উন্নত ডেন্টাল সেবা প্রদান করে আসছে।
                    </p>
                  </div>

                  <div>
                    <h5 className="font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                      <i className="fa-solid fa-map-location-dot text-blue-600" />
                      <span>আমাদের প্রধান শাখাসমূহ:</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs md:text-sm list-disc list-inside text-slate-600">
                      <li>
                        <strong className="text-slate-800">মিরপুর শাখা:</strong> ৮২৭ (২য় তলা), শেওড়াপাড়া, বেগম রোকেয়া সরণি, মিরপুর, ঢাকা-১২১৬।
                      </li>
                      <li>
                        <strong className="text-slate-800">বাড্ডা শাখা:</strong> হাজী আব্দুর রশিদ ম্যানশন (৩য় তলা), উত্তর বাড্ডা বাজার, ঢাকা-১২১২।
                      </li>
                      <li>
                        <strong className="text-slate-800">উত্তরা শাখা:</strong> হাউস ১৮, রোড ১৪, সেক্টর ৩, উত্তরা, ঢাকা-১২৩০।
                      </li>
                      <li>
                        <strong className="text-slate-800">যাত্রাবাড়ী শাখা:</strong> শহীদ ফারুক রোড, দক্ষিণ যাত্রাবাড়ী, ঢাকা-১২০৪।
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                      <i className="fa-solid fa-tooth text-blue-600" />
                      <span>প্রধান সেবাসমূহ:</span>
                    </h5>
                    <p className="text-xs md:text-sm text-slate-600">
                      অর্থোডন্টিক ব্রেসেস, ব্যথামুক্ত রুট ক্যানেল, ফাইবার ব্রিজ, ভিনিয়ার্স, স্কেলিং ও পলিশিং এবং ডেন্টাল ইমপ্ল্যান্ট।
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-center text-xs text-slate-400 mt-6">
            © 2026 Tech Dental Bangladesh. All rights reserved.
          </p>
        </footer>

      </div>

      {/* Interactive Modal / Dialog Popup matching code */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center transform transition-all scale-100">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 ${modal.iconBg} ${modal.iconColor}`}
            >
              <i className={`fa-solid ${modal.icon}`} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{modal.title}</h3>
            <p className="text-slate-600 mb-6 text-sm md:text-base leading-relaxed whitespace-pre-line text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
              {modal.message}
            </p>
            <div className="flex flex-col gap-2">
              {modal.actionText && modal.onAction && (
                <button
                  type="button"
                  onClick={modal.onAction}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-xs cursor-pointer"
                >
                  {modal.actionText}
                </button>
              )}
              <button
                type="button"
                onClick={() => setModal({ ...modal, isOpen: false })}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition cursor-pointer"
              >
                ঠিক আছে (OK)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BRANCH PICKER MODAL (FOR DIRECTIONS) */}
      <BranchPickerModal
        locations={locations}
        isOpen={isBranchPickerOpen}
        onClose={() => setIsBranchPickerOpen(false)}
        actionType="directions"
      />

      {/* APPOINTMENT BOOKING MODAL */}
      <AppointmentModal
        locations={locations}
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        defaultBranch={selectedBranch}
      />
    </div>
  );
}
