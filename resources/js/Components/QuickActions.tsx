import React from "react";
import { Link } from "@inertiajs/react";
import { BranchInfo } from "@/data/dentalData";
import { HOTLINE, WHATSAPP, buildWhatsAppUrl } from "@/utils/contact";

interface QuickActionsProps {
  currentBranch: BranchInfo;
  onOpenDirections: () => void;
  onOpenBooking: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  currentBranch,
  onOpenDirections,
  onOpenBooking,
}) => {
  const callLabel = currentBranch.callLabel || 'Call';
  const directionsLabel = currentBranch.directionsLabel || 'Directions';
  const whatsappLabel = currentBranch.whatsappLabel || 'WhatsApp';
  const bookLabel = currentBranch.bookLabel || 'Book';
  const bookingUrl = currentBranch.bookingUrl || '/appointment';

  const rawBranchName = currentBranch.shortName || currentBranch.name || 'Mirpur';
  const branchShort = rawBranchName.replace(/branch/gi, '').trim();

  const rawPhone = currentBranch.phone || HOTLINE;
  const rawWa = currentBranch.whatsapp || WHATSAPP;
  const waUrl = buildWhatsAppUrl(
    rawWa,
    "Hello Tech Dental, I would like to know more about your services."
  );

  const isDirectMap = Boolean(currentBranch.mapUrl && currentBranch.mapUrl !== '#' && currentBranch.mapUrl.startsWith('http'));

  return (
    <nav
      className="w-full grid grid-cols-4 gap-2 sm:gap-4 text-center py-2 select-none"
      aria-label={`Quick actions for ${branchShort} branch`}
    >
      {/* 1. Call */}
      <a
        href={`tel:${rawPhone}`}
        className="flex flex-col items-center group cursor-pointer transition-transform duration-180 active:scale-95 no-underline"
        aria-label={`${callLabel} ${branchShort}`}
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-slate-200/90 flex items-center justify-center text-blue-600 shadow-2xs group-hover:bg-slate-50 group-hover:border-slate-300 group-hover:shadow-xs transition-all">
          <svg className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>
          </svg>
        </div>
        <span className="text-[13px] sm:text-sm font-bold text-slate-800 tracking-tight mt-1.5 transition-colors">
          {callLabel}
        </span>
      </a>

      {/* 2. Directions */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onOpenDirections();
        }}
        className="flex flex-col items-center group cursor-pointer transition-transform duration-180 active:scale-95 no-underline bg-transparent border-0 p-0"
        aria-label={`${directionsLabel} - Choose Branch`}
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-slate-200/90 flex items-center justify-center text-blue-600 shadow-2xs group-hover:bg-slate-50 group-hover:border-slate-300 group-hover:shadow-xs transition-all">
          <svg className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 2 11 13"/>
            <path d="M22 2 15 22l-4-9-9-4z"/>
          </svg>
        </div>
        <span className="text-[13px] sm:text-sm font-bold text-slate-800 tracking-tight mt-1.5 transition-colors">
          {directionsLabel}
        </span>
      </button>

      {/* 3. WhatsApp */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center group cursor-pointer transition-transform duration-180 active:scale-95 no-underline"
        aria-label={`${whatsappLabel} Tech Dental`}
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-slate-200/90 flex items-center justify-center shadow-2xs group-hover:bg-emerald-50/50 group-hover:border-emerald-300 group-hover:shadow-xs transition-all">
          <svg className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 448 512" fill="#25D366" style={{ color: '#25D366', fill: '#25D366' }} aria-hidden="true">
            <path fill="#25D366" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
        </div>
        <span className="text-[13px] sm:text-sm font-bold text-slate-800 tracking-tight mt-1.5 transition-colors">
          {whatsappLabel}
        </span>
      </a>

      {/* 4. Book */}
      <Link
        href={bookingUrl}
        onClick={(e) => {
          if (bookingUrl === '#book' || bookingUrl === '/appointment' || !bookingUrl) {
            e.preventDefault();
            onOpenBooking();
          }
        }}
        className="flex flex-col items-center group cursor-pointer transition-transform duration-180 active:scale-95 no-underline"
        aria-label={`${bookLabel} Appointment`}
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-slate-200/90 flex items-center justify-center text-[#8B1038] shadow-2xs group-hover:bg-slate-50 group-hover:border-slate-300 group-hover:shadow-xs transition-all">
          <svg className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="3"/>
            <path d="M16 2v4M8 2v4M3 10h18"/>
            <path d="m9 16 2 2 4-4"/>
          </svg>
        </div>
        <span className="text-[13px] sm:text-sm font-bold text-slate-800 tracking-tight mt-1.5 transition-colors">
          {bookLabel}
        </span>
      </Link>
    </nav>
  );
};
