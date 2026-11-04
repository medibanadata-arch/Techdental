

import React, { useState } from "react";
import { User, Clock, Stethoscope } from "lucide-react";

interface DoctorsSectionProps {
  doctors: any[];
  onViewDoctorProfile: (doctor: any) => void;
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({
  doctors,
  onViewDoctorProfile,
}) => {
  const [activeBranchFilter, setActiveBranchFilter] = useState<string>("all");

  const branchFilters = [
    { key: "all", label: "All" },
    { key: "mirpur", label: "Mirpur" },
    { key: "badda", label: "Badda" },
    { key: "uttara", label: "Uttara" },
    { key: "jatrabari", label: "Jatrabari" },
  ];

  const filteredDoctors =
    activeBranchFilter === "all"
      ? doctors
      : doctors.filter(
          (d) =>
            d.branch.toLowerCase().includes(activeBranchFilter) ||
            (d.branchTitle && d.branchTitle.toLowerCase().includes(activeBranchFilter))
        );

  return (
    <section id="doctors-section" className="scroll-mt-24 sm:scroll-mt-28 px-1 py-3 sm:px-4.5 md:px-8 md:py-5">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-base md:text-lg font-black text-slate-900 tracking-tight">
          <Stethoscope className="w-5 h-5 text-primary-maroon" />
          <span>Specialist Doctors</span>
        </div>
        <div className="flex items-center gap-2">
          <a href="/doctors" className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline">
            All Doctors →
          </a>
          <span className="text-[0.72rem] font-bold text-primary-maroon bg-[#fdf2f4] px-2.5 py-0.5 rounded-full">
            {filteredDoctors.length}
          </span>
        </div>
      </div>

      {/* Doctor Filter Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3.5">
        {branchFilters.map((filter) => {
          const isActive = activeBranchFilter === filter.key;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveBranchFilter(filter.key)}
              className={`px-3.5 py-1 rounded-full text-[0.75rem] font-bold border transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[#fdf2f4] text-primary-maroon border-[#fbcfe8]"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Doctor Carousel Horizontal Scroll Cards */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1.5 snap-x">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="w-[220px] min-w-[220px] max-w-[220px] bg-white border-[1.5px] border-slate-200 rounded-[18px] p-3.5 flex flex-col items-center text-center shrink-0 shadow-2xs relative snap-start hover:border-primary-maroon/40 transition-all group"
          >
            {/* Branch Badge */}
            <div className="absolute top-2.5 left-2.5 text-[0.65rem] font-bold text-accent-blue bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
              📍 {doc.branchTitle || doc.branch}
            </div>

            {/* Avatar */}
            <a href={`/doctors/${doc.id}`} className="w-16 h-16 rounded-full overflow-hidden my-2.5 border-2 border-[#fdf2f4] shadow-xs group-hover:scale-105 transition-transform duration-300 block">
              <img
                src={doc.img}
                alt={doc.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </a>

            {/* Info */}
            <a href={`/doctors/${doc.id}`} className="hover:underline block">
              <h4 className="text-[0.86rem] font-extrabold text-slate-900 leading-snug mb-0.5 line-clamp-1">
                {doc.name}
              </h4>
            </a>
            <div className="text-[0.72rem] font-bold text-primary-maroon mb-0.5 line-clamp-1">
              {doc.spec}
            </div>
            <div className="text-[0.68rem] text-slate-500 mb-2 line-clamp-1">
              {doc.degree}
            </div>

            {/* Visiting Time */}
            <div className="w-full flex items-center justify-center gap-1.5 text-[0.72rem] font-semibold text-slate-500 mb-3 bg-slate-50 py-1 rounded-lg">
              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{doc.time || doc.visiting_time}</span>
            </div>

            {/* View Profile Button */}
            <a
              href={`/doctors/${doc.id}`}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 hover:border-slate-400 py-2 rounded-xl text-[0.74rem] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
            >
              <User className="w-3.5 h-3.5" />
              <span>View Profile</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};
