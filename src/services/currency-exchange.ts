/**
 * Represents exchange rates between two currencies.
 */
export interface ExchangeRate {
  /**
   * The rate of exchange from the base currency to the target currency.
   */
  rate: number;
  /**
   * The base currency code (e.g., USD).
   */
  baseCurrency: string;
  /**
   * The target currency code (e.g., EUR).
   */
  targetCurrency: string;
}

/**
 * Asynchronously retrieves the exchange rate between two currencies.
 *
 * @param baseCurrency The base currency code.
 * @param targetCurrency The target currency code.
 * @returns A promise that resolves to an ExchangeRate object.
 */
export async function getExchangeRate(
  baseCurrency: string,
  targetCurrency: string
): Promise<ExchangeRate> {
  // TODO: Implement this by calling an API.

  return {
    rate: 3.69,
    baseCurrency: baseCurrency,
    targetCurrency: targetCurrency,
  };
}
