import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Sparkles,
    ArrowLeft,
    Plus,
    Trash2,
    DollarSign,
    Layers,
    Save,
    Image as ImageIcon,
    HelpCircle,
    CheckCircle,
    Eye
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';
import MediaImagePicker from '@/components/ImagePicker/MediaImagePicker';
import RichContentEditor from '@/Components/RichContentEditor';
import SeoMetaBox from '@/Components/SeoMetaBox';

interface PricingCard {
    img?: string;
    title: string;
    title_bn?: string;
    price: string;
    note?: string;
    popular?: boolean;
}

interface FeatureItem {
    title: string;
    sub: string;
}

interface FaqItem {
    q: string;
    a: string;
}

interface ServiceItem {
    id?: number;
    title?: string;
    category?: string;
    slug?: string;
    price?: string;
    price_suffix?: string;
    short_desc?: string;
    hero_main?: string;
    hero_thumbs?: string[];
    features?: FeatureItem[];
    pricing_cards?: PricingCard[];
    results?: string[];
    details_heading?: string;
    details_html?: string;
    seo_images?: string[];
    faqs?: FaqItem[];
    seo_title?: string;
    meta_desc?: string;
    canonical_url?: string;
    robots_index?: boolean;
    robots_follow?: boolean;
    schema_type?: string;
    schema_json?: string;
    rank_order?: number;
    status?: string;
}

interface Props extends PageProps {
    item: ServiceItem | null;
}

const CATEGORY_SUGGESTIONS = [
    'Dental Implants',
    'Restorative Care',
    'Dentures & Prosthetics',
    'Cosmetic Dentistry',
    'Oral Surgery',
    'Orthodontics',
    'General Dentistry',
];

