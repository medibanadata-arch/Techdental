import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { TopHeader } from "@/components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
import Seo from "@/Components/Seo";
import { PageProps } from '@inertiajs/core';
import {
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  Sparkles,
  X,
  MessageCircle,
  Loader2,
  AlertCircle
} from "lucide-react";

interface Props extends PageProps {
  locations?: any[];
  nav_menu?: any;
}

const TREATMENTS = [
  "Consultation 500 Tk.",
  "Cosmetic Filling",
  "Scaling & Polishing",
  "Root Canal",
  "Tooth Gap Treatment",
  "Root Canal Treatment",
  "Fiber Bridge",
  "Tooth Removal",
  "Dental Implant",
  "Orthodontic Treatment",
  "Tooth Shaping",
  "Flexible Denture",
  "Others",
];

const ALL_TIMES = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
];

const EVENING_TIMES = [
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
];

export default function BookAppointmentPublicIndex({ locations = [], nav_menu }: Props) {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [form, setForm] = useState({
    name: '',
    phone: '',
    treatment: '',
    branch: '',
    time: '10:00 AM',
    date: '',
    address: '',
  });
  const [fridayError, setFridayError] = useState(false);
  const [toast, setToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    name: string;
    phone: string;
    treatment: string;
    branch: string;
    time: string;
    date: string;
    address: string;
  } | null>(null);

  const branchOptions = locations.length
    ? locations
    : [
        { short_name: 'Mirpur', name: 'Mirpur', time: '10 AM – 9 PM' },
        { short_name: 'Uttara', name: 'Uttara', time: '3 PM – 9 PM' },
        { short_name: 'Badda', name: 'Badda', time: '3 PM – 9 PM' },
        { short_name: 'Jatrabari', name: 'Jatrabari', time: '3 PM – 9 PM' },
      ];

  const getBranchHours = (b: any) => {
    const rawTime = b.time || b.hours_text || '';
    if (rawTime) {
      let clean = rawTime.replace(/opening\s*time:\s*/i, '').trim();
      clean = clean.replace(/03\.00\s*PM\s*-\s*9\.00\s*PM/i, '3 PM – 9 PM');
      clean = clean.replace(/03:00\s*PM\s*[-–]\s*9:00\s*PM/i, '3 PM – 9 PM');
      clean = clean.replace(/10\s*AM\s*-\s*9\s*PM/i, '10 AM – 9 PM');
      clean = clean.replace(/10:00\s*AM\s*[-–]\s*9:00\s*PM/i, '10 AM – 9 PM');
      clean = clean.replace(/3\s*PM\s*-\s*9\s*PM/i, '3 PM – 9 PM');
      if (clean && !clean.toLowerCase().includes('morning:') && !clean.toLowerCase().includes('saturday')) {
        return clean;
      }
    }
    const nameLower = (b.short_name || b.name || '').toLowerCase();
    if (nameLower.includes('mirpur')) {
      return '10 AM – 9 PM';
    }
    return '3 PM – 9 PM';
  };

  const isEveningOnlyBranch = Boolean(form.branch && !form.branch.toLowerCase().includes('mirpur'));
  const currentAvailableTimes = isEveningOnlyBranch ? EVENING_TIMES : ALL_TIMES;

  const handleBranchChange = (branchVal: string) => {
    const isEvening = branchVal && !branchVal.toLowerCase().includes('mirpur');
    const validTimes = isEvening ? EVENING_TIMES : ALL_TIMES;
    let newTime = form.time;
    if (!validTimes.includes(form.time)) {
      newTime = validTimes[0];
    }
    setForm(prev => ({ ...prev, branch: branchVal, time: newTime }));
  };

  const handleDateChange = (val: string) => {
    setForm({ ...form, date: val });
    if (val) {
      const d = new Date(val);
      setFridayError(d.getDay() === 5);
    } else {
      setFridayError(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fridayError || isSubmitting) return;

    const branchName = form.branch || (branchOptions[0]?.short_name || branchOptions[0]?.name || 'Mirpur');
    const snapshot = {
      name: form.name,
      phone: form.phone,
      treatment: form.treatment,
      branch: branchName,
      time: form.time,
      date: form.date,
      address: form.address,
    };

    setIsSubmitting(true);

    router.post('/appointments', {
      name: form.name,
      patient_name: form.name,
      phone: form.phone,
      service: form.treatment,
      service_or_doctor: form.treatment,
      branch: branchName,
      date: form.date,
      preferred_date: form.date,
      preferred_time: form.time,
      address: form.address,
      notes: `Branch: ${branchName}; Time slot: ${form.time}; Address: ${form.address}`,
    }, {
      onSuccess: () => {
        setConfirmedBooking(snapshot);
        setIsConfirmed(true);
        setForm({ name: '', phone: '', treatment: '', branch: '', time: '10:00 AM', date: '', address: '' });
        setFridayError(false);
        setIsSubmitting(false);
        setToast(true);
        setTimeout(() => setToast(false), 4000);
      },
      onError: () => {
        setIsSubmitting(false);
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col w-full" style={{ backgroundColor: '#8a214d' }}>
      <Seo
        title="Book a Dental Appointment Online"
        description="Book your dental appointment at Tech Dental Care in Dhaka. Choose your branch, treatment, preferred date and time — confirmation within minutes."
        path="/appointment"
      />
      {/* Top Header Full Width */}
      <TopHeader locations={locations} selectedBranch={selectedBranch} onBranchChange={setSelectedBranch} navMenu={nav_menu} />

      {/* Centered Form Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 w-full">
        <div className="w-full max-w-2xl mx-auto bg-black/10 backdrop-blur-md p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl my-6">
          {/* Heading */}
          <h1 className="text-white text-3xl md:text-4xl font-extrabold text-center mb-8 drop-shadow-md tracking-tight">
            Book An Appointment
          </h1>

        {/* Form */}
        <form onSubmit={submit} className="space-y-5">
          {/* Row 1: Name and Phone */}
          <div className="flex flex-col sm:flex-row gap-5">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Patient Name"
              required
              className="w-full px-5 py-4 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400/30 transition-all duration-300 shadow-sm text-base"
            />
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone"
              required
              className="w-full px-5 py-4 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400/30 transition-all duration-300 shadow-sm text-base"
            />
          </div>

          {/* Row 2: Treatment */}
          <div>
            <select
              value={form.treatment}
              onChange={(e) => setForm({ ...form, treatment: e.target.value })}
              required
              className="w-full px-5 py-4 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-400/30 transition-all duration-300 shadow-sm text-base cursor-pointer"
            >
              <option value="" disabled>Treatment</option>
              {TREATMENTS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Row 3: Branch */}
          <div className="relative">
            <select
              value={form.branch}
              onChange={(e) => handleBranchChange(e.target.value)}
              required
              style={form.branch ? { color: 'transparent' } : undefined}
              className={`w-full px-5 py-4 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-400/30 transition-all duration-300 shadow-sm text-base cursor-pointer ${
                form.branch ? 'text-transparent' : 'text-gray-700'
              }`}
            >
              <option value="" disabled style={{ color: '#6b7280' }}>Branch</option>
              {branchOptions.map((b: any, i: number) => {
                const rawName = b.short_name || b.name || '';
                const cleanName = rawName.replace(/\s*branch\s*$/i, '').trim() + ' Branch';
                const hours = getBranchHours(b);
                return (
                  <option key={i} value={cleanName} style={{ color: '#1f2937' }}>
                    {cleanName} ({hours})
                  </option>
                );
              })}
            </select>

            {/* When a branch is selected, show clean branch name without opening hours */}
            {form.branch && (
              <div className="absolute inset-y-0 left-0 right-12 px-5 flex items-center pointer-events-none text-gray-700 text-base font-normal select-none truncate">
                {form.branch}
              </div>
            )}
          </div>

          {/* Row 4: Time and Date */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-full">
              <select
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
                className="w-full px-5 py-4 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-400/30 transition-all duration-300 shadow-sm text-base cursor-pointer"
              >
                {currentAvailableTimes.map((t) => (
                  <option key={t} value={t}>{t.replace(':00 ', '.00 ')}</option>
                ))}
              </select>
            </div>

            <div className="w-full flex flex-col">
              <input
                type={form.date ? 'date' : 'text'}
                value={form.date}
                onFocus={(e) => (e.currentTarget.type = 'date')}
                onBlur={(e) => { if (!e.currentTarget.value) e.currentTarget.type = 'text'; }}
                onChange={(e) => handleDateChange(e.target.value)}
                placeholder="Date"
                required
                className="w-full px-5 py-4 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400/30 transition-all duration-300 shadow-sm text-base cursor-pointer"
              />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 px-1 gap-2">
                {fridayError && (
                  <span className="text-white text-xs font-bold bg-red-500 px-3 py-1.5 rounded-lg shadow-lg animate-pulse">
                    ⚠️ Fridays are closed!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Row 5: Address */}
          <div>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Your Address (Ex: Mirpur 10, Gazipur)"
              required
              className="w-full px-5 py-4 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400/30 transition-all duration-300 shadow-sm text-base"
            />
          </div>

          {/* Row 6: Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={fridayError || isSubmitting}
              className="w-full sm:w-auto bg-[#006BB3] hover:bg-[#005590] text-white px-10 py-4 rounded-xl font-bold text-lg focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin text-white" />
                  <span>Processing Appointment...</span>
                </>
              ) : (
                <span>Book Now</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>

      {/* Confirmation Pop-Up Modal */}
      {isConfirmed && confirmedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsConfirmed(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-gray-100 transform transition-all duration-300 scale-100 text-center animate-in zoom-in-95">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsConfirmed(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Success icon badge */}
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
              <CheckCircle2 size={36} className="text-emerald-600" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              Appointment Request Received!
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-semibold">
              Thank you for choosing Tech Dental
            </p>

            {/* Message */}
            <p className="text-gray-600 text-sm mt-4 mb-6 leading-relaxed">
              Thank you, <strong className="text-gray-900 font-bold">{confirmedBooking.name}</strong>! We have received your booking request for our <strong className="text-[#800038] font-bold">{confirmedBooking.branch.replace(/\s*branch\s*$/i, '')} Branch</strong>. Our team will contact you shortly at <strong className="text-gray-900 font-bold">{confirmedBooking.phone}</strong> to confirm your doctor visit schedule.
            </p>

            {/* Action Button */}
            <div>
              <button
                type="button"
                onClick={() => setIsConfirmed(false)}
                className="w-full py-3.5 px-6 rounded-xl bg-[#800038] hover:bg-[#600028] text-white font-bold text-sm shadow-md transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      <div
        className={`fixed bottom-5 right-5 bg-emerald-800 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 transform transition-all duration-300 z-50 ${
          toast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        <i className="fa-solid fa-circle-check text-lg"></i>
        <div>
          <h4 className="font-bold text-xs">Appointment Requested!</h4>
          <p className="text-[11px] text-emerald-100">We will confirm your appointment shortly.</p>
        </div>
      </div>

      <GlobalFooter />
    </div>
  );
}
