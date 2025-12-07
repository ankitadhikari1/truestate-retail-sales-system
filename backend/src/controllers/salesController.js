import { processSalesQuery, filterSales } from '../services/salesService.js';

export function getSales(req, res) {
  try {
    const salesData = req.app.locals.salesData;
    
    if (!salesData || salesData.length === 0) {
      return res.json({
        data: [],
        pagination: {
          page: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false
        },
        appliedFilters: {}
      });
    }

    const result = processSalesQuery(salesData, req.query);
    res.json(result);
  } catch (error) {
    console.error('Error processing sales query:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

export function getFilterOptions(req, res) {
  try {
    let salesData = req.app.locals.salesData || [];
    
    if (Object.keys(req.query).length > 0) {
      salesData = filterSales(salesData, req.query);
    }
    
    const regions = [...new Set(salesData.map(r => r.customerRegion).filter(Boolean))].sort();
    const genders = [...new Set(salesData.map(r => r.gender).filter(Boolean))].sort();
    const categories = [...new Set(salesData.map(r => r.productCategory).filter(Boolean))].sort();
    const paymentMethods = [...new Set(salesData.map(r => r.paymentMethod).filter(Boolean))].sort();
    
    // Collect all tags
    const allTags = new Set();
    salesData.forEach(record => {
      const tags = Array.isArray(record.tags) 
        ? record.tags 
        : (record.tags || '').split(',').map(t => t.trim()).filter(t => t);
      tags.forEach(tag => allTags.add(tag));
    });
    const tags = [...allTags].sort();
    
    // Get age range
    const ages = salesData.map(r => Number(r.age)).filter(age => !isNaN(age));
    const minAge = ages.length > 0 ? Math.min(...ages) : 0;
    const maxAge = ages.length > 0 ? Math.max(...ages) : 100;
    
    // Get date range
    const dates = salesData.map(r => r.date ? new Date(r.date) : null).filter(d => d && !isNaN(d.getTime()));
    const startDate = dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))).toISOString().split('T')[0] : null;
    const endDate = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))).toISOString().split('T')[0] : null;

    res.json({
      regions,
      genders,
      categories,
      tags,
      paymentMethods,
      ageRange: { min: minAge, max: maxAge },
      dateRange: { start: startDate, end: endDate }
    });
  } catch (error) {
    console.error('Error getting filter options:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}


