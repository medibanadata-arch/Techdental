import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import SeoMetaBox from '@/Components/SeoMetaBox';
import RichContentEditor from '@/Components/RichContentEditor';
import {
    DollarSign,
    Plus,
    Trash2,
    Save,
    ExternalLink,
    FolderPlus,
    ListFilter,
    Edit2,
    Search,
    CheckCircle2,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';

interface TreatmentItem {
    id?: string | number;
    name: string;
    bdt: string;
    usd: string;
}

interface CategoryItem {
    id?: string | number;
    name: string;
    treatments: TreatmentItem[];
}

interface PriceSettingData {
    page_title?: string;
    seo_title?: string;
    seo_content?: string;
    meta_desc?: string;
    canonical_url?: string;
    robots_index?: boolean;
    robots_follow?: boolean;
    schema_type?: string;
    schema_json?: string;
    faqs?: { q: string; a: string }[];
}

interface Props extends PageProps {
    categories: any[];
    settings?: PriceSettingData;
}

export default function PriceListAdminIndex({ categories: initialCategories = [], settings }: Props) {
    // Normalise incoming category structure
    const initialFormattedCategories: CategoryItem[] = initialCategories.map((c: any) => ({
        id: c.id,
        name: c.name,
        treatments: (c.rows || []).map((r: any) => ({
            id: r.id,
            name: r.service_name || '',
            bdt: r.price_bdt || '',
            usd: r.price_usd || '',
        })),
    }));

    const [pageTitle, setPageTitle] = useState(
        settings?.page_title || 'Tech Dental Treatment Price List in Bangladesh – 2026'
    );
    const [seoTitle, setSeoTitle] = useState(
        settings?.seo_title || 'Tech Dental Price List in Bangladesh'
    );
    const [seoContent, setSeoContent] = useState(
        settings?.seo_content || 'Comprehensive dental treatment cost guide in Dhaka. Tech Dental Care ensures 100% price transparency.'
    );
    const [metaDesc, setMetaDesc] = useState(settings?.meta_desc || '');
    const [canonicalUrl, setCanonicalUrl] = useState(settings?.canonical_url || '');
    const [robotsIndex, setRobotsIndex] = useState(settings?.robots_index ?? true);
    const [robotsFollow, setRobotsFollow] = useState(settings?.robots_follow ?? true);
    const [schemaType, setSchemaType] = useState(settings?.schema_type || 'MedicalClinic');
    const [schemaJson, setSchemaJson] = useState(settings?.schema_json || '');
    const [faqs, setFaqs] = useState<{ q: string; a: string }[]>(settings?.faqs || []);

    const [categories, setCategories] = useState<CategoryItem[]>(
        initialFormattedCategories.length > 0
            ? initialFormattedCategories
            : [
                  {
                      id: 1,
                      name: 'All Treatment Price List (Featured)',
                      treatments: [
                          { id: '1', name: 'Doctor Consultation', bdt: '৳500', usd: '$5' },
                          { id: '2', name: 'Scaling & Polishing', bdt: '৳1,500 – ৳3,000', usd: '$15 – $30' },
                          { id: '3', name: 'Composite Dental Filling', bdt: '৳1,200 – ৳2,500', usd: '$12 – $25' },
                          { id: '4', name: 'Root Canal Treatment (Rotary)', bdt: '৳4,500 – ৳6,500', usd: '$45 – $65' },
                      ],
                  },
              ]
    );

    const [selectedCategoryId, setSelectedCategoryId] = useState<string | number>(
        categories[0]?.id || 1
    );
    const [isSaving, setIsSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Keep categories in sync with server changes (e.g. after save)
    useEffect(() => {
        if (initialCategories && initialCategories.length > 0) {
            const formatted: CategoryItem[] = initialCategories.map((c: any) => ({
                id: c.id,
                name: c.name,
                treatments: (c.rows || []).map((r: any) => ({
                    id: r.id,
                    name: r.service_name || '',
                    bdt: r.price_bdt || '',
                    usd: r.price_usd || '',
                })),
            }));
            setCategories(formatted);
            setSelectedCategoryId((prev) => {
                const found = formatted.find((c) => c.id === prev);
                return found ? found.id! : formatted[0]?.id || 1;
            });
        }
    }, [initialCategories]);

    const selectedCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];

    const addCategory = () => {
        const newCat: CategoryItem = {
            id: 'temp_' + Date.now(),
            name: 'New Treatment Category',
            treatments: [
                { id: 't_' + Date.now(), name: 'Sample Treatment', bdt: '৳1,000', usd: '$10' },
            ],
        };
        setCategories([...categories, newCat]);
        setSelectedCategoryId(newCat.id);
    };

    const deleteCategory = (id: string | number) => {
        if (categories.length <= 1) {
            alert('At least one treatment category must remain.');
            return;
        }
        if (confirm('Delete this entire treatment category?')) {
            const filtered = categories.filter((c) => c.id !== id);
            setCategories(filtered);
            setSelectedCategoryId(filtered[0]?.id || '');
        }
    };

    const updateCategoryName = (name: string) => {
        setCategories(
            categories.map((c) => (c.id === selectedCategoryId ? { ...c, name } : c))
        );
    };

    const addTreatment = () => {
        if (!selectedCategory) return;
        const newTreatment: TreatmentItem = {
            id: 't_' + Date.now(),
            name: 'New Dental Service',
            bdt: '৳1,500',
            usd: '$15',
        };
        setCategories(
            categories.map((c) =>
                c.id === selectedCategoryId
                    ? { ...c, treatments: [...c.treatments, newTreatment] }
                    : c
            )
        );
    };

    const updateTreatment = (idx: number, field: keyof TreatmentItem, val: string) => {
        if (!selectedCategory) return;
        const updated = [...selectedCategory.treatments];
        updated[idx] = { ...updated[idx], [field]: val };
        setCategories(
            categories.map((c) =>
                c.id === selectedCategoryId ? { ...c, treatments: updated } : c
            )
        );
    };

    const deleteTreatment = (idx: number) => {
        if (!selectedCategory) return;
        const updated = selectedCategory.treatments.filter((_, i) => i !== idx);
        setCategories(
            categories.map((c) =>
                c.id === selectedCategoryId ? { ...c, treatments: updated } : c
            )
        );
    };

    const handleSaveAll = () => {
        setIsSaving(true);
        setStatusMessage(null);
        const payload = {
            pageTitle,
            seo: {
                sectionTitle: seoTitle,
                content: seoContent,
            },
            meta_desc: metaDesc,
            canonical_url: canonicalUrl,
            robots_index: robotsIndex,
            robots_follow: robotsFollow,
            schema_type: schemaType,
            schema_json: schemaJson,
            faqs: faqs,
            categories: categories.map((c) => ({
                id: typeof c.id === 'number' ? c.id : null,
                name: c.name,
                treatments: c.treatments.map((t) => ({
                    id: typeof t.id === 'number' ? t.id : null,
                    name: t.name,
                    bdt: t.bdt,
                    usd: t.usd,
                })),
            })),
        };

        router.post(route('pricelist.admin.save'), payload, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                setStatusMessage({ type: 'success', text: '✓ Price list & treatments saved successfully!' });
                setTimeout(() => setStatusMessage(null), 5000);
            },
            onError: (errs) => {
                setIsSaving(false);
                const first = Object.values(errs)[0] || 'Failed to save price list.';
                setStatusMessage({ type: 'error', text: `✕ ${first}` });
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="Price List CMS - Tech Dental" />

            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-900/20">
                        <DollarSign size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-gray-900">Price List</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href="/price-list"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-2xs"
                    >
                        <ExternalLink size={14} />
                        View Public Price List
                    </a>
                    <button
                        onClick={handleSaveAll}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {isSaving ? 'Saving...' : 'Save Price List'}
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

            {/* Page Title & SEO Container */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Public Page Main Headline</label>
                        <input
                            type="text"
                            value={pageTitle}
                            onChange={(e) => setPageTitle(e.target.value)}
                            className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl font-bold"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            More About Drawer Button Heading / Title
                        </label>
                        <input
                            type="text"
                            value={seoTitle}
                            onChange={(e) => setSeoTitle(e.target.value)}
                            placeholder="More About Pricing & Warranty"
                            className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl font-bold bg-white"
                        />
                        <p className="text-[10px] text-gray-400 mt-0.5">
                            Renames the bottom "More About..." accordion button on the /price-list page.
                        </p>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                        SEO Description &amp; Warranty Commitment (More About Info)
                    </label>
                    <RichContentEditor
                        label="WRITE MORE ABOUT PRICE &amp; WARRANTY CONTENT"
                        value={seoContent}
                        onChange={(val) => setSeoContent(val)}
                        placeholder="Detailed price transparency, warranty guidelines and clinical standard explanations..."
                        minHeight="220px"
                    />
                </div>
            </div>

            {/* SEO & Rich Structured Schema Meta Box */}
            <div className="mb-6">
                <SeoMetaBox
                    data={{
                        seo_title: seoTitle || pageTitle,
                        meta_desc: metaDesc,
                        canonical_url: canonicalUrl,
                        robots_index: robotsIndex,
                        robots_follow: robotsFollow,
                        schema_type: schemaType,
                        schema_json: schemaJson,
                        faqs: faqs,
                    }}
                    onChange={(updated) => {
                        if (updated.seo_title !== undefined) setSeoTitle(updated.seo_title);
                        if (updated.meta_desc !== undefined) setMetaDesc(updated.meta_desc);
                        if (updated.canonical_url !== undefined) setCanonicalUrl(updated.canonical_url);
                        if (updated.robots_index !== undefined) setRobotsIndex(updated.robots_index);
                        if (updated.robots_follow !== undefined) setRobotsFollow(updated.robots_follow);
                        if (updated.schema_type !== undefined) setSchemaType(updated.schema_type);
                        if (updated.schema_json !== undefined) setSchemaJson(updated.schema_json);
                        if (updated.faqs !== undefined) setFaqs(updated.faqs);
                    }}
                    pageType="price"
                    defaultSlug="price-list"
                    previewUrl="https://techdentalcare.com/price-list"
                />
            </div>

            {/* 2-Column Category and Treatments Editor */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Categories List */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Categories</span>
                        <button
                            onClick={addCategory}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition"
                        >
                            <Plus size={14} /> Add Category
                        </button>
                    </div>

                    <div className="space-y-1.5">
                        {categories.map((cat) => {
                            const isSelected = cat.id === selectedCategoryId;
                            return (
                                <div
                                    key={cat.id}
                                    onClick={() => setSelectedCategoryId(cat.id)}
                                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                                        isSelected
                                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold shadow-2xs'
                                            : 'bg-gray-50/70 border-gray-200 text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <ListFilter size={15} className={isSelected ? 'text-emerald-700' : 'text-gray-400'} />
                                        <span className="text-xs truncate">{cat.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-white border border-gray-200 text-gray-600">
                                            {cat.treatments.length}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteCategory(cat.id);
                                            }}
                                            className="p-1 text-gray-400 hover:text-red-500 rounded"
                                            title="Delete Category"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Treatments Table for Selected Category */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
                    {selectedCategory ? (
                        <>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                                <div className="flex-1 max-w-md">
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                        Editing Category Name:
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedCategory.name}
                                        onChange={(e) => updateCategoryName(e.target.value)}
                                        className="w-full px-3 py-1.5 text-xs font-bold border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <button
                                    onClick={addTreatment}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs shrink-0"
                                >
                                    <Plus size={15} /> Add Treatment Row
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-gray-600">
                                    <thead className="bg-gray-50/80 text-gray-700 uppercase font-bold text-[10px] tracking-wider border-b border-gray-200">
                                        <tr>
                                            <th className="py-2.5 px-3">Treatment / Service Name</th>
                                            <th className="py-2.5 px-3 w-40">Price (BDT ৳)</th>
                                            <th className="py-2.5 px-3 w-32">Price (USD $)</th>
                                            <th className="py-2.5 px-3 text-right w-16">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {selectedCategory.treatments.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="py-8 text-center text-gray-400">
                                                    No treatments added in this category yet. Click &ldquo;Add Treatment Row&rdquo; above.
                                                </td>
                                            </tr>
                                        ) : (
                                            selectedCategory.treatments.map((t, idx) => (
                                                <tr key={idx} className="hover:bg-emerald-50/20 transition">
                                                    <td className="py-2 px-3">
                                                        <input
                                                            type="text"
                                                            value={t.name}
                                                            onChange={(e) => updateTreatment(idx, 'name', e.target.value)}
                                                            placeholder="e.g. Scaling & Polishing"
                                                            className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <input
                                                            type="text"
                                                            value={t.bdt}
                                                            onChange={(e) => updateTreatment(idx, 'bdt', e.target.value)}
                                                            placeholder="৳1,500"
                                                            className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white font-semibold text-emerald-800"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <input
                                                            type="text"
                                                            value={t.usd}
                                                            onChange={(e) => updateTreatment(idx, 'usd', e.target.value)}
                                                            placeholder="$15"
                                                            className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white text-gray-600"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3 text-right">
                                                        <button
                                                            onClick={() => deleteTreatment(idx)}
                                                            className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                                                            title="Delete row"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            Select a category from the left sidebar to manage treatments.
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
