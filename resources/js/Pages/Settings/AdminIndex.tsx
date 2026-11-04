import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Settings,
    Image as ImageIcon,
    Globe,
    Building2,
    Save,
    UploadCloud,
    CheckCircle2,
    Eye,
    Trash2,
    Smartphone,
    Mail,
    MapPin,
    Sparkles,
    ShieldCheck
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';
import MediaLibraryModal from '@/components/ImagePicker/MediaLibraryModal';

interface SettingsData {
    id?: number;
    company_name?: string;
    brand_name_line1?: string;
    brand_name_line2?: string;
    tagline?: string;
    header_logo?: string;
    favicon?: string;
    contact_phone?: string;
    contact_email?: string;
    address?: string;
}

interface Props extends PageProps {
    settings: SettingsData;
    mediaList?: any[];
}

export default function SettingsAdminIndex({ settings, mediaList = [] }: Props) {
    const [form, setForm] = useState({
        company_name: settings?.company_name || 'Tech Dental',
        brand_name_line1: settings?.brand_name_line1 || 'TECH',
        brand_name_line2: settings?.brand_name_line2 || 'DENTAL',
        tagline: settings?.tagline || 'Your Trusted Dental Care Provider in Dhaka',
        header_logo: settings?.header_logo || '',
        favicon: settings?.favicon || '/favicon.ico',
        contact_phone: settings?.contact_phone || '09638000505',
        contact_email: settings?.contact_email || 'info@techdentalcare.com',
        address: settings?.address || 'Dhaka, Bangladesh',
    });

    const [isLogoPickerOpen, setIsLogoPickerOpen] = useState(false);
    const [isFaviconPickerOpen, setIsFaviconPickerOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        router.post(route('settings.admin.update'), form, {
            onSuccess: () => {
                setIsSaving(false);
                setShowSuccessToast(true);
                setTimeout(() => setShowSuccessToast(false), 3000);
            },
            onError: () => {
                setIsSaving(false);
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="Site & Brand Settings - Tech Dental" />

            <div className="space-y-6 max-w-6xl mx-auto pb-16">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
                            <Settings size={24} className="text-rose-600" />
                            Site Settings
                        </h1>
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                    >
                        <Save size={16} />
                        <span>{isSaving ? 'Saving Changes...' : 'Save Settings'}</span>
                    </button>
                </div>

                {/* Success Toast */}
                {showSuccessToast && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in duration-200">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        <span>Settings have been updated successfully! Changes are applied across the entire website.</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* SECTION 1: LOGO & FAVICON */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-6 space-y-6">
                        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ImageIcon size={18} className="text-rose-600" />
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                                    Logo & Favicon Management
                                </h2>
                            </div>
                            <span className="text-[11px] font-medium text-slate-400">
                                Supports media library, direct upload, and cropping
                            </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Card 1: Header Logo */}
                            <div className="p-5 bg-gray-50/70 border border-gray-200/80 rounded-2xl space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xs font-bold text-gray-900">Header Brand Logo</h3>
                                        <p className="text-[11px] text-gray-500">
                                            Main logo displayed on the top left of the header bar.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsLogoPickerOpen(true)}
                                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-[#800038] border border-rose-200 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                                    >
                                        <UploadCloud size={14} />
                                        <span>Change Logo</span>
                                    </button>
                                </div>

                                {/* Logo Preview Box */}
                                <div className="p-4 bg-white border border-gray-200 rounded-xl flex items-center justify-between min-h-[90px]">
                                    <div className="flex items-center gap-3">
                                        <div className="h-16 w-36 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center p-2 overflow-hidden">
                                            {form.header_logo ? (
                                                <img
                                                    src={form.header_logo}
                                                    alt="Header Logo Preview"
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            ) : (
                                                <span className="text-[10px] text-gray-400 font-bold">No Logo</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-800">
                                                {form.header_logo ? 'Active Header Logo' : 'No Logo Uploaded'}
                                            </div>
                                            <div className="text-[11px] text-gray-400 truncate max-w-xs font-mono">
                                                {form.header_logo || 'Upload or select an image from media library'}
                                            </div>
                                        </div>
                                    </div>

                                    {form.header_logo && (
                                        <button
                                            type="button"
                                            onClick={() => setForm({ ...form, header_logo: '' })}
                                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition"
                                            title="Clear custom logo"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                        Logo Image URL
                                    </label>
                                    <input
                                        type="text"
                                        value={form.header_logo}
                                        onChange={(e) => setForm({ ...form, header_logo: e.target.value })}
                                        placeholder="https://... or choose from media library"
                                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 font-mono"
                                    />
                                </div>
                            </div>

                            {/* Card 2: Favicon */}
                            <div className="p-5 bg-gray-50/70 border border-gray-200/80 rounded-2xl space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xs font-bold text-gray-900">Browser Favicon</h3>
                                        <p className="text-[11px] text-gray-500">
                                            Icon shown in browser tabs, bookmarks, and mobile shortcuts.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsFaviconPickerOpen(true)}
                                        className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                                    >
                                        <UploadCloud size={14} />
                                        <span>Change Favicon</span>
                                    </button>
                                </div>

                                {/* Browser Tab Simulation Mockup */}
                                <div className="p-3 bg-slate-900 rounded-xl text-white space-y-2">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        Browser Tab Mockup Preview
                                    </div>
                                    <div className="bg-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2 max-w-sm border border-slate-700">
                                        <div className="w-4 h-4 rounded-xs overflow-hidden shrink-0 flex items-center justify-center bg-white/10">
                                            <img
                                                src={form.favicon || '/favicon.ico'}
                                                alt="Favicon"
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    // Fallback to default favicon
                                                    (e.target as HTMLImageElement).src = '/favicon.ico';
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-200 truncate">
                                            {form.company_name || 'Tech Dental'} — Best Dental Care
                                        </span>
                                        <span className="text-slate-500 text-[10px] ml-auto">✕</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                        Favicon URL (.ico, .png, or .webp)
                                    </label>
                                    <input
                                        type="text"
                                        value={form.favicon}
                                        onChange={(e) => setForm({ ...form, favicon: e.target.value })}
                                        placeholder="/favicon.ico or https://..."
                                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: COMPANY & BRAND IDENTITY */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-6 space-y-6">
                        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Building2 size={18} className="text-rose-600" />
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                                    Company & Brand Identity
                                </h2>
                            </div>
                            <span className="text-[11px] font-medium text-slate-400">
                                Updates company information and site title
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Company Name */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    Company Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.company_name}
                                    onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                                    placeholder="Tech Dental"
                                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 font-semibold"
                                />
                                <p className="text-[11px] text-gray-400 mt-1">
                                    Used in page title tags, invoices, and meta descriptions.
                                </p>
                            </div>

                            {/* Tagline */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    Slogan / Tagline
                                </label>
                                <input
                                    type="text"
                                    value={form.tagline}
                                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                                    placeholder="Your Trusted Dental Care Provider in Dhaka"
                                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 font-medium"
                                />
                                <p className="text-[11px] text-gray-400 mt-1">
                                    Used in footer descriptions and branding statements.
                                </p>
                            </div>
                        </div>

                        {/* Live Header Logo Preview */}
                        <div className="p-4 bg-gray-50/80 border border-gray-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="text-xs font-bold text-gray-700">Live Header Logo Preview:</div>
                                <div className="text-[11px] text-gray-400">
                                    This is exactly how your logo image appears in the website header without any extra text.
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl border border-gray-200 shadow-2xs min-h-[56px]">
                                {form.header_logo ? (
                                    <img
                                        src={form.header_logo}
                                        alt="Header Logo Preview"
                                        className="h-10 sm:h-11 w-auto max-w-[240px] object-contain"
                                    />
                                ) : (
                                    <span className="text-xs text-gray-400 italic font-medium">
                                        No logo uploaded yet. Upload a logo image above.
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: CONTACT & CLINIC INFORMATION */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-6 space-y-6">
                        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Globe size={18} className="text-rose-600" />
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                                    Contact & Location Information
                                </h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                                    <Smartphone size={13} className="text-rose-600" />
                                    <span>Hotline / Phone</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.contact_phone}
                                    onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                                    placeholder="09638000505"
                                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                                    <Mail size={13} className="text-rose-600" />
                                    <span>Official Email</span>
                                </label>
                                <input
                                    type="email"
                                    value={form.contact_email}
                                    onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                                    placeholder="info@techdentalcare.com"
                                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                                    <MapPin size={13} className="text-rose-600" />
                                    <span>Headquarters / Main Address</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    placeholder="Mirpur, Dhaka, Bangladesh"
                                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Save Action */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
                        >
                            <Save size={16} />
                            <span>{isSaving ? 'Saving Changes...' : 'Save Settings'}</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Media Picker Modal for Header Logo */}
            <MediaLibraryModal
                isOpen={isLogoPickerOpen}
                onClose={() => setIsLogoPickerOpen(false)}
                onSelectImage={(url) => {
                    setForm({ ...form, header_logo: url });
                    setIsLogoPickerOpen(false);
                }}
                onSelect={(url) => {
                    setForm({ ...form, header_logo: url });
                    setIsLogoPickerOpen(false);
                }}
                currentImage={form.header_logo}
                title="Select or Crop Header Logo"
            />

            {/* Media Picker Modal for Favicon */}
            <MediaLibraryModal
                isOpen={isFaviconPickerOpen}
                onClose={() => setIsFaviconPickerOpen(false)}
                onSelectImage={(url) => {
                    setForm({ ...form, favicon: url });
                    setIsFaviconPickerOpen(false);
                }}
                onSelect={(url) => {
                    setForm({ ...form, favicon: url });
                    setIsFaviconPickerOpen(false);
                }}
                defaultAspect="1:1"
                currentImage={form.favicon}
                title="Select or Crop Favicon"
            />
        </AdminLayout>
    );
}
