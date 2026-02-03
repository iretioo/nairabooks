'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import TransactionPreview from '@/components/TransactionPreview';
import DateRangePicker from '@/components/DateRangePicker';
import { useUser } from '@/components/UserProvider';
import { Wallet2 } from 'lucide-react';

// Import from centralized data processing library
import { getFilteredTransactions } from '@/lib/data';

export default function TransactionsPage() {
    const { userAccount } = useUser();
    const [dateRange, setDateRange] = useState({ type: 'preset', value: 'ytd' });

    // Use the centralized data processing library with filters
    const allTransactions = getFilteredTransactions(userAccount, { dateRange });

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-10 animate-in">
                {/* Standardized Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Wallet2 size={22} className="text-primary" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-foreground">Transactions</h1>
                            <p className="text-sm font-normal text-muted-foreground">
                                Review and categorize your financial activity
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <DateRangePicker onChange={setDateRange} />
                    </div>
                </div>

                {/* Integrated Transaction Table with Search & Filters */}
                <TransactionPreview transactions={allTransactions} title="All Transactions" />
            </div>
        </DashboardLayout>
    );
}
