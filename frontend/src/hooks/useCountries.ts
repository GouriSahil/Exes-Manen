import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';

export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
}

// REST Countries API Response Types (simplified)
interface RestCountryResponse {
  name: {
    common: string;
  };
  currencies?: Record<string, { name: string; symbol: string }>;
  cca2?: string;
}

// Flag emoji generation from country code
const getFlagEmoji = (countryCode: string): string => {
  if (!countryCode || countryCode.length !== 2) return "🏳️";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Transform REST Countries API response to our Country interface
const transformCountry = (country: RestCountryResponse): Country => {
  const currencyCode = country.currencies
    ? Object.keys(country.currencies)[0]
    : "USD";
  const currencyInfo = country.currencies?.[currencyCode];

  return {
    code: country.cca2 || "",
    name: country.name?.common || "Unknown",
    flag: getFlagEmoji(country.cca2 || ""),
    currency: currencyCode,
    currencySymbol: currencyInfo?.symbol || "$",
  };
};

// Fetch countries from REST Countries API
const fetchCountries = async (): Promise<Country[]> => {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,currencies,cca2"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: RestCountryResponse[] = await response.json();

    console.log("Fetched countries:", data.length);

    // Transform and sort countries alphabetically by name
    const countries = data
      .map(transformCountry)
      .filter((country) => country.code && country.name) // Filter out invalid entries
      .sort((a, b) => a.name.localeCompare(b.name));

    return countries;
  } catch (error) {
    console.error("Error fetching countries:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
};

// Fetch a single country by code
const fetchCountryByCode = async (code: string): Promise<Country | null> => {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/alpha/${code}?fields=name,currencies,cca2`
    );

    if (!response.ok) {
      return null;
    }

    const data: RestCountryResponse[] = await response.json();
    return data.length > 0 ? transformCountry(data[0]) : null;
  } catch (error) {
    console.error("Error fetching country:", error);
    return null;
  }
};

// Search countries by name
const searchCountries = async (query: string): Promise<Country[]> => {
  try {
    if (!query.trim()) {
      return fetchCountries();
    }

    const response = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(
        query
      )}?fields=name,currencies,cca2`
    );

    if (!response.ok) {
      return [];
    }

    const data: RestCountryResponse[] = await response.json();
    return data
      .map(transformCountry)
      .filter((country) => country.code && country.name)
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error searching countries:", error);
    return [];
  }
};

// Custom hooks
export const useCountries = () => {
  return useQuery({
    queryKey: queryKeys.countries.lists(),
    queryFn: fetchCountries,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

export const useCountry = (code: string) => {
  return useQuery({
    queryKey: queryKeys.countries.detail(code),
    queryFn: () => fetchCountryByCode(code),
    enabled: !!code,
  });
};

export const useSearchCountries = (query: string) => {
  return useQuery({
    queryKey: [...queryKeys.countries.lists(), { search: query }],
    queryFn: () => searchCountries(query),
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Utility functions
export const getCountryByCode = async (
  code: string
): Promise<Country | null> => {
  return fetchCountryByCode(code);
};

export const getCountriesByRegion = async (
  region: string
): Promise<Country[]> => {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/region/${encodeURIComponent(
        region
      )}?fields=name,currencies,cca2`
    );

    if (!response.ok) {
      return [];
    }

    const data: RestCountryResponse[] = await response.json();
    return data
      .map(transformCountry)
      .filter((country) => country.code && country.name)
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error fetching countries by region:", error);
    return [];
  }
};

export const getCountriesByCurrency = async (
  currency: string
): Promise<Country[]> => {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/currency/${encodeURIComponent(
        currency
      )}?fields=name,currencies,cca2`
    );

    if (!response.ok) {
      return [];
    }

    const data: RestCountryResponse[] = await response.json();
    return data
      .map(transformCountry)
      .filter((country) => country.code && country.name)
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error fetching countries by currency:", error);
    return [];
  }
};
