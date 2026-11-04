import React from "react";

export type NavPillKey = "overview" | "branch-section" | "services-wrapper" | "doctors-section";

interface NavPillsProps {
  activePill: NavPillKey;
  onSelectPill: (pill: NavPillKey) => void;
}

export const NavPills: React.FC<NavPillsProps> = ({ activePill, onSelectPill }) => {
  const pills: { key: NavPillKey; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "branch-section", label: "Branch" },
    { key: "doctors-section", label: "Doctors" },
    { key: "services-wrapper", label: "Services" },
  ];

  return (
    <nav className="flex items-center gap-2.5 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-4 pb-3 sm:pt-5 sm:pb-3.5 overflow-x-auto no-scrollbar" aria-label="Section navigation">
      {pills.map((pill) => {
        const isActive = activePill === pill.key;
        return (
          <button
            key={pill.key}
            type="button"
            onClick={() => onSelectPill(pill.key)}
            className={`px-4 py-2 rounded-full text-xs sm:text-[0.82rem] font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
              isActive
                ? "bg-[#fdf2f4] text-primary-maroon border border-[#fbcfe8] font-bold shadow-2xs"
                : "bg-[#f1f5f9] text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 border border-transparent"
            }`}
          >
            {pill.label}
          </button>
        );
      })}
    </nav>
  );
};
