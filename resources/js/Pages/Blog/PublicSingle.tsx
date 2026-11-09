import React, { useState, useMemo, useEffect } from "react";
import { Link, Head } from "@inertiajs/react";
import { TopHeader } from "@/components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
import { PageProps } from '@inertiajs/core';
import { useLanguage } from "@/utils/useLanguage";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FaqItem {
  q: string;
  q_bn?: string;
  a: string;
  a_bn?: string;
}

interface PostItem {
  id: number;
  slug: string;
  title: string;
  title_bn?: string;
  excerpt: string;
  excerpt_bn?: string;
  content: string;
  content_bn?: string;
  img: string;
  category: string;
  category_bn?: string;
  author_name: string;
  author_name_bn?: string;
  author_avatar?: string;
  author_bio?: string;
  author_bio_bn?: string;
  published_at: string;
  faqs?: FaqItem[];
  section_titles?: Record<string, string>;
  cta_box?: Record<string, string>;
}

interface Props extends PageProps {
  post: PostItem;
  related: PostItem[];
  locations?: any[];
  nav_menu?: any;
  is_bn?: boolean;
  canonical_url?: string;
  hreflang?: Record<string, string>;
}

const formatDate = (d?: string, isBn = false) => {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString(isBn ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return d;
  }
};

/** Extract h2 headings from content HTML to build the table of contents */
const extractToc = (html: string) => {
  const matches: { text: string; id: string }[] = [];
  const re = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(html)) && i < 20) {
    const text = m[1].replace(/<[^>]+>/g, '').trim();
    if (text) {
      matches.push({ text, id: `toc-${i + 1}` });
      i++;
    }
  }
  return matches;
};

/** Inject ids into h2 tags so TOC links scroll to them */
const injectTocIds = (html: string): string => {
  let i = 0;
  return html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (full, attrs, inner) => {
    i++;
    return `<h2 id="toc-${i}" ${attrs}>${inner}</h2>`;
  });
};

const toBnDigit = (num: number | string): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => bnDigits[Number(d)] || d);
};

