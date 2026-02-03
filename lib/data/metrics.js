/**
 * Metric calculation utilities for NaijaTax
 * Computes tax liability, VAT, and financial metrics
 */

import { TRANSACTION_TYPES, TAX_STATUSES, IRN_STATUSES, TAX_LIABILITY_BUFFER } from './types';

/**
 * Calculate core financial metrics from transactions
 * @param {Array} transactions - Array of transactions
 * @returns {object} Core metrics object
 */
export function calculateCoreMetrics(transactions) {
    // Ensure transactions is a valid array
    if (!Array.isArray(transactions) || transactions.length === 0) {
        return { inflow: 0, outflow: 0, vatInput: 0, vatOutput: 0 };
    }

    return transactions.reduce(
        (acc, tx) => {
            // Skip invalid transactions
            if (!tx || typeof tx !== 'object') return acc;

            const totalAmount = Number(tx.totalAmount) || 0;
            const vatAmount = Number(tx.vatAmount) || 0;

            // Calculate inflow (Sales) and outflow (Purchases)
            if (tx.type === TRANSACTION_TYPES.SALE) {
                acc.inflow += totalAmount;
            } else if (tx.type === TRANSACTION_TYPES.PURCHASE) {
                acc.outflow += totalAmount;
            }

            // Calculate VAT amounts
            if (tx.type === TRANSACTION_TYPES.SALE && tx.taxStatus === TAX_STATUSES.TAXABLE) {
                acc.vatOutput += vatAmount;
            } else if (tx.type === TRANSACTION_TYPES.PURCHASE && tx.taxStatus === TAX_STATUSES.TAXABLE) {
                acc.vatInput += vatAmount;
            }

            return acc;
        },
        { inflow: 0, outflow: 0, vatInput: 0, vatOutput: 0 }
    );
}

/**
 * Calculate VAT position (Net VAT = Output VAT - Input VAT)
 * @param {object} metrics - Core metrics with vatInput and vatOutput
 * @returns {number} VAT position (positive = payable, negative = refundable)
 */
export function calculateVATPosition(metrics) {
    return metrics.vatOutput - metrics.vatInput;
}

/**
 * Calculate estimated tax liability with buffer
 * @param {number} vatPosition - The net VAT position
 * @param {number} buffer - Buffer multiplier (default 1.1 for 10%)
 * @returns {number} Estimated tax liability
 */
export function calculateTaxLiability(vatPosition, buffer = TAX_LIABILITY_BUFFER) {
    return Math.max(0, vatPosition * buffer);
}

/**
 * Calculate effective tax rate
 * @param {number} taxLiability - The calculated tax liability
 * @param {number} taxableIncome - The net taxable income
 * @returns {number} Effective tax rate as percentage
 */
export function calculateEffectiveTaxRate(taxLiability, taxableIncome) {
    if (taxableIncome <= 0) return 0;
    return (taxLiability / taxableIncome) * 100;
}

/**
 * Calculate average transaction value
 * @param {number} totalVolume - Total transaction volume
 * @param {number} transactionCount - Number of transactions
 * @returns {number} Average transaction value
 */
export function calculateAverageTransaction(totalVolume, transactionCount) {
    if (transactionCount <= 0) return 0;
    return totalVolume / transactionCount;
}

/**
 * Calculate complete dashboard metrics
 * @param {Array} transactions - Array of transactions
 * @returns {object} Complete metrics object
 */
export function calculateDashboardMetrics(transactions) {
    // Ensure transactions is a valid array
    if (!Array.isArray(transactions)) {
        transactions = [];
    }

    const core = calculateCoreMetrics(transactions);
    const vatPosition = calculateVATPosition(core);
    const totalVolume = (core.inflow || 0) + (core.outflow || 0);

    // Net Inflow: Total sales minus the VAT collected (your actual revenue)
    const netInflow = (core.inflow || 0) - (core.vatOutput || 0);

    // Determine if in payable or refundable position
    const isVATPayable = (vatPosition || 0) > 0;

    // Tax Liability: 
    // - If payable position: show VAT position with buffer
    // - If refundable position: show the absolute net VAT (what you'd get back)
    //   This ensures meaningful display for combined accounts
    let taxLiability;
    if (isVATPayable) {
        taxLiability = calculateTaxLiability(vatPosition);
    } else {
        // In refundable position, show the absolute value of what's owed to you
        taxLiability = Math.abs(vatPosition || 0);
    }

    // Effective Tax Rate: 
    // - Shows Output VAT as a percentage of net taxable income (revenue)
    // - This represents the actual VAT rate applied to your sales
    // - More meaningful than showing 0% when in refundable position
    const effectiveTaxRate = netInflow > 0 ? ((core.vatOutput || 0) / netInflow) * 100 : 0;

    const avgTransaction = calculateAverageTransaction(totalVolume, transactions.length);

    // Debug logging in development (will be stripped in production)
    // if (process.env.NODE_ENV === 'development') {
    //     console.log('[calculateDashboardMetrics]', {
    //         transactionCount: transactions.length,
    //         core,
    //         vatPosition,
    //         isVATPayable,
    //         taxLiability,
    //         netInflow,
    //         effectiveTaxRate
    //     });
    // }

    return {
        ...core,
        vatPosition: vatPosition || 0,
        totalVolume: totalVolume || 0,
        taxLiability: taxLiability || 0,
        netInflow: netInflow || 0,
        effectiveTaxRate: isNaN(effectiveTaxRate) ? 0 : effectiveTaxRate,
        avgTransaction: avgTransaction || 0,
        transactionCount: transactions.length || 0,
        isVATPayable,
    };
}