export default function ServicesAdminEdit({ item }: Props) {
    const isEdit = Boolean(item && item.id);

    // Form state matching Document 1
    const [title, setTitle] = useState(item?.title || '');
    const [category, setCategory] = useState(item?.category || 'Dental Implants');
    const [price, setPrice] = useState(item?.price || '35,000');
    const [priceSuffix, setPriceSuffix] = useState(item?.price_suffix || 'Starting Price');
    const [shortDesc, setShortDesc] = useState(item?.short_desc || '');
    const [status, setStatus] = useState(item?.status || 'Published');
    const [rankOrder, setRankOrder] = useState(item?.rank_order || 1);

    // Core SEO States
    const [slug, setSlug] = useState(item?.slug || '');
    const [seoTitle, setSeoTitle] = useState(item?.seo_title || '');
    const [metaDesc, setMetaDesc] = useState(item?.meta_desc || '');
    const [canonicalUrl, setCanonicalUrl] = useState(item?.canonical_url || '');
    const [robotsIndex, setRobotsIndex] = useState(item?.robots_index !== undefined ? Boolean(item?.robots_index) : true);
    const [robotsFollow, setRobotsFollow] = useState(item?.robots_follow !== undefined ? Boolean(item?.robots_follow) : true);
    const [schemaType, setSchemaType] = useState(item?.schema_type || 'MedicalBusiness');
    const [schemaJson, setSchemaJson] = useState(item?.schema_json || '');

    // Hero Images
    const [heroMain, setHeroMain] = useState(
        item?.hero_main || (isEdit ? '' : 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1000&q=80')
    );
    const [thumb1, setThumb1] = useState(item?.hero_thumbs?.[0] || '');
    const [thumb2, setThumb2] = useState(item?.hero_thumbs?.[1] || '');
    const [thumb3, setThumb3] = useState(item?.hero_thumbs?.[2] || '');

    // Features (Section 2.5)
    const [features, setFeatures] = useState<FeatureItem[]>(
        Array.isArray(item?.features)
            ? item.features
            : (!isEdit ? [
                { title: 'Aesthetic Result', sub: 'Blends with your own teeth' },
                { title: 'Treatment Time', sub: '3-6 months in total' },
                { title: 'Durability', sub: 'Lasts decades with good care' },
                { title: 'Warranty', sub: '10 years on the implant' },
            ] : [])
    );

    // Pricing Cards (Section 3 in Document 1)
    const [pricingCards, setPricingCards] = useState<PricingCard[]>(
        Array.isArray(item?.pricing_cards)
            ? item.pricing_cards
            : (!isEdit ? [
                {
                    img: 'https://images.unsplash.com/photo-1598256989800-fea5f60eb346?auto=format&fit=crop&w=400&q=80',
                    title: 'Multiple implants',
                    price: '৳ 32,000',
                    note: 'per implant, price drops with quantity',
                    popular: true,
                },
                {
                    img: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=400&q=80',
                    title: 'Single implant',
                    price: '৳ 35,000',
                    note: 'per implant',
                    popular: false,
                },
            ] : [])
    );

    // SEO Section (Section 4 in Document 1)
    const [accordionTitle, setAccordionTitle] = useState(item?.details_heading || 'More About Dental Implant Treatments');
    const [seoTab, setSeoTab] = useState<'details' | 'gallery' | 'faqs'>('details');
    const [seoHeading, setSeoHeading] = useState('Advanced Dental Implants for a Perfect Smile');
    const [detailsHtml, setDetailsHtml] = useState(
        item?.details_html ||
        'Reclaiming your beautiful smile and optimal oral functionality has never been more achievable. Dental implants serve as a permanent, robust foundation for replacement teeth that look, feel, and function exactly like your natural teeth.\n\nBeyond aesthetics, implants prevent bone loss in the jaw, maintain facial structure, and eliminate the discomfort often associated with removable dentures.'
    );

    // SEO Gallery images
    const [seoImages, setSeoImages] = useState<string[]>(
        Array.isArray(item?.seo_images)
            ? item.seo_images
            : (!isEdit ? ['https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=400&q=80'] : [])
    );

    // FAQs
    const [faqs, setFaqs] = useState<FaqItem[]>(
        Array.isArray(item?.faqs)
            ? item.faqs
            : (!isEdit ? [
                {
                    q: 'Does the implant procedure hurt?',
                    a: 'The procedure is performed under local anesthesia, ensuring you feel no pain during the surgery.'
                }
            ] : [])
    );

    // Pricing card helpers
    const addPricingCard = () => {
        setPricingCards([
            ...pricingCards,
            {
                img: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=400&q=80',
                title: 'New Treatment Plan',
                price: '৳ 20,000',
                note: 'per treatment',
                popular: false,
            }
        ]);
    };

    const updatePricingCard = (index: number, field: keyof PricingCard, val: any) => {
        const updated = [...pricingCards];
        updated[index] = { ...updated[index], [field]: val };
        setPricingCards(updated);
    };

    const removePricingCard = (index: number) => {
        setPricingCards(pricingCards.filter((_, i) => i !== index));
    };

    // SEO Gallery helpers
    const addSeoImageSlot = () => {
        const url = prompt('Enter image URL for SEO gallery:', 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=400&q=80');
        if (url) {
            setSeoImages([...seoImages, url]);
        }
    };

    const removeSeoImage = (index: number) => {
        setSeoImages(seoImages.filter((_, i) => i !== index));
    };

    // Feature helpers
    const addFeature = () => {
        setFeatures([...features, { title: 'New Feature', sub: 'Brief description' }]);
    };

    const updateFeature = (index: number, field: 'title' | 'sub', val: string) => {
        const updated = [...features];
        updated[index] = { ...updated[index], [field]: val };
        setFeatures(updated);
    };

    const removeFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    // FAQ helpers
    const addFaq = () => {
        setFaqs([...faqs, { q: 'New question?', a: 'Detailed answer...' }]);
    };

    const updateFaq = (index: number, field: 'q' | 'a', val: string) => {
        const updated = [...faqs];
        updated[index] = { ...updated[index], [field]: val };
        setFaqs(updated);
    };

    const removeFaq = (index: number) => {
        setFaqs(faqs.filter((_, i) => i !== index));
    };

    // Submit handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Format clean price with currency
        const cleanPrice = price.startsWith('৳') ? price : `৳ ${price.trim()}`;

        const payload = {
            title,
            category,
            slug: slug || undefined,
            price: cleanPrice,
            price_suffix: priceSuffix,
            short_desc: shortDesc,
            hero_main: heroMain,
            hero_thumbs: [thumb1, thumb2, thumb3].filter(Boolean),
            features: features.filter(f => f.title),
            pricing_cards: pricingCards,
            details_heading: accordionTitle,
            details_html: detailsHtml,
            seo_images: seoImages,
            faqs: faqs.filter(f => f.q && f.a),
            seo_title: seoTitle,
            meta_desc: metaDesc,
            canonical_url: canonicalUrl,
            robots_index: robotsIndex,
            robots_follow: robotsFollow,
            schema_type: schemaType,
            schema_json: schemaJson,
            rank_order: Number(rankOrder) || 1,
            status,
        };

        if (isEdit && item?.id) {
            router.put(route('services.admin.update', item.id), payload);
        } else {
            router.post(route('services.admin.store'), payload);
        }
    };

    return (
        <AdminLayout>
            <Head title={isEdit ? `Edit Service: ${title}` : "Create New Service"} />

            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6 pb-12 font-sans">
                
                {/* Top Action Bar matching Document 1 */}
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('services.admin')}
                            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                {isEdit ? `Edit Service (A to Z)` : `Create New Service`}
                            </h2>
                            <p className="text-xs text-gray-500">Configure public service page, pricing cards &amp; SEO content</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={route('services.admin')}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 text-xs font-semibold hover:bg-gray-50 transition"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-[#8f163b] hover:bg-[#73102f] text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2 cursor-pointer"
                        >
                            <Save size={15} />
                            <span>Publish Updates</span>
                        </button>
                    </div>
                </div>

                {/* Section 1: Basic Info matching Document 1 */}
                <div className="bg-white rounded-2xl shadow-2xs border border-gray-200 p-6 space-y-5">
                    <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center justify-between">
                        <span>1. Basic Information</span>
                        <span className="text-xs font-normal text-gray-400">Core service details</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Service Title
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Dental Implants – The Permanent Solution for Missing Teeth"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#8f163b] focus:border-[#8f163b] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Service Category
                            </label>
                            <input
                                type="text"
                                list="category-suggestions"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Select or type a category..."
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#8f163b] focus:border-[#8f163b] outline-none"
                            />
                            <datalist id="category-suggestions">
                                {CATEGORY_SUGGESTIONS.map(c => (
                                    <option key={c} value={c} />
                                ))}
                            </datalist>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Starting Price (৳)
                            </label>
                            <input
                                type="text"
                                required
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="e.g. 35,000"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#8f163b] focus:border-[#8f163b] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Price Unit / Suffix
                            </label>
                            <input
                                type="text"
                                value={priceSuffix}
                                onChange={(e) => setPriceSuffix(e.target.value)}
                                placeholder="e.g. Starting Price / per tooth"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#8f163b] focus:border-[#8f163b] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Status &amp; Visibility
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#8f163b] focus:border-[#8f163b] outline-none"
                            >
                                <option value="Published">Published (Publicly Visible)</option>
                                <option value="Draft">Draft (Hidden)</option>
                            </select>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Short Description
                            </label>
                            <textarea
                                rows={3}
                                value={shortDesc}
                                onChange={(e) => setShortDesc(e.target.value)}
                                placeholder="A concise summary of this treatment..."
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#8f163b] focus:border-[#8f163b] outline-none leading-relaxed"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Hero Images matching Document 1 */}
                <div className="bg-white rounded-2xl shadow-2xs border border-gray-200 p-6 space-y-5">
                    <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center justify-between">
                        <span>2. Hero Images (Cover &amp; Gallery)</span>
                        <span className="text-xs font-normal text-gray-400">High-resolution dental photos (Crop &amp; Library enabled)</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Main Cover Image */}
                        <div className="col-span-1 md:col-span-3">
                            <MediaImagePicker
                                label="Main Cover Image (16:9)"
                                aspectHint="16:9 Landscape"
                                value={heroMain}
                                onChange={setHeroMain}
                                aspectRatio="16:9"
                                previewHeightClass="h-64 md:h-80"
                            />
                        </div>

                        {/* Thumbnail 1 */}
                        <div>
                            <MediaImagePicker
                                label="Thumbnail 1"
                                aspectHint="3:2 Photo"
                                value={thumb1}
                                onChange={setThumb1}
                                aspectRatio="3:2"
                                previewHeightClass="h-32"
                            />
                        </div>

                        {/* Thumbnail 2 */}
                        <div>
                            <MediaImagePicker
                                label="Thumbnail 2"
                                aspectHint="3:2 Photo"
                                value={thumb2}
                                onChange={setThumb2}
                                aspectRatio="3:2"
                                previewHeightClass="h-32"
                            />
                        </div>

                        {/* Thumbnail 3 */}
                        <div>
                            <MediaImagePicker
                                label="Thumbnail 3"
                                aspectHint="3:2 Photo"
                                value={thumb3}
                                onChange={setThumb3}
                                aspectRatio="3:2"
                                previewHeightClass="h-32"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2.5: Features Grid */}
                <div className="bg-white rounded-2xl shadow-2xs border border-gray-200 p-6 space-y-5">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <div>
                            <h3 className="text-base font-bold text-gray-900">
                                2.5 Highlights / Features Grid
                            </h3>
                            <p className="text-xs text-gray-500">Key service highlights shown beside treatment overview (e.g. Aesthetic Result, Durability)</p>
                        </div>
                        <button
                            type="button"
                            onClick={addFeature}
                            className="text-xs font-bold text-[#8f163b] hover:text-[#73102f] flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                        >
                            <Plus size={14} /> Add Feature
                        </button>
                    </div>

                    <div className="space-y-3">
                        {features.length === 0 ? (
                            <div className="text-center py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <p className="text-xs text-gray-500 font-medium mb-2">No features added. (Features block will be hidden on public page)</p>
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition"
                                >
                                    <Plus size={14} /> Add Feature
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {features.map((f, idx) => (
                                    <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-xl relative flex flex-col gap-2">
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(idx)}
                                            className="absolute top-2.5 right-2.5 text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition cursor-pointer"
                                            title="Delete feature"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Feature Title</label>
                                            <input
                                                type="text"
                                                value={f.title}
                                                onChange={(e) => updateFeature(idx, 'title', e.target.value)}
                                                placeholder="e.g. Aesthetic Result"
                                                className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-300 outline-none focus:ring-1 focus:ring-[#8f163b]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Subtext</label>
                                            <input
                                                type="text"
                                                value={f.sub}
                                                onChange={(e) => updateFeature(idx, 'sub', e.target.value)}
                                                placeholder="e.g. Blends with your own teeth"
                                                className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-300 outline-none focus:ring-1 focus:ring-[#8f163b]"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 3: Pricing Types (Cards) matching Document 1 */}
                <div className="bg-white rounded-2xl shadow-2xs border border-gray-200 p-6 space-y-5">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <div>
                            <h3 className="text-base font-bold text-gray-900">
                                3. Pricing Types (Cards)
                            </h3>
                            <p className="text-xs text-gray-500">Tiered packages and treatment variants. If empty, the pricing section is completely hidden on frontend.</p>
                        </div>
                        <button
                            type="button"
                            onClick={addPricingCard}
                            className="text-xs font-bold text-[#8f163b] hover:text-[#73102f] flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                        >
                            <Plus size={14} /> Add Pricing Card
                        </button>
                    </div>

                    <div className="space-y-4">
                        {pricingCards.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <p className="text-xs text-gray-500 font-medium mb-3">No pricing cards added. (Pricing section is completely hidden on public page)</p>
                                <button
                                    type="button"
                                    onClick={addPricingCard}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8f163b] hover:bg-[#73102f] text-white rounded-xl text-xs font-semibold transition"
                                >
                                    <Plus size={14} /> Add Pricing Card
                                </button>
                            </div>
                        ) : (
                            pricingCards.map((card, idx) => (
                                <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-xl relative group">
                                    <button
                                        type="button"
                                        onClick={() => removePricingCard(idx)}
                                        className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition cursor-pointer border border-red-200"
                                        title="Delete card"
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                        <div className="col-span-1 md:col-span-4">
                                            <MediaImagePicker
                                                label="Card Image"
                                                aspectHint="4:3 Card"
                                                value={card.img || ''}
                                                onChange={(url) => updatePricingCard(idx, 'img', url)}
                                                aspectRatio="4:3"
                                                previewHeightClass="h-28"
                                            />
                                        </div>

                                        <div className="col-span-1 md:col-span-8 grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 mb-1">Title</label>
                                                <input
                                                    type="text"
                                                    value={card.title}
                                                    onChange={(e) => updatePricingCard(idx, 'title', e.target.value)}
                                                    placeholder="e.g. Multiple implants"
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-1 focus:ring-[#8f163b]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 mb-1">Price</label>
                                                <input
                                                    type="text"
                                                    value={card.price}
                                                    onChange={(e) => updatePricingCard(idx, 'price', e.target.value)}
                                                    placeholder="e.g. ৳ 32,000"
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-1 focus:ring-[#8f163b]"
                                                />
                                            </div>

                                            <div className="col-span-2">
                                                <label className="block text-xs font-semibold text-gray-500 mb-1">Subtext / Note</label>
                                                <input
                                                    type="text"
                                                    value={card.note || ''}
                                                    onChange={(e) => updatePricingCard(idx, 'note', e.target.value)}
                                                    placeholder="e.g. per implant, price drops with quantity"
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-1 focus:ring-[#8f163b]"
                                                />
                                            </div>

                                            <div className="col-span-2 flex items-center gap-2 mt-1">
                                                <input
                                                    type="checkbox"
                                                    id={`popular-${idx}`}
                                                    checked={Boolean(card.popular)}
                                                    onChange={(e) => updatePricingCard(idx, 'popular', e.target.checked)}
                                                    className="w-4 h-4 text-[#8f163b] rounded border-gray-300 cursor-pointer"
                                                />
                                                <label htmlFor={`popular-${idx}`} className="text-xs font-medium text-gray-700 cursor-pointer">
                                                    Mark as Popular (Highlights card with badge on frontend)
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Section 4: SEO, Structured Data & More About Content */}
                <div className="space-y-6">
                    <SeoMetaBox
                        data={{
                            seo_title: seoTitle || title,
                            meta_desc: metaDesc || shortDesc,
                            canonical_url: canonicalUrl,
                            slug: slug,
                            robots_index: robotsIndex,
                            robots_follow: robotsFollow,
                            schema_type: schemaType,
                            schema_json: schemaJson,
                            faqs: faqs,
                        }}
                        onChange={(updated) => {
                            setSeoTitle(updated.seo_title || '');
                            setMetaDesc(updated.meta_desc || '');
                            setCanonicalUrl(updated.canonical_url || '');
                            setSlug(updated.slug || slug);
                            setRobotsIndex(updated.robots_index !== false);
                            setRobotsFollow(updated.robots_follow !== false);
                            setSchemaType(updated.schema_type || 'MedicalBusiness');
                            setSchemaJson(updated.schema_json || '');
                            if (updated.faqs) setFaqs(updated.faqs);
                        }}
                        pageType="service"
                        defaultSlug={slug || (title ? title.toLowerCase().replace(/[^a-z0-9]/g, '-') : '')}
                        previewUrl="https://techdentalbd.com/services"
                    />

                    <div className="bg-white rounded-2xl shadow-2xs border border-gray-200 p-6 space-y-5 border-l-4 border-l-[#800038]">
                        <div className="pb-2 border-b border-gray-100">
                            <h3 className="text-base font-bold text-gray-900">
                                4. More About {title || 'Service'} Drawer (Rich Content &amp; Media)
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Manage the expandable accordion drawer that appears on the public service page.
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Accordion Main Title (Frontend Heading)
                            </label>
                            <input
                                type="text"
                                value={accordionTitle}
                                onChange={(e) => setAccordionTitle(e.target.value)}
                                placeholder={`e.g. More About ${title || 'Dental Treatments'}`}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold focus:ring-2 focus:ring-[#800038] outline-none"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">
                                Renames the bottom "More About..." accordion button on this service's page.
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                More About Service Detailed Content (WYSIWYG H1, H2, H3, Links &amp; Tables)
                            </label>
                            <RichContentEditor
                                label="WRITE MORE ABOUT SERVICE CONTENT"
                                value={detailsHtml}
                                onChange={(val) => setDetailsHtml(val)}
                                placeholder="Write rich paragraph, headings, or HTML content..."
                                minHeight="260px"
                            />
                        </div>
                    </div>
                </div>

                {/* Save Footer matching Document 1 */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="px-8 py-3 bg-[#8f163b] hover:bg-[#73102f] text-white rounded-xl font-bold shadow-lg shadow-rose-900/20 transition text-sm flex items-center gap-2 cursor-pointer"
                    >
                        <Save size={18} />
                        <span>Publish Updates</span>
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
