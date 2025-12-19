import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Upload, Trash2, ArrowLeft, ArrowRight, Check, Image as ImageIcon, Sparkles, Database, Camera, Plus } from 'lucide-react';
import { AdminLayout } from './components';
import { Button, Input, Select, LoadingPage } from '../../components/common';
import { vehiclesAPI } from '../../api';
import { BODY_TYPES, TRANSMISSION_TYPES, FUEL_TYPES, CONDITION_TYPES, CURRENCY_TYPES, AVAILABILITY_STATUS } from '../../utils/constants';
import { cn } from '../../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
    { id: 1, title: 'Identity', icon: Database, description: 'Basic vehicle info' },
    { id: 2, title: 'Performance', icon: Sparkles, description: 'Specs & power' },
    { id: 3, title: 'Visuals', icon: Camera, description: 'Vehicle media' },
    { id: 4, title: 'Finalize', icon: Check, description: 'Price & status' }
];

export default function VehicleForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        make: '', model: '', year: new Date().getFullYear(), trim: '',
        price: '', currency: 'KSH',
        mileage: '', condition: 'Foreign Used',
        body_type: 'SUV', transmission: 'Automatic', fuel_type: 'Petrol',
        color: '', engine_capacity: '',
        location: 'Nairobi',
        description: '',
        availability_status: 'available',
        is_featured: false,
        features: []
    });

    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);

    // Load data if edit mode
    useEffect(() => {
        if (isEditMode) {
            loadVehicle();
        }
    }, [id]);

    const loadVehicle = async () => {
        try {
            const data = await vehiclesAPI.getById(id);
            setFormData({
                make: data.make || '',
                model: data.model || '',
                year: data.year || new Date().getFullYear(),
                trim: data.trim || '',
                price: data.price || '',
                currency: data.currency || 'KSH',
                mileage: data.mileage || '',
                condition: data.condition || 'Foreign Used',
                body_type: data.body_type || 'SUV',
                transmission: data.transmission || 'Automatic',
                fuel_type: data.fuel_type || 'Petrol',
                color: data.color || '',
                engine_capacity: data.engine_capacity || '',
                location: data.location || 'Nairobi',
                description: data.description || '',
                availability_status: data.availability_status || 'available',
                is_featured: data.is_featured || false,
                features: data.features || []
            });
            setImages(data.images || []);
        } catch (error) {
            navigate('/admin/vehicles');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleNext = () => currentStep < 4 && setCurrentStep(prev => prev + 1);
    const handlePrev = () => currentStep > 1 && setCurrentStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        try {
            const payload = {
                ...formData,
                year: parseInt(formData.year),
                price: parseFloat(formData.price),
                mileage: parseInt(formData.mileage) || 0
            };

            let vehicleId = id;
            if (isEditMode) {
                await vehiclesAPI.update(id, payload);
            } else {
                const newVehicle = await vehiclesAPI.create(payload);
                vehicleId = newVehicle.id;
            }
            navigate('/admin/vehicles');
        } catch (error) {
            alert('Failed to save vehicle. Please check required fields.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (!isEditMode && !formData.make) {
            alert('Please fill out Basic Info (Make/Model) first to save the vehicle before uploading images.');
            setCurrentStep(1);
            return;
        }

        setUploadingImage(true);
        try {
            let vehicleId = id;
            if (!isEditMode) {
                // Auto-save vehicle to get an ID for uploads
                const payload = {
                    ...formData,
                    year: parseInt(formData.year),
                    price: parseFloat(formData.price) || 0,
                    mileage: parseInt(formData.mileage) || 0
                };
                const newVehicle = await vehiclesAPI.create(payload);
                vehicleId = newVehicle.id;
                // Update URL to edit mode so user doesn't create duplicate on final save
                window.history.replaceState(null, '', `/admin/vehicles/${vehicleId}/edit`);
                navigate(`/admin/vehicles/${vehicleId}/edit`, { replace: true });
            }

            for (const file of files) {
                const response = await vehiclesAPI.uploadImage(vehicleId, file, {
                    is_primary: images.length === 0
                });
                setImages(prev => [...prev, response]);
            }
        } catch (error) {
            alert('Failed to upload one or more images.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleDeleteImage = async (imageId) => {
        try {
            await vehiclesAPI.deleteImage(imageId);
            setImages(prev => prev.filter(img => img.id !== imageId));
        } catch (error) {
            alert('Failed to delete image');
        }
    };

    if (initialLoading) return <LoadingPage />;

    return (
        <AdminLayout
            title={isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}
            actions={
                <Button variant="secondary" onClick={() => navigate('/admin/vehicles')}>
                    Cancel
                </Button>
            }
        >
            <div className="max-w-5xl mx-auto pb-24">
                {/* Wizard Progress - Desktop */}
                <div className="mb-10 hidden sm:flex items-center justify-between px-4 sm:px-0">
                    {STEPS.map((step, idx) => {
                        const Icon = step.icon;
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;

                        return (
                            <div key={step.id} className="flex flex-1 items-center last:flex-none">
                                <div className="flex flex-col items-center group cursor-pointer" onClick={() => (isCompleted || isActive) && setCurrentStep(step.id)}>
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm",
                                        isActive ? "bg-blue-600 text-white scale-110 shadow-blue-500/20" :
                                            isCompleted ? "bg-green-500 text-white" : "bg-white text-slate-400 border border-slate-100"
                                    )}>
                                        {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                                    </div>
                                    <div className="mt-2 text-center overflow-hidden">
                                        <p className={cn(
                                            "text-[10px] font-black uppercase tracking-widest transition-colors",
                                            isActive ? "text-blue-600" : "text-slate-400"
                                        )}>{step.title}</p>
                                    </div>
                                </div>
                                {idx < STEPS.length - 1 && (
                                    <div className="flex-1 h-[2px] mx-4 bg-slate-100 relative">
                                        <div className={cn("absolute inset-0 bg-blue-600 transition-all duration-700 ease-in-out", isCompleted ? "w-full" : "w-0")} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Wizard Progress - Mobile Condensed */}
                <div className="sm:hidden mb-8 px-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Step {currentStep} of {STEPS.length}</span>
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">{STEPS.find(s => s.id === currentStep).title}</h2>
                        </div>
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                            {(() => {
                                const Icon = STEPS.find(s => s.id === currentStep).icon;
                                return <Icon size={20} />;
                            })()}
                        </div>
                    </div>
                    {/* Simple Progress Bar */}
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full"
                            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Form Steps */}
                <div className="bg-white border border-slate-200 rounded-[5px] overflow-hidden shadow-sm">
                    <div className="p-8 sm:p-12">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                {currentStep === 1 && (
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <Input label="Make" name="make" value={formData.make} onChange={handleChange} required placeholder="e.g. Toyota" />
                                        <Input label="Model" name="model" value={formData.model} onChange={handleChange} required placeholder="e.g. Prado" />
                                        <Input label="Year" name="year" type="number" value={formData.year} onChange={handleChange} required />
                                        <Input label="Trim / Suffix" name="trim" value={formData.trim} onChange={handleChange} placeholder="e.g. TX-L" />
                                        <Select label="Condition" name="condition" value={formData.condition} onChange={handleChange} options={CONDITION_TYPES} />
                                        <Input label="Mileage (KM)" name="mileage" type="number" value={formData.mileage} onChange={handleChange} placeholder="e.g. 45000" />
                                        <Input label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Kileleshwa" />
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        <Select label="Body Type" name="body_type" value={formData.body_type} onChange={handleChange} options={BODY_TYPES} />
                                        <Select label="Transmission" name="transmission" value={formData.transmission} onChange={handleChange} options={TRANSMISSION_TYPES} />
                                        <Select label="Fuel Type" name="fuel_type" value={formData.fuel_type} onChange={handleChange} options={FUEL_TYPES} />
                                        <Input label="Engine (e.g. 2.8L)" name="engine_capacity" value={formData.engine_capacity} onChange={handleChange} />
                                        <Input label="External Color" name="color" value={formData.color} onChange={handleChange} />
                                        <div className="flex flex-col justify-end pb-2">
                                            <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                                <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                                <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Feature in Home</span>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900 uppercase">Vehicle Gallery</h3>
                                                <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Upload at least 4 photos for best results</p>
                                            </div>
                                            <Button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="rounded-full px-6 shadow-lg shadow-blue-500/20"
                                                disabled={uploadingImage}
                                            >
                                                {uploadingImage ? 'Uploading...' : <><Upload size={18} className="mr-2" /> Select Photos</>}
                                            </Button>
                                            <input type="file" multiple hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            {images.map((img, idx) => (
                                                <div key={img.id} className="group relative aspect-[4/3] rounded-2xl bg-slate-100 overflow-hidden border-2 border-slate-100 hover:border-blue-500/50 transition-all">
                                                    <img src={img.image_url} alt="Vehicle" className="w-full h-full object-cover" />
                                                    {img.is_primary && (
                                                        <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rounded-md shadow-lg">Main</div>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteImage(img.id)}
                                                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-sm shadow-md transition-all active:scale-95 z-10"
                                                        title="Delete Image"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all group"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-2 group-hover:bg-blue-100 transition-colors">
                                                    <Plus size={20} />
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Add More</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 4 && (
                                    <div className="space-y-10">
                                        <div className="grid md:grid-cols-2 gap-10">
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="col-span-2">
                                                        <Input label="Asking Price" name="price" type="number" value={formData.price} onChange={handleChange} required placeholder="e.g. 3200000" />
                                                    </div>
                                                    <Select label="Currency" name="currency" value={formData.currency} onChange={handleChange} options={CURRENCY_TYPES} />
                                                </div>
                                                <Select label="Inventory Status" name="availability_status" value={formData.availability_status} onChange={handleChange} options={AVAILABILITY_STATUS} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Professional Description</label>
                                                <textarea
                                                    name="description"
                                                    rows="6"
                                                    className="w-full p-6 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm leading-relaxed"
                                                    placeholder="Highlight the key selling points of this vehicle..."
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="p-8 bg-blue-50/50 border border-slate-200 rounded-[5px]">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                                                    <Sparkles size={20} />
                                                </div>
                                                <h4 className="font-black text-slate-900 uppercase">Review & Finish</h4>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed mb-6">
                                                You are about to list a <span className="font-bold text-slate-900">{formData.year} {formData.make} {formData.model}</span> for <span className="font-bold text-blue-600">{formData.currency} {parseFloat(formData.price).toLocaleString()}</span>.
                                                Ensure all details are accurate before saving.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Footer */}
                    <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <Button
                            variant="secondary"
                            onClick={handlePrev}
                            disabled={currentStep === 1 || isLoading}
                            className="rounded-full px-8"
                        >
                            <ArrowLeft size={18} className="mr-2" /> Back
                        </Button>

                        <div className="flex gap-4">
                            {currentStep < 4 ? (
                                <Button
                                    onClick={handleNext}
                                    className="rounded-full px-10 shadow-lg shadow-blue-500/20"
                                >
                                    Proceed <ArrowRight size={18} className="ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="rounded-full px-12 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20"
                                >
                                    {isLoading ? 'Processing...' : <><Check size={18} className="mr-2" /> Finish Listing</>}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
