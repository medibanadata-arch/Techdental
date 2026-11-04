import React, { useState, useEffect, useMemo } from "react";
import { Clock, ChevronDown } from "lucide-react";
import { getBranchStatus, BranchTimeInfo } from "@/utils/branchStatus";

interface OpenHoursAccordionProps {
  locations?: any[];
}

export const OpenHoursAccordion: React.FC<OpenHoursAccordionProps> = ({ locations = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // Real-time ticker: update every minute so status changes at exact opening/closing times
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Standard 4 branches fallback if not passed or empty
  const defaultBranches: BranchTimeInfo[] = useMemo(() => [
    { id: "1", name: "Mirpur Branch", shortName: "Mirpur", time: "10.00 AM - 9.00 PM" },
    { id: "2", name: "Badda Branch", shortName: "Badda", time: "03.00 PM - 9.00 PM" },
    { id: "3", name: "Uttara Branch", shortName: "Uttara", time: "03.00 PM - 9.00 PM" },
    { id: "4", name: "Jatrabari Branch", shortName: "Jatrabari", time: "03.00 PM - 9.00 PM" },
  ], []);

  // Process branches list
  const branchList = useMemo(() => {
    if (Array.isArray(locations) && locations.length > 0) {
      return locations.map((loc) => {
        const rawName = loc.name || loc.branch_name || `Branch ${loc.id}`;
        let cleanName = loc.short_name || rawName.replace(/\bbranch\b/gi, '').trim();
        if (!cleanName) cleanName = rawName.replace(/\bbranch\b/gi, '').trim();
        const fullName = /\bbranch\b/i.test(rawName) ? rawName : `${cleanName} Branch`;
        const time = loc.time || loc.hours_text || "03.00 PM - 9.00 PM";
        return {
          id: String(loc.id || loc.location_id || cleanName),
          name: fullName,
          shortName: cleanName || "Mirpur",
          time: time,
        };
      });
    }
    return defaultBranches;
  }, [locations, defaultBranches]);

  // Compute real-time status for each branch
  const branchStatuses = useMemo(() => {
    return branchList.map((branch) => {
      const status = getBranchStatus(branch, currentTime);
      return {
        ...branch,
        status,
      };
    });
  }, [branchList, currentTime]);

  // Aggregate Open Now & Open Soon
  const openNowBranches = useMemo(
    () => branchStatuses.filter((b) => b.status.isOpenNow),
    [branchStatuses]
  );

  const openSoonBranches = useMemo(
    () => branchStatuses.filter((b) => b.status.isOpenSoon),
    [branchStatuses]
  );

  const isFriday = currentTime.getDay() === 5;

  return (
    <div
      onClick={() => setIsOpen((prev) => !prev)}
      className="mx-0 sm:mx-4 mb-4 p-3 bg-white border-[1.5px] border-slate-200 rounded-2xl shadow-xs cursor-pointer transition-colors hover:border-slate-300 w-full"
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
    >
      {/* Main Header Row */}
      <div className="flex items-center gap-3">
        {/* Clock Badge */}
        <div className="w-[38px] h-[38px] rounded-[10px] bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center text-sky-700 shrink-0">
          <Clock className="w-4.5 h-4.5 text-sky-700" />
        </div>

        {/* Status Lines */}
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          {/* Open Now Line */}
          <div className="flex items-center justify-between text-[0.78rem]">
            <span className="flex items-center gap-1.5 font-bold whitespace-nowrap text-emerald-600">
              <span className="relative flex h-2 w-2">
                {openNowBranches.length > 0 && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${openNowBranches.length > 0 ? "bg-emerald-600" : "bg-slate-300"
                    }`}
                />
              </span>
              <span>Open Now</span>
            </span>
            <span className="text-slate-600 text-[0.76rem] font-semibold truncate pl-2">
              {openNowBranches.length > 0
                ? openNowBranches.map((b) => (b.shortName || b.name).replace(/\bbranch\b/gi, '').trim()).join(", ")
                : isFriday
                  ? "Closed Today (Friday)"
                  : "None (Closed)"}
            </span>
          </div>

          <div className="h-px bg-slate-100 my-0.5" />

          {/* Open Soon / Secondary Line */}
          <div className="flex items-center justify-between text-[0.78rem]">
            <span className="flex items-center gap-1.5 font-bold whitespace-nowrap text-amber-600">
              <span
                className={`w-2 h-2 rounded-full ${openSoonBranches.length > 0
                    ? "bg-amber-500"
                    : isFriday
                      ? "bg-slate-400"
                      : "bg-emerald-500"
                  }`}
              />
              <span>{isFriday ? "Weekly Off" : openSoonBranches.length > 0 ? "Open Soon" : "All Day Care"}</span>
            </span>
            <span className="text-slate-500 text-[0.76rem] font-semibold truncate pl-2">
              {openSoonBranches.length > 0
                ? openSoonBranches.map((b) => (b.shortName || b.name).replace(/\bbranch\b/gi, '').trim()).join(", ")
                : isFriday
                  ? "All Branches Closed"
                  : "All Branches Active"}
            </span>
          </div>
        </div>

        {/* Chevron Arrow Circle */}
        <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180 text-rose-800" : ""
              }`}
          />
        </div>
      </div>

      {/* Expand Content: Detailed Branch-by-Branch Timings */}
      {isOpen && (
        <div className="mt-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200 animate-fade-in divide-y divide-dashed divide-slate-200 text-[0.78rem]">
          {branchStatuses.map((b) => {
            const isOpenNow = b.status.isOpenNow;
            const isOpenSoon = b.status.isOpenSoon;

            return (
              <div key={b.id} className="flex justify-between items-center py-2 gap-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 min-w-0 flex-1">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${isOpenNow
                        ? "bg-emerald-600 ring-2 ring-emerald-200"
                        : isOpenSoon
                          ? "bg-amber-500"
                          : "bg-slate-300"
                      }`}
                  />
                  <span className="truncate">{b.name}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${isOpenNow
                        ? "bg-emerald-100 text-emerald-800"
                        : isOpenSoon
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-200 text-slate-600"
                      }`}
                  >
                    {isOpenNow ? "Open" : isOpenSoon ? "Opens Soon" : "Closed"}
                  </span>
                  <span className="font-semibold text-slate-600 text-[11px] whitespace-nowrap">{b.status.displayHours}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
