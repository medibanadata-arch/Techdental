import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Pill,
    Search,
    Plus,
    Edit3,
    Trash2,
    ExternalLink,
    Filter,
    Layers,
    Tag,
    Building2,
    DollarSign,
    Sparkles,
    CheckCircle2,
    ChevronRight,
    HelpCircle,
    ShieldCheck
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';

interface MedicineItem {
    id: number;
    slug: string;
    name: string;
    name_bn?: string;
    generic?: string;
    generic_bn?: string;
    category?: string;
    tag?: string;
    tag_bn?: string;
    image?: string;
    pharma?: string;
    price_per_tablet?: string;
    price_per_strip?: string;
    faqs?: any[];
    warnings?: any[];
    uses_items?: any[];
    author?: {
        name?: string;
        img?: string;
    };
    is_active?: boolean;
    sort_order?: number;
}

interface Props extends PageProps {
    data: MedicineItem[];
}

const CATEGORY_MAP: Record<string, string> = {
    all: 'All Categories',
    pain: 'Pain Relief (ব্যথানাশক)',
    antibiotic: 'Antibiotics (অ্যান্টিবায়োটিক)',
    gastric: 'Gastric Care (গ্যাস্ট্রিক)',
    dental_special: 'Dental Special (ডেন্টাল স্পেশাল)',
    supplement: 'Supplements (ভিটামিন ও খনিজ)',
};

export default function MedicinesAdminIndex({ data = [] }: Props) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [quickSelectedId, setQuickSelectedId] = useState<number | string>(data[0]?.id || '');

    // Filter items based on category and search query
    const filteredMedicines = useMemo(() => {
        return data.filter(item => {
            const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
            const matchesSearch =
                !searchQuery.trim() ||
                (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.generic || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.pharma || '').toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCat && matchesSearch;
        });
    }, [data, selectedCategory, searchQuery]);

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
            router.delete(route('medicines.admin.destroy', id), {
                preserveScroll: true,
                onSuccess: () => alert('Medicine deleted successfully.')
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Medicines Management - Tech Dental Admin" />

            <div className="space-y-6">
                {/* 1. Header Bar */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#800038] to-rose-600 text-white flex items-center justify-center font-bold shadow-md shadow-rose-950/20">
                            <Pill size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-extrabold text-gray-900">
                                    Medicines
                                </h1>
                                <span className="bg-rose-100 text-[#800038] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                                    {data.length} Medicines
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-1">
                                Only medicines are listed here. Articles &amp; guides are under <span className="font-semibold text-gray-700">Blog &rarr; Others</span>.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href="/medicines"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-2xs"
                        >
                            <ExternalLink size={14} />
                            View Public Directory
                        </a>
                        <Link
                            href={route('medicines.admin.create')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#800038] hover:bg-[#990044] rounded-xl shadow-sm transition"
                        >
                            <Plus size={16} />
                            Add New Medicine
                        </Link>
                    </div>
                </div>

                {/* 2. Quick Jump to Single Medicine Editor Card */}
                {data.length > 0 && (
                    <div className="bg-gradient-to-r from-rose-50 via-white to-rose-50/50 rounded-2xl border border-rose-200/80 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-rose-100 text-[#800038] flex items-center justify-center font-bold flex-shrink-0">
                                <Edit3 size={18} />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-900 block">
                                    Quick Select Medicine:
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <select
                                value={quickSelectedId}
                                onChange={(e) => setQuickSelectedId(e.target.value)}
                                className="px-3 py-2 text-xs font-medium bg-white border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-rose-600 w-full sm:w-64 cursor-pointer"
                            >
                                {data.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.name} ({m.generic || 'No Generic'})
                                    </option>
                                ))}
                            </select>

                            {quickSelectedId && (
                                <Link
                                    href={route('medicines.admin.edit', quickSelectedId)}
                                    className="px-4 py-2 bg-[#800038] hover:bg-[#990044] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 whitespace-nowrap"
                                >
                                    <span>Edit This Medicine</span>
                                    <ChevronRight size={14} />
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. Filter and Search Bar */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                        {Object.entries(CATEGORY_MAP).map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedCategory(key)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                    selectedCategory === key
                                        ? 'bg-[#800038] text-white shadow-2xs'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search name, generic, pharma..."
                            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-600 transition"
                        />
                    </div>
                </div>

                {/* 4. Directory Table */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50/80 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                                    <th className="py-3.5 px-4">Medicine &amp; Details</th>
                                    <th className="py-3.5 px-4">Category &amp; Tag</th>
                                    <th className="py-3.5 px-4">Manufacturer</th>
                                    <th className="py-3.5 px-4">Pricing</th>
                                    <th className="py-3.5 px-4 text-center">Sections Status</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs">
                                {filteredMedicines.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                                            No medicines found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMedicines.map((item, idx) => (
                                        <tr key={item.id} className="hover:bg-rose-50/20 transition group">
                                            <td className="py-3.5 px-4 text-center font-mono text-gray-400">
                                                {idx + 1}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                        {item.image ? (
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="max-h-full max-w-full object-contain"
                                                            />
                                                        ) : (
                                                            <Pill size={18} className="text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={route('medicines.admin.edit', item.id)}
                                                            className="font-bold text-gray-900 text-sm hover:text-[#800038] transition block"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                        <div className="text-xs text-gray-500 font-medium">
                                                            {item.generic || 'Formula not specified'}
                                                        </div>
                                                        {item.name_bn && (
                                                            <div className="text-[11px] text-[#800038] font-medium">
                                                                বাংলা: {item.name_bn}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 capitalize">
                                                    {item.category?.replace('_', ' ') || 'General'}
                                                </span>
                                                {item.tag && (
                                                    <div className="text-[10px] text-rose-600 font-semibold mt-1">
                                                        {item.tag}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 font-medium text-gray-700">
                                                {item.pharma || 'Square Pharma PLC'}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="font-bold text-gray-900">
                                                    {item.price_per_tablet ? `${item.price_per_tablet}/tab` : '—'}
                                                </div>
                                                {item.price_per_strip && (
                                                    <div className="text-[10px] text-gray-500">
                                                        Strip: {item.price_per_strip}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                <div className="inline-flex flex-wrap gap-1 justify-center max-w-[140px]">
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium border border-emerald-200" title="Uses & Dosage">
                                                        Uses
                                                    </span>
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium border border-blue-200" title="Warnings">
                                                        Warnings
                                                    </span>
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-medium border border-amber-200" title="FAQs">
                                                        {item.faqs?.length ? `${item.faqs.length} FAQs` : 'FAQ'}
                                                    </span>
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-medium border border-purple-200" title="Author Profile">
                                                        Reviewer
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    <a
                                                        href={`/medicines/${item.slug || item.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                                                        title="View Live Single Medicine Page"
                                                    >
                                                        <ExternalLink size={15} />
                                                    </a>
                                                    <Link
                                                        href={route('medicines.admin.edit', item.id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#800038] hover:bg-[#990044] text-white rounded-lg text-xs font-bold shadow-2xs transition"
                                                        title="Edit All Sections (Full A-Z CMS)"
                                                    >
                                                        <Edit3 size={13} />
                                                        <span>Edit Page</span>
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(item.id, item.name)}
                                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                                        title="Delete Medicine"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
