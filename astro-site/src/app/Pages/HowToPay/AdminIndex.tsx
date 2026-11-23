import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MediaImagePicker from '@/components/ImagePicker/MediaImagePicker';
import {
  CreditCard,
  Building2,
  Settings as SettingsIcon,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  CheckCircle,
  X,
  Save,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  HelpCircle,
  Phone,
  Clock,
  MapPin,
} from 'lucide-react';

interface MethodItem {
  id: string;
  name: string;
  badge?: string;
  color?: string;
  image?: string;
  steps?: string[];
  sort_order?: number;
  is_active?: boolean;
}

interface BranchItem {
  id: string;
  name: string;
  fullName?: string;
  addr?: string;
  hours?: string;
  phone?: string;
  has?: Record<string, number>;
  acct?: Record<string, string>;
}

interface PageSettings {
  id?: number;
  tagline?: string;
  title_main?: string;
  title_highlight?: string;
  lead_text?: string;
  branches_section_title?: string;
  branches_section_sub?: string;
  matrix_section_title?: string;
  matrix_section_sub?: string;
  notice_text?: string;
  seo_title?: string;
  meta_desc?: string;
  methods_data?: MethodItem[];
  branches_data?: BranchItem[];
}

interface Props {
  settings: PageSettings;
  locations?: any[];
}

const PRESET_COLORS = [
  { label: 'Green', value: '#2e7d57' },
  { label: 'Blue', value: '#3a5ba0' },
  { label: 'Teal', value: '#0b7a75' },
  { label: 'bKash Pink', value: '#e2136e' },
  { label: 'Nagad Orange', value: '#f26a21' },
  { label: 'Rocket Purple', value: '#8c3494' },
  { label: 'Dark Slate', value: '#1e293b' },
  { label: 'Rose Red', value: '#be123c' },
];

