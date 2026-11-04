import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { TopHeader } from "@/components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
import { PageProps } from '@inertiajs/core';

interface BranchItem {
  id: number;
  name: string;
  short_name: string;
  slug: string;
  address: string;
  phone: string;
  hours_text: string;
  map_url: string;
}

interface Props extends PageProps {
  branches: BranchItem[];
  nav_menu?: any;
  locations?: any[];
}

export default function BranchPublicIndex({ branches = [], nav_menu, locations = [] }: Props) {
  const [selectedBranch, setSelectedBranch] = useState("mirpur");

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 antialiased pb-5 sm:pb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <TopHeader locations={locations.length ? locations : branches} selectedBranch={selectedBranch} onBranchChange={setSelectedBranch} navMenu={nav_menu} />

      <main className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((b) => (
            <Link
              key={b.id}
              href={`/branch/${b.slug || b.short_name || b.id}`}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-100 block"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-[#fdf2f5] flex items-center justify-center text-[#bd2b50] shadow-sm border border-[#fbe5eb]">
                  <i className="fa-solid fa-building text-2xl"></i>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">{b.short_name || b.name} Branch</h2>
              </div>
              <p className="text-slate-600 text-[15px] mb-4 flex items-start gap-2.5 max-w-2xl ml-1">
                <i className="fa-solid fa-location-dot text-xl text-[#d94669] mt-0.5"></i>
                <span className="leading-relaxed font-medium">{b.address}</span>
              </p>
              {b.hours_text && (
                <div className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[#bd2b50] shrink-0">
                    <i className="fa-solid fa-clock text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Opening Hours</p>
                    <p className="text-base font-bold text-slate-800">{b.hours_text}</p>
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}
