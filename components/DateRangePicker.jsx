'use client';

import { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown, Check, X } from 'lucide-react';

export default function DateRangePicker({ onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState('this_month');
    const [customRange, setCustomRange] = useState({ start: '', end: '' });
    const containerRef = useRef(null);

    const presets = [
        { id: 'this_month', label: 'This Month' },
        { id: 'last_30_days', label: 'Last 30 Days' },
        { id: 'this_quarter', label: 'Last 90 Days' },
        { id: 'ytd', label: 'This Year' },
        { id: 'custom', label: 'Custom Range' },
    ];

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handlePresetSelect = (presetId) => {
        setSelectedPreset(presetId);
        if (presetId !== 'custom') {
            setIsOpen(false);
            if (onChange) onChange({ type: 'preset', value: presetId });
        }
    };

    const handleCustomApply = () => {
        if (customRange.start && customRange.end) {
            setIsOpen(false);
            if (onChange) onChange({ type: 'custom', value: customRange });
        }
    };

    const getLabel = () => {
        if (selectedPreset === 'custom') {
            if (customRange.start && customRange.end) {
                return `${customRange.start} - ${customRange.end}`;
            }
            return 'Custom Range';
        }
        return presets.find(p => p.id === selectedPreset)?.label || 'Select Period';
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-background border transition-all group border-2 border-border`}
            >
                <div className="p-1 rounded-md bg-muted text-muted-foreground group-hover:text-foreground transition-colors">
                    <Calendar size={14} strokeWidth={2.5} />
                </div>
                <span className="text-[12px] font-bold text-foreground min-w-[90px] text-left">
                    {getLabel()}
                </span>
                <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-card rounded-2xl border border-border z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 space-y-0.5">
                        <div className="text-[10px] uppercase font-black text-muted-foreground px-3 py-2 tracking-widest">
                            Select Period
                        </div>
                        {presets.map((preset) => (
                            <button
                                key={preset.id}
                                onClick={() => handlePresetSelect(preset.id)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[11px] font-medium transition-colors ${selectedPreset === preset.id
                                    ? 'bg-primary/10 text-primary'
                                    : 'hover:bg-muted text-foreground'
                                    }`}
                            >
                                {preset.label}
                                {selectedPreset === preset.id && <Check size={14} strokeWidth={3} />}
                            </button>
                        ))}
                    </div>

                    {selectedPreset === 'custom' && (
                        <div className="p-3 border-t border-border bg-muted/20">
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <div>
                                    <label className="text-[11px] font-bold text-muted-foreground uppercase mb-1 block">Start</label>
                                    <input
                                        type="date"
                                        className="w-full px-2 py-2 rounded-lg border border-border bg-background text-xs font-medium focus:outline-none focus:border-primary"
                                        value={customRange.start}
                                        onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-muted-foreground uppercase mb-1 block">End</label>
                                    <input
                                        type="date"
                                        className="w-full px-2 py-2 rounded-lg border border-border bg-background text-xs font-medium focus:outline-none focus:border-primary"
                                        value={customRange.end}
                                        onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleCustomApply}
                                disabled={!customRange.start || !customRange.end}
                                className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold disabled:opacity-50 hover:bg-primary/90 transition-colors"
                            >
                                Apply Custom Range
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
