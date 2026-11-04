import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    LayoutGrid,
    Image as ImageIcon,
    MapPin,
    Users,
    Sparkles,
    Search,
    Save,
    Plus,
    Trash2,
    Edit3,
    ExternalLink,
    HelpCircle,
    CheckCircle2,
    Eye,
    ArrowUp,
    ArrowDown,
    Sliders,
    Layers,
    Phone,
    Clock,
    DollarSign,
    Check,
    X,
    MoveVertical,
    FileText,
    Navigation,
    MessageSquare,
    Calendar
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';
import MediaImagePicker from '@/components/ImagePicker/MediaImagePicker';
import RichContentEditor from '@/Components/RichContentEditor';
import SeoMetaBox from '@/Components/SeoMetaBox';

interface SectionConfigItem {
    key: string;
    title: string;
    subtitle?: string;
    enabled: boolean;
    order: number;
}

interface HomeContentData {
    id?: number;
    header_logo?: string;
    brand_name_line1?: string;
    brand_name_line2?: string;
    seo_title?: string;
    meta_desc?: string;
    canonical_url?: string;
    robots_index?: boolean;
    robots_follow?: boolean;
    schema_type?: string;
    schema_json?: string;
    about_text?: string;
    about_image?: string;
    about_caption?: string;
    faqs?: { q: string; a: string }[];
    sections_config?: SectionConfigItem[];
}

interface GalleryItem {
    id: number;
    title?: string;
    src: string;
    badge?: string;
    alt?: string;
    view_count?: number | string;
    real_views?: number;
    is_active?: boolean;
    sort_order?: number;
}

interface BranchItem {
    id: number;
    name: string;
    short_name?: string;
    address: string;
    phone: string;
    whatsapp?: string;
    time?: string;
    hours_text?: string;
    map_url?: string;
    booking_url?: string;
    call_label?: string;
    directions_label?: string;
    whatsapp_label?: string;
    book_label?: string;
    appointment_btn_label?: string;
    more_about_title?: string;
    sort_order?: number;
    seo_title?: string;
    seo_content?: string;
}

interface DoctorItem {
    id: number;
    name: string;
    designation?: string;
    deg?: string;
    branch?: string;
    visiting_time?: string;
    img?: string;
    rank_order?: number;
}

interface ServiceItem {
    id: number;
    title: string;
    category?: string;
    price?: string;
    desc?: string;
    popular?: boolean;
    sort_order?: number;
}

interface Props extends PageProps {
    content: HomeContentData;
    gallery: GalleryItem[];
    branches: BranchItem[];
    doctors: DoctorItem[];
    services: ServiceItem[];
    posts?: any[];
}

