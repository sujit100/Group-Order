/**
 * Calculate proportional tax and tip for each user based on their order subtotal
 */
export interface UserOrderSummary {
  userEmail: string
  userName: string
  subtotal: number
  taxAmount: number
  tipAmount: number
  totalAmount: number
}

export interface OrderCalculation {
  subtotal: number
  taxRate: number
  taxAmount: number
  tipRate: number
  tipAmount: number
  totalAmount: number
  userSummaries: UserOrderSummary[]
}

/**
 * Calculate order totals and per-user breakdowns
 */
export function calculateOrder(
  userSubtotals: Record<string, { name: string; amount: number }>,
  taxRate: number,
  tipRate: number
): OrderCalculation {
  // Calculate total subtotal
  const subtotal = Object.values(userSubtotals).reduce(
    (sum, user) => sum + user.amount,
    0
  )

  // Calculate total tax and tip
  const taxAmount = subtotal * taxRate
  const tipAmount = subtotal * tipRate
  const totalAmount = subtotal + taxAmount + tipAmount

  // Calculate proportional amounts for each user
  const userSummaries: UserOrderSummary[] = Object.entries(userSubtotals).map(
    ([email, { name, amount }]) => {
      // Calculate user's proportion of total
      const proportion = subtotal > 0 ? amount / subtotal : 0
      
      // Apply proportion to tax and tip
      const userTaxAmount = taxAmount * proportion
      const userTipAmount = tipAmount * proportion
      const userTotalAmount = amount + userTaxAmount + userTipAmount

      return {
        userEmail: email,
        userName: name,
        subtotal: amount,
        taxAmount: Math.round(userTaxAmount * 100) / 100,
        tipAmount: Math.round(userTipAmount * 100) / 100,
        totalAmount: Math.round(userTotalAmount * 100) / 100,
      }
    }
  )

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxRate,
    taxAmount: Math.round(taxAmount * 100) / 100,
    tipRate,
    tipAmount: Math.round(tipAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    userSummaries,
  }
}
