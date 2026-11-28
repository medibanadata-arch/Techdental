import React, { useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";
import { TopHeader } from "@/components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
import Seo from "@/Components/Seo";
import { SPECIAL_OFFERS_BN, SPECIAL_OFFERS_COPY } from "@/data/specialOffersBn";
import { PATIENT_REVIEWS, REVIEWS_COPY } from "@/data/patientReviews";
import type { PageProps } from '@inertiajs/core';

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
  is_bn?: boolean;
  offers?: typeof SPECIAL_OFFERS_BN;
}

export default function PriceListPublicIndex({
  categories = [],
  settings,
  locations = [],
  nav_menu,
  is_bn = false,
  offers = [],
}: Props) {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [currency, setCurrency] = useState<'BDT' | 'USD'>('BDT');
  const [query, setQuery] = useState("");
  const [seoOpen, setSeoOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const R = REVIEWS_COPY[is_bn ? 'bn' : 'en'];
  const O = SPECIAL_OFFERS_COPY;

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

  const priceSchemas: any[] = [];
  if (settings?.schema_json) {
    try {
      priceSchemas.push(JSON.parse(settings.schema_json));
    } catch {
      /* ignore invalid custom schema */
    }
  }
  if (safeFaqs.length > 0) {
    priceSchemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: safeFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    });
  }

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col justify-between w-full"
      style={{ fontFamily: "'Times New Roman', Times, 'SolaimanLipi', 'Noto Sans Bengali', 'Hind Siliguri', serif" }}
    >
      <Seo
        title={settings?.seo_title || settings?.page_title || 'Tech Dental Treatment Price List in Bangladesh – 2026'}
        description={settings?.meta_desc || settings?.seo_content || 'Updated treatment prices for dental implants, braces, root canal, crowns and more at Tech Dental Care in Dhaka.'}
        path={is_bn ? '/bn/tech-dental-treatment-price-list-bn' : '/tech-dental-treatment-price-list-bangladesh'}
        robots={`${settings?.robots_index !== false ? 'index' : 'noindex'}, ${settings?.robots_follow !== false ? 'follow' : 'nofollow'}`}
        schema={priceSchemas}
        noSuffix
      />

      <TopHeader locations={locations} selectedBranch={selectedBranch} onBranchChange={setSelectedBranch} navMenu={nav_menu} />

      <main className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex-1 space-y-6 pt-4 pb-8 sm:pb-12">
        {/* Header & Intro */}
        <div className="text-center w-full pt-1 space-y-3">
          <h1 className="text-sm sm:text-lg font-bold tracking-tight" style={{ color: '#9c1c65' }}>
            {settings?.page_title || 'Tech Dental Treatment Price List in Bangladesh – 2026'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl mx-auto leading-relaxed">
            {is_bn
              ? "বাংলাদেশে ডেন্টাল চিকিৎসার এই মূল্য তালিকায় ১০০টিরও বেশি চিকিৎসার খরচ টাকা (BDT) দেওয়া হয়েছে।"
              : "This Dental Treatment Price List in Bangladesh covers over 100+ treatments in BDT and USD."}
          </p>
        </div>

        {/* Bangla Special Offer packages (from the old /bn/special-offer/ page) */}
        {offers.length > 0 && (
          <section className="space-y-4">
            <div className="text-center space-y-1">
              <h2 className="text-xl sm:text-2xl font-extrabold" style={{ color: '#9c1c65' }}>
                {O.heading}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">{O.intro}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {offers.map((offer) => (
                <article
                  key={offer.title}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
                >
                  <div
                    className="p-4 sm:p-5 text-white"
                    style={{ background: 'linear-gradient(135deg, #9c1c65 0%, #b82b7c 100%)' }}
                  >
                    <span className="text-[10px] uppercase tracking-widest text-rose-100 font-bold">
                      {offer.eyebrow}
                    </span>
                    <h3 className="text-lg font-extrabold mt-1 leading-snug">{offer.title}</h3>
                    <div className="flex items-end gap-2 mt-2">
                      <span className="text-2xl font-black leading-none">{offer.price}</span>
                      <span className="text-xs line-through opacity-80">{offer.oldPrice}</span>
                    </div>
                    <span className="inline-block mt-2 rounded-full bg-white/15 border border-white/25 px-2.5 py-0.5 text-[10px] font-bold">
                      {offer.discount}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col gap-4">
                    <ul className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
                      {offer.benefits.map((benefit) => (
                        <li key={benefit} className="flex gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <details className="group border-t border-slate-100 pt-3">
                      <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-bold text-[#9c1c65]">
                        {O.details}
                        <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="mt-2 space-y-2.5 text-xs text-slate-600 leading-relaxed">
                        {offer.details.map((detail) => (
                          <div key={detail.heading}>
                            <h4 className="font-bold text-slate-800">{detail.heading}</h4>
                            <p>{detail.body}</p>
                          </div>
                        ))}
                      </div>
                    </details>

                    <div className="mt-auto flex gap-2 pt-1">
                      <a
                        href="tel:09638000505"
                        className="flex-1 rounded-lg bg-slate-100 px-2 py-2 text-center text-[11px] font-bold text-slate-700 transition hover:bg-slate-200"
                      >
                        {O.call}
                      </a>
                      <a
                        href={`https://wa.me/8809638000505?text=${encodeURIComponent(offer.title)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 rounded-lg bg-emerald-600 px-2 py-2 text-center text-[11px] font-bold text-white transition hover:bg-emerald-700"
                      >
                        {O.whatsapp}
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

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
          <h2 className="m-0">
            <button
              type="button"
              onClick={() => setSeoOpen(!seoOpen)}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left focus:outline-none cursor-pointer hover:bg-slate-50/70 transition-colors"
            >
              <span className="text-sm sm:text-[15px] text-slate-700 font-medium leading-none">
                {is_bn
                  ? 'ঢাকায় ডেন্টাল চিকিৎসার খরচ — সম্পূর্ণ খরচ গাইড'
                  : 'Dental Treatment Costs in Dhaka — Full Cost Guide'}
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
          </h2>
          <div
            hidden={!seoOpen}
            className="border-t border-slate-100 px-5 py-5 text-slate-600 text-xs sm:text-sm leading-relaxed space-y-4 bg-white"
          >
              <div
                className="more-about-content rich-content-view wp-editor-content prose prose-slate max-w-none text-slate-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: settings?.seo_content || '' }}
              />

              {safeFaqs.length > 0 && (
                <div className="pt-4 mt-2 border-t border-slate-100">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-3.5 bg-rose-700 rounded-full" />
                    {is_bn ? 'সচরাচর জিজ্ঞাসা (FAQ)' : 'Frequently Asked Questions (FAQ)'}
                  </h3>
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
                          <div
                            hidden={!isFaqOpen}
                            className="px-3.5 pb-3 pt-1 text-xs text-slate-600 bg-white border-t border-slate-100 leading-relaxed [&_a]:text-rose-700 [&_a]:font-semibold [&_a]:underline [&_p]:mt-1.5 [&_p:first-child]:mt-0"
                            dangerouslySetInnerHTML={{ __html: faq.a }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
        </div>
        {/* Patient Google reviews (kept from the old special-offer page) */}
        <section className="w-full">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#9c1c65]">{R.eyebrow}</span>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">{R.heading}</h2>
                <p className="text-xs text-slate-500 mt-1">{R.intro}</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 shrink-0">
                <span className="text-xl font-black text-slate-900">{R.rating}</span>
                <div>
                  <div className="text-amber-500 text-[11px] tracking-widest">★★★★★</div>
                  <div className="text-[10px] text-slate-500">{R.count}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {PATIENT_REVIEWS.map((rev) => (
                <article key={rev.name} className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${rev.tone}`}>
                      {rev.name.replace(/[^A-Za-z\u0980-\u09FF\s.]/g, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('')}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-slate-800 truncate">{rev.name}</div>
                      <div className="text-amber-500 text-[9px] tracking-widest">★★★★★</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{rev.text}</p>
                  {rev.reply && (
                    <div className="mt-auto border-l-2 border-pink-200 bg-white rounded-r-lg px-2.5 py-1.5">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-[#9c1c65]">{R.owner}</div>
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">{rev.reply}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 rounded-xl bg-[#9c1c65] px-4 py-3">
              <p className="text-[11px] sm:text-xs font-semibold text-rose-50 text-center sm:text-left">{R.cta}</p>
              <Link
                href="/book-an-appointment"
                className="shrink-0 rounded-lg bg-white px-3.5 py-1.5 text-[11px] font-bold text-[#9c1c65] hover:bg-rose-50 transition"
              >
                {R.book}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
}
