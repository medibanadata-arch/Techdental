import React, { useState, useMemo, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    MapPin,
    Clock,
    Phone,
    Image as ImageIcon,
    Sparkles,
    Users,
    Search,
    Save,
    ExternalLink,
    CheckCircle2,
    Plus,
    Trash2,
    Star,
    Navigation,
    MessageSquare,
    Calendar,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';
import RichContentEditor from '@/Components/RichContentEditor';
import SeoMetaBox, { SeoMetaData } from '@/Components/SeoMetaBox';

interface BranchLocation {
    id: number;
    name: string;
    short_name?: string;
    slug?: string;
    address: string;
    address_main?: string;
    address_sub?: string;
    landmark?: string;
    phone?: string;
    whatsapp?: string;
    booking_url?: string;
    call_label?: string;
    directions_label?: string;
    whatsapp_label?: string;
    book_label?: string;
    appointment_btn_label?: string;
    more_about_title?: string;
    hours_text?: string;
    morning_hours?: string;
    evening_hours?: string;
    working_days?: string;
    off_days?: string;
    time?: string;
    map_url?: string;
    review_url?: string;
    reviews_text?: string;
    seo_title?: string;
    meta_desc?: string;
    canonical_url?: string;
    robots_index?: boolean;
    robots_follow?: boolean;
    schema_type?: string;
    schema_json?: string;
    faqs?: any[];
    seo_content?: string;
}

interface Props extends PageProps {
    branches: BranchLocation[];
    doctors: any[];
    services: any[];
    gallery: any[];
}

export default function BranchAdminIndex({ branches = [], doctors = [], services = [], gallery = [] }: Props) {
    const [selectedBranchId, setSelectedBranchId] = useState<number>(branches[0]?.id || 0);
    const [activeTab, setActiveTab] = useState<'info' | 'gallery' | 'services' | 'doctors' | 'seo'>('info');
    const [isSaving, setIsSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Add branch modal state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isCreatingBranch, setIsCreatingBranch] = useState(false);
    const [newBranch, setNewBranch] = useState({
        name: '',
        address: '',
        phone: '01400786162',
        whatsapp: '+8801400786162',
        hours_text: 'Saturday – Thursday: 10:00 AM – 9:00 PM',
    });

    const handleCreateBranch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreatingBranch(true);
        router.post(route('branch.admin.store'), newBranch, {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreatingBranch(false);
                setIsAddModalOpen(false);
                setStatusMessage({ type: 'success', text: `✓ New branch "${newBranch.name}" created successfully!` });
                setNewBranch({
                    name: '',
                    address: '',
                    phone: '01400786162',
                    whatsapp: '+8801400786162',
                    hours_text: 'Saturday – Thursday: 10:00 AM – 9:00 PM'
                });
                setTimeout(() => setStatusMessage(null), 5000);
            },
            onError: (errs) => {
                setIsCreatingBranch(false);
                const first = Object.values(errs)[0] || 'Failed to create branch.';
                alert(first);
            }
        });
    };

    const handleDeleteBranch = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete branch "${name}"? This action cannot be undone.`)) {
            router.delete(route('branch.admin.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    setStatusMessage({ type: 'success', text: `✓ Branch "${name}" deleted.` });
                    setTimeout(() => setStatusMessage(null), 5000);
                }
            });
        }
    };

    const selectedBranch = useMemo(() => {
        return branches.find(b => b.id === selectedBranchId) || branches[0] || null;
    }, [branches, selectedBranchId]);

    const [form, setForm] = useState({
        name: selectedBranch?.name || '',
        address: selectedBranch?.address || '',
        address_main: selectedBranch?.address_main || '',
        address_sub: selectedBranch?.address_sub || '',
        landmark: selectedBranch?.landmark || '',
        phone: selectedBranch?.phone || '',
        whatsapp: selectedBranch?.whatsapp || '',
        booking_url: selectedBranch?.booking_url || '',
        call_label: selectedBranch?.call_label || 'Call',
        directions_label: selectedBranch?.directions_label || 'Directions',
        whatsapp_label: selectedBranch?.whatsapp_label || 'WhatsApp',
        book_label: selectedBranch?.book_label || 'Book',
        appointment_btn_label: selectedBranch?.appointment_btn_label || 'Book Now',
        more_about_title: selectedBranch?.more_about_title || '',
        hours_text: selectedBranch?.hours_text || selectedBranch?.time || 'Saturday – Thursday: 10:00 AM – 9:00 PM',
        morning_hours: selectedBranch?.morning_hours || '',
        evening_hours: selectedBranch?.evening_hours || '',
        working_days: selectedBranch?.working_days || 'Saturday – Thursday',
        off_days: selectedBranch?.off_days || 'Friday closed',
        map_url: selectedBranch?.map_url || '',
        review_url: selectedBranch?.review_url || '',
        reviews_text: selectedBranch?.reviews_text || 'Extremely gentle and painless treatment! The doctors explained every procedure clearly, and the clinic environment was spotless and reassuring.',
        slug: selectedBranch?.slug || '',
        seo_title: selectedBranch?.seo_title || `Best Dental Clinic in ${selectedBranch?.short_name || 'Mirpur'}, Dhaka`,
        meta_desc: selectedBranch?.meta_desc || `Visit Tech Dental ${selectedBranch?.name || ''} for world-class dental care, implants, and painless treatments with specialist dental surgeons in Dhaka.`,
        canonical_url: selectedBranch?.canonical_url || '',
        robots_index: selectedBranch?.robots_index !== undefined ? Boolean(selectedBranch.robots_index) : true,
        robots_follow: selectedBranch?.robots_follow !== undefined ? Boolean(selectedBranch.robots_follow) : true,
        schema_type: selectedBranch?.schema_type || 'Dentist',
        schema_json: selectedBranch?.schema_json || '',
        faqs: Array.isArray(selectedBranch?.faqs) ? selectedBranch.faqs : [],
        seo_content: selectedBranch?.seo_content || `Welcome to Tech Dental, your trusted destination for comprehensive and advanced dental care in ${selectedBranch?.short_name || 'Mirpur'}.`,
    });

    React.useEffect(() => {
        if (selectedBranch) {
            setForm({
                name: selectedBranch.name || '',
                address: selectedBranch.address || '',
                address_main: selectedBranch.address_main || '',
                address_sub: selectedBranch.address_sub || '',
                landmark: selectedBranch.landmark || '',
                phone: selectedBranch.phone || '',
                whatsapp: selectedBranch.whatsapp || '',
                booking_url: selectedBranch.booking_url || '',
                call_label: selectedBranch.call_label || 'Call',
                directions_label: selectedBranch.directions_label || 'Directions',
                whatsapp_label: selectedBranch.whatsapp_label || 'WhatsApp',
                book_label: selectedBranch.book_label || 'Book',
                appointment_btn_label: selectedBranch.appointment_btn_label || 'Book Now',
                more_about_title: selectedBranch.more_about_title || '',
                hours_text: selectedBranch.hours_text || selectedBranch.time || 'Saturday – Thursday: 10:00 AM – 9:00 PM',
                morning_hours: selectedBranch.morning_hours || '',
                evening_hours: selectedBranch.evening_hours || '',
                working_days: selectedBranch.working_days || 'Saturday – Thursday',
                off_days: selectedBranch.off_days || 'Friday closed',
                map_url: selectedBranch.map_url || '',
                review_url: selectedBranch.review_url || '',
                reviews_text: selectedBranch.reviews_text || 'Extremely gentle and painless treatment! The doctors explained every procedure clearly, and the clinic environment was spotless and reassuring.',
                slug: selectedBranch.slug || '',
                seo_title: selectedBranch.seo_title || `Best Dental Clinic in ${selectedBranch.short_name || 'Mirpur'}, Dhaka`,
                meta_desc: selectedBranch.meta_desc || `Visit Tech Dental ${selectedBranch.name || ''} for world-class dental care, implants, and painless treatments with specialist dental surgeons in Dhaka.`,
                canonical_url: selectedBranch.canonical_url || '',
                robots_index: selectedBranch.robots_index !== undefined ? Boolean(selectedBranch.robots_index) : true,
                robots_follow: selectedBranch.robots_follow !== undefined ? Boolean(selectedBranch.robots_follow) : true,
                schema_type: selectedBranch.schema_type || 'Dentist',
                schema_json: selectedBranch.schema_json || '',
                faqs: Array.isArray(selectedBranch.faqs) ? selectedBranch.faqs : [],
                seo_content: selectedBranch.seo_content || `Welcome to Tech Dental, your trusted destination for comprehensive and advanced dental care in ${selectedBranch.short_name || 'Mirpur'}.`,
            });
        }
    }, [selectedBranchId, branches]);

    const handleSave = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!selectedBranch) return;
        setIsSaving(true);
        setStatusMessage(null);
        router.put(route('branch.admin.update', selectedBranch.id), form, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                setStatusMessage({ type: 'success', text: `✓ ${form.name || selectedBranch.name} details updated successfully!` });
                setTimeout(() => setStatusMessage(null), 5000);
            },
            onError: (errors) => {
                setIsSaving(false);
                const firstErr = Object.values(errors)[0] || 'Failed to save branch information.';
                setStatusMessage({ type: 'error', text: `✕ ${firstErr}` });
            }
        });
    };

    const branchDoctors = doctors.filter(d => (d.branch || '').toLowerCase().includes((selectedBranch?.short_name || selectedBranch?.name || '').toLowerCase()));
    const branchGallery = gallery.filter(g => (g.branch || '').toLowerCase().includes((selectedBranch?.short_name || selectedBranch?.name || '').toLowerCase())).slice(0, 8);

    return (
        <AdminLayout>
            <Head title="Branch Management - Tech Dental" />

            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-700 to-pink-600 text-white flex items-center justify-center font-bold shadow-md shadow-rose-900/20">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-gray-900">Branches &amp; Clinics</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href={`/branch/${selectedBranch?.slug || selectedBranch?.id || ''}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-2xs"
                    >
                        <ExternalLink size={14} />
                        View Live Branch Page
                    </a>
                    {selectedBranch && branches.length > 1 && (
                        <button
                            type="button"
                            onClick={() => handleDeleteBranch(selectedBranch.id, selectedBranch.name)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
                            title="Delete this branch"
                        >
                            <Trash2 size={14} /> Delete
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {isSaving ? 'Saving...' : 'Save Branch'}
                    </button>
                </div>
            </div>

            {/* Status Alert Banner */}
            {statusMessage && (
                <div className={`p-4 rounded-xl mb-6 flex items-center justify-between text-xs font-bold transition shadow-xs ${
                    statusMessage.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                    <div className="flex items-center gap-2">
                        {statusMessage.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-600 shrink-0" /> : <AlertCircle size={16} className="text-rose-600 shrink-0" />}
                        <span>{statusMessage.text}</span>
                    </div>
                    <button type="button" onClick={() => setStatusMessage(null)} className="text-gray-400 hover:text-gray-600 text-sm font-bold ml-4 cursor-pointer">&times;</button>
                </div>
            )}

            {/* Branch Switcher Pill Bar */}
            <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-2xs mb-6 flex flex-wrap gap-2 items-center justify-between">
                <div className="flex flex-wrap gap-2 items-center">
                    {branches.map((b) => {
                        const isSelected = b.id === selectedBranchId;
                        return (
                            <button
                                key={b.id}
                                onClick={() => setSelectedBranchId(b.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                                    isSelected
                                        ? 'bg-[#800038] text-white shadow-xs'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <MapPin size={14} className={isSelected ? 'text-white' : 'text-rose-600'} />
                                {b.name}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs cursor-pointer ml-1"
                    >
                        <Plus size={14} /> Add Branch
                    </button>
                </div>
            </div>

            {/* Sub-tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-2xs mb-6 flex flex-wrap gap-2">
                <button
                    onClick={() => setActiveTab('info')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                        activeTab === 'info' ? 'bg-[#800038] text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Clock size={15} /> Branch Info &amp; Hours
                </button>
                <button
                    onClick={() => setActiveTab('doctors')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                        activeTab === 'doctors' ? 'bg-[#800038] text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Users size={15} /> Doctors ({branchDoctors.length})
                </button>
                <button
                    onClick={() => setActiveTab('gallery')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                        activeTab === 'gallery' ? 'bg-[#800038] text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <ImageIcon size={15} /> Clinic Photos
                </button>
                <button
                    onClick={() => setActiveTab('seo')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                        activeTab === 'seo' ? 'bg-[#800038] text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Search size={15} /> SEO &amp; About
                </button>
            </div>

            {/* TAB CONTENTS */}
            {selectedBranch && (
                <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-6">
                    {/* INFO TAB */}
                    {activeTab === 'info' && (
                        <div className="space-y-4 max-w-3xl">
                            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                                {selectedBranch.name} — Operating Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Branch Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Operating Hours</label>
                                    <input
                                        type="text"
                                        value={form.hours_text}
                                        onChange={(e) => setForm({ ...form, hours_text: e.target.value })}
                                        placeholder="Saturday – Thursday: 10:00 AM – 9:00 PM"
                                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Physical Street Address (Fallback) *</label>
                                <textarea
                                    rows={2}
                                    required
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                                />
                            </div>

                            {/* Redesigned Branch Card Details */}
                            <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 space-y-3">
                                <h3 className="text-xs font-extrabold text-[#7E1736] uppercase tracking-wider">
                                    Redesigned Branch Card Fields
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                                            Card Main Address
                                        </label>
                                        <input
                                            type="text"
                                            value={form.address_main}
                                            onChange={(e) => setForm({ ...form, address_main: e.target.value })}
                                            placeholder="e.g. 827 (2nd Floor), Shewrapara, Begum Rokeya Sarani"
                                            className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                                            Card Sub Address (Area, City – Postcode)
                                        </label>
                                        <input
                                            type="text"
                                            value={form.address_sub}
                                            onChange={(e) => setForm({ ...form, address_sub: e.target.value })}
                                            placeholder="e.g. Mirpur, Dhaka – 1216"
                                            className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                                        Landmark Description
                                    </label>
                                    <input
                                        type="text"
                                        value={form.landmark}
                                        onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                                        placeholder="e.g. East side of Metro Rail Pillar No. 318"
                                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                                            Morning Shift (optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={form.morning_hours}
                                            onChange={(e) => setForm({ ...form, morning_hours: e.target.value })}
                                            placeholder="10 AM – 2 PM"
                                            className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                                            Evening Shift
                                        </label>
                                        <input
                                            type="text"
                                            value={form.evening_hours}
                                            onChange={(e) => setForm({ ...form, evening_hours: e.target.value })}
                                            placeholder="4 PM – 9 PM"
                                            className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                                            Working Days
                                        </label>
                                        <input
                                            type="text"
                                            value={form.working_days}
                                            onChange={(e) => setForm({ ...form, working_days: e.target.value })}
                                            placeholder="Saturday – Thursday"
                                            className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                                            Closed / Off Days
                                        </label>
                                        <input
                                            type="text"
                                            value={form.off_days}
                                            onChange={(e) => setForm({ ...form, off_days: e.target.value })}
                                            placeholder="Friday closed"
                                            className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Clinic Phone / Hotline</label>
                                    <input
                                        type="text"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        placeholder="01400786162"
                                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp Direct Line</label>
                                    <input
                                        type="text"
                                        value={form.whatsapp}
                                        onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                                        placeholder="+8801400786162"
                                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Google Maps Route URL</label>
                                <input
                                    type="text"
                                    value={form.map_url}
                                    onChange={(e) => setForm({ ...form, map_url: e.target.value })}
                                    placeholder="https://maps.google.com/..."
                                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                                />
                            </div>

                            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/70 space-y-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                                        <Star size={14} className="text-amber-500 fill-amber-500" />
                                        <span>Google Reviews Link ("See All Google Reviews" Button URL)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.review_url}
                                        onChange={(e) => setForm({ ...form, review_url: e.target.value })}
                                        placeholder="https://g.page/r/... or Google Maps Reviews Link"
                                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-800 mb-1">
                                        Patient Review Quote Text (Branch Review Section)
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={form.reviews_text}
                                        onChange={(e) => setForm({ ...form, reviews_text: e.target.value })}
                                        placeholder="Extremely gentle and painless treatment! The doctors explained every procedure clearly, and the clinic environment was spotless and reassuring."
                                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                    />
                                </div>
                            </div>

                            {/* ACTION BUTTONS CONFIGURATION */}
                            <div className="pt-4 border-t border-gray-100">
                                <div className="mb-3">
                                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                        <Sparkles size={16} className="text-[#800038]" />
                                        Action Buttons (Homepage &amp; Branch Page)
                                    </h3>
                                    <p className="text-[11px] text-gray-500">Customize button text labels and links for this branch.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/80 p-4 rounded-xl border border-gray-100">
                                    {/* Call Button */}
                                    <div className="space-y-2 bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
                                        <div className="flex items-center gap-1.5 font-bold text-blue-900 text-xs">
                                            <Phone size={13} className="text-blue-600" />
                                            <span>Button 1: Call Button</span>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-700 mb-1">Button Label</label>
                                            <input
                                                type="text"
                                                value={form.call_label}
                                                onChange={(e) => setForm({ ...form, call_label: e.target.value })}
                                                placeholder="Call"
                                                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-700 mb-1">Phone Number / Hotline</label>
                                            <input
                                                type="text"
                                                value={form.phone}
                                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                placeholder="01400786162"
                                                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg"
                                            />
                                            <p className="text-[10px] text-gray-400 mt-0.5">Dialed when patient clicks Call</p>
                                        </div>
                                    </div>

                                    {/* Directions Button */}
                                    <div className="space-y-2 bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
                                        <div className="flex items-center gap-1.5 font-bold text-indigo-900 text-xs">
                                            <Navigation size={13} className="text-indigo-600" />
                                            <span>Button 2: Directions Button</span>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-700 mb-1">Button Label</label>
                                            <input
                                                type="text"
                                                value={form.directions_label}
                                                onChange={(e) => setForm({ ...form, directions_label: e.target.value })}
                                                placeholder="Directions"
                                                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-700 mb-1">Google Maps Route URL</label>
                                            <input
                                                type="text"
                                                value={form.map_url}
                                                onChange={(e) => setForm({ ...form, map_url: e.target.value })}
                                                placeholder="https://maps.google.com/..."
                                                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg"
                                            />
                                            <p className="text-[10px] text-gray-400 mt-0.5">Opens Google Maps route to clinic</p>
                                        </div>
                                    </div>

                                    {/* WhatsApp Button */}
                                    <div className="space-y-2 bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
                                        <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs">
                                            <MessageSquare size={13} className="text-emerald-600" />
                                            <span>Button 3: WhatsApp Button</span>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-700 mb-1">Button Label</label>
                                            <input
                                                type="text"
                                                value={form.whatsapp_label}
                                                onChange={(e) => setForm({ ...form, whatsapp_label: e.target.value })}
                                                placeholder="WhatsApp"
                                                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-700 mb-1">WhatsApp Number or Direct Link</label>
                                            <input
                                                type="text"
                                                value={form.whatsapp}
                                                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                                                placeholder="01400786162 or https://wa.me/..."
                                                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg"
                                            />
                                            <p className="text-[10px] text-gray-400 mt-0.5">Direct chat initiation</p>
                                        </div>
                                    </div>

                                    {/* Book Appointment Button */}
                                    <div className="space-y-2 bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
                                        <div className="flex items-center gap-1.5 font-bold text-rose-900 text-xs">
                                            <Calendar size={13} className="text-[#800038]" />
                                            <span>Button 4: Book Appointment Button</span>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-700 mb-1">Button Label</label>
                                            <input
                                                type="text"
                                                value={form.book_label}
                                                onChange={(e) => setForm({ ...form, book_label: e.target.value })}
                                                placeholder="Book"
                                                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-700 mb-1">Booking Page / URL</label>
                                            <input
                                                type="text"
                                                value={form.booking_url}
                                                onChange={(e) => setForm({ ...form, booking_url: e.target.value })}
                                                placeholder="/appointment"
                                                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg"
                                            />
                                            <p className="text-[10px] text-gray-400 mt-0.5">Booking page destination</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DOCTORS TAB */}
                    {activeTab === 'doctors' && (
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                                <div>
                                    <h2 className="text-base font-bold text-gray-900">
                                        Specialist Doctors Assigned to {selectedBranch.name}
                                    </h2>
                                    <p className="text-xs text-gray-500">Doctors practicing at this branch location.</p>
                                </div>
                                <a
                                    href="/doctors-admin"
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#800038] hover:bg-[#600028] text-white rounded-xl text-xs font-bold transition shadow-2xs"
                                >
                                    <Users size={14} /> Manage All Doctors &amp; Shifts
                                </a>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {branchDoctors.length === 0 ? (
                                    <div className="col-span-full py-12 text-center bg-gray-50/80 rounded-2xl border border-dashed border-gray-200 p-6">
                                        <Users size={32} className="mx-auto text-gray-300 mb-2" />
                                        <p className="text-xs font-bold text-gray-600">No doctors currently tagged with "{selectedBranch.name}"</p>
                                        <p className="text-[11px] text-gray-400 mt-1 max-w-sm mx-auto">Open Doctors CMS and set their clinic branch field to match this location.</p>
                                        <a
                                            href="/doctors-admin"
                                            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold transition"
                                        >
                                            Go to Doctors CMS &rarr;
                                        </a>
                                    </div>
                                ) : (
                                    branchDoctors.map((doc) => (
                                        <div key={doc.id} className="p-4 rounded-xl bg-gray-50/80 border border-gray-200 flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-gray-200 overflow-hidden shrink-0 border border-gray-200">
                                                    <img src={doc.img || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200'} alt={doc.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 text-xs">{doc.name}</div>
                                                    <div className="text-[11px] text-rose-700 font-semibold">{doc.designation || doc.deg}</div>
                                                    <div className="text-[10px] text-gray-500 mt-0.5">{doc.visiting_time || 'General Shift'}</div>
                                                </div>
                                            </div>
                                            <a
                                                href={`/doctors-admin`}
                                                className="text-xs text-blue-600 hover:text-blue-800 font-bold shrink-0 p-1.5 hover:bg-blue-50 rounded-lg transition"
                                                title="Edit Doctor"
                                            >
                                                Edit
                                            </a>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* GALLERY TAB */}
                    {activeTab === 'gallery' && (
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                                <div>
                                    <h2 className="text-base font-bold text-gray-900">
                                        {selectedBranch.name} Operatory &amp; Clinic Showcase
                                    </h2>
                                    <p className="text-xs text-gray-500">Selected clinic interior and treatment operatory photos.</p>
                                </div>
                                <a
                                    href="/featured-images"
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-2xs"
                                >
                                    <ImageIcon size={14} /> Manage Clinic Sliders &amp; Photos
                                </a>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {gallery.length === 0 ? (
                                    <div className="col-span-full py-12 text-center bg-gray-50/80 rounded-2xl border border-dashed border-gray-200 p-6">
                                        <ImageIcon size={32} className="mx-auto text-gray-300 mb-2" />
                                        <p className="text-xs font-bold text-gray-600">No photos found in gallery.</p>
                                    </div>
                                ) : (
                                    gallery.slice(0, 12).map((img, idx) => (
                                        <div key={idx} className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-video relative group shadow-2xs">
                                            <img src={img.src || img.url} alt={img.title || 'Clinic'} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold p-2 text-center">
                                                {img.title || 'Operatory'}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* SEO TAB */}
                    {activeTab === 'seo' && (
                        <div className="space-y-6 max-w-4xl">
                            {/* Reusable Core SEO Engine Box */}
                            <SeoMetaBox
                                data={{
                                    seo_title: form.seo_title,
                                    meta_desc: form.meta_desc,
                                    canonical_url: form.canonical_url,
                                    slug: form.slug,
                                    robots_index: form.robots_index,
                                    robots_follow: form.robots_follow,
                                    schema_type: form.schema_type,
                                    schema_json: form.schema_json,
                                    faqs: form.faqs,
                                }}
                                onChange={(updated) => {
                                    setForm({
                                        ...form,
                                        seo_title: updated.seo_title,
                                        meta_desc: updated.meta_desc,
                                        canonical_url: updated.canonical_url,
                                        slug: updated.slug || form.slug,
                                        robots_index: updated.robots_index,
                                        robots_follow: updated.robots_follow,
                                        schema_type: updated.schema_type,
                                        schema_json: updated.schema_json,
                                        faqs: updated.faqs,
                                    });
                                }}
                                pageType="branch"
                                defaultSlug={selectedBranch.slug || selectedBranch.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                                previewUrl="https://techdentalbd.com/branch"
                            />

                            {/* More About Section & CTA */}
                            <div className="p-5 bg-gray-50/70 border border-gray-200/80 rounded-2xl space-y-4">
                                <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-200/70 pb-2">
                                    More About {selectedBranch.name} &amp; Drawer Controls
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">
                                            Branch Page Main Button Label (CTA)
                                        </label>
                                        <input
                                            type="text"
                                            value={form.appointment_btn_label}
                                            onChange={(e) => setForm({ ...form, appointment_btn_label: e.target.value })}
                                            placeholder="Book Now"
                                            className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl font-bold bg-white"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-0.5">Custom text for the main CTA button on the branch page (Default: Book Now)</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">
                                            More About Drawer Heading / Title
                                        </label>
                                        <input
                                            type="text"
                                            value={form.more_about_title}
                                            onChange={(e) => setForm({ ...form, more_about_title: e.target.value })}
                                            placeholder={`More About ${(selectedBranch.short_name || selectedBranch.name || '').replace(/\s*branch\s*$/i, '').trim()}`}
                                            className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl font-bold bg-white"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-0.5">Custom heading for the expandable drawer (e.g. More About Uttara)</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">
                                        More About {selectedBranch.name} Drawer Content (Rich HTML &amp; Headings)
                                    </label>
                                    <RichContentEditor
                                        label={`WRITE MORE ABOUT CONTENT (${selectedBranch.name?.toUpperCase() || 'BRANCH'})`}
                                        value={form.seo_content || ''}
                                        onChange={(val) => setForm({ ...form, seo_content: val })}
                                        placeholder={`Write rich detailed overview, treatments, equipment and highlights for ${selectedBranch.name}...`}
                                        minHeight="260px"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2 cursor-pointer"
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {isSaving ? 'Saving Branch Details...' : 'Save Branch Details'}
                        </button>
                    </div>
                </form>
            )}

            {/* Modal for Adding a New Branch */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-gray-200 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
                            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                <Plus size={16} className="text-[#800038]" /> Add New Clinic Branch
                            </h3>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 font-bold text-base cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleCreateBranch} className="p-6 space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Branch Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={newBranch.name}
                                    onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                                    placeholder="e.g. Dhanmondi Branch"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Physical Address *</label>
                                <textarea
                                    rows={2}
                                    required
                                    value={newBranch.address}
                                    onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                                    placeholder="Full street address..."
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Phone / Hotline</label>
                                    <input
                                        type="text"
                                        value={newBranch.phone}
                                        onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                                        placeholder="01400786162"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">WhatsApp</label>
                                    <input
                                        type="text"
                                        value={newBranch.whatsapp}
                                        onChange={(e) => setNewBranch({ ...newBranch, whatsapp: e.target.value })}
                                        placeholder="+8801400786162"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Operating Hours</label>
                                <input
                                    type="text"
                                    value={newBranch.hours_text}
                                    onChange={(e) => setNewBranch({ ...newBranch, hours_text: e.target.value })}
                                    placeholder="Saturday – Thursday: 10:00 AM – 9:00 PM"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreatingBranch}
                                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl font-bold transition flex items-center gap-2 cursor-pointer"
                                >
                                    {isCreatingBranch ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                                    {isCreatingBranch ? 'Creating...' : 'Create Branch'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
