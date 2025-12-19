import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ShieldCheck, Save, AlertCircle } from 'lucide-react';
import { AdminLayout } from './components';
import { Button, Input } from '../../components/common';
import { authAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
    const { user, login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
        username: user?.username || '',
        password: '' // Optional password change
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const updatedUser = await authAPI.updateProfile(formData);
            setStatus({ type: 'success', message: 'Profile updated successfully!' });

            // If email/password changed, we might need to refresh auth or just update local user info
            // For now, let's just show success. 
            // Most profile updates don't require re-login unless session is invalidated.

            // Note: If you want to keep the context in sync:
            // login(updatedUser.email, formData.password || "KEEPCURRENT") 
            // is not ideal. Let's just update the local user via a context update if we had one.
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.detail || 'Failed to update profile'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout title="My Account">
            <div className="max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-200 rounded-[5px] overflow-hidden shadow-sm"
                >
                    <div className="p-8 border-b border-gray-50 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <User size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">{user?.full_name}</h2>
                            <p className="text-slate-500 text-sm">Manage your administrative credentials</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {status.message && (
                            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm ${status.type === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-100'
                                : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                {status.type === 'success' ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                                {status.message}
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                                <Input
                                    icon={User}
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                                <Input
                                    icon={Mail}
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Username</label>
                                <Input
                                    icon={User}
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">New Password (Optional)</label>
                                <Input
                                    icon={Lock}
                                    type="password"
                                    placeholder="Leave blank to keep current"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                className="btn-premium btn-premium-primary px-8"
                            >
                                <Save size={18} className="mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AdminLayout>
    );
}
