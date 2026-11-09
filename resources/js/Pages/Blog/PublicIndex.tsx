import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { TopHeader } from "@/components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
import { PageProps } from '@inertiajs/core';
import { useLanguage } from "@/utils/useLanguage";

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

export default function BlogPublicIndex({ posts = [], locations = [], nav_menu }: Props) {
  const [selectedBranch, setSelectedBranch] = useState("mirpur");
  const { language, isBn } = useLanguage();

  return (
    <div className="min-h-screen antialiased text-gray-800 bg-[#f8fafc]" style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', 'SolaimanLipi', 'Noto Sans Bengali', sans-serif" }}>
      <TopHeader
        locations={locations}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        navMenu={nav_menu}
        showBranchPicker={false}
        showLanguageSwitcher={true}
      />

      {/* Page Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 py-10 mb-10">
        <div className="w-full px-4 sm:px-8 lg:px-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            {isBn ? "ডেন্টাল ব্লগ ও নির্দেশিকা" : "Dental Blog & Guides"}
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
          {posts.map((p) => {
            const activeTitle = isBn && p.title_bn ? p.title_bn : p.title;
            const activeExcerpt = isBn && p.excerpt_bn ? p.excerpt_bn : p.excerpt;

            return (
              <article
                key={p.id}
                className="bg-white rounded-md shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden flex flex-col group transition-all duration-300"
              >
                <Link href={`/blog/${p.slug}`} className="flex flex-col h-full focus:outline-none">
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
                    <time className="text-[11px] text-gray-400 font-light">{formatDate(p.published_at, isBn)}</time>
                    <i className="fa-solid fa-arrow-right-long text-[#db2777] text-[12px] group-hover:translate-x-1 group-hover:text-[#ec4899] transition-all duration-300" />
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {posts.length === 0 && (
          <div className="py-20 text-center text-sm text-gray-400">
            {isBn ? "কোনো ব্লগ পোস্ট পাওয়া যায়নি।" : "No blog posts published yet."}
          </div>
        )}
      </main>

      <GlobalFooter />
    </div>
  );
}
