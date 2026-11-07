import React, { useState, useRef, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { TopHeader } from '@/Components/TopHeader';
import { GlobalFooter } from '@/Components/GlobalFooter';

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
  locations?: any[];
  nav_menu?: any;
  home_content?: any;
  payment_settings?: PageSettings;
  initial_branch?: string;
  canonical_url?: string;
}

const DEFAULT_METHODS: MethodItem[] = [
  {
    id: 'cash',
    name: 'Cash',
    badge: '৳',
    color: '#2e7d57',
    image: '',
    steps: ['Pay at the billing counter', 'Collect your printed receipt'],
    is_active: true,
  },
  {
    id: 'pos',
    name: 'Card (POS)',
    badge: 'POS',
    color: '#3a5ba0',
    image: '',
    steps: [
      'Tell the counter you will pay by card',
      'Tap, insert or swipe your debit/credit card',
      'Enter PIN if asked and keep the slip',
    ],
    is_active: true,
  },
  {
    id: 'qr',
    name: 'Bangla QR',
    badge: 'QR',
    color: '#0b7a75',
    image: '',
    steps: [
      'Open any bank or wallet app with QR pay',
      'Scan the Bangla QR at the counter',
      'Enter the bill amount and confirm',
      'Show the success screen to staff',
    ],
    is_active: true,
  },
  {
    id: 'bkash',
    name: 'bKash',
    badge: 'bK',
    color: '#e2136e',
    image: '',
    steps: [
      'Open the bKash app and tap Payment',
      'Scan the QR or enter the merchant number',
      'Enter the bill amount and your PIN',
      'Show the confirmation to staff',
    ],
    is_active: true,
  },
  {
    id: 'nagad',
    name: 'Nagad',
    badge: 'Ng',
    color: '#f26a21',
    image: '',
    steps: [
      'Open the Nagad app and tap Merchant Pay',
      'Scan the QR or enter the merchant number',
      'Enter the bill amount and your PIN',
      'Show the confirmation to staff',
    ],
    is_active: true,
  },
  {
    id: 'rocket',
    name: 'Rocket',
    badge: 'Rk',
    color: '#8c3494',
    image: '',
    steps: [
      'Dial *322# or open the Rocket app',
      'Choose Payment and enter the merchant number',
      'Enter the amount and your PIN',
      'Show the confirmation to staff',
    ],
    is_active: true,
  },
];

