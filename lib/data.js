/**
 * NaijaTax Data Processing Library
 * 
 * Centralized data access and processing layer.
 * All data operations should go through this module.
 * 
 * Usage:
 *   import { getDashboardData, getVATData, formatCurrency } from '@/lib/data';
 * 
 * When implementing the real data pipeline (Mono -> Groq -> data processing),
 * you only need to modify the data source in lib/data/index.js while keeping
 * the same API surface.
 */

export * from './data/index';
