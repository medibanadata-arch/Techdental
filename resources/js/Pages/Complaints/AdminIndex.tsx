import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
  ClipboardList,
  Search,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Tag,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Trash2,
  ExternalLink,
  Eye,
  X,
  Save,
  MessageSquareWarning
} from 'lucide-react';
import { PageProps } from '@inertiajs/core';

interface ComplaintItem {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  visit_date: string;
  branch?: string | null;
  category: string;
  details: string;
  status: string;
  admin_notes?: string | null;
  created_at?: string;
}

interface Props extends PageProps {
  complaints?: ComplaintItem[];
}

export default function ComplaintsAdminIndex({ complaints = [] }: Props) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);

  // Status & Note update form state inside modal
  const [modalStatus, setModalStatus] = useState('pending');
  const [modalNotes, setModalNotes] = useState('');

  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      const matchesStatus =
        statusFilter === 'All' || item.status.toLowerCase() === statusFilter.toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        item.full_name.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.branch && item.branch.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [complaints, statusFilter, searchQuery]);

  // Counts
  const counts = useMemo(() => {
    return {
      all: complaints.length,
      pending: complaints.filter((c) => c.status === 'pending').length,
      under_review: complaints.filter((c) => c.status === 'under_review').length,
      resolved: complaints.filter((c) => c.status === 'resolved').length,
    };
  }, [complaints]);

  const openDetailModal = (item: ComplaintItem) => {
    setSelectedComplaint(item);
    setModalStatus(item.status);
    setModalNotes(item.admin_notes || '');
  };

  const handleUpdateStatusAndNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    router.put(
      route('complaints.admin.update', selectedComplaint.id),
      {
        status: modalStatus,
        admin_notes: modalNotes,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setSelectedComplaint(null);
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to permanently delete this complaint report?')) {
      router.delete(route('complaints.admin.destroy', id), {
        preserveScroll: true,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} />
            Resolved
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock size={12} />
            Under Review
          </span>
        );
      case 'dismissed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <XCircle size={12} />
            Dismissed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertCircle size={12} />
            Pending
          </span>
        );
    }
  };

  return (
    <AdminLayout>
      <Head title="Complaint Box - Tech Dental" />

      {/* Top Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-800 text-white flex items-center justify-center font-bold shadow-md shadow-teal-700/20">
            <ClipboardList size={20} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Complaint Box & Feedback</h1>
            <p className="text-xs text-gray-500">
              Review and resolve patient complaints, grievances, and feedback reports
            </p>
          </div>
        </div>

        <div>
          <a
            href="/complaint-box"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-xs"
          >
            <ExternalLink size={14} />
            View Live Public Page
          </a>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Reports</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{counts.all}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Pending Review</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{counts.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-xs">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Under Review</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{counts.under_review}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Resolved</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{counts.resolved}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'pending', 'under_review', 'resolved', 'dismissed'].map((status) => {
            const label =
              status === 'All'
                ? 'All'
                : status === 'pending'
                ? 'Pending'
                : status === 'under_review'
                ? 'Under Review'
                : status === 'resolved'
                ? 'Resolved'
                : 'Dismissed';

            const isActive = statusFilter.toLowerCase() === status.toLowerCase();

            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            placeholder="Search by name, phone, branch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-5 py-3">Patient Info</th>
                <th scope="col" className="px-5 py-3">Category & Branch</th>
                <th scope="col" className="px-5 py-3">Visit Date</th>
                <th scope="col" className="px-5 py-3">Details Preview</th>
                <th scope="col" className="px-5 py-3">Status</th>
                <th scope="col" className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                    No complaints found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition">
                    {/* Patient Info */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-gray-900 text-sm">{item.full_name}</div>
                      <div className="flex items-center gap-1.5 text-gray-500 mt-0.5">
                        <Phone size={12} className="text-gray-400" />
                        <span>{item.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 mt-0.5">
                        <Mail size={12} className="text-gray-400" />
                        <span>{item.email}</span>
                      </div>
                    </td>

                    {/* Category & Branch */}
                    <td className="px-5 py-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                        {item.category}
                      </span>
                      {item.branch && (
                        <div className="flex items-center gap-1 text-gray-500 mt-1">
                          <MapPin size={12} className="text-gray-400 shrink-0" />
                          <span className="truncate max-w-[160px]">{item.branch}</span>
                        </div>
                      )}
                    </td>

                    {/* Visit Date */}
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-400" />
                        <span>{item.visit_date}</span>
                      </div>
                    </td>

                    {/* Details Preview */}
                    <td className="px-5 py-4 max-w-xs">
                      <p className="text-gray-700 line-clamp-2 leading-relaxed">
                        {item.details}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openDetailModal(item)}
                          className="p-1.5 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                          title="View Details & Update"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details & Status Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Complaint Report #{selectedComplaint.id}
                </h3>
                <p className="text-xs text-gray-500">
                  Submitted on {selectedComplaint.created_at ? new Date(selectedComplaint.created_at).toLocaleString() : 'N/A'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateStatusAndNotes} className="p-6 space-y-5">
              {/* Complainant Grid */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs">
                <div>
                  <span className="text-gray-500 font-medium">Patient Name:</span>
                  <p className="font-bold text-gray-900 mt-0.5">{selectedComplaint.full_name}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Phone Number:</span>
                  <p className="font-bold text-gray-900 mt-0.5">
                    <a href={`tel:${selectedComplaint.phone}`} className="text-teal-600 hover:underline">
                      {selectedComplaint.phone}
                    </a>
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Email Address:</span>
                  <p className="font-bold text-gray-900 mt-0.5">
                    <a href={`mailto:${selectedComplaint.email}`} className="text-teal-600 hover:underline">
                      {selectedComplaint.email}
                    </a>
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Date of Visit:</span>
                  <p className="font-bold text-gray-900 mt-0.5">{selectedComplaint.visit_date}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Category:</span>
                  <p className="font-bold text-gray-900 mt-0.5">{selectedComplaint.category}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Branch Visited:</span>
                  <p className="font-bold text-gray-900 mt-0.5">{selectedComplaint.branch || 'Not Specified'}</p>
                </div>
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Grievance / Complaint Details
                </label>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {selectedComplaint.details}
                </div>
              </div>

              {/* Status Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Update Status
                  </label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value)}
                    className="w-full text-sm border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Internal Admin Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Called patient on Nov 6, issue resolved..."
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    className="w-full text-sm border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition shadow-xs"
                >
                  <Save size={14} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
