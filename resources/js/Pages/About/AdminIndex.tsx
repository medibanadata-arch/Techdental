import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Info,
    Sparkles,
    BookOpen,
    Cpu,
    Target,
    CheckCircle,
    Save,
    ExternalLink,
    Image as ImageIcon,
    Plus,
    Trash2,
    Search
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';
import MediaImagePicker from '@/components/ImagePicker/MediaImagePicker';
import SeoMetaBox from '@/Components/SeoMetaBox';

interface AboutContentData {
    id?: number;
    hero_title?: string;
    hero_subtitle?: string;
    hero_bg?: string;
    headline?: string;
    founded_year?: string;
    patients_count?: string;
    story_p1?: string;
    story_p2?: string;
    video_thumb?: string;
    video_url?: string;
    services_cards?: { img: string; title: string; desc: string }[];
    tech_headline?: string;
    tech_subtext?: string;
    tech_cards?: { img: string; title: string; tag: string; desc: string }[];
    vision_title?: string;
    vision_text?: string;
    mission_title?: string;
    mission_text?: string;
    team_banner?: string;
    why_cards?: { img: string; title: string; desc: string }[];
    seo_title?: string;
    meta_desc?: string;
    canonical_url?: string;
    robots_index?: boolean;
    robots_follow?: boolean;
    schema_type?: string;
    schema_json?: string;
    faqs?: any[];
}

interface Props extends PageProps {
    content: AboutContentData;
}

