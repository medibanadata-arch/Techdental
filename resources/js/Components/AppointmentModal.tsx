

import React, { useState, useEffect } from "react";
import { X, CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";
import { HOTLINE_DISPLAY } from "@/utils/contact";

interface AppointmentModalProps {
  locations: any[];
  isOpen: boolean;
  onClose: () => void;
  defaultBranch?: string;
  defaultService?: string;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  locations,
  isOpen,
  onClose,
  defaultBranch = "mirpur",
  defaultService = "",
}) => {
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState("");
  const [serviceOrDoctor, setServiceOrDoctor] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const TIME_SLOTS = [
    "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM",
    "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM",
  ];

  // Sync defaults
  useEffect(() => {
    const matchedLoc = locations.find(l => l.location_id === defaultBranch);
    if (matchedLoc) {
      setBranch(matchedLoc.name);
    } else if (locations.length > 0) {
      setBranch(locations[0].name);
    }

    if (defaultService) {
      setServiceOrDoctor(defaultService);
    }

    // Default preferred date to tomorrow or today
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setPreferredDate(tomorrow.toISOString().split("T")[0]);
    setSuccessMessage(null);
    setErrorMessage(null);
    setFieldErrors({});
  }, [isOpen, defaultBranch, defaultService, locations]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!patientName.trim()) errors.patientName = "রোগীর নাম লিখুন।";
    if (!phone.trim()) errors.phone = "মোবাইল নম্বর লিখুন।";
    if (!branch.trim()) errors.branch = "শাখা নির্বাচন করুন।";
    if (!serviceOrDoctor.trim()) errors.serviceOrDoctor = "ডাক্তার / ট্রিটমেন্ট লিখুন।";
    if (!preferredDate.trim()) errors.preferredDate = "তারিখ নির্বাচন করুন।";
    if (!preferredTime.trim()) errors.preferredTime = "সময় নির্বাচন করুন।";
    if (!address.trim()) errors.address = "ঠিকানা লিখুন।";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage("সব ঘর পূরণ করুন — কোনো ঘর খালি রাখা যাবে না।");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save directly into the Laravel appointments table (visible in Admin → Appointments)
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      const res = await fetch('/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          patient_name: patientName,
          phone,
          branch,
          service_or_doctor: serviceOrDoctor,
          preferred_date: preferredDate,
          preferred_time: preferredTime,
          address,
        }),
      });

      if (res.status === 422) {
        const data = await res.json().catch(() => null);
        const serverErrors: Record<string, string> = {};
        const map: Record<string, string> = {
          patient_name: "patientName", name: "patientName", phone: "phone",
          branch: "branch", service_or_doctor: "serviceOrDoctor", service: "serviceOrDoctor",
          preferred_date: "preferredDate", date: "preferredDate",
          preferred_time: "preferredTime", address: "address",
        };
        Object.entries(data?.errors || {}).forEach(([key, msgs]: [string, any]) => {
          const target = map[key] || key;
          serverErrors[target] = Array.isArray(msgs) ? msgs[0] : String(msgs);
        });
        setFieldErrors(serverErrors);
        setErrorMessage("সব ঘর পূরণ করুন — কোনো ঘর খালি রাখা যাবে না।");
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      setSuccessMessage(
        `ধন্যবাদ ${patientName} সাহেব! আপনার অ্যাপয়েন্টমেন্ট (${branch}, ${preferredDate} ${preferredTime}) সফলভাবে গ্রহণ করা হয়েছে। আমাদের প্রতিনিধি শীঘ্রই ${phone} নম্বরে কল করে সময় নিশ্চিত করবেন।`
      );
    } catch (err) {
      setErrorMessage(
        `দুঃখিত, রিকোয়েস্টটি পাঠানো যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন অথবা সরাসরি কল করুন: ${HOTLINE_DISPLAY}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDone = () => {
    setSuccessMessage(null);
    setPatientName("");
    setPhone("");
    setServiceOrDoctor("");
    setPreferredTime("");
    setAddress("");
    setFieldErrors({});
    onClose();
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
          <h3 className="text-[0.95rem] font-black text-slate-900">
            {successMessage ? "Booking Confirmation" : "Book an Appointment"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {successMessage ? (
          <div className="py-3 text-center animate-fade-in">
            <div className="w-12 h-12 bg-emerald-50 text-success-green rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-[0.84rem] text-slate-700 leading-relaxed font-semibold mb-4 px-1">
              {successMessage}
            </p>
            <button
              type="button"
              onClick={handleDone}
              className="w-full bg-primary-maroon hover:bg-primary-hover text-white py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer"
            >
              ঠিক আছে (Close)
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Full Name */}
            <div>
              <label className="block text-[0.75rem] font-bold text-slate-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter your full name"
                required
                className={`w-full px-3 py-2 border-[1.5px] rounded-xl text-[0.82rem] outline-none bg-white transition-colors ${fieldErrors.patientName ? "border-red-400" : "border-slate-200 focus:border-primary-maroon"}`}
              />
              {fieldErrors.patientName && <p className="text-[0.7rem] text-red-600 mt-1 font-semibold">{fieldErrors.patientName}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[0.75rem] font-bold text-slate-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                required
                className={`w-full px-3 py-2 border-[1.5px] rounded-xl text-[0.82rem] outline-none bg-white transition-colors ${fieldErrors.phone ? "border-red-400" : "border-slate-200 focus:border-primary-maroon"}`}
              />
              {fieldErrors.phone && <p className="text-[0.7rem] text-red-600 mt-1 font-semibold">{fieldErrors.phone}</p>}
            </div>

            {/* Select Branch */}
            <div>
              <label className="block text-[0.75rem] font-bold text-slate-700 mb-1">
                Select Branch <span className="text-red-500">*</span>
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                required
                className={`w-full px-3 py-2 border-[1.5px] rounded-xl text-[0.82rem] outline-none bg-white transition-colors cursor-pointer ${fieldErrors.branch ? "border-red-400" : "border-slate-200 focus:border-primary-maroon"}`}
              >
                <option value="">Select a branch</option>
                {locations.map((loc) => (
                  <option key={loc.location_id} value={loc.name}>{loc.name}</option>
                ))}
              </select>
              {fieldErrors.branch && <p className="text-[0.7rem] text-red-600 mt-1 font-semibold">{fieldErrors.branch}</p>}
            </div>

            {/* Doctor / Service */}
            <div>
              <label className="block text-[0.75rem] font-bold text-slate-700 mb-1">
                Selected Doctor / Service <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={serviceOrDoctor}
                onChange={(e) => setServiceOrDoctor(e.target.value)}
                placeholder="Consultation, RCT, Braces, etc."
                required
                className={`w-full px-3 py-2 border-[1.5px] rounded-xl text-[0.82rem] outline-none bg-white transition-colors ${fieldErrors.serviceOrDoctor ? "border-red-400" : "border-slate-200 focus:border-primary-maroon"}`}
              />
              {fieldErrors.serviceOrDoctor && <p className="text-[0.7rem] text-red-600 mt-1 font-semibold">{fieldErrors.serviceOrDoctor}</p>}
            </div>

            {/* Preferred Date */}
            <div>
              <label className="block text-[0.75rem] font-bold text-slate-700 mb-1">
                Preferred Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                required
                className={`w-full px-3 py-2 border-[1.5px] rounded-xl text-[0.82rem] outline-none bg-white transition-colors cursor-pointer ${fieldErrors.preferredDate ? "border-red-400" : "border-slate-200 focus:border-primary-maroon"}`}
              />
              {fieldErrors.preferredDate && <p className="text-[0.7rem] text-red-600 mt-1 font-semibold">{fieldErrors.preferredDate}</p>}
            </div>

            {/* Preferred Time */}
            <div>
              <label className="block text-[0.75rem] font-bold text-slate-700 mb-1">
                Preferred Time <span className="text-red-500">*</span>
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                required
                className={`w-full px-3 py-2 border-[1.5px] rounded-xl text-[0.82rem] outline-none bg-white transition-colors cursor-pointer ${fieldErrors.preferredTime ? "border-red-400" : "border-slate-200 focus:border-primary-maroon"}`}
              >
                <option value="">Select a time</option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {fieldErrors.preferredTime && <p className="text-[0.7rem] text-red-600 mt-1 font-semibold">{fieldErrors.preferredTime}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-[0.75rem] font-bold text-slate-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Your full address"
                required
                rows={2}
                className={`w-full px-3 py-2 border-[1.5px] rounded-xl text-[0.82rem] outline-none bg-white transition-colors resize-none ${fieldErrors.address ? "border-red-400" : "border-slate-200 focus:border-primary-maroon"}`}
              />
              {fieldErrors.address && <p className="text-[0.7rem] text-red-600 mt-1 font-semibold">{fieldErrors.address}</p>}
            </div>

            {errorMessage && (
              <p role="alert" className="text-[0.78rem] font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                {errorMessage}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 bg-primary-maroon hover:bg-primary-hover disabled:opacity-60 text-white py-3 rounded-xl text-[0.92rem] font-bold flex items-center justify-center gap-2 shadow-md shadow-primary-maroon/25 transition-all duration-150 active:scale-98 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CalendarCheck className="w-4 h-4" />
                  <span>Confirm Booking Request</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
