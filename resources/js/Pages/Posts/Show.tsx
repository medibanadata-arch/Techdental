import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    ArrowLeft, Calendar, User, Tag, Clock, Share2, Bookmark,
    MessageSquare, CheckCircle, LayoutTemplate, Phone, Sparkles,
    ThumbsUp, Send, Check, Copy, ExternalLink, Edit3
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';

interface Post {
    id: number;
    slug: string;
    title: string;
    excerpt?: string;
    content?: string;
    img?: string;
    category?: string;
    author_name?: string;
    tags?: string;
    created_at: string;
    status?: string;
    focus_keyword?: string;
}

interface Props extends PageProps {
    item: Post;
}

export default function Show({ item }: Props) {
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

    return (
        <AdminLayout>
            <Head title={item.title} />

            <div className="max-w-6xl mx-auto space-y-6 py-4 font-sans text-slate-800">
                {/* 1. Admin Template Header Navigation Bar */}
                <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('posts.index')}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors shrink-0"
                            title="Back to Posts"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider border border-purple-500/30 flex items-center gap-1">
                                    <LayoutTemplate size={10} /> Active Template: Single Post Layout (Default)
                                </span>
                            </div>
                            <h2 className="text-sm font-bold text-white truncate max-w-md mt-0.5">
                                Previewing Post: {item.title}
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Link
                            href={route('templates.index')}
                            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                            <Sparkles size={14} />
                            <span>Customize Template</span>
                        </Link>

                        <Link
                            href={route('posts.edit', item.id)}
                            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                            <Edit3 size={14} />
                            <span>Edit Post Content</span>
                        </Link>
                    </div>
                </div>

                {/* 2. Main Custom Single Post Template Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Main Article Body (8 Cols) */}
                    <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-8 p-6 sm:p-10">

                        {/* Post Header Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="px-3.5 py-1 rounded-full bg-sky-100 text-sky-800 font-bold text-xs tracking-wide">
                                    {item.category || 'Dental Care'}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                                    <Clock size={14} className="text-sky-600" />
                                    <span>{readTimeMinutes} min read</span>
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${item.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                        item.status === 'draft' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                            'bg-rose-50 text-rose-700 border border-rose-200'
                                    }`}>
                                    {item.status || 'published'}
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                                {item.title}
                            </h1>

                            {/* Author & Date Metadata */}
                            <div className="flex items-center justify-between border-y border-slate-100 py-4 flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                        {(item.author_name || 'Tech Dental').charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                                            <span>{item.author_name || 'Dr. Tech Dental Specialist'}</span>
                                            <CheckCircle size={13} className="text-sky-600 fill-sky-100" />
                                        </div>
                                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Social Share */}
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleCopyLink}
                                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                        title="Copy Post Link"
                                    >
                                        {isCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                                        <span>{isCopied ? 'Copied!' : 'Share'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Featured Image */}
                        {item.img && (
                            <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-2xs">
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Excerpt Summary Box */}
                        {item.excerpt && (
                            <div className="p-5 bg-gradient-to-r from-sky-50 to-blue-50/50 rounded-2xl border-l-4 border-sky-600 text-slate-700 italic text-sm leading-relaxed shadow-2xs">
                                <p className="font-semibold text-sky-900 not-italic mb-1 text-xs uppercase tracking-wider flex items-center gap-1">
                                    <Sparkles size={13} /> Executive Summary
                                </p>
                                "{item.excerpt}"
                            </div>
                        )}

                        {/* Article Main HTML Content */}
                        <div
                            className="rich-content-view wp-editor-content prose prose-slate max-w-none text-slate-800 text-base leading-relaxed space-y-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_p]:text-slate-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-sky-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_img]:rounded-xl [&_img]:shadow-sm [&_a]:text-sky-600 [&_a]:underline font-normal"
                            dangerouslySetInnerHTML={{
                                __html: item.content || '<p class="text-slate-400 italic">No post content available yet.</p>'
                            }}
                        />

                        {/* Post Footer Tags & Share Banner */}
                        <div className="pt-6 border-t border-slate-100 space-y-4">
                            {item.tags && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tags:</span>
                                    {item.tags.split(',').map((tag, idx) => (
                                        <span key={idx} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer">
                                            #{tag.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Author Bio Box */}
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                                    {(item.author_name || 'T').charAt(0)}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-slate-900">
                                        Written by {item.author_name || 'Dr. Tech Dental Team'}
                                    </h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Certified Dental Specialist committed to sharing modern digital dental solutions, patient guides, and oral healthcare insights.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Sidebar Widgets (4 Cols) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Widget 1: Quick Appointment Booking Banner */}
                        <div className="bg-gradient-to-br from-sky-600 to-blue-700 text-white p-6 rounded-3xl shadow-lg space-y-4 border border-sky-500">
                            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                <Phone size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold leading-snug">Need Professional Dental Care?</h3>
                                <p className="text-xs text-sky-100 mt-1 leading-relaxed">
                                    Book a consultation with Dhaka's top certified digital smile design specialists today.
                                </p>
                            </div>
                            <Link
                                href={route('appointments.index')}
                                className="block w-full text-center py-3 bg-white hover:bg-sky-50 text-sky-800 text-xs font-extrabold rounded-2xl shadow-sm transition-all"
                            >
                                Book Appointment Now →
                            </Link>
                        </div>

                        {/* Widget 2: Article Highlights / Key Info */}
                        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
                            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles size={14} className="text-sky-600" />
                                <span>Article Snapshot</span>
                            </h4>
                            <div className="space-y-3 text-xs text-slate-700">
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400 font-medium">Category</span>
                                    <span className="font-bold text-slate-900">{item.category || 'Dental Care'}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400 font-medium">Reading Time</span>
                                    <span className="font-bold text-slate-900">{readTimeMinutes} Minutes</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-400 font-medium">Focus Keyword</span>
                                    <span className="font-bold text-sky-600">{item.focus_keyword || 'Dental Health'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Widget 3: Template Information Card */}
                        <div className="bg-purple-50/60 rounded-3xl border border-purple-200 p-6 space-y-3 text-purple-900">
                            <div className="flex items-center gap-2">
                                <LayoutTemplate size={16} className="text-purple-600" />
                                <h4 className="text-xs font-bold uppercase tracking-wider">Template Engine</h4>
                            </div>
                            <p className="text-xs text-purple-800 leading-relaxed">
                                This single post is rendered using your active <strong className="font-bold">Single Post Layout (Default)</strong> custom template.
                            </p>
                            <Link
                                href={route('templates.index')}
                                className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 underline"
                            >
                                Manage Layout Templates →
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

