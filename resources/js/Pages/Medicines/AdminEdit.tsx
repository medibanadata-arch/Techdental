import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Pill,
    ArrowLeft,
    Save,
    Plus,
    Trash2,
    HelpCircle,
    AlertTriangle,
    ShieldCheck,
    DollarSign,
    Clock,
    FileText,
    CheckCircle2,
    ExternalLink,
    Images
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';
import MediaImagePicker from '@/components/ImagePicker/MediaImagePicker';
import SeoMetaBox from '@/Components/SeoMetaBox';
import RichContentEditor from '@/Components/RichContentEditor';

interface UseItem {
    label: string;
    label_bn?: string;
    text: string;
    text_bn?: string;
}

interface WarningItem {
    icon?: string;
    label: string;
    label_bn?: string;
    text: string;
    text_bn?: string;
}

interface FaqItem {
    q: string;
    q_bn?: string;
    a: string;
    a_bn?: string;
}

interface GalleryItem {
    src: string;
    caption: string;
}

interface MedicineItem {
    id?: number;
    slug?: string;
    name?: string;
    name_bn?: string;
    generic?: string;
    generic_bn?: string;
    category?: string;
    tag?: string;
    tag_bn?: string;
    image?: string;
    quick_use?: string;
    quick_use_bn?: string;
    pharma?: string;
    pharma_bn?: string;
    dosage?: string;
    dosage_bn?: string;
    dental_usage?: string;
    dental_usage_bn?: string;
    uses_text?: string;
    uses_text_bn?: string;
    side_effects?: string;
    side_effects_bn?: string;
    subtitle?: string;
    subtitle_bn?: string;
    seo_title?: string;
    seo_title_bn?: string;
    seo_content?: string;
    seo_content_bn?: string;
    meta_desc?: string;
    meta_desc_bn?: string;
    canonical_url?: string;
    robots_index?: boolean;
    robots_follow?: boolean;
    schema_type?: string;
    schema_json?: string;
    verified_badge?: string;
    verified_badge_bn?: string;
    published_date?: string;
    intro?: string;
    intro_bn?: string;
    uses_items?: UseItem[];
    dosage_admin?: string;
    dosage_admin_bn?: string;
    dosage_timing?: string;
    dosage_timing_bn?: string;
    side_effects_items?: (string | { text: string; text_bn?: string })[];
    warnings?: WarningItem[];
    price_per_tablet?: string;
    price_per_strip?: string;
    price_manufacturer?: string;
    gallery?: GalleryItem[];
    faqs?: FaqItem[];
    section_titles?: Record<string, string>;
    author?: {
        img?: string;
        name?: string;
        name_bn?: string;
        bio?: string;
        bio_bn?: string;
        reviewed_by?: string;
        reviewed_by_bn?: string;
        last_updated?: string;
        disclaimer?: string;
        disclaimer_bn?: string;
    };
    is_active?: boolean;
    sort_order?: number;
}

interface Props extends PageProps {
    item: MedicineItem | null;
}

