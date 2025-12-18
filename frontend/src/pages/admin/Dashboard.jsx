/**
 * Admin Dashboard
 * 
 * Overview of system statistics.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Car, MessageSquare, FileText, ArrowUpRight,
    TrendingUp, Eye, DollarSign
} from 'lucide-react';
import { AdminLayout } from './components';
import { adminAPI } from '../../api';

function StatCard({ title, value, icon: Icon, color, trend, link }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-${color}-500`}>
                <Icon size={80} />
            </div>

            <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-${color}-50 flex items-center justify-center text-${color}-600 mb-4`}>
                    <Icon size={24} />
                </div>

                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
                <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>

                {trend && (
                    <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                        <TrendingUp size={14} />
                        <span>{trend} increase</span>
                    </div>
                )}

                {link && (
                    <Link to={link} className="absolute inset-0 z-20" aria-label={`View ${title}`} />
                )}
            </div>
        </motion.div>
    );
}

function QuickAction({ title, icon: Icon, onClick, color }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all text-left group"
        >
            <div className={`w-12 h-12 rounded-full bg-${color}-50 flex items-center justify-center text-${color}-600 group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
            <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{title}</h3>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                    Perform Action <ArrowUpRight size={12} />
                </span>
            </div>
        </button>
    );
}

export default function Dashboard() {
    const [stats, setStats] = useState({
        total_vehicles: 0,
        total_views: 0,
        new_enquiries: 0,
        pending_sell_requests: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await adminAPI.getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout title="Dashboard">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Vehicles"
                    value={stats.total_vehicles}
                    icon={Car}
                    color="blue"
                    link="/admin/vehicles"
                />
                <StatCard
                    title="Total Views"
                    value={stats.total_views.toLocaleString()}
                    icon={Eye}
                    color="purple"
                    trend="12%"
                />
                <StatCard
                    title="New Enquiries"
                    value={stats.new_enquiries}
                    icon={MessageSquare}
                    color="green"
                    link="/admin/enquiries"
                />
                <StatCard
                    title="Sell Requests"
                    value={stats.pending_sell_requests}
                    icon={FileText}
                    color="orange"
                    link="/admin/sell-requests"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Activity / Content area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                            <select className="text-sm border-gray-200 rounded-lg p-2 bg-gray-50">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>

                        <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                            Chart Placeholder (Activity trends)
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="flex flex-col gap-3">
                            <Link to="/admin/vehicles/new">
                                <QuickAction title="Add New Vehicle" icon={Car} color="blue" />
                            </Link>
                            <Link to="/admin/enquiries">
                                <QuickAction title="Check Messages" icon={MessageSquare} color="green" />
                            </Link>
                            <Link to="/admin/sell-requests">
                                <QuickAction title="Value a Car" icon={DollarSign} color="orange" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
