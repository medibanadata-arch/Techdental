import React, { useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";
import { TopHeader } from "@/components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
import { PageProps } from '@inertiajs/core';

interface Milestone {
  count: string;
  label: string;
  color: string;
}

interface DoctorItem {
  id: number;
  name: string;
  deg: string;
  spec: string;
  designation: string;
  specialty_banner: string;
  img: string;
  branch: string;
  bmdc: string;
  visiting_time: string;
  experience_years: string;
  patients_treated: string;
  verified: boolean;
  chamber_title: string;
  chamber_address: string;
  milestones: Milestone[];
  bio: string;
  seo_title: string;
  seo_content: string;
  meta_desc?: string;
  canonical_url?: string;
  robots_index?: boolean;
  robots_follow?: boolean;
  schema_type?: string;
  schema_json?: string;
  faqs?: { q: string; a: string }[];
}

interface Props extends PageProps {
  item: DoctorItem;
  hotline: string;
  locations?: any[];
  nav_menu?: any;
}

const MILESTONE_STYLE: Record<string, { box: string; hover: string; icon: string }> = {
  pink: { box: 'bg-pink-50 text-[#c81e62]', hover: 'hover:border-pink-200', icon: 'fas fa-tooth' },
  emerald: { box: 'bg-emerald-50 text-[#059669]', hover: 'hover:border-emerald-200', icon: 'fas fa-syringe' },
  sky: { box: 'bg-sky-50 text-sky-600', hover: 'hover:border-sky-200', icon: 'fas fa-shield-alt' },
  amber: { box: 'bg-amber-50 text-amber-600', hover: 'hover:border-amber-200', icon: 'fas fa-magic' },
  purple: { box: 'bg-purple-50 text-purple-600', hover: 'hover:border-purple-200', icon: 'fas fa-user-md' },
  teal: { box: 'bg-teal-50 text-teal-600', hover: 'hover:border-teal-200', icon: 'fas fa-crown' },
};

const DEFAULT_MILESTONES: Milestone[] = [
  { count: '597+', label: 'Veneers & Laminates', color: 'pink' },
  { count: '863+', label: 'Complex Root Canals', color: 'emerald' },
  { count: '1,380+', label: 'Ultrasonic Scaling', color: 'sky' },
  { count: '539+', label: 'Cosmetic Fillings', color: 'amber' },
  { count: '150+', label: 'Surgical Extractions', color: 'purple' },
  { count: '85+', label: 'Fiber & Cap Bridges', color: 'teal' },
];

/** milestones may arrive as a JSON string from the DB text column */
const parseMilestones = (raw: any): Milestone[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return []; }
};

/** Split the degree string into bold first line + supporting lines */
const splitDegree = (deg: string): string[] => {
  if (!deg) return [];
  return deg.split(/,\s*(?=(?:PGT|FCPS|Dip\.|MS|MCPS|MMEd|FFD)\b)/).map((s) => s.trim()).filter(Boolean);
};

/** Turn the SEO text blob (segments separated by " — ") into Q&A pairs */
const parseFaqs = (content: string): { q: string; a: string }[] => {
  if (!content) return [];
  return content
    .split(/\s+—\s+/)
    .map((seg) => seg.trim())
    .filter(Boolean)
    .map((seg) => {
      const qEnd = seg.indexOf('?');
      if (qEnd > -1) {
        return { q: seg.slice(0, qEnd + 1).trim(), a: seg.slice(qEnd + 1).trim() };
      }
      return { q: seg, a: '' };
    });
};

/** "Why patients choose her: A (...), B (...), and a C (...)." → list items */
const parseWhyList = (text: string) => {
  const colonIdx = text.indexOf(':');
  const intro = colonIdx > -1 ? text.slice(0, colonIdx + 1) : '';
  const rest = colonIdx > -1 ? text.slice(colonIdx + 1).replace(/\.\s*$/, '') : text;
  const items: { label: string; text: string }[] = [];
  const re = /([A-Z][^(),]+?)\s*\(([^)]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(rest))) {
    items.push({ label: m[1].replace(/^and a\s+/i, '').trim(), text: m[2].trim() });
  }
  return { intro, items };
};

