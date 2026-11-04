

import React from "react";
import { X, CalendarDays, Clock, MapPin, CalendarCheck } from "lucide-react";
import { DoctorItem } from "@/data/dentalData";

interface DoctorProfileModalProps {
  doctor: DoctorItem | null;
  isOpen: boolean;
  onClose: () => void;
  onBookDoctor: (doctor: DoctorItem) => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  doctor,
  isOpen,
  onClose,
  onBookDoctor,
}) => {
  if (!isOpen || !doctor) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white w-full max-w-[400px] rounded-[20px] p-5 shadow-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-200 scale-100 border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-[0.95rem] font-black text-slate-900">Doctor Profile</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Doctor Header Grid */}
        <div className="flex items-center gap-3.5 mb-3.5">
          <img
            src={doctor.img}
            alt={doctor.name}
            className="w-[75px] h-[75px] rounded-full object-cover border-2 border-primary-maroon shrink-0 shadow-sm"
          />
          <div className="min-w-0">
            <h4 className="text-base font-extrabold text-slate-900 leading-tight truncate">
              {doctor.name}
            </h4>
            <div className="text-[0.78rem] font-bold text-primary-maroon mt-0.5">
              {doctor.spec}
            </div>
            <div className="text-[0.72rem] text-slate-500 mt-0.5 leading-snug">
              {doctor.degree}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap mt-1">
              <div className="inline-flex items-center gap-1 text-[0.72rem] text-accent-blue font-bold bg-blue-50 px-2 py-0.5 rounded-md">
                <MapPin className="w-3 h-3" />
                <span>{doctor.branchTitle || doctor.branch} Branch</span>
              </div>
              <div className="inline-flex items-center gap-1 text-[0.72rem] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>BMDC Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visiting Schedule Card */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 mb-3.5">
          <div className="text-[0.72rem] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 text-accent-blue" />
            <span>Visiting Hours</span>
          </div>
          <div className="text-[0.85rem] font-extrabold text-primary-maroon flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{doctor.time}</span>
          </div>
          <div className="text-[0.72rem] text-slate-500 mt-1 font-medium">
            Available: {doctor.days}
          </div>
        </div>

        {/* Experience & Bio */}
        <div className="mb-4">
          <h5 className="text-[0.78rem] font-bold text-slate-900 mb-1">
            Experience & Expertise
          </h5>
          <p className="text-[0.74rem] text-slate-600 leading-relaxed">
            {doctor.bio || "Specialized in advanced aesthetic restorations, painless procedures, and full-mouth rehabilitation with certified clinical excellence."}
          </p>
        </div>

        {/* Book Button */}
        <button
          type="button"
          onClick={() => onBookDoctor(doctor)}
          className="w-full bg-primary-maroon hover:bg-primary-hover text-white py-3 px-4 rounded-xl text-[0.92rem] font-bold flex items-center justify-center gap-2 shadow-md shadow-primary-maroon/25 transition-all duration-200 active:scale-98 cursor-pointer"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Book Appointment with Doctor</span>
        </button>
      </div>
    </div>
  );
};
