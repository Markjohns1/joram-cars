/**
 * Admin Login Page
 * 
 * High-contrast, spacious design with clear separation.
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../context';

export default function AdminLogin() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (isAuthenticated) {
        navigate('/admin', { replace: true });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/admin');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50 font-sans">
            {/* Left Side - Visual (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0A2540] relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-black/60 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
                />

                <div className="relative z-20 text-center p-12 max-w-lg">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl">
                        <Car className="text-white" size={40} />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-6">Admin Workspace</h1>
                    <p className="text-blue-100 text-lg leading-relaxed">
                        Secure access for inventory management, CRM, and system settings.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
                            <p className="text-gray-500">Welcome back! Please enter your details.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 flex items-center justify-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#0A2540] text-white font-bold py-4 rounded-xl hover:bg-[#061524] transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? 'Signing In...' : (
                                    <>Sign In <ArrowRight size={20} /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center bg-gray-50 rounded-xl py-3 -mb-2">
                            <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">
                                Return to Homepage
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
