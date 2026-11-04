import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { TopHeader } from "@/components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
import {
  MapPin, Calendar, Clock, Award, Check, X,
  ChevronDown, Phone, HeartHandshake, ArrowRight,
  UserCheck, ShieldCheck, CalendarCheck, Edit3, HelpCircle
} from "lucide-react";
import { PageProps } from '@inertiajs/core';

interface DoctorData {
  id: number;
  name: string;
  degree: string;
  designation: string;
  image: string;
  specialty: string;
  location: string;
  branch: string;
  bmdc: string;
  experience: string;
  visitingTime: string;
}

const DOCTORS_DATA: DoctorData[] = [
  {
    id: 1,
    name: "Dr. Aysha Siddika",
    degree: "BDS, PGT (Oral & Maxillofacial Surgery)",
    designation: "Assistant Medical Director",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop",
    specialty: "Root Canal, Aesthetic & Kids Dentistry",
    location: "Mirpur",
    branch: "Tech Dental, Mirpur Branch",
    bmdc: "7897",
    experience: "8 Years",
    visitingTime: "4.00 PM – 9.00 PM"
  },
  {
    id: 2,
    name: "Dr. Afsana Haque Joty",
    degree: "BDS (DU), PGT (Paediatric Dentistry)",
    designation: "Branch In Charge & Senior Surgeon",
    image: "https://images.unsplash.com/photo-1594824813566-7885a3964670?q=80&w=800&auto=format&fit=crop",
    specialty: "Pediatric Dentistry, Crown & Root Canal",
    location: "Mirpur",
    branch: "Tech Dental, Mirpur Branch",
    bmdc: "11071",
    experience: "5.5 Years",
    visitingTime: "4.00 PM – 8.00 PM"
  },
  {
    id: 3,
    name: "Dr. Saima Binte Zaman Shoili",
    degree: "BDS (DU), PGT (Conservative Dentistry)",
    designation: "Senior Dental Surgeon",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop",
    specialty: "Teeth Whitening, Fillings & Extractions",
    location: "Mirpur",
    branch: "Tech Dental, Mirpur Branch",
    bmdc: "12450",
    experience: "5 Years",
    visitingTime: "3.00 PM – 8.00 PM"
  },
  {
    id: 4,
    name: "Dr. Sayera Tabassum Elmee",
    degree: "BDS (DU), PGT (Endodontics)",
    designation: "Consultant Dental Surgeon",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=800&auto=format&fit=crop",
    specialty: "Smile Design, Root Canal & Veneers",
    location: "Mirpur",
    branch: "Tech Dental, Mirpur Branch",
    bmdc: "13102",
    experience: "4 Years",
    visitingTime: "4.00 PM – 9.00 PM"
  },
  {
    id: 5,
    name: "Dr. Mahmudur Rahman",
    degree: "BDS (CMC), FCPS (Orthodontics Fellow)",
    designation: "Orthodontics Specialist",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop",
    specialty: "Braces, Aligners & Dental Implants",
    location: "Uttara",
    branch: "Tech Dental, Uttara Branch",
    bmdc: "8920",
    experience: "9 Years",
    visitingTime: "5.00 PM – 9.00 PM"
  },
  {
    id: 6,
    name: "Dr. Nusrat Jahan Tanha",
    degree: "BDS (DU), PGT (Paediatric)",
    designation: "Branch In Charge & Senior Surgeon",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop",
    specialty: "Painless Root Canal & Child Dental Care",
    location: "Uttara",
    branch: "Tech Dental, Uttara Branch",
    bmdc: "10543",
    experience: "6 Years",
    visitingTime: "4.00 PM – 8.30 PM"
  },
  {
    id: 7,
    name: "Dr. Tariqul Islam",
    degree: "BDS (DDC), Dip. Dental Implants (USA)",
    designation: "Consultant Dental Implantologist",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop",
    specialty: "Dental Implants & Wisdom Tooth Surgery",
    location: "Badda",
    branch: "Tech Dental, Badda Branch",
    bmdc: "6540",
    experience: "11 Years",
    visitingTime: "5.00 PM – 9.00 PM"
  },
  {
    id: 8,
    name: "Dr. Farhana Ahmed",
    degree: "BDS (DU), PGT (Conservative)",
    designation: "Aesthetic Dental Specialist",
    image: "https://images.unsplash.com/photo-1594824813566-7885a3964670?q=80&w=800&auto=format&fit=crop",
    specialty: "Teeth Whitening, Veneers & Gap Filling",
    location: "Badda",
    branch: "Tech Dental, Badda Branch",
    bmdc: "11890",
    experience: "5 Years",
    visitingTime: "3.30 PM – 7.30 PM"
  },
  {
    id: 9,
    name: "Dr. Kazi Imran Hossain",
    degree: "BDS (RMC), PGT (Oral Surgery)",
    designation: "Chief Senior Oral Surgeon",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop",
    specialty: "Gum Surgeries, Implants & Extractions",
    location: "Jatrabari",
    branch: "Tech Dental, Jatrabari Branch",
    bmdc: "7120",
    experience: "10 Years",
    visitingTime: "4.30 PM – 9.00 PM"
  },
  {
    id: 10,
    name: "Dr. Mehnaz Chowdhury",
    degree: "BDS (DU), PGT (Paediatric Dentistry)",
    designation: "Dental Surgeon",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=800&auto=format&fit=crop",
    specialty: "Scaling, Polishing & Preventive Care",
    location: "Jatrabari",
    branch: "Tech Dental, Jatrabari Branch",
    bmdc: "13511",
    experience: "4 Years",
    visitingTime: "4.00 PM – 8.00 PM"
  }
];

