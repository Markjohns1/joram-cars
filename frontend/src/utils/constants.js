/**
 * Application Constants
 */

// Body types
export const BODY_TYPES = [
    { value: 'SUV', label: 'SUV' },
    { value: 'Sedan', label: 'Sedan' },
    { value: 'Hatchback', label: 'Hatchback' },
    { value: 'Pickup', label: 'Pickup' },
    { value: 'Convertible', label: 'Convertible' },
    { value: 'Van', label: 'Van' },
    { value: 'Wagon', label: 'Wagon' },
    { value: 'Coupe', label: 'Coupe' },
];

// Transmission types
export const TRANSMISSION_TYPES = [
    { value: 'Automatic', label: 'Automatic' },
    { value: 'Manual', label: 'Manual' },
];

// Fuel types
export const FUEL_TYPES = [
    { value: 'Petrol', label: 'Petrol' },
    { value: 'Diesel', label: 'Diesel' },
    { value: 'Hybrid', label: 'Hybrid' },
    { value: 'Electric', label: 'Electric' },
];

// Condition types
export const CONDITION_TYPES = [
    { value: 'Excellent', label: 'Excellent' },
    { value: 'Good', label: 'Good' },
    { value: 'Fair', label: 'Fair' },
];

// Availability status
export const AVAILABILITY_STATUS = [
    { value: 'available', label: 'Available' },
    { value: 'direct_import', label: 'Direct Import' },
    { value: 'sold', label: 'Sold' },
    { value: 'reserved', label: 'Reserved' },
];

// Currency types
export const CURRENCY_TYPES = [
    { value: 'KSH', label: 'KSH' },
    { value: 'USD', label: 'USD' },
    { value: 'GBP', label: 'GBP' },
    { value: 'JPY', label: 'JPY' },
];

// Price ranges for quick filter
export const PRICE_RANGES = [
    { min: 0, max: 500000, label: 'Under 500K' },
    { min: 500000, max: 1000000, label: '500K - 1M' },
    { min: 1000000, max: 2000000, label: '1M - 2M' },
    { min: 2000000, max: 3000000, label: '2M - 3M' },
    { min: 3000000, max: 5000000, label: '3M - 5M' },
    { min: 5000000, max: 10000000, label: '5M - 10M' },
    { min: 10000000, max: null, label: 'Above 10M' },
];

// Sort options
export const SORT_OPTIONS = [
    { value: 'created_at:desc', label: 'Newest First' },
    { value: 'created_at:asc', label: 'Oldest First' },
    { value: 'price:asc', label: 'Price: Low to High' },
    { value: 'price:desc', label: 'Price: High to Low' },
    { value: 'year:desc', label: 'Year: Newest' },
    { value: 'year:asc', label: 'Year: Oldest' },
    { value: 'mileage:asc', label: 'Mileage: Low to High' },
];

// Enquiry types
export const ENQUIRY_TYPES = [
    { value: 'purchase', label: 'Purchase Enquiry' },
    { value: 'test_drive', label: 'Test Drive Request' },
    { value: 'finance', label: 'Finance Information' },
    { value: 'general', label: 'General Enquiry' },
];

// Enquiry status
export const ENQUIRY_STATUS = [
    { value: 'new', label: 'New', color: 'primary' },
    { value: 'contacted', label: 'Contacted', color: 'warning' },
    { value: 'qualified', label: 'Qualified', color: 'success' },
    { value: 'closed', label: 'Closed', color: 'error' },
];

// Sell request status
export const SELL_REQUEST_STATUS = [
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'reviewing', label: 'Reviewing', color: 'primary' },
    { value: 'valued', label: 'Valued', color: 'success' },
    { value: 'accepted', label: 'Accepted', color: 'success' },
    { value: 'rejected', label: 'Rejected', color: 'error' },
];

// Service types for sell request
export const SERVICE_TYPES = [
    { value: 'sell_on_behalf', label: 'Sell on My Behalf' },
    { value: 'direct_purchase', label: 'Direct Purchase' },
];

// Contact info
export const CONTACT_INFO = {
    phone: '0716770077',
    whatsapp: '+254716770077',
    email: 'info@joramcars.co.ke',
    address: 'Nairobi, Kenya',
    businessHours: 'Mon - Sat: 8:00 AM - 6:00 PM',
};

// Social media links
export const SOCIAL_LINKS = {
    facebook: 'https://facebook.com/joramcars',
    twitter: 'https://twitter.com/joramcars',
    instagram: 'https://instagram.com/joramcars',
    youtube: 'https://youtube.com/@joramcars',
};

// Navigation links
export const NAV_LINKS = [
    { path: '/', label: 'Home' },
    { path: '/vehicles', label: 'Vehicles' },
    { path: '/sell', label: 'Sell Your Car' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
    { path: '/faq', label: 'FAQ' },
];

// Admin navigation
export const ADMIN_NAV_LINKS = [
    { path: '/admin', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/admin/vehicles', label: 'Vehicles', icon: 'Car' },
    { path: '/admin/enquiries', label: 'Enquiries', icon: 'MessageSquare' },
    { path: '/admin/sell-requests', label: 'Sell Requests', icon: 'FileText' },
    { path: '/admin/brands', label: 'Brands', icon: 'Tag' },
];