export default function HowToPayAdminIndex({ settings, locations = [] }: Props) {
  const [activeTab, setActiveTab] = useState<'methods' | 'branches' | 'content'>('methods');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // -------------------------------------------------------------
  // TAB 1: METHODS STATE & MODAL
  // -------------------------------------------------------------
  const [methods, setMethods] = useState<MethodItem[]>(() => {
    if (settings?.methods_data && Array.isArray(settings.methods_data) && settings.methods_data.length > 0) {
      return settings.methods_data;
    }
    return [
      { id: 'cash', name: 'Cash', badge: '৳', color: '#2e7d57', image: '', steps: ['Pay at the billing counter', 'Collect your printed receipt'], is_active: true },
      { id: 'pos', name: 'Card (POS)', badge: 'POS', color: '#3a5ba0', image: '', steps: ['Tell the counter you will pay by card', 'Tap, insert or swipe your debit/credit card', 'Enter PIN if asked and keep the slip'], is_active: true },
      { id: 'qr', name: 'Bangla QR', badge: 'QR', color: '#0b7a75', image: '', steps: ['Open any bank or wallet app with QR pay', 'Scan the Bangla QR at the counter', 'Enter the bill amount and confirm', 'Show the success screen to staff'], is_active: true },
      { id: 'bkash', name: 'bKash', badge: 'bK', color: '#e2136e', image: '', steps: ['Open the bKash app and tap Payment', 'Scan the QR or enter the merchant number', 'Enter the bill amount and your PIN', 'Show the confirmation to staff'], is_active: true },
      { id: 'nagad', name: 'Nagad', badge: 'Ng', color: '#f26a21', image: '', steps: ['Open the Nagad app and tap Merchant Pay', 'Scan the QR or enter the merchant number', 'Enter the bill amount and your PIN', 'Show the confirmation to staff'], is_active: true },
      { id: 'rocket', name: 'Rocket', badge: 'Rk', color: '#8c3494', image: '', steps: ['Dial *322# or open the Rocket app', 'Choose Payment and enter the merchant number', 'Enter the amount and your PIN', 'Show the confirmation to staff'], is_active: true },
    ];
  });

  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);
  const [editingMethodIndex, setEditingMethodIndex] = useState<number | null>(null);
  const [methodForm, setMethodForm] = useState<MethodItem>({
    id: '',
    name: '',
    badge: '',
    color: '#3a5ba0',
    image: '',
    steps: [''],
    is_active: true,
  });

  const openAddMethodModal = () => {
    setEditingMethodIndex(null);
    setMethodForm({
      id: `method_${Date.now()}`,
      name: '',
      badge: '',
      color: '#3a5ba0',
      image: '',
      steps: [''],
      is_active: true,
    });
    setIsMethodModalOpen(true);
  };

  const openEditMethodModal = (m: MethodItem, idx: number) => {
    setEditingMethodIndex(idx);
    setMethodForm({
      id: m.id,
      name: m.name,
      badge: m.badge || '',
      color: m.color || '#3a5ba0',
      image: m.image || '',
      steps: m.steps && m.steps.length > 0 ? [...m.steps] : [''],
      is_active: m.is_active !== false,
    });
    setIsMethodModalOpen(true);
  };

  const handleSaveMethodInModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!methodForm.name.trim()) {
      alert('Please enter a payment method name.');
      return;
    }

    const cleanSteps = methodForm.steps ? methodForm.steps.filter((s) => s.trim().length > 0) : [];

    const updated = [...methods];
    if (editingMethodIndex !== null) {
      updated[editingMethodIndex] = {
        ...methodForm,
        steps: cleanSteps.length > 0 ? cleanSteps : ['Follow standard payment instructions at billing counter.'],
      };
    } else {
      updated.push({
        ...methodForm,
        id: methodForm.id || methodForm.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        steps: cleanSteps.length > 0 ? cleanSteps : ['Follow standard payment instructions at billing counter.'],
      });
    }

    setMethods(updated);
    setIsMethodModalOpen(false);

    // Save to backend
    saveMethodsToBackend(updated);
  };

  const deleteMethod = (idx: number) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;
    const updated = methods.filter((_, i) => i !== idx);
    setMethods(updated);
    saveMethodsToBackend(updated);
  };

  const moveMethod = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= methods.length) return;
    const updated = [...methods];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setMethods(updated);
    saveMethodsToBackend(updated);
  };

  const saveMethodsToBackend = (methodsList: MethodItem[]) => {
    router.post(
      route('how-to-pay.admin.methods'),
      { methods: methodsList },
      {
        preserveScroll: true,
        onSuccess: () => showNotification('Payment methods & icons saved successfully!'),
      }
    );
  };

  // -------------------------------------------------------------
  // TAB 2: BRANCHES & ACCOUNTS STATE
  // -------------------------------------------------------------
  const [branches, setBranches] = useState<BranchItem[]>(() => {
    if (settings?.branches_data && Array.isArray(settings.branches_data) && settings.branches_data.length > 0) {
      return settings.branches_data;
    }
    return [
      {
        id: 'mirpur',
        name: 'Mirpur',
        fullName: 'Mirpur Branch',
        addr: '827 (2nd Floor), Shewrapara, Begum Rokeya Sarani, Mirpur, Dhaka-1216 (Metro Rail Pillar 318)',
        hours: 'Sat – Thu 10:00 am – 9:00 pm (Friday Closed)',
        phone: '09638-000505',
        has: { cash: 1, pos: 1, qr: 1, bkash: 1, nagad: 1, rocket: 1 },
        acct: { bkash: '01400786162', nagad: '01400786162', rocket: '01400786162-8' },
      },
      {
        id: 'uttara',
        name: 'Uttara',
        fullName: 'Uttara Branch',
        addr: 'House 18, Road 14, Sector 3, Uttara, Dhaka-1230',
        hours: 'Sat – Thu 10:00 am – 9:00 pm (Friday Closed)',
        phone: '09638-000505',
        has: { cash: 1, pos: 1, qr: 1, bkash: 1, nagad: 1, rocket: 0 },
        acct: { bkash: '01400786162', nagad: '01400786162' },
      },
      {
        id: 'badda',
        name: 'Badda',
        fullName: 'Badda Branch',
        addr: 'Haji Abdur Rashid Mansion (3rd Floor), North Badda Bazar, Dhaka-1212',
        hours: 'Sat – Thu 10:00 am – 9:00 pm (Friday Closed)',
        phone: '09638-000505',
        has: { cash: 1, pos: 1, qr: 1, bkash: 1, nagad: 1, rocket: 0 },
        acct: { bkash: '01400786162', nagad: '01400786162' },
      },
      {
        id: 'jatrabari',
        name: 'Jatrabari',
        fullName: 'Jatrabari Branch',
        addr: 'Shahid Faruk Road, South Jatrabari, Dhaka-1204',
        hours: 'Sat – Thu 10:00 am – 9:00 pm (Friday Closed)',
        phone: '09638-000505',
        has: { cash: 1, pos: 1, qr: 1, bkash: 1, nagad: 0, rocket: 0 },
        acct: { bkash: '01400786162' },
      },
    ];
  });

  const [selectedBranchIndex, setSelectedBranchIndex] = useState<number>(0);

  const toggleBranchMethod = (branchIdx: number, methodId: string) => {
    const updated = [...branches];
    const b = { ...updated[branchIdx] };
    const currentHas = { ...(b.has || {}) };
    currentHas[methodId] = currentHas[methodId] ? 0 : 1;
    b.has = currentHas;
    updated[branchIdx] = b;
    setBranches(updated);
  };

  const handleBranchAccountChange = (branchIdx: number, methodId: string, val: string) => {
    const updated = [...branches];
    const b = { ...updated[branchIdx] };
    const currentAcct = { ...(b.acct || {}) };
    currentAcct[methodId] = val;
    b.acct = currentAcct;
    updated[branchIdx] = b;
    setBranches(updated);
  };

  const handleBranchMetaChange = (branchIdx: number, field: 'name' | 'addr' | 'hours' | 'phone', val: string) => {
    const updated = [...branches];
    const b = { ...updated[branchIdx], [field]: val };
    updated[branchIdx] = b;
    setBranches(updated);
  };

  const handleSaveBranches = (e: React.FormEvent) => {
    e.preventDefault();
    router.post(
      route('how-to-pay.admin.branches'),
      { branches },
      {
        preserveScroll: true,
        onSuccess: () => showNotification('Branch availability & accounts matrix saved successfully!'),
      }
    );
  };

  // -------------------------------------------------------------
  // TAB 3: PAGE CONTENT & SEO STATE
  // -------------------------------------------------------------
  const [contentForm, setContentForm] = useState({
    tagline: settings?.tagline || 'Payment methods by branch',
    title_main: settings?.title_main || 'How to pay',
    title_highlight: settings?.title_highlight || 'at our clinic',
    lead_text: settings?.lead_text || 'Choose your branch to see exactly which payment methods work there.',
    branches_section_title: settings?.branches_section_title || 'Select your branch',
    branches_section_sub: settings?.branches_section_sub || 'Payment options differ from branch to branch.',
    matrix_section_title: settings?.matrix_section_title || 'All branches at a glance',
    matrix_section_sub: settings?.matrix_section_sub || 'Tap a branch name to jump to its details.',
    notice_text:
      settings?.notice_text ||
      'Always keep your payment receipt or transaction ID. For mobile payments, show the success message at the counter before you leave. Need help? Ask the front desk at any branch.',
    seo_title: settings?.seo_title || 'How to Pay | Payment Methods by Branch | Tech Dental Care',
    meta_desc:
      settings?.meta_desc ||
      'Choose your branch to see accepted payment methods at Tech Dental Care: Cash, POS Debit/Credit Card, Bangla QR, bKash, Nagad, and Rocket.',
  });

  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    router.post(route('how-to-pay.admin.settings'), contentForm, {
      preserveScroll: true,
      onSuccess: () => showNotification('Page content, headlines & SEO saved successfully!'),
    });
  };

  return (
    <AdminLayout>
      <Head title="How to Pay CMS - Payment Methods & Branch Settings" />

      <div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-rose-50 text-rose-700 rounded-xl">
                <CreditCard size={22} />
              </span>
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
                How to Pay / Payment Methods CMS
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Manage payment methods, upload custom logo icons, set branch merchant numbers &amp; edit page content.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/how-to-pay"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
            >
              <ExternalLink size={15} />
              <span>View Public Page</span>
            </a>
          </div>
        </div>

        {/* Notification Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle size={17} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('methods')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'methods'
                ? 'bg-rose-900 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <CreditCard size={15} />
            <span>Payment Methods &amp; Icons ({methods.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('branches')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'branches'
                ? 'bg-rose-900 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Building2 size={15} />
            <span>Branch Availability &amp; Accounts ({branches.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'content'
                ? 'bg-rose-900 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <SettingsIcon size={15} />
            <span>Page Headlines &amp; Notice</span>
          </button>
        </div>

        {/* ============================================================= */}
        {/* TAB 1: PAYMENT METHODS & CUSTOM ICON UPLOAD                   */}
        {/* ============================================================= */}
        {activeTab === 'methods' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
              <div>
                <h3 className="font-bold text-sm text-gray-800">Accepted Payment Methods</h3>
                <p className="text-xs text-gray-500">
                  Upload custom logo images (e.g. bKash, Nagad, Visa) or customize badge colors and instructions.
                </p>
              </div>
              <button
                type="button"
                onClick={openAddMethodModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
              >
                <Plus size={15} />
                <span>Add Payment Method</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {methods.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Custom Image Icon or Text Badge */}
                        <div
                          className={`w-12 h-12 rounded-xl grid place-items-center font-extrabold text-sm shrink-0 overflow-hidden shadow-2xs border aspect-square ${
                            m.image ? 'bg-white border-gray-200 p-1' : 'border-gray-100 text-white'
                          }`}
                          style={{ background: m.image ? '#ffffff' : (m.color || '#3a5ba0') }}
                        >
                          {m.image ? (
                            <img
                              src={m.image}
                              alt={m.name}
                              className="w-full h-full object-contain aspect-square select-none pointer-events-none"
                            />
                          ) : (
                            <span>{m.badge || m.name.substring(0, 2).toUpperCase()}</span>
                          )}
                        </div>

                        <div>
                          <h4 className="font-bold text-gray-900 text-base">{m.name}</h4>
                          <span
                            className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                              m.is_active !== false
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {m.is_active !== false ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                      </div>

                      {/* Reorder Buttons */}
                      <div className="flex items-center gap-1 text-gray-400">
                        <button
                          type="button"
                          onClick={() => moveMethod(idx, 'up')}
                          disabled={idx === 0}
                          title="Move Up"
                          className="p-1 hover:text-gray-700 disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveMethod(idx, 'down')}
                          disabled={idx === methods.length - 1}
                          title="Move Down"
                          className="p-1 hover:text-gray-700 disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </div>

                    {/* How to pay steps preview */}
                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs text-gray-600">
                      <span className="font-bold text-gray-700 block mb-1">Steps:</span>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {m.steps && m.steps.slice(0, 2).map((s, sIdx) => (
                          <li key={sIdx} className="truncate">{s}</li>
                        ))}
                        {m.steps && m.steps.length > 2 && (
                          <li className="text-gray-400 font-semibold italic">+{m.steps.length - 2} more steps...</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => openEditMethodModal(m, idx)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMethod(idx)}
                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 2: BRANCH AVAILABILITY & MERCHANT ACCOUNTS MATRIX          */}
        {/* ============================================================= */}
        {activeTab === 'branches' && (
          <form onSubmit={handleSaveBranches} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-bold text-base text-gray-900">Branch Payment Availability &amp; Accounts</h3>
                <p className="text-xs text-gray-500">
                  Enable or disable specific payment methods for each clinic branch and set their merchant number.
                </p>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Save size={15} />
                <span>Save Branch Settings</span>
              </button>
            </div>

            {/* Branch Selector Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-3">
              {branches.map((b, bIdx) => {
                const isSelected = bIdx === selectedBranchIndex;
                const activeMethodsCount = methods.filter((m) => b.has?.[m.id]).length;
                return (
                  <button
                    key={b.id || bIdx}
                    type="button"
                    onClick={() => setSelectedBranchIndex(bIdx)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-rose-800 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{b.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-rose-950 text-rose-200' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {activeMethodsCount} active
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Branch Matrix Details */}
            {branches[selectedBranchIndex] && (
              <div className="space-y-5">
                {/* Branch Meta Edit */}
                <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                      <Building2 size={13} className="text-gray-400" /> Branch Name
                    </label>
                    <input
                      type="text"
                      value={branches[selectedBranchIndex].name || ''}
                      onChange={(e) => handleBranchMetaChange(selectedBranchIndex, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                      <Phone size={13} className="text-gray-400" /> Contact Phone
                    </label>
                    <input
                      type="text"
                      value={branches[selectedBranchIndex].phone || ''}
                      onChange={(e) => handleBranchMetaChange(selectedBranchIndex, 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                      <Clock size={13} className="text-gray-400" /> Working Hours
                    </label>
                    <input
                      type="text"
                      value={branches[selectedBranchIndex].hours || ''}
                      onChange={(e) => handleBranchMetaChange(selectedBranchIndex, 'hours', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white font-medium"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                      <MapPin size={13} className="text-gray-400" /> Branch Address
                    </label>
                    <input
                      type="text"
                      value={branches[selectedBranchIndex].addr || ''}
                      onChange={(e) => handleBranchMetaChange(selectedBranchIndex, 'addr', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white font-medium"
                    />
                  </div>
                </div>

                {/* Methods Matrix Table for Active Branch */}
                <div>
                  <h4 className="font-bold text-sm text-gray-900 mb-3">
                    Payment Options for {branches[selectedBranchIndex].name} Branch
                  </h4>

                  <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3 px-4">Method</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4">Merchant / Account Number</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {methods.map((m) => {
                          const isEnabled = Boolean(branches[selectedBranchIndex].has?.[m.id]);
                          const accountNumber = branches[selectedBranchIndex].acct?.[m.id] || '';

                          return (
                            <tr
                              key={m.id}
                              className={`transition-colors ${
                                isEnabled ? 'bg-white hover:bg-slate-50/50' : 'bg-gray-50/60'
                              }`}
                            >
                              <td className="py-3.5 px-4 font-bold text-gray-900">
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className="w-7 h-7 rounded-lg grid place-items-center text-white font-black text-xs shrink-0 overflow-hidden"
                                    style={{ background: m.color || '#3a5ba0' }}
                                  >
                                    {m.image ? (
                                      <img src={m.image} alt={m.name} className="w-full h-full object-contain p-0.5 bg-white" />
                                    ) : (
                                      <span>{m.badge || m.name.charAt(0)}</span>
                                    )}
                                  </div>
                                  <span>{m.name}</span>
                                </div>
                              </td>

                              <td className="py-3.5 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => toggleBranchMethod(selectedBranchIndex, m.id)}
                                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer select-none inline-flex items-center gap-1 ${
                                    isEnabled
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : 'bg-gray-200 text-gray-600 border border-gray-300'
                                  }`}
                                >
                                  {isEnabled ? <CheckCircle size={12} /> : <X size={12} />}
                                  <span>{isEnabled ? 'Available' : 'Disabled'}</span>
                                </button>
                              </td>

                              <td className="py-3.5 px-4">
                                <input
                                  type="text"
                                  disabled={!isEnabled}
                                  value={accountNumber}
                                  onChange={(e) =>
                                    handleBranchAccountChange(selectedBranchIndex, m.id, e.target.value)
                                  }
                                  placeholder={isEnabled ? 'e.g. 01400786162 (Merchant)' : 'Disabled for this branch'}
                                  className={`w-full max-w-sm px-3 py-1.5 border rounded-lg text-xs font-mono transition ${
                                    isEnabled
                                      ? 'border-gray-300 bg-white text-gray-800'
                                      : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                  }`}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Save size={15} />
                <span>Save Branch Availability &amp; Accounts</span>
              </button>
            </div>
          </form>
        )}

        {/* ============================================================= */}
        {/* TAB 3: PAGE CONTENT, HEADINGS & SEO                           */}
        {/* ============================================================= */}
        {activeTab === 'content' && (
          <form onSubmit={handleSaveContent} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-bold text-base text-gray-900">Page Headlines &amp; Notice Configuration</h3>
                <p className="text-xs text-gray-500">Edit hero title, subtitle, section labels, and bottom advice text.</p>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Save size={15} />
                <span>Save Headlines &amp; Notice</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Top Tagline</label>
                <input
                  type="text"
                  value={contentForm.tagline}
                  onChange={(e) => setContentForm({ ...contentForm, tagline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Main Heading (Line 1)</label>
                <input
                  type="text"
                  value={contentForm.title_main}
                  onChange={(e) => setContentForm({ ...contentForm, title_main: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Heading Highlight (Line 2 in Pink)</label>
                <input
                  type="text"
                  value={contentForm.title_highlight}
                  onChange={(e) => setContentForm({ ...contentForm, title_highlight: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Branch Selector Title</label>
                <input
                  type="text"
                  value={contentForm.branches_section_title}
                  onChange={(e) => setContentForm({ ...contentForm, branches_section_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-gray-700 mb-1">Hero Subtitle / Lead Paragraph</label>
                <textarea
                  rows={2}
                  value={contentForm.lead_text}
                  onChange={(e) => setContentForm({ ...contentForm, lead_text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-gray-700 mb-1">
                  Good to Know Notice Box (Footer Callout)
                </label>
                <textarea
                  rows={3}
                  value={contentForm.notice_text}
                  onChange={(e) => setContentForm({ ...contentForm, notice_text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">SEO Title Tag</label>
                <input
                  type="text"
                  value={contentForm.seo_title}
                  onChange={(e) => setContentForm({ ...contentForm, seo_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">SEO Meta Description</label>
                <input
                  type="text"
                  value={contentForm.meta_desc}
                  onChange={(e) => setContentForm({ ...contentForm, meta_desc: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Save size={15} />
                <span>Save All Content</span>
              </button>
            </div>
          </form>
        )}

        {/* ============================================================= */}
        {/* MODAL: ADD / EDIT PAYMENT METHOD WITH IMAGE PICKER             */}
        {/* ============================================================= */}
        {isMethodModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 space-y-5 my-8">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} className="text-rose-700" />
                  <h3 className="font-extrabold text-base text-gray-900">
                    {editingMethodIndex !== null ? 'Edit Payment Method' : 'Add New Payment Method'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMethodModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveMethodInModal} className="space-y-4 text-xs">
                {/* Method Name */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Method Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. bKash, Card (POS), Bangla QR"
                    value={methodForm.name}
                    onChange={(e) => setMethodForm({ ...methodForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-bold"
                  />
                </div>

                {/* Badge Text & Color */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Fallback Badge Text</label>
                    <input
                      type="text"
                      placeholder="e.g. bK, POS, ৳"
                      value={methodForm.badge || ''}
                      onChange={(e) => setMethodForm({ ...methodForm, badge: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Badge Background Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={methodForm.color || '#3a5ba0'}
                        onChange={(e) => setMethodForm({ ...methodForm, color: e.target.value })}
                        className="w-9 h-9 p-0.5 border border-gray-300 rounded-lg cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={methodForm.color || ''}
                        onChange={(e) => setMethodForm({ ...methodForm, color: e.target.value })}
                        className="w-full px-2.5 py-2 border border-gray-300 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Color Presets */}
                <div>
                  <span className="text-[10px] text-gray-400 block mb-1">Quick color presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setMethodForm({ ...methodForm, color: c.value })}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-gray-200 text-[10px] font-semibold hover:bg-gray-50 cursor-pointer"
                      >
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.value }} />
                        <span>{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Icon / Logo Image Upload via MediaImagePicker */}
                <div className="border-t border-gray-100 pt-3">
                  <MediaImagePicker
                    label="Method Icon / Logo Image (Upload or Pick from Library)"
                    value={methodForm.image || ''}
                    onChange={(url) => setMethodForm({ ...methodForm, image: url })}
                    aspectRatio="1:1"
                    aspectHint="Square logo (e.g. 100x100 PNG / SVG with transparent background)"
                    placeholder="https://... or click Choose from Media"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    When an image is provided, it replaces the badge text on the public page.
                  </p>
                </div>

                {/* Step-by-Step Instructions */}
                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-gray-700">"How to Pay" Step-by-Step Instructions</label>
                    <button
                      type="button"
                      onClick={() =>
                        setMethodForm({ ...methodForm, steps: [...(methodForm.steps || []), ''] })
                      }
                      className="text-[11px] text-rose-700 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} /> Add Step
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {(methodForm.steps || []).map((st, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2">
                        <span className="w-5 text-gray-400 font-mono font-bold text-center shrink-0">
                          {sIdx + 1}.
                        </span>
                        <input
                          type="text"
                          value={st}
                          placeholder={`Step ${sIdx + 1} instruction...`}
                          onChange={(e) => {
                            const newSteps = [...(methodForm.steps || [])];
                            newSteps[sIdx] = e.target.value;
                            setMethodForm({ ...methodForm, steps: newSteps });
                          }}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                        />
                        {(methodForm.steps || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newSteps = (methodForm.steps || []).filter((_, i) => i !== sIdx);
                              setMethodForm({ ...methodForm, steps: newSteps });
                            }}
                            className="p-1 text-gray-400 hover:text-rose-600 cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Is Active Checkbox */}
                <div className="border-t border-gray-100 pt-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActiveMethod"
                    checked={methodForm.is_active !== false}
                    onChange={(e) => setMethodForm({ ...methodForm, is_active: e.target.checked })}
                    className="w-4 h-4 text-rose-700 rounded-sm focus:ring-rose-500 border-gray-300 cursor-pointer"
                  />
                  <label htmlFor="isActiveMethod" className="font-bold text-gray-700 cursor-pointer select-none">
                    Active (Show on public How to Pay page)
                  </label>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsMethodModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Save size={14} />
                    <span>Save Method</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

