/**
 * Vehicles Listing Page
 * 
 * High-end inventory filtering and display.
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Filter, Search, ChevronDown, ChevronUp, Check, X,
    ArrowUpDown, Grid, List
} from 'lucide-react';
import { VehicleGrid } from '../components/vehicles';
import { Button, LoadingPage, EmptyState, SEO } from '../components/common';
import { vehiclesAPI } from '../api';
// Constants
const PRICES = [
    { label: 'Any Price', value: '' },
    { label: 'Under KSH 1M', value: '0-1000000' },
    { label: 'KSH 1M - 2.5M', value: '1000000-2500000' },
    { label: 'KSH 2.5M - 5M', value: '2500000-5000000' },
    { label: 'Above KSH 5M', value: '5000000-100000000' },
];

const BODY_TYPES = ['SUV', 'Sedan', 'Coupe', 'Convertible', 'Hatchback', 'Pickup', 'Van'];
const MAKES = ['Range Rover', 'Mercedes-Benz', 'BMW', 'Porsche', 'Toyota', 'Audi', 'Lexus', 'Land Rover', 'Volkswagen', 'Mazda'];
const LOCATIONS = ['Nairobi', 'Mombasa', 'Direct Import'];

export default function VehiclesListing() {
    const location = useLocation();
    const navigate = useNavigate();

    // State
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [totalItems, setTotalItems] = useState(0);

    // Filters State
    const [filters, setFilters] = useState({
        search: '',
        make: '',
        body_type: '',
        price_range: '',
        sort: 'created_at',
        order: 'desc',
        page: 1, // Added page
        limit: 20 // Added limit
    });

    // Local search state for debounce
    const [localSearch, setLocalSearch] = useState('');

    // Sync local search with URL filters on mount/update (only if different to avoid loop)
    useEffect(() => {
        if (filters.search !== localSearch) {
            setLocalSearch(filters.search || '');
        }
    }, [filters.search]);

    // Parse query params on load
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const newFilters = {
            ...filters,
            search: params.get('search') || '',
            make: params.get('make') || '',
            body_type: params.get('body_type') || '',
            price_range: params.get('price_range') || '',
            sort: params.get('sort') || 'created_at',
            order: params.get('order') || 'desc',
            page: parseInt(params.get('page')) || 1,
        };

        setFilters(newFilters);

        // Sync local search if it came from URL (e.g. from Hero search)
        const urlSearch = params.get('search') || '';
        if (urlSearch !== localSearch) {
            setLocalSearch(urlSearch);
        }
    }, [location.search]);

    // Fetch data when filters change
    useEffect(() => {
        loadVehicles();
    }, [filters]);

    const loadVehicles = async () => {
        setIsLoading(true);
        try {
            // Process price range
            let minPrice, maxPrice;
            if (filters.price_range) {
                [minPrice, maxPrice] = filters.price_range.split('-');
            }

            const data = await vehiclesAPI.getAll({
                make: filters.make || undefined,
                body_type: filters.body_type || undefined,
                min_price: minPrice,
                max_price: maxPrice,
                sort_by: filters.sort,
                sort_order: filters.order,
                search: filters.search || undefined,
                page: filters.page,
                limit: filters.limit,
                availability_status: 'available'
            });
            setVehicles(data.items);
            setTotalItems(data.total);
        } catch (error) {
            // Error handled by UI state
        } finally {
            setIsLoading(false);
        }
    };

    const updateFilter = (key, value) => {
        const newFilters = { ...filters, [key]: value };

        // Reset to page 1 if any filter other than 'page' changes
        if (key !== 'page') {
            newFilters.page = 1;
        }

        setFilters(newFilters);

        // Update URL
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([k, v]) => {
            if (v) params.append(k, v);
        });
        navigate({ search: params.toString() });
    };

    // Debounce search updates
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== (filters.search || '')) {
                updateFilter('search', localSearch);
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [localSearch]);

    const clearFilters = () => {
        setFilters({
            search: '',
            make: '',
            body_type: '',
            price_range: '',
            sort: 'created_at',
            order: 'desc',
            page: 1,
            limit: 20
        });
        navigate({ search: '' });
    };

    // Filter Section Component
    const FilterSection = ({ title, children, initialCount = 3 }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const childrenArray = React.Children.toArray(children);
        const hasMore = childrenArray.length > initialCount;
        const displayedChildren = isExpanded ? childrenArray : childrenArray.slice(0, initialCount);

        return (
            <div className="border-b border-slate-100 py-6 last:border-0">
                <h3 className="font-black text-slate-900 mb-5 text-[11px] uppercase tracking-[0.2em] flex justify-between items-center cursor-pointer group" onClick={() => setIsExpanded(!isExpanded)}>
                    {title}
                    <span className="text-slate-300 group-hover:text-blue-500 transition-colors">
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                </h3>
                <div className="space-y-3">
                    {displayedChildren}
                </div>
                {hasMore && !isExpanded && (
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="mt-4 text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest flex items-center gap-2"
                    >
                        View More Brands
                    </button>
                )}
            </div>
        );
    };

    const CheckboxFilter = ({ label, checked, onChange }) => (
        <label className="flex items-center gap-4 cursor-pointer group select-none py-1">
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${checked
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white border-slate-200 group-hover:border-blue-400'
                }`}>
                {checked && <Check size={14} strokeWidth={4} />}
            </div>
            <span className={`text-sm tracking-tight transition-colors ${checked ? 'text-slate-900 font-black italic' : 'text-slate-500 font-bold group-hover:text-slate-900'}`}>
                {label}
            </span>
            <input
                type="checkbox"
                className="hidden"
                checked={checked}
                onChange={onChange}
            />
        </label>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <SEO
                title="Inventory"
                description="Browse our wide selection of quality used cars in Kenya. Filter by make, model, price and more."
                canonical="/vehicles"
            />
            {isLoading ? <LoadingPage /> : (
                <>
                    {/* Header / Toolbar - Ultra-Premium Sticky */}
                    <div className="sticky top-[72px] z-20 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm">
                        <div className="container-premium py-5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic">
                                        Inventory<span className="text-blue-600">.</span>
                                    </h1>
                                    <div className="h-6 w-px bg-slate-200 hidden md:block" />
                                    <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                                        {totalItems} Available Units
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Mobile Filter Toggle */}
                                    <button
                                        onClick={() => setShowMobileFilters(true)}
                                        className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium"
                                    >
                                        <Filter size={18} /> Filters
                                    </button>

                                    {/* Sort Dropdown */}
                                    <div className="relative group">
                                        <select
                                            className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-gray-100 transition-colors"
                                            value={`${filters.sort}-${filters.order}`}
                                            onChange={(e) => {
                                                const [sort, order] = e.target.value.split('-');
                                                const newFilters = { ...filters, sort, order };
                                                setFilters(newFilters);
                                            }}
                                        >
                                            <option value="created_at-desc">Newest First</option>
                                            <option value="price-asc">Price: Low to High</option>
                                            <option value="price-desc">Price: High to Low</option>
                                            <option value="views_count-desc">Most Popular</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container py-8">
                        <div className="grid lg:grid-cols-4 gap-8">
                            {/* Sidebar Filters - Desktop */}
                            <div className="hidden lg:block space-y-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="font-bold text-lg">Filters</h2>
                                    {(filters.make || filters.body_type || filters.price_range || filters.search) && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-xs text-red-500 hover:text-red-600 font-medium"
                                        >
                                            Reset All
                                        </button>
                                    )}
                                </div>

                                <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-2xl shadow-slate-200/50">
                                    {/* Search */}
                                    <div className="mb-8">
                                        <div className="relative group">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                            <input
                                                type="text"
                                                placeholder="Model or keyword..."
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-bold"
                                                value={localSearch}
                                                onChange={(e) => setLocalSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <FilterSection title="Price Range">
                                        {PRICES.map((price) => (
                                            <label key={price.value} className="flex items-center gap-3 cursor-pointer group py-1 select-none">
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${filters.price_range === price.value
                                                    ? 'border-blue-600 ring-2 ring-blue-100'
                                                    : 'border-gray-300 group-hover:border-blue-500'
                                                    }`}>
                                                    {filters.price_range === price.value && (
                                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                                                    )}
                                                </div>
                                                <span className={`text-sm ${filters.price_range === price.value ? 'text-gray-900 font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                                    {price.label}
                                                </span>
                                                <input
                                                    type="radio"
                                                    className="hidden"
                                                    name="price_range"
                                                    checked={filters.price_range === price.value}
                                                    onChange={() => updateFilter('price_range', price.value)}
                                                />
                                            </label>
                                        ))}
                                    </FilterSection>

                                    <FilterSection title="Make">
                                        {MAKES.map((make) => (
                                            <CheckboxFilter
                                                key={make}
                                                label={make}
                                                checked={filters.make === make}
                                                onChange={() => updateFilter('make', filters.make === make ? '' : make)}
                                            />
                                        ))}
                                    </FilterSection>

                                    <FilterSection title="Body Type">
                                        {BODY_TYPES.map((type) => (
                                            <CheckboxFilter
                                                key={type}
                                                label={type}
                                                checked={filters.body_type === type}
                                                onChange={() => updateFilter('body_type', filters.body_type === type ? '' : type)}
                                            />
                                        ))}
                                    </FilterSection>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="lg:col-span-3">
                                {filters.make || filters.body_type || filters.search ? (
                                    <div className="mb-8 flex flex-wrap gap-3">
                                        {filters.search && (
                                            <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all hover:bg-blue-600">
                                                Search: {filters.search}
                                                <button onClick={() => updateFilter('search', '')} className="hover:scale-125 transition-transform"><X size={14} /></button>
                                            </div>
                                        )}
                                        {filters.make && (
                                            <div className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all hover:bg-slate-900">
                                                Brand: {filters.make}
                                                <button onClick={() => updateFilter('make', '')} className="hover:scale-125 transition-transform"><X size={14} /></button>
                                            </div>
                                        )}
                                        {filters.body_type && (
                                            <div className="px-4 py-2 bg-white border border-slate-200 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all hover:border-blue-500">
                                                Type: {filters.body_type}
                                                <button onClick={() => updateFilter('body_type', '')} className="hover:scale-125 transition-transform"><X size={14} /></button>
                                            </div>
                                        )}
                                    </div>
                                ) : null}

                                <VehicleGrid
                                    vehicles={vehicles}
                                    isLoading={isLoading}
                                    emptyTitle="No vehicles found"
                                    emptyDescription="Try adjusting your filters to find what you're looking for."
                                />

                                {/* Pagination Controls */}
                                {!isLoading && totalItems > filters.limit && (
                                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-100 pt-8">
                                        <div className="text-sm font-medium text-gray-500 order-2 sm:order-1">
                                            Showing <span className="text-gray-900 font-bold">{vehicles.length}</span> of <span className="text-gray-900 font-bold">{totalItems}</span> vehicles
                                        </div>

                                        <div className="flex items-center gap-2 order-1 sm:order-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => updateFilter('page', Math.max(1, filters.page - 1))}
                                                disabled={filters.page === 1}
                                                className="h-10 px-4 text-xs font-bold uppercase tracking-widest disabled:opacity-30"
                                            >
                                                Previous
                                            </Button>

                                            <div className="h-10 min-w-[3rem] px-4 bg-gray-900 text-white flex items-center justify-center text-xs font-black rounded-lg">
                                                {filters.page}
                                            </div>

                                            <Button
                                                variant="outline"
                                                onClick={() => updateFilter('page', filters.page + 1)}
                                                disabled={filters.page * filters.limit >= totalItems}
                                                className="h-10 px-4 text-xs font-bold uppercase tracking-widest disabled:opacity-30"
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Filters Modal */}
                    {showMobileFilters && (
                        <div className="fixed inset-0 z-[100] lg:hidden flex justify-end">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => setShowMobileFilters(false)}
                            />
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                className="relative w-full max-w-sm bg-white h-screen flex flex-col shadow-2xl"
                            >
                                {/* Header */}
                                <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                                    <h2 className="text-xl font-black italic tracking-tighter">FILTERS</h2>
                                    <button
                                        onClick={() => setShowMobileFilters(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Scrollable Content */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
                                    {/* Search */}
                                    <div>
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                placeholder="Search keyword..."
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium"
                                                value={localSearch}
                                                onChange={(e) => setLocalSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Price Range */}
                                    <FilterSection title="Price Range">
                                        <div className="space-y-1">
                                            {PRICES.map((price) => (
                                                <label key={price.value} className="flex items-center gap-3 cursor-pointer group py-3 select-none">
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${filters.price_range === price.value
                                                        ? 'border-blue-600 bg-blue-600'
                                                        : 'border-gray-200 group-hover:border-blue-400'
                                                        }`}>
                                                        {filters.price_range === price.value && (
                                                            <Check size={14} className="text-white stroke-[3px]" />
                                                        )}
                                                    </div>
                                                    <span className={`text-sm ${filters.price_range === price.value ? 'text-gray-900 font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                                        {price.label}
                                                    </span>
                                                    <input
                                                        type="radio"
                                                        className="hidden"
                                                        name="mobile_price_range"
                                                        checked={filters.price_range === price.value}
                                                        onChange={() => updateFilter('price_range', price.value)}
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </FilterSection>

                                    {/* Make */}
                                    <FilterSection title="Make">
                                        <div className="space-y-1">
                                            {MAKES.map((make) => (
                                                <CheckboxFilter
                                                    key={make}
                                                    label={make}
                                                    checked={filters.make === make}
                                                    onChange={() => updateFilter('make', filters.make === make ? '' : make)}
                                                />
                                            ))}
                                        </div>
                                    </FilterSection>

                                    {/* Body Type */}
                                    <FilterSection title="Body Type">
                                        <div className="space-y-1">
                                            {BODY_TYPES.map((type) => (
                                                <CheckboxFilter
                                                    key={type}
                                                    label={type}
                                                    checked={filters.body_type === type}
                                                    onChange={() => updateFilter('body_type', filters.body_type === type ? '' : type)}
                                                />
                                            ))}
                                        </div>
                                    </FilterSection>
                                </div>

                                {/* Sticky Footer - Always visible and not cut off */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 space-y-3 z-10 safe-area-bottom">
                                    {(filters.make || filters.body_type || filters.price_range || filters.search) && (
                                        <button
                                            onClick={clearFilters}
                                            className="w-full py-2 text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-widest"
                                        >
                                            Reset All Filters
                                        </button>
                                    )}
                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowMobileFilters(false)}
                                            className="flex-1 h-14 text-xs font-black uppercase tracking-widest border-2 hover:bg-gray-50"
                                        >
                                            Close
                                        </Button>
                                        <Button
                                            onClick={() => setShowMobileFilters(false)}
                                            className="flex-[2] h-14 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20"
                                        >
                                            Show {totalItems} Vehicles
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
