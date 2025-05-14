/**
 * Represents country information including country code and flag.
 */
export interface Country {
  /**
   * The country code (e.g., +1 for USA).
   */
  code: string;
  /**
   * The URL of the country flag image.
   */
  flagUrl: string;
  /**
   * The name of the country.
   */
  name: string;
}

/**
 * Asynchronously retrieves the list of supported countries.
 *
 * @returns A promise that resolves to an array of Country objects.
 */
export async function getCountries(): Promise<Country[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      code: '+44',
      flagUrl: 'https://example.com/flags/uk.png',
      name: 'United Kingdom',
    },
    {
      code: '+972',
      flagUrl: 'https://example.com/flags/israel.png',
      name: 'Israel',
    },
  ];
}
