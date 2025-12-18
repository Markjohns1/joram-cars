/**
 * Admin Enquiries Page
 * 
 * Clean inbox style list.
 */

import { useState, useEffect } from 'react';
import { Search, Mail, Phone, Calendar, CheckCircle, Clock } from 'lucide-react';
import { AdminLayout } from './components';
import { Badge, EmptyState } from '../../components/common';
import { enquiriesAPI } from '../../api';
import { formatDate } from '../../utils/helpers';

export default function AdminEnquiries() {
    const [enquiries, setEnquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadEnquiries();
    }, []);

    const loadEnquiries = async () => {
        setIsLoading(true);
        try {
            const data = await enquiriesAPI.getAll({ limit: 10 });
            setEnquiries(data.items || []);
        } catch (error) {
            console.error('Failed to load enquiries');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkRead = async (id) => {
        // Implement mark as read logic
        await enquiriesAPI.updateStatus(id, { status: 'read' });
        loadEnquiries();
    };

    return (
        <AdminLayout title="Enquiries">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Toolbar */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex gap-2">
                        {['all', 'unread', 'read'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === status
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                {isLoading ? (
                    <div className="p-12 text-center text-gray-400">Loading messages...</div>
                ) : enquiries.length === 0 ? (
                    <EmptyState
                        title="No enquiries yet"
                        description="Customer messages will appear here."
                        icon={Mail}
                    />
                ) : (
                    <div className="divide-y divide-gray-50">
                        {enquiries.map((enquiry) => (
                            <div
                                key={enquiry.id}
                                className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer group ${enquiry.status === 'unread' ? 'bg-blue-50/30' : ''
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                                            ${enquiry.status === 'unread' ? 'bg-blue-500' : 'bg-gray-300'}
                                        `}>
                                            {enquiry.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className={`text-sm font-bold ${enquiry.status === 'unread' ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {enquiry.name}
                                            </h3>
                                            <p className="text-xs text-gray-400">{enquiry.email}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                        <Clock size={12} />
                                        {formatDate(enquiry.created_at)}
                                    </span>
                                </div>

                                <div className="pl-13 ml-13 md:ml-13 pl-13">
                                    {/* Subject/Vehicle Context */}
                                    {enquiry.vehicle && (
                                        <div className="mb-2 inline-flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600 font-medium">
                                            <span>Re: {enquiry.vehicle.year} {enquiry.vehicle.make} {enquiry.vehicle.model}</span>
                                        </div>
                                    )}

                                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                        {enquiry.message}
                                    </p>

                                    <div className="mt-3 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="text-xs font-bold text-blue-600 hover:underline">Reply via Email</button>
                                        {enquiry.phone && (
                                            <a href={`tel:${enquiry.phone}`} className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1">
                                                <Phone size={12} /> Call {enquiry.phone}
                                            </a>
                                        )}
                                        {enquiry.status === 'unread' && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleMarkRead(enquiry.id); }}
                                                className="ml-auto text-xs text-blue-600 font-medium flex items-center gap-1"
                                            >
                                                <CheckCircle size={12} /> Mark as Read
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
