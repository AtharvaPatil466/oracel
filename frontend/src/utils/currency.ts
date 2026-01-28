/**
 * Utility for strict INR formatting.
 * Enforces the "No USD" rule for the India Edition.
 */

export const formatINR = (amount: number): string => {
    if (amount >= 10000000) { // 1 Crore = 10,000,000
        return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) { // 1 Lakh = 100,000
        return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};

export const formatCrores = (crores: number): string => {
    return `₹${crores.toFixed(1)} Cr`;
};
