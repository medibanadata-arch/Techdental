import React, { useMemo, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";
import { TopHeader } from "@/components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
import Seo from "@/Components/Seo";
import { PageProps } from '@inertiajs/core';
import { getWebsiteTexts } from '@/data/websiteTexts';

interface DoctorItem {
  id: number;
  name: string;
  deg: string;
  spec: string;
  designation: string;
  img: string;
  branch: string;
  bmdc: string;
  visiting_time: string;
  experience_years: string;
}

interface DoctorSettingData {
  id?: number;
  page_title?: string;
  seo_title?: string;
  seo_content?: string;
  meta_desc?: string;
  canonical_url?: string;
  robots_index?: boolean;
  robots_follow?: boolean;
  schema_type?: string;
  schema_json?: string;
  faqs?: { q: string; a: string }[];
}

interface Props extends PageProps {
  data: DoctorItem[];
  settings?: DoctorSettingData;
  locations?: any[];
  nav_menu?: any;
}

const DetailBox: React.FC<{ icon: string; label: string; value: string; title?: string }> = ({ icon, label, value, title }) => (
  <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-0.5">
      <i className={`fa-solid ${icon} text-slate-400 mr-1`}></i>
      {label}
    </span>
    <span className="font-bold text-slate-800 block text-xs" title={title} style={!title ? undefined : undefined}>
      {value}
    </span>
  </div>
);

export default function DoctorsPublicIndex({ data = [], settings, locations = [], nav_menu }: Props) {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [filter, setFilter] = useState<'All' | string>('All');
  const page = usePage();
  const siteUrl = String((page.props as any)?.site_url || 'https://techdentalcare.com').replace(/\/+$/, '');
  const copy = getWebsiteTexts((page.props as any)?.site_settings?.website_texts);
  const [moreInfoOpen, setMoreInfoOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [apptDoctor, setApptDoctor] = useState<DoctorItem | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', date: '', time: '4:00 PM - 6:00 PM' });
  const [toast, setToast] = useState(false);

  const safeFaqs = useMemo(() => {
    if (!settings?.faqs) return [];
    if (Array.isArray(settings.faqs)) return settings.faqs;
    try {
      const parsed = typeof settings.faqs === 'string' ? JSON.parse(settings.faqs) : settings.faqs;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [settings?.faqs]);

  const locationsSet = useMemo(() => {
    const set = new Set<string>();
    data.forEach((d) => set.add(d.branch || d.branch_location || ''));
    return Array.from(set).filter(Boolean);
  }, [data]);

  const filtered = useMemo(
    () => (filter === 'All' ? data : data.filter((d) => (d.branch || d.branch_location || '').toLowerCase() === filter.toLowerCase())),
    [data, filter]
  );

  const submitAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptDoctor) return;
    router.post('/appointments', {
      name: form.name,
      phone: form.phone,
      service_or_doctor: apptDoctor.name,
      preferred_date: form.date,
      preferred_time: form.time,
      branch: apptDoctor.branch,
      notes: `Doctor appointment request from /doctors — Time slot: ${form.time}`,
    }, {
      onSuccess: () => {
        setApptDoctor(null);
        setForm({ name: '', phone: '', date: '', time: '4:00 PM - 6:00 PM' });
        setToast(true);
        setTimeout(() => setToast(false), 3000);
      },
    });
  };

  const filterBtn = (label: string) =>
    `px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${filter === label
      ? 'bg-pink-700 text-white'
      : 'bg-slate-100 text-slate-700 hover:bg-pink-50 hover:text-pink-700'
    }`;

  const doctorIndexSchemas: any[] = [];
  if (settings?.schema_json) {
    try {
      doctorIndexSchemas.push(JSON.parse(settings.schema_json));
    } catch {
      /* ignore invalid custom schema */
    }
  }
  if (safeFaqs.length > 0) {
    doctorIndexSchemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": safeFaqs.filter(f => f && f.q).map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": { "@type": "Answer", "text": faq.a || "" }
      }))
    });
  }

  return (
    <div
      className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased flex flex-col"
      style={{ fontFamily: "'Inter', 'SolaimanLipi', 'Hind Siliguri', sans-serif" }}
    >
      <Seo
        title={settings?.page_title || 'Specialist Dentists & Dental Surgeons'}
        description={settings?.meta_desc || 'Meet our certified dental surgeons and specialists across Mirpur, Uttara, Badda and Jatrabari in Dhaka.'}
        path="/doctors"
        robots={`${settings?.robots_index ?? true ? 'index' : 'noindex'}, ${settings?.robots_follow ?? true ? 'follow' : 'nofollow'}`}
        schema={doctorIndexSchemas}
      />

      <TopHeader locations={locations} selectedBranch={selectedBranch} onBranchChange={setSelectedBranch} navMenu={nav_menu} />

      <main className="flex-grow w-full px-3 sm:px-6 lg:px-8 pt-0 pb-6">
        {/* Compact Full-Width Title Section - Vertically Centered in the Gap */}
        <section className="text-center w-full py-5 sm:py-6">
          <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-pink-700 tracking-tight leading-snug w-full">
            {copy.doctors_h1}
          </h1>
        </section>

        {/* Location Filter Bar */}
        <section className="bg-white rounded-xl p-2.5 shadow-sm border border-slate-200 mb-6 w-full">
          <div className="flex flex-wrap gap-2 justify-start items-center">
            {['All', ...locationsSet].map((loc) => (
              <button key={loc} onClick={() => setFilter(loc)} className={filterBtn(loc)}>
                {loc}
              </button>
            ))}
          </div>
        </section>

        {/* Doctors Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
          {filtered.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl p-5 text-center flex flex-col justify-between shadow-sm border-2 border-[#a21caf] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div>
                {/* Doctor Image */}
                <div className="w-full h-56 sm:h-60 mb-4 rounded-lg overflow-hidden bg-slate-100 relative">
                  <img
                    src={doc.img}
                    alt={doc.name}
                    className="w-full h-full object-cover object-[center_20%]"
                    onError={(e: any) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/400x500/f1f5f9/64748b?text=Doctor+Photo'; }}
                  />
                  <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm text-pink-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                    <i className="fa-solid fa-location-dot text-pink-600 mr-1"></i>
                    {doc.branch || doc.branch_location}
                  </span>
                </div>

                {/* Doctor Name */}
                <h2 className="text-lg font-bold text-teal-600 mb-1 leading-snug">{doc.name}</h2>

                {/* Degree & Designation */}
                <p className="text-xs font-semibold text-slate-700 mb-0.5">{doc.deg}</p>
                <p className="text-xs text-slate-500 mb-3">{doc.designation}</p>

                {/* Key Details Box – unified 4-box grid (2x2) */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 mb-3">
                  <div className="grid grid-cols-2 gap-2 text-left">
                    <DetailBox icon="fa-hospital" label="Branch" value={doc.branch || doc.branch_location || ''} />
                    <DetailBox icon="fa-certificate" label="BMDC Reg." value={doc.bmdc} />
                    <DetailBox icon="fa-clock" label="Visiting" value={doc.visiting_time} title={doc.visiting_time} />
                    <DetailBox icon="fa-award" label="Experience" value={doc.experience_years} />
                  </div>
                </div>

                {/* Main Specialty */}
                <div className="text-xs text-slate-600 mb-4">
                  <span className="font-bold text-slate-800">Specialty:</span> {doc.spec}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-2 border-t border-slate-100">
                <Link
                  href={`/doctors/${doc.id}`}
                  className="w-1/2 py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded transition shadow-sm flex items-center justify-center gap-1"
                >
                  <i className="fa-solid fa-user-doctor text-[11px]"></i> View Profile
                </Link>
                <Link
                  href={`/appointment?doctor=${encodeURIComponent(doc.name)}`}
                  className="w-1/2 py-2 px-3 bg-pink-800 hover:bg-pink-900 text-white font-bold text-xs rounded transition shadow-sm flex items-center justify-center gap-1 text-center"
                >
                  <i className="fa-solid fa-calendar-check text-[11px]"></i> Appointment
                </Link>
              </div>
            </div>
          ))}
        </section>

        {/* More about Dentists Accordion (Controlled from Backend CMS) */}
        <section className="mt-6 mb-6 sm:mb-8 w-full">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setMoreInfoOpen(!moreInfoOpen)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-slate-800 hover:bg-slate-50/75 transition cursor-pointer"
              aria-expanded={moreInfoOpen}
            >
              <span className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                {settings?.seo_title || 'More about Dentists'}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${moreInfoOpen ? 'rotate-180' : ''}`} />
            </button>

            {moreInfoOpen && (
              <div className="border-t border-slate-100 p-4 sm:p-6 text-slate-700 bg-white space-y-6">
                <div
                  className="rich-content-view wp-editor-content prose prose-slate max-w-none text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: settings?.seo_content || `
                      <h3>About Dr. Aysha Siddika – Senior Dental Specialist in Mirpur, Dhaka</h3>
                      <p>Dr. Aysha Siddika is a Senior Dental Surgeon at Tech Dental Care (Mirpur Branch). With over 8+ years of dedicated clinical experience and more than 2,863+ successful patient treatments, she is widely recognized for her gentle, patient-first approach. She completed her Bachelor of Dental Surgery (BDS) from Shaheed Suhrawardy Medical College and Hospital, followed by advanced Post-Graduate Training (PGT) in Oral & Maxillofacial Surgery and Conservative Dentistry. Her BMDC Registration Number is 7897.</p>
                      <h3>Advanced Dental Procedures & Clinical Excellence</h3>
                      <p>Specializing in Aesthetic Dentistry and Painless Laser Root Canal Therapy (RCT), Dr. Aysha Siddika has completed 597+ single-visit root canals, cosmetic smile designing, porcelain veneers, and composite restorations. Utilizing modern rotary endodontic systems and digital apex locators, she ensures maximum tooth preservation and absolute comfort during dental interventions.</p>
                      <h3>Comprehensive Dental Care Network Across Dhaka</h3>
                      <p>Whether you require pediatric dental treatments, digital orthodontic aligners, painless wisdom tooth extractions, or permanent dental implants, our certified dental specialists across Mirpur, Uttara, Badda, and Jatrabari provide international-standard sterilization, digital OPG X-rays, and customized patient consultations.</p>
                    `
                  }}
                />

                {/* Frequently Asked Questions (FAQ) INSIDE More About Drawer */}
                {safeFaqs.length > 0 && (
                  <div className="pt-6 border-t border-slate-100">
                    <div className="mb-4">
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-pink-700 rounded-full" />
                        Frequently Asked Questions (FAQ)
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                        Common questions and answers regarding our specialist dental surgeons and care.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {safeFaqs.filter(f => f && f.q).map((faq, i) => {
                        const isOpen = openFaqIndex === i;
                        return (
                          <div
                            key={i}
                            className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 transition-colors"
                          >
                            <button
                              type="button"
                              onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                              className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left font-bold text-xs sm:text-sm text-slate-800 hover:bg-slate-100/70 transition cursor-pointer select-none"
                              aria-expanded={isOpen}
                            >
                              <span className="flex items-center gap-2.5 pr-3">
                                <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 text-[11px] font-extrabold flex items-center justify-center shrink-0">
                                  {i + 1}
                                </span>
                                <span className="text-slate-900 leading-snug">{faq.q}</span>
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-pink-700' : ''
                                  }`}
                              />
                            </button>
                            {isOpen && (
                              <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 bg-white border-t border-slate-100 leading-relaxed animate-in fade-in duration-150">
                                {faq.a}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* No Results */}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <i className="fa-solid fa-user-doctor text-4xl text-slate-300 mb-2"></i>
            <h3 className="text-base font-bold text-slate-600">No dentists found in this location</h3>
            <p className="text-slate-400 text-xs">Try selecting a different area tab above.</p>
          </div>
        )}
      </main>

      {/* Appointment Booking Modal */}
      {apptDoctor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setApptDoctor(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center transition"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark text-base"></i>
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold text-sm">
                <i className="fa-solid fa-calendar-plus"></i>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Book Appointment</h3>
                <p className="text-xs text-pink-700 font-medium">{apptDoctor.name}</p>
              </div>
            </div>

            <form onSubmit={submitAppointment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Tanvir Hasan"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Time Slot</label>
                  <select
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none"
                  >
                    <option>4:00 PM - 6:00 PM</option>
                    <option>6:00 PM - 8:00 PM</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={router as any && undefined}
                className="w-full py-2.5 bg-pink-700 hover:bg-pink-800 disabled:opacity-60 text-white font-bold text-xs rounded-lg shadow transition flex justify-center items-center gap-2 mt-2"
              >
                <i className="fa-solid fa-paper-plane text-xs"></i> Confirm Appointment Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      <div
        className={`fixed bottom-5 right-5 bg-emerald-800 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 transform transition-all duration-300 z-50 ${toast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
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
