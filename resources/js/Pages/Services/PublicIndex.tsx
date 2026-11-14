import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { TopHeader } from "@/components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
import Seo from "@/Components/Seo";
import { PageProps } from '@inertiajs/core';
import { getWebsiteTexts } from '@/data/websiteTexts';

interface ServiceItem {
  id: number;
  slug: string;
  slug_bn?: string;
  title: string;
  title_bn?: string;
  category?: string;
  price: string;
  price_suffix: string;
  short_desc: string;
  hero_main: string;
}

interface Props extends PageProps {
  services: ServiceItem[];
  categories?: string[];
  locations?: any[];
  nav_menu?: any;
  is_bn?: boolean;
}

export default function ServicesPublicIndex({ services = [], locations = [], nav_menu, is_bn = false }: Props) {
  const [selectedBranch, setSelectedBranch] = useState("");
  const isBn = Boolean(is_bn);
  const page = usePage();
  const siteUrl = String((page.props as any)?.site_url || 'https://techdentalcare.com').replace(/\/+$/, '');
  const copy = getWebsiteTexts((page.props as any)?.site_settings?.website_texts);

  const title = isBn ? copy.services_seo_title_bn : copy.services_seo_title;
  const description = isBn ? copy.services_seo_desc_bn : copy.services_seo_desc;

  const serviceLink = (s: ServiceItem) =>
    isBn ? `/bn/service/${s.slug_bn || s.slug}` : `/service/${s.slug}`;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased overflow-x-clip w-full font-sans">
      <Seo
        title={title}
        description={description}
        path={isBn ? '/bn/services' : '/services'}
        alternates={{
          en: `${siteUrl}/services`,
          bn: `${siteUrl}/bn/services`,
          'x-default': `${siteUrl}/services`,
        }}
        noSuffix={isBn}
        schema={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": title,
          "itemListElement": services.map((s, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": isBn ? (s.title_bn || s.title) : s.title,
            "url": `${siteUrl}${serviceLink(s)}`,
          })),
        }}
      />

      {/* 1. Header with Brand & Synchronized Branch Selector & Navigation Drawer */}
      <TopHeader
        locations={locations}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        navMenu={nav_menu}
        showLanguageSwitcher={true}
      />

      {/* Top Header Bar */}
      <header className="bg-[#8f163b] text-white w-full py-4 shadow-md">
        <div className="w-full px-4 md:px-8 flex justify-center items-center">
          <h1 className="text-xl md:text-2xl font-bold tracking-wide uppercase">
            {isBn ? copy.services_h1_bn : copy.services_h1}
          </h1>
        </div>
      </header>

      {/* Main Content (Full Width Layout matching Document 2) */}
      <main className="w-full pb-10 pt-8">
        {/* Grid Container: Set grid-cols-2 for mobile view, lg:3, xl:4 */}
        <div className="w-full px-3 md:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
          {services.map((s) => (
            <Link
              key={s.id}
              href={serviceLink(s)}
              className="service-card bg-white rounded-xl shadow-xs border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
            >
              <div className="card-img-wrapper h-32 sm:h-48 md:h-56 w-full relative bg-gray-100 overflow-hidden">
                <img
                  src={s.hero_main || "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800"}
                  alt={isBn ? (s.title_bn || s.title) : s.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800";
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                />
              </div>
              <div className="p-3 md:p-6 flex flex-col flex-grow">
                <span className="text-[#8f163b] font-bold text-xs md:text-sm mb-1 md:mb-2 block">
                  {s.price || "৳ 1,000.00"}
                </span>
                <h2 className="text-gray-900 font-semibold text-sm md:text-lg leading-snug group-hover:text-[#8f163b] transition-colors">
                  {isBn ? (s.title_bn || s.title) : s.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <GlobalFooter hideCtaStrip={true} />
    </div>
  );
}
