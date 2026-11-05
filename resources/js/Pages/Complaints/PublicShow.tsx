import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { TopHeader } from '@/components/TopHeader';
import { GlobalFooter } from '@/Components/GlobalFooter';
import {
  User,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  Tag,
  MapPin,
  Send,
  Lock,
  Clock,
  CheckCircle2,
  X,
  ClipboardList
} from 'lucide-react';

interface Props {
  locations?: any[];
  nav_menu?: any;
}

export default function ComplaintPublicShow({ locations = [], nav_menu }: Props) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const { data, setData, post, processing, errors, reset } = useForm({
    fullName: '',
    email: '',
    phone: '',
    visitDate: today,
    branch: '',
    category: '',
    details: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('complaints.store'), {
      preserveScroll: true,
      onSuccess: () => {
        setShowSuccessModal(true);
        reset();
      },
    });
  };

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="bg-slate-50 flex flex-col min-h-screen text-slate-800 font-sans">
      <Head>
        <title>Patient Feedback & Complaint Box | Tech Dental Care</title>
        <meta
          name="description"
          content="Submit confidential patient complaints, feedback, and suggestions directly to Tech Dental Care management."
        />
      </Head>

      {/* Top Header without branch selector */}
      <TopHeader
        locations={locations}
        nav_menu={nav_menu}
        showBranchPicker={false}
      />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-teal-700 to-blue-800 pb-32 pt-16 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wide uppercase bg-teal-600/30 text-teal-100 rounded-full border border-teal-400/20">
              Confidential Patient Voice
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Patient Feedback & Resolution Center
            </h1>
            <p className="text-teal-100 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-light">
              Your experience matters to us. Whether you have a concern, a complaint, or a suggestion to improve our dental care services, please let us know.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 mb-20 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-6 sm:p-10">
              
              <div className="flex items-center mb-8 pb-4 border-b border-slate-100">
                <div className="bg-teal-50 text-teal-600 p-3 rounded-full mr-4 flex-shrink-0">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Submit a Report</h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    All submissions are kept strictly confidential and reviewed directly by our management team.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Personal Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User size={16} />
                      </div>
                      <input
                        type="text"
                        id="fullName"
                        required
                        placeholder="John Doe"
                        value={data.fullName}
                        onChange={(e) => setData('fullName', e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm shadow-xs outline-none"
                      />
                    </div>
                    {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail size={16} />
                      </div>
                      <input
                        type="email"
                        id="email"
                        required
                        placeholder="john@example.com"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm shadow-xs outline-none"
                      />
                    </div>
                    {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone size={16} />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        required
                        placeholder="+880 1XXX-XXXXXX"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm shadow-xs outline-none"
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
                  </div>

                  {/* Date of Visit */}
                  <div>
                    <label htmlFor="visitDate" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Date of Visit <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <CalendarIcon size={16} />
                      </div>
                      <input
                        type="date"
                        id="visitDate"
                        required
                        max={today}
                        value={data.visitDate}
                        onChange={(e) => setData('visitDate', e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm shadow-xs outline-none text-slate-700"
                      />
                    </div>
                    {errors.visitDate && <p className="text-xs text-rose-500 mt-1">{errors.visitDate}</p>}
                  </div>
                </div>

                {/* Branch Selection & Subject / Category Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Branch */}
                  <div>
                    <label htmlFor="branch" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Branch Visited (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <MapPin size={16} />
                      </div>
                      <select
                        id="branch"
                        value={data.branch}
                        onChange={(e) => setData('branch', e.target.value)}
                        className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm shadow-xs outline-none appearance-none bg-white text-slate-700"
                      >
                        <option value="">Select branch (if applicable)</option>
                        <option value="Mirpur Branch">Mirpur Branch (Shewrapara)</option>
                        <option value="Uttara Branch">Uttara Branch (Sector 7)</option>
                        <option value="Badda Branch">Badda Branch (Pragati Sarani)</option>
                        <option value="Jatrabari Branch">Jatrabari Branch (Shahid Faruk Road)</option>
                        <option value="General / Not Branch Specific">General / Not Branch Specific</option>
                      </select>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Subject / Category <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Tag size={16} />
                      </div>
                      <select
                        id="category"
                        required
                        value={data.category}
                        onChange={(e) => setData('category', e.target.value)}
                        className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm shadow-xs outline-none appearance-none bg-white text-slate-700"
                      >
                        <option value="" disabled>Select the nature of your complaint</option>
                        <option value="Doctor Behavior/Treatment">Doctor Behavior / Treatment Issue</option>
                        <option value="Staff Behavior">Support Staff Behavior</option>
                        <option value="Cleanliness">Hygiene & Cleanliness</option>
                        <option value="Billing">Billing & Pricing Issues</option>
                        <option value="Wait Time">Excessive Wait Time</option>
                        <option value="Suggestion">Constructive Suggestion / Feedback</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {errors.category && <p className="text-xs text-rose-500 mt-1">{errors.category}</p>}
                  </div>
                </div>

                {/* Detailed Complaint */}
                <div>
                  <label htmlFor="details" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Detailed Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="details"
                    rows={5}
                    required
                    placeholder="Please provide specific details about your experience..."
                    value={data.details}
                    onChange={(e) => setData('details', e.target.value)}
                    className="block w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm shadow-xs outline-none resize-y"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">
                    Please include approximate time, names of staff or doctor if applicable.
                  </p>
                  {errors.details && <p className="text-xs text-rose-500 mt-1">{errors.details}</p>}
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex justify-center items-center px-8 py-3 border border-transparent text-sm sm:text-base font-semibold rounded-xl shadow-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-200 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {processing ? 'Submitting...' : 'Submit Complaint'}
                  </button>
                </div>
              </form>

            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center">
              <Lock className="w-4 h-4 text-teal-600 mr-2" />
              Secure & Confidential
            </div>
            <div className="hidden sm:block text-slate-300">|</div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-teal-600 mr-2" />
              24-48 Hour Response Time
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal Overlay */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md animate-in fade-in zoom-in-95">
            <div className="bg-white px-6 pb-4 pt-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 sm:mx-0 sm:h-12 sm:w-12 text-teal-600">
                  <CheckCircle2 size={28} />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-xl font-bold text-slate-900">
                    Report Submitted
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Thank you for your feedback. Your complaint has been securely submitted to our management team. We will review your concerns and contact you within 24-48 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 px-6 py-3.5 sm:flex sm:flex-row-reverse border-t border-slate-100">
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex w-full justify-center rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 sm:ml-3 sm:w-auto transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Footer */}
      <GlobalFooter />
    </div>
  );
}

