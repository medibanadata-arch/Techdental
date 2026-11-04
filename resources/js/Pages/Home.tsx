import React, { useState, useMemo, useRef, useEffect } from "react";
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
  ai_chips?: string[];
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

export interface AiAnswer {
  title: string;
  reply: string;
  icon?: string;
  iconColor?: string;
  iconBg?: string;
  source?: 'keyword' | 'gemini' | 'fallback';
  actionType?: string;
  actionLabel?: string;
  actionUrl?: string;
}

export default function Home({
  locations = [],
  services = [],
  doctors = [],
  posts = [],
  featured_images = [],
  nav_menu,
  home_content,
  ai_chips = [],
}: HomeProps) {
  const [selectedBranch, setSelectedBranch] = useState("mirpur");
  const [aiInputValue, setAiInputValue] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState<AiAnswer | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Modal State for external actions
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
  const hotline = currentBranch?.phone || home_content?.contact_phone || "01400786162";
  const rawWa = currentBranch?.whatsapp || hotline;
  let cleanWa = rawWa.replace(/[^0-9]/g, "");
  if (cleanWa.startsWith("01")) {
    cleanWa = "88" + cleanWa;
  }
  const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent("হ্যালো টেক ডেন্টাল, আমি চিকিৎসার বিষয়ে জানতে চাচ্ছি।")}`;

  // Suggested Chips from backend or fallback
  const suggestedChips = useMemo(() => {
    if (Array.isArray(ai_chips) && ai_chips.length > 0) {
      return ai_chips;
    }
    return [
      "শাখার ঠিকানা কোথায়?",
      "ফাঁকা দাঁতের চিকিৎসা",
      "দাঁত ব্যথার চিকিৎসা",
    ];
  }, [ai_chips]);

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
    if (!aiInputValue.trim()) return;
    processAIQuestion(aiInputValue.trim());
  };

  const handleClearAnswer = () => {
    setAiInputValue("");
    setCurrentAnswer(null);
    setIsAiLoading(false);
  };

  const handleAnswerAction = (ans: AiAnswer) => {
    if (ans.actionType === "directions") {
      setIsBranchPickerOpen(true);
    } else if (ans.actionType === "call") {
      window.location.href = `tel:${hotline}`;
    } else if (ans.actionType === "whatsapp") {
      window.open(waUrl, "_blank");
    } else if (ans.actionUrl && ans.actionUrl.startsWith("http")) {
      window.open(ans.actionUrl, "_blank");
    } else {
      setIsAppointmentOpen(true);
    }
  };

  // Connected to Backend API: checks admin keywords first, then Gemini AI, then fallback
  const processAIQuestion = async (query: string) => {
    if (!query.trim()) return;
    setAiInputValue(query.trim());
    setIsAiLoading(true);
    setCurrentAnswer(null);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await res.json();
      if (data && data.reply) {
        setCurrentAnswer({
          title: data.title || "টেক ডেন্টাল এআই অ্যাসিস্ট্যান্ট",
          reply: data.reply,
          icon: data.icon || "fa-sparkles",
          iconColor: data.icon_color || "text-blue-600",
          iconBg: data.icon_bg || "bg-blue-100",
          source: data.source || "keyword",
          actionType: data.action_type || "none",
          actionLabel: data.action_label,
          actionUrl: data.action_url,
        });
        setIsAiLoading(false);
        return;
      }
    } catch (err) {
      console.error("AI Chat Error:", err);
    }

    // Fallback if offline/network issue
    setCurrentAnswer({
      title: "টেক ডেন্টাল এআই হেল্পডেস্ক",
      reply: `আপনার প্রশ্ন: "${query}"\n\nটেক ডেন্টালের দক্ষ স্পেশালিস্ট সার্জন ও কনসালট্যান্টগণ আপনাকে নির্ভুল সেবা প্রদান করবেন। খরচ, ভিজিটিং সময় বা নির্দিষ্ট চিকিৎসার বিস্তারিত জানতে আমাদের হটলাইনে (01400786162) সরাসরি কথা বলুন অথবা অনলাইনে অ্যাপয়েন্টমেন্ট নিশ্চিত করুন।`,
      icon: "fa-robot",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      source: "fallback",
      actionType: "appointment",
      actionLabel: "অনলাইন অ্যাপয়েন্টমেন্ট",
      actionUrl: "/appointment",
    });
    setIsAiLoading(false);
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

  const seoTitle = home_content?.seo_title || "Tech Dental Care | Best Dental Clinic in Dhaka, Bangladesh (2026)";
  const seoDesc = home_content?.meta_desc || "টেক ডেন্টাল কেয়ার - মিরপুর, উত্তরা, বাড্ডা ও যাত্রাবাড়ী শাখায় অভিজ্ঞ ডেন্টাল সার্জনদের তত্ত্বাবধানে বিশ্বমানের ব্যথামুক্ত চিকিৎসা।";

  return (
    <div className="bg-gradient-to-b from-[#f4f7fc] to-[#dae9f6] md:from-sky-50/80 md:via-white md:to-blue-50/40 min-h-screen flex flex-col justify-between text-slate-800 antialiased selection:bg-blue-500 selection:text-white font-['Hind_Siliguri','Inter',sans-serif]">
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
      </Head>

      {/* Top Header Navigation */}
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

          {/* Suggested Questions / Chips (Dynamically from Admin Dashboard) */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-start md:justify-center gap-2 md:gap-3 mb-8 w-full px-4 md:px-0 md:w-auto mx-auto md:max-w-none flex-wrap">
            {suggestedChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggestion(chip)}
                className="flex items-center justify-start gap-3 md:gap-2 px-1 md:px-4 py-1.5 md:py-2.5 bg-transparent md:bg-white/80 hover:md:bg-white border-0 md:border border-slate-200/80 hover:border-blue-300 rounded-none md:rounded-full text-[12px] md:text-sm font-medium text-slate-600 md:text-slate-700 md:shadow-xs transition-all duration-200 hover:md:shadow-sm cursor-pointer"
              >
                <i
                  className={`fa-solid ${idx === 0 ? "fa-location-dot" : idx === 1 ? "fa-tooth" : idx === 2 ? "fa-notes-medical" : "fa-sparkles"
                    } text-slate-500 md:text-blue-500 w-4 text-center text-[14px] md:text-base`}
                />
                <span>{chip}</span>
              </button>
            ))}
          </div>

          {/* Unified AI Ask Box & Answer Card — Directly connected to the top search field */}
          <div
            className={`w-full relative shadow-xl shadow-blue-500/5 bg-white border border-slate-200/90 transition-all duration-300 text-left ${
              currentAnswer || isAiLoading ? "rounded-[24px] md:rounded-[28px]" : "rounded-full"
            }`}
          >
            {/* Top Search Input Bar */}
            <form
              onSubmit={handleAISubmit}
              className="w-full flex items-center px-5 md:px-6 py-3.5 md:py-4 transition-all"
            >
              <div className="text-blue-500 mr-3 shrink-0">
                <i className="fa-solid fa-sparkles text-lg" />
              </div>
              <input
                type="text"
                id="aiInput"
                value={aiInputValue}
                onChange={(e) => setAiInputValue(e.target.value)}
                placeholder="খরচ, ঠিকানা, ডাক্তার..."
                className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-base md:text-lg focus:outline-none"
              />

              {/* Clear (✕) Button */}
              {(aiInputValue || currentAnswer || isAiLoading) && (
                <button
                  type="button"
                  onClick={handleClearAnswer}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition mr-1 cursor-pointer"
                  title="ক্লিয়ার করুন"
                >
                  <i className="fa-solid fa-xmark text-lg" />
                </button>
              )}

              {/* Submit / Loading Button */}
              <button
                type="submit"
                disabled={isAiLoading || !aiInputValue.trim()}
                className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-blue-600 disabled:opacity-40 transition shrink-0 cursor-pointer"
                aria-label="Send query"
              >
                {isAiLoading ? (
                  <i className="fa-solid fa-circle-notch fa-spin text-lg text-blue-600" />
                ) : (
                  <i className="fa-solid fa-paper-plane text-xl md:text-lg" />
                )}
              </button>
            </form>

            {/* Attached Answer Panel — Right inside the search field! */}
            {(isAiLoading || currentAnswer) && (
              <div className="border-t border-slate-100 p-5 md:p-6 transition-all duration-200">
                {isAiLoading ? (
                  /* Loading State */
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm text-slate-600 font-medium">
                      "{aiInputValue}" - সম্পর্কিত তথ্য অনুসন্ধান করা হচ্ছে...
                    </span>
                  </div>
                ) : currentAnswer ? (
                  /* Answer Content */
                  <div className="space-y-4">
                    {/* Header Row */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                          <i className={`fa-solid ${currentAnswer.icon || 'fa-tooth'}`} />
                        </div>
                        <h3 className="text-sm md:text-base font-bold text-slate-900">
                          {currentAnswer.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        {currentAnswer.source && (
                          <span
                            className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                              currentAnswer.source === 'gemini'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : currentAnswer.source === 'keyword'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {currentAnswer.source === 'gemini'
                              ? '✨ Gemini AI'
                              : currentAnswer.source === 'keyword'
                              ? '✓ ভেরিফাইড উত্তর'
                              : 'টেক ডেন্টাল কেয়ার'}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={handleClearAnswer}
                          className="w-7 h-7 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer"
                          title="বন্ধ করুন"
                        >
                          <i className="fa-solid fa-xmark text-sm" />
                        </button>
                      </div>
                    </div>

                    {/* Formatted Reply */}
                    <div className="text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-line font-normal">
                      {currentAnswer.reply}
                    </div>

                    {/* Action Buttons Row */}
                    <div className="pt-2 flex flex-wrap items-center gap-2.5">
                      {currentAnswer.actionLabel && (
                        <button
                          type="button"
                          onClick={() => handleAnswerAction(currentAnswer)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs md:text-sm font-semibold rounded-full shadow-xs hover:shadow transition cursor-pointer"
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square text-xs" />
                          <span>{currentAnswer.actionLabel}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (navigator?.clipboard) {
                            navigator.clipboard.writeText(currentAnswer.reply);
                          }
                          setIsCopied(true);
                          setTimeout(() => setIsCopied(false), 2000);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
                      >
                        <i className={`fa-solid ${isCopied ? 'fa-check text-emerald-600' : 'fa-copy'}`} />
                        <span>{isCopied ? 'কপি হয়েছে' : 'উত্তর কপি করুন'}</span>
                      </button>
                    </div>

                    {/* Follow-up Chips Row inside the card */}
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto hide-scrollbar">
                      <span className="text-[11px] text-slate-400 font-medium shrink-0">আরও জানতে:</span>
                      {suggestedChips.map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectSuggestion(chip)}
                          className="shrink-0 px-2.5 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded-full text-xs text-slate-600 transition cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
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
                    className={`absolute top-3 left-3 text-white text-[11px] md:text-xs font-bold px-3 py-1 rounded-md shadow-xs ${idx === 0 ? "bg-[#e43324]" : idx === 1 ? "bg-[#1a73e8]" : "bg-[#059669]"
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
                  className={`fa-solid fa-chevron-down text-slate-500 transition-transform duration-300 ${isMoreOpen ? "rotate-180" : ""
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

      {/* Interactive Modal / Dialog Popup */}
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
