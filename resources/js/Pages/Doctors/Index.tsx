import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Stethoscope,
    Users,
    MapPin,
    ArrowUp,
    ArrowDown,
    Plus,
    Edit3,
    Trash2,
    Save,
    ExternalLink,
    Search,
    X,
    CheckCircle2,
    Award,
    Phone,
    Clock,
    FileText,
    Globe,
    Sparkles,
    Crop,
    FolderOpen,
    UploadCloud,
    Eye,
    Info,
    Check,
    Monitor,
    Smartphone
} from 'lucide-react';
import SeoMetaBox from '@/Components/SeoMetaBox';
import RichContentEditor from '@/Components/RichContentEditor';
import ImageCropperModal from '@/Components/ImagePicker/ImageCropperModal';
import MediaLibraryModal from '@/Components/ImagePicker/MediaLibraryModal';
import { PageProps } from '@inertiajs/core';

interface Doctor {
    id: number;
    name: string;
    spec?: string;
    deg?: string;
    exp?: string;
    img?: string;
    branch?: string;
    bio?: string;
    phone?: string;
    designation?: string;
    specialty_banner?: string;
    bmdc?: string;
    visiting_time?: string;
    experience_years?: string;
    patients_treated?: string;
    branch_location?: string;
    verified?: boolean;
    rank_order?: number;
    chamber_title?: string;
    chamber_address?: string;
    hotline?: string;
    seo_title?: string;
    seo_content?: string;
    meta_desc?: string;
    canonical_url?: string;
    robots_index?: boolean;
    robots_follow?: boolean;
    schema_type?: string;
    schema_json?: string;
    faqs?: { q: string; a: string }[];
    milestones?: { count: string; label: string; color: string }[];
}

const DEFAULT_DOCTOR_MILESTONES = [
    { count: '830+', label: 'Painless Child Treatments', color: 'pink' },
    { count: '750+', label: 'Rotary Root Canals', color: 'emerald' },
    { count: '1,200+', label: 'Ultrasonic Scaling Sessions', color: 'sky' },
    { count: '460+', label: 'Pediatric Stainless Crowns', color: 'amber' },
    { count: '340+', label: 'Space Maintainers & Habits', color: 'purple' },
    { count: '620+', label: 'Aesthetic Restorations', color: 'teal' },
];

const parseDoctorMilestones = (raw: any): { count: string; label: string; color: string }[] => {
    if (!raw) return DEFAULT_DOCTOR_MILESTONES;
    if (Array.isArray(raw) && raw.length > 0) return raw;
    if (typeof raw === 'string') {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {}
    }
    return DEFAULT_DOCTOR_MILESTONES;
};

interface DoctorSettingData {
    id?: number;
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
    data: Doctor[];
    settings?: DoctorSettingData;
}

export const normalizeBranch = (val?: string) => {
    if (!val) return 'Mirpur';
    const s = val.toLowerCase();
    if (s.includes('uttara')) return 'Uttara';
    if (s.includes('badda')) return 'Badda';
    if (s.includes('jatra')) return 'Jatrabari';
    return 'Mirpur';
};

