import React, { useMemo } from "react";
import { MapPin, Clock, ArrowRight } from "lucide-react";

interface BranchesSectionProps {
  locations?: any[];
  selectedBranch: string;
  onSelectBranch: (branchId: string) => void;
  onBookBranch?: (branchId: string) => void;
}

export const BranchesSection: React.FC<BranchesSectionProps> = ({
  locations = [],
  selectedBranch,
  onSelectBranch,
}) => {
  // Normalize formatted branches with accurate fallback data
  const formattedBranches = useMemo(() => {
    if (Array.isArray(locations) && locations.length > 0) {
      return locations.map((loc) => {
        const rawName = loc.name || loc.branch_name || loc.city || loc.shortName || `Branch ${loc.id}`;
        let cleanName = (loc.short_name || rawName).replace(/\bbranch\b/gi, '').trim();
        if (!cleanName) cleanName = rawName;
        const fullName = rawName.includes('Branch') ? rawName : `${cleanName} Branch`;

        const slug = loc.slug || cleanName.toLowerCase().replace(/\s+/g, '-');
        const id = String(loc.id || loc.location_id || slug);

        return {
          id: id,
          slug: slug,
          name: fullName,
          shortName: cleanName,
          address: loc.address || `${cleanName}, Dhaka, Bangladesh`,
          time: loc.time || "4:00 PM – 9:00 PM",
        };
      });
    }

    return [
      { id: "1", slug: "mirpur", name: "Mirpur Branch", shortName: "Mirpur", address: "827 (2nd Floor), Shewrapara, Begum Rokeya Sarani, Mirpur, Dhaka- 1216", time: "4:00 PM – 9:00 PM" },
      { id: "2", slug: "uttara", name: "Uttara Branch", shortName: "Uttara", address: "Sector 3, Uttara, Dhaka", time: "4:00 PM – 9:00 PM" },
      { id: "3", slug: "badda", name: "Badda Branch", shortName: "Badda", address: "Middle Badda, Pragati Sarani, Dhaka", time: "4:00 PM – 9:00 PM" },
      { id: "4", slug: "jatrabari", name: "Jatrabari Branch", shortName: "Jatrabari", address: "Shahid Faruk Road, Jatrabari, Dhaka", time: "4:00 PM – 9:00 PM" },
    ];
  }, [locations]);

  const currentBranch = useMemo(() => {
    const sel = String(selectedBranch).toLowerCase();
    return (
      formattedBranches.find(
        (b) => b.slug.toLowerCase() === sel || b.id === sel || b.shortName.toLowerCase() === sel
      ) || formattedBranches[0]
    );
  }, [formattedBranches, selectedBranch]);

  if (!currentBranch) return null;

  return (
    <section id="branch-section" className="scroll-mt-24 sm:scroll-mt-28 px-1 py-3 sm:px-4.5 md:px-8 md:py-5">
      {/* Title */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-base md:text-lg font-black text-slate-900 tracking-tight">
          <MapPin className="w-5 h-5 text-primary-maroon" />
          <span>Our Branches</span>
        </div>
        <a href="/branches" className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline">
          All Branches →
        </a>
      </div>

      {/* Branch Tabs / Pills with Actual Branch Names */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
        {formattedBranches.map((b) => {
          const isActive =
            currentBranch.id === b.id || currentBranch.slug === b.slug;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelectBranch(b.slug || b.id)}
              className={`px-3.5 py-1.5 rounded-full text-[0.76rem] font-bold border transition-all duration-150 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-primary-maroon text-white border-primary-maroon shadow-xs"
                  : "bg-white text-slate-800 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              {(b.shortName || b.name).replace(/\bbranch\b/gi, '').trim()}
            </button>
          );
        })}
      </div>

      {/* Active Branch Detail Card */}
      <div className="bg-white border-[1.5px] border-slate-200 rounded-[14px] p-3.5 md:p-4 shadow-xs">
        <h3 className="text-[0.88rem] font-extrabold text-slate-900 mb-1.5">
          {currentBranch.name}
        </h3>
        <p className="text-[0.78rem] text-slate-500 mb-2 flex items-start gap-1.5 leading-snug">
          <MapPin className="w-3.5 h-3.5 text-primary-maroon shrink-0 mt-0.5" />
          <span>{currentBranch.address}</span>
        </p>
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2.5 mt-1 border-t border-slate-100">
          <div className="text-[0.78rem] text-primary-maroon font-bold flex items-center gap-1.5 bg-[#800038]/5 px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5" />
            <span>{currentBranch.time}</span>
          </div>
          <a
            href={`/branch/${currentBranch.slug || currentBranch.id || 'mirpur'}`}
            className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#800038] to-[#990044] hover:from-[#66002c] hover:to-[#800038] text-white font-extrabold text-[0.76rem] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95"
          >
            <span>Branch Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
