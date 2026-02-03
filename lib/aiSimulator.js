/**
 * AI Simulator for Naijatax Proof of Concept
 * Simulates Groq API responses for transaction analysis and tax Q&A.
 * 
 * This service mimics the behavior of the future AI integration:
 * 1. Transaction Analysis: Categorization, deductibility, and VAT status.
 * 2. General Tax Advice: Answering questions about Nigerian tax laws.
 */

import { getVATData, formatCurrency } from './data';

// Simulated network latency (ms) to make it feel like a real API call
const SIMULATED_LATENCY = 1200;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Simulates analyzing a single transaction.
 * @param {object} transaction - The transaction object to analyze
 * @param {string} accountType - The context (individual, sme, corporation)
 * @returns {Promise<object>} - The AI analysis result
 */
export async function analyzeTransactionAI(transaction, accountType = 'individual') {
    await delay(SIMULATED_LATENCY);

    const narration = (transaction.narration || transaction.description || '').toLowerCase();
    const amount = Math.abs(transaction.amount);
    const isSME = accountType === 'sme' || accountType === 'corporation';

    // Default response structure
    let response = {
        category: 'General',
        confidence: 0,
        isDeductible: false,
        vatStatus: 'N/A',
        reasoning: '',
        taxTip: ''
    };

    // Logic to simulate AI reasoning based on keywords
    if (narration.includes('uber') || narration.includes('bolt') || narration.includes('fuel')) {
        response = {
            category: 'Transport & Logistics',
            confidence: 96,
            isDeductible: isSME,
            vatStatus: 'Inclusive (7.5%)',
            reasoning: 'Recognized ride-hailing or fuel keywords. Considered a business expense for SMEs.',
            taxTip: isSME ? 'Keep a log of business vs. personal trips to claim this deduction.' : 'Personal transport is generally not tax-deductible for individuals.'
        };
    } else if (narration.includes('mtn') || narration.includes('airtel') || narration.includes('glo') || narration.includes('data')) {
        response = {
            category: 'Utilities & Internet',
            confidence: 92,
            isDeductible: isSME,
            vatStatus: 'Inclusive (7.5%)',
            reasoning: 'Telecommunications expense identified.',
            taxTip: 'Data and airtime used for business operations are fully deductible.'
        };
    } else if (narration.includes('food') || narration.includes('restaurant') || narration.includes('kitchen')) {
        response = {
            category: 'Meals & Entertainment',
            confidence: 88,
            isDeductible: isSME && amount > 5000, // Arbitrary threshold for "business meeting" simulation
            vatStatus: 'Inclusive (7.5%)',
            reasoning: 'Dining establishment detected.',
            taxTip: isSME ? 'Meals are only deductible if they are for client entertainment or staff welfare.' : 'Personal meals are not tax-deductible.'
        };
    } else if (narration.includes('salary') || narration.includes('payroll')) {
        response = {
            category: 'Payroll',
            confidence: 99,
            isDeductible: true,
            vatStatus: 'Exempt',
            reasoning: 'Payroll keyword detected.',
            taxTip: 'Ensure PAYE is remitted to the relevant state internal revenue service by the 10th of the following month.'
        };
    } else if (narration.includes('web') || narration.includes('hosting') || narration.includes('google') || narration.includes('aws')) {
        response = {
            category: 'Software & Subscriptions',
            confidence: 94,
            isDeductible: true,
            vatStatus: 'Reverse Charge may apply',
            reasoning: 'Tech service provider detected.',
            taxTip: 'For foreign services like AWS/Google, you may be liable to self-charge VAT if it wasn\'t charged on the invoice.'
        };
    } else {
        // Fallback for unknown
        response = {
            category: 'Miscellaneous',
            confidence: 65,
            isDeductible: false,
            vatStatus: 'Unknown',
            reasoning: 'Could not confidently categorize based on description.',
            taxTip: 'Review this transaction manually to ensure correct tax treatment.'
        };
    }

    return response;
}

/**
 * Simulates the AI Chat Assistant answering a tax question.
 * @param {string} query - The user's question
 * @param {object} context - Current page context or selected transaction
 * @returns {Promise<string>} - The assistant's response
 */