export default function MedicinesAdminEdit({ item }: Props) {
    const isEdit = Boolean(item && item.id);

    // Normalize side effects items into objects { text, text_bn }
    const initialSideEffects = (item?.side_effects_items || []).map((s) => {
        if (typeof s === 'string') {
            return { text: s, text_bn: '' };
        }
        return s;
    });

    const [form, setForm] = useState({
        name: item?.name || '',
        name_bn: item?.name_bn || '',
        slug: item?.slug || '',
        generic: item?.generic || '',
        generic_bn: item?.generic_bn || '',
        category: item?.category || 'pain',
        tag: item?.tag || '',
        tag_bn: item?.tag_bn || '',
        image: item?.image || '',
        quick_use: item?.quick_use || '',
        quick_use_bn: item?.quick_use_bn || '',
        pharma: item?.pharma || '',
        pharma_bn: item?.pharma_bn || '',
        dosage: item?.dosage || '',
        dosage_bn: item?.dosage_bn || '',
        dental_usage: item?.dental_usage || '',
        dental_usage_bn: item?.dental_usage_bn || '',
        uses_text: item?.uses_text || '',
        uses_text_bn: item?.uses_text_bn || '',
        side_effects: item?.side_effects || '',
        side_effects_bn: item?.side_effects_bn || '',
        subtitle: item?.subtitle || '',
        subtitle_bn: item?.subtitle_bn || '',
        seo_title: item?.seo_title || '',
        seo_title_bn: item?.seo_title_bn || '',
        seo_content: item?.seo_content || '',
        seo_content_bn: item?.seo_content_bn || '',
        meta_desc: item?.meta_desc || '',
        meta_desc_bn: item?.meta_desc_bn || '',
        canonical_url: item?.canonical_url || '',
        robots_index: item?.robots_index !== undefined ? item.robots_index : true,
        robots_follow: item?.robots_follow !== undefined ? item.robots_follow : true,
        schema_type: item?.schema_type || 'MedicalWebPage',
        schema_json: item?.schema_json || '',
        verified_badge: item?.verified_badge || 'Medically Verified',
        verified_badge_bn: item?.verified_badge_bn || 'মেডিকেলি ভেরিফাইড',
        published_date: item?.published_date || 'Updated 2026',
        intro: item?.intro || '',
        intro_bn: item?.intro_bn || '',
        dosage_admin: item?.dosage_admin || '',
        dosage_admin_bn: item?.dosage_admin_bn || '',
        dosage_timing: item?.dosage_timing || '',
        dosage_timing_bn: item?.dosage_timing_bn || '',
        price_per_tablet: item?.price_per_tablet || '',
        price_per_strip: item?.price_per_strip || '',
        price_manufacturer: item?.price_manufacturer || '',
        gallery: item?.gallery || [],
        is_active: item?.is_active !== undefined ? item.is_active : true,
        sort_order: item?.sort_order || 0,
        section_titles: item?.section_titles || {
            uses: '',
            uses_bn: '',
            dosage: '',
            dosage_bn: '',
            side_effects: '',
            side_effects_bn: '',
            warnings: '',
            warnings_bn: '',
            price: '',
            price_bn: '',
            gallery: '',
            gallery_bn: '',
            faq: '',
            faq_bn: '',
            author: '',
            author_bn: '',
            related: '',
            related_bn: '',
            toc: '',
            toc_bn: '',
        },
        uses_items: item?.uses_items || [
            { label: 'Severe Toothache', label_bn: 'তীব্র দাঁতের ব্যথা', text: 'Fast acute dental pain relief', text_bn: 'তীব্র আকস্মিক দাঁতের ব্যথায় দ্রুত উপশম' },
        ],
        side_effects_items: initialSideEffects.length > 0 ? initialSideEffects : [
            { text: 'Mild nausea or dizziness', text_bn: 'হালকা বমি বমি ভাব বা মাথা ঘোরা' },
            { text: 'Abdominal discomfort if taken empty stomach', text_bn: 'খালি পেটে সেবন করলে পেটে অস্বস্তি' },
        ],
        warnings: item?.warnings || [
            { icon: 'ban', label: 'Contraindication', label_bn: 'নিষেধাজ্ঞা', text: 'Do not use with active gastrointestinal ulcer', text_bn: 'পাকস্থলীতে সক্রিয় আলসার থাকলে সেবন করবেন না' },
            { icon: 'triangle', label: 'Duration Limit', label_bn: 'সময়সীমা', text: 'Do not exceed 5 consecutive days of continuous therapy', text_bn: 'একটানা ৫ দিনের বেশি সেবন করবেন না' },
        ],
        faqs: item?.faqs || [
            {
                q: 'How quickly does this medicine relieve dental pain?',
                q_bn: 'দাঁতের ব্যথায় এই ঔষধ কত দ্রুত কাজ শুরু করে?',
                a: 'Pain relief usually starts within 30 to 60 minutes after oral intake.',
                a_bn: 'মুখের মাধ্যমে সেবনের ৩০ থেকে ৬০ মিনিটের মধ্যে ব্যথার উপশম শুরু হয়।'
            },
            {
                q: 'Should I take this medicine before or after meals?',
                q_bn: 'এই ঔষধটি কি খাবারের আগে নাকি পরে খেতে হবে?',
                a: 'Always take with or immediately after a meal with a full glass of water.',
                a_bn: 'সর্বদা ভরা পেটে বা খাবারের পরপরই এক গ্লাস পানির সাথে সেবন করবেন।'
            }
        ],
        author: {
            img: item?.author?.img || 'https://ui-avatars.com/api/?name=Dr.+Aysha+Siddika&background=881337&color=fff&size=160',
            name: item?.author?.name || 'Dr. Aysha Siddika, BDS, PGT',
            name_bn: item?.author?.name_bn || 'ডা. আয়েশা সিদ্দিকা, বিডিএস, পিজিটি',
            bio: item?.author?.bio || 'Senior Dental Surgeon & Consultant at Tech Dental Care Dhaka with over 8 years clinical experience.',
            bio_bn: item?.author?.bio_bn || 'টেক ডেন্টাল কেয়ার ঢাকা-এর সিনিয়র ডেন্টাল সার্জন ও কনসালট্যান্ট, ৮ বছরেরও বেশি ক্লিনিক্যাল অভিজ্ঞতাসম্পন্ন।',
            reviewed_by: item?.author?.reviewed_by || 'Dr. Farhana Ahmed, Clinical Director',
            reviewed_by_bn: item?.author?.reviewed_by_bn || 'ডা. ফারহানা আহমেদ, ক্লিনিক্যাল ডিরেক্টর',
            last_updated: item?.author?.last_updated || 'January 2026',
            disclaimer: item?.author?.disclaimer || 'Disclaimer: This information is for clinical and educational reference only. Consult a registered dentist before use.',
            disclaimer_bn: item?.author?.disclaimer_bn || 'সতর্কবার্তা: এই তথ্য শুধুমাত্র শিক্ষামূলক ও নির্দেশনামূলক উদ্দেশ্যে প্রদান করা হয়েছে। সেবনের পূর্বে অবশ্যই একজন রেজিস্টার্ড ডেন্টিস্টের পরামর্শ নিন।'
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && item?.id) {
            router.put(route('medicines.admin.update', item.id), form);
        } else {
            router.post(route('medicines.admin.store'), form);
        }
    };

    // Helper functions for dynamic arrays
    const addUseItem = () => {
        setForm({
            ...form,
            uses_items: [...form.uses_items, { label: '', label_bn: '', text: '', text_bn: '' }]
        });
    };

    const removeUseItem = (index: number) => {
        setForm({
            ...form,
            uses_items: form.uses_items.filter((_, i) => i !== index)
        });
    };

    const updateUseItem = (index: number, field: keyof UseItem, val: string) => {
        const next = [...form.uses_items];
        next[index] = { ...next[index], [field]: val };
        setForm({ ...form, uses_items: next });
    };

    const addSideEffect = () => {
        setForm({
            ...form,
            side_effects_items: [...form.side_effects_items, { text: '', text_bn: '' }]
        });
    };

    const removeSideEffect = (index: number) => {
        setForm({
            ...form,
            side_effects_items: form.side_effects_items.filter((_, i) => i !== index)
        });
    };

    const updateSideEffect = (index: number, field: 'text' | 'text_bn', val: string) => {
        const next = [...form.side_effects_items];
        const cur = typeof next[index] === 'string' ? { text: next[index] as string, text_bn: '' } : next[index];
        next[index] = { ...cur, [field]: val };
        setForm({ ...form, side_effects_items: next });
    };

    const addWarning = () => {
        setForm({
            ...form,
            warnings: [...form.warnings, { icon: 'triangle', label: '', label_bn: '', text: '', text_bn: '' }]
        });
    };

    const removeWarning = (index: number) => {
        setForm({
            ...form,
            warnings: form.warnings.filter((_, i) => i !== index)
        });
    };

    const updateWarning = (index: number, field: keyof WarningItem, val: string) => {
        const next = [...form.warnings];
        next[index] = { ...next[index], [field]: val };
        setForm({ ...form, warnings: next });
    };

    const addFaq = () => {
        setForm({
            ...form,
            faqs: [...form.faqs, { q: '', q_bn: '', a: '', a_bn: '' }]
        });
    };

    const removeFaq = (index: number) => {
        setForm({
            ...form,
            faqs: form.faqs.filter((_, i) => i !== index)
        });
    };

    const updateFaq = (index: number, field: keyof FaqItem, val: string) => {
        const next = [...form.faqs];
        next[index] = { ...next[index], [field]: val };
        setForm({ ...form, faqs: next });
    };

    const addGalleryItem = () => {
        setForm({
            ...form,
            gallery: [...(form.gallery || []), { src: '', caption: '' }]
        });
    };

    const removeGalleryItem = (index: number) => {
        setForm({
            ...form,
            gallery: (form.gallery || []).filter((_, i) => i !== index)
        });
    };

    const updateGalleryItem = (index: number, field: 'src' | 'caption', val: string) => {
        const next = [...(form.gallery || [])];
        next[index] = { ...next[index], [field]: val };
        setForm({ ...form, gallery: next });
    };

    const publicUrl = isEdit ? `/medicines/${form.slug || item?.id}` : null;

    return (
        <AdminLayout>
            <Head title={`${isEdit ? 'Edit' : 'Add'} Medicine - Tech Dental`} />

            {/* Top Bar with View Public Link */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        href={route('medicines.admin')}
                        className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
                    >
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            {isEdit ? `Edit: ${item?.name}` : 'Add New Medicine'}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {publicUrl && (
                        <a
                            href={publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-2xs"
                        >
                            <ExternalLink size={14} />
                            View Public Page
                        </a>
                    )}
                    <button
                        onClick={handleSubmit}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#800038] hover:bg-[#9a0044] text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
                    >
                        <Save size={16} />
                        Save Medicine
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Section 0: Section Titles & Custom Renaming */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <FileText size={18} className="text-[#800038]" />
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                                Section Titles & Custom Renaming (Single Page Headings)
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Uses Title */}
                        <div className="p-3 bg-gray-50/70 border border-gray-200 rounded-xl space-y-2">
                            <span className="text-xs font-bold text-gray-800">1. Uses Section Title</span>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-500 font-bold block">English Heading</label>
                                <input
                                    type="text"
                                    value={form.section_titles?.uses || ''}
                                    onChange={(e) => setForm({
                                        ...form,
                                        section_titles: { ...form.section_titles, uses: e.target.value }
                                    })}
                                    placeholder="e.g. What is Keto Used For?"
                                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-[#800038] font-bold block">বাংলা শিরোনাম</label>
                                <input
                                    type="text"
                                    value={form.section_titles?.uses_bn || ''}
                                    onChange={(e) => setForm({
                                        ...form,
                                        section_titles: { ...form.section_titles, uses_bn: e.target.value }
                                    })}
                                    placeholder="যেমন: কেটো এর ব্যবহার ও প্রয়োগ"
                                    className="w-full px-3 py-1.5 text-xs bg-rose-50/20 border border-rose-200 rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Dosage Title */}
                        <div className="p-3 bg-gray-50/70 border border-gray-200 rounded-xl space-y-2">
                            <span className="text-xs font-bold text-gray-800">2. Dosage Section Title</span>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-500 font-bold block">English Heading</label>
                                <input
                                    type="text"
                                    value={form.section_titles?.dosage || ''}
                                    onChange={(e) => setForm({
                                        ...form,
                                        section_titles: { ...form.section_titles, dosage: e.target.value }
                                    })}
                                    placeholder="e.g. Recommended Dosage"
                                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-[#800038] font-bold block">বাংলা শিরোনাম</label>
                                <input
                                    type="text"
                                    value={form.section_titles?.dosage_bn || ''}
                                    onChange={(e) => setForm({
                                        ...form,
                                        section_titles: { ...form.section_titles, dosage_bn: e.target.value }
                                    })}
                                    placeholder="যেমন: সেবনবিধি ও মাত্রা"
                                    className="w-full px-3 py-1.5 text-xs bg-rose-50/20 border border-rose-200 rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Side Effects Title */}
                        <div className="p-3 bg-gray-50/70 border border-gray-200 rounded-xl space-y-2">
                            <span className="text-xs font-bold text-gray-800">3. Side Effects Section Title</span>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-500 font-bold block">English Heading</label>
                                <input
                                    type="text"
                                    value={form.section_titles?.side_effects || ''}
                                    onChange={(e) => setForm({
                                        ...form,
                                        section_titles: { ...form.section_titles, side_effects: e.target.value }
                                    })}
                                    placeholder="e.g. Common Side Effects"
                                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-[#800038] font-bold block">বাংলা শিরোনাম</label>
                                <input
                                    type="text"
                                    value={form.section_titles?.side_effects_bn || ''}
                                    onChange={(e) => setForm({
                                        ...form,
                                        section_titles: { ...form.section_titles, side_effects_bn: e.target.value }
                                    })}
                                    placeholder="যেমন: সাধারণ পার্শ্বপ্রতিক্রিয়া"
                                    className="w-full px-3 py-1.5 text-xs bg-rose-50/20 border border-rose-200 rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Warnings Title */}
                        <div className="p-3 bg-gray-50/70 border border-gray-200 rounded-xl space-y-2">
                            <span className="text-xs font-bold text-gray-800">4. Warnings Section Title</span>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-500 font-bold block">English Heading</label>
                                <input
                                    type="text"
                                    value={form.section_titles?.warnings || ''}
                                    onChange={(e) => setForm({
                                        ...form,
                                        section_titles: { ...form.section_titles, warnings: e.target.value }
                                    })}
                                    placeholder="e.g. Important Warnings & Precautions"
                                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-[#800038] font-bold block">বাংলা শিরোনাম</label>
                                <input
                                    type="text"
                                    value={form.section_titles?.warnings_bn || ''}
                                    onChange={(e) => setForm({
                                        ...form,
                                        section_titles: { ...form.section_titles, warnings_bn: e.target.value }
                                    })}
                                    placeholder="যেমন: জরুরি সতর্কতা ও সাবধানতা"
                                    className="w-full px-3 py-1.5 text-xs bg-rose-50/20 border border-rose-200 rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Price Title */}
                        <div className="p-3 bg-gray-50/70 border border-gray-200 rounded-xl space-y-2">
                            <span className="text-xs font-bold text-gray-800">5. Price Section Title</span>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-500 font-bold block">English Heading</label>
                                <input
                                    type="text"
                                    value={form.section_titles?.price || ''}
                                    onChange={(e) => setForm({
                                        ...form,
                                        section_titles: { ...form.section_titles, price: e.target.value }
                                    })}
                                    placeholder="e.g. Price in Bangladesh"
                                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-[#800038] font-bold block">বাংলা শিরোনাম</label>
                                <input
                                    type="text"
                                    value={form.section_titles?.price_bn || ''}
                                    onChange={(e) => setForm({
                                        ...form,
                                        section_titles: { ...form.section_titles, price_bn: e.target.value }
                                    })}
                                    placeholder="যেমন: বর্তমান বাজারমূল্য"
                                    className="w-full px-3 py-1.5 text-xs bg-rose-50/20 border border-rose-200 rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Gallery Title */}
                        <div className="p-3 bg-gray-50/70 border border-gray-200 rounded-xl space-y-2">
                            <span className="text-xs font-bold text-gray-800">6. Photo Gallery Title</span>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-500 font-bold block">English Heading</label>
                                <input
                                    type="text"
                                    value={form.section_titles?.gallery || ''}
                                    onChange={(e) => setForm({
                                        ...form,
                                        section_titles: { ...form.section_titles, gallery: e.target.value }
                                    })}
                                    placeholder="e.g. Packet & Photo Reference"
                                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-[#800038] font-bold block">বাংলা শিরোনাম</label>
                                <input
                                    type="text"
                                    value={form.section_titles?.gallery_bn || ''}
                                    onChange={(e) => setForm({
                                        ...form,
                                        section_titles: { ...form.section_titles, gallery_bn: e.target.value }
                                    })}
                                    placeholder="যেমন: প্যাকেট ও ফটো রেফারেন্স"
                                    className="w-full px-3 py-1.5 text-xs bg-rose-50/20 border border-rose-200 rounded-lg"
                                />
                            </div>
                        </div>

                        {/* FAQ Title */}
                        <div className="p-3 bg-gray-50/70 border border-gray-200 rounded-xl space-y-2">
                            <span className="text-xs font-bold text-gray-800">7. FAQ Section Title</span>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-500 font-bold block">English Heading</label>
                                <input
                                    type="text"
                                    value={form.section_titles?.faq || ''}
                                    onChange={(e) => setForm({
                                        ...form,
                                        section_titles: { ...form.section_titles, faq: e.target.value }
                                    })}
                                    placeholder="e.g. Frequently Asked Questions"
                                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-[#800038] font-bold block">বাংলা শিরোনাম</label>
                                <input
                                    type="text"
                                    value={form.section_titles?.faq_bn || ''}
                                    onChange={(e) => setForm({
                                        ...form,
                                        section_titles: { ...form.section_titles, faq_bn: e.target.value }
                                    })}
                                    placeholder="যেমন: সাধারণ প্রশ্নোত্তর (FAQ)"
                                    className="w-full px-3 py-1.5 text-xs bg-rose-50/20 border border-rose-200 rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Author / Reviewer Title */}
                        <div className="p-3 bg-gray-50/70 border border-gray-200 rounded-xl space-y-2">
                            <span className="text-xs font-bold text-gray-800">8. Author / Reviewer Section Title</span>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-500 font-bold block">English Heading</label>
                                <input
                                    type="text"
                                    value={form.section_titles?.author || ''}
                                    onChange={(e) => setForm({
                                        ...form,
                                        section_titles: { ...form.section_titles, author: e.target.value }
                                    })}
                                    placeholder="e.g. Medical Reviewer & Specialist"
                                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-[#800038] font-bold block">বাংলা শিরোনাম</label>
                                <input
                                    type="text"
                                    value={form.section_titles?.author_bn || ''}
                                    onChange={(e) => setForm({
                                        ...form,
                                        section_titles: { ...form.section_titles, author_bn: e.target.value }
                                    })}
                                    placeholder="যেমন: মেডিকেল রিভিউয়ার ও বিশেষজ্ঞ পরিচিতি"
                                    className="w-full px-3 py-1.5 text-xs bg-rose-50/20 border border-rose-200 rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Related Title */}
                        <div className="p-3 bg-gray-50/70 border border-gray-200 rounded-xl space-y-2">
                            <span className="text-xs font-bold text-gray-800">9. Related Medicines Section Title</span>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-500 font-bold block">English Heading</label>
                                <input
                                    type="text"
                                    value={form.section_titles?.related || ''}
                                    onChange={(e) => setForm({
                                        ...form,
                                        section_titles: { ...form.section_titles, related: e.target.value }
                                    })}
                                    placeholder="e.g. Related Medicines"
                                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-[#800038] font-bold block">বাংলা শিরোনাম</label>
                                <input
                                    type="text"
                                    value={form.section_titles?.related_bn || ''}
                                    onChange={(e) => setForm({
                                        ...form,
                                        section_titles: { ...form.section_titles, related_bn: e.target.value }
                                    })}
                                    placeholder="যেমন: সম্পর্কিত অন্যান্য ঔষধ"
                                    className="w-full px-3 py-1.5 text-xs bg-rose-50/20 border border-rose-200 rounded-lg"
                                />
                            </div>
                        </div>

                        {/* TOC Title */}
                        <div className="p-3 bg-gray-50/70 border border-gray-200 rounded-xl space-y-2">
                            <span className="text-xs font-bold text-gray-800">10. Table of Contents (TOC) Title</span>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-500 font-bold block">English Heading</label>
                                <input
                                    type="text"
                                    value={form.section_titles?.toc || ''}
                                    onChange={(e) => setForm({
                                        ...form,
                                        section_titles: { ...form.section_titles, toc: e.target.value }
                                    })}
                                    placeholder="e.g. Table of Contents"
                                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-[#800038] font-bold block">বাংলা শিরোনাম</label>
                                <input
                                    type="text"
                                    value={form.section_titles?.toc_bn || ''}
                                    onChange={(e) => setForm({
                                        ...form,
                                        section_titles: { ...form.section_titles, toc_bn: e.target.value }
                                    })}
                                    placeholder="যেমন: সূচিপত্র"
                                    className="w-full px-3 py-1.5 text-xs bg-rose-50/20 border border-rose-200 rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 1: Basic Identity & Heading */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-5">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <Pill size={16} className="text-[#800038]" />
                            <span>1. Product Identity & Overview (English & বাংলা)</span>
                        </h2>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                            <input
                                type="checkbox"
                                checked={form.is_active}
                                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                className="w-4 h-4 rounded text-[#800038] focus:ring-[#800038]"
                            />
                            <span>Active / Published</span>
                        </label>
                    </div>

                    {/* Brand Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Brand Name (English) *
                            </label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g. Alatrol 10mg Tablet"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#800038] mb-1">
                                ব্র্যান্ডের নাম (বাংলা)
                            </label>
                            <input
                                type="text"
                                value={form.name_bn}
                                onChange={(e) => setForm({ ...form, name_bn: e.target.value })}
                                placeholder="যেমন: আলাট্রল ১০ মি.গ্রা. ট্যাবলেট"
                                className="w-full px-3 py-2 text-xs border border-rose-200 rounded-xl bg-rose-50/20 font-medium"
                            />
                        </div>
                    </div>

                    {/* Generic Formula */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Generic Formula (English)
                            </label>
                            <input
                                type="text"
                                value={form.generic}
                                onChange={(e) => setForm({ ...form, generic: e.target.value })}
                                placeholder="e.g. Cetirizine Dihydrochloride 10mg"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#800038] mb-1">
                                জেনেরিক ফর্মুলা (বাংলা)
                            </label>
                            <input
                                type="text"
                                value={form.generic_bn}
                                onChange={(e) => setForm({ ...form, generic_bn: e.target.value })}
                                placeholder="যেমন: সিটিরিজিন ডাইহাইড্রোক্লোরাইড ১০ মি.গ্রা."
                                className="w-full px-3 py-2 text-xs border border-rose-200 rounded-xl bg-rose-50/20 font-medium"
                            />
                        </div>
                    </div>

                    {/* Manufacturer & Tag */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Manufacturer Company (English)
                            </label>
                            <input
                                type="text"
                                value={form.pharma}
                                onChange={(e) => setForm({ ...form, pharma: e.target.value })}
                                placeholder="e.g. Square Pharmaceuticals PLC"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#800038] mb-1">
                                প্রস্তুতকারক কোম্পানি (বাংলা)
                            </label>
                            <input
                                type="text"
                                value={form.pharma_bn}
                                onChange={(e) => setForm({ ...form, pharma_bn: e.target.value })}
                                placeholder="যেমন: স্কয়ার ফার্মাসিউটিক্যালস পিএলসি"
                                className="w-full px-3 py-2 text-xs border border-rose-200 rounded-xl bg-rose-50/20 font-medium"
                            />
                        </div>
                    </div>

                    {/* Tag / Chip Label */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white"
                            >
                                <option value="pain">Pain Relief (ব্যথানাশক)</option>
                                <option value="antibiotic">Antibiotic (অ্যান্টিবায়োটিক)</option>
                                <option value="gastric">Gastric Care (গ্যাস্ট্রিক কেয়ার)</option>
                                <option value="dental_special">Dental Special (ডেন্টাল স্পেশাল)</option>
                                <option value="supplement">Supplement (সাপ্লিমেন্ট)</option>
                                <option value="allergy">Allergy (অ্যালার্জি)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Tag / Chip Label (English)</label>
                            <input
                                type="text"
                                value={form.tag}
                                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                                placeholder="e.g. ANTI-ALLERGIC"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#800038] mb-1">ট্যাগ / ব্যাজ লেবেল (বাংলা)</label>
                            <input
                                type="text"
                                value={form.tag_bn}
                                onChange={(e) => setForm({ ...form, tag_bn: e.target.value })}
                                placeholder="যেমন: প্রেসক্রিপশন ঔষধ"
                                className="w-full px-3 py-2 text-xs border border-rose-200 rounded-xl bg-rose-50/20 font-medium"
                            />
                        </div>
                    </div>

                    {/* URL Slug & Badges */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">URL Slug</label>
                            <input
                                type="text"
                                value={form.slug}
                                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                placeholder="alatrol-10mg"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-mono text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Verified Badge (English)</label>
                            <input
                                type="text"
                                value={form.verified_badge}
                                onChange={(e) => setForm({ ...form, verified_badge: e.target.value })}
                                placeholder="Medically Verified"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#800038] mb-1">ভেরিফাইড ব্যাজ (বাংলা)</label>
                            <input
                                type="text"
                                value={form.verified_badge_bn}
                                onChange={(e) => setForm({ ...form, verified_badge_bn: e.target.value })}
                                placeholder="মেডিকেলি ভেরিফাইড"
                                className="w-full px-3 py-2 text-xs border border-rose-200 rounded-xl bg-rose-50/20 font-medium"
                            />
                        </div>
                    </div>

                    {/* Subtitle & Published Date */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle / Tagline (English)</label>
                            <input
                                type="text"
                                value={form.subtitle}
                                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                                placeholder="e.g. Uses, dosage, side effects and price in Bangladesh"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Published / Updated Tag</label>
                            <input
                                type="text"
                                value={form.published_date}
                                onChange={(e) => setForm({ ...form, published_date: e.target.value })}
                                placeholder="e.g. Updated 2026"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#800038] mb-1">সাবটাইটেল / সংক্ষিপ্ত পরিচিতি (বাংলা)</label>
                        <input
                            type="text"
                            value={form.subtitle_bn}
                            onChange={(e) => setForm({ ...form, subtitle_bn: e.target.value })}
                            placeholder="যেমন: ব্যবহারবিধি, সেবনমাত্রা, পার্শ্বপ্রতিক্রিয়া ও মূল্যতালিকা"
                            className="w-full px-3 py-2 text-xs border border-rose-200 rounded-xl bg-rose-50/20 font-medium"
                        />
                    </div>

                    {/* Quick Use */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Quick Use Indication (English)</label>
                            <input
                                type="text"
                                value={form.quick_use}
                                onChange={(e) => setForm({ ...form, quick_use: e.target.value })}
                                placeholder="e.g. Allergic rhinitis, urticaria and dental allergy management"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#800038] mb-1">কুইক ইন্ডিকেশন / দ্রুত ব্যবহার (বাংলা)</label>
                            <input
                                type="text"
                                value={form.quick_use_bn}
                                onChange={(e) => setForm({ ...form, quick_use_bn: e.target.value })}
                                placeholder="যেমন: অ্যালার্জিজনিত সর্দি, হাঁচি, চুলকানি ও ডেন্টাল অ্যালার্জি"
                                className="w-full px-3 py-2 text-xs border border-rose-200 rounded-xl bg-rose-50/20 font-medium"
                            />
                        </div>
                    </div>

                    {/* Detailed Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <RichContentEditor
                                label="Detailed Overview / Intro Paragraph (English)"
                                value={form.intro}
                                onChange={(val) => setForm({ ...form, intro: val })}
                                placeholder="Detailed medical introduction and clinical context..."
                                minHeight="150px"
                            />
                        </div>
                        <div>
                            <RichContentEditor
                                label="বিস্তারিত পরিচিতি অনুচ্ছেদ (বাংলা)"
                                value={form.intro_bn}
                                onChange={(val) => setForm({ ...form, intro_bn: val })}
                                placeholder="ঔষধটির মূল পরিচয় ও চিকিৎসা প্রেক্ষাপট বাংলায় লিখুন..."
                                minHeight="150px"
                            />
                        </div>
                    </div>

                    {/* Image picker */}
                    <div className="pt-2">
                        <MediaImagePicker
                            label="Product Packaging Image / Box Photo"
                            value={form.image}
                            onChange={(url) => setForm({ ...form, image: url })}
                        />
                    </div>
                </div>

                {/* Section 2: Uses & Indications */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-5">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-[#800038]" />
                            <span>2. Uses & Dental Clinical Indications</span>
                        </h2>
                        <button
                            type="button"
                            onClick={addUseItem}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
                        >
                            <Plus size={14} /> Add Indication Point
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <RichContentEditor
                                label="Uses Overview Description (English)"
                                value={form.uses_text}
                                onChange={(val) => setForm({ ...form, uses_text: val })}
                                placeholder="Overview paragraph of indications..."
                                minHeight="150px"
                            />
                        </div>
                        <div>
                            <RichContentEditor
                                label="ব্যবহারের মূল বিবরণ (বাংলা)"
                                value={form.uses_text_bn}
                                onChange={(val) => setForm({ ...form, uses_text_bn: val })}
                                placeholder="ব্যবহার নির্দেশিকা বাংলায় লিখুন..."
                                minHeight="150px"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Dental Clinical Significance (English)</label>
                            <textarea
                                rows={2}
                                value={form.dental_usage}
                                onChange={(e) => setForm({ ...form, dental_usage: e.target.value })}
                                placeholder="Significance in oral and dental treatment..."
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#800038] mb-1">ডেন্টাল গুরুত্ব ও কার্যকারিতা (বাংলা)</label>
                            <textarea
                                rows={2}
                                value={form.dental_usage_bn}
                                onChange={(e) => setForm({ ...form, dental_usage_bn: e.target.value })}
                                placeholder="দন্তচিকিৎসা বা ওরাল ইনফেকশনে কার্যকারিতা..."
                                className="w-full px-3 py-2 text-xs border border-rose-200 rounded-xl bg-rose-50/20"
                            />
                        </div>
                    </div>

                    {/* Dynamic Uses List */}
                    <div className="space-y-3 pt-2">
                        <span className="text-xs font-bold text-gray-700 block">Indication Bullet Items (Both Languages):</span>
                        {form.uses_items.map((u, i) => (
                            <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                                <div className="md:col-span-3">
                                    <input
                                        type="text"
                                        placeholder="Label (EN)"
                                        value={u.label}
                                        onChange={(e) => updateUseItem(i, 'label', e.target.value)}
                                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg font-bold"
                                    />
                                    <input
                                        type="text"
                                        placeholder="লেবেল (বাংলা)"
                                        value={u.label_bn || ''}
                                        onChange={(e) => updateUseItem(i, 'label_bn', e.target.value)}
                                        className="w-full px-2.5 py-1.5 text-xs bg-rose-50/30 border border-rose-200 rounded-lg font-bold mt-1.5"
                                    />
                                </div>
                                <div className="md:col-span-8">
                                    <input
                                        type="text"
                                        placeholder="Description Text (EN)"
                                        value={u.text}
                                        onChange={(e) => updateUseItem(i, 'text', e.target.value)}
                                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                                    />
                                    <input
                                        type="text"
                                        placeholder="বর্ণনা টেক্সট (বাংলা)"
                                        value={u.text_bn || ''}
                                        onChange={(e) => updateUseItem(i, 'text_bn', e.target.value)}
                                        className="w-full px-2.5 py-1.5 text-xs bg-rose-50/30 border border-rose-200 rounded-lg mt-1.5"
                                    />
                                </div>
                                <div className="md:col-span-1 text-right">
                                    <button
                                        type="button"
                                        onClick={() => removeUseItem(i)}
                                        className="p-1.5 text-rose-500 hover:text-rose-700 cursor-pointer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 3: Dosage & Administration */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-5">
                    <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                        <Clock size={16} className="text-[#800038]" />
                        <span>3. Dosage, Administration & Optimal Timing</span>
                    </h2>

                    {/* Standard Dosage */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <RichContentEditor
                                label="Standard Dosage (English)"
                                value={form.dosage}
                                onChange={(val) => setForm({ ...form, dosage: val })}
                                placeholder="e.g. 10 mg once daily, or as advised by the registered doctor"
                                minHeight="150px"
                            />
                        </div>
                        <div>
                            <RichContentEditor
                                label="সেবনমাত্রা ও নিয়ম (বাংলা)"
                                value={form.dosage_bn}
                                onChange={(val) => setForm({ ...form, dosage_bn: val })}
                                placeholder="যেমন: দৈনিক ১টি ট্যাবলেট চিকিৎসকের পরামর্শ অনুযায়ী সেব্য"
                                minHeight="150px"
                            />
                        </div>
                    </div>

                    {/* Administration Guidance */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <RichContentEditor
                                label="Administration Guidance (English)"
                                value={form.dosage_admin}
                                onChange={(val) => setForm({ ...form, dosage_admin: val })}
                                placeholder="e.g. Swallow whole with a glass of water. Do not crush."
                                minHeight="150px"
                            />
                        </div>
                        <div>
                            <RichContentEditor
                                label="সেবন নির্দেশিকা / Administration (বাংলা)"
                                value={form.dosage_admin_bn}
                                onChange={(val) => setForm({ ...form, dosage_admin_bn: val })}
                                placeholder="যেমন: এক গ্লাস পানির সাথে সম্পূর্ণ ট্যাবলেট গিলে ফেলুন।"
                                minHeight="150px"
                            />
                        </div>
                    </div>

                    {/* Optimal Timing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <RichContentEditor
                                label="Optimal Timing (English)"
                                value={form.dosage_timing}
                                onChange={(val) => setForm({ ...form, dosage_timing: val })}
                                placeholder="e.g. Best taken at night before sleep or with meals."
                                minHeight="150px"
                            />
                        </div>
                        <div>
                            <RichContentEditor
                                label="উপযুক্ত সময় / Optimal Timing (বাংলা)"
                                value={form.dosage_timing_bn}
                                onChange={(val) => setForm({ ...form, dosage_timing_bn: val })}
                                placeholder="যেমন: প্রতিদিন নির্দিষ্ট সময়ে ভরা পেটে বা খাবারের পর সেবন করুন।"
                                minHeight="150px"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 4: Side Effects & Warnings */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-5">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <AlertTriangle size={16} className="text-[#800038]" />
                            <span>4. Side Effects & Important Precautions</span>
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={addSideEffect}
                                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
                            >
                                + Side Effect
                            </button>
                            <button
                                type="button"
                                onClick={addWarning}
                                className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg text-xs font-bold cursor-pointer"
                            >
                                + Warning
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <RichContentEditor
                                label="Side Effects Overview (English)"
                                value={form.side_effects}
                                onChange={(val) => setForm({ ...form, side_effects: val })}
                                placeholder="Overview text about tolerability..."
                                minHeight="150px"
                            />
                        </div>
                        <div>
                            <RichContentEditor
                                label="পার্শ্বপ্রতিক্রিয়ার সংক্ষিপ্ত বিবরণ (বাংলা)"
                                value={form.side_effects_bn}
                                onChange={(val) => setForm({ ...form, side_effects_bn: val })}
                                placeholder="পার্শ্বপ্রতিক্রিয়ার বিবরণ বাংলায় লিখুন..."
                                minHeight="150px"
                            />
                        </div>
                    </div>

                    {/* Side Effect Bullet Points */}
                    <div>
                        <span className="text-xs font-bold text-gray-700 block mb-2">Side Effect Bullet Points:</span>
                        <div className="space-y-2">
                            {form.side_effects_items.map((s, i) => {
                                const textEn = typeof s === 'string' ? s : s.text;
                                const textBn = typeof s === 'string' ? '' : s.text_bn || '';
                                return (
                                    <div key={i} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Side effect (EN)"
                                            value={textEn}
                                            onChange={(e) => updateSideEffect(i, 'text', e.target.value)}
                                            className="w-1/2 px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                                        />
                                        <input
                                            type="text"
                                            placeholder="পার্শ্বপ্রতিক্রিয়া (বাংলা)"
                                            value={textBn}
                                            onChange={(e) => updateSideEffect(i, 'text_bn', e.target.value)}
                                            className="w-1/2 px-2.5 py-1.5 text-xs bg-rose-50/30 border border-rose-200 rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeSideEffect(i)}
                                            className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Warnings List */}
                    <div className="pt-3 border-t border-gray-100 space-y-3">
                        <span className="text-xs font-bold text-gray-700 block">Clinical Warnings & Contraindications:</span>
                        {form.warnings.map((w, i) => (
                            <div key={i} className="p-3 bg-rose-50/30 border border-rose-100 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                                <div className="md:col-span-2">
                                    <select
                                        value={w.icon || 'triangle'}
                                        onChange={(e) => updateWarning(i, 'icon', e.target.value)}
                                        className="w-full px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-lg font-bold"
                                    >
                                        <option value="triangle">⚠️ Warning</option>
                                        <option value="ban">🚫 Strict Ban</option>
                                        <option value="user-doctor">👨‍⚕️ Doctor Advise</option>
                                    </select>
                                </div>
                                <div className="md:col-span-3">
                                    <input
                                        type="text"
                                        placeholder="Label (EN)"
                                        value={w.label}
                                        onChange={(e) => updateWarning(i, 'label', e.target.value)}
                                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg font-bold"
                                    />
                                    <input
                                        type="text"
                                        placeholder="লেবেল (বাংলা)"
                                        value={w.label_bn || ''}
                                        onChange={(e) => updateWarning(i, 'label_bn', e.target.value)}
                                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-rose-200 rounded-lg font-bold mt-1.5"
                                    />
                                </div>
                                <div className="md:col-span-6">
                                    <RichContentEditor
                                        label="Warning Details (EN)"
                                        value={w.text}
                                        onChange={(val) => updateWarning(i, 'text', val)}
                                        placeholder="Warning details, links or emphasised text..."
                                        minHeight="110px"
                                    />
                                    <div className="mt-2.5">
                                        <RichContentEditor
                                            label="সতর্কতার বিবরণ (বাংলা)"
                                            value={w.text_bn || ''}
                                            onChange={(val) => updateWarning(i, 'text_bn', val)}
                                            placeholder="সতর্কতার বিবরণ, লিংক বা গুরুত্বপূর্ণ অংশ..."
                                            minHeight="110px"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-1 text-right">
                                    <button
                                        type="button"
                                        onClick={() => removeWarning(i)}
                                        className="p-1.5 text-rose-500 hover:text-rose-700 cursor-pointer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 5: Pricing */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-5">
                    <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                        <DollarSign size={16} className="text-[#800038]" />
                        <span>5. Pricing & Local Market Availability</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Price per Tablet (৳)</label>
                            <input
                                type="text"
                                value={form.price_per_tablet}
                                onChange={(e) => setForm({ ...form, price_per_tablet: e.target.value })}
                                placeholder="e.g. ৳ 3.50"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Price per Strip / Box</label>
                            <input
                                type="text"
                                value={form.price_per_strip}
                                onChange={(e) => setForm({ ...form, price_per_strip: e.target.value })}
                                placeholder="e.g. ৳ 35.00 (10 Tablets)"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Price Reference Manufacturer</label>
                            <input
                                type="text"
                                value={form.price_manufacturer}
                                onChange={(e) => setForm({ ...form, price_manufacturer: e.target.value })}
                                placeholder="e.g. Square Pharmaceuticals PLC"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 6: Photo Gallery / Visual Packaging References */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-5">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <Images size={16} className="text-[#800038]" />
                            <span>6. Photo Gallery & Packaging References</span>
                        </h2>
                        <button
                            type="button"
                            onClick={addGalleryItem}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#800038] hover:bg-[#9a0044] text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                        >
                            <Plus size={14} /> Add Gallery Image
                        </button>
                    </div>

                    {(!form.gallery || form.gallery.length === 0) ? (
                        <div className="p-6 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl">
                            No gallery images added yet. Click "+ Add Gallery Image" above to display tablet packaging, strip photos or blister pack references on the single medicine page.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {form.gallery.map((g, i) => (
                                <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative group">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-gray-700">Photo #{i + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryItem(i)}
                                            className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-semibold cursor-pointer"
                                        >
                                            <Trash2 size={13} /> Remove
                                        </button>
                                    </div>
                                    <MediaImagePicker
                                        label={`Photo #${i + 1} Image`}
                                        value={g.src}
                                        onChange={(url) => updateGalleryItem(i, 'src', url)}
                                    />
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Caption / Label</label>
                                        <input
                                            type="text"
                                            value={g.caption}
                                            onChange={(e) => updateGalleryItem(i, 'caption', e.target.value)}
                                            placeholder="e.g. Alatrol 10mg Blister Strip (Front)"
                                            className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Section 7: Frequently Asked Questions (FAQ) */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-5">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <HelpCircle size={16} className="text-[#800038]" />
                            <span>7. Frequently Asked Questions (FAQ - Both Languages)</span>
                        </h2>
                        <button
                            type="button"
                            onClick={addFaq}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#800038] hover:bg-[#9a0044] text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                        >
                            <Plus size={14} /> Add New FAQ
                        </button>
                    </div>

                    <div className="space-y-4">
                        {form.faqs.map((faq, i) => (
                            <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#800038]">FAQ #{i + 1}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeFaq(i)}
                                        className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-semibold cursor-pointer"
                                    >
                                        <Trash2 size={13} /> Remove
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Question (English)</label>
                                        <input
                                            type="text"
                                            value={faq.q}
                                            onChange={(e) => updateFaq(i, 'q', e.target.value)}
                                            placeholder="e.g. Can I take this before dental surgery?"
                                            className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-[#800038] mb-1">প্রশ্ন (বাংলা)</label>
                                        <input
                                            type="text"
                                            value={faq.q_bn || ''}
                                            onChange={(e) => updateFaq(i, 'q_bn', e.target.value)}
                                            placeholder="যেমন: ডেন্টাল সার্জারির আগে কি এই ঔষধ খাওয়া যাবে?"
                                            className="w-full px-3 py-2 text-xs bg-rose-50/20 border border-rose-200 rounded-lg font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Answer (English)</label>
                                        <textarea
                                            rows={2}
                                            value={faq.a}
                                            onChange={(e) => updateFaq(i, 'a', e.target.value)}
                                            placeholder="Provide clinical explanation in English..."
                                            className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-[#800038] mb-1">উত্তর (বাংলা)</label>
                                        <textarea
                                            rows={2}
                                            value={faq.a_bn || ''}
                                            onChange={(e) => updateFaq(i, 'a_bn', e.target.value)}
                                            placeholder="বাংলায় চিকিৎসাগত সঠিক উত্তর ও পরামর্শ লিখুন..."
                                            className="w-full px-3 py-2 text-xs bg-rose-50/20 border border-rose-200 rounded-lg font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 8: Medical Reviewer & Disclaimer */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-5">
                    <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                        <ShieldCheck size={16} className="text-[#800038]" />
                        <span>8. Medical Author, Reviewer & Legal Disclaimer</span>
                    </h2>

                    {/* Author Photo Picker */}
                    <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl space-y-3">
                        <MediaImagePicker
                            label="Doctor / Reviewer Profile Photo"
                            value={form.author.img}
                            onChange={(url) => setForm({ ...form, author: { ...form.author, img: url } })}
                            aspectRatio="1:1"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Doctor / Author Name (English)</label>
                            <input
                                type="text"
                                value={form.author.name}
                                onChange={(e) => setForm({ ...form, author: { ...form.author, name: e.target.value } })}
                                placeholder="e.g. Dr. Aysha Siddika, BDS, PGT"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#800038] mb-1">ডাক্তার / লেখকের নাম (বাংলা)</label>
                            <input
                                type="text"
                                value={form.author.name_bn || ''}
                                onChange={(e) => setForm({ ...form, author: { ...form.author, name_bn: e.target.value } })}
                                placeholder="যেমন: ডা. আয়েশা সিদ্দিকা, বিডিএস, পিজিটি"
                                className="w-full px-3 py-2 text-xs border border-rose-200 rounded-xl bg-rose-50/20"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Reviewed By (English)</label>
                            <input
                                type="text"
                                value={form.author.reviewed_by}
                                onChange={(e) => setForm({ ...form, author: { ...form.author, reviewed_by: e.target.value } })}
                                placeholder="e.g. Dr. Farhana Ahmed, Clinical Director"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#800038] mb-1">পর্যালোচনা করেছেন (বাংলা)</label>
                            <input
                                type="text"
                                value={form.author.reviewed_by_bn || ''}
                                onChange={(e) => setForm({ ...form, author: { ...form.author, reviewed_by_bn: e.target.value } })}
                                placeholder="যেমন: ডা. ফারহানা আহমেদ, ক্লিনিক্যাল ডিরেক্টর"
                                className="w-full px-3 py-2 text-xs border border-rose-200 rounded-xl bg-rose-50/20"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Last Updated Tag</label>
                            <input
                                type="text"
                                value={form.author.last_updated}
                                onChange={(e) => setForm({ ...form, author: { ...form.author, last_updated: e.target.value } })}
                                placeholder="e.g. January 2026"
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Doctor Bio (English)</label>
                            <textarea
                                rows={2}
                                value={form.author.bio}
                                onChange={(e) => setForm({ ...form, author: { ...form.author, bio: e.target.value } })}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#800038] mb-1">ডাক্তার পরিচিতি (বাংলা)</label>
                            <textarea
                                rows={2}
                                value={form.author.bio_bn}
                                onChange={(e) => setForm({ ...form, author: { ...form.author, bio_bn: e.target.value } })}
                                className="w-full px-3 py-2 text-xs border border-rose-200 rounded-xl bg-rose-50/20"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Clinical Disclaimer (English)</label>
                            <textarea
                                rows={2}
                                value={form.author.disclaimer}
                                onChange={(e) => setForm({ ...form, author: { ...form.author, disclaimer: e.target.value } })}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#800038] mb-1">সতর্কবার্তা / ডিসক্লেইমার (বাংলা)</label>
                            <textarea
                                rows={2}
                                value={form.author.disclaimer_bn}
                                onChange={(e) => setForm({ ...form, author: { ...form.author, disclaimer_bn: e.target.value } })}
                                className="w-full px-3 py-2 text-xs border border-rose-200 rounded-xl bg-rose-50/20"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 9: More About Drawer & Google SEO Box */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-6">
                    <div className="pb-2 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <FileText size={16} className="text-[#800038]" />
                            <span>9. More About Drawer &amp; Google SEO Meta Box</span>
                        </h2>
                        {isEdit && (
                            <a
                                href={`/medicines/${form.slug || item?.id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-[#800038] hover:underline font-bold"
                            >
                                <ExternalLink size={13} /> View Live Medicine Page
                            </a>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                More About Drawer Heading / Title (English)
                            </label>
                            <input
                                type="text"
                                value={form.seo_title}
                                onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                                placeholder={`More about ${form.name || 'Medicine'}`}
                                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-bold bg-white"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">
                                Renames the expandable accordion button at the bottom of the medicine page.
                            </p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#800038] mb-1">
                                Bangla SEO Title Suffix (after the medicine name)
                            </label>
                            <input
                                type="text"
                                value={form.seo_title_bn}
                                onChange={(e) => setForm({ ...form, seo_title_bn: e.target.value })}
                                placeholder="ব্যবহার, ডোজ, পার্শ্বপ্রতিক্রিয়া ও দাম"
                                className="w-full px-3 py-2 text-xs border border-rose-200 rounded-xl font-bold bg-rose-50/20"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">
                                Appended to the Bangla medicine name in the page title.
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#800038] mb-1">
                            Bangla Meta Description (SEO)
                        </label>
                        <textarea
                            value={form.meta_desc_bn}
                            onChange={(e) => setForm({ ...form, meta_desc_bn: e.target.value })}
                            rows={2}
                            maxLength={160}
                            placeholder="বাংলা মেটা ডেসক্রিপশন (১৫৫–১৬০ অক্ষর)..."
                            className="w-full px-3 py-2 text-xs border border-rose-200 rounded-xl bg-rose-50/20"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">
                            Used as the meta description on the Bangla medicine page. {form.meta_desc_bn.length}/160
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2">
                                Write More About Content (English - Rich HTML)
                            </label>
                            <RichContentEditor
                                label={`WRITE MORE ABOUT ${form.name ? form.name.toUpperCase() : 'MEDICINE'} CONTENT (ENGLISH)`}
                                value={form.seo_content}
                                onChange={(val) => setForm({ ...form, seo_content: val })}
                                placeholder="Write detailed clinical indications, pharmacology, precautions, drug interactions, clinical dental notes..."
                                minHeight="260px"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#800038] mb-2">
                                বিস্তারিত ড্রয়ার কন্টেন্ট লিখুন (বাংলা - Rich HTML)
                            </label>
                            <RichContentEditor
                                label={`${form.name_bn || form.name || 'ঔষধ'} এর বিস্তারিত ড্রয়ার তথ্য (বাংলা)`}
                                value={form.seo_content_bn}
                                onChange={(val) => setForm({ ...form, seo_content_bn: val })}
                                placeholder="ঔষধটির বিস্তারিত কার্যপদ্ধতি, ক্লিনিক্যাল নোট, বিশেষ সতর্কতা ইত্যাদি বাংলায় লিখুন..."
                                minHeight="260px"
                            />
                        </div>
                    </div>

                    {/* SEO Meta Box for Google Schema, Directives, Preview */}
                    <div className="pt-2">
                        <SeoMetaBox
                            data={{
                                seo_title: form.seo_title || form.name,
                                meta_desc: form.meta_desc || form.intro,
                                canonical_url: form.canonical_url,
                                robots_index: form.robots_index,
                                robots_follow: form.robots_follow,
                                schema_type: form.schema_type || 'MedicalWebPage',
                                schema_json: form.schema_json,
                                faqs: form.faqs?.map((f) => ({ q: f.q, a: f.a })) || [],
                            }}
                            onChange={(updated) => {
                                setForm({
                                    ...form,
                                    seo_title: updated.seo_title !== undefined ? updated.seo_title : form.seo_title,
                                    meta_desc: updated.meta_desc !== undefined ? updated.meta_desc : form.meta_desc,
                                    canonical_url: updated.canonical_url !== undefined ? updated.canonical_url : form.canonical_url,
                                    robots_index: updated.robots_index !== undefined ? updated.robots_index : form.robots_index,
                                    robots_follow: updated.robots_follow !== undefined ? updated.robots_follow : form.robots_follow,
                                    schema_type: updated.schema_type !== undefined ? updated.schema_type : form.schema_type,
                                    schema_json: updated.schema_json !== undefined ? updated.schema_json : form.schema_json,
                                });
                            }}
                            pageType="page"
                            defaultSlug={form.slug ? `medicines/${form.slug}` : (item?.id ? `medicines/${item.id}` : 'medicines')}
                            previewUrl={`https://techdentalcare.com/medicines/${form.slug || item?.id || ''}`}
                        />
                    </div>
                </div>

                {/* Bottom Save Bar */}
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs">
                    <Link
                        href={route('medicines.admin')}
                        className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-[#800038] hover:bg-[#9a0044] text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
                    >
                        <Save size={16} />
                        Save All Changes
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
