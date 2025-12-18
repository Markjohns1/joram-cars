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
                                <div className="p-6 md:w-1/3 bg-gray-50 border-r border-gray-100 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{req.make} {req.model}</h3>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex justify-between">
                                                <span>Year</span>
                                                <span className="font-semibold">{req.year}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Mileage</span>
                                                <span className="font-semibold">{req.mileage?.toLocaleString()} km</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Asking Price</span>
                                                <span className="font-bold text-primary">{formatPrice(req.price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-gray-200">
                                        <Badge variant={getStatusColor(req.status)}>
                                            {getStatusLabel(req.status)}
                                        </Badge>
                                        <span className="text-xs text-gray-400 block mt-2">
                                            Submitted {formatDate(req.created_at)}
                                        </span>
                                    </div>
                                </div>

                                {/* Customer & Actions (Right) */}
                                <div className="p-6 md:w-2/3 flex flex-col">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{req.user_name}</h4>
                                                <p className="text-sm text-gray-500">{req.user_email}</p>
                                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                    <Phone size={12} /> {req.user_phone}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {req.condition && (
                                        <div className="mb-6 p-4 bg-gray-50 rounded-xl text-sm italic text-gray-600 border border-gray-100">
                                            "{req.condition}"
                                        </div>
                                    )}

                                    <div className="mt-auto flex justify-end gap-3">
                                        {req.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(req.id, 'rejected')}
                                                    className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                                                >
                                                    <X size={16} /> Reject
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(req.id, 'contacted')}
                                                    className="px-4 py-2 text-sm font-bold text-white bg-[#0A2540] hover:bg-blue-900 rounded-lg shadow-md transition-all flex items-center gap-2"
                                                >
                                                    <Check size={16} /> Contact Seller
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