const LOCATIONS = ['All', 'Mirpur', 'Uttara', 'Badda', 'Jatrabari'];

interface Props extends PageProps {
  item?: any;
  doctors?: any[];
  locations?: any[];
  nav_menu?: any;
}

export default function BestDentistPage({ item, doctors = [], locations = [], nav_menu }: Props) {
  const { auth } = usePage().props as any;
  const [selectedBranch, setSelectedBranch] = useState("mirpur");
  const [currentLocation, setCurrentLocation] = useState("All");
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);
  const [selectedDoctorForProfile, setSelectedDoctorForProfile] = useState<DoctorData | null>(null);
  const [appointmentDoctorName, setAppointmentDoctorName] = useState<string | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);

  // Safe FAQs parsing from Page model (handles both array and stringified JSON)
  const safeFaqs = React.useMemo(() => {
    if (!item?.faqs) return [];
    if (Array.isArray(item.faqs)) return item.faqs;
    if (typeof item.faqs === 'string') {
      try {
        const parsed = JSON.parse(item.faqs);
        if (Array.isArray(parsed)) return parsed;
      } catch { }
    }
    return [];
  }, [item?.faqs]);

  // SEO fields from item (Page model)
  const textContent = item?.content ? item.content.replace(/<[^>]+>/g, '') : '';
  const pageCanonical = item?.canonical_url || `https://techdentalbd.com/page/${item?.slug || 'best-dentist-in-dhaka'}`;
  const pageTitle = item?.seo_title || (item?.title ? `${item.title} — Tech Dental` : 'Best Dentist in Dhaka, Bangladesh — Tech Dental');
  const pageDesc = item?.meta_desc || (textContent ? textContent.substring(0, 155) + '...' : 'Looking for the best dentist in Dhaka? Consult with verified specialist dental surgeons in Mirpur, Uttara, Badda & Jatrabari at Tech Dental.');
  const pageRobots = `${item?.robots_index !== false ? 'index' : 'noindex'}, ${item?.robots_follow !== false ? 'follow' : 'nofollow'}`;

  const pageSchema = React.useMemo(() => {
    if (item?.schema_json) {
      try { return JSON.parse(item.schema_json); } catch (e) { }
    }
    const schema: any = {
      "@context": "https://schema.org",
      "@type": item?.schema_type || "Dentist",
      "name": "Tech Dental Care - Best Dentist in Dhaka",
      "description": pageDesc,
      "url": pageCanonical,
      "telephone": "+8801400786162",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dhaka",
        "addressCountry": "BD"
      }
    };
    if (safeFaqs.length > 0) {
      return {
        "@context": "https://schema.org",
        "@graph": [
          schema,
          {
            "@type": "FAQPage",
            "mainEntity": safeFaqs.filter((f: any) => f && f.q).map((f: any) => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": { "@type": "Answer", "text": f.a }
            }))
          }
        ]
      };
    }
    return schema;
  }, [item, pageCanonical, pageDesc, safeFaqs]);

  // Dynamic doctors from database or fallback to DOCTORS_DATA
  const doctorsList = React.useMemo(() => {
    if (Array.isArray(doctors) && doctors.length > 0) {
      return doctors.map((d: any) => ({
        id: d.id,
        name: d.name,
        degree: d.deg || '',
        designation: d.designation || 'Specialist Dental Surgeon',
        image: d.img || '',
        specialty: d.spec || '',
        location: d.branch_location || (d.branch || '').replace(/Tech Dental|Branch|,/gi, '').trim() || 'Mirpur',
        branch: d.branch || 'Tech Dental Care',
        bmdc: d.bmdc || 'Verified',
        experience: d.experience_years || d.exp || '5+ Years',
        visitingTime: d.visiting_time || '4.00 PM – 9.00 PM',
      }));
    }
    return DOCTORS_DATA;
  }, [doctors]);

  // Filter doctors
  const filteredDoctors = doctorsList.filter(
    (doc) => currentLocation === 'All' || doc.location.toLowerCase().includes(currentLocation.toLowerCase())
  );

  const handleOpenAppointment = (name?: string) => {
    if (name) {
      router.visit(`/appointment?doctor=${encodeURIComponent(name)}`);
    } else {
      router.visit('/appointment');
    }
  };

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentDoctorName(null);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased flex flex-col w-full font-sans">
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
          {JSON.stringify(pageSchema)}
        </script>
      </Head>

      {/* Admin Quick Edit Bar */}
      {auth?.user && item?.id && (
        <div className="bg-amber-500 text-white px-4 py-2 flex items-center justify-between text-xs font-semibold shadow-xs z-50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
            <span>Admin Toolbar: Editing SEO & Content for &ldquo;{item.title}&rdquo;</span>
          </div>
          <a
            href={`/pages/${item.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-amber-900 rounded-md font-bold hover:bg-amber-50 transition shadow-xs"
          >
            <Edit3 size={12} /> Edit SEO & Page in Admin
          </a>
        </div>
      )}

      {/* 1. Header with Brand & Synchronized Branch Selector & Navigation Drawer */}
      <TopHeader
        locations={locations}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        navMenu={nav_menu}
      />

      <main className="flex-grow w-full px-3 sm:px-6 lg:px-8 pt-0 pb-8">

        {/* Compact Full-Width Title Section - Vertically Centered in the Gap */}
        <section className="text-center w-full py-5 sm:py-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-pink-700 tracking-tight leading-snug w-full">
            You Are Looking For Best Dentist in Dhaka, Bangladesh
          </h1>
        </section>

        {/* Location Filter Bar Aligned to Start (Full width) */}
        <section className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200 mb-8 w-full">
          <div className="flex flex-wrap gap-2 justify-start items-center" id="location-filters">
            {LOCATIONS.map((loc) => {
              const isActive = currentLocation.toLowerCase() === loc.toLowerCase();
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setCurrentLocation(loc)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive
                      ? "bg-pink-700 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-pink-50 hover:text-pink-700"
                    }`}
                >
                  {loc}
                </button>
              );
            })}
          </div>
        </section>

        {/* Doctors Cards Grid (Full width responsive grid) */}
        {filteredDoctors.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl p-5 text-center flex flex-col justify-between shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ border: "2px solid #a21caf" }}
              >
                <div>
                  {/* Doctor Image with Location Badge */}
                  <a href={`/doctors/${doc.id}`} className="block w-full h-52 sm:h-56 mb-4 rounded-xl overflow-hidden bg-slate-100 relative group">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      onError={(e: any) => {
                        e.target.src = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop";
                      }}
                    />
                    <span className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs text-pink-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <MapPin size={11} className="text-pink-600" />
                      {doc.location}
                    </span>
                  </a>

                  {/* Doctor Name */}
                  <a href={`/doctors/${doc.id}`} className="hover:underline block">
                    <h2 className="text-lg font-bold text-teal-600 mb-1 leading-snug">
                      {doc.name}
                    </h2>
                  </a>

                  {/* Degree & Designation */}
                  <p className="text-xs font-semibold text-slate-700 mb-0.5">{doc.degree}</p>
                  <p className="text-xs text-slate-500 mb-3">{doc.designation}</p>

                  {/* Key Details Box - Re-architected into a unified 4-box grid (2x2) */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 mb-3">
                    <div className="grid grid-cols-2 gap-2 text-left">
                      {/* Branch Box */}
                      <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-0.5 flex items-center gap-1">
                          <MapPin size={10} className="text-slate-400" /> Branch
                        </span>
                        <span className="font-bold text-slate-800 block text-xs truncate">
                          {doc.location}
                        </span>
                      </div>

                      {/* BMDC Reg. No Box */}
                      <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-0.5 flex items-center gap-1">
                          <ShieldCheck size={10} className="text-slate-400" /> BMDC Reg.
                        </span>
                        <span className="font-bold text-slate-800 block text-xs">
                          {doc.bmdc}
                        </span>
                      </div>

                      {/* Visiting Box */}
                      <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-0.5 flex items-center gap-1">
                          <Clock size={10} className="text-slate-400" /> Visiting
                        </span>
                        <span className="font-bold text-slate-800 block text-xs truncate" title={doc.visitingTime}>
                          {doc.visitingTime}
                        </span>
                      </div>

                      {/* Experience Box */}
                      <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-0.5 flex items-center gap-1">
                          <Award size={10} className="text-slate-400" /> Experience
                        </span>
                        <span className="font-bold text-slate-800 block text-xs">
                          {doc.experience}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Main Specialty */}
                  <div className="text-xs text-slate-600 mb-4">
                    <span className="font-bold text-slate-800">Specialty:</span> {doc.specialty}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-2.5 pt-3 border-t border-slate-100">
                  <a
                    href={`/doctors/${doc.id}`}
                    className="w-1/2 py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    <UserCheck size={13} />
                    <span>View Profile</span>
                  </a>
                  <Link
                    href={`/appointment?doctor=${encodeURIComponent(doc.name)}`}
                    className="w-1/2 py-2 px-3 bg-[#800038] hover:bg-[#9a0044] text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    <CalendarCheck size={13} />
                    <span>Appointment</span>
                  </Link>
                </div>
              </div>
            ))}
          </section>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-600 mb-1">No dentists found in this location</h3>
            <p className="text-slate-400 text-xs">Try selecting a different area tab above.</p>
          </div>
        )}

        {/* More about Dentists Collapsible Accordion Section */}
        <section className="mt-8 w-full">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => setIsMoreInfoOpen((prev) => !prev)}
              className="w-full flex items-center justify-between p-5 text-left text-slate-800 hover:bg-slate-50 transition cursor-pointer"
              aria-expanded={isMoreInfoOpen}
            >
              <span className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                {item?.seo_title || 'More about Dentists'}
              </span>
              <ChevronDown
                size={16}
                className={`text-slate-500 transition-transform duration-300 ${isMoreInfoOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {isMoreInfoOpen && (
              <div className="border-t border-slate-100 p-5 sm:p-7 text-slate-700 bg-white space-y-6 animate-in fade-in duration-200">
                {item?.content && item.content.trim() !== '' ? (
                  <div
                    className="rich-content-view wp-editor-content prose prose-slate max-w-none text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                ) : (
                  <>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1.5">
                        About Dr. Aysha Siddika – Senior Dental Specialist in Mirpur, Dhaka
                      </h3>
                      <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                        Dr. Aysha Siddika is a Senior Dental Surgeon at Tech Dental Care (Mirpur Branch). With over 8+ years of dedicated clinical experience and more than 2,863+ successful patient treatments, she is widely recognized for her gentle, patient-first approach. She completed her Bachelor of Dental Surgery (BDS) from Shaheed Suhrawardy Medical College and Hospital, followed by advanced Post-Graduate Training (PGT) in Oral &amp; Maxillofacial Surgery and Conservative Dentistry. Her BMDC Registration Number is 7897.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1.5">
                        Advanced Dental Procedures &amp; Clinical Excellence
                      </h3>
                      <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                        Specializing in Aesthetic Dentistry and Painless Laser Root Canal Therapy (RCT), Dr. Aysha Siddika has completed 597+ single-visit root canals, cosmetic smile designing, porcelain veneers, and composite restorations. Utilizing modern rotary endodontic systems and digital apex locators, she ensures maximum tooth preservation and absolute comfort during dental interventions.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1.5">
                        Comprehensive Dental Care Network Across Dhaka
                      </h3>
                      <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                        Whether you require pediatric dental treatments, digital orthodontic aligners, painless wisdom tooth extractions, or permanent dental implants, our certified dental specialists across Mirpur, Uttara, Badda, and Jatrabari provide international-standard sterilization, digital OPG X-rays, and customized patient consultations.
                      </p>
                    </div>
                  </>
                )}

                {/* Frequently Asked Questions (from Admin SEO FAQs) */}
                {safeFaqs.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                      <HelpCircle size={16} className="text-rose-700" />
                      Frequently Asked Questions (FAQ)
                    </h4>
                    <div className="space-y-2.5">
                      {safeFaqs.filter((f: any) => f && f.q).map((faq: any, idx: number) => (
                        <div key={idx} className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/70">
                          <p className="font-bold text-xs sm:text-sm text-slate-900 mb-1">{faq.q}</p>
                          <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Full-Width Book Appointment Banner */}
        <section className="w-full bg-[#800038] text-white py-12 px-6 sm:px-10 rounded-3xl mt-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-200">
              Painless Clinical Dentistry in Dhaka
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Restore Your Healthy Smile?
            </h2>
            <p className="text-rose-100 text-xs sm:text-sm max-w-xl">
              Consult with our specialist oral surgeons across Mirpur, Uttara, Badda, and Jatrabari branches.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
            <a
              href="tel:+8801700000000"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
            >
              <Phone size={13} />
              <span>01700-000000</span>
            </a>

            <Link
              href="/appointment"
              className="px-6 py-2.5 bg-white text-[#800038] hover:bg-rose-50 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Book Appointment</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>
      </main>

      {/* Doctor Profile Modal */}
      {selectedDoctorForProfile && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setSelectedDoctorForProfile(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center transition cursor-pointer"
              aria-label="Close Profile Modal"
            >
              <X size={16} />
            </button>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Profile Photo */}
              <div className="w-full md:w-1/3 shrink-0">
                <img
                  src={selectedDoctorForProfile.image}
                  alt={selectedDoctorForProfile.name}
                  className="w-full h-64 object-cover object-top rounded-2xl shadow-sm border border-slate-200"
                />
                <div className="mt-3 bg-pink-50 rounded-xl p-3 text-center border border-pink-100">
                  <p className="text-xs text-pink-700 font-bold flex items-center justify-center gap-1">
                    <ShieldCheck size={12} /> BMDC Reg. No
                  </p>
                  <p className="text-sm font-extrabold text-slate-800">{selectedDoctorForProfile.bmdc}</p>
                </div>
              </div>

              {/* Profile Information */}
              <div className="w-full md:w-2/3 space-y-4">
                <div>
                  <span className="inline-block bg-pink-100 text-pink-800 text-xs font-bold px-2.5 py-0.5 rounded-full mb-1">
                    {selectedDoctorForProfile.location} Branch
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                    {selectedDoctorForProfile.name}
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-pink-700 mt-1">
                    {selectedDoctorForProfile.degree}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    {selectedDoctorForProfile.designation}
                  </p>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-medium">Experience</span>
                    <span className="font-bold text-slate-700 text-sm">{selectedDoctorForProfile.experience}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-medium">Visiting Hours</span>
                    <span className="font-bold text-slate-700 text-xs">{selectedDoctorForProfile.visitingTime}</span>
                  </div>
                </div>

                {/* Full Specialty & Services */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Specializations</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDoctorForProfile.specialty.split(",").map((s, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1"
                      >
                        <Check size={11} className="text-emerald-600" />
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Chamber Location */}
                <div className="border-t border-slate-100 pt-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Chamber Location</h4>
                  <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <MapPin size={12} className="text-pink-600" />
                    {selectedDoctorForProfile.branch}
                  </p>
                </div>

                {/* CTA Action */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const docName = selectedDoctorForProfile.name;
                      setSelectedDoctorForProfile(null);
                      handleOpenAppointment(docName);
                    }}
                    className="w-full py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex justify-center items-center gap-2 cursor-pointer"
                  >
                    <CalendarCheck size={14} /> Book Appointment Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      {appointmentDoctorName && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setAppointmentDoctorName(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              aria-label="Close Appointment Modal"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold text-sm">
                <CalendarCheck size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Book Appointment</h3>
                <p className="text-xs text-pink-700 font-medium">{appointmentDoctorName}</p>
              </div>
            </div>

            <form onSubmit={handleAppointmentSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Hasan"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
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
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Time Slot</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none">
                    <option>4:00 PM - 6:00 PM</option>
                    <option>6:00 PM - 8:00 PM</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex justify-center items-center gap-2 mt-3 cursor-pointer"
              >
                <CalendarCheck size={14} /> Confirm Appointment Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      <div
        className={`fixed bottom-5 right-5 bg-emerald-800 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 transition-all duration-300 z-50 ${isToastVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
          }`}
      >
        <ShieldCheck size={20} className="text-emerald-200" />
        <div>
          <h4 className="font-bold text-xs">Appointment Requested!</h4>
          <p className="text-[11px] text-emerald-100">We will confirm your appointment shortly.</p>
        </div>
      </div>

      {/* Global Footer */}
      <GlobalFooter hideCtaStrip={true} />
    </div>
  );
}
