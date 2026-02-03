'use client';

import DashboardLayout from '@/components/DashboardLayout';
import {
    Settings,
    CreditCard,
    Trash2,
    FileText as FileCsv,
    ShieldCheck,
    Database,
    Plus,
    Lock,
    Landmark
} from 'lucide-react';
import data from '@/data.json';

export default function SettingsPage() {
    // Map existing profiles from data.json as connected accounts for PoC
    const accounts = Object.entries(data).map(([key, profile]) => ({
        id: key,
        name: profile.accountInfo.accountName,
        number: profile.accountInfo.accountNumber,
        bank: profile.accountInfo.bank,
        type: profile.accountType,
    }));

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-10 animate-in pb-12">
                {/* Standardized Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Settings size={22} className="text-primary" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-foreground">Settings</h1>
                            <p className="text-sm font-normal text-muted-foreground">
                                Manage your accounts, preferences and data storage
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-12">
                    {/* Connected Accounts Section */}
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <CreditCard size={18} className="text-primary" />
                            <h2 className="text-base font-bold tracking-tight">Connected Accounts</h2>
                        </div>

                        <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
                            <div className="divide-y divide-border">
                                {accounts.map((acc) => (
                                    <div key={acc.id} className="flex items-center justify-between p-3 hover:bg-muted/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                                                <Landmark size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-bold text-foreground">{acc.bank}</p>
                                                <p className="text-xs text-muted-foreground font-medium">{acc.name} • {acc.number} • {acc.type}</p>
                                            </div>
                                        </div>
                                        <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-destructive hover:bg-destructive/10 rounded-xl transition-all uppercase tracking-widest">
                                            <Trash2 size={14} />
                                            Unlink
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-muted/20 border-t border-border">
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-border rounded-2xl hover:border-primary hover:bg-primary/5 hover:text-primary transition-all text-[12px] font-bold text-muted-foreground group">
                                    <Plus size={20} className="group-hover:scale-110 transition-transform" />
                                    Connect New Account
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Data & Security Section */}
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <Lock size={18} className="text-primary" />
                            <h2 className="text-base font-bold tracking-tight">Data & Security</h2>
                        </div>

                        <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                                {/* Security Promise */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Privacy First</p>
                                            <p className="text-sm font-black text-foreground tracking-tight">Your data stays with you</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="w-1 h-full bg-primary/20 rounded-full" />
                                            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                                                <strong className="text-foreground block mb-1 uppercase text-[10px] tracking-widest">Client-Side Only</strong>
                                                Your transaction data never leaves your browser. All tax calculations and profile data are processed locally on your machine.
                                            </p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-1 h-full bg-primary/20 rounded-full" />
                                            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                                                <strong className="text-foreground block mb-1 uppercase text-[10px] tracking-widest">Open Source</strong>
                                                This tool is fully transparent and auditable. Feel free to inspect the codebase on GitHub.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Data Controls */}
                                <div className="space-y-8 bg-muted/20 p-8 rounded-2xl border border-border/50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Local Storage</p>
                                            <div className="flex items-baseline gap-2">
                                                <p className="text-xl font-black text-foreground">2.4 MB</p>
                                                <p className="text-xs font-bold text-primary italic">
                                                    15% of capacity
                                                </p>
                                            </div>
                                        </div>
                                        <Database size={32} className="text-primary/10" />
                                    </div>

                                    <div className="w-full bg-muted rounded-full h-2 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-primary/10" />
                                        <div className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-1000" style={{ width: '15%' }} />
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-all font-black text-xs">
                                            <FileCsv size={16} />
                                            Export (CSV)
                                        </button>

                                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-4 border-2 border-destructive text-destructive hover:bg-destructive hover:text-white transition-all rounded-xl font-black text-xs">
                                            <Trash2 size={16} />
                                            Clear Data
                                        </button>
                                    </div>

                                    <p className="text-[10px] text-muted-foreground text-center">
                                        Clearing data will permanently remove all sync history from this browser.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div >
        </DashboardLayout >
    );
}
