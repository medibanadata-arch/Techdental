import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { TopHeader } from "@/components/TopHeader";
import { AppointmentModal } from "@/components/AppointmentModal";
import { BranchPickerModal } from "@/components/BranchPickerModal";
import { GlobalFooter } from "@/Components/GlobalFooter";
import Seo from "@/Components/Seo";
import {
    Calendar, Clock, ShieldCheck, MapPin, Phone,
    Share2, Check, Copy, ArrowRight, Edit3, ChevronRight,
    Sparkles, HeartHandshake, CheckCircle2
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';

interface PageItem {
    id: number;
    title: string;
    slug: string;
    content: string;
    created_at?: string;
    updated_at?: string;
    seo_title?: string;
    meta_desc?: string;
    canonical_url?: string;
    robots_index?: boolean;
    robots_follow?: boolean;
    schema_type?: string;
    schema_json?: string;
    faqs?: any[];
}

interface CustomPageShowProps extends PageProps {
    item: PageItem;
    locations?: any[];
    nav_menu?: any;
}

export default function CustomPageShow({ item, locations = [], nav_menu }: CustomPageShowProps) {
    const { auth } = usePage().props as any;
    const [selectedBranch, setSelectedBranch] = useState("");
    const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
    const [isBranchPickerOpen, setIsBranchPickerOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // Calculate estimated reading time
    const textContent = item.content ? item.content.replace(/<[^>]+>/g, '') : '';
    const wordCount = textContent.trim().split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    const pageCanonical = item.canonical_url || `https://techdentalbd.com/page/${item.slug}`;
    const pageTitle = item.seo_title || `${item.title} — Tech Dental`;
    const pageDesc = item.meta_desc || (textContent ? textContent.substring(0, 155) + '...' : 'Tech Dental Care information and patient guides.');
    const pageRobots = `${item.robots_index !== false ? 'index' : 'noindex'}, ${item.robots_follow !== false ? 'follow' : 'nofollow'}`;

    const safeFaqs = React.useMemo(() => {
        if (!item?.faqs) return [];
        if (Array.isArray(item.faqs)) return item.faqs;
        if (typeof item.faqs === 'string') {
            try {
                const parsed = JSON.parse(item.faqs);
                if (Array.isArray(parsed)) return parsed;
            } catch { }
        }
        return [];
    }, [item?.faqs]);

    const pageSchema = React.useMemo(() => {
        if (item.schema_json) {
            try { return JSON.parse(item.schema_json); } catch (e) { }
        }
        const schema: any = {
            "@context": "https://schema.org",
            "@type": item.schema_type || "WebPage",
            "name": item.title,
            "description": pageDesc,
            "url": pageCanonical,
        };
        if (safeFaqs.length > 0) {
            return {
                "@context": "https://schema.org",
                "@graph": [
                    schema,
                    {
                        "@type": "FAQPage",
                        "mainEntity": safeFaqs.filter((f: any) => f && f.q).map((f: any) => ({
                            "@type": "Question",
                            "name": f.q,
                            "acceptedAnswer": { "@type": "Answer", "text": f.a }
                        }))
                    }
                ]
            };
        }
        return schema;
    }, [item, pageCanonical, pageDesc, safeFaqs]);

    return (
        <div className="min-h-screen bg-white text-slate-800 flex flex-col w-full antialiased">
            <Seo
                title={pageTitle}
                description={pageDesc}
                canonical={pageCanonical}
                robots={pageRobots}
                schema={pageSchema}
                type="article"
                noSuffix
            />

            {/* App Viewport Container: Full Width Responsive */}
            <main className="w-full bg-white overflow-hidden flex flex-col">

                {/* 1. Public Top Header with Brand & Synchronized Branch Selector & Navigation Drawer */}
                <TopHeader
                    locations={locations}
                    selectedBranch={selectedBranch}
                    onBranchChange={setSelectedBranch}
                    navMenu={nav_menu}
                />

                {/* 2. Customer Breadcrumbs */}
                <div className="px-5 sm:px-10 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <Link href="/" className="hover:text-rose-700 font-semibold transition-colors">Home</Link>
                        <ChevronRight size={13} className="text-slate-400" />
                        <span className="text-slate-400">Pages</span>
                        <ChevronRight size={13} className="text-slate-400" />
                        <span className="font-bold text-slate-800">{item.title}</span>
                    </div>

                    <button
                        type="button"
                        onClick={handleCopyLink}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        title="Copy page link"
                    >
                        {isCopied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        <span>{isCopied ? 'Link Copied!' : 'Share'}</span>
                    </button>
                </div>

                {/* 3. Public Page Hero Banner */}
                <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white px-6 sm:px-12 py-10 sm:py-14 relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-16 -translate-y-16 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl space-y-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-sky-200 border border-white/15 rounded-full text-xs font-bold uppercase tracking-wider">
                            <ShieldCheck size={13} className="text-sky-400" />
                            <span>Tech Dental Care Center</span>
                        </span>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                            {item.title}
                        </h1>

                        <div className="flex items-center gap-4 text-xs text-slate-300 pt-1 flex-wrap">
                            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
                                <Calendar size={13} className="text-sky-400" />
                                <span>Updated: {item.updated_at ? new Date(item.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}</span>
                            </span>

                            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
                                <Clock size={13} className="text-emerald-400" />
                                <span>{readTimeMinutes} min read</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* 4. Main Body: Customer-Facing Content */}
                <article className="px-5 sm:px-10 md:px-12 py-8 sm:py-12 space-y-8 flex-1">
                    <div
                        className="rich-content-view wp-editor-content prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-5 [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-slate-900 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_p]:text-slate-700 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-sky-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_img]:rounded-2xl [&_img]:shadow-sm [&_a]:text-sky-600 [&_a]:underline font-normal"
                        dangerouslySetInnerHTML={{
                            __html: item.content || '<p class="text-slate-400 italic">No content available for this page.</p>'
                        }}
                    />
                </article>

                {/* 5. Customer Action / Booking CTA Banner */}
                <div className="mx-5 sm:mx-10 md:mx-12 my-6 p-6 sm:p-8 bg-gradient-to-r from-[#800038] to-[#a30048] text-white rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-1.5 text-center sm:text-left">
                        <div className="flex items-center gap-2 justify-center sm:justify-start text-xs font-bold text-rose-200">
                            <HeartHandshake size={15} />
                            <span>Painless Clinical Dentistry in Dhaka</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black">Ready to Restore Your Healthy Smile?</h3>
                        <p className="text-xs sm:text-sm text-rose-100 max-w-xl">
                            Consult with our specialist oral surgeons across Mirpur, Uttara, Badda, and Jatrabari branches.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
                        <a
                            href="tel:+8801700000000"
                            className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
                        >
                            <Phone size={14} />
                            <span>01700-000000</span>
                        </a>

                        <Link
                            href="/appointment"
                            className="px-6 py-3 bg-white text-[#800038] hover:bg-rose-50 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                        >
                            <span>Make Appointment</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </main>

            {/* Modals for customer actions */}
            <AppointmentModal
                locations={locations}
                isOpen={isAppointmentOpen}
                onClose={() => setIsAppointmentOpen(false)}
                defaultBranch={selectedBranch}
            />

            <BranchPickerModal
                locations={locations}
                isOpen={isBranchPickerOpen}
                onClose={() => setIsBranchPickerOpen(false)}
                actionType="directions"
            />

            {/* Floating Admin Edit Button (Only visible if administrator is logged in) */}
            {auth?.user && (
                <div className="fixed bottom-6 right-6 z-50">
                    <Link
                        href={route('pages.edit', item.id)}
                        className="inline-flex items-center gap-2 bg-[#800038] hover:bg-[#990044] text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-2xl transition-all border border-white/20 hover:scale-105"
                        title="Edit this page in Console"
                    >
                        <Edit3 size={14} />
                        <span>Edit Page</span>
                    </Link>
                </div>
            )}

            {/* Global Unified Footer */}
            <GlobalFooter hideCtaStrip={true} />
        </div>
    );
}
