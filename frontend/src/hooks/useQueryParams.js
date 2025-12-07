import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

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
    const newParams = new URLSearchParams();
    
    const filterKeys = ['regions', 'genders', 'categories', 'tags', 'paymentMethods', 
                        'minAge', 'maxAge', 'startDate', 'endDate', 'search'];
    
    Object.keys(params).forEach(key => {
      const value = params[key];
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
    });
    
    if (!params.hasOwnProperty('page') && searchParams.get('page')) {
      newParams.set('page', searchParams.get('page'));
    }
    if (!params.hasOwnProperty('sortBy') && searchParams.get('sortBy')) {
      newParams.set('sortBy', searchParams.get('sortBy'));
    }
    if (!params.hasOwnProperty('sortOrder') && searchParams.get('sortOrder')) {
      newParams.set('sortOrder', searchParams.get('sortOrder'));
    }
    
    filterKeys.forEach(filterKey => {
      if (!params.hasOwnProperty(filterKey) && searchParams.has(filterKey)) {
        newParams.delete(filterKey);
      }
    });
    
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


