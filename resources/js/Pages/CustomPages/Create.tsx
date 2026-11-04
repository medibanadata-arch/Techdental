import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import RichContentEditor from '@/Components/RichContentEditor';
import { 
    ArrowLeft, Sparkles, Image as ImageIcon, Plus, 
    Bold, Italic, List, ListOrdered, Quote, AlignLeft, 
    AlignCenter, AlignRight, Link2, Eye, HelpCircle, 
    Calendar, Lock, Globe, Check, Trash2
} from 'lucide-react';

export default function CustomPagesCreate() {
    const [editorTab, setEditorTab] = useState<'visual' | 'text'>('visual');
    const [wordCount, setWordCount] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        content: '',
        status: 'draft',
    });

    const handleContentChange = (val: string) => {
        setData('content', val);
        const text = val.replace(/<[^>]*>/g, ' ').trim();
        setWordCount(text ? text.split(/\s+/).length : 0);
    };

    const handleEditWithBuilder = (e: React.MouseEvent) => {
        e.preventDefault();
        // Create quick draft and jump directly to full-screen visual builder!
        router.post(route('pages.quick-draft'), {
            title: data.title || 'New Untitled Page',
            content: data.content || '',
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pages.store'));
    };

    return (
        <AdminLayout>
            <Head title="Add Page — Tech Dental WordPress Style" />

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
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Add Page</h1>
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
                                    onChange={(e) => {
                                        const newTitle = e.target.value;
                                        setData({
                                            ...data,
                                            title: newTitle,
                                            slug: data.slug || newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                                        });
                                    }}
                                    className="w-full text-2xl font-bold text-gray-900 placeholder:text-gray-300 border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition shadow-2xs"
                                />
                                {errors.title && <span className="text-red-500 text-xs mt-1 block">{errors.title}</span>}
                            </div>

                            {/* "Edit with Visual Builder" Button (Identical to 'Edit with Elementor') */}
                            <div>
                                <button
                                    type="button"
                                    onClick={handleEditWithBuilder}
                                    className="w-full sm:w-auto inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer text-sm tracking-wide transform hover:-translate-y-0.5"
                                >
                                    <Sparkles size={18} className="text-amber-300 animate-pulse" />
                                    <span>Edit with Visual Builder</span>
                                    <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full ml-1">Full Screen</span>
                                </button>
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
                                        <button
                                            type="button"
                                            onClick={handleEditWithBuilder}
                                            className="px-3.5 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 border border-gray-300 text-blue-700 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                                        >
                                            <Eye size={12} />
                                            <span>Visual Builder</span>
                                        </button>
                                    </div>

                                    {/* Status Info Rows */}
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Lock size={13} className="text-gray-400" />
                                        <span>Status:</span>
                                        <strong className="text-gray-800">Draft</strong>
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
                                        <span>Publish:</span>
                                        <strong className="text-gray-800">Immediately</strong>
                                        <a href="#edit" className="text-blue-600 underline ml-auto">Edit</a>
                                    </div>
                                </div>

                                {/* Publish Box Bottom Row */}
                                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                                    <Link
                                        href={route('pages.index')}
                                        className="text-red-600 hover:text-red-700 text-xs font-semibold underline"
                                    >
                                        Cancel
                                    </Link>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm hover:shadow transition disabled:opacity-50 cursor-pointer"
                                    >
                                        {processing ? 'Publishing...' : 'Publish'}
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
                                <div className="p-4 space-y-2 text-xs">
                                    <label className="text-gray-500 block">URL Slug:</label>
                                    <div className="flex items-center">
                                        <span className="bg-gray-100 border border-r-0 border-gray-300 text-gray-500 px-2 py-1.5 rounded-l-md font-mono text-[11px]">
                                            /page/
                                        </span>
                                        <input
                                            type="text"
                                            value={data.slug}
                                            onChange={(e) => setData('slug', e.target.value)}
                                            className="w-full text-xs font-mono border border-gray-300 rounded-r-md px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                            placeholder="my-page-slug"
                                        />
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
