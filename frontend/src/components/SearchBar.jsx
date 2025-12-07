import { useState, useEffect, useRef, useMemo } from 'react';
import { debounce } from '../utils/debounce';

export function SearchBar({ value, onChange, placeholder = "Search by customer name or phone..." }) {
  const [localValue, setLocalValue] = useState(value || '');
  
  // Create stable debounced function
  const debouncedOnChange = useMemo(
    () => debounce((val) => onChange(val), 300),
    [onChange]
  );

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  return (
    <div className="w-full relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
      />
    </div>
  );
}


