

import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { TopHeader } from "@/Components/TopHeader";
import {
  Calendar,
  Clock,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Home,
  User,
  Sparkles,
  Share2
} from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
  number: string;
}

interface PostLayoutTemplateProps {
  post: any;
  loading?: boolean;
  error?: string;
}

export default function PostLayoutTemplate({ post, loading, error }: PostLayoutTemplateProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [formattedHtml, setFormattedHtml] = useState<string>("");
  const [tocExpanded, setTocExpanded] = useState<boolean>(true);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Calculate scroll reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Process body HTML and extract H2 and H3 Headings for TOC with auto-numbering
  useEffect(() => {
    if (!post || !post.body || typeof window === "undefined") {
      setFormattedHtml("");
      setToc([]);
      return;
    }

    const htmlContent = post.body;
    let headingCount = 0;
    let h2Counter = 0;
    let h3Counter = 0;
    const items: TocItem[] = [];

    const div = document.createElement("div");
    div.innerHTML = htmlContent;

    const headings = div.querySelectorAll("h2, h3");
    headings.forEach((heading, idx) => {
      const text = heading.textContent || `Heading ${idx + 1}`;
      const id = `heading-${idx}`;
      const isH2 = heading.tagName.toLowerCase() === "h2";
      const level = isH2 ? 2 : 3;

      let numberStr = "";
      if (isH2) {
        h2Counter++;
        h3Counter = 0;
        numberStr = `${h2Counter}.`;
      } else {
        h3Counter++;
        numberStr = `${h2Counter}.${h3Counter}.`;
      }

      items.push({ id, text, level, number: numberStr });
    });

    setToc(items);

    const newHtml = htmlContent.replace(/<h([23])(.*?)>(.*?)<\/h\1>/gi, (match: string, level: string, attrs: string, text: string) => {
      const id = `heading-${headingCount}`;
      const item = items[headingCount];
      headingCount++;

      const numberedText = item ? `<span class="mr-2 text-rose-500/80 font-black">${item.number}</span>${text}` : text;

      return `<h${level} id="${id}" class="scroll-mt-28 font-black tracking-tight text-slate-900 ${level === "2" ? "text-2xl sm:text-3xl mt-12 mb-5" : "text-xl mt-8 mb-4 text-slate-800"
        }" ${attrs}>${numberedText}</h${level}>`;
    });

    setFormattedHtml(newHtml);
  }, [post]);

  const scrollToHeading = (id: string) => {
    setActiveHeading(id);
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-600 tracking-wide">Preparing premium content...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-800">Article Not Found</h2>
        <p className="text-sm text-slate-500 max-w-sm">{error || "The article you are looking for does not exist or has been removed."}</p>
        <Link href="/blog" className="px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all">
          Back to All Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-slate-100/80 text-slate-900 font-sans selection:bg-rose-500 selection:text-white flex flex-col relative overflow-hidden">

      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-rose-200/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[35rem] h-[35rem] bg-indigo-200/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-rose-400 to-rose-600 z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      <TopHeader onBranchChange={() => { }} selectedBranch="mirpur" showBranchPicker={false} />

      <main className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative z-10">

        {/* LEFT SIDEBAR: Premium Glassmorphic Table of Contents */}
        <aside className="lg:col-span-3 lg:sticky lg:top-28 order-2 lg:order-1 mt-10 lg:mt-0 transition-all duration-300">
          <div className="bg-white/60 backdrop-blur-2xl border border-white/60 shadow-xl shadow-rose-900/5 rounded-3xl overflow-hidden transition-all duration-300">
            <div
              className="px-6 py-5 border-b border-white/40 flex items-center justify-between cursor-pointer group"
              onClick={() => setTocExpanded(!tocExpanded)}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-black text-slate-800 tracking-wide uppercase">Table of Contents</h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm group-hover:bg-rose-50 transition-colors">
                {tocExpanded ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
              </div>
            </div>

            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${tocExpanded ? 'max-h-[70vh] opacity-100' : 'max-h-0 opacity-0'}`}>
              <nav className="p-5 overflow-y-auto space-y-2 custom-scrollbar">
                {toc.map((item) => {
                  const isActive = activeHeading === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToHeading(item.id)}
                      className={`w-full flex text-left text-[0.85rem] font-semibold transition-all duration-200 leading-relaxed rounded-xl py-2 px-3 group ${isActive
                          ? "bg-white shadow-sm border border-slate-100 text-rose-600 transform scale-[1.02]"
                          : "text-slate-600 hover:bg-white/50 hover:text-slate-900 border border-transparent"
                        }`}
                      style={{ marginLeft: item.level === 3 ? "1rem" : "0", width: item.level === 3 ? 'calc(100% - 1rem)' : '100%' }}
                    >
                      <span className={`mr-2 shrink-0 transition-colors ${isActive ? "text-rose-500" : "text-slate-400 group-hover:text-rose-400"}`}>
                        {item.number}
                      </span>
                      <span>{item.text}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Elevated Main Article Panel */}
        <article className="lg:col-span-9 bg-white/80 backdrop-blur-xl p-6 sm:p-12 lg:p-16 border border-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem] order-1 lg:order-2">

          {/* Header Section */}
          <div className="space-y-6 mb-12">

            {/* Breadcrumbs */}
            <div className="flex flex-wrap items-center text-[0.75rem] font-bold text-slate-400 gap-2 mb-8 uppercase tracking-widest">
              <Link href="/" className="flex items-center hover:text-rose-500 transition-colors bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
                <Home className="w-3.5 h-3.5 mr-1.5" />
                Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/blog" className="hover:text-rose-500 transition-colors bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
                Dental Blog
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-300 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100 truncate max-w-[150px] sm:max-w-xs">
                {post.title}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight">
              {post.title}
            </h1>

            {/* Elevated Metadata Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-6">
              <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-md">
                {post.author_avatar ? (
                  <img src={post.author_avatar} alt="Author" className="w-5 h-5 rounded-full object-cover border border-slate-700" />
                ) : (
                  <User className="w-3.5 h-3.5" />
                )}
                <span>By {post.author_name || "Specialist"}</span>
              </div>

              <div className="flex items-center gap-1.5 bg-white text-slate-600 px-4 py-2 rounded-full text-xs font-bold shadow-sm border border-slate-200">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                <span>{new Date(post.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>

              <div className="flex items-center gap-1.5 bg-white text-slate-600 px-4 py-2 rounded-full text-xs font-bold shadow-sm border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                <span>Updated {new Date(post.updated_at || post.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>
          </div>

          {/* Premium Cover Image */}
          {post.cover_image && (
            <div className="mb-14 rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 border-4 border-white relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-auto object-cover max-h-[550px] transform group-hover:scale-[1.02] transition-transform duration-700 ease-in-out"
              />
            </div>
          )}

          {/* Rendered HTML Post Content with Premium Typography */}
          <div
            className="rich-content-view wp-editor-content blog-content-view prose prose-slate prose-lg lg:prose-xl max-w-none text-slate-600 font-sans leading-[1.8] prose-headings:font-black prose-headings:tracking-tight prose-img:rounded-2xl prose-img:shadow-lg prose-strong:text-slate-900 prose-strong:font-black"
            dangerouslySetInnerHTML={{ __html: formattedHtml }}
          />

        </article>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 px-4 text-center text-sm mt-20 border-t-4 border-rose-500">
        <div className="max-w-[1400px] mx-auto space-y-4">
          <div className="text-xl font-black text-white tracking-widest">TECH DENTAL CARE</div>
          <p className="font-semibold text-slate-500">© 2026 Tech Dental Bangladesh. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
