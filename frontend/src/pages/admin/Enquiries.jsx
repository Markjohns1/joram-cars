/**
 * Admin Enquiries Page
 * 
 * Clean inbox style list.
 */

import { useState, useEffect } from 'react';
import { Search, Mail, Phone, Calendar, CheckCircle, Clock, X, ExternalLink, Car } from 'lucide-react';
import { AdminLayout } from './components';
import { Badge, EmptyState } from '../../components/common';
import { enquiriesAPI } from '../../api';
import { formatDate, formatPrice } from '../../utils/helpers';

export default function AdminEnquiries() {
    const [enquiries, setEnquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const [selectedEnquiry, setSelectedEnquiry] = useState(null);

    useEffect(() => {
        loadEnquiries();
    }, []);

    const loadEnquiries = async () => {
        setIsLoading(true);
        try {
            const data = await enquiriesAPI.getAll({ limit: 20 });
            setEnquiries(data.items || []);
        } catch (error) {
            // Management handled by layout
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await enquiriesAPI.updateStatus(id, { status: 'contacted' });
            loadEnquiries();
            if (selectedEnquiry?.id === id) {
                setSelectedEnquiry(prev => ({ ...prev, status: 'contacted' }));
            }
        } catch (error) {
            // Silently fail update
        }
    };

    return (
        <AdminLayout title="Enquiries">
            <div className="gsc-table-container min-h-[600px]">
                {/* Toolbar */}
                <div className="p-6 border-b border-black flex items-center justify-between bg-white">
                    <div className="flex gap-2 p-1 bg-white border border-slate-100">
                        {['all', 'new', 'contacted', 'qualified', 'closed'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filter === status
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                {isLoading ? (
                    <div className="p-20 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading messages...</p>
                    </div>
                ) : enquiries.length === 0 ? (
                    <EmptyState
                        title="No enquiries yet"
                        description="Customer messages will appear here."
                        icon={Mail}
                    />
                ) : (
                    <div className="bg-white">
                        {enquiries.filter(e => filter === 'all' || e.status === filter).map((enquiry) => (
                            <div
                                key={enquiry.id}
                                onClick={() => setSelectedEnquiry(enquiry)}
                                className={`p-6 border-b border-black hover:bg-blue-50/30 transition-all cursor-pointer group relative ${enquiry.status === 'new' ? 'bg-white' : 'bg-slate-50/30'
                                    }`}
                            >
                                {enquiry.status === 'new' && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-blue-600" />
                                )}

                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 border flex items-center justify-center text-white font-black text-sm
                                            ${enquiry.status === 'new' ? 'bg-blue-600 border-blue-600' : 'bg-slate-300 border-slate-300'}
                                        `}>
                                            {enquiry.customer_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className={`text-base font-bold tracking-tight ${enquiry.status === 'new' ? 'text-slate-950' : 'text-slate-600'}`}>
                                                {enquiry.customer_name}
                                            </h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{enquiry.customer_email}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full">
                                        <Clock size={10} />
                                        {formatDate(enquiry.created_at)}
                                    </span>
                                </div>

                                <div className="ml-14">
                                    {enquiry.vehicle && (
                                        <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-[9px] text-blue-600 font-black uppercase tracking-widest border border-blue-100/50">
                                            <Car size={10} />
                                            <span>{enquiry.vehicle.year} {enquiry.vehicle.make} {enquiry.vehicle.model}</span>
                                        </div>
                                    )}

                                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-1 mb-2 font-medium">
                                        {enquiry.message}
                                    </p>

                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1">
                                            <ExternalLink size={10} />
                                            Open detail view
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedEnquiry && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setSelectedEnquiry(null)} />
                    <div className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
                        <div className="p-10">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-[24px] bg-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-blue-500/40">
                                        {(selectedEnquiry.customer_name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-950 tracking-tight">{selectedEnquiry.customer_name}</h2>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{selectedEnquiry.customer_email}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedEnquiry(null)} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-950 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <a href={`tel:${selectedEnquiry.customer_phone}`} className="flex flex-col p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-50 transition-colors group">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</span>
                                        <span className="text-sm font-bold text-slate-950 group-hover:text-blue-600">{selectedEnquiry.customer_phone || 'N/A'}</span>
                                    </a>
                                    <div className="flex flex-col p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Received On</span>
                                        <span className="text-sm font-bold text-slate-950">{formatDate(selectedEnquiry.created_at)}</span>
                                    </div>
                                </div>

                                {selectedEnquiry.vehicle && (
                                    <div className="p-5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white shadow-xl shadow-blue-500/20">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-2 block">Interested In</span>
                                        <h4 className="text-lg font-black">{selectedEnquiry.vehicle.year} {selectedEnquiry.vehicle.make} {selectedEnquiry.vehicle.model}</h4>
                                        <div className="flex items-center gap-2 mt-2 opacity-80 text-xs font-bold uppercase tracking-widest">
                                            <span>Price: {formatPrice(selectedEnquiry.vehicle.price)}</span>
                                            <div className="w-1 h-1 bg-white rounded-full opacity-40" />
                                            <span>ID: {selectedEnquiry.vehicle.id.slice(0, 8)}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 relative">
                                    <div className="absolute -top-3 left-8 px-4 py-1 bg-white border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400">Message</div>
                                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium lowercase first-letter:uppercase">
                                        {selectedEnquiry.message}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-10 flex gap-4">
                                {selectedEnquiry.status === 'new' && (
                                    <button
                                        onClick={() => handleMarkRead(selectedEnquiry.id)}
                                        className="flex-1 h-14 bg-white border-2 border-slate-100 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-slate-950 hover:bg-slate-50 transition-all"
                                    >
                                        Mark as Contacted
                                    </button>
                                )}
                                <a
                                    href={`mailto:${selectedEnquiry.customer_email}`}
                                    className="flex-[2] h-14 bg-blue-600 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-white flex items-center justify-center shadow-2xl shadow-blue-500/40 hover:-translate-y-1 transition-all"
                                >
                                    Reply via Email
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
