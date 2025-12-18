/**
 * Admin Vehicles List
 * 
 * Clean, high-contrast, minimalist table.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, MoreVertical, Edit2, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminLayout } from './components';
import { Button, Badge, LoadingPage, EmptyState } from '../../components/common';
import { vehiclesAPI } from '../../api';
import { formatPrice, getStatusColor, getStatusLabel } from '../../utils/helpers';

export default function AdminVehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        setIsLoading(true);
        try {
            const data = await vehiclesAPI.getAll({ limit: 10 }); // Limited fetch as requested
            setVehicles(data.items);
        } catch (error) {
            console.error('Error loading vehicles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this vehicle?')) {
            await vehiclesAPI.delete(id);
            loadVehicles();
        }
    };

    return (
        <AdminLayout
            title="Inventory"
            actions={
                <Link to="/admin/vehicles/new">
                    <Button className="rounded-full shadow-lg shadow-blue-900/20">
                        <Plus size={18} /> Add Vehicle
                    </Button>
                </Link>
            }
        >
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Toolbar */}
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search inventory..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-gray-900 font-medium placeholder:text-gray-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                {isLoading ? (
                    <div className="p-12 text-center text-gray-400">Loading inventory...</div>
                ) : vehicles.length === 0 ? (
                    <EmptyState title="No vehicles found" description="Get started by adding your first vehicle." />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-left">
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Vehicle</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Price</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {vehicles.map((vehicle) => (
                                    <tr key={vehicle.id} className="group hover:bg-gray-50/80 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-12 rounded-lg bg-gray-200 overflow-hidden shadow-sm">
                                                    {vehicle.primary_image && (
                                                        <img
                                                            src={vehicle.primary_image}
                                                            alt={vehicle.model}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{vehicle.make} {vehicle.model}</div>
                                                    <div className="text-xs text-gray-500">{vehicle.year} • {vehicle.trim}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-bold text-gray-900">{formatPrice(vehicle.price)}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <Badge variant={getStatusColor(vehicle.availability_status)}>
                                                {getStatusLabel(vehicle.availability_status)}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link to={`/admin/vehicles/${vehicle.id}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Edit2 size={16} />
                                                </Link>
                                                <button onClick={() => handleDelete(vehicle.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