export default function HomeContentAdminIndex({
    content,
    gallery = [],
    branches = [],
    doctors = [],
    services = [],
    posts = []
}: Props) {
    const [activeTab, setActiveTab] = useState<'gallery' | 'branches' | 'services' | 'doctors' | 'about_seo' | 'sections'>('gallery');
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const showNotification = (msg: string) => {
        setStatusMessage(msg);
        setTimeout(() => setStatusMessage(null), 3500);
    };

    // -------------------------------------------------------------
    // TAB 1: SECTIONS LAYOUT & RANKING STATE
    // -------------------------------------------------------------
    const initialSections: SectionConfigItem[] = (content?.sections_config && content.sections_config.length > 0)
        ? content.sections_config
        : [
            { key: 'gallery', title: 'Hero Slider & Showcase Gallery', subtitle: 'Top media banner showcasing operatory, equipment & branch highlights', enabled: true, order: 1 },
            { key: 'quick_actions', title: 'Quick Action Buttons', subtitle: 'Direct Call, Directions, WhatsApp & Book Now bar', enabled: true, order: 2 },
            { key: 'opening_hours', title: 'Opening Hours & Schedule', subtitle: 'Real-time open/close schedule status accordion for branches', enabled: true, order: 3 },
            { key: 'branches', title: 'Our Branches', subtitle: 'Mirpur, Uttara, Badda & Jatrabari branch tabs & contact details', enabled: true, order: 4 },
            { key: 'doctors', title: 'Specialist Doctors', subtitle: 'Specialist Oral Surgeons and Dental Specialists cards', enabled: true, order: 5 },
            { key: 'services', title: 'Services & Pricing', subtitle: 'Dental treatments list with transparent consultation & treatment pricing', enabled: true, order: 6 },
            { key: 'reviews', title: 'Patient Reviews & Rating', subtitle: '4.9 Google rating & patient feedback strip', enabled: true, order: 7 },
            { key: 'appointment_cta', title: 'Make Appointment CTA Button', subtitle: 'Direct prominent booking CTA banner', enabled: true, order: 8 },
            { key: 'guides', title: 'Dental Care Guides', subtitle: 'Articles and educational guides for patients', enabled: true, order: 9 },
            { key: 'about_seo', title: 'More About Tech Dental & FAQs', subtitle: 'Clinic overview text and frequently asked questions', enabled: true, order: 10 },
        ];

    const [sectionsList, setSectionsList] = useState<SectionConfigItem[]>(
        [...initialSections].sort((a, b) => a.order - b.order)
    );

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= sectionsList.length) return;

        const updated = [...sectionsList];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;

        // Reassign sequential order numbers 1..N
        const normalized = updated.map((sec, idx) => ({ ...sec, order: idx + 1 }));
        setSectionsList(normalized);
    };

    const toggleSectionEnabled = (index: number) => {
        const updated = [...sectionsList];
        updated[index] = { ...updated[index], enabled: !updated[index].enabled };
        setSectionsList(updated);
    };

    const handleSaveSections = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.post(route('homepage.admin.sections.order'), { sections: sectionsList }, {
            onSuccess: () => showNotification('Homepage sections ranking & layout saved successfully!'),
        });
    };

    // -------------------------------------------------------------
    // TAB 2: GALLERY / SLIDER STATE & REORDERING
    // -------------------------------------------------------------
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(
        [...gallery].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    );
    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
    const [editingGalleryId, setEditingGalleryId] = useState<number | null>(null);
    const [galleryForm, setGalleryForm] = useState({
        title: '',
        src: '',
        badge: 'Specialist',
        alt: 'Clinic Operatory',
        view_count: '1,500',
        is_active: true,
        sort_order: 1,
    });

    const moveGalleryItem = (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= galleryItems.length) return;

        const updated = [...galleryItems];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;

        const normalized = updated.map((it, idx) => ({ ...it, sort_order: idx + 1 }));
        setGalleryItems(normalized);

        // Auto save reordered gallery
        router.post(route('homepage.admin.gallery.reorder'), {
            items: normalized.map(i => ({ id: i.id, sort_order: i.sort_order }))
        }, {
            preserveScroll: true,
            onSuccess: () => showNotification('Slider images order updated!'),
        });
    };

    const openAddGallery = () => {
        setEditingGalleryId(null);
        setGalleryForm({
            title: '',
            src: '',
            badge: 'Mirpur',
            alt: 'Clinic Life',
            view_count: '2,200',
            is_active: true,
            sort_order: galleryItems.length + 1,
        });
        setIsGalleryModalOpen(true);
    };

    const openEditGallery = (item: GalleryItem) => {
        setEditingGalleryId(item.id);
        setGalleryForm({
            title: item.title || '',
            src: item.src || '',
            badge: item.badge || 'Mirpur',
            alt: item.alt || '',
            view_count: String(item.view_count || '1,000'),
            is_active: Boolean(item.is_active),
            sort_order: item.sort_order || 1,
        });
        setIsGalleryModalOpen(true);
    };

    const handleSaveGallery = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingGalleryId) {
            router.put(route('homepage.admin.gallery.update', editingGalleryId), galleryForm, {
                onSuccess: () => {
                    setIsGalleryModalOpen(false);
                    showNotification('Slider image updated successfully!');
                },
            });
        } else {
            router.post(route('homepage.admin.gallery.create'), galleryForm, {
                onSuccess: () => {
                    setIsGalleryModalOpen(false);
                    showNotification('New slider image added successfully!');
                },
            });
        }
    };

    const handleDeleteGallery = (id: number) => {
        if (confirm('Delete this slider image permanently?')) {
            router.delete(route('homepage.admin.gallery.destroy', id), {
                onSuccess: () => showNotification('Slider image removed.'),
            });
        }
    };

    // -------------------------------------------------------------
    // TAB 3: BRANCHES & 4 QUICK BUTTONS
    // -------------------------------------------------------------
    const [branchList, setBranchList] = useState<BranchItem[]>(
        [...branches].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    );
    const [editingBranch, setEditingBranch] = useState<BranchItem | null>(null);
    const [branchForm, setBranchForm] = useState<Partial<BranchItem>>({});

    const moveBranchItem = (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= branchList.length) return;

        const updated = [...branchList];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;

        const normalized = updated.map((b, idx) => ({ ...b, sort_order: idx + 1 }));
        setBranchList(normalized);

        router.post(route('homepage.admin.branches.reorder'), {
            items: normalized.map(b => ({ id: b.id, sort_order: b.sort_order }))
        }, {
            preserveScroll: true,
            onSuccess: () => showNotification('Branch ranking order updated!'),
        });
    };

    const openEditBranchModal = (b: BranchItem) => {
        setEditingBranch(b);
        setBranchForm({
            name: b.name,
            address: b.address,
            phone: b.phone,
            whatsapp: b.whatsapp || '01400786162',
            time: b.time || '10 AM – 9 PM',
            map_url: b.map_url || '',
            booking_url: b.booking_url || '/appointment',
            call_label: b.call_label || 'Call',
            directions_label: b.directions_label || 'Directions',
            whatsapp_label: b.whatsapp_label || 'WhatsApp',
            book_label: b.book_label || 'Book',
            appointment_btn_label: b.appointment_btn_label || 'Book Now',
            more_about_title: b.more_about_title || '',
            sort_order: b.sort_order || 1,
            seo_title: b.seo_title || '',
            seo_content: b.seo_content || '',
        });
    };

    const handleSaveBranch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBranch) return;
        router.put(route('homepage.admin.branches.update', editingBranch.id), branchForm, {
            onSuccess: () => {
                setEditingBranch(null);
                showNotification('Branch & quick button details updated successfully!');
            },
        });
    };

    // -------------------------------------------------------------
    // TAB 4: SPECIALIST DOCTORS REORDERING & EDIT
    // -------------------------------------------------------------
    const [doctorList, setDoctorList] = useState<DoctorItem[]>(
        [...doctors].sort((a, b) => (a.rank_order ?? 0) - (b.rank_order ?? 0))
    );
    const [editingDoctor, setEditingDoctor] = useState<DoctorItem | null>(null);
    const [doctorForm, setDoctorForm] = useState<Partial<DoctorItem>>({});

    const moveDoctorItem = (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= doctorList.length) return;

        const updated = [...doctorList];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;

        const normalized = updated.map((d, idx) => ({ ...d, rank_order: idx + 1 }));
        setDoctorList(normalized);

        router.post(route('homepage.admin.doctors.reorder'), {
            items: normalized.map(d => ({ id: d.id, rank_order: d.rank_order }))
        }, {
            preserveScroll: true,
            onSuccess: () => showNotification('Specialist doctor rank updated!'),
        });
    };

    const openEditDoctorModal = (d: DoctorItem) => {
        setEditingDoctor(d);
        setDoctorForm({
            name: d.name,
            designation: d.designation || '',
            deg: d.deg || '',
            branch: d.branch || 'Mirpur',
            visiting_time: d.visiting_time || '4.00 PM – 9.00 PM',
            img: d.img || '',
            rank_order: d.rank_order || 1,
        });
    };

    const handleSaveDoctor = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingDoctor) return;
        router.put(route('homepage.admin.doctors.update', editingDoctor.id), doctorForm, {
            onSuccess: () => {
                setEditingDoctor(null);
                showNotification('Doctor profile updated successfully!');
            },
        });
    };

    // -------------------------------------------------------------
    // TAB 5: SERVICES & PRICING REORDERING & EDIT
    // -------------------------------------------------------------
    const [serviceList, setServiceList] = useState<ServiceItem[]>(
        [...services].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    );
    const [editingService, setEditingService] = useState<ServiceItem | null>(null);
    const [serviceForm, setServiceForm] = useState<Partial<ServiceItem>>({});

    const moveServiceItem = (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= serviceList.length) return;

        const updated = [...serviceList];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;

        const normalized = updated.map((s, idx) => ({ ...s, sort_order: idx + 1 }));
        setServiceList(normalized);

        router.post(route('homepage.admin.services.reorder'), {
            items: normalized.map(s => ({ id: s.id, sort_order: s.sort_order }))
        }, {
            preserveScroll: true,
            onSuccess: () => showNotification('Service treatments ranking updated!'),
        });
    };

    const openEditServiceModal = (s: ServiceItem) => {
        setEditingService(s);
        setServiceForm({
            title: s.title,
            category: s.category || '',
            price: s.price || '0',
            desc: s.desc || '',
            popular: Boolean(s.popular),
            sort_order: s.sort_order || 1,
        });
    };

    const handleSaveService = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;
        router.put(route('homepage.admin.services.update', editingService.id), serviceForm, {
            onSuccess: () => {
                setEditingService(null);
                showNotification('Service details updated successfully!');
            },
        });
    };

    // -------------------------------------------------------------
    // TAB 6: ABOUT, SEO & FAQS STATE
    // -------------------------------------------------------------
    const [seoForm, setSeoForm] = useState({
        seo_title: content?.seo_title || 'Tech Dental Care | Premier Dental Clinic in Dhaka',
        meta_desc: content?.meta_desc || 'Tech Dental Care is a premier multi-branch dental network in Dhaka specializing in painless computerized root canals, fiber reinforced bridges, and clear aligners.',
        canonical_url: content?.canonical_url || '',
        robots_index: content?.robots_index !== undefined ? Boolean(content.robots_index) : true,
        robots_follow: content?.robots_follow !== undefined ? Boolean(content.robots_follow) : true,
        schema_type: content?.schema_type || 'Dentist',
        schema_json: content?.schema_json || '',
        about_text: content?.about_text || 'Tech Dental Care is a premier multi-branch dental network in Dhaka specializing in painless computerized root canals, fiber reinforced bridges, and clear aligners.',
        about_image: content?.about_image || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800',
        about_caption: content?.about_caption || 'Our Advanced Micro-Operatory with European Class-B Sterilization',
        faqs: content?.faqs || [
            { q: 'Which branches are open on Fridays?', a: 'All Tech Dental branches are closed on Fridays except for pre-scheduled emergency surgical consultations.' },
            { q: 'How do I book an appointment?', a: 'You can book online in 30 seconds via our website or call our central hotline at 01400786162.' },
            { q: 'What payment methods do you accept?', a: 'We accept Cash, bKash, Nagad, Visa, Mastercard, and major credit cards with EMI facility.' },
        ],
    });

    const handleSaveSeo = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(route('homepage.admin.content'), seoForm, {
            onSuccess: () => showNotification('Homepage SEO, About text & FAQs saved successfully!'),
        });
    };

    const addFaq = () => {
        setSeoForm({ ...seoForm, faqs: [...seoForm.faqs, { q: '', a: '' }] });
    };

    const updateFaq = (idx: number, field: 'q' | 'a', val: string) => {
        const updated = [...seoForm.faqs];
        updated[idx] = { ...updated[idx], [field]: val };
        setSeoForm({ ...seoForm, faqs: updated });
    };

    const removeFaq = (idx: number) => {
        setSeoForm({ ...seoForm, faqs: seoForm.faqs.filter((_, i) => i !== idx) });
    };

    return (
        <AdminLayout>
            <Head title="Homepage CMS - Full Management" />

            {/* Notification alert banner */}
            {statusMessage && (
                <div className="fixed top-5 right-5 z-50 bg-emerald-800 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-fade-in border border-emerald-700">
                    <CheckCircle2 size={16} className="text-emerald-300" />
                    <span>{statusMessage}</span>
                </div>
            )}

            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#800038] to-[#aa1254] text-white flex items-center justify-center font-bold shadow-md shadow-rose-900/20">
                        <LayoutGrid size={22} />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-gray-900">Homepage</h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <a
                        href="/"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-2xs"
                    >
                        <ExternalLink size={14} />
                        View Live Website
                    </a>
                </div>
            </div>

            {/* Navigation Tabs (Organized by Homepage Sections from Top to Bottom) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-2xs mb-6 flex flex-wrap gap-1.5 sm:gap-2">
                <button
                    onClick={() => setActiveTab('gallery')}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        activeTab === 'gallery' ? 'bg-[#800038] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <ImageIcon size={15} /> 1. Hero Slider &amp; Gallery ({galleryItems.length})
                </button>

                <button
                    onClick={() => setActiveTab('branches')}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        activeTab === 'branches' ? 'bg-[#800038] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <MapPin size={15} /> 2. Branches &amp; 4 Action Buttons ({branchList.length})
                </button>

                <button
                    onClick={() => setActiveTab('services')}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        activeTab === 'services' ? 'bg-[#800038] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Sparkles size={15} /> 3. Services &amp; Treatments ({serviceList.length})
                </button>

                <button
                    onClick={() => setActiveTab('doctors')}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        activeTab === 'doctors' ? 'bg-[#800038] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Users size={15} /> 4. Specialist Doctors ({doctorList.length})
                </button>

                <button
                    onClick={() => setActiveTab('about_seo')}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        activeTab === 'about_seo' ? 'bg-[#800038] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Search size={15} /> 5. More About (SEO Content &amp; FAQs)
                </button>

                <button
                    onClick={() => setActiveTab('sections')}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        activeTab === 'sections' ? 'bg-[#800038] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Sliders size={15} /> 6. Section Order &amp; Visibility ({sectionsList.length})
                </button>
            </div>

            {/* ============================================================= */}
            {/* TAB 1: SECTION LAYOUT & REORDERING (PAGE BUILDER)             */}
            {/* ============================================================= */}
            {activeTab === 'sections' && (
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                            <h2 className="text-sm font-bold text-gray-900">Homepage Section Order &amp; Visibility</h2>
                            <p className="text-xs text-gray-500">Reorder sections up/down, toggle show/hide, and rename section titles on the live homepage.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleSaveSections()}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                            <Save size={15} /> Save Sections Arrangement
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs divide-y divide-gray-100 overflow-hidden">
                        {sectionsList.map((section, idx) => (
                            <div
                                key={section.key}
                                className={`p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:bg-gray-50/70 ${
                                    !section.enabled ? 'bg-gray-50/50 opacity-60' : ''
                                }`}
                            >
                                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center justify-center shrink-0 border border-slate-200 shadow-2xs">
                                        #{idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={section.title}
                                                onChange={(e) => {
                                                    const updated = [...sectionsList];
                                                    updated[idx] = { ...updated[idx], title: e.target.value };
                                                    setSectionsList(updated);
                                                }}
                                                className="font-bold text-xs text-gray-900 px-2 py-1 border border-gray-200 rounded-lg hover:border-gray-300 focus:border-[#800038] w-full max-w-sm"
                                            />
                                            <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded shrink-0">
                                                {section.key}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 mt-0.5 truncate">{section.subtitle}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                    {/* Visibility switch */}
                                    <button
                                        type="button"
                                        onClick={() => toggleSectionEnabled(idx)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                            section.enabled
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                : 'bg-gray-100 text-gray-500 border border-gray-200'
                                        }`}
                                    >
                                        {section.enabled ? <Check size={13} /> : <X size={13} />}
                                        <span>{section.enabled ? 'Visible' : 'Hidden'}</span>
                                    </button>

                                    {/* Up / Down Reordering Buttons */}
                                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                                        <button
                                            type="button"
                                            disabled={idx === 0}
                                            onClick={() => moveSection(idx, 'up')}
                                            className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                            title="Move Section Up"
                                        >
                                            <ArrowUp size={14} />
                                        </button>
                                        <div className="w-[1px] h-5 bg-gray-200"></div>
                                        <button
                                            type="button"
                                            disabled={idx === sectionsList.length - 1}
                                            onClick={() => moveSection(idx, 'down')}
                                            className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                            title="Move Section Down"
                                        >
                                            <ArrowDown size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ============================================================= */}
            {/* TAB 2: HERO SLIDER & GALLERY                                  */}
            {/* ============================================================= */}
            {activeTab === 'gallery' && (
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="text-xs text-gray-500 font-medium">
                            Hero banner slider at the top of homepage. Click Up/Down arrows to rank images, or add and edit photos.
                        </div>
                        <button
                            type="button"
                            onClick={openAddGallery}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                            <Plus size={15} /> Add Slider Image
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {galleryItems.map((item, idx) => (
                            <div key={item.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs group hover:border-rose-300 transition flex flex-col justify-between">
                                <div>
                                    <div className="relative aspect-video bg-gray-100 overflow-hidden">
                                        <img src={item.src} alt={item.alt || item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                        
                                        {/* Rank Badge */}
                                        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-black bg-black/75 text-white backdrop-blur-xs shadow-md">
                                            Rank #{idx + 1}
                                        </span>

                                        {item.badge && (
                                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#800038] text-white shadow-md">
                                                {item.badge}
                                            </span>
                                        )}

                                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 flex-wrap justify-end">
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/75 text-white backdrop-blur-xs flex items-center gap-1 shadow-xs" title="Frontend Public Display View">
                                                <Eye size={11} className="text-amber-300" /> {Number(item.view_count || 0).toLocaleString()} (Frontend)
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/85 text-emerald-300 border border-emerald-500/30 backdrop-blur-xs flex items-center gap-1 shadow-xs" title="Actual Real Visitor Views">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {Number(item.real_views || 0).toLocaleString()} (Real)
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-1">
                                        <h3 className="font-bold text-gray-900 text-sm">{item.title || 'Clinic Operatory'}</h3>
                                        <p className="text-xs text-gray-400 truncate">{item.alt || 'Tech Dental Care'}</p>
                                    </div>
                                </div>

                                <div className="p-3 border-t border-gray-100 flex items-center justify-between text-xs bg-gray-50/50">
                                    {/* Reorder Up / Down */}
                                    <div className="flex items-center gap-1 border border-gray-200 rounded-lg bg-white px-1 py-0.5">
                                        <button
                                            type="button"
                                            disabled={idx === 0}
                                            onClick={() => moveGalleryItem(idx, 'up')}
                                            className="p-1 text-gray-600 hover:text-black disabled:opacity-20 cursor-pointer"
                                            title="Move Up"
                                        >
                                            <ArrowUp size={13} />
                                        </button>
                                        <span className="text-[11px] font-bold text-gray-400">#{idx + 1}</span>
                                        <button
                                            type="button"
                                            disabled={idx === galleryItems.length - 1}
                                            onClick={() => moveGalleryItem(idx, 'down')}
                                            className="p-1 text-gray-600 hover:text-black disabled:opacity-20 cursor-pointer"
                                            title="Move Down"
                                        >
                                            <ArrowDown size={13} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => openEditGallery(item)}
                                            className="p-1.5 text-rose-600 hover:text-rose-800 cursor-pointer"
                                            title="Edit Image"
                                        >
                                            <Edit3 size={15} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteGallery(item.id)}
                                            className="p-1.5 text-red-500 hover:text-red-700 cursor-pointer"
                                            title="Delete Image"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ============================================================= */}
            {/* TAB 3: BRANCHES & 4 ACTION BUTTONS                            */}
            {/* ============================================================= */}
            {activeTab === 'branches' && (
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex justify-between items-center">
                        <div className="text-xs text-gray-500 font-medium">
                            Manage branch tabs sequence (Mirpur, Uttara, Badda, Jatrabari), operating hours, hotline, and the 4 Quick Action buttons (Call, Directions, WhatsApp, Book).
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {branchList.map((branch, idx) => (
                            <div key={branch.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs flex flex-col justify-between space-y-4">
                                <div>
                                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-[#800038] text-white">
                                                Rank #{idx + 1}
                                            </span>
                                            <h3 className="font-extrabold text-gray-900 text-sm">{branch.name}</h3>
                                        </div>

                                        <div className="flex items-center gap-1 border border-gray-200 rounded-lg bg-white px-1 py-0.5">
                                            <button
                                                type="button"
                                                disabled={idx === 0}
                                                onClick={() => moveBranchItem(idx, 'up')}
                                                className="p-1 text-gray-600 hover:text-black disabled:opacity-20 cursor-pointer"
                                                title="Move Branch Up"
                                            >
                                                <ArrowUp size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                disabled={idx === branchList.length - 1}
                                                onClick={() => moveBranchItem(idx, 'down')}
                                                className="p-1 text-gray-600 hover:text-black disabled:opacity-20 cursor-pointer"
                                                title="Move Branch Down"
                                            >
                                                <ArrowDown size={13} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mt-3 text-xs text-gray-600">
                                        <div className="flex items-start gap-2">
                                            <MapPin size={14} className="text-[#800038] shrink-0 mt-0.5" />
                                            <span>{branch.address}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-emerald-700 shrink-0" />
                                            <span className="font-bold text-gray-900">{branch.time || branch.hours_text || '10 AM – 9 PM'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} className="text-blue-600 shrink-0" />
                                            <span>Hotline: {branch.phone} | WhatsApp: {branch.whatsapp || branch.phone}</span>
                                        </div>
                                    </div>

                                    {/* 4 Quick Action Buttons Preview */}
                                    <div className="mt-4 pt-3 border-t border-gray-100">
                                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                            Quick Action Buttons (Configured)
                                        </div>
                                        <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold">
                                            <div className="bg-slate-50 border border-slate-200 py-1 rounded-md text-slate-700">
                                                {branch.call_label || 'Call'}
                                            </div>
                                            <div className="bg-slate-50 border border-slate-200 py-1 rounded-md text-slate-700">
                                                {branch.directions_label || 'Directions'}
                                            </div>
                                            <div className="bg-slate-50 border border-slate-200 py-1 rounded-md text-slate-700">
                                                {branch.whatsapp_label || 'WhatsApp'}
                                            </div>
                                            <div className="bg-slate-50 border border-slate-200 py-1 rounded-md text-slate-700">
                                                {branch.book_label || 'Book'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => openEditBranchModal(branch)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#800038] hover:bg-[#68002d] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                                    >
                                        <Edit3 size={13} /> Edit Branch &amp; Buttons
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ============================================================= */}
            {/* TAB 4: SPECIALIST DOCTORS REORDERING & EDIT                   */}
            {/* ============================================================= */}
            {activeTab === 'doctors' && (
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex justify-between items-center">
                        <div className="text-xs text-gray-500 font-medium">
                            Rank oral surgeons and dental specialists on the homepage carousel. Move up/down to change order, or edit bio &amp; visiting hours.
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {doctorList.map((doc, idx) => (
                            <div key={doc.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex flex-col justify-between space-y-3">
                                <div>
                                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                                        <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-[#800038] text-white">
                                            Rank #{idx + 1}
                                        </span>

                                        <div className="flex items-center gap-1 border border-gray-200 rounded-lg bg-white px-1 py-0.5">
                                            <button
                                                type="button"
                                                disabled={idx === 0}
                                                onClick={() => moveDoctorItem(idx, 'up')}
                                                className="p-1 text-gray-600 hover:text-black disabled:opacity-20 cursor-pointer"
                                                title="Move Up"
                                            >
                                                <ArrowUp size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                disabled={idx === doctorList.length - 1}
                                                onClick={() => moveDoctorItem(idx, 'down')}
                                                className="p-1 text-gray-600 hover:text-black disabled:opacity-20 cursor-pointer"
                                                title="Move Down"
                                            >
                                                <ArrowDown size={13} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-3">
                                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                            {doc.img ? (
                                                <img src={doc.img} alt={doc.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-bold text-gray-400 text-sm">
                                                    {doc.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-bold text-gray-900 text-xs truncate">{doc.name}</h4>
                                            <p className="text-[11px] text-[#800038] font-semibold truncate">{doc.designation || 'Consultant'}</p>
                                            <p className="text-[10px] text-gray-400 truncate">{doc.branch || 'Mirpur Branch'}</p>
                                        </div>
                                    </div>

                                    <div className="mt-2 text-[11px] text-gray-500 flex items-center gap-1">
                                        <Clock size={12} className="text-gray-400" />
                                        <span>{doc.visiting_time || '4.00 PM – 9.00 PM'}</span>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-gray-100 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => openEditDoctorModal(doc)}
                                        className="inline-flex items-center gap-1 text-xs font-bold text-[#800038] hover:underline cursor-pointer"
                                    >
                                        <Edit3 size={12} /> Edit Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ============================================================= */}
            {/* TAB 5: SERVICES & PRICING REORDERING & EDIT                   */}
            {/* ============================================================= */}
            {activeTab === 'services' && (
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex justify-between items-center">
                        <div className="text-xs text-gray-500 font-medium">
                            Rank dental services &amp; treatments appearing on the homepage. Change order, pricing (BDT), descriptions, and popular badges.
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {serviceList.map((srv, idx) => (
                            <div key={srv.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex flex-col justify-between space-y-3">
                                <div>
                                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                                        <div className="flex items-center gap-1.5">
                                            <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-[#800038] text-white">
                                                Rank #{idx + 1}
                                            </span>
                                            {srv.popular && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                                    Popular
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1 border border-gray-200 rounded-lg bg-white px-1 py-0.5">
                                            <button
                                                type="button"
                                                disabled={idx === 0}
                                                onClick={() => moveServiceItem(idx, 'up')}
                                                className="p-1 text-gray-600 hover:text-black disabled:opacity-20 cursor-pointer"
                                                title="Move Up"
                                            >
                                                <ArrowUp size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                disabled={idx === serviceList.length - 1}
                                                onClick={() => moveServiceItem(idx, 'down')}
                                                className="p-1 text-gray-600 hover:text-black disabled:opacity-20 cursor-pointer"
                                                title="Move Down"
                                            >
                                                <ArrowDown size={13} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-2.5">
                                        <h4 className="font-bold text-gray-900 text-xs">{srv.title}</h4>
                                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{srv.category || 'Treatment'}</span>
                                        <div className="mt-1 text-xs font-black text-[#800038]">
                                            ৳{srv.price || '0'}
                                        </div>
                                        <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{srv.desc || 'Specialist dental procedure with modern computerized tech.'}</p>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-gray-100 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => openEditServiceModal(srv)}
                                        className="inline-flex items-center gap-1 text-xs font-bold text-[#800038] hover:underline cursor-pointer"
                                    >
                                        <Edit3 size={12} /> Edit Service
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ============================================================= */}
            {/* TAB 6: ABOUT, SEO & FAQS                                      */}
            {/* ============================================================= */}
            {activeTab === 'about_seo' && (
                <form onSubmit={handleSaveSeo} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-6 max-w-4xl">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div>
                            <h2 className="text-base font-bold text-gray-900">Homepage SEO &amp; More About Tech Dental Drawer</h2>
                            <p className="text-xs text-gray-500">Edit Meta Tags, Canonical URL, Robots Directives, Schema JSON-LD and More About section</p>
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
                        >
                            <Save size={16} /> Save Changes
                        </button>
                    </div>

                    {/* Integrated SEO Engine Component */}
                    <SeoMetaBox
                        data={{
                            seo_title: seoForm.seo_title,
                            meta_desc: seoForm.meta_desc,
                            canonical_url: seoForm.canonical_url,
                            robots_index: seoForm.robots_index,
                            robots_follow: seoForm.robots_follow,
                            schema_type: seoForm.schema_type,
                            schema_json: seoForm.schema_json,
                            faqs: seoForm.faqs,
                        }}
                        onChange={(updated) => {
                            setSeoForm({
                                ...seoForm,
                                seo_title: updated.seo_title,
                                meta_desc: updated.meta_desc,
                                canonical_url: updated.canonical_url,
                                robots_index: updated.robots_index,
                                robots_follow: updated.robots_follow,
                                schema_type: updated.schema_type,
                                schema_json: updated.schema_json,
                                faqs: updated.faqs || seoForm.faqs,
                            });
                        }}
                        pageType="home"
                        previewUrl="https://techdentalbd.com"
                    />

                    {/* Drawer Content */}
                    <div className="p-5 bg-gray-50/70 border border-gray-200/80 rounded-2xl space-y-4">
                        <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-200/70 pb-2">
                            More About Tech Dental Drawer (Rich Text Content)
                        </h3>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                More About Drawer Button Title / Heading
                            </label>
                            <input
                                type="text"
                                value={seoForm.seo_title || ''}
                                onChange={(e) => setSeoForm({ ...seoForm, seo_title: e.target.value })}
                                placeholder="More about Tech Dental"
                                className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl font-bold bg-white"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">
                                This sets the title of the expandable accordion button at the bottom of the homepage (e.g. "More about Tech Dental").
                            </p>
                        </div>

                        <div>
                            <RichContentEditor
                                label="WRITE MORE ABOUT TECH DENTAL CONTENT (HOMEPAGE DRAWER)"
                                value={seoForm.about_text}
                                onChange={(val) => setSeoForm({ ...seoForm, about_text: val })}
                                placeholder="Write comprehensive paragraphs, headings, lists and highlights for More About Tech Dental..."
                                minHeight="260px"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2 cursor-pointer"
                        >
                            <Save size={16} /> Save All SEO &amp; Drawer Content
                        </button>
                    </div>
                </form>
            )}

            {/* ============================================================= */}
            {/* MODAL: GALLERY ADD / EDIT                                     */}
            {/* ============================================================= */}
            {isGalleryModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-gray-200 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
                            <h3 className="font-bold text-gray-900 text-sm">
                                {editingGalleryId ? 'Edit Slider Image' : 'Add New Slider Image'}
                            </h3>
                            <button onClick={() => setIsGalleryModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer">
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSaveGallery} className="p-6 space-y-4 text-xs">
                            <MediaImagePicker
                                label="Gallery Image *"
                                value={galleryForm.src}
                                onChange={(val) => setGalleryForm({ ...galleryForm, src: val })}
                                aspectRatio="16:9"
                                helperText="Recommended 16:9 for homepage slider showcase"
                            />

                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={galleryForm.title}
                                    onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                                    placeholder="e.g. Modern Operatory"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Badge Tag</label>
                                    <input
                                        type="text"
                                        value={galleryForm.badge}
                                        onChange={(e) => setGalleryForm({ ...galleryForm, badge: e.target.value })}
                                        placeholder="Mirpur, Uttara, etc."
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">
                                        Frontend View Count
                                    </label>
                                    <input
                                        type="text"
                                        value={galleryForm.view_count}
                                        onChange={(e) => setGalleryForm({ ...galleryForm, view_count: e.target.value })}
                                        placeholder="1,240"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Real View Count Info */}
                            {editingGalleryId && (
                                <div className="bg-emerald-50 border border-emerald-200/90 rounded-xl p-3 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                                            <Eye size={15} />
                                        </div>
                                        <div>
                                            <span className="font-bold text-gray-800 block">Real Visitor Views</span>
                                        </div>
                                    </div>
                                    <span className="font-mono font-black text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                                        {(galleryItems.find(it => it.id === editingGalleryId)?.real_views || 0).toLocaleString()} views
                                    </span>
                                </div>
                            )}

                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsGalleryModalOpen(false)}
                                    className="px-4 py-2 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition flex items-center gap-2 cursor-pointer"
                                >
                                    <Save size={15} /> Save Image
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ============================================================= */}
            {/* MODAL: BRANCH EDIT & 4 BUTTONS                                */}
            {/* ============================================================= */}
            {editingBranch && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
                            <h3 className="font-bold text-gray-900 text-sm">
                                Edit Branch &amp; 4 Action Buttons: {editingBranch.name}
                            </h3>
                            <button onClick={() => setEditingBranch(null)} className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer">
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSaveBranch} className="p-6 space-y-4 text-xs overflow-y-auto">
                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Branch Name</label>
                                <input
                                    type="text"
                                    value={branchForm.name || ''}
                                    onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Address</label>
                                <textarea
                                    rows={2}
                                    value={branchForm.address || ''}
                                    onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Operating Hours</label>
                                <input
                                    type="text"
                                    placeholder="10 AM – 9 PM or 3 PM – 9 PM"
                                    value={branchForm.time || ''}
                                    onChange={(e) => setBranchForm({ ...branchForm, time: e.target.value, hours_text: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                                />
                            </div>

                            {/* 4 Quick Action Buttons Full Configuration */}
                            <div className="pt-3 border-t border-gray-100 space-y-3">
                                <div>
                                    <h4 className="font-extrabold text-gray-900 text-xs">
                                        4 Quick Action Buttons Configuration (Labels, Numbers &amp; Links)
                                    </h4>
                                    <p className="text-[11px] text-gray-500">
                                        Edit the label text and target action (Call number, Directions map link, WhatsApp number, Booking URL) for this branch.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {/* Button 1: Call */}
                                    <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 space-y-2">
                                        <div className="flex items-center gap-1.5 font-bold text-blue-900 text-xs">
                                            <Phone size={14} className="text-blue-600" />
                                            <span>Button 1: Call Button</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Button Label</label>
                                                <input
                                                    type="text"
                                                    value={branchForm.call_label || 'Call'}
                                                    onChange={(e) => setBranchForm({ ...branchForm, call_label: e.target.value })}
                                                    placeholder="Call"
                                                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg font-bold bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Phone Number to Call</label>
                                                <input
                                                    type="text"
                                                    value={branchForm.phone || ''}
                                                    onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })}
                                                    placeholder="09638000505 or 01400786162"
                                                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg bg-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Button 2: Directions */}
                                    <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
                                        <div className="flex items-center gap-1.5 font-bold text-indigo-900 text-xs">
                                            <Navigation size={14} className="text-indigo-600" />
                                            <span>Button 2: Directions Button</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Button Label</label>
                                                <input
                                                    type="text"
                                                    value={branchForm.directions_label || 'Directions'}
                                                    onChange={(e) => setBranchForm({ ...branchForm, directions_label: e.target.value })}
                                                    placeholder="Directions"
                                                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg font-bold bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Google Maps Direction URL</label>
                                                <input
                                                    type="text"
                                                    value={branchForm.map_url || ''}
                                                    onChange={(e) => setBranchForm({ ...branchForm, map_url: e.target.value })}
                                                    placeholder="https://maps.google.com/?q=..."
                                                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg bg-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Button 3: WhatsApp */}
                                    <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-2">
                                        <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs">
                                            <MessageSquare size={14} className="text-emerald-600" />
                                            <span>Button 3: WhatsApp Button</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Button Label</label>
                                                <input
                                                    type="text"
                                                    value={branchForm.whatsapp_label || 'WhatsApp'}
                                                    onChange={(e) => setBranchForm({ ...branchForm, whatsapp_label: e.target.value })}
                                                    placeholder="WhatsApp"
                                                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg font-bold bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-gray-600 mb-1">WhatsApp Number or Link</label>
                                                <input
                                                    type="text"
                                                    value={branchForm.whatsapp || ''}
                                                    onChange={(e) => setBranchForm({ ...branchForm, whatsapp: e.target.value })}
                                                    placeholder="01400786162 or https://wa.me/..."
                                                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg bg-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Button 4: Book */}
                                    <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-100 space-y-2">
                                        <div className="flex items-center gap-1.5 font-bold text-rose-900 text-xs">
                                            <Calendar size={14} className="text-[#800038]" />
                                            <span>Button 4: Book Now Button</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Button Label</label>
                                                <input
                                                    type="text"
                                                    value={branchForm.book_label || 'Book'}
                                                    onChange={(e) => setBranchForm({ ...branchForm, book_label: e.target.value })}
                                                    placeholder="Book"
                                                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg font-bold bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Booking URL / Page Link</label>
                                                <input
                                                    type="text"
                                                    value={branchForm.booking_url || '/appointment'}
                                                    onChange={(e) => setBranchForm({ ...branchForm, booking_url: e.target.value })}
                                                    placeholder="/appointment"
                                                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg bg-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Branch Page Button & More About Settings */}
                            <div className="pt-3 border-t border-gray-100 space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">
                                            Branch Page CTA Button Label
                                        </label>
                                        <input
                                            type="text"
                                            value={branchForm.appointment_btn_label ?? 'Book Now'}
                                            onChange={(e) => setBranchForm({ ...branchForm, appointment_btn_label: e.target.value })}
                                            placeholder="Book Now"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold bg-white text-xs"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-0.5">Shown on the main appointment button on the branch page (Default: Book Now)</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">
                                            More About Drawer Heading / Title
                                        </label>
                                        <input
                                            type="text"
                                            value={branchForm.more_about_title ?? ''}
                                            onChange={(e) => setBranchForm({ ...branchForm, more_about_title: e.target.value })}
                                            placeholder={`More About ${(branchForm.name || '').replace(/\s*branch\s*$/i, '').trim()}`}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold bg-white text-xs"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-0.5">Custom heading for the expandable info drawer (e.g., More About Uttara)</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-extrabold text-gray-900 text-xs">
                                        More About {branchForm.name || 'Branch'} Content (Accordion Drawer on Branch Page)
                                    </h4>
                                    <p className="text-[11px] text-gray-500">
                                        Write detailed paragraphs, headings, bullet lists, and clinic highlights displayed in the More About drawer.
                                    </p>
                                </div>
                                <RichContentEditor
                                    label={`WRITE MORE ABOUT CONTENT (${branchForm.name?.toUpperCase() || 'BRANCH'})`}
                                    value={branchForm.seo_content || ''}
                                    onChange={(val) => setBranchForm({ ...branchForm, seo_content: val })}
                                    placeholder={`Write detailed description, treatments, equipment, and highlights for ${branchForm.name}...`}
                                    minHeight="220px"
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingBranch(null)}
                                    className="px-4 py-2 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition flex items-center gap-2 cursor-pointer"
                                >
                                    <Save size={15} /> Save Branch
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ============================================================= */}
            {/* MODAL: DOCTOR EDIT                                            */}
            {/* ============================================================= */}
            {editingDoctor && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-gray-200 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
                            <h3 className="font-bold text-gray-900 text-sm">
                                Edit Doctor: {editingDoctor.name}
                            </h3>
                            <button onClick={() => setEditingDoctor(null)} className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer">
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSaveDoctor} className="p-6 space-y-4 text-xs">
                            <MediaImagePicker
                                label="Doctor Photo"
                                value={doctorForm.img || ''}
                                onChange={(val) => setDoctorForm({ ...doctorForm, img: val })}
                                aspectRatio="1:1"
                                helperText="Square portrait photo recommended"
                            />

                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={doctorForm.name || ''}
                                    onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Designation / Specialty</label>
                                <input
                                    type="text"
                                    value={doctorForm.designation || ''}
                                    onChange={(e) => setDoctorForm({ ...doctorForm, designation: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Branch</label>
                                    <input
                                        type="text"
                                        value={doctorForm.branch || ''}
                                        onChange={(e) => setDoctorForm({ ...doctorForm, branch: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Visiting Hours</label>
                                    <input
                                        type="text"
                                        value={doctorForm.visiting_time || ''}
                                        onChange={(e) => setDoctorForm({ ...doctorForm, visiting_time: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingDoctor(null)}
                                    className="px-4 py-2 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition flex items-center gap-2 cursor-pointer"
                                >
                                    <Save size={15} /> Save Doctor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ============================================================= */}
            {/* MODAL: SERVICE EDIT                                           */}
            {/* ============================================================= */}
            {editingService && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-gray-200 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
                            <h3 className="font-bold text-gray-900 text-sm">
                                Edit Service Treatment
                            </h3>
                            <button onClick={() => setEditingService(null)} className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer">
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSaveService} className="p-6 space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Service Title</label>
                                <input
                                    type="text"
                                    value={serviceForm.title || ''}
                                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Category</label>
                                    <input
                                        type="text"
                                        value={serviceForm.category || ''}
                                        onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Price (BDT)</label>
                                    <input
                                        type="text"
                                        value={serviceForm.price || ''}
                                        onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold text-[#800038]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={serviceForm.desc || ''}
                                    onChange={(e) => setServiceForm({ ...serviceForm, desc: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    id="popular_chk"
                                    checked={Boolean(serviceForm.popular)}
                                    onChange={(e) => setServiceForm({ ...serviceForm, popular: e.target.checked })}
                                    className="rounded border-gray-300 text-[#800038] focus:ring-[#800038]"
                                />
                                <label htmlFor="popular_chk" className="font-bold text-gray-700 cursor-pointer">
                                    Mark as "Popular" Service badge on Homepage
                                </label>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingService(null)}
                                    className="px-4 py-2 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition flex items-center gap-2 cursor-pointer"
                                >
                                    <Save size={15} /> Save Service
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
