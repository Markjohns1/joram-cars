/**
 * Contact Page
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Check } from 'lucide-react';
import { Button, Input, Textarea, Select } from '../components/common';
import { enquiriesAPI } from '../api';
import { ENQUIRY_TYPES, CONTACT_INFO } from '../utils/constants';
import { getWhatsAppLink } from '../utils/helpers';

export default function Contact() {
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        enquiry_type: 'general',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await enquiriesAPI.create(formData);
            setIsSuccess(true);
            setFormData({
                customer_name: '',
                customer_email: '',
                customer_phone: '',
                enquiry_type: 'general',
                message: '',
            });
        } catch (err) {
            setError('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        { icon: Phone, label: 'Phone', value: CONTACT_INFO.phone, href: `tel:${CONTACT_INFO.phone}` },
        { icon: Mail, label: 'Email', value: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
        { icon: MapPin, label: 'Address', value: CONTACT_INFO.address },
        { icon: Clock, label: 'Hours', value: CONTACT_INFO.businessHours },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="bg-gradient-hero text-white py-16">
                <div className="container text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl lg:text-5xl font-bold mb-4"
                    >
                        Contact Us
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-white/80 max-w-2xl mx-auto"
                    >
                        Have questions? We'd love to hear from you. Reach out to us anytime.
                    </motion.p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold">Get in Touch</h2>
                            <p className="text-gray-600">
                                We're here to help with any questions about our vehicles or services.
                            </p>

                            <div className="space-y-4">
                                {contactInfo.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <item.icon size={20} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{item.label}</p>
                                            {item.href ? (
                                                <a href={item.href} className="text-gray-600 hover:text-primary">
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <p className="text-gray-600">{item.value}</p>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* WhatsApp Button */}
                            <a
                                href={getWhatsAppLink('Hi, I have a question about Joram Cars.')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-whatsapp w-full"
                            >
                                <MessageCircle size={20} />
                                Chat on WhatsApp
                            </a>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl shadow-lg p-6 lg:p-8"
                            >
                                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

                                {isSuccess ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                                            <Check size={32} className="text-green-500" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-green-700 mb-2">Message Sent!</h3>
                                        <p className="text-gray-600 mb-6">We'll get back to you as soon as possible.</p>
                                        <Button onClick={() => setIsSuccess(false)}>Send Another Message</Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <Input
                                                label="Your Name *"
                                                placeholder="Enter your name"
                                                value={formData.customer_name}
                                                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                                required
                                            />
                                            <Input
                                                label="Email *"
                                                type="email"
                                                placeholder="your@email.com"
                                                value={formData.customer_email}
                                                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <Input
                                                label="Phone Number *"
                                                placeholder="0712 345 678"
                                                value={formData.customer_phone}
                                                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                                                required
                                            />
                                            <Select
                                                label="Subject"
                                                options={ENQUIRY_TYPES}
                                                value={formData.enquiry_type}
                                                onChange={(e) => setFormData({ ...formData, enquiry_type: e.target.value })}
                                            />
                                        </div>

                                        <Textarea
                                            label="Message *"
                                            placeholder="How can we help you?"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            rows={5}
                                            required
                                        />

                                        {error && (
                                            <p className="text-red-500 text-sm">{error}</p>
                                        )}

                                        <Button type="submit" isLoading={isSubmitting} className="w-full md:w-auto">
                                            <Send size={18} />
                                            Send Message
                                        </Button>
                                    </form>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
