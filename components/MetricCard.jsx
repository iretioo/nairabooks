'use client';

import { LucideIcon } from 'lucide-react';

export default function MetricCard({
    title,
    value,
    subtitle,
    trend,
    icon,
    variant = 'default',
    children,
}) {
    if (variant === 'primary') {
        return (
            <div className="group h-full flex flex-col p-5 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent hover:border-primary/40 transition-all duration-300 relative overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-white duration-300" />

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{title}</h3>
                        {icon && <div className="text-primary/60">{icon}</div>}
                    </div>
                    <div className="space-y-1 flex-1">
                        <p className="text-lg font-black tracking-tight text-foreground">{value}</p>
                        {subtitle && <p className="text-xs font-medium text-muted-foreground">{subtitle}</p>}
                    </div>
                    {children && <div className="mt-4 pt-4 border-t border-border/50">{children}</div>}
                </div>
            </div>
        );
    }

    if (variant === 'accent') {
        return (
            <div className="group h-full flex flex-col p-5 rounded-2xl border-2 border-accent/20 bg-gradient-to-br from-accent/5 via-transparent to-transparent hover:border-accent/40 transition-all duration-300 relative overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-white duration-300" />

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{title}</h3>
                        {icon && <div className="text-accent/60">{icon}</div>}
                    </div>
                    <div className="space-y-1 flex-1">
                        <p className="text-lg font-black tracking-tight text-foreground">{value}</p>
                        {subtitle && <p className="text-xs font-medium text-muted-foreground">{subtitle}</p>}
                    </div>
                    {children && <div className="mt-4 pt-4 border-t border-border/50">{children}</div>}
                </div>
            </div>
        );
    }

    return (
        <div className="group h-full flex flex-col p-5 rounded-2xl border-2 border-border hover:border-border/60 bg-card transition-all duration-300 relative overflow-hidden">
            {/* Subtle hover effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{title}</h3>
                    {icon && <div className="text-muted-foreground/60">{icon}</div>}
                </div>
                <div className="space-y-1 flex-1">
                    <p className="text-lg font-black tracking-tight text-foreground">{value}</p>
                    {subtitle && <p className="text-[10px] font-medium text-muted-foreground">{subtitle}</p>}
                </div>
                {(trend || children) && (
                    <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between gap-2">
                        {trend && (
                            <div className={`text-[10px] font-bold flex items-center gap-1.5 ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                                <span className="text-base">{trend.isPositive ? '↑' : '↓'}</span>
                                <span>{trend.value}</span>
                                <span className="text-muted-foreground font-medium ml-1">vs last month</span>
                            </div>
                        )}
                        {children && <div>{children}</div>}
                    </div>
                )}
            </div>
        </div>
    );
}
