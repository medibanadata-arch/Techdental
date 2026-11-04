import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Sparkles,
    Plus,
    Edit3,
    Trash2,
    ExternalLink,
    Search,
    Layers,
    DollarSign,
    CheckCircle,
    Eye,
    Tag
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';

interface ServiceItem {
    id: number;
    title: string;
    category?: string;
    slug?: string;
    price?: string;
    price_suffix?: string;
    short_desc?: string;
    hero_main?: string;
    status?: string;
    rank_order?: number;
}

interface Props extends PageProps {
    data: ServiceItem[];
}

export default function ServicesAdminIndex({ data = [] }: Props) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Extract unique categories
    const categories = ['All', ...Array.from(new Set(data.map(d => d.category).filter(Boolean)))];

    const filtered = data.filter(s => {
        const matchesSearch = !search ||
            s.title?.toLowerCase().includes(search.toLowerCase()) ||
            s.short_desc?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || s.category?.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this service?')) {
            router.delete(route('services.admin.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Services Management - Admin Dashboard" />

            {/* Header matching Document 1 */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8f163b] to-pink-600 text-white flex items-center justify-center font-bold shadow-md">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-gray-900">Services &amp; Pricing</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href="/services"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-2xs"
                    >
                        <ExternalLink size={14} />
                        View Public Catalog
                    </a>
                    <Link
                        href={route('services.admin.create')}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#8f163b] hover:bg-[#73102f] rounded-xl shadow-sm transition"
                    >
                        <Plus size={16} />
                        Create New Service
                    </Link>
                </div>
            </div>

            {/* Category Filter Pills & Search */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-4 mb-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-1 flex items-center gap-1">
                            <Tag size={12} /> Category:
                        </span>
                        {categories.map((cat) => (
                          <button
                            key={cat as string}
                            type="button"
                            onClick={() => setSelectedCategory(cat as string)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                              selectedCategory === cat
                                ? "bg-[#8f163b] text-white shadow-xs"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search dental services..."
                            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8f163b]"
                        />
                    </div>
                </div>
            </div>

            {/* Table matching Document 1 */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-900">All Published Services</h3>
                    <span className="text-xs text-gray-500 font-medium">
                        Showing <strong>{filtered.length}</strong> services
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                                <th className="p-4 font-semibold">Service Info</th>
                                <th className="p-4 font-semibold">Category</th>
                                <th className="p-4 font-semibold">Starting Price</th>
                                <th className="p-4 font-semibold">Rank</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filtered.map((s) => (
                                <tr key={s.id} className="hover:bg-gray-50/70 transition">
                                    <td className="p-4 flex items-center gap-3">
                                        <img
                                            src={s.hero_main || "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=100&q=80"}
                                            alt={s.title}
                                            className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-200"
                                        />
                                        <div>
                                            <div className="font-bold text-gray-900 line-clamp-1">{s.title}</div>
                                            <div className="text-gray-500 text-xs line-clamp-1">{s.short_desc || s.slug}</div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2.5 py-1 bg-rose-50 text-[#8f163b] rounded-md text-xs font-bold border border-rose-100">
                                            {s.category || "General"}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-gray-800">
                                        {s.price || "৳ 1,000"}
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-bold">
                                            {s.rank_order || 1}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                            s.status === 'Draft'
                                                ? 'bg-amber-100 text-amber-800'
                                                : 'bg-emerald-100 text-emerald-800'
                                        }`}>
                                            {s.status || 'Published'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <a
                                                href={`/services/${s.slug}`}
                                                target="_blank"
                                                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                                title="View Public Page"
                                            >
                                                <Eye size={16} />
                                            </a>
                                            <Link
                                                href={route('services.admin.edit', s.id)}
                                                className="text-[#8f163b] hover:text-[#73102f] font-semibold text-xs px-2.5 py-1 rounded-lg hover:bg-rose-50 transition"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(s.id)}
                                                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                                title="Delete Service"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-400 text-xs">
                                        No services found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
