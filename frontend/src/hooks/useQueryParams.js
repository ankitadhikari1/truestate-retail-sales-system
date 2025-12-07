import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Custom hook to manage URL query parameters
 */
export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = useCallback((key, defaultValue = null) => {
    const value = searchParams.get(key);
    if (value === null) return defaultValue;
    return value;
  }, [searchParams]);

  const getArrayParam = useCallback((key, defaultValue = []) => {
    const value = searchParams.get(key);
    if (!value) return defaultValue;
    return value.split(',').map(v => v.trim()).filter(v => v);
  }, [searchParams]);

  const getNumberParam = useCallback((key, defaultValue = null) => {
    const value = searchParams.get(key);
    if (value === null || value === '') return defaultValue;
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  }, [searchParams]);

  const setParam = useCallback((key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === undefined || value === '') {
      newParams.delete(key);
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        newParams.delete(key);
      } else {
        newParams.set(key, value.join(','));
      }
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const setMultipleParams = useCallback((params) => {
    // Create a fresh URLSearchParams - start from scratch
    const newParams = new URLSearchParams();
    
    // Define filter keys that should be removed if not in params
    const filterKeys = ['regions', 'genders', 'categories', 'tags', 'paymentMethods', 
                        'minAge', 'maxAge', 'startDate', 'endDate', 'search'];
    
    // Process all params - set or delete based on value
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value === null || value === undefined || value === '') {
        // Don't add empty values
        newParams.delete(key);
      } else if (Array.isArray(value)) {
        if (value.length === 0) {
          // Don't add empty arrays
          newParams.delete(key);
        } else {
          newParams.set(key, value.join(','));
        }
      } else {
        newParams.set(key, value);
      }
    });
    
    // Preserve page, sortBy, sortOrder from current URL if not in params
    // (unless they're being explicitly set)
    if (!params.hasOwnProperty('page') && searchParams.get('page')) {
      newParams.set('page', searchParams.get('page'));
    }
    if (!params.hasOwnProperty('sortBy') && searchParams.get('sortBy')) {
      newParams.set('sortBy', searchParams.get('sortBy'));
    }
    if (!params.hasOwnProperty('sortOrder') && searchParams.get('sortOrder')) {
      newParams.set('sortOrder', searchParams.get('sortOrder'));
    }
    
    // Any filter keys not in params should be removed (they were cleared)
    filterKeys.forEach(filterKey => {
      if (!params.hasOwnProperty(filterKey) && searchParams.has(filterKey)) {
        console.log(`Removing cleared filter: ${filterKey}`);
        newParams.delete(filterKey);
      }
    });
    
    console.log('setMultipleParams - Final URL params:', newParams.toString());
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const getAllParams = useCallback(() => {
    const params = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  return {
    getParam,
    getArrayParam,
    getNumberParam,
    setParam,
    setMultipleParams,
    getAllParams,
    searchParams
  };
}


