import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { TopHeader } from "@/components/TopHeader";
import { AppointmentModal } from "@/components/AppointmentModal";
import { BranchPickerModal } from "@/components/BranchPickerModal";
import { GlobalFooter } from "@/Components/GlobalFooter";
import Seo from "@/Components/Seo";
import { HOTLINE_DISPLAY, HOTLINE_TEL } from "@/utils/contact";
import { 
  Play, Eye, Target, ShieldCheck, Zap, Check, Clock, Shield, 
  Phone, MapPin, Calendar, ChevronRight, Star, Award, Sparkles, 
  Users, ArrowRight, X, ExternalLink, CheckCircle2, HeartHandshake,
  Smile, Activity, PhoneCall
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';

interface AboutContentData {
  hero_title: string;
  hero_subtitle: string;
  hero_bg: string;
  headline: string;
  founded_year: string;
  patients_count: string;
  story_p1: string;
  story_p2: string;
  video_thumb: string;
  video_url: string;
  services_cards: { img: string; title: string; desc: string }[];
  tech_headline: string;
  tech_subtext: string;
  tech_cards: { img: string; title: string; tag: string; desc: string }[];
  vision_title: string;
  vision_text: string;
  mission_title: string;
  mission_text: string;
  team_banner: string;
  why_cards: { img: string; title: string; desc: string }[];
  seo_title?: string;
  meta_desc?: string;
  canonical_url?: string;
  robots_index?: boolean;
  robots_follow?: boolean;
  schema_type?: string;
  schema_json?: string;
  faqs?: { q: string; a: string }[];
}

interface Props extends PageProps {
  content: AboutContentData;
  doctors: any[];
  management: any[];
  locations?: any[];
  nav_menu?: any;
}

const TECH_CONFIG = [
  { 
    border: 'border-t-4 border-blue-500', 
    circleBg: 'bg-blue-100 text-blue-600', 
    badgeBg: 'bg-emerald-500', 
    icon: Zap 
  },
  { 
    border: 'border-t-4 border-emerald-500', 
    circleBg: 'bg-emerald-100 text-emerald-600', 
    badgeBg: 'bg-emerald-500', 
    icon: Check 
  },
  { 
    border: 'border-t-4 border-amber-500', 
    circleBg: 'bg-amber-100 text-amber-600', 
    badgeBg: 'bg-emerald-500', 
    icon: Clock 
  },
  { 
    border: 'border-t-4 border-purple-500', 
    circleBg: 'bg-purple-100 text-purple-600', 
    badgeBg: 'bg-emerald-500', 
    icon: Shield 
  },
];

export default function AboutPublicIndex({ content, doctors = [], management = [], locations = [], nav_menu }: Props) {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isBranchPickerOpen, setIsBranchPickerOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  if (!content) return null;

  const storyParagraphs = (content.story_p1 + (content.story_p2 ? '\n\n' + content.story_p2 : '')).split('\n\n').filter(Boolean);
  const displayDoctors = doctors.length > 0 ? doctors.slice(0, 8) : [];

  const aboutSchemas: any[] = [];
  if (content.schema_json) {
    try {
      aboutSchemas.push(JSON.parse(content.schema_json));
    } catch {
      /* ignore invalid custom schema */
    }
  }
  if (Array.isArray(content.faqs) && content.faqs.length > 0) {
    aboutSchemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: content.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    });
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased overflow-x-clip w-full flex flex-col font-sans">
      <Seo
        title={content.seo_title || `${content.hero_title || 'About Tech Dental Care'} — Digital Oral Healthcare`}
        description={content.meta_desc || content.hero_subtitle || content.story_p1}
        path="/about"
        robots={`${content.robots_index !== false ? 'index' : 'noindex'}, ${content.robots_follow !== false ? 'follow' : 'nofollow'}`}
        schema={aboutSchemas}
        noSuffix
      />

      {/* 1. Full-Width Top Header */}
      <TopHeader 
        locations={locations} 
        selectedBranch={selectedBranch} 
        onBranchChange={setSelectedBranch} 
        navMenu={nav_menu} 
      />

      {/* 2. Full-Width Customer Breadcrumb Bar */}
      <div className="w-full bg-slate-50 border-b border-slate-200/80 px-4 sm:px-8 md:px-14 lg:px-20 py-3">
        <div className="flex items-center justify-between text-xs text-slate-500 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-[#800038] font-semibold transition-colors flex items-center gap-1">
              <span>Home</span>
            </Link>
            <ChevronRight size={13} className="text-slate-400" />
            <span className="text-slate-400">About Us</span>
            <ChevronRight size={13} className="text-slate-400" />
            <span className="font-bold text-slate-800">{content.hero_title || 'About Tech Dental Care'}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200/60">
            <ShieldCheck size={14} className="text-rose-600" />
            <span>Govt. Approved & BMDC Certified Clinic</span>
          </div>
        </div>
      </div>

      {/* 3. Full-Width Hero Section */}
      <header
        className="relative bg-cover bg-center min-h-[360px] md:min-h-[460px] flex items-center justify-center w-full overflow-hidden"
        style={{ backgroundImage: `url('${content.hero_bg || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=80'}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-[#800038]/85 to-slate-900/90" />
        <div className="relative z-10 text-center text-white px-4 sm:px-8 md:px-14 lg:px-20 py-16 w-full max-w-5xl mx-auto flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-rose-200 tracking-wider uppercase mb-5">
            <Sparkles size={14} className="text-amber-400 animate-pulse" />
            <span>Digital Oral Healthcare in Bangladesh</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-5 tracking-tight leading-tight">
            {content.hero_title || 'About Tech Dental Care'}
          </h1>

          <p className="text-sm sm:text-lg md:text-xl font-normal text-rose-100/90 max-w-3xl mx-auto leading-relaxed mb-8">
            {content.hero_subtitle || 'Your trusted partner for comprehensive dental care and innovative dental technology solutions across Dhaka.'}
          </p>

          {/* Quick Highlight Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 w-full max-w-3xl pt-4 border-t border-white/15">
            <div className="text-center p-3 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-white">{content.patients_count || '200,000'}+</div>
              <div className="text-[11px] sm:text-xs text-rose-200 font-medium">Happy Patients</div>
            </div>
            <div className="text-center p-3 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-white">{content.founded_year || '2018'}</div>
              <div className="text-[11px] sm:text-xs text-rose-200 font-medium">Year Established</div>
            </div>
            <div className="text-center p-3 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-white">4</div>
              <div className="text-[11px] sm:text-xs text-rose-200 font-medium">Dhaka Branches</div>
            </div>
            <div className="text-center p-3 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-white">15+</div>
              <div className="text-[11px] sm:text-xs text-rose-200 font-medium">Specialist Doctors</div>
            </div>
          </div>

        </div>
      </header>

      {/* 4. Our Story & Video Section */}
      <section className="py-16 md:py-24 px-4 sm:px-8 md:px-14 lg:px-20 xl:px-28 w-full bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left: Video / Clinic Preview Card */}
          <div className="w-full lg:w-1/2 relative group rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            <img
              src={content.video_thumb || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=80"}
              alt="Tech Dental Happy Patients"
              className="w-full h-[320px] sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/30 to-transparent flex flex-col justify-between p-6">
              <div className="flex items-center gap-2">
                <span className="bg-[#800038] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Clinic Tour & Patient Experience
                </span>
              </div>

              <div className="flex items-center justify-center my-auto">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="w-20 h-20 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer group/btn"
                  title="Play Clinic Tour Video"
                >
                  <Play size={32} className="ml-1 text-white fill-white group-hover/btn:animate-pulse" />
                </button>
              </div>

              <div className="text-white">
                <p className="text-xs text-rose-200 font-medium">Inside Tech Dental Experience</p>
                <h4 className="text-lg font-bold text-white">Advanced Sterile Operatories & Comfort Lounges</h4>
              </div>
            </div>
          </div>

          {/* Right: Story Content */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#800038] tracking-widest uppercase bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-200/60">
              <Award size={15} />
              <span>Our Heritage & Patient Commitment</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#800038] tracking-tight leading-tight">
              {content.headline || "Let a New Smile Begin with Tech Dental"}
            </h2>

            <div className="space-y-4 text-slate-600 leading-relaxed text-base sm:text-lg">
              {storyParagraphs.map((p, i) => (
                <p key={i} className="text-justify sm:text-left">{p}</p>
              ))}
            </div>

            {/* Core Values Bullet Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>State-of-the-Art German RVG X-Ray</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>100% Painless Laser Dentistry</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>4-Step International Hospital Hygiene</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Transparent Fixed Clinical Pricing</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4 flex-wrap">
              <Link
                href="/appointment"
                className="px-6 py-3 rounded-xl bg-[#800038] hover:bg-[#6b002f] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar size={16} />
                <span>Book Appointment Online</span>
              </Link>

              <a
                href={HOTLINE_TEL}
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 transition-all flex items-center gap-2"
              >
                <PhoneCall size={16} className="text-[#800038]" />
                <span>Call Hotline</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Our Dental Services & Technology Section */}
      {content.services_cards && content.services_cards.length > 0 && (
        <section className="py-20 px-4 sm:px-8 md:px-14 lg:px-20 xl:px-28 w-full bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
                Our Dental Services &amp; Technology
              </h2>
              <p className="text-slate-600 text-base sm:text-lg">
                Comprehensive, gentle, and specialized oral healthcare tailored to your unique smile.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.services_cards?.map((card, i) => (
                <div 
                  key={i} 
                  className="group bg-white rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-full h-52 overflow-hidden rounded-2xl mb-6 relative">
                      <img 
                        src={card.img} 
                        alt={card.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-3 left-3 bg-[#800038]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                        Specialized Care
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-[#800038] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      {card.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#800038] hover:text-[#5a0027] transition-colors"
                    >
                      <span>View Treatments</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      href="/appointment"
                      className="px-3.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs transition cursor-pointer"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* 6. Meet Our Dental Team Section */}
      <section className="py-20 px-4 sm:px-8 md:px-14 lg:px-20 xl:px-28 w-full bg-white">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Meet Our Dental Team
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Our team of experienced and highly qualified dental professionals is dedicated to providing you with the best possible care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayDoctors.map((d: any) => (
              <div
                key={d.id}
                className="group bg-white rounded-3xl p-6 shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-200 hover:border-rose-200 flex flex-col items-center text-center"
              >
                <div className="relative mb-5">
                  <div className="absolute inset-0 bg-rose-400 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300 scale-105" />
                  <img
                    src={d.img || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80"}
                    alt={d.name}
                    className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-md group-hover:border-rose-100 transition-colors duration-300"
                  />
                </div>

                <h3 className="font-extrabold text-slate-900 text-lg mb-1 group-hover:text-[#800038] transition-colors">
                  {d.name}
                </h3>
                <p className="text-xs text-rose-600 font-extrabold mb-3 tracking-wider uppercase">
                  {d.designation || 'Dental Surgeon'}
                </p>

                <div className="w-12 h-0.5 bg-slate-200 rounded-full mb-3 group-hover:bg-[#800038] transition-colors" />

                <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5 mb-4">
                  <MapPin size={13} className="text-[#800038]" />
                  <span>Tech Dental, {d.branch || d.branch_location || 'Mirpur'}</span>
                </p>

                <Link
                  href={`/appointment?doctor=${encodeURIComponent(d.name)}`}
                  className="mt-auto w-full py-2 bg-slate-50 hover:bg-[#800038] text-slate-700 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-200 hover:border-transparent cursor-pointer flex items-center justify-center"
                >
                  Book Appointment
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
            >
              <span>View All Specialist Doctors ({doctors.length})</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>

      {/* 7. Advanced Dental Technology Section */}
      {content.tech_cards && content.tech_cards.length > 0 && (
        <section className="py-20 px-4 sm:px-8 md:px-14 lg:px-20 xl:px-28 w-full bg-[#f0f4ff]">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-4xl mx-auto mb-16">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-rose-700 border border-slate-200/80">
                <ShieldCheck size={28} />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#800038] tracking-tight mb-4">
                {content.tech_headline || 'Tech Dental Modern Advanced Dental Technology'}
              </h2>
              <p className="text-slate-600 text-base sm:text-lg max-w-3xl mx-auto">
                {content.tech_subtext || 'Tech Dental brings you modern dental care with Digital X-Ray, Intraoral Cameras, Live Patient Portal, and 4-Step Sterilization — ensuring safe, precise, and patient-friendly treatment.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.tech_cards?.map((card, i) => {
                const cfg = TECH_CONFIG[i % TECH_CONFIG.length];
                const IconComp = cfg.icon;
                return (
                  <div 
                    key={i} 
                    className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 ${cfg.border} relative flex flex-col justify-between`}
                  >
                    <div className="absolute -top-3.5 -right-3.5 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md">
                      {i + 1}
                    </div>

                    <div>
                      <div className={`w-12 h-12 ${cfg.circleBg} rounded-full flex items-center justify-center mb-4 mx-auto`}>
                        <IconComp size={22} />
                      </div>

                      <h3 className="text-lg font-bold text-rose-800 text-center mb-1">
                        {card.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 text-center mb-4 uppercase font-bold tracking-wider">
                        {card.tag}
                      </p>

                      <div className="w-full h-40 rounded-xl overflow-hidden mb-4 border border-slate-100">
                        <img 
                          src={card.img} 
                          alt={card.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                        />
                      </div>

                      <p className="text-xs text-slate-600 text-center leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {/* 8. Vision & Mission Section */}
      <section className="py-20 px-4 sm:px-8 md:px-14 lg:px-20 xl:px-28 w-full bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Vision */}
          <div className="md:w-1/3 text-center space-y-4">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto shadow-xs text-rose-700 border border-rose-100">
              <Eye size={28} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-rose-800">
              {content.vision_title || 'Our Vision'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {content.vision_text || "Building Asia's premier dental institute, synonymous with cutting-edge technology and impeccable aesthetic results."}
            </p>
          </div>

          {/* Center Team Image */}
          <div className="md:w-1/3 p-3 rounded-2xl border border-rose-100 shadow-md bg-white">
            <img 
              src={content.team_banner || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"} 
              alt="Tech Dental Team Collaboration" 
              className="w-full h-64 object-cover rounded-xl" 
            />
          </div>

          {/* Mission */}
          <div className="md:w-1/3 text-center space-y-4">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto shadow-xs text-rose-700 border border-rose-100">
              <Target size={28} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-rose-800">
              {content.mission_title || 'Our Mission'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {content.mission_text || 'Prepare to be stunned: Introducing the most integrated aesthetic treatment appliance, engineered to surpass even your wildest vision for a beautiful smile.'}
            </p>
          </div>

        </div>
      </section>

      {/* 9. Why Choose Tech Dental Section */}
      {content.why_cards && content.why_cards.length > 0 && (
        <section className="py-20 px-4 sm:px-8 md:px-14 lg:px-20 xl:px-28 w-full bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto text-center">
            
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Why Choose Tech Dental
            </h2>
            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto mb-14">
              Setting new benchmarks in modern oral healthcare with patient satisfaction and painless results.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {content.why_cards?.map((card, i) => (
                <div 
                  key={i} 
                  className="bg-white p-8 sm:p-10 rounded-3xl shadow-xs hover:shadow-lg transition-all border border-slate-200/80 flex flex-col items-center text-center"
                >
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-rose-50 shadow-md">
                    <img 
                      src={card.img} 
                      alt={card.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* 10. Management Team Section */}
      <section className="py-20 px-4 sm:px-8 md:px-14 lg:px-20 xl:px-28 w-full bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto text-center">
          
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Management Team
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto mb-14">
            Experienced healthcare leaders committed to ethical dentistry and continuous innovation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(management.length > 0 ? management : []).map((member) => {
              const memberSlug = (member.name || '')
                .toLowerCase()
                .replace(/[.']/g, '')
                .trim()
                .replace(/\s+/g, '-');
              const memberUrl = `/team/${memberSlug || member.id}`;

              return (
                <div key={member.id} className="flex flex-col items-center bg-slate-50/70 p-8 rounded-3xl border border-slate-200/70">
                  <Link href={memberUrl} className="w-40 h-40 rounded-full overflow-hidden mb-5 border-4 border-white shadow-md block group cursor-pointer">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <Link href={memberUrl} className="no-underline">
                    <h3 className="font-extrabold text-xl text-[#800038] hover:text-[#5e0029] transition-colors mb-1">{member.name}</h3>
                  </Link>
                  <p className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-5">{member.role}</p>
                  <Link
                    href={memberUrl}
                    className="px-6 py-2 border-2 border-[#800038] text-[#800038] hover:bg-[#800038] hover:text-white rounded-full text-xs font-bold transition cursor-pointer"
                  >
                    See Details
                  </Link>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 11. Full-Width Book Appointment Banner */}
      <section className="w-full bg-[#800038] text-white py-14 px-4 sm:px-8 md:px-14 lg:px-20 xl:px-28">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-200">
              Painless Clinical Dentistry in Dhaka
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to Restore Your Healthy Smile?
            </h2>
            <p className="text-rose-100 text-sm max-w-xl">
              Consult with our specialist oral surgeons across Mirpur, Uttara, Badda, and Jatrabari branches.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a
              href={HOTLINE_TEL}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-bold text-sm transition flex items-center gap-2"
            >
              <Phone size={16} />
              <span>{HOTLINE_DISPLAY}</span>
            </a>

            <Link
              href="/appointment"
              className="px-8 py-3.5 bg-white hover:bg-rose-50 text-[#800038] rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition flex items-center gap-2 cursor-pointer"
            >
              <Calendar size={16} />
              <span>Make Appointment &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Appointment & Branch Pickers Modals */}
      {isAppointmentOpen && (
        <AppointmentModal
          isOpen={isAppointmentOpen}
          onClose={() => setIsAppointmentOpen(false)}
          locations={locations}
          selectedBranch={selectedBranch}
        />
      )}

      {isBranchPickerOpen && (
        <BranchPickerModal
          isOpen={isBranchPickerOpen}
          onClose={() => setIsBranchPickerOpen(false)}
          locations={locations}
          selectedBranch={selectedBranch}
          onSelectBranch={setSelectedBranch}
        />
      )}

      {/* Video Lightbox Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <div className="p-4 bg-slate-900 flex items-center justify-between text-white border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider">Tech Dental Clinic Experience Tour</span>
              <button 
                type="button" 
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="aspect-video w-full bg-black flex items-center justify-center">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/lYah5-xEeck?autoplay=1"
                title="Tech Dental Experience"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Unified Global Footer (CTA strip hidden on About page to prevent duplicate CTA banner) */}
      <GlobalFooter hideCtaStrip={true} className="mt-0" />
    </div>
  );
}
