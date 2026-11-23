import React, { useState, useEffect, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Home,
    Calendar,
    PenLine,
    FileText,
    Image as ImageIcon,
    Stethoscope,
    MapPin,
    Settings as SettingsIcon,
    ChevronDown,
    ChevronUp,
    LogOut,
    Menu,
    X,
    ExternalLink,
    Bot,
    ClipboardList
} from 'lucide-react';

// Dedicated tooth outline icon matching the PDF exactly
const ToothIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M7 3C4.24 3 2 5.24 2 8c0 3.32 1.5 6.64 2.5 10 .62 2.06 2.03 3 3.5 3 1.57 0 2.22-1.39 3-3 .7-1.46 1.3-3 1-3s.3 1.54 1 3c.78 1.61 1.43 3 3 3 1.47 0 2.88-.94 3.5-3 1-3.36 2.5-6.68 2.5-10 0-2.76-2.24-5-5-5-2.26 0-3.6 1.47-4.5 3C11.6 4.47 10.26 3 7 3z" />
    </svg>
);

interface SubmenuChildItem {
    name: string;
    href: string;
    active: boolean;
}

interface SubmenuItem {
    name: string;
    href?: string;
    active: boolean;
    children?: SubmenuChildItem[];
}

interface MenuItem {
    name: string;
    icon: React.ElementType;
    href?: string;
    active: boolean;
    submenu?: SubmenuItem[];
}

interface MenuGroup {
    id: string;
    items: MenuItem[];
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const currentRoute = route().current();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // Single active accordion dropdown state: opening one closes any previously open dropdown
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(() => {
        if (currentRoute?.startsWith('posts.') || currentRoute?.startsWith('medicines.')) return 'Blog';
        if (currentRoute === 'homepage.admin' || currentRoute === 'about.admin' || currentRoute === 'patient-rights.admin' || currentRoute?.startsWith('team.') || currentRoute?.startsWith('pages.')) return 'Pages';
        if (currentRoute?.startsWith('media.') || currentRoute?.startsWith('featured-images.')) return 'Media';
        if (currentRoute?.startsWith('services.') || currentRoute === 'pricelist.admin') return 'Services';
        if (currentRoute === 'settings.admin' || currentRoute === 'settings.header-footer' || currentRoute === 'settings.website-texts' || currentRoute?.startsWith('menus.') || currentRoute?.startsWith('users.') || currentRoute?.startsWith('redirects.')) return 'Settings';
        return null;
    });

    const [openNestedSubmenus, setOpenNestedSubmenus] = useState<Record<string, boolean>>({
        'Dental Blog & Guides': true,
    });

    const toggleSubmenu = (name: string) => {
        setOpenSubmenu(prev => (prev === name ? null : name));
    };

    const toggleNestedSubmenu = (name: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenNestedSubmenus(prev => ({ ...prev, [name]: !prev[name] }));
    };

    // Auto-open active section's submenu when navigating
    useEffect(() => {
        if (currentRoute?.startsWith('posts.') || currentRoute?.startsWith('medicines.')) {
            setOpenSubmenu('Blog');
            if (currentRoute?.startsWith('posts.')) {
                setOpenNestedSubmenus(prev => ({ ...prev, 'Dental Blog & Guides': true }));
            }
        } else if (currentRoute === 'homepage.admin' || currentRoute === 'about.admin' || currentRoute === 'patient-rights.admin' || currentRoute === 'how-to-pay.admin' || currentRoute?.startsWith('team.') || currentRoute?.startsWith('pages.')) {
            setOpenSubmenu('Pages');
        } else if (currentRoute?.startsWith('media.') || currentRoute?.startsWith('featured-images.')) {
            setOpenSubmenu('Media');
        } else if (currentRoute?.startsWith('services.') || currentRoute === 'pricelist.admin') {
            setOpenSubmenu('Services');
        } else if (currentRoute === 'settings.admin' || currentRoute === 'settings.header-footer' || currentRoute === 'settings.website-texts' || currentRoute?.startsWith('menus.') || currentRoute?.startsWith('users.') || currentRoute?.startsWith('redirects.')) {
            setOpenSubmenu('Settings');
        }
    }, [currentRoute]);

