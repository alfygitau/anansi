import { useCallback } from 'react';

export function useFormatAmount() {
  const formatAmount = useCallback((amount) => {
    if (amount == null || isNaN(amount)) return 'Ksh 0.00';

    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
    }).format(amount);
  }, []);

  return formatAmount;
}
