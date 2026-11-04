import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Users,
    ArrowLeft,
    Save,
    ExternalLink,
    CheckCircle2,
    EyeOff,
    Plus,
    Trash2,
    Briefcase,
    Shield,
    Megaphone,
    Headphones,
    FileText,
    Quote
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';
import MediaImagePicker from '@/components/ImagePicker/MediaImagePicker';

interface TeamMember {
    id?: number;
    name?: string;
    role?: string;
    section?: 'management' | 'ceo_assistant' | 'digital_marketing' | 'call_center';
    image?: string;
    quote?: string;
    letter?: string[] | any;
    photo_alt?: string;
    is_active?: boolean;
    sort_order?: number;
}

interface Props extends PageProps {
    item: TeamMember | null;
    defaultSection?: 'management' | 'ceo_assistant' | 'digital_marketing' | 'call_center';
}

const SECTION_OPTIONS = [
    { value: 'management', label: 'Management Team', icon: Shield, desc: 'Clinic Directors, CEO & Chief Dental Officers' },
    { value: 'ceo_assistant', label: 'Assistant to CEO', icon: Briefcase, desc: 'Executive & Strategic Operations' },
    { value: 'digital_marketing', label: 'Digital Marketing Team', icon: Megaphone, desc: 'Brand, Content & Online Media' },
    { value: 'call_center', label: 'Call Center Team', icon: Headphones, desc: 'Patient Relations & 24/7 Telephone Support' },
];

