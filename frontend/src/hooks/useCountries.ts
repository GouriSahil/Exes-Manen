import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';

export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  phoneCode: string;
  region: string;
  subregion: string;
  capital: string;
  population: number;
  area: number;
  languages: string[];
  timezones: string[];
}

// Mock data - replace with actual API calls
const mockCountries: Country[] = [
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
    phoneCode: '+1',
    region: 'Americas',
    subregion: 'North America',
    capital: 'Washington, D.C.',
    population: 331002651,
    area: 9833517,
    languages: ['English'],
    timezones: [
      'UTC-12:00',
      'UTC-11:00',
      'UTC-10:00',
      'UTC-09:00',
      'UTC-08:00',
      'UTC-07:00',
      'UTC-06:00',
      'UTC-05:00',
      'UTC-04:00',
    ],
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    currencySymbol: '£',
    phoneCode: '+44',
    region: 'Europe',
    subregion: 'Northern Europe',
    capital: 'London',
    population: 67886011,
    area: 242900,
    languages: ['English'],
    timezones: ['UTC+00:00', 'UTC+01:00'],
  },
  {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    currency: 'EUR',
    currencySymbol: '€',
    phoneCode: '+49',
    region: 'Europe',
    subregion: 'Western Europe',
    capital: 'Berlin',
    population: 83783942,
    area: 357114,
    languages: ['German'],
    timezones: ['UTC+01:00', 'UTC+02:00'],
  },
  {
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    currency: 'EUR',
    currencySymbol: '€',
    phoneCode: '+33',
    region: 'Europe',
    subregion: 'Western Europe',
    capital: 'Paris',
    population: 65273511,
    area: 551695,
    languages: ['French'],
    timezones: ['UTC+01:00', 'UTC+02:00'],
  },
  {
    code: 'JP',
    name: 'Japan',
    flag: '🇯🇵',
    currency: 'JPY',
    currencySymbol: '¥',
    phoneCode: '+81',
    region: 'Asia',
    subregion: 'Eastern Asia',
    capital: 'Tokyo',
    population: 126476461,
    area: 377975,
    languages: ['Japanese'],
    timezones: ['UTC+09:00'],
  },
  {
    code: 'CN',
    name: 'China',
    flag: '🇨🇳',
    currency: 'CNY',
    currencySymbol: '¥',
    phoneCode: '+86',
    region: 'Asia',
    subregion: 'Eastern Asia',
    capital: 'Beijing',
    population: 1439323776,
    area: 9596961,
    languages: ['Chinese'],
    timezones: ['UTC+08:00'],
  },
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    currencySymbol: '₹',
    phoneCode: '+91',
    region: 'Asia',
    subregion: 'Southern Asia',
    capital: 'New Delhi',
    population: 1380004385,
    area: 3287590,
    languages: ['Hindi', 'English'],
    timezones: ['UTC+05:30'],
  },
  {
    code: 'BR',
    name: 'Brazil',
    flag: '🇧🇷',
    currency: 'BRL',
    currencySymbol: 'R$',
    phoneCode: '+55',
    region: 'Americas',
    subregion: 'South America',
    capital: 'Brasília',
    population: 212559417,
    area: 8515767,
    languages: ['Portuguese'],
    timezones: ['UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00'],
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    currencySymbol: 'A$',
    phoneCode: '+61',
    region: 'Oceania',
    subregion: 'Australia and New Zealand',
    capital: 'Canberra',
    population: 25499884,
    area: 7692024,
    languages: ['English'],
    timezones: [
      'UTC+08:00',
      'UTC+09:30',
      'UTC+10:00',
      'UTC+10:30',
      'UTC+11:00',
    ],
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    currencySymbol: 'C$',
    phoneCode: '+1',
    region: 'Americas',
    subregion: 'North America',
    capital: 'Ottawa',
    population: 37742154,
    area: 9984670,
    languages: ['English', 'French'],
    timezones: [
      'UTC-08:00',
      'UTC-07:00',
      'UTC-06:00',
      'UTC-05:00',
      'UTC-04:00',
      'UTC-03:30',
    ],
  },
];

// Mock API functions
const fetchCountries = async (): Promise<Country[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockCountries;
};

const fetchCountryByCode = async (code: string): Promise<Country | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockCountries.find((country) => country.code === code) || null;
};

const searchCountries = async (query: string): Promise<Country[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (!query.trim()) return mockCountries;

  return mockCountries.filter(
    (country) =>
      country.name.toLowerCase().includes(query.toLowerCase()) ||
      country.code.toLowerCase().includes(query.toLowerCase()) ||
      country.currency.toLowerCase().includes(query.toLowerCase())
  );
};

// Custom hooks
export const useCountries = () => {
  return useQuery({
    queryKey: queryKeys.countries.lists(),
    queryFn: fetchCountries,
    staleTime: 10 * 60 * 1000, // 10 minutes
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
export const getCountryByCode = (code: string): Country | undefined => {
  return mockCountries.find((country) => country.code === code);
};

export const getCountriesByRegion = (region: string): Country[] => {
  return mockCountries.filter((country) => country.region === region);
};

export const getCountriesByCurrency = (currency: string): Country[] => {
  return mockCountries.filter((country) => country.currency === currency);
};