export default function DoctorsIndex({ data = [], settings }: Props) {
    const [activeTab, setActiveTab] = useState<'profiles' | 'categories' | 'ranking' | 'page_seo'>('profiles');
    const [selectedDoctorId, setSelectedDoctorId] = useState<number>(data[0]?.id || 0);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Page SEO Form State
    const [pageTitle, setPageTitle] = useState(settings?.page_title || 'Specialist Dentists & Dental Surgeons – Tech Dental');
    const [seoTitle, setSeoTitle] = useState(settings?.seo_title || 'More about Dentists');
    const [seoContent, setSeoContent] = useState(settings?.seo_content || '');
    const [metaDesc, setMetaDesc] = useState(settings?.meta_desc || '');
    const [canonicalUrl, setCanonicalUrl] = useState(settings?.canonical_url || 'https://techdentalcare.com/doctors');
    const [robotsIndex, setRobotsIndex] = useState(settings?.robots_index ?? true);
    const [robotsFollow, setRobotsFollow] = useState(settings?.robots_follow ?? true);
    const [schemaType, setSchemaType] = useState(settings?.schema_type || 'MedicalOrganization');
    const [schemaJson, setSchemaJson] = useState(settings?.schema_json || '');
    const [faqs, setFaqs] = useState<{ q: string; a: string }[]>(settings?.faqs || []);
    const [isSavingSeo, setIsSavingSeo] = useState(false);

    const handleSavePageSeo = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingSeo(true);
        router.post(route('doctors.admin.settings'), {
            page_title: pageTitle,
            seo_title: seoTitle,
            seo_content: seoContent,
            meta_desc: metaDesc,
            canonical_url: canonicalUrl,
            robots_index: robotsIndex,
            robots_follow: robotsFollow,
            schema_type: schemaType,
            schema_json: schemaJson,
            faqs: faqs,
        }, {
            preserveScroll: true,
            onFinish: () => setIsSavingSeo(false),
            onSuccess: () => alert('Doctors Page SEO & Accordion settings saved successfully!'),
        });
    };

    const selectedDoctor = useMemo(() => {
        return data.find(d => d.id === selectedDoctorId) || data[0] || null;
    }, [data, selectedDoctorId]);

    // Active doctor form state
    const [editForm, setEditForm] = useState({
        name: selectedDoctor?.name || '',
        designation: selectedDoctor?.designation || '',
        specialty_banner: selectedDoctor?.specialty_banner || '',
        deg: selectedDoctor?.deg || '',
        spec: selectedDoctor?.spec || '',
        branch: normalizeBranch(selectedDoctor?.branch || selectedDoctor?.branch_location),
        bmdc: selectedDoctor?.bmdc || '',
        visiting_time: selectedDoctor?.visiting_time || '4:00 PM – 9:00 PM (Sat–Thu)',
        phone: selectedDoctor?.phone || '01400786162',
        hotline: selectedDoctor?.hotline || '09638000505',
        img: selectedDoctor?.img || '',
        experience_years: selectedDoctor?.experience_years || '8+ Years',
        patients_treated: selectedDoctor?.patients_treated || '12,000+',
        verified: selectedDoctor?.verified ?? true,
        chamber_title: selectedDoctor?.chamber_title || 'Tech Dental Care (Mirpur Branch)',
        chamber_address: selectedDoctor?.chamber_address || '827 (2nd Floor), Shewrapara, Begum Rokeya Sharani, Mirpur, Dhaka 1216',
        milestones: parseDoctorMilestones(selectedDoctor?.milestones),
        bio: selectedDoctor?.bio || '',
        seo_title: selectedDoctor?.seo_title || (selectedDoctor?.name ? `More About ${selectedDoctor.name}` : ''),
        seo_content: selectedDoctor?.seo_content || '',
        meta_desc: selectedDoctor?.meta_desc || '',
        canonical_url: selectedDoctor?.canonical_url || '',
        robots_index: selectedDoctor?.robots_index ?? true,
        robots_follow: selectedDoctor?.robots_follow ?? true,
        schema_type: selectedDoctor?.schema_type || 'Physician',
        schema_json: selectedDoctor?.schema_json || '',
        faqs: Array.isArray(selectedDoctor?.faqs) ? selectedDoctor.faqs : [],
    });

    // Update form when doctor selection changes
    React.useEffect(() => {
        if (selectedDoctor) {
            setEditForm({
                name: selectedDoctor.name || '',
                designation: selectedDoctor.designation || '',
                specialty_banner: selectedDoctor.specialty_banner || '',
                deg: selectedDoctor.deg || '',
                spec: selectedDoctor.spec || '',
                branch: normalizeBranch(selectedDoctor.branch || selectedDoctor.branch_location),
                bmdc: selectedDoctor.bmdc || '',
                visiting_time: selectedDoctor.visiting_time || '4:00 PM – 9:00 PM (Sat–Thu)',
                phone: selectedDoctor.phone || '01400786162',
                hotline: selectedDoctor.hotline || '09638000505',
                img: selectedDoctor.img || '',
                experience_years: selectedDoctor.experience_years || '8+ Years',
                patients_treated: selectedDoctor.patients_treated || '12,000+',
                verified: selectedDoctor.verified ?? true,
                chamber_title: selectedDoctor.chamber_title || 'Tech Dental Care (Mirpur Branch)',
                chamber_address: selectedDoctor.chamber_address || '827 (2nd Floor), Shewrapara, Begum Rokeya Sharani, Mirpur, Dhaka 1216',
                milestones: parseDoctorMilestones(selectedDoctor.milestones),
                bio: selectedDoctor.bio || '',
                seo_title: selectedDoctor.seo_title || (selectedDoctor.name ? `More About ${selectedDoctor.name}` : ''),
                seo_content: selectedDoctor.seo_content || '',
                meta_desc: selectedDoctor.meta_desc || '',
                canonical_url: selectedDoctor.canonical_url || '',
                robots_index: selectedDoctor.robots_index ?? true,
                robots_follow: selectedDoctor.robots_follow ?? true,
                schema_type: selectedDoctor.schema_type || 'Physician',
                schema_json: selectedDoctor.schema_json || '',
                faqs: Array.isArray(selectedDoctor.faqs) ? selectedDoctor.faqs : [],
            });
        }
    }, [selectedDoctorId]);

    // New doctor modal form
    const [newDoctorForm, setNewDoctorForm] = useState({
        name: '',
        designation: 'Senior Dental Surgeon',
        deg: 'BDS, PGT',
        branch: 'Tech Dental (Mirpur Branch)',
        bmdc: '',
        visiting_time: '4:00 PM – 9:00 PM (Sat–Thu)',
        phone: '01400786162',
        img: '',
    });

    // Image upload, crop, preview & media library states
    const [previewMode, setPreviewMode] = useState<'single' | 'category' | 'avatar'>('single');
    const [deviceView, setDeviceView] = useState<'web' | 'mobile'>('web');
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [cropFile, setCropFile] = useState<File | null>(null);
    const [cropTarget, setCropTarget] = useState<'edit' | 'new'>('edit');

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDoctor) return;
        router.put(route('doctors.update', selectedDoctor.id), editForm, {
            onSuccess: () => alert('Doctor profile updated successfully!'),
        });
    };

    const handleCreateDoctor = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('doctors.store'), newDoctorForm, {
            onSuccess: () => {
                setIsNewModalOpen(false);
                alert('New doctor registered successfully!');
            },
        });
    };

    const handleDeleteDoctor = (id: number) => {
        if (confirm('Are you sure you want to delete this doctor?')) {
            router.delete(route('doctors.destroy', id));
        }
    };

    // Doctor list state for manual ranking
    const [doctorList, setDoctorList] = useState<Doctor[]>(() => {
        return [...data].sort((a, b) => (a.rank_order ?? 999) - (b.rank_order ?? 999));
    });
    const [hasRankChanges, setHasRankChanges] = useState(false);
    const [isSavingRank, setIsSavingRank] = useState(false);

    React.useEffect(() => {
        const sorted = [...data].sort((a, b) => (a.rank_order ?? 999) - (b.rank_order ?? 999));
        setDoctorList(sorted);
        setHasRankChanges(false);
    }, [data]);

    const handleMoveRank = (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= doctorList.length) return;

        const updated = [...doctorList];
        const [moved] = updated.splice(index, 1);
        updated.splice(targetIndex, 0, moved);

        // Re-index ranks sequentially 1..N
        const reindexed = updated.map((doc, idx) => ({
            ...doc,
            rank_order: idx + 1,
        }));

        setDoctorList(reindexed);
        setHasRankChanges(true);
    };

    const handleRankInputChange = (id: number, val: string) => {
        const num = parseInt(val, 10);
        const updated = doctorList.map(doc => {
            if (doc.id === id) {
                return { ...doc, rank_order: isNaN(num) ? 0 : num };
            }
            return doc;
        });
        setDoctorList(updated);
        setHasRankChanges(true);
    };

    const handleSaveRankChanges = () => {
        setIsSavingRank(true);
        // Sort by rank_order and re-index sequentially 1..N
        const sorted = [...doctorList].sort((a, b) => (a.rank_order ?? 0) - (b.rank_order ?? 0));
        const items = sorted.map((doc, idx) => ({
            id: doc.id,
            rank_order: idx + 1,
        }));

        router.post('/doctors/reorder', { items }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSavingRank(false);
                setHasRankChanges(false);
            },
            onError: () => {
                setIsSavingRank(false);
                alert('Failed to save ranking changes. Please try again.');
            }
        });
    };

    const filteredDoctors = useMemo(() => {
        return doctorList.filter(d =>
            !searchQuery ||
            d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.branch?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.bmdc?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [doctorList, searchQuery]);

    return (
        <AdminLayout>
            <Head title="Doctor & Specialist CMS - Tech Dental" />

            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-700 to-rose-600 text-white flex items-center justify-center font-bold shadow-md shadow-pink-900/20">
                        <Stethoscope size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-gray-900">Doctors</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href="/doctors"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-2xs"
                    >
                        <ExternalLink size={14} />
                        View Public Directory
                    </a>
                    <button
                        onClick={() => setIsNewModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#800038] hover:bg-[#990044] rounded-xl shadow-sm transition"
                    >
                        <Plus size={16} />
                        Add New Doctor
                    </button>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-2xs mb-6 flex flex-wrap gap-2">
                <button
                    onClick={() => setActiveTab('profiles')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                        activeTab === 'profiles' ? 'bg-[#800038] text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Edit3 size={16} />
                    Doctor Profile Editor
                </button>
                <button
                    onClick={() => setActiveTab('ranking')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                        activeTab === 'ranking' ? 'bg-[#800038] text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Users size={16} />
                    All Doctors &amp; Ranking ({data.length})
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                        activeTab === 'categories' ? 'bg-[#800038] text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <MapPin size={16} />
                    Branch Allocations
                </button>
                <button
                    onClick={() => setActiveTab('page_seo')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                        activeTab === 'page_seo' ? 'bg-[#800038] text-white shadow-2xs' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Globe size={16} />
                    Page SEO &amp; Accordion Content
                </button>
            </div>

            {/* TAB 1: DOCTOR PROFILE EDITOR */}
            {activeTab === 'profiles' && (
                <div className="space-y-6">
                    {/* Doctor Selector Bar */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-base font-extrabold text-gray-900">Doctor Profile Editor</h2>
                            <p className="text-xs text-gray-500">Select a doctor to edit comprehensive details, degrees, BMDC license, visiting hours, and chamber info.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={selectedDoctorId}
                                onChange={(e) => setSelectedDoctorId(Number(e.target.value))}
                                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                            >
                                {data.map((doc) => (
                                    <option key={doc.id} value={doc.id}>
                                        {doc.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleSaveProfile}
                                className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition"
                            >
                                <Save size={15} /> Save Changes
                            </button>
                        </div>
                    </div>

                    {selectedDoctor && (
                        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Column 1: Image & Stats */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                                        <Sparkles size={13} className="text-[#800038]" /> Profile Photo &amp; Stats
                                    </h3>
                                    <span className="text-[10px] font-bold text-[#800038] bg-rose-50 px-2 py-0.5 rounded border border-rose-100 uppercase tracking-wider">
                                        3:4 Portrait
                                    </span>
                                </div>

                                {/* Live Preview Switcher Tabs */}
                                <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 text-[11px] font-bold">
                                    <button
                                        type="button"
                                        onClick={() => setPreviewMode('single')}
                                        className={`flex-1 py-1.5 px-1.5 rounded-lg transition text-center cursor-pointer ${
                                            previewMode === 'single'
                                                ? 'bg-white text-gray-900 shadow-xs'
                                                : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                    >
                                        Single (3:4)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewMode('category')}
                                        className={`flex-1 py-1.5 px-1.5 rounded-lg transition text-center cursor-pointer ${
                                            previewMode === 'category'
                                                ? 'bg-white text-gray-900 shadow-xs'
                                                : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                    >
                                        Category Card
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewMode('avatar')}
                                        className={`flex-1 py-1.5 px-1.5 rounded-lg transition text-center cursor-pointer ${
                                            previewMode === 'avatar'
                                                ? 'bg-white text-gray-900 shadow-xs'
                                                : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                    >
                                        Home Avatar
                                    </button>
                                </div>

                                {/* Preview Card Display */}
                                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex flex-col items-center justify-center min-h-[260px] relative">
                                    {previewMode === 'single' && (
                                        <div className="w-full flex flex-col items-center">
                                            {/* Web vs Mobile Device Switcher */}
                                            <div className="flex items-center justify-center gap-1 mb-3 bg-gray-200/80 p-0.5 rounded-lg">
                                                <button
                                                    type="button"
                                                    onClick={() => setDeviceView('web')}
                                                    className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold flex items-center gap-1 transition cursor-pointer ${
                                                        deviceView === 'web'
                                                            ? 'bg-white text-gray-900 shadow-2xs'
                                                            : 'text-gray-500 hover:text-gray-900'
                                                    }`}
                                                >
                                                    <Monitor size={12} />
                                                    <span>Web (Desktop)</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setDeviceView('mobile')}
                                                    className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold flex items-center gap-1 transition cursor-pointer ${
                                                        deviceView === 'mobile'
                                                            ? 'bg-white text-gray-900 shadow-2xs'
                                                            : 'text-gray-500 hover:text-gray-900'
                                                    }`}
                                                >
                                                    <Smartphone size={12} />
                                                    <span>Mobile View</span>
                                                </button>
                                            </div>

                                            {deviceView === 'web' ? (
                                                /* Desktop Single Profile Card */
                                                <div className="w-full flex flex-col items-center animate-fade-in">
                                                    <div className="w-44 h-58 rounded-2xl overflow-hidden border-2 border-slate-200/90 shadow-md bg-white relative group">
                                                        <img
                                                            src={editForm.img || 'https://placehold.co/600x800/f1f5f9/64748b?text=Doctor+Photo'}
                                                            alt="Doctor Single Profile Preview"
                                                            className="w-full h-full object-cover object-[center_20%]"
                                                            onError={(e: any) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/600x800/f1f5f9/64748b?text=Doctor+Photo'; }}
                                                        />
                                                        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs text-[#059669] text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 border border-emerald-100">
                                                            <CheckCircle2 size={10} /> Verified
                                                        </div>
                                                    </div>
                                                    <p className="text-[11px] font-semibold text-gray-600 mt-2 text-center">
                                                        Single Profile (<code className="text-[#800038] font-mono">/doctors/{selectedDoctor.id}</code>)
                                                    </p>
                                                    <span className="text-[10px] text-gray-400">Desktop 3:4 portrait (w: 288px, h: 384px)</span>
                                                </div>
                                            ) : (
                                                /* Mobile Smartphone View */
                                                <div className="w-full flex flex-col items-center animate-fade-in">
                                                    <div className="w-[195px] rounded-[22px] border-[3px] border-slate-800 bg-white p-2 shadow-lg relative overflow-hidden text-center">
                                                        {/* Phone Notch */}
                                                        <div className="w-14 h-1.5 bg-slate-800 rounded-full mx-auto mb-2" />
                                                        
                                                        {/* Mini Doctor Image Card */}
                                                        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative shadow-2xs mb-1.5">
                                                            <img
                                                                src={editForm.img || 'https://placehold.co/600x800/f1f5f9/64748b?text=Doctor+Photo'}
                                                                alt="Doctor Mobile Preview"
                                                                className="w-full h-full object-cover object-top"
                                                                onError={(e: any) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/600x800/f1f5f9/64748b?text=Doctor+Photo'; }}
                                                            />
                                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white border border-slate-200 shadow-2xs px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                                                                <CheckCircle2 size={8} className="text-emerald-500" />
                                                                <span className="text-[7.5px] font-bold text-slate-700">BMDC Verified</span>
                                                            </div>
                                                        </div>

                                                        {/* Doctor Mini Details */}
                                                        <p className="text-[10.5px] font-bold text-gray-900 truncate mt-2.5 leading-tight">
                                                            {editForm.name || 'Doctor Name'}
                                                        </p>
                                                        <p className="text-[8.5px] text-gray-500 truncate mt-0.5">
                                                            {editForm.designation || 'Dental Surgeon'}
                                                        </p>
                                                        <div className="w-full py-1 bg-[#800038] text-white rounded-md text-[8.5px] font-bold mt-2">
                                                            Book Now
                                                        </div>
                                                    </div>
                                                    <p className="text-[11px] font-semibold text-gray-600 mt-2 text-center">
                                                        Mobile Single Profile Preview
                                                    </p>
                                                    <span className="text-[10px] text-gray-400">Mobile responsive 4:3 landscape</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {previewMode === 'category' && (
                                        <div className="w-full">
                                            <div className="w-full max-w-[240px] mx-auto bg-white rounded-xl p-3 shadow-sm border-2 border-[#a21caf] text-center">
                                                <div className="w-full h-44 rounded-lg overflow-hidden bg-slate-100 relative mb-2">
                                                    <img
                                                        src={editForm.img || 'https://placehold.co/600x800/f1f5f9/64748b?text=Doctor+Photo'}
                                                        alt="Doctor Category Card Preview"
                                                        className="w-full h-full object-cover object-[center_20%]"
                                                        onError={(e: any) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/600x800/f1f5f9/64748b?text=Doctor+Photo'; }}
                                                    />
                                                    <span className="absolute top-1.5 right-1.5 bg-white/90 text-pink-700 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                                                        <MapPin size={8} className="inline mr-0.5" /> {selectedDoctor.branch || 'Mirpur'}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-bold text-gray-900 truncate">{editForm.name || 'Doctor Name'}</p>
                                                <p className="text-[10px] text-gray-500 truncate">{editForm.designation || 'Dental Surgeon'}</p>
                                            </div>
                                            <p className="text-[11px] font-semibold text-gray-600 mt-2 text-center">
                                                Category Page (<code className="text-[#800038] font-mono">/doctors</code>) Card
                                            </p>
                                        </div>
                                    )}

                                    {previewMode === 'avatar' && (
                                        <div className="w-full flex flex-col items-center">
                                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-pink-200 shadow-md bg-white my-3">
                                                <img
                                                    src={editForm.img || 'https://placehold.co/600x800/f1f5f9/64748b?text=Doctor+Photo'}
                                                    alt="Doctor Avatar Preview"
                                                    className="w-full h-full object-cover object-center"
                                                    onError={(e: any) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/600x800/f1f5f9/64748b?text=Doctor+Photo'; }}
                                                />
                                            </div>
                                            <p className="text-xs font-bold text-gray-900">{editForm.name || 'Doctor Name'}</p>
                                            <p className="text-[11px] font-semibold text-gray-600 mt-1 text-center">
                                                Homepage Carousel Avatar (64×64 circle)
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions: Upload & Crop, Media Library, Crop Existing */}
                                <div className="space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <label className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#800038] hover:bg-[#990044] rounded-xl shadow-xs transition cursor-pointer text-center">
                                            <UploadCloud size={14} className="shrink-0" />
                                            <span>Upload &amp; Crop</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        setCropTarget('edit');
                                                        setCropFile(e.target.files[0]);
                                                        setIsCropperOpen(true);
                                                        e.target.value = '';
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                        </label>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCropTarget('edit');
                                                setIsLibraryOpen(true);
                                            }}
                                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition cursor-pointer shadow-2xs"
                                        >
                                            <FolderOpen size={14} className="text-[#800038] shrink-0" />
                                            <span>Media Library</span>
                                        </button>
                                    </div>

                                    {editForm.img && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCropTarget('edit');
                                                setCropFile(null);
                                                setIsCropperOpen(true);
                                            }}
                                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#800038] bg-rose-50 hover:bg-rose-100/70 border border-rose-200 rounded-xl transition cursor-pointer"
                                        >
                                            <Crop size={13} />
                                            <span>Crop / Adjust Current Image (3:4)</span>
                                        </button>
                                    )}

                                    {/* Direct URL input with clear */}
                                    <div className="relative flex items-center">
                                        <input
                                            type="text"
                                            value={editForm.img}
                                            onChange={(e) => setEditForm({ ...editForm, img: e.target.value })}
                                            placeholder="Paste Image URL or choose above"
                                            className="w-full pl-3 pr-8 py-2 text-xs border border-gray-200 rounded-xl font-mono text-[11px] text-gray-700"
                                        />
                                        {editForm.img && (
                                            <button
                                                type="button"
                                                onClick={() => setEditForm({ ...editForm, img: '' })}
                                                className="absolute right-2 p-1 text-gray-400 hover:text-red-500 rounded-lg transition cursor-pointer"
                                                title="Clear Image"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Size & Framing Recommendation Guide Box */}
                                <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-left space-y-1.5">
                                    <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                                        <Info size={13} className="text-amber-700 shrink-0" />
                                        <span>Recommended Image Specs &amp; Framing</span>
                                    </div>
                                    <div className="text-[11px] text-amber-950 space-y-1 leading-relaxed">
                                        <p>
                                            • <strong>Best Size:</strong> 600 × 800 px (Aspect Ratio <strong>3:4 Portrait</strong>) অথবা 800 × 600 px (4:3)।
                                        </p>
                                        <p>
                                            • <strong>Framing Tip:</strong> ডাক্তারের ছবি তোলার সময় বা ক্রপ করার সময় একদম ক্লোজ-আপ (শুধু মুখ) না রেখে কিছুটা দূর থেকে (মাথা, ঘাড়, দুই কাঁধ ও ডাক্তারের কোট/অ্যাপ্রন সহ) রাখুন — যেমন ড. আয়েশা সিদ্দিকার ছবিতে দেখা যায়।
                                        </p>
                                        <p className="text-[10px] text-amber-800">
                                            এতে ক্যাটাগরি কার্ড, সিঙ্গেল প্রোফাইল এবং হোমপেজের গোল অবতারে ছবি নিখুঁত ও প্রফেশনাল দেখাবে।
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">BMDC Registration No.</label>
                                    <input
                                        type="text"
                                        value={editForm.bmdc}
                                        onChange={(e) => setEditForm({ ...editForm, bmdc: e.target.value })}
                                        placeholder="BMDC Reg No: A-12345"
                                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Experience</label>
                                        <input
                                            type="text"
                                            value={editForm.experience_years}
                                            onChange={(e) => setEditForm({ ...editForm, experience_years: e.target.value })}
                                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Patients Treated</label>
                                        <input
                                            type="text"
                                            value={editForm.patients_treated}
                                            onChange={(e) => setEditForm({ ...editForm, patients_treated: e.target.value })}
                                            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Direct Chamber Hotline</label>
                                    <input
                                        type="text"
                                        value={editForm.hotline}
                                        onChange={(e) => setEditForm({ ...editForm, hotline: e.target.value })}
                                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Column 2 & 3: Clinical & Chamber Details */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Clinical Profile &amp; Chamber</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Doctor Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Designation &amp; Specialty</label>
                                        <input
                                            type="text"
                                            value={editForm.designation}
                                            onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                                            className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">
                                        Specialty Highlight Banner (Top Header Text)
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.specialty_banner}
                                        onChange={(e) => setEditForm({ ...editForm, specialty_banner: e.target.value })}
                                        placeholder="e.g. PEDIATRIC & PAINLESS DENTISTRY SPECIALIST"
                                        className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl font-bold uppercase tracking-wide text-[#800038]"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Academic Degrees (BDS, PGT, etc.)</label>
                                        <input
                                            type="text"
                                            value={editForm.deg}
                                            onChange={(e) => setEditForm({ ...editForm, deg: e.target.value })}
                                            className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Assigned Clinic Branch</label>
                                        <select
                                            value={normalizeBranch(editForm.branch)}
                                            onChange={(e) => {
                                                const b = e.target.value;
                                                setEditForm({
                                                    ...editForm,
                                                    branch: b,
                                                    branch_location: b,
                                                    chamber_title: `Tech Dental (${b} Branch)`,
                                                });
                                            }}
                                            className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl font-medium"
                                        >
                                            <option value="Mirpur">Tech Dental (Mirpur Branch)</option>
                                            <option value="Uttara">Tech Dental (Uttara Branch)</option>
                                            <option value="Badda">Tech Dental (Badda Branch)</option>
                                            <option value="Jatrabari">Tech Dental (Jatrabari Branch)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Visiting Time &amp; Schedule</label>
                                        <input
                                            type="text"
                                            value={editForm.visiting_time}
                                            onChange={(e) => setEditForm({ ...editForm, visiting_time: e.target.value })}
                                            className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Chamber Title</label>
                                        <input
                                            type="text"
                                            value={editForm.chamber_title}
                                            onChange={(e) => setEditForm({ ...editForm, chamber_title: e.target.value })}
                                            className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">
                                        Area of Expertise (Comma-separated specialties)
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.spec}
                                        onChange={(e) => setEditForm({ ...editForm, spec: e.target.value })}
                                        placeholder="e.g. Painless Root Canal & Child Dental Care, Habit Breaking Appliances, Space Maintainers, Preventive Dentistry"
                                        className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        These appear as interactive chips in the "AREA OF EXPERTISE" section on the doctor's page.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Chamber Physical Address</label>
                                    <input
                                        type="text"
                                        value={editForm.chamber_address}
                                        onChange={(e) => setEditForm({ ...editForm, chamber_address: e.target.value })}
                                        className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Section: 6 Doctor Performance Milestone Cards */}
                            <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                                <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                                            <Award size={16} className="text-[#800038]" />
                                            Doctor Milestones &amp; Treatment Stats (6 Public Cards)
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            These 6 milestone cards are displayed prominently on the doctor's single profile page.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {(editForm.milestones || DEFAULT_DOCTOR_MILESTONES).slice(0, 6).map((ms, index) => {
                                        const colorOptions = [
                                            { value: 'pink', label: 'Pink' },
                                            { value: 'emerald', label: 'Emerald' },
                                            { value: 'sky', label: 'Sky' },
                                            { value: 'amber', label: 'Amber' },
                                            { value: 'purple', label: 'Purple' },
                                            { value: 'teal', label: 'Teal' },
                                        ];
                                        return (
                                            <div key={index} className="bg-gray-50/70 border border-gray-200 rounded-xl p-3.5 space-y-2.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                                        Card #{index + 1}
                                                    </span>
                                                    <select
                                                        value={ms.color || colorOptions[index % colorOptions.length].value}
                                                        onChange={(e) => {
                                                            const updated = [...(editForm.milestones || DEFAULT_DOCTOR_MILESTONES)];
                                                            updated[index] = { ...updated[index], color: e.target.value };
                                                            setEditForm({ ...editForm, milestones: updated });
                                                        }}
                                                        className="text-[10px] font-semibold px-2 py-0.5 rounded-lg border border-gray-200 bg-white"
                                                    >
                                                        {colorOptions.map(c => (
                                                            <option key={c.value} value={c.value}>{c.label}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] font-bold text-gray-600 mb-1">
                                                        Count / Stat (e.g. 830+)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={ms.count}
                                                        onChange={(e) => {
                                                            const updated = [...(editForm.milestones || DEFAULT_DOCTOR_MILESTONES)];
                                                            updated[index] = { ...updated[index], count: e.target.value };
                                                            setEditForm({ ...editForm, milestones: updated });
                                                        }}
                                                        className="w-full px-2.5 py-1.5 text-xs font-bold border border-gray-200 rounded-lg bg-white"
                                                        placeholder="e.g. 830+"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] font-bold text-gray-600 mb-1">
                                                        Treatment Label
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={ms.label}
                                                        onChange={(e) => {
                                                            const updated = [...(editForm.milestones || DEFAULT_DOCTOR_MILESTONES)];
                                                            updated[index] = { ...updated[index], label: e.target.value };
                                                            setEditForm({ ...editForm, milestones: updated });
                                                        }}
                                                        className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                                                        placeholder="e.g. Painless Child Treatments"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Section: Single Doctor Expandable Drawer Content (Rich HTML & Headings) */}
                            <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                                <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                                            <Sparkles size={16} className="text-[#800038]" />
                                            More About {editForm.name || 'Doctor'} Drawer Content (Rich HTML &amp; Headings)
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            This content appears in the expandable accordion drawer at the bottom of the single doctor profile page (<span className="font-mono text-rose-700 bg-rose-50 px-1 py-0.5 rounded">/doctors/{selectedDoctor.id}</span>).
                                        </p>
                                    </div>
                                    <a
                                        href={`/doctors/${selectedDoctor.id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition"
                                    >
                                        <ExternalLink size={13} /> View Live Profile
                                    </a>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                                        <span>More About Drawer Heading / Title (Accordion Button Text)</span>
                                        <span className="text-[10px] text-gray-400 font-normal">e.g. More About {editForm.name || 'Doctor'}</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.seo_title}
                                        onChange={(e) => setEditForm({ ...editForm, seo_title: e.target.value })}
                                        placeholder={`More About ${editForm.name || 'Doctor'}`}
                                        className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl font-bold bg-white"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        Renames the expandable accordion button at the bottom of this doctor's profile page.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">
                                        Write More About Content (Headings, Paragraphs, Lists, Images)
                                    </label>
                                    <RichContentEditor
                                        label={`WRITE MORE ABOUT ${editForm.name ? editForm.name.toUpperCase() : 'DOCTOR'} CONTENT (RICH HTML)`}
                                        value={editForm.seo_content}
                                        onChange={(val) => setEditForm({ ...editForm, seo_content: val })}
                                        placeholder="Write detailed biography, clinical expertise, specialties, patient testimonials, treatment highlights..."
                                        minHeight="260px"
                                    />
                                </div>
                            </div>

                            {/* Section: Single Doctor SEO, Directives & Google Rich Schema */}
                            <div className="lg:col-span-3">
                                <SeoMetaBox
                                    data={{
                                        seo_title: editForm.seo_title || `${editForm.name} – Senior Dental Surgeon`,
                                        meta_desc: editForm.meta_desc || editForm.bio,
                                        canonical_url: editForm.canonical_url,
                                        robots_index: editForm.robots_index,
                                        robots_follow: editForm.robots_follow,
                                        schema_type: editForm.schema_type || 'Physician',
                                        schema_json: editForm.schema_json,
                                        faqs: editForm.faqs,
                                    }}
                                    onChange={(updated) => {
                                        setEditForm({
                                            ...editForm,
                                            seo_title: updated.seo_title !== undefined ? updated.seo_title : editForm.seo_title,
                                            meta_desc: updated.meta_desc !== undefined ? updated.meta_desc : editForm.meta_desc,
                                            canonical_url: updated.canonical_url !== undefined ? updated.canonical_url : editForm.canonical_url,
                                            robots_index: updated.robots_index !== undefined ? updated.robots_index : editForm.robots_index,
                                            robots_follow: updated.robots_follow !== undefined ? updated.robots_follow : editForm.robots_follow,
                                            schema_type: updated.schema_type !== undefined ? updated.schema_type : editForm.schema_type,
                                            schema_json: updated.schema_json !== undefined ? updated.schema_json : editForm.schema_json,
                                            faqs: updated.faqs !== undefined ? updated.faqs : editForm.faqs,
                                        });
                                    }}
                                    pageType="doctor"
                                    defaultSlug={`doctors/${selectedDoctor.id}`}
                                    previewUrl={`https://techdentalcare.com/doctors/${selectedDoctor.id}`}
                                />
                            </div>

                            {/* Bottom Save Action */}
                            <div className="lg:col-span-3 pt-2 pb-6 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-7 py-3 bg-[#800038] hover:bg-[#990044] text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
                                >
                                    <Save size={16} /> Save Doctor Profile &amp; SEO Content
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* TAB 2: ALL DOCTORS & RANKING */}
            {activeTab === 'ranking' && (
                <div className="space-y-4">
                    {/* Top Action Bar with Save Changes Button */}
                    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="text-xs text-gray-600 font-medium">
                                Displaying <strong>{filteredDoctors.length}</strong> registered dentists. Use arrows or input numbers to rank.
                            </div>
                            {hasRankChanges && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-800 animate-pulse">
                                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                                    Unsaved Changes
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                            <div className="relative w-full sm:w-60">
                                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Filter doctors..."
                                    className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-400"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleSaveRankChanges}
                                disabled={isSavingRank}
                                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                                    hasRankChanges
                                        ? 'bg-[#800038] hover:bg-[#960042] text-white ring-2 ring-[#800038]/30 shadow-md shadow-[#800038]/20'
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                }`}
                            >
                                <Save size={14} className={isSavingRank ? 'animate-spin' : ''} />
                                <span>{isSavingRank ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
                        <table className="w-full text-left text-xs text-gray-600">
                            <thead className="bg-gray-50/80 text-gray-700 uppercase font-bold text-[10px] tracking-wider border-b border-gray-200">
                                <tr>
                                    <th className="py-3 px-4 w-32">Rank Order</th>
                                    <th className="py-3 px-4">Doctor Details</th>
                                    <th className="py-3 px-4">BMDC License</th>
                                    <th className="py-3 px-4">Branch Location</th>
                                    <th className="py-3 px-4">Visiting Schedule</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredDoctors.map((doc, idx) => (
                                    <tr key={doc.id} className="hover:bg-rose-50/30 transition">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min={1}
                                                    max={doctorList.length}
                                                    value={doc.rank_order ?? idx + 1}
                                                    onChange={(e) => handleRankInputChange(doc.id, e.target.value)}
                                                    className="w-12 h-8 text-center font-bold text-gray-800 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                                                    title="Edit rank number directly"
                                                />
                                                <div className="flex flex-col gap-0.5">
                                                    <button
                                                        type="button"
                                                        disabled={idx === 0}
                                                        onClick={() => handleMoveRank(idx, 'up')}
                                                        className="p-1 rounded text-gray-400 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-20 disabled:hover:bg-transparent transition cursor-pointer"
                                                        title="Move Up in Rank"
                                                    >
                                                        <ArrowUp size={12} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={idx === doctorList.length - 1}
                                                        onClick={() => handleMoveRank(idx, 'down')}
                                                        className="p-1 rounded text-gray-400 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-20 disabled:hover:bg-transparent transition cursor-pointer"
                                                        title="Move Down in Rank"
                                                    >
                                                        <ArrowDown size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                                                <img
                                                    src={doc.img || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200'}
                                                    alt={doc.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{doc.name}</div>
                                                <div className="text-[11px] text-gray-400">{doc.designation || doc.deg}</div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-mono text-[11px]">
                                                {doc.bmdc || 'Verified BMDC'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 font-semibold text-gray-800">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-50 text-[#800038] border border-pink-100">
                                                <MapPin size={10} /> {normalizeBranch(doc.branch || doc.branch_location)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-500">
                                            {doc.visiting_time || '4 PM - 9 PM'}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="inline-flex items-center gap-1.5">
                                                <a
                                                    href={`/doctors/${doc.id}`}
                                                    target="_blank"
                                                    className="p-1.5 text-gray-400 hover:text-gray-700"
                                                    title="View Public Profile"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                                <button
                                                    onClick={() => {
                                                        setSelectedDoctorId(doc.id);
                                                        setActiveTab('profiles');
                                                    }}
                                                    className="p-1.5 text-rose-600 hover:text-rose-800"
                                                    title="Edit in Profile Tab"
                                                >
                                                    <Edit3 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDoctor(doc.id)}
                                                    className="p-1.5 text-red-500 hover:text-red-700"
                                                    title="Delete Doctor"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Bottom Save Changes Bar */}
                        <div className="bg-gray-50 p-3.5 border-t border-gray-200 flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                                {hasRankChanges ? '⚠️ You have unsaved rank reorder changes.' : '✓ Doctor ranking is up to date.'}
                            </span>
                            <button
                                type="button"
                                onClick={handleSaveRankChanges}
                                disabled={isSavingRank}
                                className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95 ${
                                    hasRankChanges
                                        ? 'bg-[#800038] hover:bg-[#960042] text-white'
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                }`}
                            >
                                <Save size={13} className={isSavingRank ? 'animate-spin' : ''} />
                                <span>{isSavingRank ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: BRANCH ALLOCATIONS */}
            {activeTab === 'categories' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {['Mirpur', 'Uttara', 'Badda', 'Jatrabari'].map((branchName) => {
                        const branchDocs = data.filter(d => (d.branch || '').includes(branchName));
                        return (
                            <div key={branchName} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs space-y-3">
                                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                    <div className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                                        <MapPin size={16} className="text-rose-600" />
                                        {branchName} Branch
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold">
                                        {branchDocs.length} Specialists
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {branchDocs.map(d => (
                                        <div key={d.id} className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between text-xs">
                                            <span className="font-bold text-gray-800">{d.name}</span>
                                            <span className="text-[10px] text-gray-400">{d.visiting_time || 'Visiting'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* TAB 4: PAGE SEO & ACCORDION DRAWER SETTINGS */}
            {activeTab === 'page_seo' && (
                <form onSubmit={handleSavePageSeo} className="space-y-6">
                    {/* Header Card */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                                <Globe size={18} className="text-[#800038]" />
                                Doctors Page SEO, Directives &amp; Accordion Drawer
                            </h2>
                            <p className="text-xs text-gray-500">
                                Configure the meta tags, Google rich structured schema, and expandable SEO drawer for <span className="font-mono text-rose-700 bg-rose-50 px-1 py-0.5 rounded">/doctors</span>.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <a
                                href="/doctors"
                                target="_blank"
                                rel="noreferrer"
                                className="px-3.5 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition inline-flex items-center gap-1.5"
                            >
                                <ExternalLink size={13} />
                                View Live Page
                            </a>
                            <button
                                type="submit"
                                disabled={isSavingSeo}
                                className="px-5 py-2 text-xs font-bold text-white bg-[#800038] hover:bg-[#990044] rounded-xl shadow-sm transition inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                <Save size={15} />
                                {isSavingSeo ? 'Saving...' : 'Save Page SEO'}
                            </button>
                        </div>
                    </div>

                    {/* Page Title & Accordion Drawer Section */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                                1. Page Title &amp; Accordion Drawer Configuration
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">
                                        Browser Tab Title (Page Title)
                                    </label>
                                    <input
                                        type="text"
                                        value={pageTitle}
                                        onChange={(e) => setPageTitle(e.target.value)}
                                        placeholder="Specialist Dentists &amp; Dental Surgeons – Tech Dental"
                                        className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">
                                        Accordion Drawer Main Title (Frontend Heading)
                                    </label>
                                    <input
                                        type="text"
                                        value={seoTitle}
                                        onChange={(e) => setSeoTitle(e.target.value)}
                                        placeholder="More about Dentists"
                                        className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2">
                                Accordion Drawer Rich Content (SEO &amp; Clinic Expertise)
                            </label>
                            <RichContentEditor
                                label="WRITE MORE ABOUT DENTISTS CONTENT (RICH HTML &amp; HEADINGS)"
                                value={seoContent}
                                onChange={(val) => setSeoContent(val)}
                                placeholder="Write detailed information about your dental surgeons, clinic standards, sterilization, and care protocols..."
                                minHeight="260px"
                            />
                        </div>
                    </div>

                    {/* SEO & Rich Structured Schema Meta Box */}
                    <SeoMetaBox
                        data={{
                            seo_title: pageTitle,
                            meta_desc: metaDesc,
                            canonical_url: canonicalUrl,
                            robots_index: robotsIndex,
                            robots_follow: robotsFollow,
                            schema_type: schemaType,
                            schema_json: schemaJson,
                            faqs: faqs,
                        }}
                        onChange={(updated) => {
                            if (updated.seo_title !== undefined) setPageTitle(updated.seo_title);
                            if (updated.meta_desc !== undefined) setMetaDesc(updated.meta_desc);
                            if (updated.canonical_url !== undefined) setCanonicalUrl(updated.canonical_url);
                            if (updated.robots_index !== undefined) setRobotsIndex(updated.robots_index);
                            if (updated.robots_follow !== undefined) setRobotsFollow(updated.robots_follow);
                            if (updated.schema_type !== undefined) setSchemaType(updated.schema_type);
                            if (updated.schema_json !== undefined) setSchemaJson(updated.schema_json);
                            if (updated.faqs !== undefined) setFaqs(updated.faqs);
                        }}
                        pageType="page"
                        defaultSlug="doctors"
                        previewUrl="https://techdentalcare.com/doctors"
                    />

                    {/* Bottom Save Action */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={isSavingSeo}
                            className="px-6 py-2.5 text-xs font-bold text-white bg-[#800038] hover:bg-[#990044] rounded-xl shadow-md transition inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            <Save size={16} />
                            {isSavingSeo ? 'Saving...' : 'Save Doctors SEO Settings'}
                        </button>
                    </div>
                </form>
            )}
            {isNewModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full border border-gray-200 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
                            <h3 className="font-bold text-gray-900 text-sm">Add New Doctor Specialist</h3>
                            <button onClick={() => setIsNewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateDoctor} className="p-6 space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Doctor Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Dr. ..."
                                        value={newDoctorForm.name}
                                        onChange={(e) => setNewDoctorForm({ ...newDoctorForm, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Designation</label>
                                    <input
                                        type="text"
                                        value={newDoctorForm.designation}
                                        onChange={(e) => setNewDoctorForm({ ...newDoctorForm, designation: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Degrees</label>
                                    <input
                                        type="text"
                                        value={newDoctorForm.deg}
                                        onChange={(e) => setNewDoctorForm({ ...newDoctorForm, deg: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">BMDC Registration No.</label>
                                    <input
                                        type="text"
                                        value={newDoctorForm.bmdc}
                                        onChange={(e) => setNewDoctorForm({ ...newDoctorForm, bmdc: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Branch</label>
                                    <select
                                        value={newDoctorForm.branch}
                                        onChange={(e) => setNewDoctorForm({ ...newDoctorForm, branch: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                                    >
                                        <option value="Mirpur">Tech Dental (Mirpur Branch)</option>
                                        <option value="Uttara">Tech Dental (Uttara Branch)</option>
                                        <option value="Badda">Tech Dental (Badda Branch)</option>
                                        <option value="Jatrabari">Tech Dental (Jatrabari Branch)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Doctor Photo (3:4 Portrait)</label>
                                    <div className="flex items-center gap-1.5">
                                        <input
                                            type="text"
                                            value={newDoctorForm.img}
                                            onChange={(e) => setNewDoctorForm({ ...newDoctorForm, img: e.target.value })}
                                            placeholder="https://... or upload"
                                            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono"
                                        />
                                        <label className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-white bg-[#800038] hover:bg-[#990044] rounded-xl transition cursor-pointer shrink-0">
                                            <UploadCloud size={13} />
                                            <span>Upload</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        setCropTarget('new');
                                                        setCropFile(e.target.files[0]);
                                                        setIsCropperOpen(true);
                                                        e.target.value = '';
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCropTarget('new');
                                                setIsLibraryOpen(true);
                                            }}
                                            className="p-2 text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-xl transition cursor-pointer shrink-0"
                                            title="Media Library"
                                        >
                                            <FolderOpen size={14} className="text-[#800038]" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Visiting Hours</label>
                                <input
                                    type="text"
                                    value={newDoctorForm.visiting_time}
                                    onChange={(e) => setNewDoctorForm({ ...newDoctorForm, visiting_time: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsNewModalOpen(false)}
                                    className="px-4 py-2 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition flex items-center gap-2"
                                >
                                    <Plus size={15} />
                                    Register Doctor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Image Cropper Modal for Doctor Photo */}
            <ImageCropperModal
                isOpen={isCropperOpen}
                onClose={() => {
                    setIsCropperOpen(false);
                    setCropFile(null);
                }}
                imageFile={cropFile}
                imageSrc={cropFile ? undefined : (cropTarget === 'edit' ? editForm.img : newDoctorForm.img)}
                defaultAspect="3:4"
                title="Crop & Upload Doctor Photo (3:4 Portrait)"
                onCropComplete={(url) => {
                    if (cropTarget === 'edit') {
                        setEditForm((prev) => ({ ...prev, img: url }));
                    } else {
                        setNewDoctorForm((prev) => ({ ...prev, img: url }));
                    }
                    setIsCropperOpen(false);
                    setCropFile(null);
                }}
            />

            {/* Media Library Modal for Doctor Photo */}
            <MediaLibraryModal
                isOpen={isLibraryOpen}
                onClose={() => setIsLibraryOpen(false)}
                defaultAspect="3:4"
                title="Select Doctor Photo from Media Library"
                currentImage={cropTarget === 'edit' ? editForm.img : newDoctorForm.img}
                onSelectImage={(url) => {
                    if (cropTarget === 'edit') {
                        setEditForm((prev) => ({ ...prev, img: url }));
                    } else {
                        setNewDoctorForm((prev) => ({ ...prev, img: url }));
                    }
                    setIsLibraryOpen(false);
                }}
            />
        </AdminLayout>
    );
}
