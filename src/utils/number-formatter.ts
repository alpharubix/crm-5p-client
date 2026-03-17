export const formatAmount = (amount?: string | number | null) => {
  if (amount === null || amount === undefined || amount === '' || amount === '—' || amount === '-') return amount;
  const num = Number(amount);
  if (isNaN(num)) return amount.toString();
  return new Intl.NumberFormat('en-IN').format(num);
};
