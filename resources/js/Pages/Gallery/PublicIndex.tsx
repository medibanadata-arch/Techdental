import React, { useState, useMemo, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { TopHeader } from "@/Components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
import { PageProps } from "@inertiajs/core";

interface GalleryProps extends PageProps {
  locations?: any[];
  nav_menu?: any;
  featured_images?: any[];
}

export default function GalleryPublicIndex({ locations = [], nav_menu, featured_images = [] }: GalleryProps) {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "images" | "videos">("all");
  const [previewImage, setPreviewImage] = useState<{ src: string; title?: string; index: number } | null>(null);
  const [previewVideo, setPreviewVideo] = useState<{ videoId: string; title?: string } | null>(null);

  // Check URL hash on mount (e.g. #videos)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#videos") {
      setActiveTab("videos");
    }
  }, []);

  const imageItems = useMemo(() => {
    if (Array.isArray(featured_images) && featured_images.length > 0) {
      return featured_images;
    }
    return [
      {
        id: 1,
        title: "টেক ডেন্টাল হেড অফিস",
        src: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 2,
        title: "আধুনিক মাইক্রোস্কোপিক ডেন্টাল কেয়ার",
        src: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 3,
        title: "উন্নত ও আরামদায়ক চিকিৎসা পরিবেশ",
        src: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 4,
        title: "ডিজিটাল ইন্ট্রাওরাল স্ক্যানিং রুম",
        src: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 5,
        title: "অত্যাধুনিক ডেন্টাল ওটি সেটআপ",
        src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 6,
        title: "৩ডি কোন বিম সিটি স্ক্যান (CBCT)",
        src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 7,
        title: "জীবাণুমুক্তকরণ ও স্টেরিলাইজেশন জোন",
        src: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 8,
        title: "শিশুদের স্পেশাল ডেন্টাল কর্নার",
        src: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 9,
        title: "ডিজিটাল স্মাইল ডিজাইন পরামর্শ রুম",
        src: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 10,
        title: "ব্যথামুক্ত ডেন্টাল ইমপ্ল্যান্ট সেন্টার",
        src: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 11,
        title: "লেজার ডেন্টাল ট্রিটমেন্ট ইউনিট",
        src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 12,
        title: "রোগী ওয়েটিং ও রিলাক্সেশন লাউঞ্জ",
        src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      },
    ];
  }, [featured_images]);

  const videoItems = useMemo(() => [
    {
      id: 1,
      videoId: "szdRKLSLzOE",
      title: "আল্ট্রাসনিক স্কেলিং ও আধুনিক পলিশিং",
    },
    {
      id: 2,
      videoId: "szdRKLSLzOE",
      title: "কম্পিউটারাইজড পেইনলেস রুট ক্যানেল",
    },
    {
      id: 3,
      videoId: "szdRKLSLzOE",
      title: "জার্মান প্রযুক্তির ডেন্টাল ইমপ্ল্যান্ট সার্জারি",
    },
    {
      id: 4,
      videoId: "szdRKLSLzOE",
      title: "দাঁত ফাঁকা ও আঁকাবাঁকা চিকিৎসা (ব্রেসেস)",
    },
    {
      id: 5,
      videoId: "szdRKLSLzOE",
      title: "ডিজিটাল স্মাইল ডিজাইন ও ভিনিয়ার্স",
    },
    {
      id: 6,
      videoId: "szdRKLSLzOE",
      title: "বাচ্চাদের দাঁতের যত্ন ও ক্যাভিটি ফিলিং",
    },
    {
      id: 7,
      videoId: "szdRKLSLzOE",
      title: "আধুনিক ডিজিটাল ৩ডি ওপিজি এক্স-রে রুম",
    },
    {
      id: 8,
      videoId: "szdRKLSLzOE",
      title: "ক্লাস-বি অটোক্লেভ ১০০% জীবাণুমুক্তকরণ ব্যবস্থা",
    },
  ], []);

  // Keyboard navigation for image lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!previewImage) return;
      if (e.key === "Escape") {
        setPreviewImage(null);
      } else if (e.key === "ArrowLeft") {
        const newIdx = (previewImage.index - 1 + imageItems.length) % imageItems.length;
        const prevItem = imageItems[newIdx];
        setPreviewImage({
          src: prevItem.src || (prevItem as any).image || (prevItem as any).url,
          title: (prevItem as any).badge || prevItem.title,
          index: newIdx,
        });
      } else if (e.key === "ArrowRight") {
        const newIdx = (previewImage.index + 1) % imageItems.length;
        const nextItem = imageItems[newIdx];
        setPreviewImage({
          src: nextItem.src || (nextItem as any).image || (nextItem as any).url,
          title: (nextItem as any).badge || nextItem.title,
          index: newIdx,
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewImage, imageItems]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-['Noto_Sans_Bengali','Inter',sans-serif]">
      <Head title="গ্যালারি (ছবি ও ভিডিও) — Tech Dental Gallery" />

      {/* Top Header Navigation */}
      <TopHeader
        locations={locations}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        navMenu={nav_menu}
      />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-10 md:py-14 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-3 backdrop-blur-xs">
            <i className="fa-solid fa-photo-film" />
            <span>Tech Dental Media</span>
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
            টেক ডেন্টাল গ্যালারি
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
            আমাদের সকল শাখার সর্বাধুনিক চিকিৎসা যন্ত্রপাতি, অপারেশন থিয়েটার ও স্বাস্থ্য সচেতনতামূলক ভিডিও সমূহ।
          </p>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">

        {/* Tab Filters */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === "all"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            সব দেখুন (All)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("images")}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === "images"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <i className="fa-solid fa-images text-xs" />
            <span>ছবিসমূহ (Images)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("videos")}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === "videos"
                ? "bg-red-600 text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <i className="fa-brands fa-youtube text-xs" />
            <span>ভিডিওসমূহ (Videos)</span>
          </button>
        </div>

        {/* Images Grid */}
        {(activeTab === "all" || activeTab === "images") && (
          <section className="mb-12" id="images">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <i className="fa-solid fa-images text-blue-600" />
                <span>Image Gallery</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                মোট {imageItems.length} টি ছবি
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {imageItems.map((item: any, idx: number) => {
                const title = item.badge || item.title || "Tech Dental";
                const imgSrc = item.src || item.image || item.url || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80";

                return (
                  <div
                    key={item.id || idx}
                    onClick={() => setPreviewImage({ src: imgSrc, title, index: idx })}
                    className="relative rounded-2xl overflow-hidden shadow-xs border border-slate-200/90 bg-slate-100 aspect-[4/3] group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    title="বড় করে দেখতে ক্লিক করুন"
                  >
                    <img
                      src={imgSrc}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                    <div className="absolute bottom-2 left-2 right-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/70 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-1 rounded-lg line-clamp-1">
                        {title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Videos Grid */}
        {(activeTab === "all" || activeTab === "videos") && (
          <section className="mb-12" id="videos">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <i className="fa-brands fa-youtube text-red-600" />
                <span>Video Gallery</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                মোট {videoItems.length} টি ভিডিও
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {videoItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => setPreviewVideo({ videoId: item.videoId, title: item.title })}
                  className="relative rounded-2xl overflow-hidden shadow-xs border border-slate-200/90 bg-slate-900 aspect-[4/3] group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  title="ভিডিও প্লে করতে ক্লিক করুন"
                >
                  <img
                    src={`https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100 pointer-events-none"
                    loading="lazy"
                  />

                  {/* Red Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-red-600 transition-all">
                      <i className="fa-solid fa-play text-xs sm:text-base translate-x-0.5" />
                    </div>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute top-2 left-2 right-2 pointer-events-none">
                    <div className="bg-black/70 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md line-clamp-1">
                      {item.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Image Lightbox Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800/80 text-white border-b border-slate-700/60">
              <span className="text-xs sm:text-sm font-medium truncate max-w-[80%]">
                {previewImage.title}
              </span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="w-8 h-8 rounded-full bg-slate-700 hover:bg-red-500 text-white flex items-center justify-center transition cursor-pointer"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {/* Main Image */}
            <div className="relative flex items-center justify-center bg-black/60 max-h-[75vh] min-h-[280px]">
              <img
                src={previewImage.src}
                alt={previewImage.title || "Gallery"}
                className="max-h-[75vh] w-auto object-contain mx-auto select-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {previewVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setPreviewVideo(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800 text-white border-b border-slate-700">
              <span className="text-xs sm:text-sm font-semibold truncate max-w-[85%]">
                {previewVideo.title}
              </span>
              <button
                type="button"
                onClick={() => setPreviewVideo(null)}
                className="w-8 h-8 rounded-full bg-slate-700 hover:bg-red-500 text-white flex items-center justify-center transition cursor-pointer"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${previewVideo.videoId}?autoplay=1&rel=0`}
                title={previewVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Global Footer */}
      <GlobalFooter locations={locations} />
    </div>
  );
}

