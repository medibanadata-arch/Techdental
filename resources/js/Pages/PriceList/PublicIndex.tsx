import React, { useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";
import { TopHeader } from "@/components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
import { PageProps } from '@inertiajs/core';

interface PriceRow {
  id: number;
  service_name: string;
  price_bdt: string;
  price_usd: string;
}

interface PriceCategory {
  id: number;
  name: string;
  rows: PriceRow[];
}

interface PriceSettings {
  id: number;
  page_title: string;
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
  categories: PriceCategory[];
  settings: PriceSettings;
  locations?: any[];
  nav_menu?: any;
}

export default function PriceListPublicIndex({ categories = [], settings, locations = [], nav_menu }: Props) {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [currency, setCurrency] = useState<'BDT' | 'USD'>('BDT');
  const [query, setQuery] = useState("");
  const [seoOpen, setSeoOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const safeFaqs = useMemo(() => {
    if (!settings?.faqs) return [];
    if (Array.isArray(settings.faqs)) return settings.faqs;
    try {
      const p = typeof settings.faqs === 'string' ? JSON.parse(settings.faqs) : settings.faqs;
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }, [settings?.faqs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories
      .map((cat) => {
        const rows = (cat.rows || []).filter((r) =>
          !q || (r.service_name || '').toLowerCase().includes(q)
        );
        return { cat, rows };
      })
      .filter(({ rows }) => rows.length > 0);
  }, [categories, query]);

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col justify-between w-full"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Head>
        <title>{settings?.seo_title || settings?.page_title || 'Tech Dental Treatment Price List in Bangladesh – 2026'}</title>
        {settings?.meta_desc && <meta name="description" content={settings.meta_desc} />}
        <link rel="canonical" href={settings?.canonical_url || (typeof window !== 'undefined' ? window.location.origin + '/price-list' : 'https://techdentalcare.com/price-list')} />
        <meta name="robots" content={`${settings?.robots_index !== false ? 'index' : 'noindex'}, ${settings?.robots_follow !== false ? 'follow' : 'nofollow'}`} />

        {settings?.schema_json && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: settings.schema_json }} />
        )}
        {safeFaqs.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": safeFaqs.map(faq => ({
                  "@type": "Question",
                  "name": faq.q,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                  }
                }))
              })
            }}
          />
        )}
      </Head>

      <TopHeader locations={locations} selectedBranch={selectedBranch} onBranchChange={setSelectedBranch} navMenu={nav_menu} />

      <main className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex-1 space-y-6 pt-4 pb-8 sm:pb-12">
        {/* Header & Intro */}
        <div className="text-center w-full pt-1 space-y-3">
          <h1 className="text-sm sm:text-lg font-bold tracking-tight" style={{ color: '#9c1c65' }}>
            {settings?.page_title || 'Tech Dental Treatment Price List in Bangladesh – 2026'}
          </h1>
        </div>

        {/* Top Controls: Currency Toggle & Search */}
        <div className="flex flex-row items-center justify-between gap-2 bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
          <div className="relative flex-1 min-w-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search treatments..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9c1c65] focus:bg-white transition"
            />
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setCurrency('BDT')}
              className={`px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg transition ${currency === 'BDT' ? 'bg-white text-[#9c1c65] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              BDT (৳)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg transition ${currency === 'USD' ? 'bg-white text-[#9c1c65] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              USD ($)
            </button>
          </div>
        </div>

        {/* Detailed Treatment Categories */}
        <div className="space-y-6 w-full">
          {filtered.map(({ cat, rows }) => (
            <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden w-full">
              <div
                className="text-white px-4 sm:px-6 py-3 font-bold text-xs sm:text-sm tracking-wide"
                style={{ background: 'linear-gradient(135deg, #9c1c65 0%, #b82b7c 100%)' }}
              >
                {cat.name}
              </div>
              <div>
                <table className="w-full text-left border-collapse text-[10px] sm:text-sm table-fixed">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[9px] sm:text-xs uppercase tracking-wider font-semibold">
                      <th className="py-3 px-3 sm:px-6 w-[62%] sm:w-[65%] border-r-2 border-slate-200">Treatment Name</th>
                      <th className={`py-3 px-2 sm:px-4 w-[38%] sm:w-[35%] whitespace-nowrap text-[9px] sm:text-sm ${currency === 'BDT' ? '' : 'hidden'}`}>
                        Price (BDT)
                      </th>
                      <th className={`py-3 px-2 sm:px-4 w-[38%] sm:w-[35%] whitespace-nowrap text-[9px] sm:text-sm ${currency === 'USD' ? '' : 'hidden'}`}>
                        Price (USD)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {rows.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition">
                        <td className="py-2.5 px-3 sm:px-6 font-medium text-slate-900 border-r-2 border-slate-200">{r.service_name}</td>
                        <td className={`py-2.5 px-2 sm:px-4 font-semibold whitespace-nowrap ${currency === 'BDT' ? '' : 'hidden'}`} style={{ color: '#9c1c65' }}>
                          {r.price_bdt}
                        </td>
                        <td className={`py-2.5 px-2 sm:px-4 font-semibold whitespace-nowrap ${currency === 'USD' ? '' : 'hidden'}`} style={{ color: '#9c1c65' }}>
                          {r.price_usd}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-400">No treatments found.</div>
          )}
        </div>

        {/* Additional Information SEO Accordion */}
        <div className="border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden mb-6 sm:mb-8">
          <button
            type="button"
            onClick={() => setSeoOpen(!seoOpen)}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left focus:outline-none cursor-pointer hover:bg-slate-50/70 transition-colors"
          >
            <span className="text-sm sm:text-[15px] text-slate-700 font-medium leading-none">
              {settings?.seo_title || 'More About Pricing & Warranty'}
            </span>
            <svg
              className={`w-4 h-4 text-slate-500 transform transition-transform duration-300 flex-shrink-0 ${seoOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {seoOpen && (
            <div className="border-t border-slate-100 px-5 py-5 text-slate-600 text-xs sm:text-sm leading-relaxed space-y-4 bg-white">
              <div
                className="rich-content-view wp-editor-content prose prose-slate max-w-none text-slate-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: settings?.seo_content || '' }}
              />

              {safeFaqs.length > 0 && (
                <div className="pt-4 mt-2 border-t border-slate-100">
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-3.5 bg-rose-700 rounded-full" />
                    Frequently Asked Questions (FAQ)
                  </h4>
                  <div className="space-y-2">
                    {safeFaqs.filter(f => f && f.q).map((faq, i) => {
                      const isFaqOpen = openFaqIndex === i;
                      return (
                        <div key={i} className="border border-slate-200/90 rounded-xl overflow-hidden bg-slate-50/60">
                          <button
                            type="button"
                            onClick={() => setOpenFaqIndex(isFaqOpen ? null : i)}
                            className="w-full p-2.5 sm:p-3 text-left font-bold text-xs text-slate-800 flex items-center justify-between hover:bg-slate-100/60 transition cursor-pointer select-none"
                          >
                            <span className="flex items-center gap-2 pr-2">
                              <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {i + 1}
                              </span>
                              <span className="text-slate-900">{faq.q}</span>
                            </span>
                            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isFaqOpen ? 'rotate-180 text-rose-700' : ''}`} />
                          </button>
                          {isFaqOpen && (
                            <div className="px-3.5 pb-3 pt-1 text-xs text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
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
      </main>

      <GlobalFooter />
    </div>
  );
}
