import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { TopHeader } from "@/components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
import { PageProps } from '@inertiajs/core';

interface Member {
  id: number;
  name: string;
  role: string;
  section: string;
  image: string;
  quote: string | null;
}

interface Props extends PageProps {
  members: Member[];
  locations?: any[];
  nav_menu?: any;
}

const SectionHeading: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h2 className={`text-lg md:text-2xl font-semibold text-[#8B0000] text-center mb-8 ${className || ''}`}>{children}</h2>
);

export default function TeamPublicIndex({ members = [], locations = [], nav_menu }: Props) {
  const [selectedBranch, setSelectedBranch] = useState("mirpur");

  const management = members.filter((m) => m.section === 'management');
  const ceoAssistant = members.filter((m) => m.section === 'ceo_assistant');
  const digital = members.filter((m) => m.section === 'digital_marketing');
  const callCenter = members.filter((m) => m.section === 'call_center');

  const slugFor = (name: string) => (name || '').toLowerCase().replace(/[.']/g, '').replace(/\s+/g, '-');

  return (
    <div className="min-h-screen font-sans text-gray-800 antialiased pb-5 sm:pb-6 w-full bg-slate-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <TopHeader locations={locations} selectedBranch={selectedBranch} onBranchChange={setSelectedBranch} navMenu={nav_menu} />

      {/* 1. Management Team Section */}
      <section className="mb-12 w-full">
        <div className="w-full bg-[#8B0000] text-white text-center py-6 shadow-sm mb-10">
          <h2 className="text-xl md:text-3xl tracking-wider font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Meet Our Management Team</h2>
        </div>

        <div className="w-full px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 justify-center">
          {management.map((m) => (
            <div key={m.id} className="w-full max-w-sm mx-auto bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 transform hover:-translate-y-1 hover:shadow-lg transition duration-300 flex flex-col group h-fit">
              <div className="w-full aspect-square mb-4 bg-slate-50 rounded-xl overflow-hidden">
                <img src={m.image} alt={m.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500" />
              </div>
              <div className="text-center">
                <h3 className="text-sm md:text-xl font-semibold text-gray-800">{m.name}</h3>
                <p className="text-[10px] md:text-sm font-bold text-[#8B0000] uppercase mt-1">{m.role}</p>
              </div>
              {/* See Details Link */}
              <div className="w-full mt-4 flex justify-end">
                <Link href={`/team/${slugFor(m.name)}`} className="text-[10px] md:text-xs font-semibold text-[#8B0000] hover:underline flex items-center gap-1 transition-colors hover:text-[#9b2242]">
                  See Details <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. CEO Assistant Section */}
      <section className="mb-12 w-full mt-16 px-4 md:px-8">
        <SectionHeading>CEO Assistant</SectionHeading>
        <div className="flex justify-center w-full">
          {ceoAssistant.map((m) => (
            <div key={m.id} className="w-1/2 md:w-full max-w-[280px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transform hover:-translate-y-1 hover:shadow-lg transition duration-300 flex flex-col items-center text-center group">
              <div className="w-full aspect-square mb-3 p-2 bg-slate-50 rounded-xl overflow-hidden">
                <img src={m.image} alt={m.name} className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition duration-500" />
              </div>
              <h4 className="text-sm md:text-lg font-semibold text-gray-800">{m.name}</h4>
              <p className="text-[10px] md:text-xs font-bold text-[#8B0000] uppercase mt-1">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Digital Marketing Team Section */}
      <section className="mb-12 w-full mt-16 px-4 md:px-8">
        <SectionHeading>Digital Marketing Team</SectionHeading>

        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {digital.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transform hover:-translate-y-1 hover:shadow-lg transition duration-300 flex flex-col items-center text-center group">
              <div className="w-full aspect-square mb-3 p-2 bg-slate-50 rounded-xl overflow-hidden">
                <img src={m.image} alt={m.name} className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition duration-500" />
              </div>
              <h4 className="text-sm md:text-base font-semibold text-gray-800">{m.name}</h4>
              <p className="text-[10px] md:text-xs font-bold text-[#8B0000] uppercase mt-1">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Call Center Team Section */}
      <section className="mb-12 w-full mt-16 px-4 md:px-8">
        <SectionHeading>Call Center Team</SectionHeading>

        <div className="w-full grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          {callCenter.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transform hover:-translate-y-1 hover:shadow-lg transition duration-300 flex flex-col items-center text-center group">
              <div className="w-full aspect-square mb-3 p-2 bg-slate-50 rounded-xl overflow-hidden">
                <img src={m.image} alt={m.name} className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition duration-500" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">{m.name}</h4>
              <p className="text-[10px] font-bold text-[#8B0000] uppercase mt-1">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      <GlobalFooter />
    </div>
  );
}
