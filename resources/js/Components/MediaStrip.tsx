

import React, { useState, useEffect, useRef } from "react";
import { Camera, ChevronLeft, ChevronRight, X, MapPin, Info, Eye } from "lucide-react";
import { GALLERY_IMAGES } from "@/data/dentalData";
import { apiGetFeaturedImages } from "@/lib/api";

// Seeded pseudo-random: stable per image, deterministic across renders
function seededRandom(seed: number): number {
  // Use a simple but well-distributed hash
  let s = (seed * 2654435761) >>> 0; // Knuth multiplicative hash
  s ^= s >>> 16;
  s = (s * 2246822519) >>> 0;
  s ^= s >>> 13;
  return (s >>> 0) / 4294967295;
}

// Generate stable view count for an image based on its index/id and configured min
function getViewCount(seed: number, minViews: number): number {
  const rnd = seededRandom(seed);
  const range = Math.max(800, minViews * 8); // generous spread above min
  return Math.floor(minViews + rnd * range);
}

// Helper to sort images strictly by sort_order (matching top-to-bottom serial in admin table)
function sortImagesBySerial(list: any[]): any[] {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => {
    const orderA = typeof a.sort_order === "number" ? a.sort_order : (parseInt(a.sort_order, 10) || 9999);
    const orderB = typeof b.sort_order === "number" ? b.sort_order : (parseInt(b.sort_order, 10) || 9999);
    if (orderA !== orderB) return orderA - orderB;
    return (Number(a.id) || 0) - (Number(b.id) || 0);
  });
}

// Deep comparison helper: returns true if both image lists have identical items in identical order
function isSameImageList(a: any[], b: any[]): boolean {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const itemA = a[i];
    const itemB = b[i];
    if (String(itemA.id) !== String(itemB.id)) return false;
    if (itemA.src !== itemB.src) return false;
    if ((itemA.badge || itemA.branch) !== (itemB.badge || itemB.branch)) return false;
    if (itemA.title !== itemB.title) return false;
    if (itemA.sort_order !== itemB.sort_order) return false;
  }
  return true;
}

interface MediaStripProps {
  initialImages?: any[];
}

