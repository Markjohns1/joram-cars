/**
 * Utility Functions
 * 
 * Common helper functions used throughout the app.
 */

/**
 * Format price with currency
 */
export function formatPrice(price, currency = 'KSH') {
    const formatted = new Intl.NumberFormat('en-KE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);

    return `${currency} ${formatted}`;
}

/**
 * Format mileage with comma separators
 */
export function formatMileage(mileage) {
    if (!mileage) return 'N/A';
    return `${new Intl.NumberFormat('en-KE').format(mileage)} km`;
}

/**
 * Format date to readable string
 */
export function formatDate(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date);
}

/**
 * Format date with time
 */
export function formatDateTime(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

/**
 * Get image URL with fallback
 */
export function getImageUrl(path) {
    if (!path) return '/placeholder-car.jpg';
    if (path.startsWith('http')) return path;

    const uploadsUrl = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:8000/uploads';

    // Remove leading slash if present
    const cleanPath = path.startsWith('/uploads')
        ? path.replace('/uploads', '')
        : path.startsWith('/')
            ? path.substring(1)
            : path;

    return `${uploadsUrl}/${cleanPath}`;
}

/**
 * Generate WhatsApp link
 */
export function getWhatsAppLink(message, vehicleTitle = '') {
    const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '254716770077';

    let text = message;
    if (vehicleTitle) {
        text = `Hi, I'm interested in the ${vehicleTitle}. ${message}`;
    }

    const encodedMessage = encodeURIComponent(text);
    return `https://wa.me/${phone}?text=${encodedMessage}`;
}

/**
 * Get body type icon name
 */
export function getBodyTypeIcon(bodyType) {
    const icons = {
        SUV: 'car-front',
        Sedan: 'car',
        Hatchback: 'car',
        Pickup: 'truck',
        Convertible: 'car',
        Van: 'bus',
        Wagon: 'car',
        Coupe: 'car',
    };

    return icons[bodyType] || 'car';
}

/**
 * Get availability status badge color
 */
export function getStatusColor(status) {
    const colors = {
        available: 'success',
        direct_import: 'primary',
        sold: 'error',
        reserved: 'warning',
    };

    return colors[status] || 'primary';
}

/**
 * Get availability status label
 */
export function getStatusLabel(status) {
    const labels = {
        available: 'Available',
        direct_import: 'Direct Import',
        sold: 'Sold',
        reserved: 'Reserved',
    };

    return labels[status] || status;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text, maxLength = 100) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

/**
 * Debounce function
 */
export function debounce(func, wait = 300) {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Parse query params from URL
 */
export function parseQueryParams(searchString) {
    const params = new URLSearchParams(searchString);
    const result = {};

    for (const [key, value] of params.entries()) {
        result[key] = value;
    }

    return result;
}

/**
 * Build query string from object
 */
export function buildQueryString(params) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.set(key, value);
        }
    });

    return searchParams.toString();
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate Kenyan phone number
 */
export function isValidKenyanPhone(phone) {
    // Accept formats: 0712345678, +254712345678, 254712345678
    const re = /^(\+?254|0)?[17]\d{8}$/;
    return re.test(phone.replace(/\s/g, ''));
}

/**
 * Format phone number for display
 */
export function formatPhone(phone) {
    if (!phone) return '';

    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');

    // Format for Kenya
    if (digits.startsWith('254')) {
        return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }

    if (digits.startsWith('0')) {
        return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
    }

    return phone;
}

/**
 * Capitalize first letter
 */
export function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Generate year options for selects
 */
export function getYearOptions(startYear = 2000) {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let year = currentYear + 1; year >= startYear; year--) {
        years.push(year);
    }

    return years;
}

/**
 * Sleep function for async operations
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Class name helper (like clsx)
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