/**
 * Calculate VAT breakdown by category
 * @param {Array} transactions - Array of transactions
 * @returns {Array} Sorted array of category breakdowns
 */
export function calculateVATByCategory(transactions) {
    const categoryMap = transactions.reduce((acc, tx) => {
        if (!acc[tx.category]) {
            acc[tx.category] = { amount: 0, count: 0, inputVAT: 0, outputVAT: 0 };
        }

        acc[tx.category].amount += tx.vatAmount;
        acc[tx.category].count += 1;

        if (tx.type === TRANSACTION_TYPES.PURCHASE) {
            acc[tx.category].inputVAT += tx.vatAmount;
        } else {
            acc[tx.category].outputVAT += tx.vatAmount;
        }

        return acc;
    }, {});

    const totalVAT = transactions.reduce((sum, tx) => sum + tx.vatAmount, 0);

    return Object.entries(categoryMap)
        .map(([category, data]) => ({
            category,
            amount: data.amount,
            count: data.count,
            inputVAT: data.inputVAT,
            outputVAT: data.outputVAT,
            percentage: totalVAT > 0 ? Math.round((data.amount / totalVAT) * 100) : 0,
        }))
        .sort((a, b) => b.amount - a.amount);
}

/**
 * Calculate VAT-specific metrics for VAT page
 * @param {Array} transactions - Array of transactions
 * @returns {object} VAT-specific metrics
 */
export function calculateVATMetrics(transactions) {
    const purchases = transactions.filter(t => t.type === TRANSACTION_TYPES.PURCHASE);
    const sales = transactions.filter(t => t.type === TRANSACTION_TYPES.SALE);

    const inputVAT = purchases.reduce((sum, t) => sum + t.vatAmount, 0);
    const outputVAT = sales.reduce((sum, t) => sum + t.vatAmount, 0);
    const netPosition = outputVAT - inputVAT;

    const categoryBreakdown = calculateVATByCategory(transactions);

    // Calculate claimable vs non-claimable input VAT
    const claimableInputVAT = purchases
        .filter(t => t.irnStatus === IRN_STATUSES.VALIDATED && t.taxStatus === TAX_STATUSES.TAXABLE)
        .reduce((sum, t) => sum + t.vatAmount, 0);

    const nonClaimableInputVAT = inputVAT - claimableInputVAT;

    return {
        inputVAT,
        outputVAT,
        netPosition,
        isPayable: netPosition > 0,
        categoryBreakdown,
        claimableInputVAT,
        nonClaimableInputVAT,
        purchaseCount: purchases.length,
        saleCount: sales.length,
    };
}

/**
 * Calculate IRN compliance statistics
 * @param {Array} transactions - Array of transactions
 * @returns {object} IRN compliance stats
 */
export function calculateIRNStats(transactions) {
    const stats = {
        validated: 0,
        pending: 0,
        missing: 0,
        notApplicable: 0,
        total: transactions.length,
    };

    transactions.forEach(tx => {
        switch (tx.irnStatus) {
            case IRN_STATUSES.VALIDATED:
                stats.validated++;
                break;
            case IRN_STATUSES.PENDING:
                stats.pending++;
                break;
            case IRN_STATUSES.MISSING:
                stats.missing++;
                break;
            case IRN_STATUSES.NOT_APPLICABLE:
                stats.notApplicable++;
                break;
        }
    });

    stats.complianceRate = stats.total > 0
        ? Math.round((stats.validated / (stats.total - stats.notApplicable)) * 100)
        : 100;

    return stats;
}