export async function askTaxAI(query, context = {}) {
    await delay(SIMULATED_LATENCY + 500); // Chat takes a bit longer to "think"

    const q = query.toLowerCase();

    // 1. VAT Related
    if (q.includes('vat') || q.includes('value added')) {
        if (q.includes('rate')) {
            return "The current standard VAT rate in Nigeria is **7.5%**, increased from 5% by the Finance Act 2020. This applies to most goods and services consumed in Nigeria.";
        }
        if (q.includes('exempt')) {
            return "Common VAT-exempt items in Nigeria include:\n- Basic food items (uncooked rice, beans, yam, etc.)\n- Medical and pharmaceutical products\n- Books and educational materials\n- Baby products\n- Fertilizer and locally produced agricultural equipment.";
        }
        // Fallthrough for general VAT queries
    }

    // 2. CIT / Income Tax
    if (q.includes('cit') || q.includes('corporate') || q.includes('profit')) {
        return "Companies Income Tax (CIT) is based on your turnover:\n- **Small Companies** (Turnover < ₦25m): **0%** rate.\n- **Medium Companies** (Turnover ₦25m - ₦100m): **20%** rate.\n- **Large Companies** (Turnover > ₦100m): **30%** rate.";
    }

    // 3. Deadlines
    if (q.includes('deadline') || q.includes('when') || q.includes('date')) {
        return "Key Tax Deadlines in Nigeria:\n- **VAT**: 21st of the following month.\n- **PAYE**: 10th of the following month.\n- **WHT**: 21st of the following month.\n- **CIT**: 6 months after your financial year end.";
    }

    // 4. Spending / Uber / Insights
    if (q.includes('uber') || q.includes('spend') || q.includes('much')) {
        return "I've analyzed your transaction history for the current period. You have spent a total of **₦245,600** on **Uber**, **Bolt**, and other transport-related services.\n\nThis represents approximately **12%** of your total operational outflows this month. Compared to last month, your transport spending has increased by **₦45,000** (roughly 22%).\n\n**Tax Tip:** Since your account is registered as an SME, most of these trips can be claimed as business expenses if they were for client meetings or staff logistics. I recommend tagging any personal trips as 'Non-deductible' to ensure your tax filing is accurate.";
    }

    if (q.includes('breakdown') || q.includes('category')) {
        try {
            // Dynamic breakdown implementation
            const { metrics } = getVATData('all', { type: 'preset', value: 'this_month' });
            const topCategories = metrics.categoryBreakdown.slice(0, 4);

            let breakdownText = topCategories
                .map(c => `- **${c.category}**: ${formatCurrency(c.amount)}`)
                .join('\n');

            let netStatus = metrics.isPayable ? "You have a **net payable** position" : "You have a **refundable** position";

            return `Here is your VAT breakdown for this month based on your actual data:\n\n${breakdownText}\n\n**Total Input VAT**: ${formatCurrency(metrics.inputVAT)}\n**Total Output VAT**: ${formatCurrency(metrics.outputVAT)}\n\n${netStatus} of **${formatCurrency(Math.abs(metrics.netPosition))}**.\n\nRemember to file your VAT returns by the 21st of the following month.`;
        } catch (e) {
            console.error(e);
            return "I'm having trouble accessing your specific VAT data right now. Generally, your VAT liability is calculated as the difference between the VAT you collect on sales (Output VAT) and the VAT you pay on purchases (Input VAT).";
        }
    }

    if (q.includes('liability') || q.includes('owe')) {
        return "Based on your real-time inflows and categorized outflows, your estimated total tax liability for this quarter stands at **₦450,000**.\n\nHere is how this figure is calculated:\n1. **Companies Income Tax (CIT)**: Estimated at **₦320,000** (based on a 20% effective rate for medium-sized entities).\n2. **Value Added Tax (VAT)**: **₦130,000** (Net payable after deducting allowable input VAT).\n\n**Recommendation:**\nTo maintain healthy cash flow, I recommend putting aside roughly **15%** of your weekly revenue into a separate tax savings account. This ensures you have adequate liquidity when filing time arrives.";
    }

    // 5. Greetings / General
    if (q.includes('hello') || q.includes('hi ') || q.startsWith('hi')) {
        return "Hello! I'm your Naijatax assistant. You can ask me about tax rates, deadlines, transaction deductibility, or Nigerian tax laws.";
    }

    // Default Fallback
    return "That's a great question. While I'm just a simulator right now, fully integrated I would search Nigerian tax laws (CITA, PITA, VATA) and your transaction history to answer: \"" + query + "\" giving you citations and specific advice relevant to your business type.";
}

/**
 * Batch categorizes a list of transactions.
 * Useful for the initial "Connect Account" flow.
 */
export async function batchCategorizeTransactions(transactions) {
    // In a real app, this might batch API calls. 
    // Here we just map over them.
    const promises = transactions.map(t => analyzeTransactionAI(t));
    return Promise.all(promises);
}
