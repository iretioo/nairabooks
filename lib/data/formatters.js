/**
 * Formatting utilities for NaijaTax
 * Handles currency, dates, and number formatting for Nigerian context
 */

/**
 * Format amount as Nigerian Naira currency
 * @param {number} amount - The amount to format
 * @param {object} options - Formatting options
 * @param {boolean} options.compact - Use compact notation (e.g., ₦1.5M)
 * @param {number} options.minimumFractionDigits - Minimum decimal places
 * @param {number} options.maximumFractionDigits - Maximum decimal places
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, options = {}) {
    const {
        compact = false,
        minimumFractionDigits = 0,
        maximumFractionDigits = 0,
    } = options;

    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        notation: compact ? 'compact' : 'standard',
        minimumFractionDigits: compact ? 1 : minimumFractionDigits,
        maximumFractionDigits: compact ? 1 : maximumFractionDigits,
    }).format(amount);
}

/**
 * Format amount as compact Nigerian Naira (shorthand)
 * @param {number} amount - The amount to format
 * @returns {string} Compact formatted currency string
 */
export function formatCompact(amount) {
    return formatCurrency(amount, { compact: true });
}

/**
 * Format amount with 2 decimal places (for VAT displays)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency with 2 decimals
 */
export function formatCurrencyPrecise(amount) {
    return `₦${amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

/**
 * Format a percentage value
 * @param {number} value - The percentage value (e.g., 7.5 for 7.5%)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, decimals = 1) {
    return `${value.toFixed(decimals)}%`;
}

/**
 * Format a date for display
 * @param {string|Date} date - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    return new Intl.DateTimeFormat('en-NG', { ...defaultOptions, ...options }).format(
        typeof date === 'string' ? new Date(date) : date
    );
}

/**
 * Format date as ISO string (YYYY-MM-DD)
 * @param {Date} date - The date to format
 * @returns {string} ISO date string
 */
export function formatDateISO(date) {
    return date.toISOString().split('T')[0];
}

/**
 * Format a number with thousand separators
 * @param {number} value - The number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(value) {
    return new Intl.NumberFormat('en-NG').format(value);
}

/**
 * Get human-readable date range label based on preset
 * @param {string} presetId - The preset ID
 * @returns {string} Human-readable label
 */
export function getDateRangeLabel(presetId) {
    const labels = {
        this_month: 'This Month',
        last_month: 'Last Month',
        last_30_days: 'Last 30 Days',
        this_quarter: 'Last 90 Days',
        ytd: 'Year to Date',
        custom: 'Custom Range',
    };
    return labels[presetId] || 'All Time';
}
