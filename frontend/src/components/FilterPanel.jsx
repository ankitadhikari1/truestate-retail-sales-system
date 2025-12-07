import { useState, useEffect, useRef } from 'react';

export function FilterPanel({ filterOptions, filters, onFilterChange }) {
  const [localFilters, setLocalFilters] = useState({
    regions: filters.regions || [],
    genders: filters.genders || [],
    categories: filters.categories || [],
    tags: filters.tags || [],
    paymentMethods: filters.paymentMethods || [],
    minAge: filters.minAge || '',
    maxAge: filters.maxAge || '',
    startDate: filters.startDate || '',
    endDate: filters.endDate || ''
  });
  
  // Track if we're in the middle of a user interaction to prevent overwriting
  const isUserInteracting = useRef(false);
  const lastUserAction = useRef(null);

  useEffect(() => {
    if (isUserInteracting.current) {
      const timeout = setTimeout(() => {
        if (isUserInteracting.current && Date.now() - (lastUserAction.current?.timestamp || 0) > 1000) {
          isUserInteracting.current = false;
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }
    
    const newFilters = {
      regions: Array.isArray(filters.regions) ? filters.regions : [],
      genders: Array.isArray(filters.genders) ? filters.genders : [],
      categories: Array.isArray(filters.categories) ? filters.categories : [],
      tags: Array.isArray(filters.tags) ? filters.tags : [],
      paymentMethods: Array.isArray(filters.paymentMethods) ? filters.paymentMethods : [],
      minAge: filters.minAge || '',
      maxAge: filters.maxAge || '',
      startDate: filters.startDate || '',
      endDate: filters.endDate || ''
    };
    
    setLocalFilters(prev => {
      const currentStr = JSON.stringify(prev);
      const newStr = JSON.stringify(newFilters);
      
      if (currentStr !== newStr) {
        return newFilters;
      }
      return prev;
    });
  }, [filters]);

  const handleMultiSelectChange = (key, value) => {
    isUserInteracting.current = true;
    lastUserAction.current = { key, value, timestamp: Date.now() };
    
    setLocalFilters(prev => {
      const current = Array.isArray(prev[key]) ? prev[key] : [];
      
      const isCurrentlySelected = current.some(v => 
        String(v).trim().toLowerCase() === String(value).trim().toLowerCase()
      );
      
      const newValue = isCurrentlySelected
        ? current.filter(v => String(v).trim().toLowerCase() !== String(value).trim().toLowerCase())
        : [...current, value];
      
      const updated = { ...prev, [key]: newValue };
      
      requestAnimationFrame(() => {
        onFilterChange(key, newValue);
        setTimeout(() => {
          isUserInteracting.current = false;
        }, 300);
      });
      
      return updated;
    });
  };

  const handleRangeChange = (key, value) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onFilterChange(key, value);
  };

  const clearFilter = (key) => {
    const defaultValue = ['regions', 'genders', 'categories', 'tags', 'paymentMethods'].includes(key) ? [] : '';
    const updated = { ...localFilters, [key]: defaultValue };
    setLocalFilters(updated);
    onFilterChange(key, defaultValue);
  };

  const MultiSelectFilter = ({ label, filterKey, options, selected }) => {
    const actualSelected = Array.isArray(localFilters[filterKey]) ? localFilters[filterKey] : [];

    return (
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-800">{label}</label>
          {actualSelected && actualSelected.length > 0 && (
            <button
              onClick={() => clearFilter(filterKey)}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Clear ({actualSelected.length})
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {options && options.length > 0 ? (
            options.map(option => {
              const currentSelected = Array.isArray(localFilters[filterKey]) ? localFilters[filterKey] : [];
              
              const isSelected = currentSelected.some(v => 
                String(v).trim().toLowerCase() === String(option).trim().toLowerCase()
              );
              
              return (
                <button
                  key={option}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleMultiSelectChange(filterKey, option);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all duration-300 transform ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-700 shadow-xl scale-105 ring-4 ring-blue-300/50'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-lg hover:text-blue-700 hover:scale-105'
                  }`}
                >
                  {option}
                  {isSelected && (
                    <span className="ml-1.5">✓</span>
                  )}
                </button>
              );
            })
          ) : (
            <p className="text-xs text-gray-400 italic">No options available</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border-2 border-gray-200 shadow-xl sticky top-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Filters</h3>
      </div>
      
      <div className="space-y-4">
        <MultiSelectFilter
          label="Customer Region"
          filterKey="regions"
          options={filterOptions?.regions || []}
          selected={Array.isArray(localFilters.regions) ? localFilters.regions : []}
        />

        <MultiSelectFilter
          label="Gender"
          filterKey="genders"
          options={filterOptions?.genders || []}
          selected={Array.isArray(localFilters.genders) ? localFilters.genders : []}
        />

        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-800">Age Range</label>
            {(localFilters.minAge || localFilters.maxAge) && (
              <button
                onClick={() => {
                  clearFilter('minAge');
                  clearFilter('maxAge');
                }}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={localFilters.minAge}
              onChange={(e) => handleRangeChange('minAge', e.target.value)}
              className="w-24 px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 font-medium"
            />
            <span className="self-center text-gray-500 font-bold text-lg">-</span>
            <input
              type="number"
              placeholder="Max"
              value={localFilters.maxAge}
              onChange={(e) => handleRangeChange('maxAge', e.target.value)}
              className="w-24 px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 font-medium"
            />
          </div>
        </div>

        <MultiSelectFilter
          label="Product Category"
          filterKey="categories"
          options={filterOptions?.categories || []}
          selected={Array.isArray(localFilters.categories) ? localFilters.categories : []}
        />

        <MultiSelectFilter
          label="Tags"
          filterKey="tags"
          options={filterOptions?.tags || []}
          selected={Array.isArray(localFilters.tags) ? localFilters.tags : []}
        />

        <MultiSelectFilter
          label="Payment Method"
          filterKey="paymentMethods"
          options={filterOptions?.paymentMethods || []}
          selected={Array.isArray(localFilters.paymentMethods) ? localFilters.paymentMethods : []}
        />

        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-800">Date Range</label>
            {(localFilters.startDate || localFilters.endDate) && (
              <button
                onClick={() => {
                  clearFilter('startDate');
                  clearFilter('endDate');
                }}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="date"
              value={localFilters.startDate}
              onChange={(e) => handleRangeChange('startDate', e.target.value)}
              className="flex-1 px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium"
            />
            <span className="text-gray-500 font-bold text-sm">→</span>
            <input
              type="date"
              value={localFilters.endDate}
              onChange={(e) => handleRangeChange('endDate', e.target.value)}
              className="flex-1 px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


