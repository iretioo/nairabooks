'use client';
import { Lightbulb, TrendingUp, AlertCircle, Sparkles, Receipt, Calculator, Layers, AlertTriangle } from 'lucide-react';

// Icon mapping for dynamic insights
const iconMap = {
    'receipt': Receipt,
    'trending-up': TrendingUp,
    'calculator': Calculator,
    'layers': Layers,
    'alert-triangle': AlertTriangle,
    'lightbulb': Lightbulb,
    'alert': AlertCircle,
};

// Refined theme matching design system
const themeMap = {
    vat: {
        iconColor: "text-amber-600",
        iconBg: "bg-amber-500/10",
        dotColor: "bg-amber-500"
    },
    highlight: {
        iconColor: "text-blue-600",
        iconBg: "bg-blue-500/10",
        dotColor: "bg-blue-500"
    },
    tax: {
        iconColor: "text-emerald-600",
        iconBg: "bg-emerald-500/10",
        dotColor: "bg-emerald-500"
    },
    volume: {
        iconColor: "text-purple-600",
        iconBg: "bg-purple-500/10",
        dotColor: "bg-purple-500"
    },
    warning: {
        iconColor: "text-rose-600",
        iconBg: "bg-rose-500/10",
        dotColor: "bg-rose-500"
    },
    insight: {
        iconColor: "text-amber-600",
        iconBg: "bg-amber-500/10",
        dotColor: "bg-amber-500"
    },
    alert: {
        iconColor: "text-blue-600",
        iconBg: "bg-blue-500/10",
        dotColor: "bg-blue-500"
    },
    compliance: {
        iconColor: "text-rose-600",
        iconBg: "bg-rose-500/10",
        dotColor: "bg-rose-500"
    }
};

/**
 * Transform dynamic insights from the data layer into display format
 */
function transformInsight(insight, index) {
    const theme = themeMap[insight.type] || themeMap.insight;
    const Icon = iconMap[insight.icon] || Lightbulb;

    return {
        id: index + 1,
        type: insight.type,
        title: insight.title,
        message: insight.message,
        icon: Icon,
        ...theme
    };
}

export default function InsightsCarousel({ insights: propInsights }) {
    // Use provided insights or fall back to defaults
    const displayInsights = propInsights && propInsights.length > 0
        ? propInsights.map(transformInsight)
        : [];

    if (displayInsights.length === 0) return null;

    return (
        <div className="py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 px-1">
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                    <Sparkles size={18} className="text-primary animate-pulse" fill="currentColor" />
                </div>
                <h3 className="text-base font-black tracking-tight text-foreground">Smart Insights</h3>
            </div>

            {/* Carousel */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-8 -mx-4 px-4 scrollbar-hide">
                {displayInsights.map((insight) => {
                    const Icon = insight.icon;
                    return (
                        <article
                            key={insight.id}
                            className="group relative snap-center shrink-0 w-[90vw] sm:w-[420px] md:w-[440px]"
                        >
                            {/* Card matching MetricCard design system */}
                            <div className={`h-full flex flex-col p-5 rounded-2xl border-2 ${insight.borderColor} bg-white hover:border-opacity-60 transition-all duration-300 relative overflow-hidden`}>

                                {/* Subtle gradient overlay on hover - matching MetricCard */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${insight.hoverGradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                {/* Content */}
                                <div className="relative z-10">

                                    {/* Header with icon and type */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-11 h-11 rounded-xl ${insight.iconBg} flex items-center justify-center`}>
                                            <Icon size={22} className={insight.iconColor} strokeWidth={2.5} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${insight.dotColor}`} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                {insight.type}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <p className="text-sm leading-relaxed font-medium text-foreground">
                                        {insight.message}
                                    </p>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}
