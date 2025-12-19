import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, User, Phone, Mail, Check } from 'lucide-react';
import { Button, Input } from '../common';
import { leadsAPI } from '../../api';

export default function LeadCaptureModal({ isOpen, onClose, vehicle, whatsappLink }) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Capture Lead (Implicit User Creation)
            await leadsAPI.capture({
                ...formData,
                vehicle_id: vehicle.id,
                message: `Interested in ${vehicle.year} ${vehicle.make} ${vehicle.model}`
            });

            // Redirect to WhatsApp
            window.open(whatsappLink, '_blank');
            onClose();
        } catch (error) {
            // Fallback: still open WhatsApp if backend fails
            window.open(whatsappLink, '_blank');
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6"
                >
                    <button onClick={onClose} className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
                        <X size={18} />
                    </button>

                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-[#25D366]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageCircle size={32} className="text-[#25D366]" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Start Purchase</h2>
                        <p className="text-slate-600 text-sm mt-1">Please provide your details to continue to WhatsApp.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            icon={User}
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="bg-slate-50 border-slate-200"
                        />
                        <Input
                            icon={Phone}
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            required
                            className="bg-slate-50 border-slate-200"
                        />
                        <Input
                            icon={Mail}
                            type="email"
                            placeholder="Email (Optional)"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="bg-slate-50 border-slate-200"
                        />

                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="w-full btn-premium btn-premium-whatsapp h-12 text-base shadow-lg shadow-green-100"
                        >
                            Continue to WhatsApp
                        </Button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