export default function AboutAdminIndex({ content }: Props) {
    const [activeTab, setActiveTab] = useState<'hero' | 'story' | 'tech' | 'vision' | 'why' | 'seo'>('hero');

    const [form, setForm] = useState({
        hero_title: content?.hero_title || 'About Tech Dental Care',
        hero_subtitle: content?.hero_subtitle || 'Pioneering painless digital dentistry across Dhaka, Bangladesh since 2018.',
        hero_bg: content?.hero_bg || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&auto=format&fit=crop&q=80',
        headline: content?.headline || 'Redefining Modern Dentistry Through Compassion & Precision',
        founded_year: content?.founded_year || '2018',
        patients_count: content?.patients_count || '25,000+',
        story_p1: content?.story_p1 || 'Founded in 2018, Tech Dental Care started with a bold mission: to make high-tech, painless oral healthcare accessible to every family in Bangladesh.',
        story_p2: content?.story_p2 || 'Today, our network operates 4 fully equipped clinics in Mirpur, Uttara, Badda, and Jatrabari with European standard sterilization.',
        video_thumb: content?.video_thumb || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80',
        video_url: content?.video_url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        tech_headline: content?.tech_headline || 'Cutting-Edge Dental Equipment & 3D Diagnostics',
        tech_subtext: content?.tech_subtext || 'We invest continuously in top-tier European medical technology for pinpoint diagnostic accuracy.',
        tech_cards: Array.isArray(content?.tech_cards) ? content.tech_cards : [
            { img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400', title: 'Intraoral 3D Camera', tag: 'HD Imaging', desc: 'Real-time high-definition tooth scans with instant patient viewing.' },
            { img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400', title: 'Class-B Autoclave Sterilizer', tag: '100% Sterile', desc: 'Medical-grade pressurized steam sterilization guaranteeing zero contamination.' },
            { img: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400', title: 'Rotary Painless Endodontics', tag: 'Micro-Motors', desc: 'Swiss-designed rotary motors for single-visit root canal treatments.' },
        ],
        vision_title: content?.vision_title || 'Our Vision',
        vision_text: content?.vision_text || 'To be Bangladesh\'s most trusted, technologically advanced dental care clinic network.',
        mission_title: content?.mission_title || 'Our Mission',
        mission_text: content?.mission_text || 'Deliver painless, transparent, and international-standard dental treatments with warm patient care.',
        team_banner: content?.team_banner || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&auto=format&fit=crop&q=80',
        why_cards: Array.isArray(content?.why_cards) ? content.why_cards : [
            { img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400', title: 'BMDC Registered Dentists', desc: 'Every treatment is performed solely by certified dental surgeons.' },
            { img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400', title: 'Transparent BDT Pricing', desc: 'Fixed rates with no hidden fees or surprise medicine markups.' },
            { img: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400', title: 'Warranty On Restorations', desc: 'Written quality guarantee on composite fiber bridges and crowns.' },
        ],
        seo_title: content?.seo_title || 'About Tech Dental Care — Leading Dental Specialist Clinic in Dhaka',
        meta_desc: content?.meta_desc || 'Learn about Tech Dental Care, our certified BMDC dental surgeons, Swiss rotary equipment, and sterile clinics across Mirpur, Uttara, Badda & Jatrabari.',
        canonical_url: content?.canonical_url || '',
        robots_index: content?.robots_index !== undefined ? Boolean(content.robots_index) : true,
        robots_follow: content?.robots_follow !== undefined ? Boolean(content.robots_follow) : true,
        schema_type: content?.schema_type || 'MedicalClinic',
        schema_json: content?.schema_json || '',
        faqs: Array.isArray(content?.faqs) ? content.faqs : [],
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(route('about.admin.update'), form, {
            onSuccess: () => alert('About page CMS saved and published successfully!'),
        });
    };

    const addTechCard = () => {
        setForm({
            ...form,
            tech_cards: [
                ...form.tech_cards,
                { img: '', title: 'New Equipment', tag: 'Advanced Tech', desc: 'Description of this medical technology.' }
            ]
        });
    };

    const removeTechCard = (idx: number) => {
        setForm({
            ...form,
            tech_cards: form.tech_cards.filter((_, i) => i !== idx)
        });
    };

    const updateTechCard = (idx: number, field: string, val: string) => {
        const updated = [...form.tech_cards];
        updated[idx] = { ...updated[idx], [field]: val };
        setForm({ ...form, tech_cards: updated });
    };

    return (
        <AdminLayout>
            <Head title="About Page CMS - Tech Dental" />

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-800 to-red-600 text-white flex items-center justify-center font-bold shadow-md shadow-rose-900/20">
                        <Info size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-gray-900">About Us</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href="/about"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-2xs"
                    >
                        <ExternalLink size={14} />
                        View Live About Page
                    </a>
                    <button
                        onClick={handleSave}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition"
                    >
                        <Save size={16} />
                        Save &amp; Publish
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-2xs mb-6 flex flex-wrap gap-2">
                <button
                    onClick={() => setActiveTab('hero')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                        activeTab === 'hero' ? 'bg-[#800038] text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Sparkles size={16} />
                    Hero &amp; Banner
                </button>
                <button
                    onClick={() => setActiveTab('story')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                        activeTab === 'story' ? 'bg-[#800038] text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <BookOpen size={16} />
                    Clinic Story &amp; Stats
                </button>
                <button
                    onClick={() => setActiveTab('tech')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                        activeTab === 'tech' ? 'bg-[#800038] text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Cpu size={16} />
                    Advanced Technology
                </button>
                <button
                    onClick={() => setActiveTab('vision')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                        activeTab === 'vision' ? 'bg-[#800038] text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Target size={16} />
                    Vision &amp; Mission
                </button>
                <button
                    onClick={() => setActiveTab('why')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                        activeTab === 'why' ? 'bg-[#800038] text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <CheckCircle size={16} />
                    Why Choose Tech Dental
                </button>
                <button
                    onClick={() => setActiveTab('seo')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                        activeTab === 'seo' ? 'bg-[#800038] text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Search size={16} />
                    SEO &amp; Structured Data
                </button>
            </div>

            {/* TAB CONTENTS */}
            <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-6">
                {/* 1. HERO TAB */}
                {activeTab === 'hero' && (
                    <div className="space-y-6 max-w-3xl">
                        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Hero Banner Configuration</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Hero Main Title</label>
                                <input
                                    type="text"
                                    value={form.hero_title}
                                    onChange={(e) => setForm({ ...form, hero_title: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Hero Subtitle</label>
                                <textarea
                                    rows={2}
                                    value={form.hero_subtitle}
                                    onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl"
                                />
                            </div>
                            <MediaImagePicker
                                label="Hero Background Image"
                                value={form.hero_bg}
                                onChange={(val) => setForm({ ...form, hero_bg: val })}
                                aspectRatio="16:9"
                                helperText="Recommended 16:9 high resolution panoramic banner"
                            />
                        </div>
                    </div>
                )}

                {/* 2. STORY TAB */}
                {activeTab === 'story' && (
                    <div className="space-y-6 max-w-3xl">
                        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Clinic History &amp; Milestone Stats</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Founded Year</label>
                                <input
                                    type="text"
                                    value={form.founded_year}
                                    onChange={(e) => setForm({ ...form, founded_year: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Happy Patients Count</label>
                                <input
                                    type="text"
                                    value={form.patients_count}
                                    onChange={(e) => setForm({ ...form, patients_count: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Main Story Headline</label>
                            <input
                                type="text"
                                value={form.headline}
                                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                                className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Story Paragraph 1</label>
                            <textarea
                                rows={3}
                                value={form.story_p1}
                                onChange={(e) => setForm({ ...form, story_p1: e.target.value })}
                                className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Story Paragraph 2</label>
                            <textarea
                                rows={3}
                                value={form.story_p2}
                                onChange={(e) => setForm({ ...form, story_p2: e.target.value })}
                                className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl"
                            />
                        </div>

                        <div className="space-y-4">
                            <MediaImagePicker
                                label="Clinic Tour Video Thumbnail"
                                value={form.video_thumb}
                                onChange={(val) => setForm({ ...form, video_thumb: val })}
                                aspectRatio="16:9"
                                helperText="Recommended 16:9 preview cover for clinic video tour"
                            />
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Video / Tour URL</label>
                                <input
                                    type="text"
                                    value={form.video_url}
                                    onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. TECHNOLOGY TAB */}
                {activeTab === 'tech' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div>
                                <h2 className="text-base font-bold text-gray-900">Advanced Technology Showcase</h2>
                                <p className="text-xs text-gray-500">Add or edit dental diagnostic &amp; treatment equipment</p>
                            </div>
                            <button
                                type="button"
                                onClick={addTechCard}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition"
                            >
                                <Plus size={14} /> Add Technology Card
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Section Headline</label>
                                <input
                                    type="text"
                                    value={form.tech_headline}
                                    onChange={(e) => setForm({ ...form, tech_headline: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Section Subtext</label>
                                <input
                                    type="text"
                                    value={form.tech_subtext}
                                    onChange={(e) => setForm({ ...form, tech_subtext: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {form.tech_cards.map((card, idx) => (
                                <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 relative group">
                                    <button
                                        type="button"
                                        onClick={() => removeTechCard(idx)}
                                        className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white transition"
                                        title="Remove card"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    <div className="font-bold text-xs text-gray-700">Technology Item #{idx + 1}</div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={card.title}
                                            onChange={(e) => updateTechCard(idx, 'title', e.target.value)}
                                            className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Tag</label>
                                        <input
                                            type="text"
                                            value={card.tag}
                                            onChange={(e) => updateTechCard(idx, 'tag', e.target.value)}
                                            className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                                        />
                                    </div>
                                    <MediaImagePicker
                                        label="Equipment Photo"
                                        value={card.img}
                                        onChange={(val) => updateTechCard(idx, 'img', val)}
                                        aspectRatio="4:3"
                                        helperText="Recommended 4:3 tech apparatus photo"
                                    />
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Description</label>
                                        <textarea
                                            rows={2}
                                            value={card.desc}
                                            onChange={(e) => updateTechCard(idx, 'desc', e.target.value)}
                                            className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. VISION & MISSION TAB */}
                {activeTab === 'vision' && (
                    <div className="space-y-6 max-w-3xl">
                        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Vision, Mission &amp; Values</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Vision Title</label>
                                <input
                                    type="text"
                                    value={form.vision_title}
                                    onChange={(e) => setForm({ ...form, vision_title: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Vision Statement</label>
                                <textarea
                                    rows={3}
                                    value={form.vision_text}
                                    onChange={(e) => setForm({ ...form, vision_text: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Mission Title</label>
                                <input
                                    type="text"
                                    value={form.mission_title}
                                    onChange={(e) => setForm({ ...form, mission_title: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Mission Statement</label>
                                <textarea
                                    rows={3}
                                    value={form.mission_text}
                                    onChange={(e) => setForm({ ...form, mission_text: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl"
                                />
                            </div>
                            <MediaImagePicker
                                label="Team Banner Image"
                                value={form.team_banner}
                                onChange={(val) => setForm({ ...form, team_banner: val })}
                                aspectRatio="16:9"
                                helperText="Recommended 16:9 clinic team panoramic group photo"
                            />
                        </div>
                    </div>
                )}

                {/* 5. WHY CHOOSE TAB */}
                {activeTab === 'why' && (
                    <div className="space-y-6">
                        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Why Patients Choose Tech Dental</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {form.why_cards.map((card, idx) => (
                                <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                                    <div className="font-bold text-xs text-gray-700">Pillar #{idx + 1}</div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={card.title}
                                            onChange={(e) => {
                                                const updated = [...form.why_cards];
                                                updated[idx] = { ...updated[idx], title: e.target.value };
                                                setForm({ ...form, why_cards: updated });
                                            }}
                                            className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Description</label>
                                        <textarea
                                            rows={2}
                                            value={card.desc}
                                            onChange={(e) => {
                                                const updated = [...form.why_cards];
                                                updated[idx] = { ...updated[idx], desc: e.target.value };
                                                setForm({ ...form, why_cards: updated });
                                            }}
                                            className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 6. SEO & STRUCTURED DATA TAB */}
                {activeTab === 'seo' && (
                    <div className="space-y-6 max-w-4xl">
                        <SeoMetaBox
                            data={{
                                seo_title: form.seo_title,
                                meta_desc: form.meta_desc,
                                canonical_url: form.canonical_url,
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
                                    robots_index: updated.robots_index,
                                    robots_follow: updated.robots_follow,
                                    schema_type: updated.schema_type,
                                    schema_json: updated.schema_json,
                                    faqs: updated.faqs || [],
                                });
                            }}
                            pageType="about"
                            previewUrl="https://techdentalbd.com/about"
                        />
                    </div>
                )}

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2"
                    >
                        <Save size={16} />
                        Save All Changes
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
