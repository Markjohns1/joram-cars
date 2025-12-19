import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Shield, User, Trash2, Mail, Clock, AlertCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AdminLayout } from './components';
import { Button, Input } from '../../components/common';
import { adminAPI } from '../../api';

export default function UsersManagement() {
    const location = useLocation();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(location.pathname === '/admin/users/new');
    const [error, setError] = useState('');
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        full_name: '',
        password: '',
        role: 'staff'
    });

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        setIsCreating(location.pathname === '/admin/users/new');
    }, [location.pathname]);

    const loadUsers = async () => {
        try {
            const data = await adminAPI.getUsers();
            setUsers(data);
        } catch (err) {
            // Managed by UI load state
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setError('');

        // Frontend validation for Max 2 Admins
        if (newUser.role === 'admin') {
            const adminCount = users.filter(u => u.role === 'admin').length;
            if (adminCount >= 2) {
                setError('Maximum of 2 admin accounts allowed for security.');
                return;
            }
        }

        try {
            await adminAPI.createUser(newUser);
            await loadUsers();
            setIsCreating(false);
            setNewUser({ username: '', email: '', full_name: '', password: '', role: 'staff' });
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to create user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await adminAPI.deleteUser(userId);
            loadUsers();
        } catch (err) {
            // Silently fail, user can retry
        }
    };

    return (
        <AdminLayout
            title="User Management"
            actions={
                <Link to="/admin/users/new">
                    <Button
                        className="btn-premium btn-premium-primary whitespace-nowrap flex-shrink-0"
                    >
                        <UserPlus size={18} className="mr-2" />
                        <span className="hidden sm:inline">Add New User</span><span className="sm:hidden">Add User</span>
                    </Button>
                </Link>
            }
        >
            <div className="mb-6">
                <p className="text-slate-500 text-sm">Manage team access and permissions.</p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-sm">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {/* Create User Form */}
            {isCreating && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm"
                >
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <UserPlus size={20} className="text-blue-600" />
                        New Account
                    </h3>
                    <form onSubmit={handleCreateUser} className="grid md:grid-cols-3 gap-6">
                        <Input
                            placeholder="Full Name"
                            value={newUser.full_name}
                            onChange={e => setNewUser({ ...newUser, full_name: e.target.value })}
                            required
                        />
                        <Input
                            placeholder="Username"
                            value={newUser.username}
                            onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                            required
                        />
                        <Input
                            placeholder="Email"
                            type="email"
                            value={newUser.email}
                            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                            required
                        />
                        <Input
                            placeholder="Password"
                            type="password"
                            value={newUser.password}
                            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                            required
                        />
                        <select
                            className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            value={newUser.role}
                            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                        >
                            <option value="staff">Staff Member</option>
                            <option value="admin">Administrator (Max 2)</option>
                        </select>
                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1 btn-premium btn-premium-primary">Create</Button>
                            <Button type="button" onClick={() => navigate('/admin/users')} className="bg-slate-100 text-slate-600 h-12 px-6 rounded-xl font-bold">Cancel</Button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Users Table */}
            <div className="gsc-table-container mt-8">
                <div className="overflow-x-auto">
                    <table className="w-full text-left gsc-table">
                        <thead className="bg-white border-b border-black">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">User</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden sm:table-cell">Role</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden md:table-cell">Last Login</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${u.role === 'admin' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {u.full_name?.charAt(0) || u.username?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{u.full_name || u.username}</p>
                                                <p className="text-xs text-slate-500">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden sm:table-cell">
                                        <div className="flex items-center gap-2">
                                            {u.role === 'admin' ? <Shield size={14} className="text-blue-600" /> : <User size={14} className="text-slate-400" />}
                                            <span className={`text-xs font-bold uppercase tracking-wider ${u.role === 'admin' ? 'text-blue-600' : 'text-slate-500'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Clock size={14} />
                                            {u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-green-50 text-green-600">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDeleteUser(u.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 transition-all border border-transparent"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
