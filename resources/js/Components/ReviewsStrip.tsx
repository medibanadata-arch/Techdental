

import React from "react";
import { Star, CheckCircle } from "lucide-react";

interface ReviewsStripProps {
  onOpenReviews: () => void;
}

export const ReviewsStrip: React.FC<ReviewsStripProps> = ({ onOpenReviews }) => {
  return (
    <div className="mx-1 sm:mx-4 mb-5 p-3.5 bg-white border-[1.5px] border-slate-200 rounded-2xl shadow-xs">
      {/* Top Row: Score + Stars */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Star Icon Badge */}
          <div className="w-[34px] h-[34px] rounded-lg bg-[#fef3c7] text-[#d97706] flex items-center justify-center shrink-0">
            <Star className="w-4 h-4 fill-[#d97706]" />
          </div>

          <div>
            <div className="text-[0.95rem] font-extrabold text-slate-900 flex items-center gap-1.5 leading-none">
              <span>4.9</span>
              <span className="text-[#f59e0b] text-[0.85rem] tracking-wider">★★★★★</span>
            </div>
            <div className="text-[0.74rem] text-slate-500 font-semibold mt-1 flex items-center gap-1">
              <span>2,500+ Verified Patient Reviews</span>
              <CheckCircle className="w-3.5 h-3.5 text-accent-blue inline" />
            </div>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="mt-2.5 text-[0.76rem] text-slate-600 italic bg-[#f8fafc] p-2.5 rounded-lg border-l-[3px] border-[#f59e0b] leading-relaxed">
        “Extremely gentle and painless treatment! The doctors explained every procedure clearly, and the clinic environment was spotless and reassuring.”
      </div>

      {/* Branch Google Reviews Button */}
      <button
        type="button"
        onClick={onOpenReviews}
        className="w-full mt-2.5 py-2 px-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-[0.76rem] font-bold text-slate-800 flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <span className="font-black text-[#ea4335] text-xs">G</span>
        <span>See All Google Reviews by Branch</span>
      </button>
    </div>
  );
};
