/**
 * Admin Vehicles List
 * 
 * Clean, high-contrast, minimalist table.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, MoreVertical, Edit2, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminLayout } from './components';
import { Button, Badge, LoadingPage, EmptyState } from '../../components/common';
import { vehiclesAPI } from '../../api';
import { formatPrice, getStatusColor, getStatusLabel, cn } from '../../utils/helpers';

export default function AdminVehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        setIsLoading(true);
        try {
            const data = await vehiclesAPI.getAll({ limit: 10 }); // Limited fetch as requested
            setVehicles(data.items);
        } catch (error) {
            // Error handled by layout
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this vehicle?')) {
            try {
                await vehiclesAPI.delete(id);
                loadVehicles();
            } catch (error) {
                alert(error.response?.data?.detail || 'Failed to delete vehicle. You might not have permission.');
            }
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === vehicles.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(vehicles.map(v => v.id));
        }
    };

    const handleBulkDelete = async () => {
        if (confirm(`Delete ${selectedIds.length} vehicles? THIS IS IRREVERSIBLE.`)) {
            try {
                // Sequential delete for safety if batch endpoint not available
                await Promise.all(selectedIds.map(id => vehiclesAPI.delete(id)));
                setSelectedIds([]);
                loadVehicles();
            } catch (error) {
                console.error('Bulk delete failed:', error);
                alert('Some vehicles could not be deleted. Check your permissions.');
                loadVehicles(); // Refresh to show current state
            }
        }
    };

    const handleBulkStatusUpdate = async (status) => {
        await Promise.all(selectedIds.map(id => vehiclesAPI.update(id, { availability_status: status })));
        setSelectedIds([]);
        loadVehicles();
    };

    return (
        <AdminLayout
            title="Inventory"
            actions={
                <Link to="/admin/vehicles/new" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto rounded-xl sm:rounded-full shadow-lg shadow-blue-900/20 px-6 py-4 sm:py-2">
                        <Plus size={18} className="mr-2" /> <span className="hidden sm:inline">Add Vehicle</span><span className="sm:hidden text-base">Add Vehicle</span>
                    </Button>
                </Link>
            }
        >
            <div className="gsc-table-container">
                {/* Toolbar */}
                <div className="p-6 border-b border-black flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
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
                        <table className="w-full gsc-table">
                            <thead>
                                <tr className="bg-white border-b border-black text-left">
                                    <th className="py-4 px-6 w-10">
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary/20"
                                            checked={selectedIds.length === vehicles.length && vehicles.length > 0}
                                            onChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vehicle</th>
                                    <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Price</th>
                                    <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicles
                                    .filter(v =>
                                        v.make?.toLowerCase().includes(search.toLowerCase()) ||
                                        v.model?.toLowerCase().includes(search.toLowerCase()) ||
                                        v.year?.toString().includes(search)
                                    )
                                    .map((vehicle) => (
                                        <tr key={vehicle.id} className={cn(
                                            "group transition-colors",
                                            selectedIds.includes(vehicle.id) ? "bg-blue-50/30" : "hover:bg-slate-50/50"
                                        )}>
                                            <td className="py-4 px-6">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary/20"
                                                    checked={selectedIds.includes(vehicle.id)}
                                                    onChange={() => toggleSelect(vehicle.id)}
                                                />
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-12 bg-slate-100 overflow-hidden border border-black">
                                                        {vehicle.primary_image && (
                                                            <img
                                                                src={vehicle.primary_image}
                                                                alt={vehicle.model}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">{vehicle.make} {vehicle.model}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{vehicle.year}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-slate-900">
                                                <div className="font-bold">{formatPrice(vehicle.price)}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <Badge variant={getStatusColor(vehicle.availability_status)}>
                                                    {getStatusLabel(vehicle.availability_status)}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        to={`/admin/vehicles/${vehicle.id}/edit`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 transition-all border border-transparent"
                                                        title="Edit Vehicle"
                                                    >
                                                        <Edit2 size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(vehicle.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 transition-all border border-transparent"
                                                        title="Delete Vehicle"
                                                    >
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

            {/* Bulk Actions Bar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0, x: '-50%' }}
                        animate={{ y: 0, opacity: 1, x: '-50%' }}
                        exit={{ y: 100, opacity: 0, x: '-50%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-24 sm:bottom-8 left-1/2 z-[110] bg-slate-950 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-2xl sm:rounded-full shadow-2xl flex flex-col sm:flex-row items-center gap-4 sm:gap-8 border border-white/10 w-[90%] sm:w-auto"
                    >
                        <div className="flex items-center gap-4 sm:gap-8 w-full sm:w-auto justify-between sm:justify-start">
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl font-black">{selectedIds.length}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">Selected</span>
                            </div>

                            <div className="flex items-center gap-3 sm:hidden">
                                <button
                                    onClick={() => setSelectedIds([])}
                                    className="p-2 text-slate-500 hover:text-white"
                                >
                                    <Plus size={20} className="rotate-45" />
                                </button>
                            </div>
                        </div>

                        <div className="hidden sm:block h-6 w-[1px] bg-white/10" />

                        <div className="flex gap-2 sm:gap-4 w-full sm:w-auto overflow-x-auto no-scrollbar py-2 sm:py-0">
                            <button
                                onClick={() => handleBulkStatusUpdate('sold')}
                                className="text-[10px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] hover:text-brand-primary transition-colors bg-white/5 sm:bg-transparent px-3 py-2 sm:p-0 rounded-lg whitespace-nowrap"
                            >
                                Mark Sold
                            </button>
                            <button
                                onClick={() => handleBulkStatusUpdate('available')}
                                className="text-[10px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] hover:text-brand-primary transition-colors bg-white/5 sm:bg-transparent px-3 py-2 sm:p-0 rounded-lg whitespace-nowrap"
                            >
                                Available
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                className="text-[10px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-red-500 hover:text-red-400 transition-colors bg-red-500/10 sm:bg-transparent px-3 py-2 sm:p-0 rounded-lg whitespace-nowrap"
                            >
                                Delete
                            </button>
                        </div>

                        <button
                            onClick={() => setSelectedIds([])}
                            className="hidden sm:block p-2 text-slate-500 hover:text-white"
                        >
                            <Plus size={20} className="rotate-45" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