export const MediaStrip: React.FC<MediaStripProps> = ({ initialImages }) => {
  // Synchronously initialize with initialImages passed from backend if available, else build-time GALLERY_IMAGES
  const [images, setImages] = useState<any[]>(() => {
    if (Array.isArray(initialImages) && initialImages.length > 0) {
      return sortImagesBySerial(initialImages);
    }
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("td_featured_images_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return sortImagesBySerial(parsed);
          }
        }
      } catch (e) {}
    }
    return sortImagesBySerial(GALLERY_IMAGES);
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [minViewCount, setMinViewCount] = useState<number>(300);

  // Modal State
  const [selectedModalIndex, setSelectedModalIndex] = useState<number | null>(null);

  // Load admin-configured min view count from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("td_gallery_min_views");
    if (stored) setMinViewCount(parseInt(stored, 10) || 300);
  }, []);

  // Track real visitor impression (once per session per image)
  useEffect(() => {
    if (typeof window === 'undefined' || !Array.isArray(images)) return;
    images.forEach((img) => {
      if (!img.id) return;
      const key = `td_imp_${img.id}`;
      try {
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, '1');
          fetch('/api/featured-images/' + img.id + '/view', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }).catch(() => {});
        }
      } catch (e) {}
    });
  }, [images]);

  useEffect(() => {
    let isMounted = true;

    // Laravel already passed the admin-managed gallery (featured_images) — it is the source of truth,
    // so don't let stale localStorage cache or the legacy external API override it.
    if (Array.isArray(initialImages) && initialImages.length > 0) {
      try {
        localStorage.setItem("td_featured_images_cache", JSON.stringify(sortImagesBySerial(initialImages)));
      } catch (e) {}
      return () => {
        isMounted = false;
      };
    }

    // 1. Immediately apply cached images if available
    try {
      const cached = localStorage.getItem("td_featured_images_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sorted = sortImagesBySerial(parsed);
          setImages((prev) => (isSameImageList(prev, sorted) ? prev : sorted));
        }
      }
    } catch (e) {}

    // 2. Fetch latest from backend API
    apiGetFeaturedImages(false)
      .then((res) => {
        if (isMounted && res.success && res.data && res.data.length > 0) {
          const sorted = sortImagesBySerial(res.data);
          // Persist fresh sorted data to cache
          try {
            localStorage.setItem("td_featured_images_cache", JSON.stringify(sorted));
          } catch (e) {}

          setImages((prev) => {
            // CRUCIAL: If the list is identical, return the previous state reference
            // to avoid triggering any component re-render, image reload, or layout shift ("bari mara")
            if (isSameImageList(prev, sorted)) {
              return prev;
            }
            return sorted;
          });
        }
      })
      .catch((err) => {
        console.warn("Using cached/default gallery images:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 15);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);
    return () => window.removeEventListener("resize", updateScrollButtons);
  }, [images]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.7;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Mouse Drag to Scroll for Strip
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.6;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
    updateScrollButtons();
  };

  // Modal Navigation
  const handlePrevImage = () => {
    if (selectedModalIndex === null) return;
    setSelectedModalIndex((prev) => (prev! === 0 ? images.length - 1 : prev! - 1));
  };

  const handleNextImage = () => {
    if (selectedModalIndex === null) return;
    setSelectedModalIndex((prev) => (prev! === images.length - 1 ? 0 : prev! + 1));
  };

  // Keyboard navigation for Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedModalIndex === null) return;
      if (e.key === "Escape") setSelectedModalIndex(null);
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedModalIndex, images.length]);

  return (
    <>
      {/* HEADER FEATURED MEDIA STRIP */}
      <section className="relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-3 md:py-4 group/slider w-full">
        {/* DESKTOP Left Scroll Button (Original Desktop Style) */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll("left")}
            className="hidden md:flex absolute left-8 lg:left-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-slate-200 text-slate-800 hover:bg-white hover:text-primary-maroon hover:scale-105 transition-all cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* DESKTOP Right Scroll Button (Original Desktop Style) */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll("right")}
            className="hidden md:flex absolute right-8 lg:right-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-slate-200 text-slate-800 hover:bg-white hover:text-primary-maroon hover:scale-105 transition-all cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* MOBILE Right Scroll Button (Small & Far Right - Mobile Only) */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll("right")}
            className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 flex items-center justify-center rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md shadow-2xl text-white transition-all duration-200 cursor-pointer border border-white/30"
            aria-label="Scroll right mobile"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}

        {/* Horizontal Image Strip: Mobile (1-Full + 1-Half) | Desktop (Original Full Layout) */}
        <div
          ref={scrollRef}
          onScroll={updateScrollButtons}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex flex-row flex-nowrap gap-3 md:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar rounded-2xl ${
            isDragging ? "cursor-grabbing select-none" : "cursor-grab"
          }`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {images.map((img, index) => {
            const isFull = img.type === "full-size" || index === 0;

            return (
              <div
                key={img.id ? `fimg-${img.id}` : `idx-${index}`}
                onClick={() => {
                  if (!isDragging) {
                    setSelectedModalIndex(index);
                    // Track real view count in backend & localStorage
                    if (img.id) { try { fetch('/api/featured-images/' + img.id + '/view', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' } }).catch(() => {}); } catch(e) {} }
                    if (img.id) {
                      const storedCounts = localStorage.getItem("td_real_view_counts");
                      const counts: Record<string, number> = storedCounts ? JSON.parse(storedCounts) : {};
                      counts[String(img.id)] = (counts[String(img.id)] || 0) + 1;
                      localStorage.setItem("td_real_view_counts", JSON.stringify(counts));
                    }
                  }
                }}
                className={`relative shrink-0 h-[200px] sm:h-[230px] md:h-[260px] lg:h-[290px] rounded-2xl overflow-hidden snap-start shadow-md group/card select-none cursor-pointer transition-all duration-300 border border-slate-200/80 bg-slate-100 ${
                  // Mobile: 60vw for 1-full + 1-half
                  // Desktop: Original desktop layout dimensions
                  isFull
                    ? "w-[60vw] md:w-[420px] lg:w-[460px]"
                    : "w-[60vw] md:w-[290px] lg:w-[320px]"
                }`}
              >
                <img
                  src={img.src}
                  alt={img.alt || img.title || `Tech Dental Photo ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105 pointer-events-none"
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding={index === 0 ? "sync" : "async"}
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover/card:opacity-40 transition-opacity pointer-events-none" />

                {/* Camera Badge: Mobile and Desktop */}
                <div className="flex absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 bg-black/70 backdrop-blur-xs text-white text-[0.7rem] sm:text-xs font-semibold px-2.5 py-1 rounded-full items-center gap-1.5 shadow-md pointer-events-none z-10">
                  <Camera className="w-3 h-3 text-white shrink-0" />
                  <span>{img.branch || img.badge || `Image ${index + 1}`}</span>
                </div>

                {/* Eye / View Count Badge: Bottom Right Corner */}
                <div className="flex absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 bg-black/65 backdrop-blur-sm text-white text-[0.65rem] font-semibold px-2 py-0.5 rounded-full items-center gap-1 shadow-md pointer-events-none z-10">
                  <Eye className="w-2.5 h-2.5 text-white shrink-0" />
                  <span>{((img.view_count !== undefined && img.view_count !== null && img.view_count !== 0) ? img.view_count : getViewCount(index + 1, minViewCount)).toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FULL-SCREEN GOOGLE BUSINESS STYLE MODAL VIEWER */}
      {selectedModalIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 text-white flex flex-col md:flex-row overflow-hidden animate-fade-in select-none">
          {/* DESKTOP LEFT SIDEBAR: THUMBNAIL LIST (PC VIEW ONLY) */}
          <div className="hidden md:flex flex-col w-[320px] lg:w-[360px] bg-neutral-950 border-r border-neutral-800 shrink-0 h-full">
            {/* Sidebar Title */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-white tracking-wide">
                  Photos & Media
                </h3>
                <p className="text-[0.68rem] text-neutral-400">
                  Tech Dental Care • {images.length} photos
                </p>
              </div>
            </div>

            {/* Vertical Scrollable Thumbnail Grid */}
            <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2.5 custom-scrollbar">
              {images.map((item, idx) => (
                <button
                  key={item.id || idx}
                  onClick={() => setSelectedModalIndex(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer group bg-neutral-900 ${
                    idx === selectedModalIndex
                      ? "border-sky-500 ring-2 ring-sky-500/50 scale-[0.98]"
                      : "border-transparent opacity-65 hover:opacity-100 hover:scale-[1.02]"
                  }`}
                >
                  <img
                    src={item.src}
                    alt={item.title || `Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {idx === selectedModalIndex && (
                    <div className="absolute inset-0 bg-sky-500/10 pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT / MAIN FULL PHOTO CONTAINER (PC & MOBILE) */}
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
                    Mirpur & Uttara Branch • Dhaka
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedModalIndex(null)}
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
                onClick={handlePrevImage}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xl"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
              </button>

              {/* Active Image */}
              <img
                src={images[selectedModalIndex].src}
                alt={images[selectedModalIndex].alt || "Tech Dental Photo View"}
                className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300"
              />

              {/* Next Image Navigation Button */}
              <button
                onClick={handleNextImage}
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
                <span>Rokeya Shoroni, Mirpur / Sector 11, Uttara</span>
              </div>
            </div>

            {/* MOBILE BOTTOM SCROLLABLE GRID (MATCHING USER DRAWING: 3-COLUMN ALL IMAGES GRID) */}
            <div className="md:hidden flex-1 min-h-0 bg-neutral-950 border-t border-neutral-800 flex flex-col overflow-hidden">
              <div className="px-3 pt-2.5 pb-1.5 text-[0.68rem] text-neutral-400 font-bold flex items-center justify-between uppercase tracking-wider shrink-0 border-b border-neutral-900">
                <span>All Photos ({selectedModalIndex + 1}/{images.length})</span>
                <span className="text-[0.62rem] text-neutral-500 font-normal">Tap to view</span>
              </div>

              {/* Vertical Scrollable 3-Column Grid */}
              <div className="flex-1 overflow-y-auto p-2.5 grid grid-cols-3 gap-2 custom-scrollbar">
                {images.map((item, idx) => (
                  <button
                    key={item.id || idx}
                    onClick={() => setSelectedModalIndex(idx)}
                    className={`relative aspect-square w-full rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-neutral-900 group ${
                      idx === selectedModalIndex
                        ? "border-sky-500 ring-2 ring-sky-500/60 scale-[0.97]"
                        : "border-transparent opacity-65 hover:opacity-100 hover:scale-[1.02]"
                    }`}
                  >
                    <img
                      src={item.src}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {idx === selectedModalIndex && (
                      <div className="absolute inset-0 bg-sky-500/15 pointer-events-none" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

