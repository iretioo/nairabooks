'use client';

import { useState, useMemo } from 'react';
import {
    ArrowUpRight,
    ArrowDownLeft,
    Info,
    ArrowRight,
    Download,
    Search,
    ChevronDown,
    X,
    Check,
    Clock,
    AlertCircle,
    FileText,
    Zap,
    ShieldCheck,
    Calendar,
    Building,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function TransactionPreview({
    transactions = [],
    title = "Recent Transactions",
    limit,
    showFilters = true
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    // Filter logic
    const categories = useMemo(() => {
        return ['All Categories', ...new Set(transactions.map(t => t.category))];
    }, [transactions]);

    const filteredTransactions = useMemo(() => {
        let result = transactions;
        if (showFilters) {
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                result = result.filter(tx =>
                    tx.description.toLowerCase().includes(query) ||
                    tx.counterparty.toLowerCase().includes(query)
                );
            }
            if (categoryFilter !== 'All Categories') {
                result = result.filter(tx => tx.category === categoryFilter);
            }
        }
        return result;
    }, [transactions, searchQuery, categoryFilter, showFilters]);

    const displayTransactions = limit ? filteredTransactions.slice(0, limit) : filteredTransactions;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(amount).replace('NGN', '₦');
    };

    if (transactions.length === 0) {
        return (
            <div className="bg-card rounded-2xl border-2 border-border p-12 text-center">
                <Info size={32} className="mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-bold">No activity yet</h3>
                <p className="text-muted-foreground text-sm">Your transaction history will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-card rounded-2xl border-2 border-border overflow-hidden transition-all duration-300">
                {/* Header Style with explicit CTA buttons */}
                <div className="p-6 border-b-2 border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
                    <div>
                        <h3 className="font-black text-base text-foreground leading-none mb-1.5">{title}</h3>
                        <p className="text-[12px] text-muted-foreground font-medium">
                            Showing {displayTransactions.length} of {filteredTransactions.length} records
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="h-9 px-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all flex items-center gap-2 text-[11px] font-bold bg-white dark:bg-transparent border border-border group" title="Export CSV">
                            <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                            <span>Export</span>
                        </button>
                        {limit && limit < filteredTransactions.length && (
                            <Link href="/transactions" className="h-9 px-4 text-[11px] font-black text-primary rounded-xl hover:bg-primary/20 transition-all flex items-center gap-1.5 group/link border border-border">
                                View All <ArrowRight size={14} strokeWidth={3} className="group-hover/link:translate-x-0.5 transition-transform" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="p-4 border-b-2 border-border bg-muted/5 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-10 bg-white dark:bg-black/20 rounded-xl pl-10 pr-4 text-sm font-medium border-none ring-1 ring-border focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all"
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="h-10 pl-4 pr-10 bg-white dark:bg-black/20 rounded-xl text-xs font-medium border-none ring-1 ring-border appearance-none cursor-pointer focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all min-w-[160px]"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>
                )}

                {/* Table Layout */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-muted/30 text-[10px] text-center uppercase font-medium text-muted-foreground border-b-2 border-border">
                                <th className="px-6 py-4 text-left">Date</th>
                                <th className="px-4 py-4 text-left">Transaction</th>
                                <th className="px-4 py-4 text-left">Category</th>
                                <th className="px-4 py-4">Amount</th>
                                <th className="px-4 py-4">VAT (7.5%)</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-left">Note</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {displayTransactions.map((tx) => (
                                <tr
                                    key={tx.id}
                                    onClick={() => setSelectedTransaction(tx)}
                                    className="group hover:bg-muted/40 transition-all cursor-pointer"
                                >
                                    {/* Original Date Style */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-[11px] font-medium text-black">
                                            {tx.date}
                                        </span>
                                    </td>

                                    {/* Combined Transaction/Vendor */}
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-8 w-8 flex items-center justify-center rounded-lg shrink-0 ${tx.type === 'Sale' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                                                }`}>
                                                {tx.type === 'Sale' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[12px] font-medium text-black truncate group-hover:text-primary transition-colors">
                                                    {tx.description}
                                                </span>
                                                <span className="text-[11px] text-muted-foreground truncate font-medium">
                                                    {tx.counterparty}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium capitalize bg-secondary/10 text-primary border border-secondary/20">
                                            {tx.category}
                                        </span>
                                    </td>

                                    {/* Total before VAT */}
                                    <td className="px-4 py-4 text-right whitespace-nowrap font-medium text-[11px] text-black">
                                        {formatCurrency(tx.totalAmount)}
                                    </td>

                                    {/* VAT Amount */}
                                    <td className="px-4 py-4 text-right whitespace-nowrap font-medium text-[11px]">
                                        {tx.vatAmount > 0 ? (
                                            <span className={tx.type === 'Sale' ? 'text-emerald-600' : 'text-rose-600'}>
                                                {tx.type === 'Sale' ? '+' : '-'} {formatCurrency(tx.vatAmount)}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground/40 font-medium"></span>
                                        )}
                                    </td>

                                    {/* NRS Status (Checkmark for Taxed transactions) */}
                                    <td className="px-6 py-4 text-center">
                                        {tx.taxStatus === 'Taxable' ? (
                                            <div className="flex items-center justify-center">
                                                {tx.irnStatus === 'Validated' ? (
                                                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/20" title="IRN Validated">
                                                        <CheckCircle2 size={10} strokeWidth={2.5} />
                                                    </div>
                                                ) : tx.irnStatus === 'Pending' ? (
                                                    <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20" title="Validation Pending">
                                                        <Clock size={10} strokeWidth={2.5} />
                                                    </div>
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600 border border-rose-500/20" title="NRB Filing Missing">
                                                        <AlertCircle size={10} strokeWidth={2.5} />
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground/30"></span>
                                        )}
                                    </td>

                                    {/* Note (specifically for Exempt/Zero-Rated) */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {tx.taxStatus !== 'Taxable' ? (
                                            <span className="text-[11px] font-medium text-black capitalize tracking-tight">
                                                {tx.taxStatus}
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-muted-foreground/30"></span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Transaction Detail Modal */}
            {selectedTransaction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in">
                    <div
                        className="absolute inset-0 bg-background/60"
                        onClick={() => setSelectedTransaction(null)}
                    />
                    <div className="relative w-full max-w-lg bg-card rounded-2xl border-2 border-border overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-6 border-b-2 border-border flex items-center justify-between bg-muted/10">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl ${selectedTransaction.type === 'Sale' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                                    }`}>
                                    {selectedTransaction.type === 'Sale' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-black text-base text-foreground">Transaction Details</h4>
                                    <p className="text-[10px] text-muted-foreground font-mono uppercase">ID: {selectedTransaction.id}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedTransaction(null)}
                                className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6 scrollbar-hide">
                            {/* Summary Card */}
                            <div className="bg-muted/10 py-2 text-center space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Value</p>
                                <h2 className="text-xl font-black text-foreground">
                                    {formatCurrency(selectedTransaction.totalAmount)}
                                </h2>
                                <p className="text-[10px] font-bold text-foreground max-w-[80%] mx-auto">{selectedTransaction.description}</p>
                            </div>

                            {/* Detailed Grid */}
                            <div className="grid grid-cols-2 text-center">
                                <div className="bg-muted/5">
                                    <span className="text-[10px] font-black uppercase text-muted-foreground/60 block mb-1">Date</span>
                                    <div className="flex justify-center gap-2 text-[10px] font-black tracking-wide">
                                        <Calendar size={14} className="text-primary" />
                                        {selectedTransaction.date}
                                    </div>
                                </div>
                                <div className="bg-muted/5 py-2">
                                    <span className="text-[10px] font-black uppercase text-muted-foreground/60 block mb-1">Category</span>
                                    <div className="text-[10px] font-black tracking-wide">
                                        {selectedTransaction.category}
                                    </div>
                                </div>
                                <div className="bg-muted/5 py-2">
                                    <span className="text-[10px] font-black uppercase text-muted-foreground/60 block mb-1">Amount</span>
                                    <div className="text-[10px] font-black">
                                        {formatCurrency(selectedTransaction.netAmount)}
                                    </div>
                                </div>
                                <div className="bg-muted/5 py-2">
                                    <span className="text-[10px] font-black uppercase text-muted-foreground/60 block mb-1">VAT (7.5%)</span>
                                    <div className={`text-[10px] font-black ${selectedTransaction.vatAmount > 0 ? (selectedTransaction.type === 'Sale' ? 'text-emerald-600' : 'text-rose-600') : 'text-muted-foreground'}`}>
                                        {selectedTransaction.vatAmount > 0 ? formatCurrency(selectedTransaction.vatAmount) : 'Non-taxable'}
                                    </div>
                                </div>
                            </div>

                            {/* Compliance Info */}
                            <div className="grid grid-cols-2 text-center">
                                <div className="bg-muted/5 py-2">
                                    <span className="text-[10px] font-black uppercase text-muted-foreground/60 block mb-1">Tax Policy</span>
                                    <span className="text-[10px] font-black">{selectedTransaction.taxStatus}</span>
                                </div>
                                <div className="bg-muted/5 py-2">
                                    <span className="text-[10px] font-black uppercase text-muted-foreground/60 block mb-1">NRS Status</span>
                                    <div className="flex justify-center gap-2">
                                        {selectedTransaction.taxStatus === 'Taxable' ? (
                                            <>
                                                {selectedTransaction.irnStatus === 'Validated' ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Clock size={14} className="text-amber-500" />}
                                                <span className="text-[10px] font-black">{selectedTransaction.irnStatus}</span>
                                            </>
                                        ) : <span className="text-[10px] font-black text-muted-foreground/40">N/A</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Entity Details */}
                            <div className="text-center">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex justify-center gap-2 py-2">
                                    <Building size={14} /> Counterparty
                                </h5>
                                <div>
                                    <p className="text-[10px] font-black text-foreground">{selectedTransaction.counterparty}</p>
                                    <p className="text-[10px] font-mono text-muted-foreground mt-1">TIN: {selectedTransaction.counterpartyTIN}</p>
                                </div>
                            </div>

                            {/* AI Reasoning */}
                            <div className="space-y-3 mt-12 text-center">
                                <div className="flex justify-center items-center gap-2">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground/60">
                                        <ShieldCheck size={16} /> Reasoning
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-primary/10 px-2 py-0.5 rounded-full text-[10px] font-black text-primary border border-primary/20">
                                        <Zap size={10} className="fill-primary" /> {selectedTransaction.confidence}% Confidence
                                    </div>
                                </div>
                                <p className="text-[10px] font-bold text-foreground leading-relaxed italic">
                                    "{selectedTransaction.reasoning}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

