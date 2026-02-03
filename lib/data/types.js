/**
 * Type definitions and constants for NaijaTax data processing
 */

// Account types available in the system
export const ACCOUNT_TYPES = {
    ALL: 'all',
    INDIVIDUAL: 'individual',
    SME: 'sme',
    CORPORATION: 'corporation',
};

// Transaction types
export const TRANSACTION_TYPES = {
    SALE: 'Sale',
    PURCHASE: 'Purchase',
};

// Tax statuses
export const TAX_STATUSES = {
    TAXABLE: 'Taxable',
    ZERO_RATED: 'Zero-Rated',
    EXEMPT: 'Exempt',
};

// IRN (Invoice Reference Number) statuses
export const IRN_STATUSES = {
    VALIDATED: 'Validated',
    PENDING: 'Pending',
    MISSING: 'Missing',
    NOT_APPLICABLE: 'N/A',
};

// Transaction categories
export const CATEGORIES = {
    INCOME: 'Income',
    GOODS: 'Goods',
    SERVICES: 'Services',
    CAPEX: 'Capex',
    OVERHEADS: 'Overheads',
    FINANCIAL_SERVICES: 'Financial Services',
    TRANSPORTATION: 'Transportation',
    OTHER: 'Other',
};

// Date range preset types
export const DATE_PRESETS = {
    THIS_MONTH: 'this_month',
    LAST_MONTH: 'last_month',
    LAST_30_DAYS: 'last_30_days',
    LAST_90_DAYS: 'this_quarter', // Aliased for backward compat
    THIS_QUARTER: 'this_quarter',
    YTD: 'ytd',
    CUSTOM: 'custom',
};

// VAT rate in Nigeria (7.5%)
export const VAT_RATE = 0.075;

// Tax buffer (10% estimate buffer for tax liability calculation)
export const TAX_LIABILITY_BUFFER = 1.1;
