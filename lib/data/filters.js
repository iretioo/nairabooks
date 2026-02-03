/**
 * Filtering utilities for NaijaTax transactions
 * Handles date range, category, type, and search filtering
 */

import { TRANSACTION_TYPES, TAX_STATUSES, IRN_STATUSES, DATE_PRESETS } from './types';

/**
 * Strip time component from a date for accurate day comparison
 * @param {Date} date - The date to strip
 * @returns {Date} Date with time set to midnight
 */
export function stripTime(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Get the end of month for a given date
 * @param {Date} date - Reference date
 * @returns {Date} Last day of the month
 */
export function getEndOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Get date range boundaries for a preset
 * @param {string} preset - The preset ID (e.g., 'this_month', 'last_30_days')
 * @param {Date} referenceDate - The reference date (defaults to today)
 * @returns {{ start: Date, end: Date }} Start and end dates
 */
export function getPresetDateRange(preset, referenceDate = new Date()) {
    const today = stripTime(referenceDate);
    const endOfMonth = getEndOfMonth(today);

    switch (preset) {
        case DATE_PRESETS.THIS_MONTH: {
            const start = new Date(today.getFullYear(), today.getMonth(), 1);
            return { start, end: endOfMonth };
        }

        case DATE_PRESETS.LAST_MONTH: {
            const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const end = new Date(today.getFullYear(), today.getMonth(), 0);
            return { start, end };
        }

        case DATE_PRESETS.LAST_30_DAYS: {
            const start = new Date(today);
            start.setDate(today.getDate() - 30);
            // Include the rest of the current month for demo data consistency
            return { start, end: endOfMonth };
        }

        case DATE_PRESETS.THIS_QUARTER:
        case DATE_PRESETS.LAST_90_DAYS: {
            const start = new Date(today);
            start.setDate(today.getDate() - 90);
            // Include the rest of the current month for demo data consistency
            return { start, end: endOfMonth };
        }

        case DATE_PRESETS.YTD: {
            const start = new Date(today.getFullYear(), 0, 1);
            return { start, end: endOfMonth };
        }

        default:
            return { start: null, end: null };
    }
}

/**
 * Filter transactions by date range
 * 
 * NOTE: For demo data with dates spanning the current month (including future dates
 * within the month), the filters include all dates within the logical period.
 * For "This Month", "Last 30/90 Days", and "YTD", we include all dates in the 
 * current month to handle demo data correctly.
 * 
 * @param {Array} transactions - Array of transactions
 * @param {object} dateRange - Date range filter { type: 'preset'|'custom', value: string|{ start, end } }
 * @param {Date} referenceDate - Reference date for calculations (defaults to today)
 * @returns {Array} Filtered transactions
 */
export function filterByDateRange(transactions, dateRange, referenceDate = new Date()) {
    if (!dateRange) return transactions;

    const today = stripTime(referenceDate);
    const endOfMonth = getEndOfMonth(today);

    return transactions.filter(tx => {
        const txDate = stripTime(new Date(tx.date));

        // Handle custom date range
        if (dateRange.type === 'custom' && dateRange.value?.start && dateRange.value?.end) {
            const start = stripTime(new Date(dateRange.value.start));
            const end = stripTime(new Date(dateRange.value.end));
            return txDate >= start && txDate <= end;
        }

        // Handle presets
        const preset = dateRange.value;

        switch (preset) {
            case DATE_PRESETS.THIS_MONTH:
                // All transactions in the current calendar month
                return txDate.getMonth() === today.getMonth() &&
                    txDate.getFullYear() === today.getFullYear();

            case DATE_PRESETS.LAST_MONTH: {
                // All transactions in the previous calendar month
                const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                return txDate.getMonth() === lastMonth.getMonth() &&
                    txDate.getFullYear() === lastMonth.getFullYear();
            }

            case DATE_PRESETS.LAST_30_DAYS: {
                // From 30 days ago to end of current month (for demo data consistency)
                const thirtyDaysAgo = new Date(today);
                thirtyDaysAgo.setDate(today.getDate() - 30);
                return txDate >= stripTime(thirtyDaysAgo) && txDate <= endOfMonth;
            }

            case DATE_PRESETS.THIS_QUARTER:
            case DATE_PRESETS.LAST_90_DAYS: {
                // From 90 days ago to end of current month (for demo data consistency)
                const ninetyDaysAgo = new Date(today);
                ninetyDaysAgo.setDate(today.getDate() - 90);
                return txDate >= stripTime(ninetyDaysAgo) && txDate <= endOfMonth;
            }

            case DATE_PRESETS.YTD:
                // All transactions in the current year
                return txDate.getFullYear() === today.getFullYear();

            default:
                return true;
        }
    });
}

/**
 * Filter transactions by type (Sale/Purchase)
 * @param {Array} transactions - Array of transactions
 * @param {string} type - Transaction type to filter by
 * @returns {Array} Filtered transactions
 */
export function filterByType(transactions, type) {
    if (!type || type === 'all') return transactions;
    return transactions.filter(tx => tx.type === type);
}

/**
 * Filter transactions by tax status
 * @param {Array} transactions - Array of transactions
 * @param {string} status - Tax status to filter by
 * @returns {Array} Filtered transactions
 */
export function filterByTaxStatus(transactions, status) {
    if (!status || status === 'all') return transactions;
    return transactions.filter(tx => tx.taxStatus === status);
}

/**
 * Filter transactions by IRN status
 * @param {Array} transactions - Array of transactions
 * @param {string} status - IRN status to filter by
 * @returns {Array} Filtered transactions
 */
export function filterByIRNStatus(transactions, status) {
    if (!status || status === 'all') return transactions;
    return transactions.filter(tx => tx.irnStatus === status);
}

/**
 * Filter transactions by category
 * @param {Array} transactions - Array of transactions
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered transactions
 */
export function filterByCategory(transactions, category) {
    if (!category || category === 'all') return transactions;
    return transactions.filter(tx => tx.category === category);
}

/**
 * Search transactions by description or counterparty
 * @param {Array} transactions - Array of transactions
 * @param {string} query - Search query
 * @returns {Array} Matching transactions
 */
export function searchTransactions(transactions, query) {
    if (!query || query.trim() === '') return transactions;

    const searchTerm = query.toLowerCase().trim();

    return transactions.filter(tx => {
        const description = (tx.description || '').toLowerCase();
        const counterparty = (tx.counterparty || '').toLowerCase();
        const id = (tx.id || '').toLowerCase();
        const category = (tx.category || '').toLowerCase();

        return description.includes(searchTerm) ||
            counterparty.includes(searchTerm) ||
            id.includes(searchTerm) ||
            category.includes(searchTerm);
    });
}

/**
 * Apply multiple filters to transactions
 * @param {Array} transactions - Array of transactions
 * @param {object} filters - Filter options
 * @param {object} filters.dateRange - Date range filter
 * @param {string} filters.type - Transaction type filter
 * @param {string} filters.taxStatus - Tax status filter
 * @param {string} filters.irnStatus - IRN status filter
 * @param {string} filters.category - Category filter
 * @param {string} filters.search - Search query
 * @returns {Array} Filtered transactions
 */
export function applyFilters(transactions, filters = {}) {
    let result = [...transactions];

    if (filters.dateRange) {
        result = filterByDateRange(result, filters.dateRange);
    }

    if (filters.type) {
        result = filterByType(result, filters.type);
    }

    if (filters.taxStatus) {
        result = filterByTaxStatus(result, filters.taxStatus);
    }

    if (filters.irnStatus) {
        result = filterByIRNStatus(result, filters.irnStatus);
    }

    if (filters.category) {
        result = filterByCategory(result, filters.category);
    }

    if (filters.search) {
        result = searchTransactions(result, filters.search);
    }

    return result;
}

/**
 * Sort transactions by a field
 * @param {Array} transactions - Array of transactions
 * @param {string} field - Field to sort by
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} Sorted transactions
 */
export function sortTransactions(transactions, field = 'date', direction = 'desc') {
    return [...transactions].sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];

        // Handle date sorting
        if (field === 'date') {
            aVal = new Date(aVal).getTime();
            bVal = new Date(bVal).getTime();
        }

        // Handle numeric sorting
        if (typeof aVal === 'number') {
            return direction === 'asc' ? aVal - bVal : bVal - aVal;
        }

        // Handle string sorting
        const comparison = String(aVal).localeCompare(String(bVal));
        return direction === 'asc' ? comparison : -comparison;
    });
}

/**
 * Get unique categories from transactions
 * @param {Array} transactions - Array of transactions
 * @returns {Array<string>} Unique categories
 */
export function getUniqueCategories(transactions) {
    const categories = new Set(transactions.map(tx => tx.category));
    return Array.from(categories).sort();
}

/**
 * Get transactions with pending IRN status
 * @param {Array} transactions - Array of transactions
 * @returns {Array} Transactions with pending IRN
 */
export function getPendingIRNTransactions(transactions) {
    return transactions.filter(tx => tx.irnStatus === IRN_STATUSES.PENDING);
}

/**
 * Get transactions with missing IRN status
 * @param {Array} transactions - Array of transactions
 * @returns {Array} Transactions with missing IRN
 */
export function getMissingIRNTransactions(transactions) {
    return transactions.filter(tx => tx.irnStatus === IRN_STATUSES.MISSING);
}
