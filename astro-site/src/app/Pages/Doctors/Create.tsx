import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save, Stethoscope } from 'lucide-react';
import MediaImagePicker from '@/components/ImagePicker/MediaImagePicker';

export default function DoctorsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        spec: '',
        deg: '',
        exp: '',
        img: '',
        branch: '',
        bio: '',
        phone: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('doctors.store'));
    };

    const branches = ['Mirpur', 'Badda', 'Uttara', 'Jatrabari', 'All Branches'];

    return (
        <AdminLayout>
            <Head title="Add Doctor - Tech Dental" />

            <div className="mb-6">
                <Link
                    href={route('doctors.index')}
                    className="text-rose-600 hover:text-rose-700 flex items-center gap-2 mb-3 text-sm font-medium"
                >
                    <ArrowLeft size={16} />
                    Back to Doctors
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
                    <Stethoscope size={22} className="text-rose-600" />
                    Add New Doctor
                </h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main fields */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                            <h2 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3">Doctor Information</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="e.g. Sanidul Islam"
                                        className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone</label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        placeholder="+880 1xxx-xxxxxx"
                                        className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Specialization */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    Specialization <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.spec}
                                    onChange={e => setData('spec', e.target.value)}
                                    placeholder="e.g. Specialist Orthodontist & Aesthetic Dentist"
                                    className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                />
                                {errors.spec && <p className="text-red-500 text-xs mt-1">{errors.spec}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Degree */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                        Degree <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.deg}
                                        onChange={e => setData('deg', e.target.value)}
                                        placeholder="e.g. BDS, PGT (Orthodontics)"
                                        className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                    />
                                    {errors.deg && <p className="text-red-500 text-xs mt-1">{errors.deg}</p>}
                                </div>

                                {/* Experience */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                        Experience <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.exp}
                                        onChange={e => setData('exp', e.target.value)}
                                        placeholder="e.g. 8 years"
                                        className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                    />
                                    {errors.exp && <p className="text-red-500 text-xs mt-1">{errors.exp}</p>}
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">Short Bio</label>
                                <textarea
                                    rows={3}
                                    value={data.bio}
                                    onChange={e => setData('bio', e.target.value)}
                                    placeholder="Brief description about the doctor..."
                                    className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-rose-500 focus:outline-none resize-y"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">
                        {/* Branch */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-5">
                            <h2 className="font-bold text-gray-900 text-sm mb-3">Branch</h2>
                            <select
                                value={data.branch}
                                onChange={e => setData('branch', e.target.value)}
                                className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                            >
                                <option value="">Select Branch</option>
                                {branches.map(b => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </select>
                        </div>

                        {/* Photo URL */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-5">
                            <MediaImagePicker
                                label="Doctor Photo"
                                aspectHint="1:1 Square"
                                value={data.img}
                                onChange={url => setData('img', url)}
                                aspectRatio="1:1"
                                previewHeightClass="h-44"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Link
                                href={route('doctors.index')}
                                className="flex-1 text-center text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 flex items-center justify-center gap-2 bg-[#800038] hover:bg-[#990044] text-white text-sm font-bold rounded-xl py-2.5 transition disabled:opacity-50 cursor-pointer"
                            >
                                <Save size={15} />
                                {processing ? 'Saving...' : 'Save Doctor'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
