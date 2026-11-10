import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Search, Edit3, Trash2, ExternalLink, ChevronRight, FileText, CheckCircle2 } from 'lucide-react';
import { PageProps } from '@inertiajs/core';

interface PostItem {
    id: number;
    title: string;
    title_bn?: string;
    slug: string;
    author_name?: string;
    category?: string;
    tags?: string;
    status: 'published' | 'draft' | 'trash';
    created_at: string;
    published_at?: string;
}

interface Counts {
    all: number;
    published: number;
    drafts: number;
    trash: number;
}

interface Props extends PageProps {
    posts?: PostItem[];
    data?: PostItem[];
    counts?: Counts;
    pageTitle?: string;
    badgeLabel?: string;
    isOthers?: boolean;
}

export default function PostsIndex(props: Props) {
    const posts: PostItem[] = props.posts || (props as any).data || [];
    const counts: Counts = props.counts || {
        all: posts.filter(p => p.status !== 'trash').length,
        published: posts.filter(p => p.status === 'published').length,
        drafts: posts.filter(p => p.status === 'draft').length,
        trash: posts.filter(p => p.status === 'trash').length,
    };
    const pageTitle = props.pageTitle || 'Blog & Articles';
    const categories = Array.from(new Set(posts.map(p => p.category).filter(Boolean))) as string[];
    const [activeTab, setActiveTab] = useState<'all' | 'published' | 'drafts' | 'trash'>('all');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedDate, setSelectedDate] = useState('All dates');
    const [bulkAction, setBulkAction] = useState('');
    const [quickSelectedId, setQuickSelectedId] = useState<number | string>(posts[0]?.id || '');

    // Filter posts according to active tab, search, and category
    const filteredPosts = posts.filter(post => {
        if (activeTab === 'published' && post.status !== 'published') return false;
        if (activeTab === 'drafts' && post.status !== 'draft') return false;
        if (activeTab === 'trash' && post.status !== 'trash') return false;
        if (activeTab === 'all' && post.status === 'trash') return false;

        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            const matchTitle = post.title.toLowerCase().includes(query);
            const matchAuthor = (post.author_name || '').toLowerCase().includes(query);
            if (!matchTitle && !matchAuthor) return false;
        }

        if (selectedCategory !== 'All Categories' && post.category !== selectedCategory) {
            return false;
        }

        return true;
    });

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(filteredPosts.map(p => p.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(item => item !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleMoveToTrash = (id: number) => {
        if (confirm('Move this post to trash?')) {
            router.delete(route('posts.destroy', id), { preserveScroll: true });
        }
    };

    const handleRestore = (id: number) => {
        router.post(route('posts.restore', id), {}, { preserveScroll: true });
    };

    const handleForceDelete = (id: number) => {
        if (confirm('Are you sure you want to permanently delete this post?')) {
            router.delete(route('posts.force-delete', id), { preserveScroll: true });
        }
    };

    const handleApplyBulkAction = () => {
        if (!bulkAction || selectedIds.length === 0) {
            alert('Please select an action and at least one post.');
            return;
        }

        if (bulkAction === 'delete') {
            if (activeTab === 'trash') {
                if (confirm(`Permanently delete ${selectedIds.length} selected item(s)?`)) {
                    selectedIds.forEach(id => router.delete(route('posts.force-delete', id), { preserveScroll: true }));
                    setSelectedIds([]);
                }
            } else {
                selectedIds.forEach(id => router.delete(route('posts.destroy', id), { preserveScroll: true }));
                setSelectedIds([]);
            }
        } else if (bulkAction === 'restore' && activeTab === 'trash') {
            selectedIds.forEach(id => router.post(route('posts.restore', id), {}, { preserveScroll: true }));
            setSelectedIds([]);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Sep 16, 2026';
        const d = new Date(dateString);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <AdminLayout>
            <Head title={`${pageTitle} - Tech Dental`} />

            <div className="space-y-5 font-sans text-slate-800">
                {/* 1. Header: Title + Add Post Button */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#800038] to-rose-600 text-white flex items-center justify-center font-bold shadow-md shadow-rose-950/20">
                            <FileText size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-extrabold text-gray-900">
                                    {pageTitle}
                                </h1>
                                <span className="bg-rose-100 text-[#800038] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                                    {props.badgeLabel || `${posts.length} Blogs`}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href={props.isOthers ? '/blog/others' : '/blog'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-2xs"
                        >
                            <ExternalLink size={14} />
                            {props.isOthers ? 'View Public Others' : 'View Public Blog'}
                        </a>
                        <Link
                            href={route('posts.create')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#800038] hover:bg-[#990044] text-white text-xs font-bold rounded-xl shadow-sm transition"
                        >
                            <Plus size={16} />
                            <span>Write New Single Blog</span>
                        </Link>
                    </div>
                </div>

                {/* 2. Quick Select Single Blog Dropdown Card */}
                {posts.length > 0 && (
                    <div className="bg-gradient-to-r from-rose-50 via-white to-rose-50/50 rounded-2xl border border-rose-200/80 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-rose-100 text-[#800038] flex items-center justify-center font-bold flex-shrink-0">
                                <Edit3 size={18} />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-900 block">
                                    Quick Select Single Blog to Edit (Full A-Z Page):
                                </span>
                                <span className="text-[11px] text-gray-500">
                                    Instantly jump to editing any blog's content, author, FAQs, and titles
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <select
                                value={quickSelectedId}
                                onChange={(e) => setQuickSelectedId(e.target.value)}
                                className="px-3 py-2 text-xs font-medium bg-white border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-rose-600 w-full sm:w-72 cursor-pointer"
                            >
                                {posts.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.title}
                                    </option>
                                ))}
                            </select>

                            {quickSelectedId && (
                                <Link
                                    href={route('posts.edit', quickSelectedId)}
                                    className="px-4 py-2 bg-[#800038] hover:bg-[#990044] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 whitespace-nowrap"
                                >
                                    <span>Edit This Blog</span>
                                    <ChevronRight size={14} />
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. Filter Tabs: All | Published | Drafts | Trash */}
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium px-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab('all')}
                        className={`hover:text-rose-700 cursor-pointer ${activeTab === 'all' ? 'font-bold text-[#800038] border-b-2 border-[#800038] pb-1' : ''}`}
                    >
                        All Blogs ({counts.all})
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                        type="button"
                        onClick={() => setActiveTab('published')}
                        className={`hover:text-rose-700 cursor-pointer ${activeTab === 'published' ? 'font-bold text-[#800038] border-b-2 border-[#800038] pb-1' : ''}`}
                    >
                        Published ({counts.published})
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                        type="button"
                        onClick={() => setActiveTab('drafts')}
                        className={`hover:text-rose-700 cursor-pointer ${activeTab === 'drafts' ? 'font-bold text-[#800038] border-b-2 border-[#800038] pb-1' : ''}`}
                    >
                        Drafts ({counts.drafts})
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                        type="button"
                        onClick={() => setActiveTab('trash')}
                        className={`hover:text-rose-700 cursor-pointer ${activeTab === 'trash' ? 'font-bold text-[#800038] border-b-2 border-[#800038] pb-1' : ''}`}
                    >
                        Trash ({counts.trash})
                    </button>
                </div>

                {/* 4. Controls: Bulk Actions & Filter & Search */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <select
                            value={bulkAction}
                            onChange={e => setBulkAction(e.target.value)}
                            className="bg-white border border-slate-300 text-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium cursor-pointer"
                        >
                            <option value="">Bulk Actions</option>
                            {activeTab === 'trash' ? (
                                <>
                                    <option value="restore">Restore Selected</option>
                                    <option value="delete">Delete Permanently</option>
                                </>
                            ) : (
                                <option value="delete">Move to Trash</option>
                            )}
                        </select>
                        <button
                            type="button"
                            onClick={handleApplyBulkAction}
                            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                            Apply
                        </button>

                        <select
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                            className="bg-white border border-slate-300 text-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium cursor-pointer"
                        >
                            <option value="All Categories">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Right Search Input */}
                    <div className="relative w-full md:w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search blog title, author..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 text-slate-700 placeholder-slate-400 text-xs rounded-xl focus:outline-none focus:border-rose-600 font-medium"
                        />
                    </div>
                </div>

                {/* 5. Posts Data Table */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-gray-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                    <th className="py-3.5 px-4 w-10 text-center">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={filteredPosts.length > 0 && selectedIds.length === filteredPosts.length}
                                            className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                                        />
                                    </th>
                                    <th className="py-3.5 px-4">Blog Title &amp; Slug</th>
                                    <th className="py-3.5 px-4">Author Profile</th>
                                    <th className="py-3.5 px-4">Category</th>
                                    <th className="py-3.5 px-4">Date</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs">
                                {filteredPosts.length > 0 ? (
                                    filteredPosts.map(post => (
                                        <tr key={post.id} className="group hover:bg-rose-50/20 transition-colors">
                                            <td className="py-4 px-4 text-center align-middle">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(post.id)}
                                                    onChange={() => handleSelectOne(post.id)}
                                                    className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                                                />
                                            </td>
                                            <td className="py-4 px-4 align-middle">
                                                <div className="font-bold text-slate-900 text-sm leading-snug flex items-center gap-2">
                                                    <Link
                                                        href={route('posts.edit', post.id)}
                                                        className="hover:text-[#800038] transition"
                                                    >
                                                        {post.title}
                                                    </Link>
                                                    {post.status === 'draft' && (
                                                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                                                            Draft
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                                                    slug: /blog/{post.slug}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-slate-700 font-semibold align-middle whitespace-nowrap">
                                                {post.author_name || 'Tech Dental Specialist'}
                                            </td>
                                            <td className="py-4 px-4 align-middle whitespace-nowrap">
                                                <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                                                    {post.category || 'Dental Care'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-slate-600 font-medium align-middle whitespace-nowrap">
                                                {formatDate(post.created_at)}
                                            </td>
                                            <td className="py-4 px-4 text-right align-middle whitespace-nowrap">
                                                <div className="inline-flex items-center gap-2">
                                                    <a
                                                        href={`/blog/${post.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                                                        title="View Live Single Blog Post"
                                                    >
                                                        <ExternalLink size={15} />
                                                    </a>
                                                    <Link
                                                        href={route('posts.edit', post.id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#800038] hover:bg-[#990044] text-white rounded-lg text-xs font-bold shadow-2xs transition"
                                                        title="Edit Single Blog (All Sections, FAQ, Author, Content)"
                                                    >
                                                        <Edit3 size={13} />
                                                        <span>Edit Single Blog</span>
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMoveToTrash(post.id)}
                                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                                        title="Trash Post"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                                            No blog posts found matching your filter.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
