import React, { useState, useMemo } from "react";
import { Head, Link } from "@inertiajs/react";
import {
  ChevronDown, MapPin, Clock, Award, ShieldCheck,
  Check, ArrowRight, Phone, CalendarCheck, UserCheck, Star
} from "lucide-react";
import { TopHeader } from "@/components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
import { PageProps } from '@inertiajs/core';

interface ServiceItem {
  id: number;
  slug: string;
  title: string;
  category?: string;
  price: string;
  price_suffix: string;
  short_desc: string;
  hero_main: string;
  hero_thumbs: string[];
  features: { title: string; sub: string }[];
  pricing_cards: { img: string; title: string; price: string; note: string; popular?: boolean }[];
  results: string[];
  details_heading: string;
  details_html: string;
  seo_images: string[];
  faqs: { q: string; a: string }[];
  reviews: { stars: number; text: string; by: string }[];
  seo_title?: string;
  meta_desc?: string;
  canonical_url?: string;
  robots_index?: boolean;
  robots_follow?: boolean;
  schema_type?: string;
  schema_json?: string;
}

interface Props extends PageProps {
  item: ServiceItem;
  doctors: any[];
  locations: any[];
  related: ServiceItem[];
  nav_menu?: any;
}

type TabKey = 'details' | 'doctors' | 'branches' | 'review' | 'faq';

