/**
 * Sell Car Page (Mobile First Multi-Step Wizard)
 * 
 * Steps:
 * 1. Details (Make, Model, Year, Mileage)
 * 2. Photos (Upload up to 10)
 * 3. Contact (User Info)
 * 4. Submit (Review & Send)
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Check, ChevronRight, ChevronLeft, Upload, X } from 'lucide-react';
import { Button } from '../components/common';
import { sellRequestsAPI } from '../api';
import { cn } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

export default function SellCar() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        make: '', model: '', year: '', mileage: '',
        price: '', condition: 'good',
        user_name: '', user_phone: '', user_email: '',
        images: [] // Array of File objects or URLs
    });

    const steps = [
        { id: 1, label: 'Details' },
        { id: 2, label: 'Photos' },
        { id: 3, label: 'Contact' },
        { id: 4, label: 'Review' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await sellRequestsAPI.create(formData);
            alert('Request submitted efficiently! We will contact you shortly.');
            navigate('/');
        } catch (error) {
            console.error('Submission failed', error);
            alert('Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pb-24 pt-4 min-h-screen bg-gray-50/50">
            {/* Step Indicator */}
            <div className="px-6 mb-8">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200 -z-10" />
                    {steps.map((step) => (
                        <div key={step.id} className="flex flex-col items-center bg-gray-50 px-2 ring-4 ring-gray-50/50">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors",
                                currentStep >= step.id
                                    ? "bg-[#0066ff] border-[#0066ff] text-white"
                                    : "bg-white border-gray-300 text-gray-400"
                            )}>
                                {currentStep > step.id ? <Check size={16} /> : step.id}
                            </div>
                            <span className={cn(
                                "text-[10px] font-bold mt-1 uppercase tracking-wider",
                                currentStep >= step.id ? "text-[#0066ff]" : "text-gray-400"
                            )}>{step.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-4 max-w-lg mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    {currentStep === 1 && "Tell Us About Your Car"}
                    {currentStep === 2 && "Upload Photos"}
                    {currentStep === 3 && "Contact Information"}
                    {currentStep === 4 && "Review & Submit"}
                </h1>

                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                    {/* Step 1: Vehicle Details */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Make *</label>
                                    <input name="make" value={formData.make} onChange={handleChange} className="input" placeholder="e.g. Toyota" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Model *</label>
                                    <input name="model" value={formData.model} onChange={handleChange} className="input" placeholder="e.g. Vitz" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Year *</label>
                                    <input name="year" type="number" value={formData.year} onChange={handleChange} className="input" placeholder="2018" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Mileage (km) *</label>
                                    <input name="mileage" type="number" value={formData.mileage} onChange={handleChange} className="input" placeholder="78000" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Asking Price (KSh)</label>
                                <input name="price" type="number" value={formData.price} onChange={handleChange} className="input" placeholder="1200000" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Condition</label>
                                <div className="flex gap-4">
                                    {['Excellent', 'Good', 'Fair'].map(opt => (
                                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="condition"
                                                value={opt.toLowerCase()}
                                                checked={formData.condition === opt.toLowerCase()}
                                                onChange={handleChange}
                                                className="w-5 h-5 text-[#0066ff]"
                                            />
                                            <span className="text-gray-700 font-medium">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Photos */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-[#0066ff]">
                                    <Camera size={32} />
                                </div>
                                <h3 className="font-bold text-gray-900">Tap to add photos</h3>
                                <p className="text-sm text-gray-500 mt-1">Upload up to 10 images</p>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                                        <Upload size={20} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Contact */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Your Name *</label>
                                <input name="user_name" value={formData.user_name} onChange={handleChange} className="input" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number *</label>
                                <input name="user_phone" value={formData.user_phone} onChange={handleChange} className="input" placeholder="+254 700 000 000" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                <input name="user_email" type="email" value={formData.user_email} onChange={handleChange} className="input" placeholder="john@email.com" />
                            </div>
                        </div>
                    )}

                    {/* Step 4: Review */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-2">Vehicle Summary</h3>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subject</span>
                                    <span className="font-bold text-gray-900">{formData.year} {formData.make} {formData.model}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Price</span>
                                    <span className="font-bold text-[#0066ff]">KSh {Number(formData.price).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Contact</span>
                                    <span className="font-bold text-gray-900">{formData.user_name} ({formData.user_phone})</span>
                                </div>
                            </div>

                            <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                                <input type="checkbox" className="mt-1 w-5 h-5 text-[#0066ff] rounded" />
                                <span className="text-sm text-gray-600">I agree to the terms and confirmed valid ownership of this vehicle.</span>
                            </label>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4 mt-8 pt-4 border-t border-gray-100">
                        {currentStep > 1 && (
                            <Button variant="ghost" onClick={handlePrev} className="px-0 w-12 h-12 rounded-full border border-gray-200">
                                <ChevronLeft size={24} />
                            </Button>
                        )}

                        {currentStep < 4 ? (
                            <Button onClick={handleNext} className="flex-1 btn-primary h-12 text-base shadow-xl">
                                Continue <ChevronRight size={20} className="ml-1" />
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 btn-primary h-12 text-base shadow-xl bg-green-600 hover:bg-green-700">
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                            </Button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
