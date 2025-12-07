
## 🔗 Live Demo  
[Click here to view the live app](https://truestate-retail-sales-system.vercel.app/)

# Retail Sales Management System

A full-stack application for managing and analyzing retail sales data with advanced search, filtering, sorting, and pagination capabilities.

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

>  **For detailed setup instructions and troubleshooting, see [SETUP.md](./SETUP.md)**

### Setup

1. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   
   Place your `sales.csv` file in `backend/src/data/sales.csv`

   Start the backend server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:3001`

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```
   
   Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

## Project Structure

```
truEstate/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── utils/       # CSV parser and utilities
│   │   ├── routes/      # API routes
│   │   ├── models/      # Data models
│   │   ├── data/        # CSV data file (sales.csv)
│   │   └── index.js     # Server entry point
│   ├── package.json
│   └── README.md
├── frontend/            # React + Vite application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── routes/     # Page components
│   │   ├── services/   # API client
│   │   ├── hooks/      # Custom hooks
│   │   ├── styles/     # CSS/Tailwind
│   │   ├── App.jsx     # Main app
│   │   └── main.jsx    # Entry point
│   ├── package.json
│   └── README.md
├── docs/                # Documentation
│   └── architecture.md
└── README.md           # This file
```

## Features

### Search
- Full-text search on customer name and phone number
- Case-insensitive matching
- Real-time search with debouncing

### Filters
- **Multi-select filters:**
  - Customer Region
  - Gender
  - Product Category
  - Tags
  - Payment Method
- **Range filters:**
  - Age Range (min/max)
  - Date Range (start/end)

### Sorting
- Sort by Date (Newest/Oldest First)
- Sort by Quantity (High to Low / Low to High)
- Sort by Customer Name (A-Z / Z-A)

### Pagination
- 10 items per page
- Previous/Next navigation
- Page indicator (Page X of Y)
- Respects all active filters and search

### State Management
- All state preserved in URL query parameters
- Shareable URLs with filters applied
- Browser back/forward navigation support

##  Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **csv-parser** - CSV parsing library
- **cors** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

## API Endpoints

### GET `/api/sales`
Get sales data with filtering, sorting, and pagination.

**Query Parameters:**
- `search` - Search term (customer name or phone)
- `regions` - Comma-separated regions
- `genders` - Comma-separated genders
- `categories` - Comma-separated categories
- `tags` - Comma-separated tags
- `paymentMethods` - Comma-separated payment methods
- `minAge`, `maxAge` - Age range
- `startDate`, `endDate` - Date range (ISO format)
- `sortBy` - Sort field: `date`, `quantity`, `customerName`
- `sortOrder` - Sort order: `asc` or `desc`
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 10)

### GET `/api/sales/filter-options`
Get unique values for all filter options.

## Dataset Format

The CSV file should contain the following fields:

**Customer Fields:**
- Customer ID
- Customer Name
- Phone Number
- Gender
- Age
- Customer Region
- Customer Type

**Product Fields:**
- Product ID
- Product Name
- Brand
- Product Category
- Tags (comma-separated)

**Sales Fields:**
- Quantity
- Price per Unit
- Discount Percentage
- Total Amount
- Final Amount

**Operational Fields:**
- Date
- Payment Method
- Order Status
- Delivery Type
- Store ID
- Store Location
- Salesperson ID
- Employee Name

## Development

### Backend Development
```bash
cd backend
npm run dev  # Auto-reload on file changes
```

### Frontend Development
```bash
cd frontend
npm run dev  # Vite dev server with HMR
```

### Building for Production

**Backend:**
No build step required - just run `npm start`

**Frontend:**
```bash
cd frontend
npm run build
```
Output will be in `frontend/dist/`

## Documentation

See `docs/architecture.md` for detailed architecture documentation.

## Troubleshooting

1. **Backend not loading CSV:**
   - Ensure `sales.csv` is in `backend/src/data/`
   - Check CSV file format matches expected fields
   - Check server logs for parsing errors

2. **Frontend can't connect to backend:**
   - Ensure backend is running on port 3001
   - Check CORS settings in backend
   - Verify proxy configuration in `vite.config.js`

3. **Filters not working:**
   - Check browser console for errors
   - Verify API responses in Network tab
   - Ensure filter options are loaded correctly

## 📄 License

This project is created for the TruEstate SDE Intern assignment.


# truestate-retail-sales-system
