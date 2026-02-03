'use client';

import { useState } from 'react';
import { useUser } from '@/components/UserProvider';
import DashboardLayout from '@/components/DashboardLayout';
import EmptyState from '@/components/EmptyState';
import InsightsCarousel from '@/components/InsightsCarousel';
import TransactionPreview from '@/components/TransactionPreview';
import MetricCard from '@/components/MetricCard';
import DateRangePicker from '@/components/DateRangePicker';
import { Divide, ArrowUpRight, Wallet, Flag, Clock, TrendingUp, ArrowUpLeft, Percent } from 'lucide-react';

// Import from centralized data processing library
import {
    getDashboardData,
    formatCurrency,
    formatCompact,
} from '@/lib/data';

export default function Home() {
    const { userAccount } = useUser();
    const [hasData, setHasData] = useState(true);
    const [dateRange, setDateRange] = useState({ type: 'preset', value: 'this_month' });

    // Use the centralized data processing library
    const { transactions: filteredTransactions, metrics, insights } = getDashboardData(userAccount, dateRange);

    if (!hasData || filteredTransactions.length === 0 && !dateRange) {
        return (
            <DashboardLayout>
                <EmptyState />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-10 animate-in">
                {/* Standardized Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <TrendingUp size={22} className="text-primary" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-foreground">Financial Overview</h1>
                            <p className="text-sm text-muted-foreground">
                                Track your cash flow and tax payments
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <DateRangePicker onChange={setDateRange} />
                    </div>
                </div>

                {/* Primary Metrics */}
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {/* Primary Metrics */}
                        <div className="lg:col-span-2">
                            <MetricCard
                                title={metrics.isVATPayable ? "Tax Liability" : "VAT Refundable"}
                                value={formatCurrency(metrics.taxLiability)}
                                subtitle={metrics.isVATPayable
                                    ? "An estimate of how much you owe"
                                    : "Estimated VAT credit due to you"}
                                icon={<Flag size={24} strokeWidth={2} />}
                                variant="primary"
                            >
                                <div className="mt-1">
                                    <div className="w-full bg-primary/20 rounded-full h-2.5 overflow-hidden">
                                        <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: '65%' }} />
                                    </div>
                                    <p className="text-xs mt-3 font-medium text-muted-foreground">
                                        {metrics.isVATPayable
                                            ? <><span className="text-foreground font-bold">65%</span> of estimated annual tax already paid</>
                                            : <><span className="text-foreground font-bold">Input VAT</span> exceeds output VAT for this period</>
                                        }
                                    </p>
                                </div>
                            </MetricCard>
                        </div>

                        <MetricCard
                            title="Effective Tax Rate"
                            value={`${metrics.effectiveTaxRate.toFixed(1)}%`}
                            subtitle={`Based on ${formatCurrency(metrics.netInflow)} taxable income`}
                            icon={<Percent size={24} strokeWidth={2} />}
                            variant="accent"
                        />

                        <MetricCard
                            title="VAT Due"
                            value={formatCurrency(Math.abs(metrics.vatPosition))}
                            subtitle={metrics.isVATPayable ? "Payable to Nigeria Revenue Service (NRS)" : "Refundable from Nigeria Revenue Service (NRS)"}
                            trend={{ value: '12%', isPositive: !metrics.isVATPayable }}
                            icon={<Clock size={24} strokeWidth={2} />}
                        />

                        {/* Secondary Metrics */}
                        <MetricCard
                            title="Total Inflow"
                            value={formatCompact(metrics.inflow)}
                            trend={{ value: '+18%', isPositive: true }}
                            icon={<ArrowUpLeft size={24} strokeWidth={2} />}
                        />

                        <MetricCard
                            title="Total Outflow"
                            value={formatCompact(metrics.outflow)}
                            trend={{ value: '-5%', isPositive: false }}
                            icon={<ArrowUpRight size={24} strokeWidth={2} />}
                        />

                        <MetricCard
                            title="Total Transactions"
                            value={metrics.transactionCount.toString()}
                            subtitle="Volume this period"
                            icon={<Wallet size={24} strokeWidth={2} />}
                        />

                        <MetricCard
                            title="Avg. Transaction"
                            value={formatCurrency(metrics.avgTransaction)}
                            icon={<Divide size={24} strokeWidth={2} />}
                        />
                    </div>
                </section>

                {/* Smart Insights */}
                <section>
                    <InsightsCarousel insights={insights} />
                </section>

                {/* Transactions Table */}
                <section>
                    <TransactionPreview transactions={filteredTransactions} title="Transaction History" limit={10} />
                </section>
            </div>
        </DashboardLayout>
    );
}