export default function TeamAdminEdit({ item, defaultSection = 'management' }: Props) {
    const isEdit = Boolean(item && item.id);

    // Normalize letter paragraphs into array of strings
    const initialParagraphs = (): string[] => {
        if (!item?.letter) return ['', ''];
        if (Array.isArray(item.letter)) {
            const list = item.letter.map((p) => (typeof p === 'string' ? p : p?.text || '')).filter(Boolean);
            return list.length > 0 ? list : ['', ''];
        }
        if (typeof item.letter === 'string') {
            try {
                const parsed = JSON.parse(item.letter);
                if (Array.isArray(parsed)) return parsed.length > 0 ? parsed : ['', ''];
            } catch {
                const parts = item.letter.split('\n\n').filter(Boolean);
                if (parts.length > 0) return parts;
            }
        }
        return ['', ''];
    };

    const [form, setForm] = useState({
        name: item?.name || '',
        role: item?.role || '',
        section: (item?.section || defaultSection || 'management') as 'management' | 'ceo_assistant' | 'digital_marketing' | 'call_center',
        image: item?.image || '',
        quote: item?.quote || '',
        photo_alt: item?.photo_alt || '',
        is_active: item?.is_active !== undefined ? Boolean(item.is_active) : true,
        sort_order: item?.sort_order ?? 0,
        paragraphs: initialParagraphs(),
    });

    const [processing, setProcessing] = useState(false);

    const handleParagraphChange = (index: number, value: string) => {
        const next = [...form.paragraphs];
        next[index] = value;
        setForm({ ...form, paragraphs: next });
    };

    const addParagraph = () => {
        setForm({ ...form, paragraphs: [...form.paragraphs, ''] });
    };

    const removeParagraph = (index: number) => {
        const next = form.paragraphs.filter((_, i) => i !== index);
        setForm({ ...form, paragraphs: next.length > 0 ? next : [''] });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const isManagement = form.section === 'management';
        const cleanParagraphs = isManagement ? form.paragraphs.map(p => p.trim()).filter(Boolean) : [];

        const payload = {
            name: form.name.trim(),
            role: form.role.trim(),
            section: form.section,
            image: form.image || null,
            quote: isManagement && form.quote ? form.quote.trim() : null,
            photo_alt: isManagement && form.photo_alt ? form.photo_alt.trim() : null,
            is_active: Boolean(form.is_active),
            sort_order: Number(form.sort_order) || 0,
            letter: cleanParagraphs.length > 0 ? cleanParagraphs : null,
        };

        if (isEdit && item?.id) {
            router.put(route('team.admin.update', item.id), payload, {
                onFinish: () => setProcessing(false),
            });
        } else {
            router.post(route('team.admin.store'), payload, {
                onFinish: () => setProcessing(false),
            });
        }
    };

    const isManagement = form.section === 'management';
    const slug = (form.name || '').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    return (
        <AdminLayout>
            <Head title={isEdit ? `Edit Member: ${item?.name}` : 'Add New Team Member - Tech Dental'} />

            <form onSubmit={handleSubmit} className="space-y-6 pb-16 max-w-7xl mx-auto">
                {/* Top Action Header Bar (Static, non-sticky) */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('team.admin')}
                            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition shadow-2xs"
                            title="Back to Corporate Team"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-100">
                                    Corporate Team Member
                                </span>
                                {form.is_active ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                        <CheckCircle2 size={12} /> Published
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                        <EyeOff size={12} /> Draft (Hidden)
                                    </span>
                                )}
                            </div>
                            <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 mt-0.5">
                                {isEdit ? `Edit Member: ${item?.name}` : 'Add New Corporate Team Member'}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-auto">
                        {isEdit && form.section === 'management' && slug && (
                            <a
                                href={`/team/${slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-2xs"
                            >
                                <ExternalLink size={14} />
                                View Public Page
                            </a>
                        )}

                        <Link
                            href={route('team.admin')}
                            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer"
                        >
                            <Save size={15} />
                            {processing ? 'Saving...' : (isEdit ? 'Save Changes' : 'Publish Member')}
                        </button>
                    </div>
                </div>

                {/* Main 2-Column Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Left Column: Member Details & Executive Letter (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Card 1: Basic Information */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-5">
                            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                                <Users size={18} className="text-[#800038]" />
                                <h2 className="font-bold text-gray-900 text-sm sm:text-base">Basic Profile Information</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="e.g. Md. Noman Khan"
                                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#800038] focus:border-transparent outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                        Role / Designation <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.role}
                                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                                        placeholder="e.g. Chief Executive Officer"
                                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#800038] focus:border-transparent outline-none transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    Team Section <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {SECTION_OPTIONS.map((opt) => {
                                        const Icon = opt.icon;
                                        const isSelected = form.section === opt.value;
                                        return (
                                            <div
                                                key={opt.value}
                                                onClick={() => setForm({ ...form, section: opt.value as any })}
                                                className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${isSelected
                                                        ? 'bg-rose-50/70 border-[#800038] ring-1 ring-[#800038]'
                                                        : 'bg-white border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-[#800038] text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                    <Icon size={16} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className={`font-bold text-xs ${isSelected ? 'text-[#800038]' : 'text-gray-900'}`}>
                                                        {opt.label}
                                                    </div>
                                                    <div className="text-[11px] text-gray-500 mt-0.5 leading-tight">
                                                        {opt.desc}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Management-Only Extra Fields */}
                            {isManagement && (
                                <>
                                    <div className="pt-2 border-t border-gray-100">
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                            Inspirational Quote / Tagline (Management Single Page)
                                        </label>
                                        <div className="relative">
                                            <Quote size={16} className="absolute left-3 top-2.5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={form.quote}
                                                onChange={(e) => setForm({ ...form, quote: e.target.value })}
                                                placeholder="e.g. Our commitment to excellence goes beyond dental procedures..."
                                                className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#800038] focus:border-transparent outline-none transition"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                            Photo Alt Text (SEO & Accessibility)
                                        </label>
                                        <input
                                            type="text"
                                            value={form.photo_alt}
                                            onChange={(e) => setForm({ ...form, photo_alt: e.target.value })}
                                            placeholder="e.g. Md. Noman Khan - CEO of Tech Dental Care"
                                            className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#800038] focus:border-transparent outline-none transition"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Card 2: Executive Letter / Bio Paragraphs (Only for Management Team) */}
                        {isManagement && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4 animate-in fade-in duration-200">
                                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <FileText size={18} className="text-[#800038]" />
                                        <h2 className="font-bold text-gray-900 text-sm sm:text-base">
                                            Executive Letter / Bio Content
                                        </h2>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addParagraph}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition cursor-pointer"
                                    >
                                        <Plus size={14} /> Add Paragraph
                                    </button>
                                </div>

                                <div className="space-y-4 pt-1">
                                    {form.paragraphs.map((p, index) => (
                                        <div key={index} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-bold text-gray-700 flex items-center gap-1.5">
                                                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center text-[10px] font-extrabold">
                                                        {index + 1}
                                                    </span>
                                                    Paragraph {index + 1}
                                                </span>
                                                {form.paragraphs.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeParagraph(index)}
                                                        className="p-1 text-gray-400 hover:text-red-600 transition cursor-pointer"
                                                        title="Remove Paragraph"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                            <textarea
                                                rows={3}
                                                value={p}
                                                onChange={(e) => handleParagraphChange(index, e.target.value)}
                                                placeholder={`Enter text for paragraph ${index + 1}...`}
                                                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#800038] focus:border-transparent outline-none transition leading-relaxed"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Right Column: Publish Option & Photo (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Card 1: Publish & Visibility Settings (User Request) */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                <h3 className="font-bold text-gray-900 text-sm">Publish & Visibility</h3>
                                {form.is_active ? (
                                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live
                                    </span>
                                ) : (
                                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-amber-500" /> Draft
                                    </span>
                                )}
                            </div>

                            {/* Publish Status Options */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    Publication Status
                                </label>

                                <div
                                    onClick={() => setForm({ ...form, is_active: true })}
                                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${form.is_active
                                            ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300'
                                            : 'bg-white border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${form.is_active ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'}`}>
                                            {form.is_active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-900">Published (Active)</div>
                                            <div className="text-[10px] text-gray-500">Visible on public team directory & page</div>
                                        </div>
                                    </div>
                                    <CheckCircle2 size={16} className={form.is_active ? 'text-emerald-600' : 'text-gray-300'} />
                                </div>

                                <div
                                    onClick={() => setForm({ ...form, is_active: false })}
                                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${!form.is_active
                                            ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300'
                                            : 'bg-white border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${!form.is_active ? 'border-amber-600 bg-amber-600' : 'border-gray-300'}`}>
                                            {!form.is_active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-900">Draft (Hidden)</div>
                                            <div className="text-[10px] text-gray-500">Hidden from visitors, admin-only</div>
                                        </div>
                                    </div>
                                    <EyeOff size={16} className={!form.is_active ? 'text-amber-600' : 'text-gray-300'} />
                                </div>
                            </div>

                            {/* Sort Order */}
                            <div className="pt-2">
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    Display Order / Sort Priority
                                </label>
                                <input
                                    type="number"
                                    value={form.sort_order}
                                    onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                                    placeholder="0"
                                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl"
                                />
                            </div>

                            {/* Quick Save button in Publish card */}
                            <div className="pt-3 border-t border-gray-100">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                                >
                                    <Save size={15} />
                                    {processing ? 'Saving...' : (isEdit ? 'Save Changes' : 'Publish Member')}
                                </button>
                            </div>
                        </div>

                        {/* Card 2: Member Photo */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
                            <h3 className="font-bold text-gray-900 text-sm pb-2 border-b border-gray-100">
                                Member Photograph
                            </h3>

                            <MediaImagePicker
                                label="Upload or Select Photo"
                                value={form.image}
                                onChange={(val) => setForm({ ...form, image: val })}
                                aspectRatio="1:1"
                                helperText="Recommended: 1:1 square ratio portrait photo (JPG, PNG, or WEBP)"
                            />

                            {form.image && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                                    <div className="w-28 h-28 mx-auto rounded-xl overflow-hidden border-2 border-white shadow-sm bg-white mb-2">
                                        <img src={form.image} alt={form.name || 'Preview'} className="w-full h-full object-cover" />
                                    </div>
                                    <p className="text-[11px] font-semibold text-gray-700">{form.name || 'Member Name'}</p>
                                    <p className="text-[10px] text-gray-500">{form.role || 'Designation'}</p>
                                </div>
                            )}
                        </div>

                    </div>

                </div>
            </form>
        </AdminLayout>
    );
}

