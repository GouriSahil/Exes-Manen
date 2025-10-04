'use client';

import { useCountries, getCountryByCode } from '@/hooks/useCountries';
import { useState } from 'react';

export function CountryCurrencyDemo() {
  const { data: countries, isLoading, error } = useCountries();
  const [selectedCountry, setSelectedCountry] = useState('');

  if (isLoading) {
    return (
      <div className='p-6 bg-white rounded-lg shadow-md'>
        <div className='animate-pulse'>
          <div className='h-4 bg-gray-200 rounded w-1/4 mb-4'></div>
          <div className='h-10 bg-gray-200 rounded mb-4'></div>
          <div className='h-4 bg-gray-200 rounded w-1/2'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-6 bg-red-50 border border-red-200 rounded-lg'>
        <p className='text-red-600'>Error: {error.message}</p>
      </div>
    );
  }

  const country = selectedCountry ? getCountryByCode(selectedCountry) : null;

  return (
    <div className='p-6 bg-white rounded-lg shadow-md space-y-4'>
      <h3 className='text-lg font-semibold text-gray-900'>
        Country-Currency Demo
      </h3>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Select a Country
        </label>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        >
          <option value=''>Choose a country...</option>
          {countries?.slice(0, 20).map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCountry && country && (
        <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
          <h4 className='font-medium text-blue-900 mb-2'>
            Currency Information
          </h4>
          <div className='space-y-1 text-sm text-blue-800'>
            <p>
              <strong>Country:</strong> {country.name}
            </p>
            <p>
              <strong>Currency:</strong> {country.currency}
            </p>
            <p>
              <strong>Code:</strong> {country.currency}
            </p>
            <p>
              <strong>Symbol:</strong> {country.currencySymbol}
            </p>
          </div>
        </div>
      )}

      <div className='text-xs text-gray-500'>
        <p>Total countries loaded: {countries?.length || 0}</p>
        <p>Data source: Mock data with React Query caching</p>
      </div>
    </div>
  );
}
