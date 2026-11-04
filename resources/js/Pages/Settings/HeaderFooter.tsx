import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { GlobalFooter } from '@/Components/GlobalFooter';
import {
  LayoutTemplate,
  Globe,
  Sliders,
  Sparkles,
  Save,
  Menu as MenuIcon,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Layers,
  Eye,
  FileText,
  AlertCircle,
  Calendar,
  Monitor,
  Smartphone,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Link as LinkIcon
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';

interface HeaderPageConfig {
  title: string;
  variant: string;
  override_logo: boolean;
  custom_logo: string;
  show_branch_picker: boolean;
  show_language: boolean;
  menu_id: string | number;
  announcement_text?: string;
}

interface HeaderSettings {
  global: {
    sticky: boolean;
    show_language: boolean;
    show_branch_picker: boolean;
    announcement_enabled: boolean;
    announcement_text: string;
  };
  pages: Record<string, HeaderPageConfig>;
}

interface LinkItem {
  label: string;
  url: string;
}

interface BranchItem {
  name: string;
  address?: string;
  url: string;
}

interface FooterSettings {
  enabled: boolean;
  brand_logo_text?: string;
  brand_logo_image?: string;
  brand_name: string;
  brand_badge?: string;
  tagline: string;
  about_text: string;
  hotline: string;
  whatsapp: string;
  whatsapp_label?: string;
  email: string;
  address: string;
  hours: string;
  quick_links_title?: string;
  quick_links?: LinkItem[];
  branches_title?: string;
  branches?: BranchItem[];
  support_title?: string;
  support_subtext?: string;
  copyright: string;
  bottom_links?: LinkItem[];
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  linkedin_url?: string;
  show_cta_strip: boolean;
  cta_badge?: string;
  cta_title: string;
  cta_subtext: string;
  cta_button_text: string;
  cta_button_url: string;
}

interface Props extends PageProps {
  settings: any;
  headerSettings: HeaderSettings;
  footerSettings: FooterSettings;
  menus: any[];
  mediaList: any[];
}

export default function HeaderFooterAdmin({
  settings,
  headerSettings: initialHeaderSettings,
  footerSettings: initialFooterSettings,
  menus = [],
  mediaList = []
}: Props) {
  const [activeMainTab, setActiveMainTab] = useState<'headers' | 'footer'>('headers');
  const [selectedPageKey, setSelectedPageKey] = useState<string>('home');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [footerPreviewDevice, setFooterPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [headerForm, setHeaderForm] = useState<HeaderSettings>(initialHeaderSettings);
  const [footerForm, setFooterForm] = useState<FooterSettings>(() => {
    const defaultQuickLinks: LinkItem[] = [
      { label: 'Home', url: '/' },
      { label: 'Services & Pricing', url: '/services' },
      { label: 'Specialist Doctors', url: '/doctors' },
      { label: 'Treatment Price List', url: '/price-list' },
      { label: 'Medicines & Care', url: '/medicines' },
      { label: 'About Tech Dental', url: '/about' },
      { label: 'Book Appointment', url: '/appointment' },
    ];
    const defaultBranches: BranchItem[] = [
      { name: 'Mirpur Branch', address: 'Shewrapara, Rokeya Sarani (Pillar 318)', url: '/branch/mirpur' },
      { name: 'Uttara Branch', address: 'Sector 7, Jasimuddin Avenue, Dhaka', url: '/branch/uttara' },
      { name: 'Badda Branch', address: 'Middle Badda, Pragati Sarani, Dhaka', url: '/branch/badda' },
      { name: 'Jatrabari Branch', address: 'Shahid Faruk Road, Jatrabari, Dhaka', url: '/branch/jatrabari' },
    ];
    const defaultBottomLinks: LinkItem[] = [
      { label: 'Facebook', url: initialFooterSettings?.facebook_url || 'https://facebook.com/techdentalbd' },
      { label: 'Privacy Policy', url: '/privacy-policy' },
      { label: 'Terms of Service', url: '/terms-of-service' },
    ];

    return {
      ...initialFooterSettings,
      brand_logo_text: initialFooterSettings?.brand_logo_text || 'TD',
      brand_badge: initialFooterSettings?.brand_badge || 'ORAL HEALTHCARE',
      quick_links_title: initialFooterSettings?.quick_links_title || 'QUICK LINKS',
      quick_links: (Array.isArray(initialFooterSettings?.quick_links) && initialFooterSettings.quick_links.length > 0)
        ? initialFooterSettings.quick_links
        : defaultQuickLinks,
      branches_title: initialFooterSettings?.branches_title || 'OUR BRANCHES',
      branches: (Array.isArray(initialFooterSettings?.branches) && initialFooterSettings.branches.length > 0)
        ? initialFooterSettings.branches
        : defaultBranches,
      support_title: initialFooterSettings?.support_title || 'EMERGENCY & SUPPORT',
      support_subtext: initialFooterSettings?.support_subtext || 'Need urgent assistance or want to schedule a dental checkup? Reach out directly:',
      whatsapp_label: initialFooterSettings?.whatsapp_label || 'WhatsApp Direct Help',
      bottom_links: (Array.isArray(initialFooterSettings?.bottom_links) && initialFooterSettings.bottom_links.length > 0)
        ? initialFooterSettings.bottom_links
        : defaultBottomLinks,
      cta_badge: initialFooterSettings?.cta_badge || 'Painless Clinical Dentistry in Dhaka',
    };
  });

  const pageKeys = Object.keys(headerForm.pages || {});

  const handlePageFieldChange = (pageKey: string, field: keyof HeaderPageConfig, value: any) => {
    setHeaderForm(prev => ({
      ...prev,
      pages: {
        ...prev.pages,
        [pageKey]: {
          ...prev.pages[pageKey],
          [field]: value
        }
      }
    }));
  };

  const handleGlobalHeaderChange = (field: keyof HeaderSettings['global'], value: any) => {
    setHeaderForm(prev => ({
      ...prev,
      global: {
        ...prev.global,
        [field]: value
      }
    }));
  };

  const handleFooterChange = (field: keyof FooterSettings, value: any) => {
    setFooterForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Quick Links Handlers
  const handleQuickLinkChange = (index: number, field: 'label' | 'url', val: string) => {
    const list = [...(footerForm.quick_links || [])];
    if (!list[index]) return;
    list[index] = { ...list[index], [field]: val };
    handleFooterChange('quick_links', list);
  };

  const handleAddQuickLink = () => {
    const list = [...(footerForm.quick_links || [])];
    list.push({ label: 'New Link', url: '/' });
    handleFooterChange('quick_links', list);
  };

  const handleRemoveQuickLink = (index: number) => {
    const list = [...(footerForm.quick_links || [])];
    list.splice(index, 1);
    handleFooterChange('quick_links', list);
  };

  const handleMoveQuickLink = (index: number, direction: -1 | 1) => {
    const list = [...(footerForm.quick_links || [])];
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;
    handleFooterChange('quick_links', list);
  };

  const handleResetQuickLinks = () => {
    handleFooterChange('quick_links', [
      { label: 'Home', url: '/' },
      { label: 'Services & Pricing', url: '/services' },
      { label: 'Specialist Doctors', url: '/doctors' },
      { label: 'Treatment Price List', url: '/price-list' },
      { label: 'Medicines & Care', url: '/medicines' },
      { label: 'About Tech Dental', url: '/about' },
      { label: 'Book Appointment', url: '/appointment' },
    ]);
  };

  // Branches Handlers
  const handleBranchChange = (index: number, field: 'name' | 'address' | 'url', val: string) => {
    const list = [...(footerForm.branches || [])];
    if (!list[index]) return;
    list[index] = { ...list[index], [field]: val };
    handleFooterChange('branches', list);
  };

  const handleAddBranch = () => {
    const list = [...(footerForm.branches || [])];
    list.push({ name: 'New Branch', address: 'Area, Dhaka', url: '/branch/mirpur' });
    handleFooterChange('branches', list);
  };

  const handleRemoveBranch = (index: number) => {
    const list = [...(footerForm.branches || [])];
    list.splice(index, 1);
    handleFooterChange('branches', list);
  };

  const handleResetBranches = () => {
    handleFooterChange('branches', [
      { name: 'Mirpur Branch', address: 'Shewrapara, Rokeya Sarani (Pillar 318)', url: '/branch/mirpur' },
      { name: 'Uttara Branch', address: 'Sector 7, Jasimuddin Avenue, Dhaka', url: '/branch/uttara' },
      { name: 'Badda Branch', address: 'Middle Badda, Pragati Sarani, Dhaka', url: '/branch/badda' },
      { name: 'Jatrabari Branch', address: 'Shahid Faruk Road, Jatrabari, Dhaka', url: '/branch/jatrabari' },
    ]);
  };

  // Bottom Legal Links Handlers
  const handleBottomLinkChange = (index: number, field: 'label' | 'url', val: string) => {
    const list = [...(footerForm.bottom_links || [])];
    if (!list[index]) return;
    list[index] = { ...list[index], [field]: val };
    handleFooterChange('bottom_links', list);
  };

  const handleAddBottomLink = () => {
    const list = [...(footerForm.bottom_links || [])];
    list.push({ label: 'New Link', url: '#' });
    handleFooterChange('bottom_links', list);
  };

  const handleRemoveBottomLink = (index: number) => {
    const list = [...(footerForm.bottom_links || [])];
    list.splice(index, 1);
    handleFooterChange('bottom_links', list);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    router.post(route('settings.header-footer.update'), {
      header_settings: headerForm,
      footer_settings: footerForm,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      },
      onError: () => {
        setIsSaving(false);
        alert('Failed to save settings. Please check the inputs.');
      }
    });
  };

  const currentPage = headerForm.pages?.[selectedPageKey] || {
    title: 'Page Header',
    variant: 'full',
    override_logo: false,
    custom_logo: '',
    show_branch_picker: true,
    show_language: true,
    menu_id: '',
    announcement_text: ''
  };

  return (
    <AdminLayout>
      <Head title="Header & Footer Management - Tech Dental" />

      {/* Page Title Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#800038] to-pink-600 text-white flex items-center justify-center font-bold shadow-md shadow-rose-900/20">
            <LayoutTemplate size={20} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Header &amp; Footer</h1>
          </div>
        </div>

        {saveSuccess && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      {/* Main Tab Switcher */}
      <div className="flex border-b border-gray-200 mb-6 gap-2">
        <button
          type="button"
          onClick={() => setActiveMainTab('headers')}
          className={`px-5 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
            activeMainTab === 'headers'
              ? 'border-[#800038] text-[#800038] bg-white shadow-2xs'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Layers size={15} />
          <span>Page-Wise Headers</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveMainTab('footer')}
          className={`px-5 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
            activeMainTab === 'footer'
              ? 'border-[#800038] text-[#800038] bg-white shadow-2xs'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <LayoutTemplate size={15} />
          <span>Global Unified Footer</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ======================================================== */}
        {/* TAB 1: PAGE-WISE HEADERS */}
        {/* ======================================================== */}
        {activeMainTab === 'headers' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Sidebar: Pages List */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs space-y-2">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">
                Select Page to Customize
              </h2>
              {pageKeys.map((key) => {
                const pg = headerForm.pages[key];
                const isSelected = selectedPageKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedPageKey(key)}
                    className={`w-full text-left px-3.5 py-3 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#800038] text-white shadow-sm font-bold'
                        : 'text-gray-700 hover:bg-gray-50 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-pink-300' : 'bg-slate-300'}`} />
                      <span className="text-xs truncate">{pg?.title || key}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {pg?.variant || 'full'}
                    </span>
                  </button>
                );
              })}

              {/* Global Header Preferences */}
              <div className="pt-4 mt-4 border-t border-gray-100 space-y-3 px-2">
                <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <Sliders size={13} className="text-[#800038]" />
                  Global Header Rules
                </h3>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
                  <input
                    type="checkbox"
                    checked={headerForm.global?.sticky ?? true}
                    onChange={(e) => handleGlobalHeaderChange('sticky', e.target.checked)}
                    className="rounded text-[#800038] focus:ring-[#800038]"
                  />
                  <span>Sticky Header (Fixed on scroll)</span>
                </label>
              </div>
            </div>

            {/* Right Panel: Page Configuration */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-6">
              <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    {currentPage.title} — Header Configuration
                  </h3>
                  <p className="text-xs text-gray-500">
                    Controls the top navigation bar appearance for {currentPage.title}
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-rose-50 text-[#800038] font-bold border border-rose-100">
                  /{selectedPageKey === 'home' ? '' : selectedPageKey}
                </span>
              </div>

              {/* Header Layout Variant */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-800">
                  Header Layout Variant
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'full',
                      name: 'Full Interactive Header',
                      desc: 'Logo, menu drawer & branch switcher'
                    },
                    {
                      id: 'minimal',
                      name: 'Clean Minimal Header',
                      desc: 'Compact logo + appointment button + menu'
                    },
                    {
                      id: 'announcement',
                      name: 'Announcement Bar Header',
                      desc: 'Top highlighted clinic notice bar + header'
                    }
                  ].map((v) => {
                    const active = currentPage.variant === v.id;
                    return (
                      <div
                        key={v.id}
                        onClick={() => handlePageFieldChange(selectedPageKey, 'variant', v.id)}
                        className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          active
                            ? 'border-[#800038] bg-rose-50/30 shadow-xs'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-gray-900">{v.name}</span>
                            <span className={`w-3 h-3 rounded-full border-2 ${
                              active ? 'border-[#800038] bg-[#800038]' : 'border-gray-300'
                            }`} />
                          </div>
                          <p className="text-[11px] text-gray-500">{v.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Specific announcement text if variant is announcement */}
              {currentPage.variant === 'announcement' && (
                <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 space-y-1.5 animate-in fade-in">
                  <label className="block text-xs font-bold text-amber-900">
                    Top Announcement / Notice Bar Text
                  </label>
                  <input
                    type="text"
                    value={currentPage.announcement_text || ''}
                    onChange={(e) => handlePageFieldChange(selectedPageKey, 'announcement_text', e.target.value)}
                    placeholder="e.g. Special 15% discount on Dental Implants across all branches this month!"
                    className="w-full px-3 py-2 text-xs border border-amber-300 rounded-lg bg-white"
                  />
                </div>
              )}

              {/* LIVE INTERACTIVE HEADER PREVIEW BOX */}
              <div className="bg-slate-50/90 rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#800038]/10 text-[#800038] flex items-center justify-center">
                      <Eye size={15} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        <span>Live Header Preview</span>
                      </h4>
                      <p className="text-[10px] text-gray-500">
                        Header appearance for {currentPage.title}
                      </p>
                    </div>
                  </div>

                  {/* Desktop / Mobile Preview Mode Switch */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-2xs self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('desktop')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        previewDevice === 'desktop'
                          ? 'bg-[#800038] text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Monitor size={12} />
                      <span>Desktop</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('mobile')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        previewDevice === 'mobile'
                          ? 'bg-[#800038] text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Smartphone size={12} />
                      <span>Mobile</span>
                    </button>
                  </div>
                </div>

                {/* Simulated Device Frame */}
                <div className={`mx-auto transition-all duration-300 ${previewDevice === 'mobile' ? 'max-w-sm' : 'w-full'}`}>
                  <div className="rounded-xl overflow-hidden border border-slate-300/80 bg-white shadow-sm">
                    {/* Simulated Browser Chrome */}
                    <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      </div>
                      <div className="flex-1 bg-white border border-slate-200 rounded-md px-2 py-0.5 text-[10px] text-gray-500 font-mono truncate text-center shadow-2xs">
                        techdental.com{selectedPageKey === 'home' ? '' : `/${selectedPageKey}`}
                      </div>
                    </div>

                    {/* Variant Header Rendering */}
                    <div>
                      {/* Top Announcement Bar (for announcement variant) */}
                      {currentPage.variant === 'announcement' && (
                        <div className="w-full bg-gradient-to-r from-[#800038] via-[#a51547] to-[#800038] text-white py-1.5 px-3 text-center text-[10px] sm:text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-pulse shrink-0" />
                          <span className="truncate">
                            {currentPage.announcement_text || 'Welcome to Tech Dental – Painless Digital Dental Care across Dhaka'}
                          </span>
                        </div>
                      )}

                      {/* Header Navbar Bar */}
                      <div className="px-3 sm:px-4 py-2.5 flex items-center justify-between bg-white border-b border-slate-100">
                        {/* Left: Menu Icon + Logo */}
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="p-1.5 rounded-lg border border-slate-200 text-slate-700 bg-slate-50 flex items-center justify-center">
                            <MenuIcon size={14} />
                          </div>

                          {/* Logo */}
                          {(() => {
                            const previewLogo = (currentPage.override_logo && currentPage.custom_logo)
                              ? currentPage.custom_logo
                              : (settings?.header_logo || settings?.logo || null);

                            if (previewLogo) {
                              return (
                                <img
                                  src={previewLogo}
                                  alt="Logo"
                                  className="h-7 sm:h-8 w-auto max-w-[140px] sm:max-w-[170px] object-contain"
                                />
                              );
                            }

                            return (
                              <div className="flex items-center gap-1.5 leading-none">
                                <span className="text-[12px] sm:text-sm font-black text-[#800038]">
                                  {settings?.brand_name_line1 || 'TECH'}
                                </span>
                                <span className="text-[12px] sm:text-sm font-black text-slate-900">
                                  {settings?.brand_name_line2 || 'DENTAL'}
                                </span>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Right: Variant Specific Elements */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          {/* Variant: Full Interactive */}
                          {currentPage.variant === 'full' && (
                            <>
                              {currentPage.show_branch_picker !== false && (
                                <div className="bg-[#f8fafc] border border-[#dbeafe] py-1 px-2.5 rounded-full flex items-center gap-1 text-[10px] font-bold text-sky-600 shadow-2xs">
                                  <MapPin size={11} className="text-sky-600" />
                                  <span>Mirpur ˅</span>
                                </div>
                              )}
                            </>
                          )}

                          {/* Variant: Clean Minimal */}
                          {currentPage.variant === 'minimal' && (
                            <div className="inline-flex items-center gap-1.5 bg-[#800038] text-white px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold shadow-xs">
                              <Calendar size={11} />
                              <span>Book Appointment</span>
                            </div>
                          )}

                          {/* Variant: Announcement */}
                          {currentPage.variant === 'announcement' && (
                            <>
                              {currentPage.show_branch_picker !== false && (
                                <div className="bg-[#f8fafc] border border-[#dbeafe] py-1 px-2.5 rounded-full flex items-center gap-1 text-[10px] font-bold text-sky-600 shadow-2xs">
                                  <MapPin size={11} className="text-sky-600" />
                                  <span>Mirpur ˅</span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Variant Explanation Strip */}
                <div className="text-[11px] text-gray-500 bg-white p-2.5 rounded-xl border border-gray-200/80 flex items-center justify-between flex-wrap gap-2">
                  <span className="font-medium">
                    Active Variant:{' '}
                    <strong className="text-[#800038] font-bold">
                      {currentPage.variant === 'minimal'
                        ? 'Clean Minimal (Compact logo + direct appointment button)'
                        : currentPage.variant === 'announcement'
                        ? 'Announcement Bar Header (Top notice bar + full header)'
                        : 'Full Interactive Header (Logo, menu drawer & branch switcher)'}
                    </strong>
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono">
                    Page: {currentPage.title}
                  </span>
                </div>
              </div>

              {/* Navigation Menu Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Assigned Navigation Menu
                  </label>
                  <select
                    value={currentPage.menu_id || ''}
                    onChange={(e) => handlePageFieldChange(selectedPageKey, 'menu_id', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                  >
                    <option value="">Default Site Menu</option>
                    {menus.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name || m.title || `Menu #${m.id}`}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-gray-400 mt-1">
                    You can manage menus under Settings &gt; Navigation menus
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Branch Switcher Dropdown
                  </label>
                  <select
                    value={currentPage.show_branch_picker ? 'yes' : 'no'}
                    onChange={(e) => handlePageFieldChange(selectedPageKey, 'show_branch_picker', e.target.value === 'yes')}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                  >
                    <option value="yes">Visible (Show Mirpur, Uttara, etc.)</option>
                    <option value="no">Hidden (Don't show on this page)</option>
                  </select>
                </div>
              </div>

              {/* Custom Logo Override */}
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={currentPage.override_logo || false}
                    onChange={(e) => handlePageFieldChange(selectedPageKey, 'override_logo', e.target.checked)}
                    className="rounded text-[#800038] focus:ring-[#800038]"
                  />
                  <span>Use custom logo for {currentPage.title} (Override site default)</span>
                </label>

                {currentPage.override_logo && (
                  <div className="space-y-1.5 pl-6 animate-in fade-in">
                    <label className="block text-xs font-semibold text-gray-700">Custom Logo URL / Path</label>
                    <input
                      type="text"
                      value={currentPage.custom_logo || ''}
                      onChange={(e) => handlePageFieldChange(selectedPageKey, 'custom_logo', e.target.value)}
                      placeholder="/uploads/images/custom-logo.webp"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                    />
                    <p className="text-[10px] text-gray-400">Leave blank to use default site logo.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: GLOBAL UNIFIED FOOTER */}
        {/* ======================================================== */}
        {activeMainTab === 'footer' && (
          <div className="space-y-6 max-w-5xl">
            {/* LIVE FOOTER PREVIEW (REAL-TIME AS USER EDITS) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#800038] flex items-center justify-center shadow-xs">
                    <Eye size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-gray-900">
                      Live Footer Preview
                    </h3>
                    <p className="text-xs text-gray-500">
                      Real-time interactive preview of how the footer looks on public pages
                    </p>
                  </div>
                </div>

                {/* Device Switcher */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFooterPreviewDevice('desktop')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                      footerPreviewDevice === 'desktop'
                        ? 'bg-white text-gray-900 shadow-xs'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <Monitor size={14} />
                    <span>Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFooterPreviewDevice('mobile')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                      footerPreviewDevice === 'mobile'
                        ? 'bg-white text-gray-900 shadow-xs'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <Smartphone size={14} />
                    <span>Mobile</span>
                  </button>
                </div>
              </div>

              {/* Preview Canvas Box */}
              <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-lg bg-[#090d15]">
                {/* Browser address header */}
                <div className="bg-[#05080e] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-2 font-mono text-slate-400 text-[11px]">techdentalbd.com (Global Footer)</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {footerPreviewDevice} view
                  </span>
                </div>

                {/* Simulated viewport */}
                <div className={`mx-auto transition-all duration-300 ${
                  footerPreviewDevice === 'mobile' ? 'max-w-[430px] border-x border-slate-800 shadow-2xl' : 'w-full'
                }`}>
                  <GlobalFooter customSettings={footerForm} />
                </div>
              </div>
            </div>

            {/* FOOTER FORM SETTINGS CONTAINER */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-8">
              <div className="border-b border-gray-100 pb-4 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    Global Footer Content Configuration
                  </h3>
                  <p className="text-xs text-gray-500">
                    Customize every section, links, branch info, phone, and copyright line
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={footerForm.enabled ?? true}
                    onChange={(e) => handleFooterChange('enabled', e.target.checked)}
                    className="rounded text-[#800038] focus:ring-[#800038]"
                  />
                  <span>Enable Footer Globally</span>
                </label>
              </div>

              {/* 1. COLUMN 1: BRAND & ABOUT */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                  <span className="w-1.5 h-3.5 bg-[#800038] rounded-full" />
                  <span>Column 1: Clinic Brand &amp; Info</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={footerForm.brand_name || ''}
                      onChange={(e) => handleFooterChange('brand_name', e.target.value)}
                      placeholder="Tech Dental"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Brand Badge / Subtitle</label>
                    <input
                      type="text"
                      value={footerForm.brand_badge || ''}
                      onChange={(e) => handleFooterChange('brand_badge', e.target.value)}
                      placeholder="ORAL HEALTHCARE"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Logo Icon Text / Symbol</label>
                    <input
                      type="text"
                      value={footerForm.brand_logo_text || ''}
                      onChange={(e) => handleFooterChange('brand_logo_text', e.target.value)}
                      placeholder="TD"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Brand Logo Image URL (Optional override)</label>
                    <input
                      type="text"
                      value={footerForm.brand_logo_image || ''}
                      onChange={(e) => handleFooterChange('brand_logo_image', e.target.value)}
                      placeholder="https://... or /uploads/images/logo.webp (Leave empty to use symbol)"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={footerForm.tagline || ''}
                      onChange={(e) => handleFooterChange('tagline', e.target.value)}
                      placeholder="Painless Digital Dentistry in Dhaka"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">About / Bio Description</label>
                  <textarea
                    rows={3}
                    value={footerForm.about_text || ''}
                    onChange={(e) => handleFooterChange('about_text', e.target.value)}
                    placeholder="Tech Dental is a leading multi-branch dental care provider in Dhaka..."
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Physical Address / Locations</label>
                    <input
                      type="text"
                      value={footerForm.address || ''}
                      onChange={(e) => handleFooterChange('address', e.target.value)}
                      placeholder="Mirpur, Uttara, Badda & Jatrabari, Dhaka, Bangladesh"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Operating Hours Notice</label>
                    <input
                      type="text"
                      value={footerForm.hours || ''}
                      onChange={(e) => handleFooterChange('hours', e.target.value)}
                      placeholder="Saturday – Thursday: 10:00 AM – 9:00 PM (Friday Closed)"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* 2. COLUMN 2: QUICK LINKS (DYNAMIC CUSTOM LINKS) */}
              <div className="pt-6 border-t border-gray-100 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                    <span className="w-1.5 h-3.5 bg-rose-600 rounded-full" />
                    <span>Column 2: Quick Links</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetQuickLinks}
                      className="px-2.5 py-1 text-[11px] font-semibold text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw size={12} />
                      <span>Reset Defaults</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddQuickLink}
                      className="px-3 py-1 text-xs font-bold text-white bg-[#800038] hover:bg-[#990044] rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                    >
                      <Plus size={13} />
                      <span>Add Link</span>
                    </button>
                  </div>
                </div>

                <div className="max-w-xs">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={footerForm.quick_links_title || ''}
                    onChange={(e) => handleFooterChange('quick_links_title', e.target.value)}
                    placeholder="QUICK LINKS"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-bold"
                  />
                </div>

                {/* Quick Links List */}
                <div className="space-y-2.5">
                  {(footerForm.quick_links || []).map((link, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 bg-gray-50/70 hover:bg-white transition-all"
                    >
                      <span className="w-6 text-center text-xs font-mono font-bold text-gray-400">
                        {idx + 1}
                      </span>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={link.label || ''}
                          onChange={(e) => handleQuickLinkChange(idx, 'label', e.target.value)}
                          placeholder="Link Text (e.g. Services)"
                          className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                        />
                        <input
                          type="text"
                          value={link.url || ''}
                          onChange={(e) => handleQuickLinkChange(idx, 'url', e.target.value)}
                          placeholder="URL (e.g. /services)"
                          className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white font-mono"
                        />
                      </div>

                      {/* Reorder & Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveQuickLink(idx, -1)}
                          className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === (footerForm.quick_links || []).length - 1}
                          onClick={() => handleMoveQuickLink(idx, 1)}
                          className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuickLink(idx)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Link"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. COLUMN 3: OUR BRANCHES */}
              <div className="pt-6 border-t border-gray-100 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                    <span className="w-1.5 h-3.5 bg-rose-600 rounded-full" />
                    <span>Column 3: Our Branches</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetBranches}
                      className="px-2.5 py-1 text-[11px] font-semibold text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw size={12} />
                      <span>Reset Branches</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddBranch}
                      className="px-3 py-1 text-xs font-bold text-white bg-[#800038] hover:bg-[#990044] rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                    >
                      <Plus size={13} />
                      <span>Add Branch</span>
                    </button>
                  </div>
                </div>

                <div className="max-w-xs">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={footerForm.branches_title || ''}
                    onChange={(e) => handleFooterChange('branches_title', e.target.value)}
                    placeholder="OUR BRANCHES"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-bold"
                  />
                </div>

                {/* Branches List */}
                <div className="space-y-3">
                  {(footerForm.branches || []).map((branch, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-gray-200 bg-gray-50/70 hover:bg-white transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-600">Branch #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBranch(idx)}
                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Delete Branch"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Name</label>
                          <input
                            type="text"
                            value={branch.name || ''}
                            onChange={(e) => handleBranchChange(idx, 'name', e.target.value)}
                            placeholder="Mirpur Branch"
                            className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Address / Subtitle</label>
                          <input
                            type="text"
                            value={branch.address || ''}
                            onChange={(e) => handleBranchChange(idx, 'address', e.target.value)}
                            placeholder="Shewrapara, Rokeya Sarani"
                            className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Page URL</label>
                          <input
                            type="text"
                            value={branch.url || ''}
                            onChange={(e) => handleBranchChange(idx, 'url', e.target.value)}
                            placeholder="/branch/mirpur"
                            className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. COLUMN 4: EMERGENCY & SUPPORT */}
              <div className="pt-6 border-t border-gray-100 space-y-4">
                <div className="flex items-center gap-2 text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                  <span className="w-1.5 h-3.5 bg-rose-600 rounded-full" />
                  <span>Column 4: Emergency &amp; Support Contact</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Section Title</label>
                    <input
                      type="text"
                      value={footerForm.support_title || ''}
                      onChange={(e) => handleFooterChange('support_title', e.target.value)}
                      placeholder="EMERGENCY & SUPPORT"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Subtext / Helper Prompt</label>
                    <input
                      type="text"
                      value={footerForm.support_subtext || ''}
                      onChange={(e) => handleFooterChange('support_subtext', e.target.value)}
                      placeholder="Need urgent assistance or want to schedule a dental checkup? Reach out directly:"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Hotline Phone</label>
                    <input
                      type="text"
                      value={footerForm.hotline || ''}
                      onChange={(e) => handleFooterChange('hotline', e.target.value)}
                      placeholder="01400786162"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-bold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      value={footerForm.whatsapp || ''}
                      onChange={(e) => handleFooterChange('whatsapp', e.target.value)}
                      placeholder="+8801400786162"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp Button Text</label>
                    <input
                      type="text"
                      value={footerForm.whatsapp_label || ''}
                      onChange={(e) => handleFooterChange('whatsapp_label', e.target.value)}
                      placeholder="WhatsApp Direct Help"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={footerForm.email || ''}
                    onChange={(e) => handleFooterChange('email', e.target.value)}
                    placeholder="info@techdentalcare.com"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* 5. TOP CTA RIBBON */}
              <div className="pt-6 border-t border-gray-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-[#800038]" />
                      Top CTA Callout Banner (Above Footer)
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Prompts visitors across pages to book an appointment or call the hotline
                    </p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                    <input
                      type="checkbox"
                      checked={footerForm.show_cta_strip ?? true}
                      onChange={(e) => handleFooterChange('show_cta_strip', e.target.checked)}
                      className="rounded text-[#800038] focus:ring-[#800038]"
                    />
                    <span>Show Banner</span>
                  </label>
                </div>

                {footerForm.show_cta_strip && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 animate-in fade-in">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Banner Badge Text</label>
                      <input
                        type="text"
                        value={footerForm.cta_badge || ''}
                        onChange={(e) => handleFooterChange('cta_badge', e.target.value)}
                        placeholder="Painless Clinical Dentistry in Dhaka"
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">CTA Headline</label>
                      <input
                        type="text"
                        value={footerForm.cta_title || ''}
                        onChange={(e) => handleFooterChange('cta_title', e.target.value)}
                        placeholder="Ready to Restore Your Healthy Smile?"
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white font-bold"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">CTA Subtext</label>
                      <input
                        type="text"
                        value={footerForm.cta_subtext || ''}
                        onChange={(e) => handleFooterChange('cta_subtext', e.target.value)}
                        placeholder="Consult with our specialist oral surgeons across Mirpur, Uttara, Badda, and Jatrabari branches."
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">CTA Button Text</label>
                      <input
                        type="text"
                        value={footerForm.cta_button_text || ''}
                        onChange={(e) => handleFooterChange('cta_button_text', e.target.value)}
                        placeholder="Make Appointment"
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">CTA Button Target URL</label>
                      <input
                        type="text"
                        value={footerForm.cta_button_url || ''}
                        onChange={(e) => handleFooterChange('cta_button_url', e.target.value)}
                        placeholder="/appointment"
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 6. BOTTOM BAR: COPYRIGHT & LEGAL/SOCIAL LINKS */}
              <div className="pt-6 border-t border-gray-100 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                    <span className="w-1.5 h-3.5 bg-slate-800 rounded-full" />
                    <span>Bottom Legal &amp; Copyright Bar</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddBottomLink}
                    className="px-3 py-1 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus size={13} />
                    <span>Add Bottom Link</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Copyright Line</label>
                  <input
                    type="text"
                    value={footerForm.copyright || ''}
                    onChange={(e) => handleFooterChange('copyright', e.target.value)}
                    placeholder={`© ${new Date().getFullYear()} Tech Dental Care Center. All rights reserved.`}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-medium"
                  />
                </div>

                {/* Bottom Links List */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700">Bottom Links (e.g. Facebook, Privacy Policy, Terms)</label>
                  {(footerForm.bottom_links || []).map((link, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 bg-gray-50/70"
                    >
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={link.label || ''}
                          onChange={(e) => handleBottomLinkChange(idx, 'label', e.target.value)}
                          placeholder="Label (e.g. Privacy Policy)"
                          className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white font-medium"
                        />
                        <input
                          type="text"
                          value={link.url || ''}
                          onChange={(e) => handleBottomLinkChange(idx, 'url', e.target.value)}
                          placeholder="URL (e.g. /privacy-policy or https://...)"
                          className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white font-mono"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveBottomLink(idx)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Link"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button - Static at the bottom */}
        <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-4.5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <AlertCircle size={15} className="text-amber-500 shrink-0" />
            <span>Changes will immediately take effect on all public website pages.</span>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#800038] hover:bg-[#990044] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving Changes...' : 'Save Header & Footer Settings'}</span>
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