const FeatureIcon: React.FC<{ index: number; className?: string }> = ({ index, className }) => {
  const paths = [
    "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", // smile — aesthetic
    "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", // clock — treatment time
    "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z", // shield/ribbon — durability
    "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z", // badge — warranty
  ];
  return (
    <svg className={className || "w-4 h-4 sm:w-5 sm:h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths[Math.min(index, paths.length - 1)]} />
    </svg>
  );
};

export default function ServicesPublicSingle({ item, doctors = [], locations = [], related = [], nav_menu }: Props) {
  const [selectedBranch, setSelectedBranch] = useState("mirpur");
  const [seoOpen, setSeoOpen] = useState(false);
  const [mainImg, setMainImg] = useState<string>(
    item?.hero_main || "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1000&q=80"
  );
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [appointmentDoctor, setAppointmentDoctor] = useState("");

  if (!item) return null;

  // Dynamic item data from database — no fallback to hardcoded mock arrays on deletion
  const features = Array.isArray(item.features) ? item.features : [];
  const pricingCards = Array.isArray(item.pricing_cards) ? item.pricing_cards : [];
  const results = Array.isArray(item.results) ? item.results : [];
  const reviews = Array.isArray(item.reviews) ? item.reviews : [];
  const faqs = Array.isArray(item.faqs) ? item.faqs : [];

  const displayThumbs = [
    item.hero_main,
    ...(Array.isArray(item.hero_thumbs) ? item.hero_thumbs : [])
  ].filter(Boolean) as string[];

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'details', label: 'Details' },
    { key: 'doctors', label: 'Doctors' },
    { key: 'branches', label: 'Branches' },
    ...(reviews.length > 0 ? [{ key: 'review' as TabKey, label: 'Review' }] : []),
    ...(faqs.length > 0 ? [{ key: 'faq' as TabKey, label: 'FAQ' }] : []),
  ];

  const displayDoctors = doctors.slice(0, 2).length ? doctors.slice(0, 2) : [
    {
      id: 1,
      name: "Dr. Aysha Siddika",
      degree: "BDS, PGT (Oral & Maxillofacial Surgery)",
      designation: "Assistant Medical Director",
      branch: "Mirpur",
      bmdc: "7897",
      visiting_time: "4.00 PM – 9.00 PM",
      experience: "8 Years",
      specialty: "Root Canal, Aesthetic & Kids Dentistry",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      name: "Dr. Afsana Haque Joty",
      degree: "BDS (DU), PGT (Paediatric Dentistry)",
      designation: "Branch In Charge & Senior Surgeon",
      branch: "Mirpur",
      bmdc: "11071",
      visiting_time: "4.00 PM – 8.00 PM",
      experience: "5.5 Years",
      specialty: "Paediatric Dentistry, Crown & Root Canal",
      image: "https://images.unsplash.com/photo-1594824432258-0056637b77ab?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const pageCanonical = item.canonical_url || `https://techdentalbd.com/services/${item.slug}`;
  const pageTitle = item.seo_title || `${item.title} — Tech Dental Care`;
  const pageDesc = item.meta_desc || item.short_desc || `Learn more about ${item.title} at Tech Dental Care. Specialist dental treatments with modern equipment in Dhaka.`;
  const pageRobots = `${item.robots_index !== false ? 'index' : 'noindex'}, ${item.robots_follow !== false ? 'follow' : 'nofollow'}`;

  const serviceJsonLd = useMemo(() => {
    if (item.schema_json) {
      try {
        return JSON.parse(item.schema_json);
      } catch (e) { }
    }
    const schema: any = {
      "@context": "https://schema.org",
      "@type": item.schema_type || "MedicalBusiness",
      "name": item.title,
      "description": pageDesc,
      "url": pageCanonical,
      "priceRange": item.price || "৳৳",
      "provider": {
        "@type": "Dentist",
        "name": "Tech Dental Care",
        "telephone": "+8801400786162",
      }
    };
    if (faqs.length > 0) {
      return {
        "@context": "https://schema.org",
        "@graph": [
          schema,
          {
            "@type": "FAQPage",
            "mainEntity": faqs.filter(f => f.q).map(f => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": f.a
              }
            }))
          }
        ]
      };
    }
    return schema;
  }, [item, pageCanonical, pageDesc, faqs]);

  return (
    <div className="min-h-screen bg-white text-gray-800 antialiased font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={pageCanonical} />
        <meta name="robots" content={pageRobots} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={pageCanonical} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify(serviceJsonLd)}
        </script>
      </Head>

      {/* 1. Header with Brand & Synchronized Branch Selector & Navigation Drawer */}
      <TopHeader
        locations={locations.length ? locations : []}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        navMenu={nav_menu}
      />

      {/* HERO SECTION */}
      <section className="w-full px-4 sm:px-8 lg:px-16 py-8 lg:py-10 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left: Images */}
          <div className="space-y-4">
            <div className="w-full h-80 sm:h-96 md:h-[450px] rounded-3xl overflow-hidden shadow-lg bg-gray-100">
              <img src={mainImg} alt={item.title} className="w-full h-full object-cover transition-all duration-300" />
            </div>

            {displayThumbs.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {displayThumbs.slice(1, 4).map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setMainImg(img)}
                    className={`h-24 sm:h-32 rounded-2xl overflow-hidden cursor-pointer border-2 transition ${mainImg === img ? 'border-[#f43f5e]' : 'border-transparent hover:border-[#f43f5e]'
                      }`}
                  >
                    <img src={img} alt={`${item.title} view ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Content */}
          <div className="flex flex-col justify-center">
            {item.category && (
              <span className="inline-block bg-rose-50 text-[#8f163b] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 w-fit border border-rose-100">
                {item.category}
              </span>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              {item.title}
            </h1>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl sm:text-4xl font-bold text-[#e11d48]">
                {item.price || "৳ 35,000"}
              </span>
              <span className="text-gray-500 text-sm font-medium">
                {item.price_suffix || "Starting Price"}
              </span>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {item.short_desc || "A titanium implant replaces the root of a missing tooth and holds a natural-looking crown. It feels, looks and works like your own tooth, with no need to grind down healthy neighbours."}
            </p>

            {/* Features Grid */}
            {features.length > 0 && (
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-10">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-4 p-2.5 sm:p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                    <div className="bg-[#ffe4e6] p-1.5 sm:p-2 rounded-full text-[#e11d48] shrink-0">
                      <FeatureIcon index={i} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-[12px] sm:text-sm leading-tight">{f.title}</h4>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 leading-tight">{f.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/appointment?service=${encodeURIComponent(item.title)}`}
                className="flex-1 bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold py-3.5 px-6 rounded-xl shadow-md transition flex justify-center items-center gap-2 cursor-pointer"
              >
                <CalendarCheck size={18} />
                <span>Book Appointment</span>
              </Link>

              <a
                href="https://wa.me/8809638000505"
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-[#128C7E] hover:bg-[#075E54] text-white font-semibold py-3.5 px-6 rounded-xl shadow-md transition flex justify-center items-center gap-2"
              >
                <Phone size={18} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      {pricingCards.length > 0 && (
        <section className="bg-gray-50 py-8 lg:py-10 border-y border-gray-200">
          <div className="w-full px-4 sm:px-8 lg:px-16 mx-auto">
            <div className="text-left md:text-center max-w-3xl mx-auto mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Types of implants with prices
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingCards.map((card, i) => (
                <div
                  key={i}
                  className={`bg-white rounded-3xl p-8 shadow-sm flex flex-col relative ${card.popular ? 'border-2 border-[#f43f5e]' : 'border border-gray-100'
                    }`}
                >
                  {card.popular && (
                    <div className="absolute -top-3 left-8 bg-[#ffe4e6] text-[#e11d48] text-xs font-bold px-3 py-1 rounded-full z-10">
                      Popular
                    </div>
                  )}

                  <div className="w-full h-40 mb-6 rounded-2xl overflow-hidden bg-gray-100 shrink-0 group mt-2">
                    <img
                      src={card.img}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-6">{card.title}</h3>

                  <div className="mb-8 flex-grow">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-[#e11d48]">{card.price}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{card.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RESULTS SECTION */}
      {results.length > 0 && (
        <section className="pt-8 pb-3 bg-white">
          <div className="w-full px-4 sm:px-8 lg:px-16 mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Real cases</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-2">
              {results.map((img, i) => (
                <div key={i} className="group">
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 relative">
                    <img
                      src={img}
                      alt={`Before and after case ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEO CONTENT SECTION (Tabbed Accordion) */}
      <section className="pt-1 pb-6 sm:pb-8 bg-white">
        <div className="w-full px-4 sm:px-8 lg:px-16 mx-auto">
          <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

            {/* Accordion Toggle Header */}
            <button
              type="button"
              onClick={() => setSeoOpen(!seoOpen)}
              aria-expanded={seoOpen}
              className="w-full flex justify-between items-center p-4 sm:p-5 focus:outline-none hover:bg-gray-50 transition cursor-pointer gap-3"
            >
              <span className="font-bold text-gray-900 text-left text-sm sm:text-base md:text-lg">
                {item.details_heading || `More About ${item.title || 'Service'}`}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 shrink-0 ${seoOpen ? 'rotate-180' : ''
                  }`}
              />
            </button>

            {/* Accordion Body: Pure SEO Content */}
            {seoOpen && (
              <div className="p-6 sm:p-8 border-t border-gray-100 animate-in fade-in duration-200">
                <div className="w-full text-gray-700 text-sm sm:text-base leading-relaxed">
                  {item.details_html ? (
                    <div
                      className="rich-content-view wp-editor-content prose max-w-none text-slate-800 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: item.details_html }}
                    />
                  ) : (
                    <div className="space-y-4 text-slate-700">
                      <p>
                        <strong>Advanced {item.title || 'Dental Treatments'} for a Perfect Smile:</strong> Reclaiming your beautiful smile and optimal oral functionality has never been more achievable. We provide precision procedures and robust clinical outcomes that look, feel, and function naturally.
                      </p>
                      <p>
                        Our expert dental team utilizes precision digital technology and advanced sterilization protocols across Mirpur, Uttara, Badda, and Jatrabari clinics in Dhaka.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <GlobalFooter hideCtaStrip={true} />

      {/* Appointment Modal */}
      {appointmentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setAppointmentModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              ✕
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold text-sm">
                <CalendarCheck size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Book Appointment</h3>
                <p className="text-xs text-pink-700 font-medium">{appointmentDoctor || item.title}</p>
              </div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setAppointmentModalOpen(false); alert('Appointment request submitted! We will contact you shortly.'); }} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Your Name</label>
                <input type="text" required placeholder="e.g. Tanvir Hasan" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                <input type="tel" required placeholder="017XXXXXXXX" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
                  <input type="date" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Time Slot</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none">
                    <option>4:00 PM - 6:00 PM</option>
                    <option>6:00 PM - 8:00 PM</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex justify-center items-center gap-2 mt-3 cursor-pointer">
                <CalendarCheck size={14} /> Confirm Appointment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
