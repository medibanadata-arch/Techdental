import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Image as ImageIcon, Database, DollarSign, Users, MapPin,
    FileText, Files, Calendar, BarChart3, Activity, ArrowRight,
    Stethoscope, Globe
} from 'lucide-react';

const cards = [
    {
        label: 'Featured Images',
        desc: 'Homepage carousel slider photos',
        icon: ImageIcon,
        color: 'bg-rose-50 text-rose-600',
        href: 'featured-images.index',
    },
    {
        label: 'Media Library',
        desc: 'All uploaded images, videos & files',
        icon: Database,
        color: 'bg-violet-50 text-violet-600',
        href: 'media.index',
    },
    {
        label: 'Price List',
        desc: 'Service pricing & treatment fees',
        icon: DollarSign,
        color: 'bg-emerald-50 text-emerald-600',
        href: 'pricelist.admin',
    },
    {
        label: 'Doctors',
        desc: 'Specialist doctor profiles',
        icon: Stethoscope,
        color: 'bg-sky-50 text-sky-600',
        href: 'doctors.index',
    },
    {
        label: 'Map Links & Branches',
        desc: 'Clinic locations & map links',
        icon: MapPin,
        color: 'bg-amber-50 text-amber-600',
        href: 'branch.admin',
    },
    {
        label: 'Blog Posts',
        desc: 'Articles, guides & news',
        icon: FileText,
        color: 'bg-blue-50 text-blue-600',
        href: 'posts.index',
    },
    {
        label: 'Custom Pages',
        desc: 'Static & custom website pages',
        icon: Files,
        color: 'bg-orange-50 text-orange-600',
        href: 'pages.index',
    },
    {
        label: 'Appointments',
        desc: 'Patient booking requests',
        icon: Calendar,
        color: 'bg-teal-50 text-teal-600',
        href: 'appointments.index',
    },
    {
        label: 'Users',
        desc: 'Admin account management',
        icon: Users,
        color: 'bg-gray-50 text-gray-600',
        href: 'users.index',
    },
];

export default function Dashboard() {
    return (
        <AdminLayout>
            <Head title="Home — Tech Dental Office Console" />

            {/* Welcome Banner */}
            <div className="mb-8 bg-gradient-to-br from-[#800038] to-[#4a0020] rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 60%)' }} />
                <div className="relative">
                    <h1 className="text-2xl font-bold mb-1">Tech Dental</h1>
                    <a
                        href="/"
                        target="_blank"
                        className="inline-flex items-center gap-2 mt-3 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-4 py-2 rounded-xl transition backdrop-blur-sm"
                    >
                        <Globe size={14} />
                        View Live Website
                        <ArrowRight size={13} />
                    </a>
                </div>
            </div>

            {/* Section Header */}
            <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={17} className="text-gray-500" />
                <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider">All Sections</h2>
            </div>

            {/* Section Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card) => (
                    <Link
                        key={card.href}
                        href={route(card.href)}
                        className="group bg-white rounded-2xl border border-gray-200/80 p-5 hover:shadow-md hover:border-gray-300 transition-all flex items-start gap-4"
                    >
                        <div className={`flex-shrink-0 w-11 h-11 ${card.color} rounded-xl flex items-center justify-center`}>
                            <card.icon size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-gray-900 text-sm group-hover:text-rose-700 transition-colors">
                                {card.label}
                            </div>
                            <div className="text-[12px] text-gray-500 mt-0.5 leading-snug">
                                {card.desc}
                            </div>
                        </div>
                        <ArrowRight size={15} className="text-gray-300 group-hover:text-rose-500 transition-colors flex-shrink-0 mt-0.5" />
                    </Link>
                ))}
            </div>
        </AdminLayout>
    );
}
