import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
  Shield,
  ListChecks,
  Settings as SettingsIcon,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  CheckCircle,
  X,
  Save,
  Globe
} from 'lucide-react';

interface RightItem {
  id: number;
  text_en: string;
  text_bn?: string | null;
  order: number;
  is_active: boolean;
}

interface ResponsibilityItem {
  id: number;
  title_en: string;
  title_bn?: string | null;
  text_en: string;
  text_bn?: string | null;
  order: number;
  is_active: boolean;
}

interface PageSettings {
  id?: number;
  hero_title_en?: string | null;
  hero_title_bn?: string | null;
  hero_desc_en?: string | null;
  hero_desc_bn?: string | null;
  partnership_title_en?: string | null;
  partnership_title_bn?: string | null;
  partnership_text_en?: string | null;
  partnership_text_bn?: string | null;
  author_name_en?: string | null;
  author_name_bn?: string | null;
  author_bio_en?: string | null;
  author_bio_bn?: string | null;
  author_image?: string | null;
  meta_title_en?: string | null;
  meta_title_bn?: string | null;
  meta_desc_en?: string | null;
  meta_desc_bn?: string | null;
}

interface Props {
  settings: PageSettings;
  rights: RightItem[];
  responsibilities: ResponsibilityItem[];
}

export default function PatientRightsAdminIndex({
  settings: initialSettings,
  rights = [],
  responsibilities = [],
}: Props) {
  const [activeTab, setActiveTab] = useState<'rights' | 'responsibilities' | 'settings'>('rights');
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<PageSettings>(initialSettings || {});

  // Right Modal State
  const [rightModalOpen, setRightModalOpen] = useState(false);
  const [editingRight, setEditingRight] = useState<RightItem | null>(null);
  const [rightForm, setRightForm] = useState<{
    text_en: string;
    text_bn: string;
    order: number;
    is_active: boolean;
  }>({
    text_en: '',
    text_bn: '',
    order: rights.length + 1,
    is_active: true,
  });

  // Responsibility Modal State
  const [respModalOpen, setRespModalOpen] = useState(false);
  const [editingResp, setEditingResp] = useState<ResponsibilityItem | null>(null);
  const [respForm, setRespForm] = useState<{
    title_en: string;
    title_bn: string;
    text_en: string;
    text_bn: string;
    order: number;
    is_active: boolean;
  }>({
    title_en: '',
    title_bn: '',
    text_en: '',
    text_bn: '',
    order: responsibilities.length + 1,
    is_active: true,
  });

  const triggerFeedback = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  // --- Right Handlers ---
  const openAddRight = () => {
    setEditingRight(null);
    setRightForm({
      text_en: '',
      text_bn: '',
      order: rights.length + 1,
      is_active: true,
    });
    setRightModalOpen(true);
  };

  const openEditRight = (item: RightItem) => {
    setEditingRight(item);
    setRightForm({
      text_en: item.text_en || '',
      text_bn: item.text_bn || '',
      order: item.order ?? 0,
      is_active: Boolean(item.is_active),
    });
    setRightModalOpen(true);
  };

  const handleSaveRight = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRight) {
      router.put(route('patient-rights.admin.rights.update', editingRight.id), rightForm, {
        onSuccess: () => {
          setRightModalOpen(false);
          triggerFeedback('Patient Right updated successfully!');
        },
      });
    } else {
      router.post(route('patient-rights.admin.rights.store'), rightForm, {
        onSuccess: () => {
          setRightModalOpen(false);
          triggerFeedback('Patient Right added successfully!');
        },
      });
    }
  };

  const handleDeleteRight = (id: number) => {
    if (!confirm('Are you sure you want to delete this right?')) return;
    router.delete(route('patient-rights.admin.rights.destroy', id), {
      onSuccess: () => triggerFeedback('Right deleted successfully!'),
    });
  };

  // --- Responsibility Handlers ---
  const openAddResp = () => {
    setEditingResp(null);
    setRespForm({
      title_en: '',
      title_bn: '',
      text_en: '',
      text_bn: '',
      order: responsibilities.length + 1,
      is_active: true,
    });
    setRespModalOpen(true);
  };

  const openEditResp = (item: ResponsibilityItem) => {
    setEditingResp(item);
    setRespForm({
      title_en: item.title_en || '',
      title_bn: item.title_bn || '',
      text_en: item.text_en || '',
      text_bn: item.text_bn || '',
      order: item.order ?? 0,
      is_active: Boolean(item.is_active),
    });
    setRespModalOpen(true);
  };

  const handleSaveResp = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingResp) {
      router.put(route('patient-rights.admin.responsibilities.update', editingResp.id), respForm, {
        onSuccess: () => {
          setRespModalOpen(false);
          triggerFeedback('Responsibility updated successfully!');
        },
      });
    } else {
      router.post(route('patient-rights.admin.responsibilities.store'), respForm, {
        onSuccess: () => {
          setRespModalOpen(false);
          triggerFeedback('Responsibility added successfully!');
        },
      });
    }
  };

  const handleDeleteResp = (id: number) => {
    if (!confirm('Are you sure you want to delete this responsibility?')) return;
    router.delete(route('patient-rights.admin.responsibilities.destroy', id), {
      onSuccess: () => triggerFeedback('Responsibility deleted successfully!'),
    });
  };

  // --- Settings Handler ---
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    router.post(route('patient-rights.admin.settings'), settingsForm, {
      onSuccess: () => triggerFeedback('Settings & Page content saved successfully!'),
    });
  };

  return (
    <AdminLayout>
      <Head title="Patient Rights CMS - Tech Dental" />

      {/* Top Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-800 text-white flex items-center justify-center font-bold shadow-md shadow-sky-600/20">
            <Shield size={20} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Patient Rights & Responsibilities</h1>
            <p className="text-xs text-gray-500">Manage patient rights, responsibilities, and bilingual texts (English & Bangla)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/patient-rights"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-xs"
          >
            <ExternalLink size={14} />
            View Live (English)
          </a>
          <a
            href="/bn/patient-rights"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-xl hover:bg-sky-100 transition shadow-xs"
          >
            <Globe size={14} />
            লাইভ দেখুন (বাংলা)
          </a>
        </div>
      </div>

      {/* Flash Success Notification */}
      {saveSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm shadow-xs animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-xl px-4 pt-3 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('rights')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'rights'
              ? 'border-sky-600 text-sky-600 bg-sky-50/50 rounded-t-lg'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Shield size={16} />
          Patient Rights ({rights.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('responsibilities')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'responsibilities'
              ? 'border-sky-600 text-sky-600 bg-sky-50/50 rounded-t-lg'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <ListChecks size={16} />
          Responsibilities ({responsibilities.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'settings'
              ? 'border-sky-600 text-sky-600 bg-sky-50/50 rounded-t-lg'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <SettingsIcon size={16} />
          Page & Author Settings
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: PATIENT RIGHTS */}
      {/* ============================================================ */}
      {activeTab === 'rights' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200">
            <div>
              <h2 className="text-base font-bold text-gray-900">Patient Rights List</h2>
              <p className="text-xs text-gray-500">Each item supports English and Bengali text.</p>
            </div>
            <button
              type="button"
              onClick={openAddRight}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition shadow-xs"
            >
              <Plus size={16} />
              Add Right
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-gray-100">
              {rights.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No patient rights created yet. Click "Add Right" to get started.
                </div>
              ) : (
                rights.map((item, index) => (
                  <div key={item.id} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-gray-50/80 transition">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center">
                        {item.order || index + 1}
                      </span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">EN</span>
                          <p className="text-sm font-medium text-gray-900">{item.text_en}</p>
                        </div>
                        {item.text_bn && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-100 text-sky-800">BN</span>
                            <p className="text-sm text-gray-600">{item.text_bn}</p>
                          </div>
                        )}
                        {!item.is_active && (
                          <span className="inline-block text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded mt-1">
                            Inactive (Hidden)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditRight(item)}
                        className="p-1.5 text-gray-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                        title="Edit Right"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRight(item.id)}
                        className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Right"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: PATIENT RESPONSIBILITIES */}
      {/* ============================================================ */}
      {activeTab === 'responsibilities' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200">
            <div>
              <h2 className="text-base font-bold text-gray-900">Patient Responsibilities List</h2>
              <p className="text-xs text-gray-500">Each item includes English and Bengali title & description.</p>
            </div>
            <button
              type="button"
              onClick={openAddResp}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition shadow-xs"
            >
              <Plus size={16} />
              Add Responsibility
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-gray-100">
              {responsibilities.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No responsibilities created yet. Click "Add Responsibility" to get started.
                </div>
              ) : (
                responsibilities.map((item, index) => (
                  <div key={item.id} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-gray-50/80 transition">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                        {item.order || index + 1}
                      </span>
                      <div className="space-y-2">
                        {/* English */}
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">EN</span>
                            <h4 className="text-sm font-bold text-gray-900">{item.title_en}</h4>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 ml-8">{item.text_en}</p>
                        </div>

                        {/* Bengali */}
                        {(item.title_bn || item.text_bn) && (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">BN</span>
                              <h4 className="text-sm font-bold text-gray-800">{item.title_bn || item.title_en}</h4>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 ml-8">{item.text_bn}</p>
                          </div>
                        )}

                        {!item.is_active && (
                          <span className="inline-block text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                            Inactive (Hidden)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditResp(item)}
                        className="p-1.5 text-gray-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                        title="Edit Responsibility"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteResp(item.id)}
                        className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Responsibility"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: PAGE & AUTHOR SETTINGS */}
      {/* ============================================================ */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Hero Banner Settings */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Hero Banner</h3>
              <p className="text-xs text-gray-500">Customize the top headline and intro description for English & Bangla.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Hero Title (English)
                </label>
                <input
                  type="text"
                  value={settingsForm.hero_title_en || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, hero_title_en: e.target.value })}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                  হিরো শিরোনাম (বাংলা)
                </label>
                <input
                  type="text"
                  value={settingsForm.hero_title_bn || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, hero_title_bn: e.target.value })}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Hero Description (English)
                </label>
                <textarea
                  rows={3}
                  value={settingsForm.hero_desc_en || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, hero_desc_en: e.target.value })}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                  হিরো বিবরণ (বাংলা)
                </label>
                <textarea
                  rows={3}
                  value={settingsForm.hero_desc_bn || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, hero_desc_bn: e.target.value })}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Partnership Box Settings */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Partnership Box</h3>
              <p className="text-xs text-gray-500">Text displayed in the callout box under patient responsibilities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Partnership Title (English)
                </label>
                <input
                  type="text"
                  value={settingsForm.partnership_title_en || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, partnership_title_en: e.target.value })}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                  পার্টনারশিপ শিরোনাম (বাংলা)
                </label>
                <input
                  type="text"
                  value={settingsForm.partnership_title_bn || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, partnership_title_bn: e.target.value })}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Partnership Text (English)
                </label>
                <textarea
                  rows={3}
                  value={settingsForm.partnership_text_en || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, partnership_text_en: e.target.value })}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                  পার্টনারশিপ বিবরণ (বাংলা)
                </label>
                <textarea
                  rows={3}
                  value={settingsForm.partnership_text_bn || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, partnership_text_bn: e.target.value })}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Author Profile Settings */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Author & Practice Profile</h3>
              <p className="text-xs text-gray-500">Bottom section introducing Tech Dental practice.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Author Name (English)
                </label>
                <input
                  type="text"
                  value={settingsForm.author_name_en || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, author_name_en: e.target.value })}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                  লেখকের নাম (বাংলা)
                </label>
                <input
                  type="text"
                  value={settingsForm.author_name_bn || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, author_name_bn: e.target.value })}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Author Bio (English)
                </label>
                <textarea
                  rows={3}
                  value={settingsForm.author_bio_en || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, author_bio_en: e.target.value })}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                  লেখক পরিচিতি (বাংলা)
                </label>
                <textarea
                  rows={3}
                  value={settingsForm.author_bio_bn || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, author_bio_bn: e.target.value })}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Author / Practice Image URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://... or leave empty for default doctor icon"
                  value={settingsForm.author_image || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, author_image: e.target.value })}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* SEO Meta Box */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">SEO & Metadata</h3>
              <p className="text-xs text-gray-500">Page title and description for search engines.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Meta Title (English)
                </label>
                <input
                  type="text"
                  value={settingsForm.meta_title_en || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, meta_title_en: e.target.value })}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                  মেটা শিরোনাম (বাংলা)
                </label>
                <input
                  type="text"
                  value={settingsForm.meta_title_bn || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, meta_title_bn: e.target.value })}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Meta Description (English)
                </label>
                <textarea
                  rows={2}
                  value={settingsForm.meta_desc_en || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, meta_desc_en: e.target.value })}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                  মেটা বিবরণ (বাংলা)
                </label>
                <textarea
                  rows={2}
                  value={settingsForm.meta_desc_bn || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, meta_desc_bn: e.target.value })}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-xl shadow-md transition"
            >
              <Save size={16} />
              Save Settings
            </button>
          </div>
        </form>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD / EDIT RIGHT */}
      {/* ============================================================ */}
      {rightModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">
                {editingRight ? 'Edit Patient Right' : 'Add New Patient Right'}
              </h3>
              <button
                type="button"
                onClick={() => setRightModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveRight} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Right Description (English) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Receive considerate and respectful care..."
                  value={rightForm.text_en}
                  onChange={(e) => setRightForm({ ...rightForm, text_en: e.target.value })}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                  অধিকারের বিবরণ (বাংলা)
                </label>
                <textarea
                  rows={3}
                  placeholder="যেমন: সমবেদনা ও শ্রদ্ধাশীল সেবা পাওয়ার অধিকার..."
                  value={rightForm.text_bn}
                  onChange={(e) => setRightForm({ ...rightForm, text_bn: e.target.value })}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={rightForm.order}
                    onChange={(e) => setRightForm({ ...rightForm, order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center cursor-pointer gap-2">
                    <input
                      type="checkbox"
                      checked={rightForm.is_active}
                      onChange={(e) => setRightForm({ ...rightForm, is_active: e.target.checked })}
                      className="rounded border-gray-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">Active (Visible)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setRightModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition shadow-xs"
                >
                  {editingRight ? 'Update Right' : 'Add Right'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD / EDIT RESPONSIBILITY */}
      {/* ============================================================ */}
      {respModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">
                {editingResp ? 'Edit Responsibility' : 'Add New Responsibility'}
              </h3>
              <button
                type="button"
                onClick={() => setRespModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveResp} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Title (English) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Provide accurate info"
                    value={respForm.title_en}
                    onChange={(e) => setRespForm({ ...respForm, title_en: e.target.value })}
                    className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                    শিরোনাম (বাংলা)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: সঠিক তথ্য প্রদান করুন"
                    value={respForm.title_bn}
                    onChange={(e) => setRespForm({ ...respForm, title_bn: e.target.value })}
                    className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Description (English) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Give complete and honest information about your health history..."
                  value={respForm.text_en}
                  onChange={(e) => setRespForm({ ...respForm, text_en: e.target.value })}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                  বিবরণ (বাংলা)
                </label>
                <textarea
                  rows={2}
                  placeholder="যেমন: আপনার পূর্বের স্বাস্থ্য ইতিহাস সম্পর্কে সম্পূর্ণ ও সত্য তথ্য দিন..."
                  value={respForm.text_bn}
                  onChange={(e) => setRespForm({ ...respForm, text_bn: e.target.value })}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={respForm.order}
                    onChange={(e) => setRespForm({ ...respForm, order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full text-sm border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center cursor-pointer gap-2">
                    <input
                      type="checkbox"
                      checked={respForm.is_active}
                      onChange={(e) => setRespForm({ ...respForm, is_active: e.target.checked })}
                      className="rounded border-gray-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">Active (Visible)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setRespModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition shadow-xs"
                >
                  {editingResp ? 'Update Responsibility' : 'Add Responsibility'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

