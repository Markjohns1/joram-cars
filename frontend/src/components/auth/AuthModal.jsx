import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, LogIn } from 'lucide-react';
import { Button, Input } from '../common';
import { authAPI } from '../../api'; // We'll need to ensure this exists/is updated
import { useAuth } from '../../context/AuthContext'; // Assuming we have an AuthContext

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
    const [mode, setMode] = useState(initialMode); // 'login' or 'register'
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth(); // Hook to update global auth state

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (mode === 'login') {
                await login(formData.email, formData.password);
                onClose();
            } else {
                // Register logic (we might need to add register endpoint to API if not exists)
                // For now, let's assume register returns same structure or auto-logs in
                await authAPI.register(formData);
                // Then login
                await login(formData.email, formData.password);
                onClose();
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-slate-50 border-b border-gray-100 p-6 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">
                            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        {error && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {mode === 'register' && (
                                <>
                                    <Input
                                        icon={User}
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                    <Input
                                        icon={Phone}
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                    />
                                </>
                            )}

                            <Input
                                icon={Mail}
                                type="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />

                            <Input
                                icon={Lock}
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                            />

                            <Button
                                type="submit"
                                isLoading={isLoading}
                                className="w-full btn-premium btn-premium-primary"
                            >
                                {mode === 'login' ? 'Sign In' : 'Create Account'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-slate-600">
                                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                                <button
                                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                                    className="ml-2 font-bold text-brand-primary hover:underline"
                                >
                                    {mode === 'login' ? 'Register' : 'Login'}
                                </button>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
