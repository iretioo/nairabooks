'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Info, Loader2 } from 'lucide-react';
import { askTaxAI } from '@/lib/aiSimulator';

export default function AIAssistant({ isOpen, onClose, context }) {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSendMessage = async (text = query) => {
        if (!text.trim() || isLoading) return;

        // 1. Add User Message
        const userMsg = { role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        setQuery('');
        setIsLoading(true);

        try {
            // 2. Simulate AI Response
            const response = await askTaxAI(text, context);

            // 3. Add AI Message
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm having trouble connecting right now. Please try again."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const suggestions = [
        { value: "How much did I spend on uber last month?" },
        { value: "Show me my VAT breakdown by category" },
        { value: "Calculate my expected tax liability" }
    ];

    return (
        <aside className="fixed inset-y-0 right-0 w-full lg:w-[400px] bg-card/95 backdrop-blur-xl border-l border-border h-screen z-50 animate-in slide-in-from-right flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h2 className="text-xs font-bold flex items-center gap-2">
                            AI Assistant
                        </h2>
                        <p className="text-[10px] text-muted-foreground font-medium">Nigeria</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                        <div className="w-20 h-20 mb-6 rounded-3xl bg-muted border border-border flex items-center justify-center relative">
                            <Bot size={40} className="text-primary" strokeWidth={1.5} />
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-accent-foreground shadow-lg">
                                <Sparkles size={12} fill="currentColor" />
                            </div>
                        </div>
                        <h3 className="font-bold text-[12px] mb-8 text-foreground">How can I help you today?</h3>

                        <div className="w-full max-w-sm space-y-2">
                            {suggestions.map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSendMessage(item.value)}
                                    className="w-full text-left p-3.5 bg-card border border-border hover:border-primary/30 hover:bg-muted transition-all rounded-xl flex items-center gap-4 group"
                                >
                                    <div>
                                        <span className="font-semibold text-[12px] text-muted-foreground">{item.value}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1
                                    ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted border border-border text-primary'}
                                `}>
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div className={`
                                    p-4 rounded-2xl max-w-[85%] text-[12px] leading-relaxed
                                    ${msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground ml-auto rounded-tr-none'
                                        : 'bg-muted border border-border text-foreground rounded-tl-none mr-auto'
                                    }
                                `}>
                                    {/* Handle rudimentary markdown for bolding */}
                                    {msg.content.split('\n').map((line, idx) => (
                                        <p key={idx} className={idx > 0 ? 'mt-2' : ''}>
                                            {line.split('**').map((part, pIdx) =>
                                                pIdx % 2 === 1 ? <strong key={pIdx}>{part}</strong> : part
                                            )}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-muted border border-border text-primary flex items-center justify-center flex-shrink-0 mt-1">
                                    <Bot size={16} />
                                </div>
                                <div className="bg-muted border border-border p-4 rounded-2xl rounded-tl-none mr-auto flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-card/80 backdrop-blur-md sticky bottom-0 z-10">
                <div className="relative flex shadow-sm rounded-xl bg-muted border border-border focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all overflow-hidden">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything about your finance"
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-[12px] placeholder:text-muted-foreground"
                    />
                    <button
                        onClick={() => handleSendMessage()}
                        className="px-4 text-primary hover:text-primary/80 transition-colors"
                        disabled={!query.trim() || isLoading}
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    </button>
                </div>
                <div className="text-[10px] text-muted-foreground text-center mt-3 flex items-center justify-center gap-1.5">
                    <Info size={10} />
                    <span>Verify important info with an accountant.</span>
                </div>
            </div>
        </aside>
    );
}