export default function DoctorsPublicSingle({ item, hotline, locations = [], nav_menu }: Props) {
  const [selectedBranch, setSelectedBranch] = useState("mirpur");
  const [seeMore, setSeeMore] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const milestones = useMemo(() => {
    if (item?.milestones !== undefined && item?.milestones !== null) {
      return parseMilestones(item.milestones);
    }
    return DEFAULT_MILESTONES;
  }, [item?.milestones]);

  const degreeLines = useMemo(() => splitDegree(item?.deg), [item?.deg]);

  const specs = useMemo(() => {
    const list = (item?.spec || '').split(',').map((s) => s.trim()).filter(Boolean);
    return list.length > 0 ? list : ['Aesthetic Dentistry', 'Root Canal (RCT)', 'Crown & Bridge', 'Dental Fillings', 'Ultrasonic Scaling', 'Teeth Whitening'];
  }, [item?.spec]);

  const visibleSpecs = specs.slice(0, 5);
  const hiddenSpecs = specs.slice(5);

  const bioParas = useMemo(() => {
    const list = (item?.bio || '').split(/\n\n+/).filter(Boolean);
    if (list.length > 0) return list;
    return [
      `${item?.name} is a senior dental surgeon at ${item?.chamber_title || `Tech Dental (${item?.branch || 'Mirpur'} Branch)`}. With over ${item?.experience_years || '5+ Years'} of clinical experience and more than ${item?.patients_treated || '2,000+'} successful patient treatments, ${item?.name} is widely recognized for a gentle, patient-first approach. BMDC Registration Number: ${item?.bmdc || 'Verified'}.`,
      `Specializing in ${item?.spec || 'Comprehensive Dental Care & Endodontics'}, ${item?.name} performs modern restorative and aesthetic dental procedures utilizing digital sterilization protocols and clinical technology for accurate outcomes.`,
      `Why Patients choose ${item?.name}: Convenient Location (${item?.chamber_address || `Tech Dental ${item?.branch || 'Mirpur'} Branch`}), Painless & Conservative Care (focused on preserving natural tooth structure with minimal discomfort), and a Flexible Schedule (consultations available ${item?.visiting_time || 'daily in the evening'}).`
    ];
  }, [item]);

  const faqs = useMemo(() => {
    if (Array.isArray(item?.faqs) && item.faqs.length > 0) return item.faqs;
    try {
      if (typeof item?.faqs === 'string') {
        const parsed = JSON.parse(item.faqs);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { }
    const list = parseFaqs(item?.seo_content || '');
    if (list.length > 0) return list;
    return [
      { q: `How can I book an appointment with ${item?.name}?`, a: `You can book an appointment directly by calling the Tech Dental hotline at ${hotline} or visiting the ${item?.branch || 'Mirpur'} branch during consulting hours (${item?.visiting_time || '4.00 PM – 9.00 PM'}).` },
      { q: `What is ${item?.name}'s BMDC registration number?`, a: `${item?.name} is a verified dental surgeon registered with the Bangladesh Medical & Dental Council under BMDC Reg. No. ${item?.bmdc || 'Verified'}.` }
    ];
  }, [item?.faqs, item?.seo_content, item?.name, item?.branch, item?.visiting_time, item?.bmdc, hotline]);

  const whyBlock = bioParas.length > 2 ? parseWhyList(bioParas[2]) : { intro: '', items: [] };

  if (!item) return null;

  return (
    <div
      className="min-h-screen bg-white text-slate-600 antialiased flex flex-col justify-start"
      style={{ fontFamily: "'Inter', 'Hind Siliguri', sans-serif" }}
    >
      <Head>
        <title>{item.seo_title ? `${item.name} – ${item.seo_title}` : `${item.name} - Senior Dental Specialist Profile | Tech Dental`}</title>
        {item.meta_desc && <meta name="description" content={item.meta_desc} />}
        <link rel="canonical" href={item.canonical_url || `https://techdentalcare.com/doctors/${item.id}`} />
        <meta
          name="robots"
          content={`${item.robots_index !== false ? 'index' : 'noindex'}, ${item.robots_follow !== false ? 'follow' : 'nofollow'
            }`}
        />
        {item.schema_json ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: item.schema_json }} />
        ) : (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": item.schema_type || "Physician",
                "name": item.name,
                "description": item.meta_desc || item.bio,
                "medicalSpecialty": item.spec || "Dentistry",
                "telephone": item.hotline || hotline,
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": item.chamber_address,
                  "addressLocality": "Dhaka",
                  "addressCountry": "BD"
                }
              })
            }}
          />
        )}
        {faqs.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faqs.filter(f => f && f.q).map(faq => ({
                  "@type": "Question",
                  "name": faq.q,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a || ""
                  }
                }))
              })
            }}
          />
        )}
      </Head>

      <TopHeader locations={locations} selectedBranch={selectedBranch} onBranchChange={setSelectedBranch} navMenu={nav_menu} />

      <main className="w-full px-4 sm:px-8 lg:px-12 flex-grow py-4 sm:py-6">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start mb-6">
          {/* Profile Picture with Verified Badge */}
          <div className="w-full md:w-72 flex-shrink-0 relative">
            <div className="w-full aspect-[4/3] md:aspect-[3/4] rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative">
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover object-top"
                onError={(e: any) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://placehold.co/400x533/f1f5f9/64748b?text=${encodeURIComponent(item.name)}`; }}
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white border border-slate-200/85 shadow-sm px-3.5 py-1 rounded-full flex items-center gap-1.5 whitespace-nowrap">
              <i className="fas fa-check-circle text-emerald-500 text-xs"></i>
              <span className="text-[11px] font-semibold text-slate-700">BMDC Verified</span>
            </div>
          </div>

          {/* Doctor Overview */}
          <div className="flex-grow text-center md:text-left w-full">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1 mt-1">{item.name}</h1>

            <div className="mb-3">
              <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[11px] sm:text-xs font-bold rounded-md">
                {item.designation}
              </span>
            </div>

            <div className="space-y-0.5 mb-2">
              {(degreeLines.length ? degreeLines : ['']).map((line, i) => (
                <p key={i} className={i === 0 ? 'text-xs sm:text-sm font-bold text-slate-800' : 'text-xs font-medium text-slate-600'}>
                  {line}
                </p>
              ))}
              {item.specialty_banner && (
                <p className="text-xs font-bold text-[#c81e62] uppercase tracking-wide">{item.specialty_banner}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-5">
              {item.visiting_time && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-[#059669] text-[11px] sm:text-xs font-semibold rounded-md border border-emerald-200/60">
                  <i className="far fa-clock text-xs"></i> {item.visiting_time}
                </span>
              )}
            </div>

            {/* 2 Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full mb-5">
              <Link
                href={`/appointment?doctor=${encodeURIComponent(item.name)}`}
                className="w-full sm:w-auto flex-1 sm:flex-initial py-3 px-6 bg-[#c81e62] hover:bg-[#a8184f] active:scale-[0.99] text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-sm cursor-pointer"
              >
                <i className="far fa-calendar-check text-base"></i>
                <span>Book Now</span>
              </Link>
              <a
                href={`tel:${item.hotline || hotline}`}
                className="w-full sm:w-auto flex-1 sm:flex-initial py-3 px-6 bg-[#059669] hover:bg-[#047857] active:scale-[0.99] text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-sm"
              >
                <i className="fas fa-phone-alt text-sm fa-flip-horizontal"></i>
                <span>Call Now</span>
              </a>
            </div>

            {/* 3 Clean Stat Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50/90 border border-slate-100 rounded-xl px-3.5 py-3 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 block">Experience</span>
                <span className="block text-base sm:text-lg font-extrabold text-slate-800">{item.experience_years}</span>
              </div>
              <div className="bg-slate-50/90 border border-slate-100 rounded-xl px-3.5 py-3 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 block">Patients Treated</span>
                <span className="block text-base sm:text-lg font-extrabold text-slate-800">{item.patients_treated}</span>
              </div>
              <div className="bg-slate-50/90 border border-slate-100 rounded-xl px-3.5 py-3 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 block">BMDC Reg. No</span>
                <span className="block text-base sm:text-lg font-extrabold text-slate-800">{item.bmdc}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Details Layout */}
        <div className="space-y-5">
          {/* Clinical Milestones */}
          {milestones.length > 0 && (
            <section className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {milestones.map((ms, i) => {
                  const style = MILESTONE_STYLE[ms.color] || MILESTONE_STYLE.pink;
                  return (
                    <div key={i} className={`bg-white border border-slate-200/70 rounded-xl p-3.5 flex items-center gap-3.5 shadow-xs transition-all ${style.hover}`}>
                      <div className={`w-11 h-11 rounded-xl ${style.box} flex items-center justify-center text-base flex-shrink-0`}>
                        <i className={style.icon}></i>
                      </div>
                      <div className="min-w-0">
                        <div className="text-lg font-extrabold text-slate-900 leading-tight">{ms.count}</div>
                        <div className="text-xs font-medium text-slate-500 mt-0.5">{ms.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Two-Column: Expertise & Chamber */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch">
            {/* Expertise Card */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-pink-50 text-[#c81e62] flex items-center justify-center text-sm">
                  <i className="fas fa-star-of-life"></i>
                </div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Area of Expertise</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {visibleSpecs.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-50 hover:bg-pink-50/60 text-slate-700 text-xs font-medium rounded-xl border border-slate-200/70 transition flex items-center gap-1.5">
                    <i className="fas fa-check text-[#c81e62] text-[10px]"></i> {s}
                  </span>
                ))}

                {/* Hidden tags revealed on See More */}
                {seeMore && hiddenSpecs.length > 0 && (
                  <div className="flex flex-wrap gap-2 w-full mt-1">
                    {hiddenSpecs.map((s, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-50 hover:bg-pink-50/60 text-slate-700 text-xs font-medium rounded-xl border border-slate-200/70 transition flex items-center gap-1.5">
                        <i className="fas fa-check text-[#c81e62] text-[10px]"></i> {s}
                      </span>
                    ))}
                  </div>
                )}

                {hiddenSpecs.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSeeMore(!seeMore)}
                    className="px-3.5 py-1.5 bg-pink-50 hover:bg-pink-100/70 text-[#c81e62] text-xs font-semibold rounded-xl border border-pink-200/60 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{seeMore ? 'See Less' : 'See More'}</span>
                    <i className={`fas fa-chevron-down text-[10px] transform transition-transform duration-300 ${seeMore ? 'rotate-180' : ''}`}></i>
                  </button>
                )}
              </div>
            </section>

            {/* Chamber Info Card */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#059669] flex items-center justify-center text-sm">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Chamber Location</h2>
              </div>
              <div className="space-y-2.5 text-sm">
                <p className="font-bold text-slate-900 text-base">{item.chamber_title}</p>
                {item.chamber_address && (
                  <p className="text-slate-600 flex items-start gap-2.5 text-xs leading-relaxed">
                    <i className="fas fa-building text-slate-400 mt-0.5"></i>
                    <span>{item.chamber_address}</span>
                  </p>
                )}
                <p className="text-slate-600 flex items-center gap-2.5 text-xs">
                  <i className="fas fa-phone-volume text-[#059669]"></i>
                  <span>
                    Hotline:{' '}
                    <a href={`tel:${hotline}`} className="font-semibold text-slate-800 hover:text-[#c81e62] transition">
                      {hotline}
                    </a>
                  </span>
                </p>
              </div>
            </section>
          </div>

          {/* Additional Information Accordion (Bottom SEO Box) */}
          {(item.bio || item.seo_content || faqs.length > 0) && (
            <div className="border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden mb-6 sm:mb-8">
              <button
                type="button"
                onClick={() => setInfoOpen(!infoOpen)}
                aria-expanded={infoOpen}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left focus:outline-none cursor-pointer hover:bg-slate-50/70 transition-colors"
              >
                <span className="text-sm sm:text-[15px] text-slate-700 font-medium leading-none">
                  {item.seo_title || `More About ${item.name}`}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transform transition-transform duration-300 flex-shrink-0 ${infoOpen ? 'rotate-180' : ''}`} />
              </button>

              {infoOpen && (
                <div className="border-t border-slate-100 px-5 py-5 bg-white">
                  {item.seo_content ? (
                    <div className="space-y-6">
                      <div
                        className="rich-content-view wp-editor-content prose prose-slate max-w-none text-slate-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: item.seo_content }}
                      />

                      {faqs.length > 0 && (
                        <div className="pt-5 border-t border-slate-100">
                          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-3.5 bg-pink-700 rounded-full" />
                            Frequently Asked Questions (FAQs)
                          </h4>
                          <div className="space-y-2.5">
                            {faqs.map((f, i) => (
                              <div key={i} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
                                <p className="font-bold text-xs sm:text-sm text-slate-900 flex items-start gap-2">
                                  <span className="text-pink-700 font-extrabold">Q{i + 1}:</span>
                                  {f.q}
                                </p>
                                {f.a && (
                                  <p className="text-xs sm:text-sm text-slate-600 mt-1 pl-6 leading-relaxed">
                                    {f.a}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="max-w-none text-slate-600 space-y-5 text-xs sm:text-sm leading-relaxed">
                      {bioParas[0] && (
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 mb-1.5">About {item.name}</h3>
                          <p>{bioParas[0]}</p>
                        </div>
                      )}

                      {bioParas[1] && (
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 mb-1.5">Advanced Dental Procedures &amp; Clinical Excellence</h3>
                          <p>{bioParas[1]}</p>
                        </div>
                      )}

                      {bioParas[2] && (
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                            {whyBlock.intro ? whyBlock.intro.replace(/:$/, '') : `Why Patients Choose ${item.name.split(' ').slice(-2, 1)[0] || item.name}`}
                          </h3>
                          {whyBlock.items.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-1">
                              {whyBlock.items.map((li, i) => (
                                <li key={i}>
                                  <strong>{li.label}:</strong> {li.text}.
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>{bioParas[2]}</p>
                          )}
                        </div>
                      )}

                      {faqs.length > 0 && (
                        <div className="pt-3 border-t border-slate-100">
                          <h3 className="text-sm font-bold text-slate-900 mb-2.5">Frequently Asked Questions (FAQs)</h3>
                          <div className="space-y-2.5">
                            {faqs.map((f, i) => (
                              <div key={i}>
                                <p className="font-semibold text-slate-800">
                                  {i + 1}. {f.q}
                                </p>
                                {f.a && <p className="text-slate-500 mt-0.5">{f.a}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Clean Appointment Action Modal */}
      {bookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-100 rounded-2xl max-w-md w-full p-6 shadow-xl text-center relative">
            <button
              type="button"
              onClick={() => setBookingOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
              aria-label="Close"
            >
              <i className="fas fa-times text-xs"></i>
            </button>
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#c81e5f] flex items-center justify-center text-xl mx-auto mb-4">
              <i className="far fa-calendar-check"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Book Appointment with {item.name}</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              {item.chamber_title} — Visiting Hours: {item.visiting_time}. Call our official hotline to confirm your preferred slot immediately.
            </p>
            <div className="bg-slate-50 rounded-xl p-3.5 mb-5 border border-slate-100 text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800">{item.chamber_address}</div>
              {item.branch && <div className="text-slate-400">{item.branch}, Dhaka</div>}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:${hotline}`}
                className="flex-1 py-3 px-4 bg-[#c81e5f] hover:bg-[#a8184f] text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
              >
                <i className="fas fa-phone-alt fa-flip-horizontal"></i> Call {hotline}
              </a>
              <button
                type="button"
                onClick={() => setBookingOpen(false)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Footer */}
      <GlobalFooter hideCtaStrip={true} />
    </div>
  );
}
