/**
 * Central data access layer for NaijaTax
 * Provides unified access to transaction data with account filtering
 */

import rawData from '@/data.json';
import { ACCOUNT_TYPES } from './types';
import { filterByDateRange, applyFilters, sortTransactions } from './filters';
import { calculateDashboardMetrics, calculateVATMetrics, calculateIRNStats, generateInsights } from './metrics';

// Re-export all utilities for convenient access
export * from './types';
export * from './formatters';
export * from './filters';
export * from './metrics';

/**
 * Get account information by account type
 * @param {string} accountType - The account type (individual, sme, corporation)
 * @returns {object|null} Account info or null
 */
export function getAccountInfo(accountType) {
    // Default to 'all' if accountType is undefined, null, or empty
    if (!accountType || accountType === ACCOUNT_TYPES.ALL) {
        return {
            accountName: 'All Accounts',
            accountType: 'all',
            transactionCount: getAllTransactions().length,
        };
    }

    const accountData = rawData[accountType];
    if (!accountData) return null;

    return {
        ...accountData.accountInfo,
        accountType: accountData.accountType,
        transactionCount: accountData.transactions.length,
    };
}

/**
 * Get all available accounts
 * @returns {Array} Array of account objects
 */
export function getAvailableAccounts() {
    const accounts = [
        {
            id: ACCOUNT_TYPES.ALL,
            name: 'All Accounts',
            type: 'All',
            transactionCount: getAllTransactions().length,
        },
    ];

    Object.entries(rawData).forEach(([key, data]) => {
        accounts.push({
            id: key,
            name: data.accountInfo.accountName,
            type: data.accountType,
            bank: data.accountInfo.bank,
            accountNumber: data.accountInfo.accountNumber,
            transactionCount: data.transactions.length,
            vatRegistered: data.accountInfo.vatRegistered || false,
        });
    });

    return accounts;
}

/**
 * Get all transactions across all accounts
 * @returns {Array} All transactions from all accounts
 */
export function getAllTransactions() {
    // Explicitly get transactions from each known account type to ensure proper combination
    const accountTypes = [ACCOUNT_TYPES.INDIVIDUAL, ACCOUNT_TYPES.SME, ACCOUNT_TYPES.CORPORATION];

    const allTransactions = accountTypes.reduce((acc, accountType) => {
        const accountData = rawData[accountType];
        if (accountData && Array.isArray(accountData.transactions)) {
            return [...acc, ...accountData.transactions];
        }
        return acc;
    }, []);

    return allTransactions;
}

/**
 * Get transactions for a specific account
 * @param {string} accountType - The account type (all, individual, sme, corporation)
 * @returns {Array} Transactions for the specified account
 */
export function getTransactionsByAccount(accountType) {
    // Default to 'all' if accountType is undefined, null, or empty
    if (!accountType || accountType === ACCOUNT_TYPES.ALL) {
        return getAllTransactions();
    }

    return rawData[accountType]?.transactions || [];
}

/**
 * Get filtered transactions with all filters applied
 * @param {string} accountType - The account type
 * @param {object} filters - Filter options (dateRange, type, category, etc.)
 * @returns {Array} Filtered and sorted transactions
 */
export function getFilteredTransactions(accountType, filters = {}) {
    let transactions = getTransactionsByAccount(accountType);
    transactions = applyFilters(transactions, filters);
    transactions = sortTransactions(transactions, filters.sortBy || 'date', filters.sortDirection || 'desc');
    return transactions;
}

/**
 * High-level data hook helper for dashboard page
 * Returns all computed data needed for the dashboard
 * @param {string} accountType - The account type
 * @param {object} dateRange - Date range filter
 * @returns {object} Dashboard data object
 */
export function getDashboardData(accountType, dateRange) {
    const allTransactions = getTransactionsByAccount(accountType);
    const filteredTransactions = filterByDateRange(allTransactions, dateRange);
    const metrics = calculateDashboardMetrics(filteredTransactions);
    const insights = generateInsights(filteredTransactions, metrics, dateRange);
    const irnStats = calculateIRNStats(filteredTransactions);

    return {
        transactions: filteredTransactions,
        allTransactions,
        metrics,
        insights,
        irnStats,
        accountInfo: getAccountInfo(accountType),
    };
}

/**
 * High-level data hook helper for VAT page
 * Returns all computed data needed for the VAT tracker
 * @param {string} accountType - The account type
 * @param {object} dateRange - Date range filter
 * @returns {object} VAT page data object
 */
export function getVATData(accountType, dateRange) {
    const allTransactions = getTransactionsByAccount(accountType);
    const filteredTransactions = filterByDateRange(allTransactions, dateRange);
    const vatMetrics = calculateVATMetrics(filteredTransactions);
    const irnStats = calculateIRNStats(filteredTransactions);

    return {
        transactions: filteredTransactions,
        allTransactions,
        metrics: vatMetrics,
        irnStats,
        accountInfo: getAccountInfo(accountType),
    };
}

/**
 * Get transactions filtered by VAT type (input or output)
 * @param {string} accountType - The account type
 * @param {object} dateRange - Date range filter
 * @param {'input'|'output'} vatType - VAT type to filter
 * @returns {object} Filtered transactions and subtotal
 */
export function getVATBreakdownData(accountType, dateRange, vatType) {
    const allTransactions = getTransactionsByAccount(accountType);
    const dateFiltered = filterByDateRange(allTransactions, dateRange);

    let transactions;
    let subtotal;

    if (vatType === 'input') {
        transactions = dateFiltered.filter(t => t.type === 'Purchase');
        subtotal = transactions.reduce((sum, t) => sum + t.vatAmount, 0);
    } else if (vatType === 'output') {
        transactions = dateFiltered.filter(t => t.type === 'Sale');
        subtotal = transactions.reduce((sum, t) => sum + t.vatAmount, 0);
    } else {
        transactions = dateFiltered;
        subtotal = dateFiltered.reduce((sum, t) => sum + t.vatAmount, 0);
    }

    return {
        transactions,
        subtotal,
        count: transactions.length,
    };
}