    // Exact menu hierarchy matching the attached PDF specification (Page 1 & Page 2)
    const groups: MenuGroup[] = useMemo(() => [
        // Group 1: Overview & Appointments
        {
            id: 'group-1',
            items: [
                {
                    name: 'Dashboard',
                    icon: Home,
                    href: route('dashboard'),
                    active: currentRoute === 'dashboard'
                },
                {
                    name: 'Appointments',
                    icon: Calendar,
                    href: route('appointments.index'),
                    active: currentRoute?.startsWith('appointments.')
                },
                {
                    name: 'Complaint Box',
                    icon: ClipboardList,
                    href: route('complaints.admin'),
                    active: currentRoute?.startsWith('complaints.admin')
                },
            ]
        },
        // Group 2: Content (Blog, Pages, Media)
        {
            id: 'group-2',
            items: [
                {
                    name: 'Blog',
                    icon: PenLine,
                    active: currentRoute?.startsWith('posts.') || currentRoute?.startsWith('medicines.'),
                    submenu: [
                        {
                            name: 'Dental Blog & Guides',
                            active: currentRoute?.startsWith('posts.') && currentRoute !== 'posts.others',
                            children: [
                                { name: 'All posts', href: route('posts.index'), active: currentRoute === 'posts.index' || currentRoute?.startsWith('posts.edit') || currentRoute?.startsWith('posts.show') },
                                { name: 'Add new', href: route('posts.create'), active: currentRoute === 'posts.create' },
                                { name: 'Categories', href: route('posts.categories'), active: currentRoute === 'posts.categories' },
                                { name: 'Tags', href: route('posts.tags'), active: currentRoute === 'posts.tags' },
                            ]
                        },
                        {
                            name: 'Medicines',
                            href: route('medicines.admin'),
                            active: currentRoute?.startsWith('medicines.admin'),
                        },
                        {
                            name: 'Others',
                            href: route('posts.others'),
                            active: currentRoute === 'posts.others',
                        },
                    ]
                },
                {
                    name: 'Pages',
                    icon: FileText,
                    active: currentRoute === 'homepage.admin' || currentRoute === 'about.admin' || currentRoute === 'patient-rights.admin' || currentRoute === 'how-to-pay.admin' || currentRoute?.startsWith('team.') || currentRoute?.startsWith('pages.'),
                    submenu: [
                        { name: 'All Website Pages', href: route('pages.index'), active: currentRoute === 'pages.index' },
                        { name: 'Homepage', href: route('homepage.admin'), active: currentRoute === 'homepage.admin' },
                        { name: 'About Us', href: route('about.admin'), active: currentRoute === 'about.admin' },
                        { name: 'Corporate Team', href: route('team.admin'), active: currentRoute?.startsWith('team.') },
                        { name: 'Patient Rights & Responsibilities', href: route('patient-rights.admin'), active: currentRoute === 'patient-rights.admin' },
                        { name: 'How to Pay (Payment Methods)', href: route('how-to-pay.admin'), active: currentRoute === 'how-to-pay.admin' },
                    ]
                },
                {
                    name: 'Media',
                    icon: ImageIcon,
                    active: currentRoute?.startsWith('media.') || currentRoute?.startsWith('featured-images.'),
                    submenu: [
                        { name: 'Library', href: route('media.index'), active: currentRoute?.startsWith('media.') },
                        { name: 'Featured sliders', href: route('featured-images.index'), active: currentRoute?.startsWith('featured-images.') },
                    ]
                },
            ]
        },
        // Group 3: Clinical (Services, Doctors, Branches)
        {
            id: 'group-3',
            items: [
                {
                    name: 'Services',
                    icon: ToothIcon,
                    active: currentRoute?.startsWith('services.') || currentRoute === 'pricelist.admin',
                    submenu: [
                        { name: 'Dental services', href: route('services.admin'), active: currentRoute?.startsWith('services.admin') },
                        { name: 'Price list', href: route('pricelist.admin'), active: currentRoute === 'pricelist.admin' },
                    ]
                },
                {
                    name: 'Doctors',
                    icon: Stethoscope,
                    href: route('doctors.index'),
                    active: currentRoute?.startsWith('doctors.')
                },
                {
                    name: 'Branches & clinics',
                    icon: MapPin,
                    href: route('branch.admin'),
                    active: currentRoute === 'branch.admin'
                },
                {
                    name: 'AI Chat Assistant',
                    icon: Bot,
                    href: route('ai-assistant.admin'),
                    active: currentRoute?.startsWith('ai-assistant.')
                },
            ]
        },
        // Group 4: Administration & Settings
        {
            id: 'group-4',
            items: [
                {
                    name: 'Settings',
                    icon: SettingsIcon,
                    active: currentRoute === 'settings.admin' || currentRoute === 'settings.header-footer' || currentRoute === 'settings.website-texts' || currentRoute?.startsWith('menus.') || currentRoute?.startsWith('users.') || currentRoute?.startsWith('redirects.'),
                    submenu: [
                        { name: 'Site settings', href: route('settings.admin'), active: currentRoute === 'settings.admin' },
                        { name: 'Header & Footer', href: route('settings.header-footer'), active: currentRoute === 'settings.header-footer' },
                        { name: 'Website Texts', href: route('settings.website-texts'), active: currentRoute === 'settings.website-texts' },
                        { name: '301 / 302 Redirects', href: route('redirects.index'), active: currentRoute?.startsWith('redirects.') },
                        { name: 'Navigation menus', href: route('menus.index'), active: currentRoute?.startsWith('menus.') },
                        { name: 'Staff & users', href: route('users.index'), active: currentRoute?.startsWith('users.') },
                    ]
                },
            ]
        }
    ], [currentRoute]);

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[#131726] text-slate-300 w-64 md:w-64 select-none border-r border-slate-800/80">
            {/* Top Brand Header matching PDF Page 1 */}
            <div className="p-5 pb-4 flex items-center justify-between border-b border-slate-800/60">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#800038] flex items-center justify-center text-white font-bold text-xs tracking-wider shadow-sm">
                        TD
                    </div>
                    <span className="text-white font-bold text-[15px] tracking-wide">
                        Tech Dental
                    </span>
                </div>
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition"
                    title="View Frontend Site"
                >
                    <ExternalLink size={14} />
                </a>
            </div>

            {/* Menu Items matching PDF layout */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 custom-scrollbar">
                {groups.map((group, gIdx) => (
                    <div key={group.id}>
                        {gIdx > 0 && (
                            <div className="my-2.5 border-t border-slate-800/80" />
                        )}

                        <nav className="space-y-1">
                            {group.items.map((item, idx) => {
                                const isSubmenu = !!item.submenu;
                                const isOpen = openSubmenu === item.name;

                                if (isSubmenu) {
                                    return (
                                        <div key={idx}>
                                            <button
                                                type="button"
                                                onClick={() => toggleSubmenu(item.name)}
                                                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all cursor-pointer ${item.active
                                                        ? 'text-white bg-slate-800/50'
                                                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <item.icon
                                                        size={18}
                                                        className={item.active ? 'text-white shrink-0' : 'text-slate-400 shrink-0'}
                                                    />
                                                    <span className="truncate">{item.name}</span>
                                                </div>
                                                <div className="flex items-center text-slate-400 shrink-0">
                                                    {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                                </div>
                                            </button>

                                            {/* Submenu List */}
                                            {isOpen && item.submenu && (
                                                <div className="mt-1 space-y-0.5 pl-8 pr-1 py-1">
                                                    {item.submenu.map((sub, sidx) => {
                                                        const hasChildren = !!sub.children && sub.children.length > 0;
                                                        const isNestedOpen = openNestedSubmenus[sub.name];

                                                        if (hasChildren) {
                                                            return (
                                                                <div key={sidx} className="space-y-0.5">
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => toggleNestedSubmenu(sub.name, e)}
                                                                        className={`w-full flex items-center justify-between py-1.5 px-2.5 text-[13px] rounded-lg transition-colors font-medium cursor-pointer ${sub.active
                                                                                ? 'text-white font-semibold'
                                                                                : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                                                                            }`}
                                                                    >
                                                                        <span className="truncate">{sub.name}</span>
                                                                        <span className="text-slate-400 ml-1 shrink-0">
                                                                            {isNestedOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                                                        </span>
                                                                    </button>

                                                                    {isNestedOpen && (
                                                                        <div className="space-y-0.5 pl-3 border-l border-slate-700/60 ml-2 py-0.5">
                                                                            {sub.children!.map((child, cidx) => (
                                                                                <Link
                                                                                    key={cidx}
                                                                                    href={child.href}
                                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                                    className={`block py-1.5 px-2.5 text-xs rounded-lg transition-colors ${child.active
                                                                                            ? 'text-white font-semibold bg-[#800038] shadow-xs'
                                                                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                                                                                        }`}
                                                                                >
                                                                                    {child.name}
                                                                                </Link>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        }

                                                        return (
                                                            <Link
                                                                key={sidx}
                                                                href={sub.href || '#'}
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                className={`block py-1.5 px-2.5 text-[13px] rounded-lg transition-colors ${sub.active
                                                                        ? 'text-white font-semibold bg-[#800038] shadow-xs'
                                                                        : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                                                                    }`}
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }

                                return (
                                    <Link
                                        key={idx}
                                        href={item.href || '#'}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all ${item.active
                                                ? 'bg-[#800038] text-white font-semibold shadow-sm'
                                                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <item.icon
                                                size={18}
                                                className={item.active ? 'text-white shrink-0' : 'text-slate-400 shrink-0'}
                                            />
                                            <span className="truncate">{item.name}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                ))}
            </div>

            {/* Bottom Actions / Sign Out */}
            <div className="p-3 border-t border-slate-800/80 bg-[#101320]">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:text-white hover:bg-rose-900/40 rounded-lg transition-colors font-semibold cursor-pointer border border-transparent hover:border-rose-800/40"
                >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </Link>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#f3f4f6] font-sans overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block h-full flex-shrink-0 z-20">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    } transition-transform duration-300 ease-in-out md:hidden shadow-2xl`}
            >
                <SidebarContent />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
                {/* Mobile Top Navbar */}
                <header className="md:hidden bg-white shadow-xs border-b border-slate-200 h-14 flex items-center justify-between px-4 z-10 flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#800038] flex items-center justify-center text-white font-bold text-xs shadow-xs">
                            TD
                        </div>
                        <span className="font-bold text-slate-800 text-sm tracking-wide">
                            TECH DENTAL
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                        aria-label="Open Sidebar Menu"
                    >
                        <Menu size={22} />
                    </button>
                </header>

                {/* Content Container */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa] p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
