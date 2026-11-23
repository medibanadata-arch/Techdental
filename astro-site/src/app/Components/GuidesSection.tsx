import React, { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";

interface GuidesSectionProps {
  posts: any[];
  onSelectGuide?: (guide: any) => void;
}

export const GuidesSection: React.FC<GuidesSectionProps> = ({ posts = [], onSelectGuide }) => {
  const [showAll, setShowAll] = useState(false);

  // Maximum 3 posts initially as requested, or all if "See All" is clicked
  const displayedPosts = showAll ? posts : posts.slice(0, 3);

  const defaultAvatar = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80";
  const defaultThumb = "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=300&q=80";

  return (
    <section
      id="blogs-section"
      className="scroll-mt-24 sm:scroll-mt-28 mx-1 sm:mx-4.5 mb-5 p-4 rounded-[20px] border-[1.5px] border-[#fed7aa] bg-gradient-to-b from-[#fffbf5] to-white shadow-xs"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-base md:text-lg font-black text-slate-900 tracking-tight">
          <BookOpen className="w-5 h-5 text-primary-maroon" />
          <span>Dental Care Guides</span>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="divide-y divide-slate-100">
        {displayedPosts.map((guide) => {
          const authorName = guide.author_name || guide.authorName || "Dr. Farhana Ahmed, BDS";
          const authorAvatar = guide.author_avatar || guide.authorAvatar || defaultAvatar;
          const category = guide.category || "Dental Care";
          const thumbUrl = guide.img || guide.thumb_url || guide.thumbUrl || defaultThumb;
          const postLink = guide.slug ? `/blog/${guide.slug}` : "/blog";

          return (
            <article key={guide.id} className="py-3.5 first:pt-1 last:pb-1">
              {/* Author Line */}
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <img
                  src={authorAvatar}
                  alt={authorName}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = defaultAvatar;
                  }}
                  className="w-5.5 h-5.5 rounded-full object-cover border border-slate-300 shrink-0"
                />
                <span className="text-[0.74rem] font-bold text-slate-800">
                  {authorName}
                </span>
              </div>

              {/* Post Title */}
              <h4 className="mb-1.5">
                <a
                  href={postLink}
                  onClick={(e) => {
                    if (onSelectGuide && !guide.slug) {
                      e.preventDefault();
                      onSelectGuide(guide);
                    }
                  }}
                  className="text-[0.88rem] font-bold text-[#1a0dab] hover:underline cursor-pointer leading-snug block"
                >
                  {guide.title}
                </a>
              </h4>

              {/* Post Content Row */}
              <div className="flex gap-3 justify-between items-start">
                <div className="flex-1 text-[0.76rem] text-slate-600 leading-relaxed line-clamp-3">
                  {guide.excerpt}
                </div>
                <div className="w-[88px] h-[66px] shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <a href={postLink} className="block w-full h-full">
                    <img
                      src={thumbUrl}
                      alt={guide.title}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = defaultThumb;
                      }}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Bottom See All / Show Less Action */}
      {posts.length > 3 && (
        <div className="pt-2 text-center border-t border-slate-100 mt-2">
          {!showAll ? (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="w-full py-2 bg-amber-50 hover:bg-amber-100/70 text-amber-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>See All Articles ({posts.length})</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Show Top 3 Only</span>
              </button>
              <a
                href="/blog"
                className="text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline"
              >
                Visit Full Blog →
              </a>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
