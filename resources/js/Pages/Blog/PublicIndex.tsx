import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { TopHeader } from "@/components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
import Seo from "@/Components/Seo";
import { PageProps } from '@inertiajs/core';
import { useLanguage } from "@/utils/useLanguage";
import { getWebsiteTexts } from '@/data/websiteTexts';

interface PostItem {
  id: number;
  slug: string;
  title: string;
  title_bn?: string;
  excerpt: string;
  excerpt_bn?: string;
  img: string;
  category: string;
  category_bn?: string;
  published_at: string;
}

interface Props extends PageProps {
  posts: PostItem[];
  locations?: any[];
  nav_menu?: any;
  page_title?: string;
  page_subtitle?: string;
  page_title_bn?: string;
  page_subtitle_bn?: string;
  is_bn?: boolean;
}

const formatDate = (d?: string, isBn = false) => {
  if (!d) return '';
  try {
    const formatted = new Date(d).toLocaleDateString(isBn ? 'bn-BD' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return formatted;
  } catch {
    return d;
  }
};

export default function BlogPublicIndex({ posts = [], locations = [], nav_menu, page_title, page_subtitle, page_title_bn, page_subtitle_bn, is_bn = false }: Props) {
  const [selectedBranch, setSelectedBranch] = useState("mirpur");
  const { language, isBn } = useLanguage();
  const page = usePage();
  const siteUrl = String((page.props as any)?.site_url || 'https://techdentalcare.com').replace(/\/+$/, '');
  const copy = getWebsiteTexts((page.props as any)?.site_settings?.website_texts);
  const currentPath = (page.url || '/blog').split('?')[0];
  const isOthers = /\/blog\/others\/?$/.test(currentPath);
  const isBnPage = Boolean(is_bn) || currentPath.startsWith('/bn/');

  const seoTitle = isOthers
    ? (isBnPage
        ? 'ডেন্টাল কেস স্টাডি, ক্লিনিক আপডেট ও রোগীর গাইড (২০২৬)'
        : 'Dental Case Studies, Clinic Updates & Patient Guides (2026)')
    : (isBnPage
        ? 'ডেন্টাল ব্লগ ও মুখের স্বাস্থ্য গাইড (২০২৬) | টেক ডেন্টাল'
        : 'Dental Blog & Oral Health Guides in Dhaka (2026)');
  const seoDescription = isOthers
    ? (isBnPage
        ? 'টেক ডেন্টাল কেয়ারের ডেন্টাল কেস স্টাডি, চিকিৎসা রিপোর্ট, ক্লিনিক আপডেট ও রোগীর নির্দেশিকা—ঢাকার ডেন্টিস্টদের অভিজ্ঞতা থেকে লেখা।'
        : 'Real dental case studies, treatment reports, clinic updates and patient guides from the dentists at Tech Dental Care in Mirpur, Uttara, Badda and Jatrabari, Dhaka.')
    : (isBnPage
        ? 'দাঁত ব্যথা, রুট ক্যানেল, ইমপ্লান্ট, ব্রেসেস, মাড়ির রোগ ও মুখের স্বাস্থ্য নিয়ে ঢাকার বিশেষজ্ঞ ডেন্টিস্টদের লেখা নির্ভরযোগ্য বাংলা নিবন্ধ ও চিকিৎসা গাইড পড়ুন।'
        : 'Expert dental articles from the BDS dentists at Tech Dental Care, Dhaka — tooth pain relief, root canal, implants, braces, gum disease and daily oral hygiene guides.');

  const enPath = isOthers ? '/blog/others' : '/blog';
  const bnPath = isOthers ? '/bn/blog/others' : '/bn/blog';

  const hasEn = (p: any) => Boolean((p.content || '').trim());
  const hasBn = (p: any) => Boolean((p.content_bn || '').trim());
  const readablePosts = posts.filter((p) => (isBnPage ? hasBn(p) || hasEn(p) : hasEn(p)));

  const activePosts = readablePosts.filter((p) => (isBnPage ? hasBn(p) : hasEn(p)));

  return (
    <div className="min-h-screen antialiased text-gray-800 bg-[#f8fafc]" style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', 'SolaimanLipi', 'Noto Sans Bengali', sans-serif" }}>
      <Seo
        title={seoTitle}
        description={seoDescription}
        path={isBnPage ? bnPath : enPath}
        alternates={{ en: `${siteUrl}${enPath}`, bn: `${siteUrl}${bnPath}`, 'x-default': `${siteUrl}${enPath}` }}
        noSuffix={isBnPage}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: seoTitle,
          itemListElement: activePosts.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: isBnPage ? (p.title_bn || p.title) : p.title,
            url: `${siteUrl}${isBnPage ? '/bn/blog/' : '/blog/'}${p.slug}`,
          })),
        }}
      />

      <TopHeader
        locations={locations}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        navMenu={nav_menu}
        showBranchPicker={false}
        showLanguageSwitcher={true}
        showBookButton={false}
      />

      {/* Page Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 py-10 mb-10">
        <div className="w-full px-4 sm:px-8 lg:px-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            {isBnPage
              ? (page_title_bn || (page_title ? page_title : copy.blog_h1_bn))
              : (page_title || copy.blog_h1)}
          </h1>
          {(isBnPage ? page_subtitle_bn : page_subtitle) && (
            <p className="text-sm text-gray-500 max-w-2xl mx-auto mb-3">
              {isBnPage ? page_subtitle_bn : page_subtitle}
            </p>
          )}

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
                    {isBn ? "ব্লগ" : "Blog"}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
          {readablePosts.map((p) => {
            const postHasBangla = hasBn(p);
            const activeTitle = isBnPage ? (p.title_bn || p.title) : p.title;
            const activeExcerpt = isBnPage ? (p.excerpt_bn || p.excerpt) : p.excerpt;
            const cardHref = isBnPage
              ? (postHasBangla ? `/bn/blog/${p.slug}` : `/blog/${p.slug}`)
              : `/blog/${p.slug}`;

            return (
              <article
                key={p.id}
                className="bg-white rounded-md shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden flex flex-col group transition-all duration-300"
              >
                <Link href={cardHref} className="flex flex-col h-full focus:outline-none">
                  <div className="relative aspect-[16/9] overflow-hidden bg-gray-200">
                    <img
                      src={p.img}
                      alt={activeTitle}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h2 className="text-[17px] font-bold text-[#be185d] mb-3 leading-snug group-hover:text-[#ec4899] transition-colors">
                      {activeTitle}
                    </h2>
                    <p className="text-gray-500 text-[13px] line-clamp-3 leading-relaxed">
                      {activeExcerpt}
                    </p>
                  </div>
                  <div className="px-5 py-3 border-t border-gray-100 flex justify-between items-center mt-auto">
                    <time className="text-[11px] text-gray-400 font-light">{formatDate(p.published_at, isBnPage)}</time>
                    <i className="fa-solid fa-arrow-right-long text-[#db2777] text-[12px] group-hover:translate-x-1 group-hover:text-[#ec4899] transition-all duration-300" />
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {readablePosts.length === 0 && (
          <div className="py-20 text-center text-sm text-gray-400">
            {isBn ? "কোনো ব্লগ পোস্ট পাওয়া যায়নি।" : "No blog posts published yet."}
          </div>
        )}
      </main>

      <GlobalFooter />
    </div>
  );
}
