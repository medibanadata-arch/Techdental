import React, { useState, useMemo } from "react";
import { Link } from "@inertiajs/react";
import { Search, X } from "lucide-react";
import { TopHeader } from "@/components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
import { PageProps } from '@inertiajs/core';
import { useLanguage } from "@/utils/useLanguage";

interface MedicineItem {
  id: number;
  slug: string;
  name: string;
  name_bn?: string;
  generic: string;
  generic_bn?: string;
  category: string;
  tag: string;
  tag_bn?: string;
  image: string;
  quick_use: string;
  quick_use_bn?: string;
  pharma: string;
  pharma_bn?: string;
  dosage: string;
  dosage_bn?: string;
  dental_usage: string;
  dental_usage_bn?: string;
  uses_text: string;
  uses_text_bn?: string;
  side_effects: string;
  side_effects_bn?: string;
}

interface Props extends PageProps {
  medicines: MedicineItem[];
  locations?: any[];
  nav_menu?: any;
}

const CATEGORY_LABELS_EN: Record<string, string> = {
  all: 'All Medicines',
  pain: 'Pain Relief',
  antibiotic: 'Antibiotics',
  gastric: 'Gastric Care',
  dental_special: 'Dental Special',
  supplement: 'Supplements',
  allergy: 'Allergy',
};

const CATEGORY_LABELS_BN: Record<string, string> = {
  all: 'সকল ঔষধ',
  pain: 'ব্যথানাশক',
  antibiotic: 'অ্যান্টিবায়োটিক',
  gastric: 'গ্যাস্ট্রিক কেয়ার',
  dental_special: 'ডেন্টাল স্পেশাল',
  supplement: 'সাপ্লিমেন্ট',
  allergy: 'অ্যালার্জি',
};

