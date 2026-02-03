'use client';

import { ArrowRight, Landmark, FileUp, ShieldCheck, Database, Lock } from 'lucide-react';

export default function EmptyState() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
            <div className="max-w-3xl mx-auto text-center">
                <div className="mb-10 animate-in delay-100">
                    <div className="text-8xl mb-6 filter drop-shadow-2xl hover:scale-105 transition-transform duration-500 cursor-default select-none animate-in zoom-in spin-in-3">
                        🇳🇬
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-extrabold mb-6 tracking-tight leading-tight">
                        Welcome to <span className="text-brand-gradient">NaijaTax</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted max-w-lg mx-auto leading-relaxed text-balance">
                        Understand your tax obligations in real-time.
                        <span className="block text-foreground font-semibold mt-2">All processing happens in your browser.</span>
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-16 animate-in delay-200">
                    <button className="group relative overflow-hidden p-8 bg-gradient-to-br from-primary via-primary to-emerald-800 text-white rounded-3xl shadow-2xl shadow-primary/20 hover:shadow-3xl hover:shadow-primary/30 hover:-translate-y-1 transition-all text-left ring-4 ring-transparent hover:ring-white/20">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <Landmark size={140} strokeWidth={0.5} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 mb-6 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
                                <Landmark size={28} />
                            </div>
                            <h3 className="font-display font-bold text-2xl mb-2 flex items-center gap-2">
                                Connect via Mono
                                <ArrowRight size={20} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </h3>
                            <p className="text-primary-content/80 text-base leading-relaxed">
                                Securely link your bank account to auto-generate your tax profile in seconds.
                            </p>
                        </div>
                    </button>

                    <button className="group relative overflow-hidden p-8 bg-surface border border-border/80 hover:border-primary/40 rounded-3xl hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all text-left">
                        <div className="absolute inset-0 bg-surface-alt/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 block">
                            <div className="w-14 h-14 mb-6 bg-surface-alt border border-border rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-white group-hover:border-primary/20 transition-colors">
                                <FileUp size={28} className="text-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <h3 className="font-display font-bold text-2xl mb-2 text-foreground group-hover:text-primary transition-colors">Import CSV</h3>
                            <p className="text-muted text-base leading-relaxed">
                                Don't want to connect? Upload your bank statement manually to get started.
                            </p>
                        </div>
                    </button>
                </div>

                <div className="bg-surface/50 backdrop-blur-sm border border-border/50 p-8 rounded-3xl animate-in delay-300 mx-auto max-w-2xl">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <Lock className="text-primary" size={24} />
                        <h3 className="font-display font-bold text-lg text-foreground">Privacy First Architecture</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-surface border border-border/50 hover:border-primary/20 transition-colors">
                            <div className="text-success p-2 bg-success/10 rounded-full">
                                <ShieldCheck size={20} />
                            </div>
                            <span className="font-semibold text-foreground">Client-side only</span>
                        </div>
                        <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-surface border border-border/50 hover:border-primary/20 transition-colors">
                            <div className="text-success p-2 bg-success/10 rounded-full">
                                <Database size={20} />
                            </div>
                            <span className="font-semibold text-foreground">No server storage</span>
                        </div>
                        <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-surface border border-border/50 hover:border-primary/20 transition-colors">
                            <div className="text-success p-2 bg-success/10 rounded-full">
                                <Lock size={20} />
                            </div>
                            <span className="font-semibold text-foreground">Open source</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
