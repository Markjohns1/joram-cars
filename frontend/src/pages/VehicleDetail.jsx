/**
 * Vehicle Detail Page
 * 
 * Premium layout with immersive gallery and sticky sidebar.
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, Share2, Heart,
    Fuel, Gauge, Settings, Calendar, MapPin,
    Car, Palette, Zap, Eye, MessageCircle, Phone,
    Check, ShieldCheck
} from 'lucide-react';
import { Button, Badge, LoadingPage, Input, Textarea, Select, SEO } from '../components/common';
import { VehicleGrid } from '../components/vehicles';
import { vehiclesAPI, enquiriesAPI } from '../api';
import LeadCaptureModal from '../components/vehicles/LeadCaptureModal';
import {
    formatPrice, formatMileage, formatDate,
    getStatusLabel, getStatusColor, getImageUrl, getWhatsAppLink
} from '../utils/helpers';
import { ENQUIRY_TYPES, CONTACT_INFO } from '../utils/constants';

export default function VehicleDetail() {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [similarVehicles, setSimilarVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showEnquiryForm, setShowEnquiryForm] = useState(false);
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        message: '',
        enquiry_type: 'purchase',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        loadVehicle();
        window.scrollTo(0, 0);
    }, [id]);

    const loadVehicle = async () => {
        setIsLoading(true);
        try {
            const vehicleData = await vehiclesAPI.getById(id);
            setVehicle(vehicleData);

            // Load similar vehicles
            const similar = await vehiclesAPI.getAll({
                make: vehicleData.make,
                limit: 4,
            });
            setSimilarVehicles(similar.items.filter(v => v.id !== id).slice(0, 4));
        } catch (error) {
            // Error managed by local state
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        try {
            await enquiriesAPI.create({
                ...formData,
                vehicle_id: id,
            });
            setSubmitSuccess(true);
            setFormData({
                customer_name: '',
                customer_email: '',
                customer_phone: '',
                message: '',
                enquiry_type: 'purchase',
            });
        } catch (error) {
            setSubmitError('Failed to submit enquiry. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <LoadingPage />;
    if (!vehicle) return <div>Vehicle not found</div>;

    const images = vehicle.images || [];
    const currentImage = images[currentImageIndex]?.image_url || vehicle.primary_image;

    const specs = [
        { icon: Calendar, label: 'Year', value: vehicle.year },
        { icon: Gauge, label: 'Mileage', value: formatMileage(vehicle.mileage) },
        { icon: Settings, label: 'Transmission', value: vehicle.transmission },
        { icon: Fuel, label: 'Fuel Type', value: vehicle.fuel_type },
        { icon: Car, label: 'Body Type', value: vehicle.body_type },
        { icon: Palette, label: 'Color', value: vehicle.color },
        { icon: Zap, label: 'Engine', value: vehicle.engine_capacity },
        { icon: MapPin, label: 'Location', value: vehicle.location },
    ];

    const whatsappMessage = `Hi, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} listed at ${formatPrice(vehicle.price, vehicle.currency)}. Is it still available?`;

    const vehicleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ''}`,
        "image": getImageUrl(vehicle.primary_image),
        "description": vehicle.description,
        "brand": {
            "@type": "Brand",
            "name": vehicle.make
        },
        "model": vehicle.model,
        "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": vehicle.currency || "KSH",
            "price": vehicle.price,
            "availability": "https://schema.org/InStock",
            "itemCondition": vehicle.condition === 'Foreign Used' ? "https://schema.org/UsedCondition" : "https://schema.org/NewCondition"
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-20">
            <SEO
                title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                description={`Verified ${vehicle.year} ${vehicle.make} ${vehicle.model} for sale at Joram Cars. Price: ${formatPrice(vehicle.price, vehicle.currency)}. Mileage: ${formatMileage(vehicle.mileage)}.`}
                image={getImageUrl(vehicle.primary_image)}
                type="article"
                jsonLd={vehicleJsonLd}
            />
            <div className="container">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
                    <Link to="/" className="hover:text-primary">Home</Link>
                    <ChevronRight size={14} />
                    <Link to="/vehicles" className="hover:text-primary">Vehicles</Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-900 font-medium">{vehicle.make} {vehicle.model}</span>
                </nav>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Main Content (Left) */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Gallery */}
                        <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100">
                            <div className="relative aspect-[4/3] md:aspect-[16/10] bg-gray-100 rounded-2xl overflow-hidden">
                                <img
                                    src={currentImage ? getImageUrl(currentImage) : '/placeholder-car.jpg'}
                                    alt={vehicle.title}
                                    className="w-full h-full object-cover"
                                />

                                <div className="absolute top-4 left-4">
                                    <Badge variant={getStatusColor(vehicle.availability_status)} className="shadow-lg backdrop-blur-md">
                                        {getStatusLabel(vehicle.availability_status)}
                                    </Badge>
                                </div>

                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setCurrentImageIndex(i => i === 0 ? images.length - 1 : i - 1)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow-lg transition-all"
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                        <button
                                            onClick={() => setCurrentImageIndex(i => i === images.length - 1 ? 0 : i + 1)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow-lg transition-all"
                                        >
                                            <ChevronRight size={24} />
                                        </button>
                                    </>
                                )}
                            </div>

                            {images.length > 1 && (
                                <div className="flex gap-2 p-2 overflow-x-auto">
                                    {images.map((img, index) => (
                                        <button
                                            key={img.id}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all ${index === currentImageIndex
                                                ? 'ring-2 ring-primary ring-offset-2'
                                                : 'opacity-70 hover:opacity-100'
                                                }`}
                                        >
                                            <img
                                                src={getImageUrl(img.image_url)}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Title & Price (Mobile Only) */}
                        <div className="lg:hidden bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                            </h1>
                            <p className="text-3xl font-bold text-primary mb-4">
                                {formatPrice(vehicle.price, vehicle.currency)}
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => setIsLeadModalOpen(true)}
                                    className="btn-premium btn-premium-whatsapp w-full flex items-center justify-center gap-2"
                                >
                                    <MessageCircle size={20} /> WhatsApp
                                </button>
                                <Button
                                    onClick={() => setShowEnquiryForm(!showEnquiryForm)}
                                    className="w-full"
                                >
                                    Enquire Now
                                </Button>
                            </div>
                        </div>

                        {/* Specifications */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold mb-6">Vehicle Specifications</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4">
                                {specs.map((spec, index) => (
                                    <div key={index} className="flex flex-col">
                                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                                            <spec.icon size={16} />
                                            <span className="text-xs uppercase tracking-wider font-semibold">{spec.label}</span>
                                        </div>
                                        <span className="text-lg font-semibold text-gray-900">{spec.value || 'N/A'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold mb-6">Description</h2>
                            <div className="prose prose-blue max-w-none text-gray-600">
                                <p className="whitespace-pre-line leading-relaxed">{vehicle.description}</p>
                            </div>
                        </div>

                        {/* Features */}
                        {vehicle.features?.length > 0 && (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                                <h2 className="text-xl font-bold mb-6">Features</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {vehicle.features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                <Check size={14} className="text-green-600" />
                                            </div>
                                            <span className="text-gray-700 font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="hidden lg:block lg:col-span-4 space-y-6">
                        <div className="sticky top-24 space-y-6">
                            {/* Main Card */}
                            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                                    {vehicle.year} {vehicle.make} {vehicle.model}
                                </h1>

                                <div className="flex items-end gap-2 mb-6">
                                    <span className="text-4xl font-bold text-primary">
                                        {formatPrice(vehicle.price, vehicle.currency)}
                                    </span>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                                        <ShieldCheck className="text-green-500" />
                                        <span className="text-sm font-medium">Verified & Inspected</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                                        <Eye className="text-blue-500" />
                                        <span className="text-sm font-medium">{vehicle.views_count} people viewed this</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => setIsLeadModalOpen(true)}
                                        className="btn-premium btn-premium-whatsapp w-full h-14 text-lg shadow-green-200 flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle size={20} />
                                        Chat on WhatsApp
                                    </button>

                                    <a
                                        href={`tel:${CONTACT_INFO.phone}`}
                                        className="btn-premium btn-premium-outline w-full h-14 text-lg border-gray-200 text-slate-700 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-600 flex items-center justify-center gap-2"
                                    >
                                        <Phone size={20} />
                                        Call {CONTACT_INFO.phone}
                                    </a>

                                    <Button
                                        onClick={() => setShowEnquiryForm(!showEnquiryForm)}
                                        size="lg"
                                        className="w-full"
                                    >
                                        Send Enquiry
                                    </Button>
                                </div>
                            </div>

                            {/* Enquiry Form */}
                            <AnimatePresence>
                                {showEnquiryForm && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6"
                                    >
                                        <h3 className="font-bold text-lg mb-4">Send Message</h3>
                                        {submitSuccess ? (
                                            <div className="text-center py-8">
                                                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                                                    <Check className="text-green-500" size={24} />
                                                </div>
                                                <h3 className="font-semibold text-green-700 mb-2">Enquiry Sent!</h3>
                                                <p className="text-sm text-gray-500">We'll get back to you shortly.</p>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                <Input
                                                    placeholder="Your Name"
                                                    value={formData.customer_name}
                                                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                                    required
                                                    className="bg-gray-50"
                                                />
                                                <Input
                                                    placeholder="Phone Number"
                                                    value={formData.customer_phone}
                                                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                                                    required
                                                    className="bg-gray-50"
                                                />
                                                <Input
                                                    type="email"
                                                    placeholder="Email Address"
                                                    value={formData.customer_email}
                                                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                                                    required
                                                    className="bg-gray-50"
                                                />
                                                <Textarea
                                                    placeholder="I'm interested in this vehicle..."
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    rows={3}
                                                    className="bg-gray-50"
                                                />
                                                <Button type="submit" className="w-full" isLoading={isSubmitting}>
                                                    Send Message
                                                </Button>
                                            </form>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Similar Vehicles */}
                {similarVehicles.length > 0 && (
                    <section className="mt-20">
                        <h2 className="text-2xl font-bold mb-8">Similar Vehicles You Might Like</h2>
                        <VehicleGrid vehicles={similarVehicles} />
                    </section>
                )}


                <LeadCaptureModal
                    isOpen={isLeadModalOpen}
                    onClose={() => setIsLeadModalOpen(false)}
                    vehicle={vehicle}
                    whatsappLink={getWhatsAppLink(whatsappMessage)}
                />
            </div>
        </div>
    );
}
