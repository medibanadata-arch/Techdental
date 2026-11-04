import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import RichContentEditor from '@/Components/RichContentEditor';
import { 
    ArrowLeft, Sparkles, Image as ImageIcon, Plus, 
    Bold, Italic, List, ListOrdered, Quote, AlignLeft, 
    AlignCenter, AlignRight, Link2, Eye, HelpCircle, 
    Calendar, Lock, Globe, Check, Trash2
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';
import SeoMetaBox from '@/Components/SeoMetaBox';

interface PageItem {
    id: number;
    title: string;
    slug: string;
    content: string;
    seo_title?: string;
    meta_desc?: string;
    canonical_url?: string;
    robots_index?: boolean;
    robots_follow?: boolean;
    schema_type?: string;
    schema_json?: string;
    faqs?: any[];
}

interface Props extends PageProps {
    page: PageItem;
}

export default function CustomPagesEdit({ page }: Props) {
    const [editorTab, setEditorTab] = useState<'visual' | 'text'>('visual');
    const [wordCount, setWordCount] = useState(() => {
        const text = (page.content || '').replace(/<[^>]*>/g, ' ').trim();
        return text ? text.split(/\s+/).length : 0;
    });
    const [slugCustomized, setSlugCustomized] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        title: page.title || '',
        slug: page.slug || '',
        content: page.content || '',
        seo_title: page.seo_title || '',
        meta_desc: page.meta_desc || '',
        canonical_url: page.canonical_url || '',
        robots_index: page.robots_index !== undefined ? Boolean(page.robots_index) : true,
        robots_follow: page.robots_follow !== undefined ? Boolean(page.robots_follow) : true,
        schema_type: page.schema_type || 'WebPage',
        schema_json: page.schema_json || '',
        faqs: Array.isArray(page.faqs) ? page.faqs : [],
    });

    const handleTitleChange = (newTitle: string) => {
        if (!slugCustomized) {
            const autoSlug = newTitle
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setData(prev => ({
                ...prev,
                title: newTitle,
                slug: autoSlug,
            }));
        } else {
            setData('title', newTitle);
        }
    };

    const handleResyncSlug = () => {
        const autoSlug = data.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        setData('slug', autoSlug);
        setSlugCustomized(false);
    };

    const handleContentChange = (val: string) => {
        setData('content', val);
        const text = val.replace(/<[^>]*>/g, ' ').trim();
        setWordCount(text ? text.split(/\s+/).length : 0);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('pages.update', page.id));
    };

    return (
        <AdminLayout>
            <Head title={`Edit Page: ${page.title} — Tech Dental`} />

            <div className="max-w-7xl mx-auto space-y-4 pb-16 font-sans">
                
                {/* WordPress Style Screen Header */}
                <div className="flex items-center justify-between pb-1 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('pages.index')}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                            title="Back to All Pages"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Edit Page</h1>
                        
                        <Link
                            href={route('pages.create')}
                            className="text-xs px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 text-blue-700 font-semibold border border-gray-300 transition"
                        >
                            Add New
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <button type="button" className="hover:text-gray-800 transition cursor-pointer">Screen Options &#9662;</button>
                        <span>|</span>
                        <button type="button" className="hover:text-gray-800 transition cursor-pointer">Help &#9662;</button>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        
                        {/* Left / Center Main Content Area (3 Columns) */}
                        <div className="lg:col-span-3 space-y-4">
                            
                            {/* Title Field (WordPress Style) */}
                            <div>
                                <input
                                    type="text"
                                    required
                                    placeholder="Add title"
                                    value={data.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    className="w-full text-2xl font-bold text-gray-900 placeholder:text-gray-300 border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition shadow-2xs"
                                />
                                {errors.title && <span className="text-red-500 text-xs mt-1 block">{errors.title}</span>}
                            </div>

                            {/* "Edit with Visual Builder" Button (Identical to 'Edit with Elementor') */}
                            <div className="flex items-center gap-3">
                                <Link
                                    href={route('pages.builder', page.id)}
                                    className="w-full sm:w-auto inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer text-sm tracking-wide transform hover:-translate-y-0.5"
                                >
                                    <Sparkles size={18} className="text-amber-300 animate-pulse" />
                                    <span>Edit with Visual Builder</span>
                                    <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full ml-1">Full Screen Canvas</span>
                                </Link>

                                <a
                                    href={`/page/${data.slug || page.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 text-xs font-bold transition"
                                >
                                    <Globe size={14} className="text-sky-600" />
                                    <span>View Live Page</span>
                                </a>
                            </div>

                            {/* Rich Content Editor */}
                            <div className="mb-6">
                                <RichContentEditor
                                    label="WRITE CONTENT"
                                    value={data.content}
                                    onChange={(val) => handleContentChange(val)}
                                    placeholder="Write your page content or click 'Edit with Visual Builder' above to build visually..."
                                    minHeight="350px"
                                />
                            </div>

                            {/* Advanced SEO & Structured Data Box */}
                            <SeoMetaBox
                                data={{
                                    seo_title: data.seo_title,
                                    meta_desc: data.meta_desc,
                                    canonical_url: data.canonical_url,
                                    slug: data.slug,
                                    robots_index: data.robots_index,
                                    robots_follow: data.robots_follow,
                                    schema_type: data.schema_type,
                                    schema_json: data.schema_json,
                                    faqs: data.faqs,
                                }}
                                onChange={(updated) => {
                                    setData({
                                        ...data,
                                        seo_title: updated.seo_title,
                                        meta_desc: updated.meta_desc,
                                        canonical_url: updated.canonical_url,
                                        slug: updated.slug || data.slug,
                                        robots_index: updated.robots_index,
                                        robots_follow: updated.robots_follow,
                                        schema_type: updated.schema_type,
                                        schema_json: updated.schema_json,
                                        faqs: updated.faqs || [],
                                    });
                                }}
                                pageType="page"
                                defaultSlug={data.slug}
                                previewUrl="https://techdentalbd.com/page"
                            />

                            {/* Excerpt Collapsible Meta Box */}
                            <div className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-2xs">
                                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Excerpt</span>
                                    <span className="text-[11px] text-gray-400">&#9650;</span>
                                </div>
                                <div className="p-4 space-y-2">
                                    <textarea
                                        rows={3}
                                        placeholder="Excerpts are optional hand-crafted summaries of your content that can be used in your theme."
                                        className="w-full text-xs text-gray-700 border border-gray-300 rounded-lg p-3 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <p className="text-[11px] text-gray-400">
                                        Excerpts are optional hand-crafted summaries of your content that can be used in your theme.
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Right Sidebar Meta Boxes (1 Column) */}
                        <div className="space-y-4">
                            
                            {/* Publish Meta Box (Classic WordPress Style) */}
                            <div className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-2xs">
                                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between font-bold text-xs text-gray-700">
                                    <span>Publish</span>
                                    <span className="text-gray-400">&#9650;</span>
                                </div>
                                
                                <div className="p-4 space-y-3 text-xs">
                                    {/* Action Buttons: Save Draft & Preview */}
                                    <div className="flex items-center justify-between gap-2 pb-3 border-b border-gray-100">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-3.5 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 font-bold text-xs transition cursor-pointer"
                                        >
                                            Save Draft
                                        </button>
                                        <Link
                                            href={route('pages.builder', page.id)}
                                            className="px-3.5 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 border border-gray-300 text-blue-700 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                                        >
                                            <Eye size={12} />
                                            <span>Visual Builder</span>
                                        </Link>
                                    </div>

                                    {/* Status Info Rows */}
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Lock size={13} className="text-gray-400" />
                                        <span>Status:</span>
                                        <strong className="text-emerald-700 font-bold">Published</strong>
                                        <a href="#edit" className="text-blue-600 underline ml-auto">Edit</a>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Globe size={13} className="text-gray-400" />
                                        <span>Visibility:</span>
                                        <strong className="text-gray-800">Public</strong>
                                        <a href="#edit" className="text-blue-600 underline ml-auto">Edit</a>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar size={13} className="text-gray-400" />
                                        <span>Published on:</span>
                                        <strong className="text-gray-800">Published</strong>
                                        <a href="#edit" className="text-blue-600 underline ml-auto">Edit</a>
                                    </div>
                                </div>

                                {/* Publish Box Bottom Row */}
                                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (confirm('Move this page to trash?')) {
                                                router.delete(route('pages.destroy', page.id));
                                            }
                                        }}
                                        className="text-red-600 hover:text-red-700 text-xs font-semibold underline cursor-pointer"
                                    >
                                        Move to Trash
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm hover:shadow transition disabled:opacity-50 cursor-pointer"
                                    >
                                        {processing ? 'Updating...' : 'Update'}
                                    </button>
                                </div>
                            </div>

                            {/* Featured Image Meta Box */}
                            <div className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-2xs">
                                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between font-bold text-xs text-gray-700">
                                    <span>Featured Image</span>
                                    <span className="text-gray-400">&#9650;</span>
                                </div>
                                <div className="p-4 text-center">
                                    <div 
                                        onClick={() => {
                                            const url = prompt('Enter Featured Image URL:');
                                            if (url) alert('Featured image URL set!');
                                        }}
                                        className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-6 cursor-pointer transition flex flex-col items-center justify-center gap-2"
                                    >
                                        <ImageIcon size={24} className="text-gray-400" />
                                        <span className="text-xs text-blue-600 font-semibold underline">Set featured image</span>
                                    </div>
                                </div>
                            </div>

                            {/* Permalink / URL Slug Meta Box */}
                            <div className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-2xs">
                                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between font-bold text-xs text-gray-700">
                                    <span>Slug / Permalink</span>
                                    <span className="text-gray-400">&#9650;</span>
                                </div>
                                <div className="p-4 space-y-2.5 text-xs">
                                    <div className="flex items-center justify-between">
                                        <label className="text-gray-600 font-semibold">URL Slug:</label>
                                        {slugCustomized ? (
                                            <button
                                                type="button"
                                                onClick={handleResyncSlug}
                                                className="text-[10px] text-blue-600 hover:underline font-bold cursor-pointer"
                                            >
                                                Sync with Title
                                            </button>
                                        ) : (
                                            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                                                Auto-syncing
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center">
                                        <span className="bg-gray-100 border border-r-0 border-gray-300 text-gray-500 px-2 py-1.5 rounded-l-md font-mono text-[11px]">
                                            /page/
                                        </span>
                                        <input
                                            type="text"
                                            value={data.slug}
                                            onChange={(e) => {
                                                setSlugCustomized(true);
                                                setData('slug', e.target.value);
                                            }}
                                            className="w-full text-xs font-mono border border-gray-300 rounded-r-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <a 
                                        href={`/page/${data.slug || page.slug}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="text-[11px] text-blue-600 hover:underline block truncate mt-1 font-mono"
                                    >
                                        http://127.0.0.1:8000/page/{data.slug || page.slug}
                                    </a>
                                    <div className="p-2 bg-amber-50/80 border border-amber-200 rounded-lg text-[10px] text-amber-900 leading-snug">
                                        ⚡ Renaming this page automatically updates its title & URL in all navigation menus and linked pages site-wide.
                                    </div>
                                </div>
                            </div>

                            {/* Author Meta Box */}
                            <div className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-2xs">
                                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between font-bold text-xs text-gray-700">
                                    <span>Author</span>
                                    <span className="text-gray-400">&#9650;</span>
                                </div>
                                <div className="p-4">
                                    <select className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none">
                                        <option>Tech Dental (admin)</option>
                                        <option>Clinic Specialist</option>
                                    </select>
                                </div>
                            </div>

                        </div>

                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
