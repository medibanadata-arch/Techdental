import React, { useState, useMemo } from 'react';
import {
    Search,
    Globe,
    Code2,
    HelpCircle,
    Plus,
    Trash2,
    Eye,
    ChevronDown,
    ChevronUp,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    Smartphone,
    Monitor
} from 'lucide-react';

export interface SeoFaqItem {
    q: string;
    a: string;
}

export interface SeoMetaData {
    seo_title?: string;
    meta_desc?: string;
    canonical_url?: string;
    slug?: string;
    robots_index?: boolean;
    robots_follow?: boolean;
    schema_type?: string;
    schema_json?: string;
    faqs?: SeoFaqItem[];
}

interface SeoMetaBoxProps {
    data: SeoMetaData;
    onChange: (updated: SeoMetaData) => void;
    pageType?: string; // 'branch' | 'service' | 'page' | 'home' | 'about' | 'price'
    defaultSlug?: string;
    previewUrl?: string;
}

export default function SeoMetaBox({
    data = {} as SeoMetaData,
    onChange,
    pageType = 'page',
    defaultSlug = '',
    previewUrl = 'https://techdentalbd.com',
}: SeoMetaBoxProps) {
    const [activeTab, setActiveTab] = useState<'general' | 'schema' | 'faq' | 'preview'>('general');
    const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('desktop');
    const [showSchemaRaw, setShowSchemaRaw] = useState(false);

    const titleLength = (data.seo_title || '').length;
    const descLength = (data.meta_desc || '').length;

    const currentSlug = data.slug !== undefined ? data.slug : defaultSlug;
    const computedUrl = previewUrl.replace(/\/$/, '') + (currentSlug ? '/' + currentSlug.replace(/^\//, '') : '');

    // Schema Types
    const schemaTypes = [
        { value: 'Dentist', label: 'Dentist / Dental Clinic (LocalBusiness)' },
        { value: 'LocalBusiness', label: 'Local Business' },
        { value: 'MedicalClinic', label: 'Medical Clinic' },
        { value: 'MedicalBusiness', label: 'Medical Business' },
        { value: 'Article', label: 'Article / Dental Guide' },
        { value: 'Service', label: 'Medical Treatment / Dental Service' },
        { value: 'Product', label: 'Product / Dental Package' },
        { value: 'WebPage', label: 'Standard Web Page' },
    ];

    // Auto-generate Schema JSON-LD based on values
    const generatedSchema = useMemo(() => {
        const type = data.schema_type || (pageType === 'branch' ? 'Dentist' : 'MedicalBusiness');
        const schema: any = {
            '@context': 'https://schema.org',
            '@type': type,
            name: data.seo_title || 'Tech Dental Care',
            description: data.meta_desc || 'Premier dental care clinic in Dhaka, Bangladesh.',
            url: computedUrl,
        };

        if (type === 'Dentist' || type === 'MedicalClinic' || type === 'LocalBusiness') {
            schema.telephone = '+8801400786162';
            schema.priceRange = '৳৳';
            schema.address = {
                '@type': 'PostalAddress',
                addressLocality: 'Dhaka',
                addressCountry: 'BD'
            };
        }

        // Include FAQPage schema if FAQs exist
        if (data.faqs && data.faqs.length > 0) {
            return {
                '@context': 'https://schema.org',
                '@graph': [
                    schema,
                    {
                        '@type': 'FAQPage',
                        mainEntity: data.faqs.filter(f => f.q.trim()).map(f => ({
                            '@type': 'Question',
                            name: f.q,
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: f.a
                            }
                        }))
                    }
                ]
            };
        }

        return schema;
    }, [data.schema_type, data.seo_title, data.meta_desc, data.faqs, computedUrl, pageType]);

    // Handle FAQ updates
    const addFaq = () => {
        const currentFaqs = data.faqs || [];
        onChange({
            ...data,
            faqs: [...currentFaqs, { q: '', a: '' }]
        });
    };

    const updateFaq = (index: number, field: 'q' | 'a', value: string) => {
        const currentFaqs = [...(data.faqs || [])];
        if (currentFaqs[index]) {
            currentFaqs[index] = { ...currentFaqs[index], [field]: value };
            onChange({ ...data, faqs: currentFaqs });
        }
    };

    const removeFaq = (index: number) => {
        const currentFaqs = (data.faqs || []).filter((_, i) => i !== index);
        onChange({ ...data, faqs: currentFaqs });
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden font-sans">
            {/* Header Banner */}
            <div className="p-4 bg-gray-50/80 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#800038] to-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        <Search size={16} />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                            <span>SEO &amp; Structured Data</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                Google SERP Ready
                            </span>
                        </h3>
                    </div>
                </div>

                {/* Sub-tabs */}
                <div className="flex items-center gap-1 bg-gray-200/70 p-1 rounded-xl text-xs font-bold">
                    <button
                        type="button"
                        onClick={() => setActiveTab('general')}
                        className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                            activeTab === 'general' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Meta Settings
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('schema')}
                        className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                            activeTab === 'schema' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Schema Markup
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('faq')}
                        className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                            activeTab === 'faq' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <span>FAQ Builder</span>
                        {(data.faqs?.length || 0) > 0 && (
                            <span className="w-4 h-4 rounded-full bg-[#800038] text-white text-[9px] flex items-center justify-center font-mono">
                                {data.faqs?.length}
                            </span>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('preview')}
                        className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                            activeTab === 'preview' ? 'bg-white text-[#800038] shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <Eye size={12} /> SERP Preview
                    </button>
                </div>
            </div>

            {/* TAB 1: GENERAL META SETTINGS */}
            {activeTab === 'general' && (
                <div className="p-5 space-y-4 text-xs">
                    {/* Meta Title */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="font-bold text-gray-800 flex items-center gap-1.5">
                                <span>Meta Title / SEO Title *</span>
                                <span className="text-[10px] text-gray-400 font-normal">(Optimal: 50–60 characters)</span>
                            </label>
                            <span className={`text-[11px] font-mono font-bold ${
                                titleLength === 0 ? 'text-gray-400' :
                                titleLength <= 60 ? 'text-emerald-600' : 'text-amber-600'
                            }`}>
                                {titleLength} / 60 chars
                            </span>
                        </div>
                        <input
                            type="text"
                            value={data.seo_title || ''}
                            onChange={(e) => onChange({ ...data, seo_title: e.target.value })}
                            placeholder="e.g. Best Dental Clinic in Mirpur – Tech Dental Care"
                            className={`w-full px-3.5 py-2 text-xs border rounded-xl font-medium focus:outline-none transition ${
                                titleLength > 60 ? 'border-amber-300 focus:border-amber-500' : 'border-gray-200 focus:border-[#800038]'
                            }`}
                        />
                        {titleLength > 60 && (
                            <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                                <AlertCircle size={11} /> Longer titles may be truncated in Google search results.
                            </p>
                        )}
                    </div>

                    {/* Meta Description */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="font-bold text-gray-800 flex items-center gap-1.5">
                                <span>Meta Description *</span>
                                <span className="text-[10px] text-gray-400 font-normal">(Optimal: 140–160 characters)</span>
                            </label>
                            <span className={`text-[11px] font-mono font-bold ${
                                descLength === 0 ? 'text-gray-400' :
                                descLength <= 160 ? 'text-emerald-600' : 'text-amber-600'
                            }`}>
                                {descLength} / 160 chars
                            </span>
                        </div>
                        <textarea
                            rows={3}
                            value={data.meta_desc || ''}
                            onChange={(e) => onChange({ ...data, meta_desc: e.target.value })}
                            placeholder="e.g. Visit Tech Dental Care in Mirpur for painless dental implants, root canal therapy, and smile makeovers with international specialist dentists."
                            className={`w-full px-3.5 py-2 text-xs border rounded-xl font-medium focus:outline-none transition ${
                                descLength > 160 ? 'border-amber-300 focus:border-amber-500' : 'border-gray-200 focus:border-[#800038]'
                            }`}
                        />
                        {descLength > 160 && (
                            <p className="text-[10px] text-amber-600 mt-0.5 flex items-center gap-1">
                                <AlertCircle size={11} /> Search engines usually cut off snippet descriptions after ~160 characters.
                            </p>
                        )}
                    </div>

                    {/* Slug & Canonical URL Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.slug !== undefined && (
                            <div>
                                <label className="block font-bold text-gray-800 mb-1">
                                    Custom Slug / URL Permalink
                                </label>
                                <div className="flex items-center">
                                    <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-500 text-xs font-mono select-none">
                                        /
                                    </span>
                                    <input
                                        type="text"
                                        value={data.slug || ''}
                                        onChange={(e) => onChange({ ...data, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-') })}
                                        placeholder="custom-permalink-slug"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-r-xl font-mono text-xs focus:border-[#800038] focus:outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        <div className={data.slug !== undefined ? '' : 'col-span-full'}>
                            <label className="block font-bold text-gray-800 mb-1 flex items-center justify-between">
                                <span>Canonical URL</span>
                                <span className="text-[10px] text-gray-400 font-normal">Defaults to current page</span>
                            </label>
                            <input
                                type="text"
                                value={data.canonical_url || ''}
                                onChange={(e) => onChange({ ...data, canonical_url: e.target.value })}
                                placeholder={computedUrl}
                                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl font-mono text-xs focus:border-[#800038] focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Robots Meta Directives */}
                    <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-200/80 space-y-2">
                        <span className="font-bold text-gray-800 block text-[11px] uppercase tracking-wider">
                            Robots Meta Directives
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.robots_index !== false}
                                    onChange={(e) => onChange({ ...data, robots_index: e.target.checked })}
                                    className="rounded text-[#800038] focus:ring-[#800038]"
                                />
                                <div>
                                    <span className="font-bold text-gray-800">
                                        {data.robots_index !== false ? 'index (Allow Indexing)' : 'noindex (Do Not Index)'}
                                    </span>
                                </div>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.robots_follow !== false}
                                    onChange={(e) => onChange({ ...data, robots_follow: e.target.checked })}
                                    className="rounded text-[#800038] focus:ring-[#800038]"
                                />
                                <div>
                                    <span className="font-bold text-gray-800">
                                        {data.robots_follow !== false ? 'follow (Follow Links)' : 'nofollow (Do Not Follow)'}
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: SCHEMA MARKUP */}
            {activeTab === 'schema' && (
                <div className="p-5 space-y-4 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                        <div>
                            <label className="block font-bold text-gray-800 mb-1">
                                Structured Data Schema Type
                            </label>
                        </div>
                        <select
                            value={data.schema_type || (pageType === 'branch' ? 'Dentist' : 'MedicalBusiness')}
                            onChange={(e) => onChange({ ...data, schema_type: e.target.value })}
                            className="px-3 py-2 border border-gray-200 rounded-xl font-bold bg-white text-xs cursor-pointer focus:border-[#800038] focus:outline-none"
                        >
                            {schemaTypes.map(st => (
                                <option key={st.value} value={st.value}>{st.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Auto Generated vs Custom Schema Toggle */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-800 flex items-center gap-1.5">
                                <Code2 size={14} className="text-[#800038]" />
                                <span>JSON-LD Schema Markup</span>
                            </span>
                            <button
                                type="button"
                                onClick={() => setShowSchemaRaw(!showSchemaRaw)}
                                className="text-[11px] text-[#800038] font-bold hover:underline cursor-pointer"
                            >
                                {showSchemaRaw ? 'Use Auto-Generated Schema' : 'Edit Custom JSON-LD'}
                            </button>
                        </div>

                        {showSchemaRaw ? (
                            <div>
                                <textarea
                                    rows={8}
                                    value={data.schema_json || JSON.stringify(generatedSchema, null, 2)}
                                    onChange={(e) => onChange({ ...data, schema_json: e.target.value })}
                                    className="w-full p-3 font-mono text-[11px] bg-slate-900 text-emerald-400 rounded-xl border border-slate-800 focus:outline-none"
                                />
                            </div>
                        ) : (
                            <pre className="p-3.5 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto max-h-60 border border-slate-800">
                                {JSON.stringify(generatedSchema, null, 2)}
                            </pre>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 3: FAQ BUILDER */}
            {activeTab === 'faq' && (
                <div className="p-5 space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <div>
                            <h4 className="font-bold text-gray-900">FAQ Builder</h4>
                        </div>
                        <button
                            type="button"
                            onClick={addFaq}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#800038] hover:bg-[#68002d] text-white rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
                        >
                            <Plus size={13} /> Add Question
                        </button>
                    </div>

                    {(!data.faqs || data.faqs.length === 0) ? (
                        <div className="py-8 text-center bg-gray-50/70 rounded-2xl border border-dashed border-gray-200">
                            <HelpCircle size={28} className="mx-auto text-gray-300 mb-1" />
                            <p className="font-bold text-gray-600">No FAQ questions added yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {data.faqs.map((faq, idx) => (
                                <div key={idx} className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-200/80 space-y-2 relative group">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-gray-700 text-[11px] flex items-center gap-1">
                                            <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-700 text-[10px] flex items-center justify-center font-bold">
                                                {idx + 1}
                                            </span>
                                            <span>FAQ Question #{idx + 1}</span>
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeFaq(idx)}
                                            className="text-gray-400 hover:text-rose-600 p-1 rounded transition cursor-pointer"
                                            title="Delete FAQ"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>

                                    <input
                                        type="text"
                                        value={faq.q}
                                        onChange={(e) => updateFaq(idx, 'q', e.target.value)}
                                        placeholder="e.g. How long does a dental implant procedure take?"
                                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white font-semibold focus:border-[#800038] focus:outline-none"
                                    />

                                    <textarea
                                        rows={2}
                                        value={faq.a}
                                        onChange={(e) => updateFaq(idx, 'a', e.target.value)}
                                        placeholder="Detailed medical answer for patients..."
                                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:border-[#800038] focus:outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB 4: GOOGLE SERP PREVIEW */}
            {activeTab === 'preview' && (
                <div className="p-5 space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <div>
                            <h4 className="font-bold text-gray-900">Google Search Result Preview</h4>
                            <p className="text-[11px] text-gray-500">How your page snippet appears to users on Google search.</p>
                        </div>

                        <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg">
                            <button
                                type="button"
                                onClick={() => setPreviewMode('desktop')}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 cursor-pointer transition ${
                                    previewMode === 'desktop' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500'
                                }`}
                            >
                                <Monitor size={12} /> Desktop
                            </button>
                            <button
                                type="button"
                                onClick={() => setPreviewMode('mobile')}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 cursor-pointer transition ${
                                    previewMode === 'mobile' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500'
                                }`}
                            >
                                <Smartphone size={12} /> Mobile
                            </button>
                        </div>
                    </div>

                    {/* Google Result Card */}
                    <div className={`p-4 bg-white rounded-2xl border border-gray-200 shadow-sm ${
                        previewMode === 'mobile' ? 'max-w-md mx-auto' : 'max-w-2xl'
                    }`}>
                        {/* URL Line */}
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-5 h-5 rounded-full bg-[#800038] text-white flex items-center justify-center text-[10px] font-bold">
                                TD
                            </div>
                            <div className="leading-tight">
                                <div className="text-[12px] text-gray-800 font-medium">Tech Dental Care</div>
                                <div className="text-[11px] text-gray-500 font-mono truncate max-w-sm">
                                    {computedUrl}
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h4 className="text-[17px] text-[#1a0dab] hover:underline font-medium cursor-pointer leading-snug">
                            {data.seo_title || 'Tech Dental Care — Leading Dental Specialist Clinic'}
                        </h4>

                        {/* Description */}
                        <p className="text-[13px] text-[#4d5156] mt-1 leading-normal">
                            {data.meta_desc || 'Comprehensive dental solutions with advanced rotary root canal, implants, laser smile dentistry, and transparent pricing in Dhaka, Bangladesh.'}
                        </p>

                        {/* FAQs Rich Snippet preview if FAQs exist */}
                        {data.faqs && data.faqs.filter(f => f.q.trim()).length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                    Rich Snippets (FAQPage Accordions):
                                </span>
                                {data.faqs.filter(f => f.q.trim()).slice(0, 2).map((faq, idx) => (
                                    <div key={idx} className="text-[12px] text-gray-700 bg-gray-50 p-2 rounded-lg flex items-center justify-between">
                                        <span className="font-semibold text-gray-800">{faq.q}</span>
                                        <ChevronDown size={14} className="text-gray-400" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
