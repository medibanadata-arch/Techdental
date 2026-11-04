import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Files, 
    ExternalLink, 
    Eye, 
    Sparkles, 
    Search,
    LayoutGrid, 
    Pill, 
    DollarSign, 
    MapPin, 
    Users, 
    BookOpen, 
    Calendar,
    ArrowUpRight,
    Sliders,
    Globe,
    Layers,
    CheckCircle2,
    Award
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';

interface PageItem {
    id: number;
    title: string;
    slug: string;
    content: string;
    created_at?: string;
    blocks?: any;
}

interface Props extends PageProps {
    pages: PageItem[];
}

const PAGE_CONFIG: Record<string, {
    category: string;
    icon: React.ElementType;
    backendUrl: string;
    backendLabel: string;
    publicUrl: string;
    badgeColor: string;
    sections: string[];
}> = {
    'home': {
        category: 'Core Frontend',
        icon: LayoutGrid,
        backendUrl: '/homepage-cms',
        backendLabel: 'Edit Homepage Sections',
        publicUrl: '/',
        badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
        sections: ['1. Hero Slider & Equipment Gallery', '2. 4 Action Buttons & Status', '3. Our Branches Strip', '4. Services Treatments', '5. Specialist Doctors', '6. More About (SEO & FAQs)']
    },
    'best-dentist-in-dhaka': {
        category: 'Specialist Directory',
        icon: Award,
        backendUrl: '/doctors-admin',
        backendLabel: 'Manage Doctors Directory',
        publicUrl: '/doctors',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        sections: ['1. Verified Dentists Grid', '2. Location Filter', '3. Clinic Panel Credentials', '4. Patient FAQ Schema', '5. More About (SEO)']
    },
    'mirpur': {
        category: 'Branch Page',
        icon: MapPin,
        backendUrl: '/branch-admin',
        backendLabel: 'Edit Mirpur Branch',
        publicUrl: '/branch/mirpur',
        badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
        sections: ['1. Clinic Info & Hours', '2. 4 Action Buttons & Book Now', '3. Assigned Doctors', '4. Treatments', '5. More About Mirpur (SEO)']
    },
    'uttara': {
        category: 'Branch Page',
        icon: MapPin,
        backendUrl: '/branch-admin',
        backendLabel: 'Edit Uttara Branch',
        publicUrl: '/branch/uttara',
        badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
        sections: ['1. Clinic Info & Hours', '2. 4 Action Buttons & Book Now', '3. Assigned Doctors', '4. Treatments', '5. More About Uttara (SEO)']
    },
    'badda': {
        category: 'Branch Page',
        icon: MapPin,
        backendUrl: '/branch-admin',
        backendLabel: 'Edit Badda Branch',
        publicUrl: '/branch/badda',
        badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
        sections: ['1. Clinic Info & Hours', '2. 4 Action Buttons & Book Now', '3. Assigned Doctors', '4. Treatments', '5. More About Badda (SEO)']
    },
    'jatrabari': {
        category: 'Branch Page',
        icon: MapPin,
        backendUrl: '/branch-admin',
        backendLabel: 'Edit Jatrabari Branch',
        publicUrl: '/branch/jatrabari',
        badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
        sections: ['1. Clinic Info & Hours', '2. 4 Action Buttons & Book Now', '3. Assigned Doctors', '4. Treatments', '5. More About Jatrabari (SEO)']
    },
    'branch-mirpur': {
        category: 'Branch Page',
        icon: MapPin,
        backendUrl: '/branch-admin',
        backendLabel: 'Edit Mirpur Branch',
        publicUrl: '/branch/mirpur',
        badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
        sections: ['1. Clinic Info & Hours', '2. 4 Action Buttons & Book Now', '3. Assigned Doctors', '4. Treatments', '5. More About Mirpur (SEO)']
    },
    'branch-uttara': {
        category: 'Branch Page',
        icon: MapPin,
        backendUrl: '/branch-admin',
        backendLabel: 'Edit Uttara Branch',
        publicUrl: '/branch/uttara',
        badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
        sections: ['1. Clinic Info & Hours', '2. 4 Action Buttons & Book Now', '3. Assigned Doctors', '4. Treatments', '5. More About Uttara (SEO)']
    },
    'branch-badda': {
        category: 'Branch Page',
        icon: MapPin,
        backendUrl: '/branch-admin',
        backendLabel: 'Edit Badda Branch',
        publicUrl: '/branch/badda',
        badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
        sections: ['1. Clinic Info & Hours', '2. 4 Action Buttons & Book Now', '3. Assigned Doctors', '4. Treatments', '5. More About Badda (SEO)']
    },
    'branch-jatrabari': {
        category: 'Branch Page',
        icon: MapPin,
        backendUrl: '/branch-admin',
        backendLabel: 'Edit Jatrabari Branch',
        publicUrl: '/branch/jatrabari',
        badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
        sections: ['1. Clinic Info & Hours', '2. 4 Action Buttons & Book Now', '3. Assigned Doctors', '4. Treatments', '5. More About Jatrabari (SEO)']
    },
    'branches': {
        category: 'Branch Hub',
        icon: MapPin,
        backendUrl: '/branch-admin',
        backendLabel: 'Manage All Branches',
        publicUrl: '/branches',
        badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
        sections: ['1. All Clinics Overview', '2. Operating Hours', '3. Hotlines & Maps', '4. More About (SEO)']
    },
    'services': {
        category: 'Clinical Directory',
        icon: Sparkles,
        backendUrl: '/services-admin',
        backendLabel: 'Edit Services Page',
        publicUrl: '/services',
        badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
        sections: ['1. Procedure Catalog', '2. Pricing Cards', '3. Treatment Info', '4. More About (SEO)']
    },
    'price-list': {
        category: 'Clinical Directory',
        icon: DollarSign,
        backendUrl: '/price-list-admin',
        backendLabel: 'Edit Price List Page',
        publicUrl: '/price-list',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        sections: ['1. Transparent Rates Table', '2. EMI Options', '3. More About (SEO)']
    },
    'doctors': {
        category: 'Clinical Directory',
        icon: Users,
        backendUrl: '/doctors-admin',
        backendLabel: 'Edit Doctors Page',
        publicUrl: '/doctors',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
        sections: ['1. Specialist Doctors Grid', '2. Visiting Hours', '3. Qualifications', '4. More About (SEO)']
    },
    'about': {
        category: 'Clinic Profile',
        icon: Files,
        backendUrl: '/about-cms',
        backendLabel: 'Edit About Us Page',
        publicUrl: '/about',
        badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        sections: ['1. Hero Banner', '2. Our Story & Video', '3. Equipment Cards', '4. Vision & Mission', '5. Why Us', '6. More About (SEO)']
    },
    'team': {
        category: 'Clinic Profile',
        icon: Users,
        backendUrl: '/team-admin',
        backendLabel: 'Edit Corporate Team',
        publicUrl: '/team',
        badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
        sections: ['1. Executive Profiles', '2. Designations & Bios', '3. More About (SEO)']
    },
    'appointment': {
        category: 'Core Frontend',
        icon: Calendar,
        backendUrl: '/appointments',
        backendLabel: 'Manage Appointments',
        publicUrl: '/appointment',
        badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
        sections: ['1. Booking Form', '2. Branch & Doctor Selectors', '3. Patient Requests List']
    },
    'blog': {
        category: 'Core Frontend',
        icon: BookOpen,
        backendUrl: '/posts',
        backendLabel: 'Manage Blog & Guides',
        publicUrl: '/blog',
        badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
        sections: ['1. Articles & Guides', '2. Categories & Tags', '3. Medicines Directory']
    },
    'medicines': {
        category: 'Clinical Directory',
        icon: Pill,
        backendUrl: '/medicines-admin',
        backendLabel: 'Manage Medicines',
        publicUrl: '/medicines',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
        sections: ['1. Medicine Directory', '2. Dental Prescriptions', '3. Dosage Info']
    },
    'privacy-policy': {
        category: 'Legal & Info',
        icon: Files,
        backendUrl: '',
        backendLabel: 'GrapesJS Builder',
        publicUrl: '/page/privacy-policy',
        badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
        sections: ['1. Policy Content', '2. Legal Disclaimers']
    },
    'terms-of-service': {
        category: 'Legal & Info',
        icon: Files,
        backendUrl: '',
        backendLabel: 'GrapesJS Builder',
        publicUrl: '/page/terms-of-service',
        badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
        sections: ['1. Terms & Conditions', '2. Patient Guidelines']
    },
};

