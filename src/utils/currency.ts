export function formatCurrency(amount: number, currency = "PEN") {
  return `${currency} ${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
}
