import React, { useState } from "react";
import { TopHeader } from "@/components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
import { PageProps } from '@inertiajs/core';

interface TeamMemberData {
  id: number;
  name: string;
  role: string;
  section: string;
  image: string;
  quote: string | null;
  letter: any;
}

interface Props extends PageProps {
  member: TeamMemberData;
  locations?: any[];
  nav_menu?: any;
}

/** Letter is stored as JSON (array of paragraphs) or as string */
const parseLetter = (letter: any): string[] => {
  if (!letter) return [];
  if (Array.isArray(letter)) {
    return letter.map((p: any) => (typeof p === 'string' ? p : p?.text || '')).filter(Boolean);
  }
  if (typeof letter === 'string') {
    try {
      const parsed = JSON.parse(letter);
      return Array.isArray(parsed) ? parsed.map((p: any) => (typeof p === 'string' ? p : p?.text || '')) : [];
    } catch {
      return letter.split('\n\n').filter(Boolean);
    }
  }
  return [];
};

const PAGES_BG = '#FAF8F5';

export default function TeamPublicSingle({ member, locations = [], nav_menu }: Props) {
  const [selectedBranch, setSelectedBranch] = useState("mirpur");

  if (!member) return null;

  const isCeoMessage = member.section === 'management' || parseLetter(member.letter).length > 0;
  const paragraphs = parseLetter(member.letter);

  return (
    <div
      className="antialiased text-[#2C2A29] min-h-screen flex flex-col w-full"
      style={{ fontFamily: "'Inter', sans-serif", backgroundColor: PAGES_BG }}
    >
      <TopHeader locations={locations} selectedBranch={selectedBranch} onBranchChange={setSelectedBranch} navMenu={nav_menu} />

      {isCeoMessage && (
        <>
          {/* Full Width Top Maroon Section */}
          <div className="w-full px-6 sm:px-16 md:px-24 pt-10 pb-28 relative flex flex-col items-center" style={{ backgroundColor: '#4A121A' }}>
            <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

              {/* CEO Photo with Gold Border Frame */}
              <div className="md:col-span-4 flex justify-start">
                <div className="relative p-3 rounded-sm bg-white/5 shadow-2xl" style={{ border: '1px solid rgba(197,160,89,0.8)' }}>
                  <div className="w-44 h-44 sm:w-52 sm:h-52 overflow-hidden bg-white rounded-sm shadow-inner">
                    <img src={member.image} alt={`${member.name} - ${member.role}`} className="w-full h-full object-cover object-top" />
                  </div>
                </div>
              </div>

              {/* Title & Quote Section */}
              <div className="md:col-span-8 flex flex-col justify-center pt-2">
                <p className="tracking-[0.2em] uppercase text-xs sm:text-sm mb-2" style={{ color: '#C5A059' }}>Tech Dental</p>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  A Message From Our CEO
                </h1>

                {/* Quote with Gold Left Border */}
                {member.quote && (
                  <div className="pl-6 border-l-2 my-2" style={{ borderColor: '#C5A059' }}>
                    <p className="text-white/90 italic text-lg sm:text-xl leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {member.quote}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Main White Card Container Overlapping the Maroon Header */}
          <div className="w-full max-w-6xl bg-white text-[#2C2A29] rounded-t-3xl shadow-2xl mx-auto -mt-16 sm:-mt-20 px-6 sm:px-12 md:px-16 pt-10 pb-12 relative flex flex-col items-start z-10 mb-0">

            {/* Letter Body Content */}
            <div className="w-full text-[#555555] font-light leading-relaxed space-y-5 text-base sm:text-lg">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Signature Block */}
            <div className="mt-8 pt-6 border-t border-gray-200 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <p className="text-xl font-bold text-[#2C2A29]" style={{ fontFamily: "'Playfair Display', serif" }}>{member.name}</p>
                <p className="text-xs sm:text-sm text-gray-500 font-medium tracking-wider uppercase mt-1">{member.role}</p>
              </div>
            </div>

          </div>
        </>
      )}

      <GlobalFooter hideCtaStrip={true} />
    </div>
  );
}