export default function CustomPagesIndex({ pages = [] }: Props) {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'core' | 'custom'>('all');

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            router.delete(route('pages.destroy', id));
        }
    };

    const filteredPages = pages.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                              p.slug.toLowerCase().includes(search.toLowerCase());
        const isCore = !!PAGE_CONFIG[p.slug];
        
        if (activeTab === 'core') return matchesSearch && isCore;
        if (activeTab === 'custom') return matchesSearch && !isCore;
        return matchesSearch;
    });

    const corePagesCount = pages.filter(p => !!PAGE_CONFIG[p.slug]).length;
    const customPagesCount = pages.filter(p => !PAGE_CONFIG[p.slug]).length;

    return (
        <AdminLayout>
            <Head title="Custom Pages & Frontend Portals - Tech Dental" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
                                <Files size={24} className="text-[#800038]" />
                                All Website Pages
                            </h1>
                            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-extrabold bg-[#800038]/10 text-[#800038] border border-rose-200">
                                {pages.length} Pages
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('pages.create')}
                            className="inline-flex items-center gap-2 bg-[#800038] hover:bg-[#990044] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all"
                        >
                            <Plus size={16} />
                            <span>Create New Page (Visual Builder)</span>
                        </Link>
                    </div>
                </div>

                {/* Metrics / Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3">
                        <div className="p-3 bg-rose-50 text-rose-700 rounded-xl">
                            <Globe size={20} />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-gray-900">{pages.length}</div>
                            <div className="text-xs text-gray-500 font-medium">Total Registered Pages</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3">
                        <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                            <CheckCircle2 size={20} />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-gray-900">{corePagesCount}</div>
                            <div className="text-xs text-gray-500 font-medium">Core Frontend Pages (CMS Linked)</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3">
                        <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
                            <Layers size={20} />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-gray-900">{customPagesCount}</div>
                            <div className="text-xs text-gray-500 font-medium">Custom Visual Pages</div>
                        </div>
                    </div>
                </div>

                {/* Search & Filter Tabs */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => setActiveTab('all')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                                activeTab === 'all' 
                                    ? 'bg-[#800038] text-white shadow-xs' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            All Pages ({pages.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('core')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                                activeTab === 'core' 
                                    ? 'bg-[#800038] text-white shadow-xs' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Core Pages ({corePagesCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('custom')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                                activeTab === 'custom' 
                                    ? 'bg-[#800038] text-white shadow-xs' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Custom Pages ({customPagesCount})
                        </button>
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={15} />
                        <input
                            type="text"
                            placeholder="Search page title or slug..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#800038] focus:ring-1 focus:ring-[#800038]"
                        />
                    </div>
                </div>

                {/* Pages Table */}
                <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-gray-600">
                            <thead className="bg-gray-50/80 text-gray-700 font-bold border-b border-gray-200 uppercase tracking-wider text-[11px]">
                                <tr>
                                    <th className="p-4">Page Title & Type</th>
                                    <th className="p-4">Page Sections & More About (SEO)</th>
                                    <th className="p-4">Frontend URL</th>
                                    <th className="p-4 text-right">Edit Sections & Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredPages.map((p) => {
                                    const config = PAGE_CONFIG[p.slug] || PAGE_CONFIG[p.slug.replace(/^branch-/, '')];
                                    const IconComponent = config?.icon || Files;
                                    const publicUrl = config?.publicUrl || (p.slug === 'home' ? '/' : `/page/${p.slug}`);
                                    const backendUrl = (p.slug === 'best-dentist-in-dhaka' || !config?.backendUrl)
                                        ? route('pages.edit', p.id)
                                        : config.backendUrl;
                                    const backendLabel = config?.backendLabel || `Edit ${p.title}`;

                                    return (
                                        <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                                            {/* Title & Category */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 bg-[#800038]/10 text-[#800038] rounded-xl shrink-0">
                                                        <IconComponent size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                                            <span>{p.title}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${config?.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                                                {config?.category || 'Custom Page'}
                                                            </span>
                                                            <span className="text-[11px] text-gray-400">
                                                                Slug: {p.slug}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Sections Breakdown */}
                                            <td className="p-4 max-w-md">
                                                {config?.sections && config.sections.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {config.sections.map((sec, sIdx) => (
                                                            <span
                                                                key={sIdx}
                                                                className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                                                                    sec.includes('More About') || sec.includes('SEO')
                                                                        ? 'bg-rose-100 text-rose-800 font-bold border border-rose-300'
                                                                        : 'bg-gray-100 text-gray-700'
                                                                }`}
                                                            >
                                                                {sec}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-xs italic">Default layout sections</span>
                                                )}
                                            </td>

                                            {/* Frontend URL */}
                                            <td className="p-4 font-mono text-xs">
                                                <a
                                                    href={publicUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="bg-gray-100 hover:bg-rose-50 hover:text-rose-700 text-gray-700 px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 transition font-semibold"
                                                    title="Open Live Public Frontend Page"
                                                >
                                                    <span>{publicUrl}</span>
                                                    <ExternalLink size={12} className="text-gray-400" />
                                                </a>
                                            </td>

                                            {/* Actions */}
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={backendUrl}
                                                        className="inline-flex items-center gap-1.5 bg-[#800038] hover:bg-[#990044] text-white px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-xs transition"
                                                    >
                                                        <Sliders size={13} />
                                                        <span>{backendLabel}</span>
                                                        <ArrowUpRight size={13} />
                                                    </Link>
                                                    <a
                                                        href={publicUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-2 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition border border-gray-200 bg-white"
                                                        title="View Live Page"
                                                    >
                                                        <Eye size={15} />
                                                    </a>
                                                    {!config && (
                                                        <button
                                                            onClick={() => handleDelete(p.id, p.title)}
                                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition border border-gray-200 bg-white"
                                                            title="Delete Page"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
