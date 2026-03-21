import { useCallback } from 'react';

export function useFormatAmount() {
  const formatAmount = useCallback((amount) => {
    if (amount == null || isNaN(amount)) return 'KES 0.00';

    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      currencyDisplay: 'code',
      minimumFractionDigits: 2,
    }).format(amount);
  }, []);

  return formatAmount;
}
