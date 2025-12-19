/**
 * Admin Sell Requests Page
 * 
 * Management for "Sell My Car" submissions.
 */

import { useState, useEffect } from 'react';
import { DollarSign, User, Phone, Car, Check, X, Clock } from 'lucide-react';
import { AdminLayout } from './components';
import { Badge, EmptyState } from '../../components/common';
import { sellRequestsAPI } from '../../api';
import { formatDate, formatPrice, getStatusColor, getStatusLabel } from '../../utils/helpers';

export default function AdminSellRequests() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setIsLoading(true);
        try {
            const data = await sellRequestsAPI.getAll({ limit: 20 });
            setRequests(data.items || []);
        } catch (error) {
            console.error('Failed to load sell requests');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        if (confirm(`Mark request as ${newStatus}?`)) {
            try {
                await sellRequestsAPI.updateStatus(id, { status: newStatus });
                loadRequests();
                if (selectedRequest?.id === id) {
                    setSelectedRequest(prev => ({ ...prev, status: newStatus }));
                }
            } catch (error) {
                console.error('Failed to update status');
            }
        }
    };

    return (
        <AdminLayout title="Sell Requests">
            <div className="space-y-0 gsc-table-container pb-12">
                {isLoading ? (
                    <div className="p-20 text-center">
                        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Syncing requests...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="bg-white border-y border-slate-100 p-20">
                        <EmptyState
                            title="No sell requests"
                            description="Submissions from 'Sell Your Car' will appear here."
                            icon={DollarSign}
                        />
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {requests.map((req) => (
                            <div
                                key={req.id}
                                onClick={() => setSelectedRequest(req)}
                                className="group bg-white border-b border-black overflow-hidden flex flex-col md:flex-row hover:bg-slate-50/50 transition-all duration-300 cursor-pointer"
                            >
                                {/* Car Info (Left) */}
                                <div className="p-10 md:w-1/3 bg-slate-50/50 border-r border-slate-100 flex flex-col justify-between group-hover:bg-blue-50/30 transition-colors">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                                <Car size={16} />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600/60">Inventory Request</span>
                                        </div>
                                        <h3 className="text-2xl font-black tracking-tight text-slate-950 mb-6">{req.vehicle_make} {req.vehicle_model}</h3>
                                        <div className="space-y-4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                                            <div className="flex justify-between items-center bg-white/50 p-3 rounded-xl border border-white">
                                                <span>Production Year</span>
                                                <span className="text-slate-900">{req.vehicle_year}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-white/50 p-3 rounded-xl border border-white">
                                                <span>Verified Mileage</span>
                                                <span className="text-slate-900">{req.mileage?.toLocaleString()} km</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <span className="text-[9px] opacity-60">Expected Payout</span>
                                                <span className="text-xl font-black text-blue-600">{formatPrice(req.asking_price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-10 flex flex-col gap-3">
                                        <Badge variant={getStatusColor(req.status)} className="w-fit px-4 py-1.5 rounded-full text-[9px] tracking-[0.2em]">
                                            {getStatusLabel(req.status)}
                                        </Badge>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                            <Clock size={12} />
                                            Added {formatDate(req.created_at)}
                                        </span>
                                    </div>
                                </div>

                                {/* Customer & Actions (Right) */}
                                <div className="p-10 md:w-2/3 flex flex-col relative">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 bg-slate-950 text-white flex items-center justify-center font-black text-xl shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-transparent" />
                                                <span className="relative z-10">{(req.customer_name || 'U').charAt(0).toUpperCase()}</span>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black tracking-tight text-slate-950">{req.customer_name}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{req.customer_email}</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <a href={`tel:${req.customer_phone}`} className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100/50 hover:bg-green-100 transition-colors">
                                                        <Phone size={10} /> {req.customer_phone}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hidden group-hover:flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-blue-600 animate-in fade-in slide-in-from-right-4 duration-500">
                                            Open detail <X size={14} className="rotate-45" />
                                        </div>
                                    </div>

                                    {req.description && (
                                        <div className="mb-8 p-8 bg-slate-50/50 rounded-[32px] text-sm font-medium text-slate-600 border border-slate-100 leading-relaxed italic relative">
                                            <div className="absolute -top-3 left-8 px-4 py-1 bg-white border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400">Seller Note</div>
                                            "{req.description}"
                                        </div>
                                    )}

                                    <div className="mt-auto flex justify-end gap-3 pt-6 border-t border-slate-50">
                                        {req.status === 'pending' && (
                                            <button
                                                className="px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-blue-600 hover:bg-blue-700 border shadow-lg translate-y-0 hover:-translate-y-1 transition-all"
                                            >
                                                Review Request
                                            </button>
                                        )}
                                        {req.status !== 'pending' && (
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Handled</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setSelectedRequest(null)} />
                    <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
                        <div className="p-10">
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-[24px] bg-slate-950 flex items-center justify-center text-white text-2xl font-black shadow-2xl">
                                        {(selectedRequest.customer_name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-950 tracking-tight">{selectedRequest.customer_name}</h2>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{selectedRequest.customer_email}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedRequest(null)} className="p-3 bg-slate-100 rounded-full text-slate-400 hover:text-slate-950 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 mb-10">
                                <div className="space-y-6">
                                    <div className="p-8 bg-blue-600 rounded-[32px] text-white shadow-xl shadow-blue-500/30">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-3 block text-blue-100">Vehicle Specifications</span>
                                        <h3 className="text-xl font-black mb-6">{selectedRequest.vehicle_make} {selectedRequest.vehicle_model}</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest bg-white/10 p-2.5 rounded-xl border border-white/5">
                                                <span>Year</span>
                                                <span>{selectedRequest.vehicle_year}</span>
                                            </div>
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest bg-white/10 p-2.5 rounded-xl border border-white/5">
                                                <span>Mileage</span>
                                                <span>{selectedRequest.mileage?.toLocaleString()} km</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <span className="text-[9px]">Asking Price</span>
                                                <span className="text-2xl font-black">{formatPrice(selectedRequest.asking_price)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <a href={`tel:${selectedRequest.customer_phone}`} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col group transition-all hover:bg-green-50">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Phone</span>
                                            <span className="text-sm font-black text-slate-950 group-hover:text-green-600">{selectedRequest.customer_phone}</span>
                                        </a>
                                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</span>
                                            <Badge variant={getStatusColor(selectedRequest.status)}>{getStatusLabel(selectedRequest.status)}</Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 flex flex-col">
                                    <div className="flex-1 p-8 bg-slate-50 rounded-[32px] border border-slate-100 relative">
                                        <div className="absolute -top-3 left-8 px-4 py-1 bg-white border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400">Request Body</div>
                                        <p className="text-slate-600 text-sm leading-relaxed font-medium">
                                            {selectedRequest.description || "No additional description provided by the seller."}
                                        </p>
                                    </div>

                                    <div className="h-32 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-center border-dashed">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">No photos uploaded</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                {selectedRequest.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleUpdateStatus(selectedRequest.id, 'rejected')}
                                            className="flex-1 h-16 bg-white border-2 border-red-100 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-50 transition-all"
                                        >
                                            Reject Request
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(selectedRequest.id, 'reviewing')}
                                            className="flex-[2] h-16 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 hover:-translate-y-1 transition-all"
                                        >
                                            Start Review
                                        </button>
                                    </>
                                )}
                                {selectedRequest.status === 'reviewing' && (
                                    <button
                                        onClick={() => handleUpdateStatus(selectedRequest.id, 'valued')}
                                        className="w-full h-16 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 hover:-translate-y-1 transition-all"
                                    >
                                        Mark as Valued
                                    </button>
                                )}
                                {selectedRequest.status === 'valued' && (
                                    <button
                                        onClick={() => handleUpdateStatus(selectedRequest.id, 'accepted')}
                                        className="w-full h-16 bg-green-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-green-500/30 hover:-translate-y-1 transition-all"
                                    >
                                        Accept Into Inventory
                                    </button>
                                )}
                                {selectedRequest.status === 'accepted' && (
                                    <div className="w-full h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 gap-2">
                                        <Check size={18} /> Request Completed
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
