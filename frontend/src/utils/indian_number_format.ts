/**
 * Utility for Indian Number System formatting (Lakhs/Crores).
 * Example: 1,00,000 instead of 100,000.
 */

export const formatIndianNumber = (num: number): string => {
    return new Intl.NumberFormat('en-IN').format(num);
};

export const parseIndianDate = (dateStr: string): string => {
    // Expects YYYY-MM-DD, returns DD MMM (e.g., "01 Jun")
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}
