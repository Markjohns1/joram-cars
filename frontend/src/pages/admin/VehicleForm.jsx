/**
 * Vehicle Form Component
 * 
 * Clean, organized form for adding/editing vehicles.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Upload, Trash2, ArrowLeft } from 'lucide-react';
import { AdminLayout } from './components';
import { Button, Input, Select, LoadingPage } from '../../components/common';
import { vehiclesAPI } from '../../api';
import { BODY_TYPES, TRANSMISSION_TYPES, FUEL_TYPES, CONDITION_TYPES, CURRENCY_TYPES } from '../../utils/constants';

export default function VehicleForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [isLoading, setIsLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);

    // Form State - Split for clarity
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

    // Load data if edit mode
    useEffect(() => {
        if (isEditMode) {
            loadVehicle();
        }
    }, [id]);

    const loadVehicle = async () => {
        try {
            const data = await vehiclesAPI.getById(id);
            setFormData(prev => ({ ...prev, ...data }));
        } catch (error) {
            console.error('Failed to load vehicle');
            navigate('/admin/vehicles');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = {
                ...formData,
                year: parseInt(formData.year),
                price: parseFloat(formData.price),
                mileage: parseInt(formData.mileage) || 0
            };

            if (isEditMode) {
                await vehiclesAPI.update(id, payload);
            } else {
                await vehiclesAPI.create(payload);
            }
            navigate('/admin/vehicles');
        } catch (error) {
            alert('Failed to save vehicle');
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
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-10">

                {/* Basic Information Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Basic Information</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input label="Make" name="make" value={formData.make} onChange={handleChange} required placeholder="e.g. Toyota" />
                        <Input label="Model" name="model" value={formData.model} onChange={handleChange} required placeholder="e.g. Prado" />

                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Year" name="year" type="number" value={formData.year} onChange={handleChange} required />
                            <Input label="Trim / Suffix" name="trim" value={formData.trim} onChange={handleChange} placeholder="e.g. TX-L" />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <Input label="Price" name="price" type="number" value={formData.price} onChange={handleChange} required />
                            </div>
                            <Select label="Currency" name="currency" value={formData.currency} onChange={handleChange} options={CURRENCY_TYPES.map(c => ({ value: c, label: c }))} />
                        </div>
                    </div>
                </div>

                {/* Specs Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Specifications</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <Select label="Body Type" name="body_type" value={formData.body_type} onChange={handleChange} options={BODY_TYPES.map(t => ({ value: t, label: t }))} />
                        <Select label="Transmission" name="transmission" value={formData.transmission} onChange={handleChange} options={TRANSMISSION_TYPES.map(t => ({ value: t, label: t }))} />
                        <Select label="Fuel Type" name="fuel_type" value={formData.fuel_type} onChange={handleChange} options={FUEL_TYPES.map(t => ({ value: t, label: t }))} />

                        <Input label="Mileage (km)" name="mileage" type="number" value={formData.mileage} onChange={handleChange} />
                        <Input label="Engine Capacity" name="engine_capacity" value={formData.engine_capacity} onChange={handleChange} placeholder="e.g. 2800cc" />
                        <Select label="Condition" name="condition" value={formData.condition} onChange={handleChange} options={CONDITION_TYPES.map(c => ({ value: c, label: c }))} />

                        <Input label="Color" name="color" value={formData.color} onChange={handleChange} />
                        <Input label="Location" name="location" value={formData.location} onChange={handleChange} />
                    </div>
                </div>

                {/* Description Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Description & Status</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                name="description"
                                rows="4"
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_featured"
                                        checked={formData.is_featured}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="font-medium text-gray-700">Feature on Homepage</span>
                                </label>
                            </div>

                            <div className="flex-1 max-w-xs">
                                <Select
                                    label="Access Status"
                                    name="availability_status"
                                    value={formData.availability_status}
                                    onChange={handleChange}
                                    options={[
                                        { value: 'available', label: 'Available' },
                                        { value: 'sold', label: 'Sold' },
                                        { value: 'reserved', label: 'Reserved' },
                                        { value: 'direct_import', label: 'Direct Import' }
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="fixed bottom-0 left-0 right-0 lg:left-72 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 flex items-center justify-end gap-4 z-40">
                    <Button variant="secondary" onClick={() => navigate('/admin/vehicles')}>Cancel</Button>
                    <Button type="submit" disabled={isLoading} className="shadow-xl">
                        {isLoading ? 'Saving...' : (
                            <><Save size={18} /> Save Vehicle</>
                        )}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
