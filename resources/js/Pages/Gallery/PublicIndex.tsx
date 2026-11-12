import React, { useState, useMemo, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { TopHeader } from "@/Components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
import Seo from "@/Components/Seo";
import { PageProps } from "@inertiajs/core";
import { getWebsiteTexts } from "@/data/websiteTexts";

interface GalleryProps extends PageProps {
  locations?: any[];
  nav_menu?: any;
  featured_images?: any[];
  videos?: any[];
}

export default function GalleryPublicIndex({ locations = [], nav_menu, featured_images = [], videos = [] }: GalleryProps) {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "images" | "videos">("all");
  const [previewImage, setPreviewImage] = useState<{ src: string; title?: string; index: number } | null>(null);
  const [previewVideo, setPreviewVideo] = useState<{ videoId: string; title?: string } | null>(null);
  const page = usePage();
  const copy = getWebsiteTexts((page.props as any)?.site_settings?.website_texts);

  // Check URL hash on mount (e.g. #videos)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#videos") {
      setActiveTab("videos");
    }
  }, []);

  // Images come from Featured Sliders in the backend (no hardcoded fallbacks).
  // The same photo can be attached to more than one branch, so show each image only once.
  const imageItems = useMemo(() => {
    const seen = new Set<string>();
    return (Array.isArray(featured_images) ? featured_images : []).filter((img: any) => {
      const raw = String(img?.src || img?.image || img?.url || '').trim();
      const key = raw.replace(/^https?:\/\/[^/]+/i, '').replace(/\/+$/, '').toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [featured_images]);

  // Videos come from Homepage CMS > Video Gallery (home_videos table).
  const videoItems = useMemo(() => (
    (Array.isArray(videos) ? videos : []).map((v: any) => ({
      id: v.id,
      videoId: v.video_id,
      title: v.title || '',
      branch: v.branch || '',
    })).filter((v: any) => v.videoId)
  ), [videos]);

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
          title: prevItem.title && prevItem.title !== "Homepage" ? prevItem.title : "",
          index: newIdx,
        });
      } else if (e.key === "ArrowRight") {
        const newIdx = (previewImage.index + 1) % imageItems.length;
        const nextItem = imageItems[newIdx];
        setPreviewImage({
          src: nextItem.src || (nextItem as any).image || (nextItem as any).url,
          title: nextItem.title && nextItem.title !== "Homepage" ? nextItem.title : "",
          index: newIdx,
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewImage, imageItems]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-['Inter','Plus_Jakarta_Sans','SolaimanLipi','Noto_Sans_Bengali',sans-serif]">
      <Seo
        title={copy.gallery_seo_title}
        description={copy.gallery_seo_desc}
        path="/gallery"
      />

      {/* Top Header Navigation */}
      <TopHeader
        locations={locations}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        navMenu={nav_menu}
      />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-12 md:py-16 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            {copy.gallery_h1}
          </h1>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">

        {/* Tab Filters */}
        {(imageItems.length > 0 || videoItems.length > 0) && (
        <div className="flex items-center justify-center gap-2 mb-8">
          {imageItems.length > 0 && videoItems.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === "all"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {copy.gallery_tab_all}
            </button>
          )}
          {imageItems.length > 0 && (
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
            <span>{copy.gallery_tab_images}</span>
          </button>
          )}
          {videoItems.length > 0 && (
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
            <span>{copy.gallery_tab_videos}</span>
          </button>
          )}
        </div>
        )}

        {imageItems.length === 0 && videoItems.length === 0 && (
          <div className="text-center py-20 text-sm font-medium text-slate-500">
            {copy.gallery_empty}
          </div>
        )}

        {/* Images Grid */}
        {imageItems.length > 0 && (activeTab === "all" || activeTab === "images") && (
          <section className="mb-12" id="images">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <i className="fa-solid fa-images text-blue-600" />
                <span>{copy.gallery_images_heading}</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {imageItems.length} {copy.gallery_photos_suffix}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {imageItems.map((item: any, idx: number) => {
                const title = item.title && item.title !== "Homepage" ? item.title : "";
                const imgSrc = item.src || item.image || item.url || "";

                return (
                  <div
                    key={item.id || idx}
                    onClick={() => setPreviewImage({ src: imgSrc, title, index: idx })}
                    className="relative rounded-2xl overflow-hidden shadow-xs border border-slate-200/90 bg-slate-100 aspect-[4/3] group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    title={copy.gallery_click_image}
                  >
                    <img
                      src={imgSrc}
                      alt={title || "Gallery"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                    {title && (
                      <div className="absolute bottom-2 left-2 right-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/70 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-1 rounded-lg line-clamp-1">
                          {title}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Videos Grid */}
        {videoItems.length > 0 && (activeTab === "all" || activeTab === "videos") && (
          <section className="mb-12" id="videos">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <i className="fa-brands fa-youtube text-red-600" />
                <span>{copy.gallery_videos_heading}</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {videoItems.length} {copy.gallery_videos_suffix}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {videoItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => setPreviewVideo({ videoId: item.videoId, title: item.title })}
                  className="relative rounded-2xl overflow-hidden shadow-xs border border-slate-200/90 bg-slate-900 aspect-[4/3] group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  title={copy.gallery_click_video}
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