export default function MedicinesPublicIndex({
  medicines = [],
  locations = [],
  nav_menu,
}: Props) {
  const [selectedBranch, setSelectedBranch] = useState("mirpur");
  const [activeCat, setActiveCat] = useState("all");
  const [query, setQuery] = useState("");
  const [modalItem, setModalItem] = useState<MedicineItem | null>(null);
  const { isBn } = useLanguage();

  const categories = useMemo(() => {
    const counts: Record<string, number> = { all: medicines.length };
    medicines.forEach((m) => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    const labelMap = isBn ? CATEGORY_LABELS_BN : CATEGORY_LABELS_EN;
    return Object.keys(labelMap)
      .filter((key) => key === 'all' || counts[key])
      .map((key) => ({
        key,
        label: labelMap[key] || CATEGORY_LABELS_EN[key] || key,
        count: counts[key] || 0,
      }));
  }, [medicines, isBn]);

  const filtered = useMemo(() => {
    return medicines.filter((m) => {
      const matchCat = activeCat === 'all' || m.category === activeCat;
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        (m.name || '').toLowerCase().includes(q) ||
        (m.name_bn || '').toLowerCase().includes(q) ||
        (m.generic || '').toLowerCase().includes(q) ||
        (m.generic_bn || '').toLowerCase().includes(q) ||
        (m.pharma || '').toLowerCase().includes(q) ||
        (m.pharma_bn || '').toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [medicines, activeCat, query]);

  return (
    <div className="min-h-screen antialiased text-gray-800 bg-[#f8fafc]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <TopHeader
        locations={locations}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        navMenu={nav_menu}
        showBranchPicker={false}
        showLanguageSwitcher={true}
      />

      {/* Page Header (Exact same design as Dental Blog) */}
      <header className="bg-white shadow-sm border-b border-gray-100 py-10 mb-10">
        <div className="w-full px-4 sm:px-8 lg:px-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            {isBn ? "ঔষধ ও প্রেসক্রিপশন নির্দেশিকা" : "Medicines & Pharmacy Guides"}
          </h1>

          {/* Breadcrumbs */}
          <nav className="flex justify-center text-sm font-medium text-[#db2777]" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link href="/" className="hover:text-[#9d174d] transition-colors">
                  {isBn ? "হোম" : "Home"}
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <i className="fa-solid fa-angle-right text-gray-400 mx-2 text-xs" />
                  <span className="text-[#db2777] cursor-default">
                    {isBn ? "ঔষধ ও মেডিসিন" : "Medicines"}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </header>

      <main className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pb-20">
        {/* Medicine Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5">
          {medicines.map((item) => {
            const displayName = (isBn && item.name_bn) ? item.name_bn : item.name;
            const displayGeneric = (isBn && item.generic_bn) ? item.generic_bn : item.generic;
            const displayTag = (isBn && item.tag_bn) ? item.tag_bn : item.tag;
            const displayQuickUse = (isBn && item.quick_use_bn) ? item.quick_use_bn : item.quick_use;
            const displayPharma = (isBn && item.pharma_bn) ? item.pharma_bn : (item.pharma || '').split(' ')[0];

            return (
              <Link
                key={item.id}
                href={`/medicines/${item.slug}`}
                className="card-hover cursor-pointer bg-white rounded-xl overflow-hidden border border-slate-200/70 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group"
              >
                <div>
                  {/* Image Box */}
                  <div className="w-full h-36 bg-slate-100 overflow-hidden relative border-b border-slate-100">
                    <img
                      src={item.image}
                      alt={displayName}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e: any) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/600x400/f1f5f9/64748b?text=Medicine+Image'; }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-400 font-mono text-[10px]">
                        {displayPharma}
                      </span>
                      {displayTag && (
                        <span className="text-[10px] font-semibold tracking-wide uppercase text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md">
                          {displayTag}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-800 tracking-tight leading-snug group-hover:text-cyan-700 transition">
                      {displayName}
                    </h3>
                    <p className="text-xs text-cyan-700 font-medium mt-0.5 mb-2 truncate">
                      {displayGeneric}
                    </p>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {displayQuickUse}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {medicines.length === 0 && (
          <div className="py-20 text-center text-sm text-gray-400">
            {isBn ? "কোনো ঔষধ পাওয়া যায়নি।" : "No medicines published yet."}
          </div>
        )}
      </main>

      {/* Clean Detail Modal */}
      {modalItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setModalItem(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
              <div>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md inline-block mb-1.5">
                  {modalItem.tag}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{modalItem.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{modalItem.generic}</p>
              </div>
              <button
                onClick={() => setModalItem(null)}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs text-slate-600 max-h-[65vh] overflow-y-auto">
              <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80">
                <img src={modalItem.image} alt="Medicine Photo" className="w-full h-full object-cover" />
              </div>

              <div>
                <span className="font-semibold text-slate-900 block mb-1">Key Indications:</span>
                <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed text-slate-700">{modalItem.uses_text}</p>
              </div>

              <div className="bg-cyan-50/70 border border-cyan-100/80 p-3 rounded-xl">
                <span className="font-semibold text-cyan-900 block mb-1 flex items-center gap-1.5">
                  <i className="fa-solid fa-tooth text-cyan-600" /> Dental Significance:
                </span>
                <p className="text-cyan-950 leading-relaxed">{modalItem.dental_usage}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-900 block mb-1">Standard Dosage:</span>
                  <p className="text-slate-700 leading-relaxed">{modalItem.dosage}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-900 block mb-1">Manufacturer:</span>
                  <p className="text-slate-700 leading-relaxed">{modalItem.pharma}</p>
                </div>
              </div>

              <div className="p-3 bg-rose-50/60 border border-rose-100 rounded-xl">
                <span className="font-semibold text-rose-900 block mb-1">Cautions / Side Effects:</span>
                <p className="text-rose-900 leading-relaxed">{modalItem.side_effects}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Prescription reference only</span>
              <Link
                href={`/medicines/${modalItem.slug}`}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition"
              >
                Full Details
              </Link>
            </div>
          </div>
        </div>
      )}

      <GlobalFooter />
    </div>
  );
}
