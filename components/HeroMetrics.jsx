'use client';

import MetricCard from './MetricCard';
import { Flag, Banknote, FileText } from 'lucide-react';

export default function HeroMetrics() {
    return (
        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            <div className="min-w-[85vw] md:min-w-0 snap-center">
                <MetricCard
                    title="Your Tax Liability"
                    value="₦245,000"
                    subtitle="Based on ₦1.2M taxable income"
                    icon={<Flag className="text-primary-foreground/70" size={24} />}
                    variant="primary"
                >
                    <div className="mt-4">
                        <div className="w-full bg-black/20 rounded-full h-2">
                            <div className="bg-white h-2 rounded-full" style={{ width: '65%' }} />
                        </div>
                        <p className="text-xs mt-2 opacity-80">65% of estimated annual tax paid</p>
                    </div>
                </MetricCard>
            </div>

            <div className="min-w-[85vw] md:min-w-0 snap-center">
                <MetricCard
                    title="Potential Savings"
                    value="₦82,500"
                    subtitle="12 transactions flagged for deduction"
                    icon={<Banknote size={24} />}
                />
            </div>

            <div className="min-w-[85vw] md:min-w-0 snap-center">
                <MetricCard
                    title="VAT Paid (Q1)"
                    value="₦45,200"
                    subtitle="Across 156 transactions"
                    trend={{ value: '12%', isPositive: true }}
                    icon={<FileText size={24} />}
                />
            </div>
        </div>
    );
}
