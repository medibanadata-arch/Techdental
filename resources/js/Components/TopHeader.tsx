import React, { useState, useMemo, useEffect } from "react";
import { MapPin, Menu, X, ChevronDown, Globe, Calendar } from "lucide-react";
import { usePage, router } from "@inertiajs/react";
import { useLanguage } from "@/utils/useLanguage";

interface TopHeaderProps {
  locations?: any[];
  selectedBranch?: string;
  onBranchChange?: (branch: string) => void;
  navMenu?: any;
  showBranchPicker?: boolean;
  showLanguageSwitcher?: boolean;
  headerLogo?: string;
  brandNameLine1?: string;
  brandNameLine2?: string;
}

interface DrawerMenuItemProps {
  item: any;
  onClose: () => void;
  depth?: number;
  isOpen: boolean;
  onToggle: () => void;
}

const DrawerMenuItem: React.FC<DrawerMenuItemProps> = ({
  item,
  onClose,
  depth = 0,
  isOpen,
  onToggle,
}) => {
  const [openChildKey, setOpenChildKey] = useState<string | number | null>(null);
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      e.stopPropagation();
      onToggle();
    }
  };

  return (
    <div className="relative group/item">
      <div
        onClick={hasChildren ? handleToggle : undefined}
        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
          depth === 0
            ? 'text-slate-800 hover:text-sky-600 hover:bg-sky-50/80 font-extrabold'
            : depth === 1
            ? 'text-slate-700 hover:text-sky-600 hover:bg-slate-100/90 font-semibold'
            : 'text-slate-600 hover:text-sky-600 hover:bg-slate-100/60 font-medium'
        }`}
      >
        <a
          href={hasChildren ? '#' : (item.url || '#')}
          onClick={(e) => {
            if (hasChildren) {
              handleToggle(e);
            } else {
              onClose();
            }
          }}
          className="flex items-center gap-2.5 flex-1 no-underline text-inherit cursor-pointer"
        >
          <span
            className={`w-1.5 h-1.5 rounded-full transition-transform ${
              depth === 0
                ? 'bg-sky-500'
                : depth === 1
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
          />
          <span>{item.title}</span>
        </a>

        {hasChildren && (
          <button
            type="button"
            onClick={handleToggle}
            className="p-1 hover:bg-sky-100 text-slate-400 hover:text-sky-600 rounded-lg transition-colors cursor-pointer ml-2"
            aria-label={`Toggle ${item.title} sub-menu`}
          >
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-sky-600' : ''
              }`}
            />
          </button>
        )}
      </div>

      {/* Sub-menu Dropdown Items - ONLY visible when clicked open */}
      {hasChildren && isOpen && (
        <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-sky-300 ml-3.5 my-1 animate-in fade-in slide-in-from-top-1 duration-150 bg-slate-50/60 rounded-r-xl">
          {item.children.map((child: any, idx: number) => {
            const childKey = child.id ?? child.title ?? idx;
            return (
              <DrawerMenuItem
                key={childKey}
                item={child}
                isOpen={openChildKey === childKey}
                onToggle={() => setOpenChildKey((prev) => (prev === childKey ? null : childKey))}
                onClose={onClose}
                depth={depth + 1}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export const TopHeader: React.FC<TopHeaderProps> = ({
  locations = [],
  selectedBranch = "",
  onBranchChange = () => {},
  navMenu,
  showBranchPicker,
  showLanguageSwitcher,
  headerLogo: propLogo,
  brandNameLine1: propLine1,
  brandNameLine2: propLine2,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDrawerMenuKey, setOpenDrawerMenuKey] = useState<string | number | null>(null);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const { language, setLanguage, isBn } = useLanguage();

  // Safely detect current route & shared site settings
  let currentPath = '';
  let pageProps: any = {};
  try {
    const page = usePage();
    pageProps = page?.props || {};
    currentPath = page?.url || '';
  } catch {
    // outside inertia context
  }
  if (!currentPath && typeof window !== 'undefined') {
    currentPath = window.location.pathname;
  }
  const cleanPath = (currentPath || '').toLowerCase().split('?')[0];
  const pathWithoutBn = cleanPath.startsWith('/bn/')
    ? cleanPath.replace('/bn', '')
    : (cleanPath === '/bn' ? '/' : cleanPath);

  const siteSettings = pageProps.site_settings || {};
  const headerSettings = siteSettings.header_settings;

  const currentPageKey = useMemo(() => {
    const p = pathWithoutBn;
    if (p === '/' || p === '') return 'home';
    if (p.startsWith('/branch/')) return 'branch';
    if (p.startsWith('/services') || p.startsWith('/service/')) return 'services';
    if (p.startsWith('/doctors') || p.startsWith('/doctor/')) return 'doctors';
    if (
      p.startsWith('/blog') ||
      p.startsWith('/guides') ||
      p.startsWith('/dental-guides') ||
      p.startsWith('/medicines') ||
      p.startsWith('/medicine') ||
      p.startsWith('/posts') ||
      p.startsWith('/post')
    ) {
      return 'blog';
    }
    if (p.startsWith('/appointment')) return 'appointment';
    if (p.startsWith('/page/about') || p.startsWith('/about')) return 'about';
    return 'default';
  }, [pathWithoutBn]);

  const activePageConfig = headerSettings?.pages?.[currentPageKey] || headerSettings?.pages?.default;

  const pageCustomLogo = activePageConfig?.override_logo ? activePageConfig.custom_logo : null;
  const activeLogo = pageCustomLogo || propLogo || siteSettings.header_logo;
  const activeLine1 = propLine1 ?? siteSettings.brand_name_line1 ?? 'TECH';
  const activeLine2 = propLine2 ?? siteSettings.brand_name_line2 ?? 'DENTAL';
  const isSticky = headerSettings?.global?.sticky !== false;
  const currentVariant = activePageConfig?.variant || 'full';
  const showAnnouncement = currentVariant === 'announcement';
  const announcementText = activePageConfig?.announcement_text || headerSettings?.global?.announcement_text || 'Welcome to Tech Dental – Painless Digital Dental Care across Dhaka';

  // Only show Language Switcher on Medicine Pharmacy and Dental Blog / Guides
  const isLanguageSwitcherVisible = useMemo(() => {
    if (showLanguageSwitcher === false) return false;
    if (showLanguageSwitcher === true) return true;

    return (
      pathWithoutBn === '/medicines' ||
      pathWithoutBn.startsWith('/medicines/') ||
      pathWithoutBn === '/medicine' ||
      pathWithoutBn.startsWith('/medicine/') ||
      pathWithoutBn === '/blog' ||
      pathWithoutBn.startsWith('/blog/') ||
      pathWithoutBn === '/dental-guides' ||
      pathWithoutBn.startsWith('/dental-guides/') ||
      pathWithoutBn === '/guides' ||
      pathWithoutBn.startsWith('/guides/') ||
      pathWithoutBn === '/posts' ||
      pathWithoutBn.startsWith('/posts/') ||
      pathWithoutBn === '/post' ||
      pathWithoutBn.startsWith('/post/') ||
      pathWithoutBn === '/patient-rights' ||
      pathWithoutBn.startsWith('/patient-rights/')
    );
  }, [showLanguageSwitcher, pathWithoutBn]);

  // Hide branch picker on Blog, Dental Guides, Medicines, and related Single views or per page config
  const isBranchPickerVisible = useMemo(() => {
    if (showBranchPicker === false) return false;

    // Blog, Dental Guides, Medicines, and related single views ALWAYS hide branch picker
    const isEditorialOrMedicine =
      pathWithoutBn === '/blog' ||
      pathWithoutBn.startsWith('/blog/') ||
      pathWithoutBn === '/medicines' ||
      pathWithoutBn.startsWith('/medicines/') ||
      pathWithoutBn === '/medicine' ||
      pathWithoutBn.startsWith('/medicine/') ||
      pathWithoutBn === '/dental-guides' ||
      pathWithoutBn.startsWith('/dental-guides/') ||
      pathWithoutBn === '/guides' ||
      pathWithoutBn.startsWith('/guides/') ||
      pathWithoutBn === '/posts' ||
      pathWithoutBn.startsWith('/posts/') ||
      pathWithoutBn === '/post' ||
      pathWithoutBn.startsWith('/post/') ||
      pathWithoutBn === '/patient-rights' ||
      pathWithoutBn.startsWith('/patient-rights/');

    if (isEditorialOrMedicine) {
      return false;
    }

    if (currentVariant === 'minimal' && activePageConfig?.show_branch_picker !== true) {
      return false;
    }

    if (activePageConfig && activePageConfig.show_branch_picker !== undefined) {
      return Boolean(activePageConfig.show_branch_picker);
    }

    if (showBranchPicker === true) return true;

    return true;
  }, [showBranchPicker, pathWithoutBn, activePageConfig, currentVariant]);

  // Language switch handler: toggles language, and dynamically updates URL with /bn/ on single blog & medicine
  const handleLanguageSwitch = (targetLang: 'en' | 'bn') => {
    setLanguage(targetLang);

    // Only for single blog & medicine & patient rights: dynamically switch URL
    const singleBlogMatch = cleanPath.match(/^(?:\/bn)?\/blog\/([^\/]+)$/i);
    const singleMedicineMatch = cleanPath.match(/^(?:\/bn)?\/medicines\/([^\/]+)$/i);
    const isPatientRights = cleanPath.match(/^(?:\/bn)?\/patient-rights(?:\/.*)?$/i);

    if (isPatientRights) {
      const targetUrl = targetLang === 'bn' ? '/bn/patient-rights' : '/patient-rights';
      if (cleanPath !== targetUrl.toLowerCase()) {
        router.visit(targetUrl);
      }
    } else if (singleBlogMatch) {
      const slug = singleBlogMatch[1];
      const targetUrl = targetLang === 'bn' ? `/bn/blog/${slug}` : `/blog/${slug}`;
      if (cleanPath !== targetUrl.toLowerCase()) {
        router.visit(targetUrl);
      }
    } else if (singleMedicineMatch) {
      const slug = singleMedicineMatch[1];
      const targetUrl = targetLang === 'bn' ? `/bn/medicines/${slug}` : `/medicines/${slug}`;
      if (cleanPath !== targetUrl.toLowerCase()) {
        router.visit(targetUrl);
      }
    }
  };

  // Format branches dynamically so names NEVER appear blank
  const formattedBranches = useMemo(() => {
    const list = Array.isArray(locations) && locations.length > 0
      ? locations
      : [
          { id: '1', slug: 'mirpur', name: 'Mirpur' },
          { id: '2', slug: 'uttara', name: 'Uttara' },
          { id: '3', slug: 'badda', name: 'Badda' },
          { id: '4', slug: 'jatrabari', name: 'Jatrabari' },
        ];

    return list.map((loc: any) => {
      const rawName = loc.name || loc.branch_name || loc.city || loc.shortName || `Branch ${loc.id}`;
      // Clean display name (e.g., 'Mirpur 10 Branch' -> 'Mirpur')
      let cleanName = rawName.replace(/branch/gi, '').replace(/\b\d+\b/g, '').trim();
      if (!cleanName) cleanName = rawName;

      const slug = (loc.slug || cleanName.toLowerCase().replace(/\s+/g, '-')).trim();

      return {
        id: String(loc.id || loc.location_id || slug),
        slug: slug,
        name: cleanName,
      };
    });
  }, [locations]);

  // Determine active branch: ONLY on branch-specific pages (/branch/{slug} or /page/branch-{slug})
  const activeBranch = useMemo(() => {
    const isSpecificBranchRoute =
      pathWithoutBn.startsWith('/branch/') ||
      pathWithoutBn.startsWith('/page/branch-');

    if (isSpecificBranchRoute) {
      for (const b of formattedBranches) {
        if (
          pathWithoutBn === `/branch/${b.slug}` ||
          pathWithoutBn.startsWith(`/branch/${b.slug}/`) ||
          pathWithoutBn === `/page/branch-${b.slug}` ||
          pathWithoutBn === `/page/${b.slug}`
        ) {
          return b;
        }
      }
      if (selectedBranch) {
        const match = formattedBranches.find(
          b => b.slug === String(selectedBranch).toLowerCase() || b.id === String(selectedBranch)
        );
        if (match) return match;
      }
    }
    return null;
  }, [formattedBranches, pathWithoutBn, selectedBranch]);

  // Parse Menu Items from saved NavMenu or fallback
  const rawMenuItems = useMemo(() => {
    if (navMenu && navMenu.items_json) {
      try {
        const parsed = typeof navMenu.items_json === 'string' ? JSON.parse(navMenu.items_json) : navMenu.items_json;
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse navMenu items_json", e);
      }
    }
    return [
      { title: 'Home', url: '/', level: 0 },
      { title: 'Dental Services', url: '/services', level: 0 },
      { title: 'Treatment Price List', url: '/price-list', level: 0 },
      { title: 'Specialist Doctors', url: '/doctors', level: 0 },
      { title: 'Medicines & Care', url: '/medicines', level: 0 },
      { title: 'Branches & Schedules', url: '/branches', level: 0 },
      { title: 'About Tech Dental', url: '/about', level: 0 },
      { title: 'Corporate Team', url: '/team', level: 0 },
      { title: 'Blog & Dental Guides', url: '/blog', level: 0 },
      { title: 'Book Appointment', url: '/appointment', level: 0 },
    ];
  }, [navMenu]);

  // Transform flat menu items array with `level` into nested tree structure
  const menuTree = useMemo(() => {
    if (!Array.isArray(rawMenuItems) || rawMenuItems.length === 0) return [];

    const tree: any[] = [];
    const stack: { item: any; level: number }[] = [];

    rawMenuItems.forEach((rawItem) => {
      const level = Number(rawItem.level || 0);
      let targetUrl = rawItem.url || '#';

      // Ensure branch submenu items link directly to /branch/{slug}
      const titleLower = String(rawItem.title || '').toLowerCase().trim();
      if (['mirpur', 'uttara', 'badda', 'jatrabari'].includes(titleLower)) {
        targetUrl = `/branch/${titleLower}`;
      } else if (targetUrl.startsWith('/page/branch-')) {
        targetUrl = targetUrl.replace('/page/branch-', '/branch/');
      } else if (targetUrl === '/page/badda') {
        targetUrl = '/branch/badda';
      } else if (targetUrl === '/page/jatrabari') {
        targetUrl = '/branch/jatrabari';
      }

      const item = { ...rawItem, url: targetUrl, children: [] };

      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length === 0) {
        tree.push(item);
      } else {
        stack[stack.length - 1].item.children.push(item);
      }

      stack.push({ item, level });
    });

    return tree;
  }, [rawMenuItems]);

  return (
    <>
      {showAnnouncement && (
        <div className="w-full bg-gradient-to-r from-[#800038] via-[#a51547] to-[#800038] text-white py-1.5 px-4 text-center text-xs font-bold tracking-wide flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
          <span>{announcementText}</span>
        </div>
      )}
      <header className={`w-full flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-4 pb-3 bg-white border-b border-slate-100 ${isSticky ? 'sticky top-0' : ''} z-40`}>
        
        {/* Left Side: Hamburger Menu Icon + Brand Logo */}
        <div className="flex items-center gap-4 sm:gap-6 md:gap-7">
          {/* Hamburger Menu Icon Button on Left of Logo */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="p-2 text-slate-700 hover:text-sky-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer border border-slate-200 shadow-2xs flex items-center justify-center"
            title="Open Site Navigation Menu"
            aria-label="Open Navigation Menu"
          >
            <Menu size={20} />
          </button>

          {/* Brand Logo */}
          <a href="/" className="flex items-center gap-2 no-underline group" aria-label="Tech Dental Home">
            {activeLogo ? (
              <img
                src={activeLogo}
                alt="Tech Dental Logo"
                className="h-10 sm:h-11 w-auto max-w-[230px] object-contain transition-transform duration-200 group-hover:scale-[1.03]"
              />
            ) : (
              <>
                <svg
                  className="w-[34px] h-[34px] transition-transform duration-200 group-hover:scale-105"
                  viewBox="0 0 120 120"
                  fill="none"
                >
                  {/* Sparkle */}
                  <path
                    d="M42 22L45 10L48 22L60 25L48 28L45 40L42 28L30 25L42 22Z"
                    fill="#111111"
                  />
                  {/* Maroon Tooth */}
                  <path
                    d="M24 55C24 40 38 34 50 34C60 34 68 40 78 40C88 40 96 46 96 55C96 70 88 95 82 108C78 114 70 114 66 106L60 92L54 106C50 114 42 114 38 108C32 95 24 70 24 55Z"
                    fill="#800038"
                  />
                  {/* Dark Tooth Base */}
                  <path
                    d="M24 75C26 95 34 105 38 108C42 114 50 114 54 106L60 92L66 106C70 114 78 114 82 108C86 105 94 95 96 75C80 82 40 82 24 75Z"
                    fill="#111111"
                  />
                </svg>

                <div className="flex flex-col leading-none">
                  <span className="text-[1.1rem] font-extrabold text-primary-maroon">
                    TECH
                  </span>
                  <span className="text-[0.9rem] font-black text-primary-black">
                    DENTAL
                  </span>
                </div>
              </>
            )}
          </a>
        </div>

        {/* Right Side: Language Switcher (EN | বাংলা) + Branch Dropdown Selector */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Pill - Only visible on Medicine Pharmacy & Dental Blog */}
          {isLanguageSwitcherVisible && (
            <div
              id="headerLanguageSwitcher"
              className="flex items-center bg-slate-100/90 p-0.5 rounded-full border border-slate-200/90 shadow-2xs select-none"
              title={language === 'bn' ? 'ভাষা পরিবর্তন করুন (বাংলা / ইংরেজি)' : 'Switch Language (English / Bangla)'}
            >
              <button
                type="button"
                onClick={() => handleLanguageSwitch('en')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleLanguageSwitch('bn')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  language === 'bn'
                    ? 'bg-[#800038] text-white shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                বাংলা
              </button>
            </div>
          )}

          {/* Branch Dropdown Selector with Clean Branch Names */}
          {isBranchPickerVisible && (
            <div className="relative">
              <button
                type="button"
                id="headerBranchSelectBtn"
                onClick={() => setIsBranchDropdownOpen((prev) => !prev)}
                aria-expanded={isBranchDropdownOpen}
                aria-label="Select Dental Branch"
                className="bg-[#f8fafc] border border-[#dbeafe] py-1.5 px-3 rounded-full flex items-center gap-1.5 text-[0.82rem] font-bold text-accent-blue shadow-2xs hover:bg-blue-50/70 transition-all cursor-pointer select-none"
              >
                <MapPin className="w-3.5 h-3.5 text-accent-blue shrink-0" />
                <span>{activeBranch ? activeBranch.name : "Select Branch"}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-accent-blue transition-transform duration-200 ${
                    isBranchDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Fallback hidden select for testing or accessibility */}
              <select
                id="headerBranchSelect"
                value={activeBranch?.slug || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    window.location.href = `/branch/${val}`;
                  }
                }}
                aria-hidden="true"
                tabIndex={-1}
                className="sr-only"
              >
                <option value="">Select Branch</option>
                {formattedBranches.map((loc) => (
                  <option key={loc.id} value={loc.slug}>
                    {loc.name}
                  </option>
                ))}
              </select>

              {/* Interactive Dropdown Menu: Opens on click, Closes on click, NO hover effect */}
              {isBranchDropdownOpen && (
                <>
                  {/* Invisible backdrop to close on outside click */}
                  <div
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setIsBranchDropdownOpen(false)}
                  />

                  <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3.5 py-1">
                      Select Branch:
                    </div>
                    {formattedBranches.map((loc) => {
                      const isCurrent = activeBranch?.slug === loc.slug;
                      return (
                        <a
                          key={loc.id}
                          href={`/branch/${loc.slug}`}
                          onClick={() => {
                            setIsBranchDropdownOpen(false);
                            onBranchChange(loc.slug);
                          }}
                          className={`flex items-center justify-between px-3.5 py-2 text-xs font-semibold no-underline transition-colors ${
                            isCurrent
                              ? "text-sky-600 bg-sky-50 font-bold"
                              : "text-slate-700 hover:text-sky-600 hover:bg-slate-50"
                          }`}
                        >
                          <span>{loc.name}</span>
                          {isCurrent && (
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                          )}
                        </a>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Variant-specific CTA Actions */}
          {currentVariant === 'minimal' && (
            <a
              href="/appointment"
              className="inline-flex items-center gap-1.5 bg-[#800038] hover:bg-[#990044] text-white px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold shadow-xs hover:shadow transition-all no-underline shrink-0"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Appointment</span>
            </a>
          )}
        </div>
      </header>

      {/* Slide-over Drawer / Modal Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex animate-in fade-in duration-200">
          <div className="w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-left duration-200 border-r border-slate-200 overflow-y-auto">
            
            <div className="space-y-4">
              {/* Drawer Top Header: Clean Close Button on Top Right */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  {activeLogo ? (
                    <img
                      src={activeLogo}
                      alt="Tech Dental Logo"
                      className="h-8 max-h-9 w-auto max-w-[170px] object-contain"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[1.05rem] font-extrabold text-primary-maroon">TECH</span>
                      <span className="text-[0.88rem] font-black text-primary-black">DENTAL</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Language Switcher inside Drawer - Only on Medicine & Blog */}
                  {isLanguageSwitcherVisible && (
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200 text-xs">
                      <button
                        type="button"
                        onClick={() => handleLanguageSwitch('en')}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                          language === 'en' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-500'
                        }`}
                      >
                        EN
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLanguageSwitch('bn')}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                          language === 'bn' ? 'bg-[#800038] text-white shadow-xs font-black' : 'text-slate-500'
                        }`}
                      >
                        বাংলা
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    aria-label="Close navigation menu"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Menu Items List */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-2">
                  Select Page:
                </div>
                {menuTree.map((item: any, idx: number) => {
                  const itemKey = item.id ?? item.title ?? idx;
                  return (
                    <DrawerMenuItem
                      key={itemKey}
                      item={item}
                      isOpen={openDrawerMenuKey === itemKey}
                      onToggle={() =>
                        setOpenDrawerMenuKey((prev) => (prev === itemKey ? null : itemKey))
                      }
                      onClose={() => setIsMenuOpen(false)}
                      depth={0}
                    />
                  );
                })}
              </div>
            </div>

            {/* Backdrop Click to Close */}
          </div>
          <div className="flex-1 cursor-pointer" onClick={() => setIsMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
