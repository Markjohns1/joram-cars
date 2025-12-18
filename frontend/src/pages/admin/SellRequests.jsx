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
            await sellRequestsAPI.updateStatus(id, { status: newStatus });
            loadRequests();
        }
    };

    return (
        <AdminLayout title="Sell Requests">
            <div className="space-y-6">
                {isLoading ? (
                    <div className="p-12 text-center text-gray-400">Loading requests...</div>
                ) : requests.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12">
                        <EmptyState
                            title="No sell requests"
                            description="Submissions from 'Sell Your Car' will appear here."
                            icon={DollarSign}
                        />
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {requests.map((req) => (
                            <div key={req.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                                {/* Car Info (Left) */}
                                <div className="p-6 md:w-1/3 bg-slate-50 border-r border-slate-100 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-black tracking-tight text-slate-950 mb-4">{req.make} {req.model}</h3>
                                        <div className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                            <div className="flex justify-between">
                                                <span>Year</span>
                                                <span className="text-slate-900">{req.year}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Mileage</span>
                                                <span className="text-slate-900">{req.mileage?.toLocaleString()} km</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <span>Asking Price</span>
                                                <span className="text-base text-brand-primary">{formatPrice(req.price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-slate-200">
                                        <Badge variant={getStatusColor(req.status)}>
                                            {getStatusLabel(req.status)}
                                        </Badge>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mt-3">
                                            Submitted {formatDate(req.created_at)}
                                        </span>
                                    </div>
                                </div>

                                {/* Customer & Actions (Right) */}
                                <div className="p-6 md:w-2/3 flex flex-col">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-lg">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold tracking-tight text-slate-950">{req.user_name}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.user_email}</p>
                                                <p className="text-[10px] font-bold text-brand-primary flex items-center gap-1 mt-1 tracking-widest">
                                                    <Phone size={10} /> {req.user_phone}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {req.condition && (
                                        <div className="mb-8 p-5 bg-slate-50 rounded-2xl text-xs font-medium text-slate-600 border border-slate-100 leading-relaxed">
                                            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 italic">Seller's Note:</span>
                                            "{req.condition}"
                                        </div>
                                    )}

                                    <div className="mt-auto flex justify-end gap-3">
                                        {req.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(req.id, 'rejected')}
                                                    className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(req.id, 'contacted')}
                                                    className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xl translate-y-0 hover:-translate-y-1 transition-all"
                                                >
                                                    Contact Seller
                                                </button>
                                            </>
                                        )}
                                        {req.status === 'contacted' && (
                                            <button
                                                onClick={() => handleUpdateStatus(req.id, 'approved')}
                                                className="px-4 py-2 text-sm font-bold text-green-600 hover:bg-green-50 rounded-lg border border-green-200 transition-colors flex items-center gap-2"
                                            >
                                                <Check size={16} /> Mark Approved
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