/**
 * Calculate tax status distribution
 * @param {Array} transactions - Array of transactions
 * @returns {object} Tax status distribution
 */
export function calculateTaxStatusDistribution(transactions) {
    return transactions.reduce(
        (acc, tx) => {
            if (tx.taxStatus === TAX_STATUSES.TAXABLE) {
                acc.taxable++;
                acc.taxableAmount += tx.totalAmount;
            } else if (tx.taxStatus === TAX_STATUSES.ZERO_RATED) {
                acc.zeroRated++;
                acc.zeroRatedAmount += tx.totalAmount;
            } else if (tx.taxStatus === TAX_STATUSES.EXEMPT) {
                acc.exempt++;
                acc.exemptAmount += tx.totalAmount;
            }
            return acc;
        },
        { taxable: 0, zeroRated: 0, exempt: 0, taxableAmount: 0, zeroRatedAmount: 0, exemptAmount: 0 }
    );
}

/**
 * Get a human-readable period description from a date range
 * @param {object} dateRange - The date range object { type: 'preset'|'custom', value: string|{ start, end } }
 * @returns {string} Human-readable period description
 */
export function getPeriodDescription(dateRange) {
    if (!dateRange) return 'this period';

    const today = new Date();
    const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    if (dateRange.type === 'custom' && dateRange.value?.start && dateRange.value?.end) {
        const start = new Date(dateRange.value.start);
        const end = new Date(dateRange.value.end);
        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const startFormatted = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const endFormatted = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        if (diffDays <= 7) {
            return `in the last week (${startFormatted} - ${endFormatted})`;
        } else if (diffDays <= 31) {
            return `over the past ${diffDays} days (${startFormatted} - ${endFormatted})`;
        } else {
            return `from ${startFormatted} to ${endFormatted}`;
        }
    }

    const preset = dateRange.value;
    switch (preset) {
        case 'this_month':
            return `in ${monthName}`;
        case 'last_month': {
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            return `in ${lastMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
        }
        case 'last_30_days':
            return 'in the last 30 days';
        case 'this_quarter':
        case 'last_90_days':
            return 'in the last 90 days';
        case 'ytd':
            return `since January ${today.getFullYear()}`;
        default:
            return 'this period';
    }
}

/**
 * Generate smart insights from transaction data
 * @param {Array} transactions - Array of transactions
 * @param {object} metrics - Calculated metrics
 * @param {object} dateRange - Optional date range for period descriptions
 * @returns {Array} Array of insight objects
 */
export function generateInsights(transactions, metrics, dateRange = null) {
    const insights = [];
    const periodText = getPeriodDescription(dateRange);

    // VAT insight
    if (metrics.vatInput > 0) {
        insights.push({
            type: 'vat',
            title: 'VAT Paid',
            message: `You've paid ₦${Math.round(metrics.vatInput).toLocaleString()} in VAT ${periodText}`,
            icon: 'receipt',
        });
    }

    // Largest transaction insight
    if (transactions.length > 0) {
        const largestTx = [...transactions].sort((a, b) => b.totalAmount - a.totalAmount)[0];
        insights.push({
            type: 'highlight',
            title: 'Largest Transaction',
            message: `Your biggest transaction ${periodText} was ₦${largestTx.totalAmount.toLocaleString()} - ${largestTx.description.substring(0, 50)}`,
            icon: 'trending-up',
            transaction: largestTx,
        });
    }

    // Tax liability insight
    if (metrics.taxLiability > 0) {
        insights.push({
            type: 'tax',
            title: 'Estimated Tax',
            message: `Your estimated tax liability ${periodText} is ₦${Math.round(metrics.taxLiability).toLocaleString()}`,
            icon: 'calculator',
        });
    }

    // Transaction volume insight
    if (transactions.length > 0) {
        const taxableTxs = transactions.filter(tx => tx.taxStatus === TAX_STATUSES.TAXABLE);
        if (taxableTxs.length > 0) {
            insights.push({
                type: 'volume',
                title: 'Taxable Transactions',
                message: `${taxableTxs.length} transactions affected your tax position ${periodText}`,
                icon: 'layers',
            });
        }
    }

    // IRN compliance insight
    const irnStats = calculateIRNStats(transactions);
    if (irnStats.pending > 0) {
        insights.push({
            type: 'warning',
            title: 'Pending IRN Validation',
            message: `You have ${irnStats.pending} transaction(s) with pending IRN status. Validate within 7 days to avoid penalties.`,
            icon: 'alert-triangle',
        });
    }

    return insights;
}