export default function BlogPublicSingle({
  post,
  related = [],
  locations = [],
  nav_menu,
  is_bn,
  canonical_url,
  hreflang,
}: Props) {
  const [selectedBranch, setSelectedBranch] = useState("mirpur");
  const [tocOpen, setTocOpen] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { isBn, setLanguage } = useLanguage();

  useEffect(() => {
    if (typeof is_bn === 'boolean') {
      setLanguage(is_bn ? 'bn' : 'en');
    }
  }, [is_bn]);

  const activeTitle = isBn ? (post?.title_bn || post?.title) : post?.title;
  const activeExcerpt = isBn ? (post?.excerpt_bn || post?.excerpt) : post?.excerpt;
  const rawContent = isBn ? (post?.content_bn || post?.content || '') : (post?.content || '');
  const authorName = isBn
    ? (post?.author_name_bn || 'ডা. আয়েশা সিদ্দিকা, বিডিএস')
    : (post?.author_name || 'Dr. Aysha Siddika, BDS');
  const authorBio = isBn
    ? (post?.author_bio_bn || 'ডা. আয়েশা সিদ্দিকা টেক ডেন্টাল মিরপুর শাখার সহকারী মেডিকেল ডিরেক্টর ও সিনিয়র ডেন্টাল সার্জন, যিনি ৮ বছরেরও বেশি সময় ধরে আধুনিক দন্তচিকিৎসা, রুট ক্যানেল ও এস্থেটিক ডেন্টিস্ট্রিতে বিশেষজ্ঞ সেবা দিচ্ছেন। তিনি শহীদ সোহরাওয়ার্দী মেডিকেল কলেজ থেকে বিডিএস এবং ওরাল সার্জারিতে পিজিটি সম্পন্ন করেছেন। বিএমডিসি রেজিস্ট্রেশন নং ৭৮৯৭।')
    : (post?.author_bio || 'Dr. Ayesha Siddika is the Assistant Medical Director and Senior Dental Surgeon at Tech Dental\'s Mirpur branch, with over 8 years of clinical experience. She earned her BDS from Shaheed Suhrawardy Medical College and completed PGT in Oral Surgery and Conservative Dentistry. Specializing in Aesthetic Dentistry, BMDC registered (No. 7897).');

  const contentHtml = rawContent;
  const authorAvatar = post?.author_avatar || "https://ui-avatars.com/api/?name=Dr.+Aysha+Siddika&background=881337&color=fff&size=160";

  const sec = post?.section_titles || {};
  const cta = post?.cta_box || {};

  // Strict separation by language
  const titleToc = isBn ? (sec.toc_bn || "সূচিপত্র") : (sec.toc || "Table of Contents");
  const titleFaq = isBn ? (sec.faq_bn || "সাধারণ প্রশ্নোত্তর (FAQ)") : (sec.faq || "Frequently Asked Questions");
  const titleCta = isBn ? (sec.cta_bn || "আপনার চিকিৎসার জন্য টেক ডেন্টাল কেন বেছে নেবেন?") : (sec.cta || "Why Choose Tech Dental for Your Treatment?");
  const titleAuthor = isBn ? (sec.author_bn || "লেখক ও বিশেষজ্ঞ পরিচিতি") : (sec.author || "About the Author");
  const titleRelated = isBn ? (sec.related_bn || "সম্পর্কিত অন্যান্য ব্লগ ও গাইড") : (sec.related || "Related Articles");

  const ctaDesc = isBn
    ? (cta.desc_bn || "যেকোনো দাঁত ও মাড়ির সমস্যার সঠিক ও আধুনিক রোগ নির্ণয় অত্যন্ত গুরুত্বপূর্ণ। টেক ডেন্টাল কেয়ার সাশ্রয়ী মূল্যে আন্তর্জাতিক মানের ডেন্টাল ট্রিটমেন্ট এবং বিশেষজ্ঞ ডক্টরস কনসালটেশন প্রদান করে। আমাদের অভিজ্ঞ টিম আপনার প্রতিটি সমস্যা গুরুত্বের সাথে পর্যবেক্ষণ করে নিরাপদ ও স্থায়ী সমাধান নিশ্চিত করে।")
    : (cta.desc || "For any gum problem, an accurate diagnosis using modern technology is vital. Tech Dental offers expert consultations and international-standard treatments at affordable prices. Our experienced team of doctors ensures long-term solutions by carefully observing every detail of your dental health.");

  const ctaBannerTitle = isBn
    ? (cta.banner_title_bn || "আবারও প্রাণবন্ত হাসতে প্রস্তুত?")
    : (cta.banner_title || "Ready to smile again?");

  const ctaBannerSubtitle = isBn
    ? (cta.banner_subtitle_bn || "দাঁতের চিকিৎসায় আর অবহেলা নয়! আজই আপনার অ্যাপয়েন্টমেন্ট নিশ্চিত করুন।")
    : (cta.banner_subtitle || "Don't delay your dental health! Book your appointment today.");

  const ctaAddress = isBn
    ? (cta.address_bn || "৮২৭ (২য় তলা), শেওড়াপাড়া, বেগম রোকেয়া সরণি, মিরপুর, ঢাকা ১২১৬।")
    : (cta.address || "827 (2nd Floor), Shewrapara, Begum Rokeya Sarani, Mirpur, Dhaka 1216.");

  const ctaBranches = isBn
    ? (cta.branches_bn || "উত্তরা, বাড্ডা, যাত্রাবাড়ী।")
    : (cta.branches || "Uttara, Badda, Jatrabari.");

  const ctaWebsite = cta.website || "www.techdentalcare.com";
  const ctaPhone = isBn ? "০৯৬৩৮-০০০৫০৫" : (cta.phone || "09638-000505");

  const preparedHtml = useMemo(() => injectTocIds(contentHtml), [contentHtml]);
  const tocItems = useMemo(() => extractToc(contentHtml), [contentHtml]);

  if (!post) return null;

  const TocList = () => (
    <ol className="text-sm space-y-3.5 text-[#4c0519] font-medium">
      {tocItems.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span>{isBn ? `${toBnDigit(i + 1)}.` : `${i + 1}.`}</span>
          <a href={`#${item.id}`} className="hover:underline hover:text-[#881337]">{item.text}</a>
        </li>
      ))}
      {tocItems.length === 0 && (
        <li className="flex gap-2">
          <span>1.</span>
          <a href="#post-top" className="hover:underline hover:text-[#881337]">{isBn ? "মূল নিবন্ধ" : "Article"}</a>
        </li>
      )}
      {post.faqs && post.faqs.length > 0 && (
        <li className="flex gap-2 pt-1 border-t border-rose-100">
          <span>{isBn ? 'প্রশ্নोत्तर' : 'FAQ'}.</span>
          <a href="#faq" className="hover:underline hover:text-[#881337] font-bold">
            {titleFaq}
          </a>
        </li>
      )}
    </ol>
  );

  return (
    <div className="min-h-screen text-gray-800 antialiased overflow-x-hidden bg-[#f3f4f6]" style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', 'SolaimanLipi', 'Noto Sans Bengali', sans-serif" }}>
      <Head>
        <title>{`${activeTitle || 'Blog'} | Tech Dental`}</title>
        {activeExcerpt && <meta name="description" content={activeExcerpt} />}
        {canonical_url && <link rel="canonical" href={canonical_url} />}
        {hreflang?.en && <link rel="alternate" hrefLang="en" href={hreflang.en} />}
        {hreflang?.bn && <link rel="alternate" hrefLang="bn" href={hreflang.bn} />}
        {hreflang?.['x-default'] && <link rel="alternate" hrefLang="x-default" href={hreflang['x-default']} />}
      </Head>

      <TopHeader
        locations={locations}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        navMenu={nav_menu}
        showBranchPicker={false}
        showLanguageSwitcher={true}
      />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col lg:flex-row gap-6 sm:gap-8 max-w-full">

        {/* Left Sidebar: Table of Contents (Hidden on Mobile) */}
        <aside className="hidden lg:block w-full lg:w-1/4 lg:flex-shrink-0">
          <div className="sticky top-8 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div
              onClick={() => setTocOpen(!tocOpen)}
              className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50/50 cursor-pointer select-none"
            >
              <h3 className="font-bold text-gray-900 text-sm">
                {titleToc}
              </h3>
              <i className={`fas fa-chevron-up text-gray-600 transition-transform duration-300 ${tocOpen ? '' : 'rotate-180'}`} />
            </div>
            {tocOpen && (
              <div className="p-4 max-h-[calc(100vh-8rem)] overflow-y-auto transition-all duration-300">
                <TocList />
              </div>
            )}
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="w-full lg:w-3/4 overflow-hidden">

          {/* Article Header Box */}
          <div id="post-top" className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 mb-6 sm:mb-8">
            <div className="text-center">
              <h1 className="text-xl sm:text-4xl tracking-tight sm:tracking-normal font-bold text-gray-900 mb-4 leading-tight">{activeTitle}</h1>

              {/* Breadcrumbs */}
              <div className="flex flex-nowrap justify-start sm:justify-center items-center bg-gray-50 border border-gray-100 text-gray-600 rounded-lg text-sm px-4 py-2 mb-4 gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
                <Link href="/" className="text-[#9f1239] hover:underline flex items-center gap-1 shrink-0">
                  <i className="fas fa-home" /> {isBn ? "হোম" : "Home"}
                </Link>
                <span className="text-gray-300 shrink-0">/</span>
                <Link href="/blog" className="text-[#9f1239] hover:underline shrink-0">
                  {isBn ? "ডেন্টাল ব্লগ" : "Dental Blog"}
                </Link>
                <span className="text-gray-300 shrink-0">/</span>
                <span className="text-gray-700 shrink-0">{(activeTitle || '').slice(0, 32)}...</span>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap justify-center items-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-gray-600 bg-gray-50 py-3 px-4 sm:px-6 rounded-lg w-full sm:w-auto mx-auto max-w-fit">
                <div className="flex items-center gap-2">
                  <i className="far fa-calendar-alt text-[#9f1239]" />
                  <span>{formatDate(post.published_at, isBn)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={authorAvatar}
                    alt={authorName}
                    className="w-6 h-6 rounded-full border border-gray-300 object-cover"
                  />
                  <span className="text-[#881337] font-semibold">{authorName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Table of Contents */}
          <div className="block lg:hidden w-full mb-6 sm:mb-8 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div
              onClick={() => setTocOpen(!tocOpen)}
              className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50/50 cursor-pointer select-none"
            >
              <h3 className="font-bold text-gray-900 text-sm">
                {titleToc}
              </h3>
              <i className={`fas fa-chevron-up text-gray-600 transition-transform duration-300 ${tocOpen ? '' : 'rotate-180'}`} />
            </div>
            {tocOpen && (
              <div className="p-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <TocList />
              </div>
            )}
          </div>

          {/* Image and Introduction Flex Container */}
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 mb-6 sm:mb-8 w-full">
            {/* Featured Image (Left) */}
            <div className="w-full lg:w-1/2 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
              <img src={post.img} alt={activeTitle} className="w-full h-auto object-cover aspect-video sm:aspect-[2/1]" />
            </div>

            {/* Introduction Box (Right) */}
            <div className="w-full lg:w-1/2 bg-white p-5 sm:p-8 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-[#881337] flex flex-col justify-center">
              {activeExcerpt && (
                <p className="mb-4 text-gray-700 text-[15px] sm:text-[16px] leading-relaxed">{activeExcerpt}</p>
              )}
              {!activeExcerpt && <p className="mb-4 text-gray-700 text-[15px] sm:text-[16px] leading-relaxed" dangerouslySetInnerHTML={{ __html: contentHtml.slice(0, 300) + '...' }} />}
            </div>
          </div>

          {/* Article Body (Prose) */}
          <div className="rich-content-view wp-editor-content prose max-w-none text-gray-700 text-[15px] sm:text-[16px] leading-relaxed blog-content-body">
            <div dangerouslySetInnerHTML={{ __html: preparedHtml }} />
          </div>

          {/* FAQ Accordion Section (if post has faqs) */}
          {Array.isArray(post.faqs) && post.faqs.length > 0 && (
            <div id="faq" className="mt-8 mb-6 sm:mb-8 bg-white p-5 sm:p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                <HelpCircle className="text-[#881337]" size={22} />
                <span>{titleFaq}</span>
              </h2>

              <div className="space-y-3">
                {post.faqs.map((f, i) => {
                  const qText = (isBn && f.q_bn) ? f.q_bn : f.q;
                  const aText = (isBn && f.a_bn) ? f.a_bn : f.a;
                  const isOpen = openFaq === i;

                  return (
                    <div key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="w-full p-4 text-left font-semibold text-gray-900 text-sm flex items-center justify-between hover:bg-gray-50 transition gap-3"
                      >
                        <span className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-rose-50 text-[#881337] text-xs font-bold flex items-center justify-center shrink-0">
                            {isBn ? toBnDigit(i + 1) : i + 1}
                          </span>
                          <span>{qText}</span>
                        </span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 pt-1 text-sm text-gray-600 border-t border-gray-100 leading-relaxed bg-gray-50/40">
                          {aText}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Why Choose Tech Dental — Contact Block */}
          <div className="p-5 sm:p-8 rounded-xl shadow-md border border-gray-200 mb-6 sm:mb-8 bg-gradient-to-br from-slate-50 to-white relative w-full overflow-hidden">
            {/* Left Accent Border */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#881337]" />

            <h2 className="!border-none !pb-0 !mb-4 text-[#4c0519] text-2xl font-bold">
              {titleCta}
            </h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              {ctaDesc}
            </p>

            {/* Call to action Banner */}
            <div className="bg-white rounded-lg p-4 my-6 shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0 shadow-inner border border-gray-100">
                <i className="far fa-calendar-check text-[#881337] text-xl" />
              </div>
              <div className="flex flex-col justify-center h-full pt-1">
                <h4 className="font-bold text-gray-900 text-[16px] mb-1">
                  {ctaBannerTitle}
                </h4>
                <p className="text-[#881337] text-[14.5px] font-semibold m-0">
                  {ctaBannerSubtitle}
                </p>
              </div>
            </div>

            {/* Contact Info List */}
            <ul className="space-y-5 mt-8">
              <li className="flex items-start gap-4">
                <div className="bg-white shadow-sm border border-gray-100 w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <i className="fas fa-map-marker-alt text-[#9f1239] text-[15px]" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start w-full pt-1.5">
                  <div className="flex justify-between sm:w-[140px] shrink-0 font-semibold text-gray-900 pr-3">
                    <span>{isBn ? "প্রধান শাখা" : "Address"}</span>
                    <span className="hidden sm:inline text-gray-300">:</span>
                  </div>
                  <div className="text-gray-700 mt-0.5 sm:mt-0">
                    {ctaAddress}
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-white shadow-sm border border-gray-100 w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <i className="fas fa-code-branch text-[#9f1239] text-[14px]" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start w-full pt-1.5">
                  <div className="flex justify-between sm:w-[140px] shrink-0 font-semibold text-gray-900 pr-3">
                    <span>{isBn ? "অন্যান্য ব্রাঞ্চ" : "Other Branches"}</span>
                    <span className="hidden sm:inline text-gray-300">:</span>
                  </div>
                  <div className="text-gray-700 mt-0.5 sm:mt-0">
                    {ctaBranches}
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-white shadow-sm border border-gray-100 w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <i className="fas fa-globe text-[#9f1239] text-[14px]" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center w-full pt-1.5">
                  <div className="flex justify-between sm:w-[140px] shrink-0 font-semibold text-gray-900 pr-3">
                    <span>{isBn ? "ওয়েবসাইট" : "Website"}</span>
                    <span className="hidden sm:inline text-gray-300">:</span>
                  </div>
                  <div className="mt-1 sm:mt-0">
                    <a href={ctaWebsite.startsWith('http') ? ctaWebsite : `https://${ctaWebsite}`} target="_blank" rel="noopener noreferrer" className="text-[#881337] font-medium hover:underline transition-colors break-all">
                      {ctaWebsite}
                    </a>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-white shadow-sm border border-gray-100 w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <i className="fas fa-phone-alt text-[#9f1239] text-[14px]" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center w-full pt-1.5">
                  <div className="flex justify-between sm:w-[140px] shrink-0 font-semibold text-gray-900 pr-3">
                    <span>{isBn ? "হটলাইন" : "Phone"}</span>
                    <span className="hidden sm:inline text-gray-300">:</span>
                  </div>
                  <div className="mt-1 sm:mt-0">
                    <a href={`tel:${ctaPhone.replace(/[^0-9+]/g, '')}`} className="text-[#881337] font-bold text-[17px] hover:underline transition-colors">
                      {ctaPhone}
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Footer Areas (Author & Related) */}
          <div className="mt-8 sm:mt-12 flex flex-col gap-8 sm:gap-12 w-full">

            {/* About the Author */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-8 transition-shadow hover:shadow-md">
              <h3 className="text-xl font-bold font-serif mb-5 sm:mb-6 text-gray-900 border-b border-gray-100 pb-3">
                {titleAuthor}
              </h3>
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start sm:items-center">
                <div className="shrink-0 mx-auto sm:mx-0">
                  <img
                    src={authorAvatar}
                    alt={authorName}
                    className="w-[80px] h-[80px] rounded-full object-cover border-2 border-gray-200 shadow-sm p-0.5 bg-white"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-[18px] font-serif font-bold text-[#4c0519] mb-2">{authorName}</h4>
                  <p className="text-gray-700 text-[14.5px] leading-[1.8] text-justify">
                    {authorBio}
                  </p>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            {related.length > 0 && (
              <div className="mb-10 w-full overflow-hidden">
                <h3 className="text-xl font-bold font-serif pb-3 border-b border-gray-300 text-gray-900 mb-6">
                  {titleRelated}
                </h3>
                <div className="border border-gray-200 p-6 bg-white rounded-xl shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {related.map((r) => {
                      const rTitle = (isBn && r.title_bn) ? r.title_bn : r.title;
                      const rExcerpt = (isBn && r.excerpt_bn) ? r.excerpt_bn : r.excerpt;
                      return (
                        <div key={r.id} className="group">
                          <Link href={`/blog/${r.slug}`} className="block">
                            {r.img && (
                              <img src={r.img} alt={rTitle} className="w-full h-44 object-cover mb-3 border border-gray-200 rounded-lg group-hover:opacity-95 transition" />
                            )}
                            <h4 className="font-bold text-gray-900 text-[16px] group-hover:text-[#881337] transition-colors mb-2 leading-snug">{rTitle}</h4>
                            {rExcerpt && (
                              <p className="text-gray-600 text-[13.5px] line-clamp-2 leading-relaxed">{rExcerpt}</p>
                            )}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

          </div>

        </main>
      </div>

      <GlobalFooter hideCtaStrip={true} />
    </div>
  );
}
