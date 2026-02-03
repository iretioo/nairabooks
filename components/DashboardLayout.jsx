'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import AIAssistant from './AIAssistant';
import { Sparkles, Menu, Search, Bell } from 'lucide-react';

export default function DashboardLayout({ children }) {
    const [isAIOpen, setIsAIOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50/50">
            {/* Mobile Sidebar Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Fixed on mobile, Static on desktop (App Shell) */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-70 md:w-72 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

                {/* Minimal Top Bar - Contextual Actions Only */}
                <header className="flex-none flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-gray-200/50 lg:bg-transparent lg:border-transparent lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsAIOpen(!isAIOpen)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold shadow-sm transition-all ${isAIOpen
                                ? 'bg-primary text-white'
                                : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                                }`}
                        >
                            <Sparkles size={16} fill={isAIOpen ? "currentColor" : "none"} strokeWidth={2} />
                            <span>Ask AI</span>
                        </button>
                    </div>
                </header>


                <main className="flex-1 overflow-y-auto p-4 lg:p-8 pt-6">
                    <div className="max-w-6xl mx-auto pb-10">
                        {children}
                    </div>
                </main>
            </div>

            {/* AI Assistant Drawer */}
            <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
        </div>
    );
}
