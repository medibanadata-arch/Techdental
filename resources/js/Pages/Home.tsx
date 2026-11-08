import React, { useState, useMemo, useRef, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { TopHeader } from "@/Components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
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

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text?: string;
  answer?: AiAnswer;
}

// Helper: Extract YouTube 11-char Video ID from any YouTube URL
export const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  return match ? match[1] : null;
};

// YouTube Inline Embed Player Component
export const ChatYouTubeEmbed: React.FC<{ videoId: string; title?: string }> = ({ videoId, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="my-3 w-full max-w-sm sm:max-w-md rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-950 transition-all">
      {isPlaying ? (
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title || "YouTube video player"}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <div
          onClick={() => setIsPlaying(true)}
          className="relative w-full aspect-video cursor-pointer overflow-hidden bg-slate-900 group"
          title="ভিডিও দেখতে ক্লিক করুন"
        >
          {/* Thumbnail */}
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt={title || "YouTube video"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e: any) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30 group-hover:via-black/20 transition-all" />

          {/* Top Badge */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/70 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-white/15 shadow-xs">
            <i className="fa-brands fa-youtube text-red-500 text-xs" />
            <span>ভিডিও দেখুন</span>
          </div>

          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-600/95 hover:bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-950/50 group-hover:scale-110 active:scale-95 transition-all">
              <i className="fa-solid fa-play text-base sm:text-lg ml-0.5" />
            </div>
          </div>

          {/* Bottom Title if provided */}
          {title && (
            <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs sm:text-sm font-semibold truncate drop-shadow-md">
              {title}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

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
  const [selectedBranch, setSelectedBranch] = useState("");
  const [aiInputValue, setAiInputValue] = useState("");
  const [modalInputValue, setModalInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isFullModalOpen, setIsFullModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isAiFocused, setIsAiFocused] = useState(false);

  const safeFaqs = useMemo(() => {
    if (!home_content?.faqs) return [];
    if (Array.isArray(home_content.faqs)) return home_content.faqs;
    try {
      const parsed = typeof home_content.faqs === "string" ? JSON.parse(home_content.faqs) : home_content.faqs;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [home_content?.faqs]);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const modalChatScrollRef = useRef<HTMLDivElement>(null);

  // Gallery & Video Preview State
  const [previewImage, setPreviewImage] = useState<{ src: string; title?: string; branch?: string; index: number } | null>(null);
  const [previewVideo, setPreviewVideo] = useState<{ videoId: string; title?: string; branch?: string } | null>(null);
  const [isImagesExpanded, setIsImagesExpanded] = useState(false);
  const [isVideosExpanded, setIsVideosExpanded] = useState(false);

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

  const currentBranch = (selectedBranch && branchesData[selectedBranch]) || branchesData["mirpur"] || Object.values(branchesData)[0];
  const hotline = currentBranch?.phone || home_content?.contact_phone || "01400786162";
  const rawWa = currentBranch?.whatsapp || hotline;
  let cleanWa = rawWa.replace(/[^0-9]/g, "");
  if (cleanWa.startsWith("01")) {
    cleanWa = "88" + cleanWa;
  }
  const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent("হ্যালো টেক ডেন্টাল, আমি চিকিৎসার বিষয়ে জানতে চাচ্ছি।")}`;

  // Suggested Chips from backend or fallback (excluding crossed out items)
  const suggestedChips = useMemo(() => {
    const list = Array.isArray(ai_chips) && ai_chips.length > 0
      ? ai_chips
      : [
          "শাখার ঠিকানা কোথায়?",
          "ফাঁকা দাঁতের চিকিৎসা",
          "দাঁত ব্যথার চিকিৎসা",
        ];
    return list.filter((c: string) => !c.includes("ইমপ্ল্যান্ট"));
  }, [ai_chips]);

  const isChatActive = isWidgetOpen && (chatMessages.length > 0 || isAiLoading);

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
        branch: "Mirpur",
        badge: "বিশেষজ্ঞ পরামর্শ কেন্দ্র",
        badgeColor: "bg-[#059669]",
        view_count: 2237,
      },
      {
        id: 4,
        title: "ডিজিটাল ইন্ট্রাওরাল স্ক্যানিং রুম",
        src: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
        branch: "Uttara",
        badge: "ডিজিটাল স্ক্যানিং",
        badgeColor: "bg-[#0284c7]",
        view_count: 3105,
      },
      {
        id: 5,
        title: "অত্যাধুনিক ডেন্টাল ওটি সেটআপ",
        src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
        branch: "Mirpur",
        badge: "ডেন্টাল ওটি",
        badgeColor: "bg-[#7c3aed]",
        view_count: 2780,
      },
      {
        id: 6,
        title: "৩ডি কোন বিম সিটি স্ক্যান (CBCT)",
        src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
        branch: "Badda",
        badge: "CBCT ডায়াগনস্টিক",
        badgeColor: "bg-[#ea580c]",
        view_count: 2150,
      },
      {
        id: 7,
        title: "জীবাণুমুক্তকরণ ও স্টেরিলাইজেশন জোন",
        src: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
        branch: "Uttara",
        badge: "স্টেরিলাইজেশন",
        badgeColor: "bg-[#0891b2]",
        view_count: 1940,
      },
      {
        id: 8,
        title: "শিশুদের স্পেশাল ডেন্টাল কর্নার",
        src: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
        branch: "Mirpur",
        badge: "পেডিয়াট্রিক ডেন্টিস্ট্রি",
        badgeColor: "bg-[#db2777]",
        view_count: 2490,
      },
    ];
  }, [featured_images]);

  const displayedImages = isImagesExpanded ? galleryItems.slice(0, 8) : galleryItems.slice(0, 4);

  // Video Gallery items matching screenshot style
  const videoGalleryItems = useMemo(() => [
    {
      id: 1,
      videoId: "szdRKLSLzOE",
      title: "আল্ট্রাসনিক স্কেলিং ও আধুনিক পলিশিং",
      branch: "Mirpur",
      views: 3420,
    },
    {
      id: 2,
      videoId: "szdRKLSLzOE",
      title: "কম্পিউটারাইজড পেইনলেস রুট ক্যানেল",
      branch: "Uttara",
      views: 2850,
    },
    {
      id: 3,
      videoId: "szdRKLSLzOE",
      title: "জার্মান প্রযুক্তির ডেন্টাল ইমপ্ল্যান্ট সার্জারি",
      branch: "Badda",
      views: 4120,
    },
    {
      id: 4,
      videoId: "szdRKLSLzOE",
      title: "দাঁত ফাঁকা ও আঁকাবাঁকা চিকিৎসা (ব্রেসেস)",
      branch: "Mirpur",
      views: 2190,
    },
    {
      id: 5,
      videoId: "szdRKLSLzOE",
      title: "ডিজিটাল স্মাইল ডিজাইন ও ভিনিয়ার্স",
      branch: "Uttara",
      views: 2640,
    },
    {
      id: 6,
      videoId: "szdRKLSLzOE",
      title: "বাচ্চাদের দাঁতের যত্ন ও ক্যাভিটি ফিলিং",
      branch: "Badda",
      views: 1850,
    },
    {
      id: 7,
      videoId: "szdRKLSLzOE",
      title: "আধুনিক ডিজিটাল ৩ডি ওপিজি এক্স-রে রুম",
      branch: "Uttara",
      views: 3200,
    },
    {
      id: 8,
      videoId: "szdRKLSLzOE",
      title: "ক্লাস-বি অটোক্লেভ ১০০% জীবাণুমুক্তকরণ ব্যবস্থা",
      branch: "Mirpur",
      views: 2950,
    },
  ], []);

  const displayedVideos = isVideosExpanded ? videoGalleryItems.slice(0, 6) : videoGalleryItems.slice(0, 3);

  // Keyboard navigation for image lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!previewImage) return;
      if (e.key === "Escape") {
        setPreviewImage(null);
      } else if (e.key === "ArrowLeft") {
        const newIdx = (previewImage.index - 1 + galleryItems.length) % galleryItems.length;
        const prevItem = galleryItems[newIdx];
        setPreviewImage({
          src: prevItem.src || prevItem.image || prevItem.url,
          title: prevItem.badge || prevItem.title,
          branch: prevItem.branch || prevItem.badge || "Uttara",
          index: newIdx,
        });
      } else if (e.key === "ArrowRight") {
        const newIdx = (previewImage.index + 1) % galleryItems.length;
        const nextItem = galleryItems[newIdx];
        setPreviewImage({
          src: nextItem.src || nextItem.image || nextItem.url,
          title: nextItem.badge || nextItem.title,
          branch: nextItem.branch || nextItem.badge || "Uttara",
          index: newIdx,
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewImage, galleryItems]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  const scrollChatToQuestion = (userMsgId: string) => {
    const doScroll = () => {
      if (chatScrollRef.current) {
        const targetEl = chatScrollRef.current.querySelector<HTMLElement>(`[data-msg-id="${userMsgId}"]`);
        if (targetEl) {
          const containerRect = chatScrollRef.current.getBoundingClientRect();
          const targetRect = targetEl.getBoundingClientRect();
          const relativeTop = targetRect.top - containerRect.top + chatScrollRef.current.scrollTop;
          chatScrollRef.current.scrollTo({
            top: Math.max(0, relativeTop - 12),
            behavior: "smooth"
          });
        }
      }
      if (modalChatScrollRef.current) {
        const targetEl = modalChatScrollRef.current.querySelector<HTMLElement>(`[data-msg-id="${userMsgId}"]`);
        if (targetEl) {
          const containerRect = modalChatScrollRef.current.getBoundingClientRect();
          const targetRect = targetEl.getBoundingClientRect();
          const relativeTop = targetRect.top - containerRect.top + modalChatScrollRef.current.scrollTop;
          modalChatScrollRef.current.scrollTo({
            top: Math.max(0, relativeTop - 12),
            behavior: "smooth"
          });
        }
      }
    };

    setTimeout(doScroll, 40);
    setTimeout(doScroll, 180);
  };

  const handleSelectSuggestion = (text: string) => {
    processAIQuestion(text);
  };

  const handleAISubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiInputValue.trim()) {
      const el = document.getElementById("primarySearchInput");
      el?.focus();
      return;
    }
    processAIQuestion(aiInputValue.trim());
  };

  const handleModalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!modalInputValue.trim()) return;
    processAIQuestion(modalInputValue.trim());
  };

  const handleResetConversation = () => {
    setChatMessages([]);
    setIsWidgetOpen(true);
    showToast("চ্যাট রিসেট করা হয়েছে");
    processAIQuestion("ডেন্টাল ইমপ্ল্যান্ট ও খরচ");
  };

  const handleCloseWidget = () => {
    setIsWidgetOpen(false);
  };

  const handleCopyAnswer = (text: string, id: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedMsgId(id);
    showToast("উত্তর কপি হয়েছে");
    setTimeout(() => setCopiedMsgId(null), 2000);
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
    const cleanQuery = query.trim();
    setAiInputValue("");
    setModalInputValue("");
    setIsWidgetOpen(true);

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: "user",
      text: cleanQuery,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);
    scrollChatToQuestion(userMsgId);

    const startTime = Date.now();
    const TARGET_DELAY_MS = 3000; // Exact 3-second delivery guarantee

    const ensureThreeSeconds = async () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, TARGET_DELAY_MS - elapsed);
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }
    };

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ query: cleanQuery }),
      });

      const data = await res.json();

      // Guarantee 3 seconds elapsed before presenting answer
      await ensureThreeSeconds();

      if (data && data.reply) {
        let cleanReplyText = data.reply;
        const isAskingWhatsapp = /whatsapp|হোয়াটসঅ্যাপ|হোয়াটসএপ|হোয়াটসঅ্যাপ|watsapp|what\'s app/i.test(cleanQuery);
        if (!isAskingWhatsapp) {
          cleanReplyText = cleanReplyText
            .replace(/01400[- ]?786162\s*(?:\/|বা|,)\s*/g, '')
            .replace(/\s*(?:\/|বা|,)?\s*(?:WhatsApp:\s*)?01400[- ]?786162/gi, '')
            .replace(/কল করুন:\s*$/g, 'কল করুন: 09638-000505')
            .trim();
        }

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          answer: {
            title: data.title || "টেক ডেন্টাল",
            reply: cleanReplyText,
            icon: data.icon || "fa-sparkles",
            iconColor: data.icon_color || "text-blue-600",
            iconBg: data.icon_bg || "bg-blue-100",
            source: data.source || "keyword",
            actionType: data.action_type || "appointment",
            actionLabel: data.action_label || "অনলাইন সিরিয়াল নিন",
            actionUrl: data.action_url,
          },
        };
        setChatMessages((prev) => [...prev, aiMsg]);
        setIsAiLoading(false);
        scrollChatToQuestion(userMsgId);
        return;
      }
    } catch (err) {
      console.error("AI Chat Error:", err);
      await ensureThreeSeconds();
    }

    // Fallback if offline/network issue
    await ensureThreeSeconds();
    const fallbackMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: "assistant",
      answer: {
        title: "টেক ডেন্টাল",
        reply: `টেক ডেন্টালের দক্ষ স্পেশালিস্ট সার্জন ও কনসালট্যান্টগণ আপনাকে নির্ভুল সেবা প্রদান করবেন। খরচ, ভিজিটিং সময় বা নির্দিষ্ট চিকিৎসার বিস্তারিত জানতে আমাদের হটলাইনে (${hotline}) সরাসরি কথা বলুন অথবা অনলাইনে অ্যাপয়েন্টমেন্ট নিশ্চিত করুন।`,
        actionType: "appointment",
        actionLabel: "অনলাইন সিরিয়াল নিন",
        actionUrl: "/appointment",
      },
    };
    setChatMessages((prev) => [...prev, fallbackMsg]);
    setIsAiLoading(false);
    scrollChatToQuestion(userMsgId);
  };

  const bengaliToEnglishDigits = (str: string) => {
    const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return str.replace(/[০-৯]/g, (w) => bengaliNumbers.indexOf(w).toString());
  };

  const renderFormattedReply = (reply: string) => {
    if (!reply) return null;

    // Detect Bangladesh mobile/hotline numbers in English or Bengali digits
    const phoneRegex = /((?:\+?(?:88|৮৮))?(?:0|০)[0-9০-৯]{2,4}[-\s]?[0-9০-৯]{3,4}[-\s]?[0-9০-৯]{3,4})/g;

    // Helper: format phone numbers and raw URLs inside a plain text chunk
    const formatPhonesAndUrls = (text: string, keyPrefix: string): React.ReactNode[] => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urlParts = text.split(urlRegex);

      return urlParts.flatMap((uPart, uIdx) => {
        const uKey = `${keyPrefix}-u-${uIdx}`;
        if (uPart.match(/^https?:\/\//)) {
          const cleanUrl = uPart.replace(/[.,;:)\]]+$/, '');
          const ytId = extractYouTubeId(cleanUrl);
          if (ytId) {
            return <ChatYouTubeEmbed key={uKey} videoId={ytId} />;
          }
          return (
            <a
              key={uKey}
              href={uPart}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2 mx-0.5"
            >
              {uPart}
            </a>
          );
        }

        const phoneParts = uPart.split(phoneRegex);
        return phoneParts.map((pPart, pIdx) => {
          const pKey = `${uKey}-p-${pIdx}`;
          if (pPart.match(phoneRegex)) {
            const cleanTel = bengaliToEnglishDigits(pPart).replace(/[^0-9+]/g, '');
            return (
              <a
                key={pKey}
                href={`tel:${cleanTel}`}
                className="inline-flex items-center gap-1.5 font-bold text-blue-700 hover:text-blue-900 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200/90 hover:border-blue-400 px-3 py-1 rounded-full shadow-2xs hover:shadow-xs transition-all duration-200 no-underline mx-1 align-middle group cursor-pointer"
                title={`এখনই কল করুন: ${cleanTel}`}
              >
                <span className="w-5 h-5 rounded-full bg-blue-600 group-hover:bg-blue-700 text-white flex items-center justify-center text-[9px] group-hover:scale-110 transition-transform shadow-2xs shrink-0">
                  <i className="fa-solid fa-phone text-[9px]" />
                </span>
                <span className="tracking-wide text-xs sm:text-[13px] font-bold font-sans">{pPart}</span>
              </a>
            );
          }
          return <React.Fragment key={pKey}>{pPart}</React.Fragment>;
        });
      });
    };

    // Helper: format markdown links [text](url)
    const formatMarkdownLinks = (text: string, keyPrefix: string): React.ReactNode[] => {
      const linkRegex = /(\[[^\]]+\]\([^)]+\))/g;
      const linkParts = text.split(linkRegex);

      return linkParts.flatMap((part, idx) => {
        const lKey = `${keyPrefix}-ml-${idx}`;
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (match) {
          const [, label, href] = match;
          const cleanHref = href.replace(/[.,;:)\]]+$/, '');
          const ytId = extractYouTubeId(cleanHref);
          if (ytId) {
            return <ChatYouTubeEmbed key={lKey} videoId={ytId} title={label} />;
          }
          return (
            <a
              key={lKey}
              href={href}
              target={href.startsWith('http') ? '_blank' : '_self'}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-2 mx-0.5"
            >
              {label}
            </a>
          );
        }
        return formatPhonesAndUrls(part, lKey);
      });
    };

    // Helper: format italic (*text* or _text_)
    const formatItalic = (text: string, keyPrefix: string): React.ReactNode[] => {
      const italicRegex = /(\*[^\s*][^*]*?[^\s*]\*|_[^\s_][^_]*?[^\s_]_)/g;
      const parts = text.split(italicRegex);

      return parts.flatMap((part, idx) => {
        const iKey = `${keyPrefix}-i-${idx}`;
        if (
          ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) &&
          part.length >= 3
        ) {
          const inner = part.slice(1, -1);
          return (
            <em key={iKey} className="italic">
              {formatMarkdownLinks(inner, iKey)}
            </em>
          );
        }
        return formatMarkdownLinks(part, iKey);
      });
    };

    // Helper: format bold (**text** or __text__)
    const formatBold = (text: string, keyPrefix: string): React.ReactNode[] => {
      const boldRegex = /(\*\*[^*]+?\*\*|__[^_]+?__)/g;
      const parts = text.split(boldRegex);

      return parts.flatMap((part, idx) => {
        const bKey = `${keyPrefix}-b-${idx}`;
        if (
          ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) &&
          part.length >= 4
        ) {
          const inner = part.slice(2, -2);
          return (
            <strong key={bKey} className="font-bold text-slate-900">
              {formatItalic(inner, bKey)}
            </strong>
          );
        }
        return formatItalic(part, bKey);
      });
    };

    // Process line by line to handle markdown headings cleanly while preserving newlines
    const lines = reply.split('\n');
    return lines.map((line, lIdx) => {
      const lKey = `line-${lIdx}`;
      const isLast = lIdx === lines.length - 1;

      // Check for markdown headings: ### Heading or ## Heading or # Heading
      const headingMatch = line.match(/^#{1,4}\s+(.+)$/);
      if (headingMatch) {
        return (
          <React.Fragment key={lKey}>
            <strong className="block font-bold text-slate-900 text-[15px] sm:text-base mt-2 mb-1">
              {formatBold(headingMatch[1], `${lKey}-h`)}
            </strong>
            {!isLast && '\n'}
          </React.Fragment>
        );
      }

      return (
        <React.Fragment key={lKey}>
          {formatBold(line, lKey)}
          {!isLast && '\n'}
        </React.Fragment>
      );
    });
  };

  const renderChatMessage = (msg: ChatMessage) => {
    if (msg.role === "user") {
      return (
        <div key={msg.id} data-msg-id={msg.id} className="flex justify-end pt-2">
          <div className="bg-blue-50 text-blue-950 font-medium px-4 py-2 rounded-2xl rounded-tr-xs text-xs sm:text-sm max-w-[85%] border border-blue-100 shadow-2xs font-['Noto_Sans_Bengali','Anek_Bangla',sans-serif]">
            {msg.text}
          </div>
        </div>
      );
    }

    return (
      <div key={msg.id} data-msg-id={msg.id} className="text-[14px] sm:text-[15px] leading-relaxed text-[#202124] space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 font-['Noto_Sans_Bengali','Anek_Bangla',sans-serif]">
        <div className="text-slate-800 text-sm md:text-base leading-relaxed whitespace-pre-line font-normal font-['Noto_Sans_Bengali','Anek_Bangla',sans-serif] tracking-wide">
          {renderFormattedReply(msg.answer?.reply || "")}
        </div>

        {msg.answer?.actionLabel && (
          <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-100/80">
            <button
              type="button"
              onClick={() => handleAnswerAction(msg.answer!)}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <i className="fa-solid fa-calendar-check text-xs" />
              <span>{msg.answer.actionLabel}</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  const getChipIcon = (chip: string, idx: number) => {
    if (chip.includes("ইমপ্ল্যান্ট") || chip.toLowerCase().includes("implant") || idx === 3) {
      return (
        <span className="w-4 h-4 flex items-center justify-center text-slate-500 md:text-blue-500 shrink-0" title="ডেন্টাল ইমপ্ল্যান্ট">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 md:w-4 md:h-4">
            {/* Tooth Crown */}
            <path d="M7 2C5.3 2 4 3.3 4 5c0 2 1.2 3.7 2.8 4.5.2.1.2.3.2.5v1h10v-1c0-.2.1-.4.2-.5C18.8 8.7 20 7 20 5c0-1.7-1.3-3-3-3-1.8 0-3.2 1-5 1S8.8 2 7 2z" />
            {/* Implant Collar & Threaded Screw */}
            <rect x="8" y="12" width="8" height="1.5" rx="0.5" />
            <rect x="8.5" y="14.5" width="7" height="1.5" rx="0.5" />
            <rect x="9.5" y="17" width="5" height="1.5" rx="0.5" />
            <path d="M10.5 19.5h3L12 22.5z" />
          </svg>
        </span>
      );
    }

    if (chip.includes("ঠিকানা") || chip.includes("শাখা") || idx === 0) {
      return (
        <i className="fa-solid fa-location-dot text-slate-500 md:text-blue-500 w-4 text-center text-[14px] md:text-base shrink-0" />
      );
    }

    if (chip.includes("ফাঁকা") || idx === 1) {
      return (
        <i className="fa-solid fa-tooth text-slate-500 md:text-blue-500 w-4 text-center text-[14px] md:text-base shrink-0" />
      );
    }

    if (chip.includes("ব্যথা") || idx === 2) {
      return (
        <i className="fa-solid fa-notes-medical text-slate-500 md:text-blue-500 w-4 text-center text-[14px] md:text-base shrink-0" />
      );
    }

    return (
      <i className="fa-solid fa-tooth text-slate-500 md:text-blue-500 w-4 text-center text-[14px] md:text-base shrink-0" />
    );
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
    <div className="bg-gradient-to-b from-[#f4f7fc] to-[#dae9f6] md:from-sky-50/80 md:via-white md:to-blue-50/40 min-h-screen flex flex-col justify-between text-slate-800 antialiased selection:bg-blue-500 selection:text-white font-['Noto_Sans_Bengali','Anek_Bangla','Hind_Siliguri','Inter',sans-serif]">
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
        <header className="w-full max-w-2xl mx-auto text-center flex flex-col items-center mb-6 md:mb-8 pt-2 md:pt-4">

          {/* Title - One Line */}
          <h1 className={`text-xl sm:text-2xl md:text-4xl font-bold text-slate-900 tracking-tight leading-normal whitespace-nowrap ${isChatActive ? 'mb-4 md:mb-6' : 'mb-6 md:mb-8'}`}>
            কিভাবে সাহায্য করতে পারি?
          </h1>

          {/* Suggested Questions / Chips (Dynamically from Admin Dashboard) - Hidden when chat is active */}
          {!isChatActive && (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-start md:justify-center gap-2 md:gap-3 mb-6 w-full px-4 md:px-0 md:w-auto mx-auto md:max-w-none flex-wrap">
              {suggestedChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSuggestion(chip)}
                  className="flex items-center justify-start gap-3 md:gap-2 px-1 md:px-4 py-1.5 md:py-2.5 bg-transparent md:bg-white/80 hover:md:bg-white border-0 md:border border-slate-200/80 hover:border-blue-300 rounded-none md:rounded-full text-[12px] md:text-sm font-medium text-slate-600 md:text-slate-700 md:shadow-xs transition-all duration-200 hover:md:shadow-sm cursor-pointer"
                >
                  {getChipIcon(chip, idx)}
                  <span>{chip}</span>
                </button>
              ))}
            </div>
          )}

          {/* ========================================== */}
          {/* EXPANDABLE GEMINI / CHATGPT AI RESPONSE PANEL */}
          {/* Opens smoothly above the bottom search bar */}
          {/* ========================================== */}
          {isWidgetOpen && (chatMessages.length > 0 || isAiLoading) && (
            <div id="aiResponseWidget" className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-[0_12px_40px_rgb(0,0,0,0.06)] overflow-hidden flex flex-col h-[480px] mb-4 transition-all duration-300 text-left font-['Noto_Sans_Bengali','Anek_Bangla',sans-serif]">
              {/* Top Minimal Action Header */}
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C8.5 2 6 4.5 6 8c0 3.2 1.3 6.8 2 10 .4 1.8 1.4 3 2.5 3s1.7-1 2-3c.5-3.3.5-3.3 1-3.3s.5 0 1 3.3c.3 2 .9 3 2 3s2.1-1.2 2.5-3c.7-3.2 2-6.8 2-10 0-3.5-2.5-6-7-6z" />
                    </svg>
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">টেক ডেন্টাল</span>
                </div>

                <div className="flex items-center gap-1 text-slate-500">
                  {/* Expand / Full View Modal Button */}
                  <button
                    type="button"
                    onClick={() => setIsFullModalOpen(true)}
                    title="ফুল ভিউ দেখুন"
                    className="p-1.5 hover:bg-slate-200/60 rounded-full hover:text-blue-600 transition cursor-pointer"
                  >
                    <i className="fa-solid fa-up-right-and-down-left-from-center text-xs sm:text-sm" />
                  </button>

                  {/* Close Widget Button */}
                  <button
                    type="button"
                    onClick={handleCloseWidget}
                    title="বন্ধ করুন"
                    className="p-1.5 hover:bg-red-50 rounded-full hover:text-red-500 transition ml-0.5 cursor-pointer"
                  >
                    <i className="fa-solid fa-xmark text-sm" />
                  </button>
                </div>
              </div>

              {/* Scrollable Internal Thread (No Page Push) */}
              <div ref={chatScrollRef} className="flex-1 overflow-y-auto custom-scroll p-5 space-y-4">
                {chatMessages.map(renderChatMessage)}
                {isAiLoading && (
                  <div className="w-fit flex items-center gap-1.5 px-4 py-3 bg-slate-50/80 rounded-2xl border border-slate-100 shadow-2xs">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
              </div>

              {/* Widget Related Suggested Chips */}
              <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/40 shrink-0 flex items-center gap-1.5 overflow-x-auto hide-scrollbar text-[11px]">
                <span className="text-slate-400 whitespace-nowrap">সম্পর্কিত:</span>
                {suggestedChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(chip)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-600 hover:text-blue-600 transition cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* BOTTOM SEARCH BAR (Image 1 Default -> Image 2 Focused) */}
          {/* ========================================== */}
          <div className="w-full flex flex-col items-center">
            <div
              id="searchBarPill"
              className={`search-pill-container w-full bg-white rounded-full pl-6 sm:pl-7 pr-3 sm:pr-4 py-3.5 sm:py-5 min-h-[64px] sm:min-h-[74px] flex items-center justify-between transition-all duration-200 ${
                isAiFocused ? "is-focused" : ""
              }`}
            >
              <div className="flex items-center flex-1 mr-3 sm:mr-4">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500 mr-3.5 sm:mr-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  id="primarySearchInput"
                  value={aiInputValue}
                  onChange={(e) => setAiInputValue(e.target.value)}
                  placeholder="খরচ, ঠিকানা, ডাক্তার..."
                  className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-base sm:text-lg outline-none font-normal border-0 ring-0 focus:ring-0 focus:outline-none"
                  onFocus={() => setIsAiFocused(true)}
                  onBlur={() => setIsAiFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAISubmit();
                    }
                  }}
                />
              </div>

              {/* Send / Search Button (Matches Image 1 & 2) */}
              <button
                type="button"
                onClick={handleAISubmit}
                id="searchSubmitBtn"
                disabled={isAiLoading}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1d63ed] hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center transition shadow-md shadow-blue-500/25 shrink-0 cursor-pointer"
                title="সার্চ করুন"
              >
                {isAiLoading ? (
                  <i className="fa-solid fa-circle-notch fa-spin text-base" />
                ) : (
                  <svg className="w-6 h-6 translate-x-0.5 -rotate-45" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Quick Action CTA Buttons (Call, Directions, WhatsApp, Book) - Above Image Section */}
        <div className="flex justify-between items-center max-w-[340px] mx-auto my-8 md:my-12 w-full px-2">

          {/* Call CTA */}
          <button
            type="button"
            onClick={() => handleActionModal("Call")}
            className="flex flex-col items-center gap-2 focus:outline-none group cursor-pointer"
          >
            <div className="w-[54px] h-[54px] rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-xs group-hover:shadow-sm group-active:bg-slate-50 transition">
              <i className="fa-solid fa-phone text-[#1a73e8] text-xl" />
            </div>
            <span className="hidden sm:block text-[13px] font-semibold text-[#001d35]">Call</span>
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
            <span className="hidden sm:block text-[13px] font-semibold text-[#001d35]">Directions</span>
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
            <span className="hidden sm:block text-[13px] font-semibold text-[#001d35]">WhatsApp</span>
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
            <span className="hidden sm:block text-[13px] font-semibold text-[#001d35]">Book</span>
          </button>

        </div>

        {/* ========================================== */}
        {/* IMAGE GALLERY */}
        {/* Initial: 4 on desktop, 2 on mobile. Expand: 8 images, then See Less & See More (/gallery) */}
        {/* ========================================== */}
        <section id="image-gallery-section" className="w-full mb-6 md:mb-8 scroll-mt-20">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
              <i className="fa-solid fa-images text-blue-600" />
              <span>Image Gallery</span>
            </h2>
          </div>

          {/* 4 in desktop, 2 in mobile (collapsed) -> 8 images when expanded */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {displayedImages.map((item: any, idx: number) => {
              const titleBadge = item.badge || item.title || "Tech Dental";
              const imgSrc = item.src || item.image || item.url || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80";
              const isHiddenOnMobile = !isImagesExpanded && idx >= 2;

              return (
                <div
                  key={item.id || idx}
                  onClick={() => {
                    setPreviewImage({
                      src: imgSrc,
                      title: titleBadge,
                      index: idx,
                    });
                  }}
                  className={`relative rounded-2xl md:rounded-[20px] overflow-hidden shadow-xs border border-slate-200/80 bg-slate-100 aspect-[4/3] group cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                    isHiddenOnMobile ? "hidden md:block" : ""
                  }`}
                  title="ছবি দেখতে ক্লিক করুন"
                >
                  <img
                    src={imgSrc}
                    alt={titleBadge}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              );
            })}
          </div>

          {/* Button(s) Area */}
          <div className="mt-5 flex items-center justify-center gap-3">
            {!isImagesExpanded ? (
              <button
                type="button"
                onClick={() => setIsImagesExpanded(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 font-medium text-xs sm:text-sm border border-slate-200/90 shadow-2xs hover:shadow-xs transition active:scale-95 cursor-pointer"
              >
                <span>See More</span>
                <i className="fa-solid fa-chevron-down text-xs" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsImagesExpanded(false);
                    setTimeout(() => {
                      document.getElementById('image-gallery-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 font-medium text-xs sm:text-sm border border-slate-200/90 shadow-2xs hover:shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <i className="fa-solid fa-chevron-up text-xs" />
                  <span>See Less</span>
                </button>
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm shadow-xs hover:shadow-md transition active:scale-95 cursor-pointer"
                >
                  <span>See More</span>
                  <i className="fa-solid fa-arrow-right text-xs" />
                </Link>
              </>
            )}
          </div>
        </section>

        {/* ========================================== */}
        {/* VIDEO GALLERY */}
        {/* Mobile: 1 column stacked (not side by side), Desktop: 3 columns. Expand: 6 videos, then See Less & See More (/gallery#videos) */}
        {/* ========================================== */}
        <section id="video-gallery-section" className="w-full mb-6 md:mb-8 scroll-mt-20">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
              <i className="fa-brands fa-youtube text-red-600" />
              <span>Video Gallery</span>
            </h2>
          </div>

          {/* 1 column on mobile (stacked), 2 on sm, 3 on md -> 6 videos when expanded */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 md:gap-4">
            {displayedVideos.map((item, idx) => {
              const isHiddenOnMobile = !isVideosExpanded && idx >= 2;

              return (
                <div
                  key={item.id || idx}
                  onClick={() => setPreviewVideo({ videoId: item.videoId, title: item.title, branch: item.branch })}
                  className={`relative rounded-2xl md:rounded-[20px] overflow-hidden shadow-xs border border-slate-200/80 bg-slate-900 aspect-video group cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                    isHiddenOnMobile ? "hidden md:block" : ""
                  }`}
                  title="ভিডিও দেখতে ক্লিক করুন"
                >
                  <img
                    src={`https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100 pointer-events-none"
                    loading="lazy"
                  />

                  {/* Center Red Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600/95 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-red-600 transition-all">
                      <i className="fa-solid fa-play text-sm translate-x-0.5" />
                    </div>
                  </div>

                  {/* Top Video Title Badge */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 pointer-events-none">
                    <div className="bg-black/65 backdrop-blur-xs text-white text-xs font-medium px-2.5 py-1 rounded-md line-clamp-1">
                      {item.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Button(s) Area */}
          <div className="mt-5 flex items-center justify-center gap-3">
            {!isVideosExpanded ? (
              <button
                type="button"
                onClick={() => setIsVideosExpanded(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-red-600 font-medium text-xs sm:text-sm border border-slate-200/90 shadow-2xs hover:shadow-xs transition active:scale-95 cursor-pointer"
              >
                <span>See More</span>
                <i className="fa-solid fa-chevron-down text-xs" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsVideosExpanded(false);
                    setTimeout(() => {
                      document.getElementById('video-gallery-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-red-600 font-medium text-xs sm:text-sm border border-slate-200/90 shadow-2xs hover:shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <i className="fa-solid fa-chevron-up text-xs" />
                  <span>See Less</span>
                </button>
                <Link
                  href="/gallery#videos"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium text-xs sm:text-sm shadow-xs hover:shadow-md transition active:scale-95 cursor-pointer"
                >
                  <span>See More</span>
                  <i className="fa-solid fa-arrow-right text-xs" />
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Bottom Section: Call to Action (CTA) & More Accordion */}
        <section className="w-full mb-6 md:mb-8 mt-auto">

          {/* Very Bottom: More about Tech Dental Accordion Section */}
          <div className={`mx-auto w-full transition-all duration-300 ${isMoreOpen ? 'w-full' : 'max-w-xl'}`}>
            <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden transition-all duration-300">

              {/* Toggle Header Button */}
              <button
                type="button"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="w-full px-6 py-4 flex items-center justify-between text-slate-800 font-semibold text-base md:text-lg hover:bg-slate-50 transition cursor-pointer"
              >
                <span>{home_content?.about_caption || "More about Tech Dental"}</span>
                <i
                  className={`fa-solid fa-chevron-down text-slate-500 transition-transform duration-300 ${isMoreOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Collapsible Content Box */}
              {isMoreOpen && (
                <div className="px-6 md:px-10 pb-8 pt-4 border-t border-slate-100 text-left text-slate-600 text-sm md:text-base leading-relaxed space-y-4 animate-in fade-in duration-300">
                  {home_content?.about_text ? (
                    <div
                      className="rich-content-view wp-editor-content prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm md:text-base"
                      dangerouslySetInnerHTML={{ __html: home_content.about_text }}
                    />
                  ) : (
                    <div className="space-y-4">
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

                  {/* Patient FAQs */}
                  {safeFaqs.length > 0 && (
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-1.5 h-3.5 bg-rose-700 rounded-full" />
                        Frequently Asked Questions (FAQ)
                      </h4>
                      <div className="space-y-2">
                        {safeFaqs.filter((f: any) => f && f.q).map((faq: any, i: number) => (
                          <div key={i} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                            <div className="font-bold text-xs md:text-sm text-slate-900 mb-1">Q: {faq.q}</div>
                            <div className="text-xs md:text-sm text-slate-600 leading-relaxed">{faq.a}</div>
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

      </div>

      {/* Unified Global Footer */}
      <GlobalFooter />

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
        defaultBranch={selectedBranch || "mirpur"}
      />

      {/* FULLSCREEN IMAGE LIGHTBOX PREVIEW MODAL */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition cursor-pointer"
            title="বন্ধ করুন (Esc)"
          >
            <i className="fa-solid fa-xmark text-xl" />
          </button>

          {/* Previous Image Button */}
          {galleryItems.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const newIdx = (previewImage.index - 1 + galleryItems.length) % galleryItems.length;
                const prevItem = galleryItems[newIdx];
                setPreviewImage({
                  src: prevItem.src || prevItem.image || prevItem.url,
                  title: prevItem.badge || prevItem.title,
                  branch: prevItem.branch || prevItem.badge || "Uttara",
                  index: newIdx,
                });
              }}
              className="absolute left-3 sm:left-6 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition cursor-pointer"
              title="আগের ছবি"
            >
              <i className="fa-solid fa-chevron-left text-lg" />
            </button>
          )}

          {/* Next Image Button */}
          {galleryItems.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const newIdx = (previewImage.index + 1) % galleryItems.length;
                const nextItem = galleryItems[newIdx];
                setPreviewImage({
                  src: nextItem.src || nextItem.image || nextItem.url,
                  title: nextItem.badge || nextItem.title,
                  branch: nextItem.branch || nextItem.badge || "Uttara",
                  index: newIdx,
                });
              }}
              className="absolute right-3 sm:right-6 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition cursor-pointer"
              title="পরের ছবি"
            >
              <i className="fa-solid fa-chevron-right text-lg" />
            </button>
          )}

          {/* Image & Caption Container */}
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage.src}
              alt={previewImage.title || "Tech Dental Image"}
              className="max-w-full max-h-[78vh] object-contain rounded-2xl shadow-2xl select-none"
            />
            <div className="mt-3.5 flex items-center justify-between w-full px-2 text-white/90 text-sm">
              <span className="font-semibold text-base">{previewImage.title || previewImage.branch}</span>
              <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full text-white/80">
                {previewImage.index + 1} / {galleryItems.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN VIDEO MODAL */}
      {previewVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={() => setPreviewVideo(null)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setPreviewVideo(null)}
            className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition cursor-pointer"
            title="বন্ধ করুন (Esc)"
          >
            <i className="fa-solid fa-xmark text-xl" />
          </button>

          <div
            className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${previewVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={previewVideo.title || "Tech Dental Video"}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* EXPAND / FULL VIEW MODAL */}
      {/* ========================================== */}
      {isFullModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 font-['Noto_Sans_Bengali','Anek_Bangla',sans-serif]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <i className="fa-solid fa-sparkles text-xs" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">টেক ডেন্টাল এসিস্ট্যান্ট (ফুল ভিউ)</h4>
                  <p className="text-[11px] text-slate-400">বিস্তারিত কথোপকথন ও পরামর্শ</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsFullModalOpen(false)}
                  className="p-2 hover:bg-slate-200 rounded-full text-slate-600 transition cursor-pointer"
                  title="বন্ধ করুন"
                >
                  <i className="fa-solid fa-xmark text-base" />
                </button>
              </div>
            </div>

            {/* Modal Chat Scroll Area */}
            <div ref={modalChatScrollRef} className="flex-1 overflow-y-auto custom-scroll p-6 space-y-4">
              {chatMessages.map(renderChatMessage)}
              {isAiLoading && (
                <div className="w-fit flex items-center gap-1.5 px-4 py-3 bg-slate-50/80 rounded-2xl border border-slate-100 shadow-2xs">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>

            {/* Modal Search Input Bar */}
            <div className="p-4 border-t border-slate-100 bg-white shrink-0">
              <form
                onSubmit={handleModalSubmit}
                className="relative flex items-center bg-[#f0f4f9] rounded-full px-5 py-2.5 sm:py-3 border border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20"
              >
                <svg className="w-4 h-4 text-slate-400 mr-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={modalInputValue}
                  onChange={(e) => setModalInputValue(e.target.value)}
                  placeholder="আপনার পরবর্তী প্রশ্ন লিখুন..."
                  className="w-full bg-transparent text-sm outline-none text-slate-800 border-0 ring-0 focus:ring-0 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isAiLoading || !modalInputValue.trim()}
                  className="ml-2 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-xs transition cursor-pointer shrink-0 disabled:opacity-40"
                  title="পাঠান"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Minimal Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300">
          <div className="bg-slate-900 text-white text-xs px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2">
            <i className="fa-solid fa-check text-emerald-400 text-xs" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
