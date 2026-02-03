'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import MetricCard from '@/components/MetricCard';
import TransactionPreview from '@/components/TransactionPreview';
import DateRangePicker from '@/components/DateRangePicker';
import { useUser } from '@/components/UserProvider';
import { ArrowUpRight, ArrowDownLeft, PieChart, Wallet, Info, ArrowRight } from 'lucide-react';

// Import from centralized data processing library
import {
    getVATData,
    getVATBreakdownData,
    formatCurrencyPrecise,
} from '@/lib/data';

export default function VATPage() {
    // Access global user account for data selection
    const { userAccount } = useUser();

    // State for filtering (date range is local to this report view)
    const [dateFilter, setDateFilter] = useState({ type: 'preset', value: 'this_month' });

    // State for breakdown view
    const [activeBreakdown, setActiveBreakdown] = useState(null); // null, 'input', 'output'

    // Use the centralized data processing library
    const { transactions, metrics, irnStats } = getVATData(userAccount, dateFilter);

    // Get breakdown data based on active selection
    const breakdownData = activeBreakdown
        ? getVATBreakdownData(userAccount, dateFilter, activeBreakdown)
        : null;

    // Determine transactions to display
    const displayTransactions = breakdownData?.transactions || transactions;
    const subtotal = breakdownData?.subtotal || 0;
    const listTitle = activeBreakdown === 'input'
        ? "Input VAT Breakdown (Purchases)"
        : activeBreakdown === 'output'
            ? "Output VAT Breakdown (Sales)"
            : "All Transactions";

    // Helper for colors based on index
    const getBarColor = (index) => {
        const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500'];
        return colors[index % colors.length];
    };

    // Handlers
    const handleBreakdown = (type) => {
        setActiveBreakdown(type);
        // Optional: Scroll to list
        const element = document.getElementById('transaction-list');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const clearBreakdown = () => {
        setActiveBreakdown(null);
    };

    // Get top 5 categories for breakdown display
    const breakdownItems = metrics.categoryBreakdown.slice(0, 5);
    const totalVATVolume = metrics.inputVAT + metrics.outputVAT;

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Standardized Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <PieChart size={22} className="text-primary" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-foreground">VAT Tracker</h1>
                            <p className="text-sm font-normal text-muted-foreground">
                                Real-time value added tax obligations
                            </p>
                        </div>
                    </div>

                    {/* Date Filter */}
                    <div className="flex items-center gap-3">
                        <DateRangePicker onChange={(filter) => setDateFilter(filter)} />
                    </div>
                </div>

                {/* Core Metrics */}
                <div className="grid md:grid-cols-3 gap-6">
                    <MetricCard
                        title="VAT Paid"
                        value={formatCurrencyPrecise(metrics.inputVAT)}
                        subtitle="Total VAT you paid on purchases"
                        icon={<ArrowDownLeft size={18} />}
                        trend={{ value: "12%", isPositive: true }}
                        variant="default"
                    >
                        <button
                            onClick={() => handleBreakdown('input')}
                            className="text-[10px] font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                        >
                            View Breakdown <ArrowRight size={12} />
                        </button>
                    </MetricCard>
                    <MetricCard
                        title="VAT Collected"
                        value={formatCurrencyPrecise(metrics.outputVAT)}
                        subtitle="Total VAT you collected on sales"
                        icon={<ArrowUpRight size={18} />}
                        trend={{ value: "8%", isPositive: true }}
                        variant="default"
                    >
                        <button
                            onClick={() => handleBreakdown('output')}
                            className="text-[10px] font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                        >
                            View Breakdown <ArrowRight size={12} />
                        </button>
                    </MetricCard>
                    <MetricCard
                        title={metrics.isPayable ? "VAT Payable" : "VAT Refundable"}
                        value={formatCurrencyPrecise(Math.abs(metrics.netPosition))}
                        subtitle={metrics.isPayable ? "Due to Nigeria Revenue Service (NRS)" : "Claimable from NRS"}
                        icon={<Wallet size={18} />}
                        variant="default"
                    >
                        {/* Mini status indicator */}
                        <div className={`mt-2 text-[10px] font-bold ${metrics.isPayable ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {metrics.isPayable ? "Payment Due Soon" : "Credit Available"}
                        </div>
                    </MetricCard>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Breakdown Section - Spans 2 cols */}
                    <div className="md:col-span-2 rounded-2xl p-6 border-2 border-border bg-card">
                        <h2 className="text-base font-bold flex items-center gap-2">
                            VAT Breakdown by Category
                        </h2>
                        <div className="space-y-6">
                            {breakdownItems.map((item, index) => (
                                <div key={item.category} className="group cursor-pointer">
                                    <div className="flex items-end justify-between mb-2">
                                        <div>
                                            <span className="block text-[12px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">{item.category}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[12px] font-black text-foreground">₦{item.amount.toLocaleString()}</span>
                                            <span className="text-xs text-muted-foreground">{item.percentage}% of total volume</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-secondary/20 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110 ${getBarColor(index)}`}
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Compliance Insight Card */}
                    <div className="rounded-2xl p-6 border-2 border-border bg-card flex flex-col justify-between relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-base font-bold mb-3">Compliance Insight</h3>

                            {/* IRN Status Summary */}
                            <div className="space-y-3 mb-4">
                                {/* Validated */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-xs font-medium text-muted-foreground">Validated</span>
                                    </div>
                                    <span className="text-xs font-bold text-foreground">{irnStats.validated}</span>
                                </div>

                                {/* Pending */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                        <span className="text-xs font-medium text-muted-foreground">Pending</span>
                                    </div>
                                    <span className="text-xs font-bold text-amber-600">{irnStats.pending}</span>
                                </div>

                                {/* Missing */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                        <span className="text-xs font-medium text-muted-foreground">Missing</span>
                                    </div>
                                    <span className="text-xs font-bold text-rose-600">{irnStats.missing}</span>
                                </div>
                            </div>

                            {/* Compliance Rate */}
                            <div className="pt-3 border-t border-border/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-muted-foreground">Compliance Rate</span>
                                    <span className={`text-sm font-black ${irnStats.complianceRate >= 90 ? 'text-emerald-600' :
                                        irnStats.complianceRate >= 70 ? 'text-amber-600' :
                                            'text-rose-600'
                                        }`}>
                                        {irnStats.complianceRate}%
                                    </span>
                                </div>
                                <div className="w-full bg-secondary/20 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${irnStats.complianceRate >= 90 ? 'bg-emerald-500' :
                                            irnStats.complianceRate >= 70 ? 'bg-amber-500' :
                                                'bg-rose-500'
                                            }`}
                                        style={{ width: `${irnStats.complianceRate}%` }}
                                    />
                                </div>
                            </div>

                            {/* Warning Message */}
                            {(irnStats.pending > 0 || irnStats.missing > 0) && (
                                <p className="text-xs text-muted-foreground leading-relaxed mt-4">
                                    {irnStats.pending > 0 && (
                                        <>Ensure pending transactions are validated by NRS within 7 days to avoid penalties. </>
                                    )}
                                    {irnStats.missing > 0 && (
                                        <>Missing IRN means input VAT is non-claimable.</>
                                    )}
                                </p>
                            )}
                        </div>

                        {(irnStats.pending > 0 || irnStats.missing > 0) && (
                            <button
                                onClick={() => {
                                    // Scroll to transaction list
                                    const element = document.getElementById('transaction-list');
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                                className="relative z-10 mt-6 text-[12px] font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group/btn"
                            >
                                Review {irnStats.pending > 0 ? 'Pending' : 'Missing'} Items <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Transaction List */}
                <div id="transaction-list">
                    {activeBreakdown && (
                        <div className="mb-4 flex justify-between items-center">
                            <div className="text-[10px] font-medium text-muted-foreground">
                                Filtering by: <span className="text-foreground font-bold capitalize">{activeBreakdown} VAT</span>
                            </div>
                            <button
                                onClick={clearBreakdown}
                                className="text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors underline decoration-dotted"
                            >
                                Clear Filter
                            </button>
                        </div>
                    )}
                    <TransactionPreview
                        transactions={displayTransactions}
                        title={listTitle}
                        limit={activeBreakdown ? undefined : 10}
                        summary={activeBreakdown && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-muted-foreground">Total {activeBreakdown === 'input' ? 'Input' : 'Output'} VAT</span>
                                <span className="text-xl font-black text-foreground">₦{subtotal.toLocaleString()}</span>
                            </div>
                        )}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