const DEFAULT_BRANCHES: BranchItem[] = [
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

export default function HowToPayPublicShow({
  locations = [],
  nav_menu,
  home_content,
  payment_settings,
  initial_branch,
  canonical_url,
}: Props) {
  // Methods list from settings or defaults (only active ones)
  const methods = useMemo<MethodItem[]>(() => {
    const raw =
      payment_settings?.methods_data &&
      Array.isArray(payment_settings.methods_data) &&
      payment_settings.methods_data.length > 0
        ? payment_settings.methods_data
        : DEFAULT_METHODS;

    return raw.filter((m) => m.is_active !== false);
  }, [payment_settings?.methods_data]);

  // Branches list from settings or defaults
  const branches = useMemo<BranchItem[]>(() => {
    const raw =
      payment_settings?.branches_data &&
      Array.isArray(payment_settings.branches_data) &&
      payment_settings.branches_data.length > 0
        ? payment_settings.branches_data
        : DEFAULT_BRANCHES;

    return raw;
  }, [payment_settings?.branches_data]);

  // Selected branch
  const [currentId, setCurrentId] = useState<string>(() => {
    if (initial_branch) {
      const found = branches.find(
        (b) =>
          b.id.toLowerCase() === initial_branch.toLowerCase() ||
          b.name.toLowerCase() === initial_branch.toLowerCase()
      );
      if (found) return found.id;
    }
    return branches[0]?.id || 'mirpur';
  });

  const branchCardRef = useRef<HTMLDivElement>(null);

  const selectBranch = (id: string, shouldScroll = false) => {
    setCurrentId(id);
    if (shouldScroll && branchCardRef.current) {
      branchCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentBranch = useMemo(() => {
    return branches.find((b) => b.id === currentId) || branches[0];
  }, [branches, currentId]);

  const availableMethodsCount = useMemo(() => {
    if (!currentBranch) return 0;
    return methods.filter((m) => currentBranch.has?.[m.id]).length;
  }, [currentBranch, methods]);

  // Dynamic text from settings
  const tagline = payment_settings?.tagline || 'Payment methods by branch';
  const titleMain = payment_settings?.title_main || 'How to pay';
  const titleHighlight = payment_settings?.title_highlight || 'at our clinic';
  const leadText =
    payment_settings?.lead_text ||
    'Choose your branch to see exactly which payment methods work there.';
  const branchesSectionTitle =
    payment_settings?.branches_section_title || 'Select your branch';
  const branchesSectionSub =
    payment_settings?.branches_section_sub ||
    'Payment options differ from branch to branch.';
  const matrixSectionTitle =
    payment_settings?.matrix_section_title || 'All branches at a glance';
  const matrixSectionSub =
    payment_settings?.matrix_section_sub || 'Tap a branch name to jump to its details.';
  const noticeText =
    payment_settings?.notice_text ||
    'Always keep your payment receipt or transaction ID. For mobile payments, show the success message at the counter before you leave. Need help? Ask the front desk at any branch.';
  const pageTitle =
    payment_settings?.seo_title ||
    'How to Pay | Payment Methods by Branch | Tech Dental Care';
  const metaDesc =
    payment_settings?.meta_desc ||
    'Choose your branch to see accepted payment methods at Tech Dental Care: Cash, POS Debit/Credit Card, Bangla QR, bKash, Nagad, and Rocket.';

  return (
    <div className="bg-white flex flex-col min-h-screen text-[#0a0a0a] font-['Plus_Jakarta_Sans',sans-serif]">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDesc} />
        {canonical_url && <link rel="canonical" href={canonical_url} />}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Top Header */}
      <TopHeader
        locations={locations}
        nav_menu={nav_menu}
        showBranchPicker={false}
      />

      <main className="flex-grow">
        {/* Scoped How to Pay Container */}
        <div className="how-to-pay-wrap max-w-5xl mx-auto w-full px-4 sm:px-6 md:px-8 py-8 md:py-12">
          {/* Hero Section */}
          <header className="hero pt-2 pb-6 md:pb-8">
            <div className="tag inline-block border-l-3 border-[#f0480f] pl-2.5 font-['Barlow_Condensed',sans-serif] font-extrabold text-[18px] sm:text-[22px] md:text-[26px] leading-[1.1] uppercase text-[#0a0a0a] tracking-wide">
              {tagline}
            </div>
            <h1 className="font-['Barlow_Condensed',sans-serif] font-extrabold text-[46px] sm:text-[68px] md:text-[88px] lg:text-[96px] leading-[0.95] uppercase tracking-[0.005em] my-3.5 sm:my-4 text-[#0a0a0a]">
              {titleMain}
              <br />
              <span className="pk text-[#f0047f]">{titleHighlight}</span>
            </h1>
            <p className="lead text-[#5c5c5c] max-w-[52ch] m-0 text-base sm:text-[17px] leading-relaxed">
              {leadText}
            </p>
          </header>

          {/* Branch Picker Header */}
          <div className="mt-4">
            <h2 className="font-['Barlow_Condensed',sans-serif] font-bold text-[24px] sm:text-[28px] uppercase tracking-[0.01em] m-0 mb-1 text-[#0a0a0a]">
              {branchesSectionTitle}
            </h2>
            <p className="sub text-[#5c5c5c] m-0 mb-4 text-sm sm:text-[14.5px]">
              {branchesSectionSub}
            </p>

            {/* Branch Pills */}
            <div className="picker flex flex-wrap gap-2 py-1 pb-3" role="group" aria-label="Branches">
              {branches.map((b) => {
                const isSelected = b.id === currentId;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => selectBranch(b.id)}
                    aria-pressed={isSelected}
                    className={`pill flex-initial border-[1.5px] rounded-full px-4 sm:px-5 py-2.5 font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-sm sm:text-[15px] cursor-pointer min-h-[44px] transition-all select-none active:scale-[0.98] ${
                      isSelected
                        ? 'bg-[#f0047f] border-[#f0047f] text-white shadow-sm'
                        : 'border-[#e2e2e2] bg-white text-[#0a0a0a] hover:border-slate-400'
                    }`}
                  >
                    {b.name}
                  </button>
                );
              })}
            </div>

            {/* Active Branch Overview Card */}
            {currentBranch && (
              <div
                ref={branchCardRef}
                className="branch grid gap-3.5 bg-white border border-[#e2e2e2] rounded-[18px] p-4 sm:p-5 my-2 mb-5 shadow-2xs"
                aria-live="polite"
              >
                <span className="count inline-block bg-[#f0480f] text-white font-bold rounded-lg px-2.5 py-0.5 text-xs sm:text-[14px] w-max">
                  {availableMethodsCount} of {methods.length} methods available
                </span>
                <h2 className="font-['Barlow_Condensed',sans-serif] font-bold text-[28px] sm:text-[34px] uppercase m-0 leading-tight text-[#0a0a0a]">
                  {currentBranch.name} branch
                </h2>
                <div className="meta flex flex-wrap gap-x-5 gap-y-1.5 text-[#5c5c5c] text-xs sm:text-[14.5px]">
                  <span>{currentBranch.addr}</span>
                  <span>{currentBranch.hours}</span>
                  {currentBranch.phone && (
                    <span>
                      Call{' '}
                      <a
                        href={`tel:${currentBranch.phone.replace(/[^0-9]/g, '')}`}
                        className="font-bold text-[#1d4ed8] hover:underline"
                      >
                        {currentBranch.phone}
                      </a>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Methods Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
            {methods.map((m) => {
              const isOn = currentBranch ? Boolean(currentBranch.has?.[m.id]) : false;
              const merchantNumber = currentBranch?.acct?.[m.id];
              const whereAvailable = branches
                .filter((b) => b.has?.[m.id])
                .map((b) => b.name)
                .join(', ');

              return (
                <article
                  key={m.id}
                  className={`m rounded-[14px] p-4 flex flex-col gap-2.5 transition-all ${
                    isOn
                      ? 'bg-white border border-[#e2e2e2] shadow-2xs'
                      : 'bg-[#f2f2f2] border border-dashed border-[#e2e2e2]'
                  }`}
                >
                  {/* Top row: Badge (or uploaded image), Name, Status */}
                  <div className="top flex items-center gap-3">
                    <div
                      className={`badge w-12 h-12 rounded-xl grid place-items-center font-extrabold text-[15px] shrink-0 select-none shadow-2xs overflow-hidden aspect-square ${
                        m.image ? 'bg-white border border-[#e2e2e2] p-1' : ''
                      }`}
                      style={{
                        background: m.image ? '#ffffff' : (isOn ? m.color || '#3a5ba0' : '#e2e2e2'),
                        color: isOn ? '#fff' : '#8a8a8a',
                      }}
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

                    <div className="name font-['Barlow_Condensed',sans-serif] font-bold text-[21px] leading-[1.2] uppercase text-[#0a0a0a]">
                      <span className={isOn ? 'text-[#0a0a0a]' : 'text-[#8a8a8a]'}>{m.name}</span>
                    </div>

                    <span
                      className={`status ml-auto text-[13px] font-bold rounded-full px-2.5 py-0.5 whitespace-nowrap select-none ${
                        isOn
                          ? 'text-[#0a8f5b] bg-[#e0f4ea]'
                          : 'text-[#8a8a8a] bg-transparent border border-[#e2e2e2]'
                      }`}
                    >
                      {isOn ? 'Available' : 'Not here'}
                    </span>
                  </div>

                  {/* Account / Merchant Number */}
                  {isOn && merchantNumber && (
                    <div className="acct text-[14px] sm:text-[14.5px] bg-[#e8effe] text-[#1e3a8a] rounded-[10px] p-2 sm:px-3">
                      Merchant number: <b className="font-mono font-bold tracking-wide">{merchantNumber}</b>
                    </div>
                  )}

                  {/* Accordion Steps or Alternate Info */}
                  {isOn ? (
                    <details className="group mt-1">
                      <summary className="cursor-pointer font-semibold text-[14.5px] text-[#1d4ed8] min-h-[32px] flex items-center select-none hover:underline">
                        How to pay
                      </summary>
                      {m.steps && m.steps.length > 0 && (
                        <ol className="mt-1.5 pl-5 text-[#5c5c5c] text-[14px] sm:text-[14.5px] list-decimal space-y-1">
                          {m.steps.map((step, sIdx) => (
                            <li key={sIdx}>{step}</li>
                          ))}
                        </ol>
                      )}
                    </details>
                  ) : (
                    <p className="alt text-[13.5px] text-[#5c5c5c] m-0 mt-1">
                      {whereAvailable
                        ? `Available at: ${whereAvailable}`
                        : 'Currently not offered at any branch'}
                    </p>
                  )}
                </article>
              );
            })}
          </div>

          {/* Section: All Branches at a Glance Matrix */}
          <section className="mt-9 sm:mt-12">
            <h2 className="font-['Barlow_Condensed',sans-serif] font-bold text-[24px] sm:text-[28px] uppercase tracking-[0.01em] m-0 mb-1 text-[#0a0a0a]">
              {matrixSectionTitle}
            </h2>
            <p className="sub text-[#5c5c5c] m-0 mb-4 text-sm sm:text-[14.5px]">
              {matrixSectionSub}
            </p>

            <div className="matrix-wrap overflow-x-auto border border-[#e2e2e2] rounded-[14px] bg-white mt-1.5 shadow-2xs">
              <table className="w-full border-collapse table-fixed text-[13px] sm:text-[14.5px]">
                <colgroup>
                  <col className="w-[30%] sm:w-[26%]" />
                  {branches.map((b) => (
                    <col key={b.id} className={b.id === currentId ? 'bg-[#e8effe]' : ''} />
                  ))}
                </colgroup>
                <thead>
                  <tr>
                    <th className="p-2.5 sm:p-3 text-left pl-3 sm:pl-4 font-semibold border-b border-[#e2e2e2] sticky left-0 bg-white z-10 text-[#0a0a0a]">
                      Method
                    </th>
                    {branches.map((b) => {
                      const isSelected = b.id === currentId;
                      return (
                        <th
                          key={b.id}
                          className={`p-2 sm:p-3 text-center border-b border-[#e2e2e2] ${
                            isSelected ? 'bg-[#e8effe]' : ''
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => selectBranch(b.id, true)}
                            className={`inline-block text-xs sm:text-sm font-bold leading-tight px-2.5 sm:px-3 py-1.5 rounded-full cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#1d4ed8] text-white shadow-xs'
                                : 'text-[#0a0a0a] hover:bg-[#f2f2f2]'
                            }`}
                          >
                            {b.name}
                          </button>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {methods.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/50">
                      <td className="p-2.5 sm:p-3 text-left pl-3 sm:pl-4 font-semibold border-b border-[#e2e2e2] sticky left-0 bg-white z-10 text-[#0a0a0a]">
                        <span className="mk inline-flex items-center gap-2">
                          {m.image ? (
                            <img
                              src={m.image}
                              alt={m.name}
                              className="w-4 h-4 rounded-[3px] object-contain shrink-0"
                            />
                          ) : (
                            <i
                              className="w-2.5 h-2.5 rounded-[3px] shrink-0"
                              style={{ background: m.color || '#3a5ba0' }}
                            />
                          )}
                          <span>{m.name}</span>
                        </span>
                      </td>
                      {branches.map((b) => {
                        const isSelected = b.id === currentId;
                        const hasMethod = Boolean(b.has?.[m.id]);
                        return (
                          <td
                            key={b.id}
                            className={`p-2 sm:p-3 text-center border-b border-[#e2e2e2] ${
                              isSelected ? 'bg-[#e8effe]' : ''
                            }`}
                          >
                            {hasMethod ? (
                              <span
                                className="dot inline-grid place-items-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0a8f5b] text-white text-xs sm:text-[15px] font-extrabold mx-auto select-none"
                                aria-label="Available"
                              >
                                ✓
                              </span>
                            ) : (
                              <span
                                className="dot no inline-block w-6 h-6 sm:w-7 sm:h-7 rounded-full border-[1.5px] border-dashed border-[#e2e2e2] mx-auto"
                                aria-label="Not available"
                              />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#f2f2f2] font-bold text-xs sm:text-[13.5px] text-[#5c5c5c]">
                    <td className="p-2.5 sm:p-3 text-left pl-3 sm:pl-4 border-t border-[#e2e2e2] sticky left-0 bg-[#f2f2f2] z-10">
                      Methods
                    </td>
                    {branches.map((b) => {
                      const isSelected = b.id === currentId;
                      const count = methods.filter((m) => b.has?.[m.id]).length;
                      return (
                        <td
                          key={b.id}
                          className={`p-2 sm:p-3 text-center border-t border-[#e2e2e2] ${
                            isSelected ? 'bg-[#e8effe] text-[#1d4ed8]' : ''
                          }`}
                        >
                          {count} of {methods.length}
                        </td>
                      );
                    })}
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* Good to know footer card */}
          {noticeText && (
            <div className="foot my-8 sm:my-10 p-4 sm:p-5 border-l-4 border-[#1d4ed8] bg-white rounded-r-xl text-[#5c5c5c] text-sm sm:text-[14.5px] shadow-2xs leading-relaxed">
              <b className="text-[#0a0a0a]">Good to know:</b> {noticeText}
            </div>
          )}
        </div>
      </main>

      {/* Global Footer */}
      <GlobalFooter />
    </div>
  );
}
