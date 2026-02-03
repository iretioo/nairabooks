'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/components/UserProvider';
import { LayoutDashboard, PieChart, ChevronDown, Check, Settings, Wallet2, Layers, Plus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { getAvailableAccounts } from '@/lib/data';

const AccountSwitcher = () => {
    const { userAccount, setUserAccount } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Use centralized data access for accounts
    const availableAccounts = getAvailableAccounts();

    // Transform to display format
    const accounts = availableAccounts.map(acc => ({
        id: acc.id,
        label: acc.name,
        desc: acc.id === 'all'
            ? `Combined Data`
            : `${acc.bank} • ${acc.accountNumber}`
    }));

    const currentAccount = accounts.find(a => a.id === userAccount) || accounts[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200
                    bg-gradient-to-br from-gray-50 to-white border-2 text-left
                    ${isOpen
                        ? 'border-primary'
                        : 'border-gray-200 hover:border-primary'
                    }
                    group
                `}
            >
                <div className={`
                    w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-200 bg-primary text-white
                `}>
                    {currentAccount.label.charAt(0)}
                </div>
                <div className="flex flex-col items-start overflow-hidden flex-1 min-w-0">
                    <span className="text-xs font-bold text-gray-900 truncate w-full">
                        {currentAccount.label}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium truncate w-full mt-0.5">
                        {currentAccount.desc}
                    </span>
                </div>
                <ChevronDown
                    size={18}
                    className={`transition-all duration-300 shrink-0 ${isOpen
                        ? 'text-primary rotate-180'
                        : 'text-gray-400 group-hover:text-primary'
                        }`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-[calc(100%+12px)] left-0 w-full bg-white rounded-xl border-2 border-gray-100 shadow-2xl shadow-gray-300/30 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 z-50">
                    <div className="p-1.5 space-y-0.5 max-h-[320px] overflow-y-auto custom-scrollbar">
                        <div className="px-3 py-2.5 text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center justify-between">
                            <span>Switch Account</span>
                        </div>
                        {accounts.map((acc) => (
                            <button
                                key={acc.id}
                                onClick={() => {
                                    setUserAccount(acc.id);
                                    setIsOpen(false);
                                }}
                                className={`
                                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left group/item
                                    ${userAccount === acc.id
                                        ? 'bg-emerald-50 border border-emerald-200/50'
                                        : 'hover:bg-gray-50 border border-transparent'
                                    }
                                `}
                            >
                                <div className={`
                                    w-6 h-6 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-200
                                    ${userAccount === acc.id
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-600 group-hover/item:bg-gray-200'
                                    }
                                `}>
                                    {acc.label.charAt(0)}
                                </div>
                                <div className="flex-1 overflow-hidden min-w-0">
                                    <span className={`block text-xs font-bold truncate ${userAccount === acc.id ? 'text-emerald-900' : 'text-gray-700'
                                        }`}>
                                        {acc.label}
                                    </span>
                                    <span className="block text-[10px] text-gray-500 truncate mt-0.5">
                                        {acc.desc}
                                    </span>
                                </div>
                                {userAccount === acc.id && (
                                    <Check size={16} className="text-primary shrink-0" strokeWidth={3} />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Add New Account Section */}
                    <div className="p-1.5 border-t-2 border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                        <button
                            onClick={() => {
                                alert('Connect New Account flow');
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white hover:bg-gradient-to-br hover:from-emerald-50 hover:to-emerald-50/50 border border-gray-200 hover:border-emerald-300 transition-all duration-200 text-left text-gray-600 hover:text-emerald-700 group/add"
                        >
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-gray-100 group-hover/add:bg-primary text-gray-400 group-hover/add:text-white transition-all duration-200">
                                <Plus size={18} strokeWidth={2.5} />
                            </div>
                            <span className="text-xs font-bold">Connect New Account</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const SidebarItem = ({ icon: Icon, label, href }) => {
    const pathname = usePathname();
    // Simple logic to check if active. Exact match for root, startsWith for others to handle subpages if needed.
    const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

    return (
        <Link
            href={href}
            className={`
                relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                ${isActive
                    ? 'bg-emerald-50 text-primary'
                    : 'text-black hover:bg-gray-50 hover:text-primary'
                }
            `}
        >
            <Icon
                size={18}
                className={`transition-colors duration-200 ${isActive ? 'text-primary' : 'text-black group-hover:text-primary'}`}
                strokeWidth={isActive ? 2.5 : 2}
            />
            <span className={`text-sm font-medium ${isActive ? 'font-bold' : ''}`}>
                {label}
            </span>
            {isActive && (
                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary" />
            )}
        </Link>
    );
};

export default function Sidebar() {
    return (
        <aside className="w-70 md:w-72 bg-white border-r-2 border-gray-100 h-screen flex flex-col shrink-0 z-30">
            {/* Branding Header */}
            <div className="px-6 pt-6 pb-5 border-b border-gray-100">
                <div className="mb-5">
                    {/* Logo and Brand */}
                    <div className="flex items-start gap-2 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 19.5C4 18.12 5.12 17 6.5 17H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6.5 2H20V22H6.5C5.12 22 4 20.88 4 19.5V4.5C4 3.12 5.12 2 6.5 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 8H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 12H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-tight">
                                NairaBooks
                            </h1>
                            <p className="text-[11px] font-semibold text-gray-500 tracking-wide mt-0.5">
                                Modern Accounting for Nigerians
                            </p>
                        </div>
                    </div>

                    {/* Proof of Concept Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-lg">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-amber-800 tracking-wide uppercase">
                            Proof of Concept
                        </span>
                    </div>
                </div>

                <AccountSwitcher />
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 pt-4 space-y-1 overflow-y-auto">
                <div className="px-2 pb-2 text-[10px] uppercase tracking-wider font-bold text-gray-400">
                    Menu
                </div>
                <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/" />
                <SidebarItem icon={Wallet2} label="Transactions" href="/transactions" />
                <SidebarItem icon={PieChart} label="VAT Tracker" href="/vat" />
                <SidebarItem icon={Settings} label="Settings" href="/settings" />
            </nav>

            {/* Footer */}
        </aside>
    );
}
