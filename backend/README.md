# Backend - Retail Sales Management System

## Setup

1. Install dependencies:
```bash
npm install
```

2. Place your `sales.csv` file in `src/data/sales.csv`

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### GET `/api/sales`

Get sales data with filtering, sorting, and pagination.

**Query Parameters:**
- `search` (string) - Search in customerName or phoneNumber
- `regions` (comma-separated) - Filter by customer regions
- `genders` (comma-separated) - Filter by gender
- `categories` (comma-separated) - Filter by product categories
- `tags` (comma-separated) - Filter by tags
- `paymentMethods` (comma-separated) - Filter by payment methods
- `minAge` (number) - Minimum age filter
- `maxAge` (number) - Maximum age filter
- `startDate` (ISO date string) - Start date filter
- `endDate` (ISO date string) - End date filter
- `sortBy` (string) - Sort field: `date`, `quantity`, or `customerName`
- `sortOrder` (string) - Sort order: `asc` or `desc` (default: `desc` for date)
- `page` (number) - Page number (default: 1)
- `pageSize` (number) - Items per page (default: 10)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 123,
    "totalPages": 13,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "appliedFilters": {...}
}
```

### GET `/api/sales/filter-options`

Get unique values for all filter options (for populating filter dropdowns).

**Response:**
```json
{
  "regions": [...],
  "genders": [...],
  "categories": [...],
  "tags": [...],
  "paymentMethods": [...],
  "ageRange": { "min": 18, "max": 65 },
  "dateRange": { "start": "2023-01-01", "end": "2023-12-31" }
}
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic (filtering, sorting, pagination)
│   ├── utils/          # CSV parser and utilities
│   ├── routes/         # API routes
│   ├── models/         # Data models (if needed)
│   ├── data/           # CSV data file
│   └── index.js        # Server entry point
├── package.json
└── README.md
```


