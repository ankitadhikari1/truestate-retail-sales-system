# Frontend - Retail Sales Management System

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/     # React components (SearchBar, FilterPanel, etc.)
│   ├── routes/         # Page components
│   ├── services/       # API client functions
│   ├── hooks/          # Custom React hooks (useQueryParams)
│   ├── styles/         # CSS/Tailwind styles
│   ├── App.jsx         # Main app component with routing
│   └── main.jsx        # Entry point
├── public/             # Static assets
├── package.json
└── README.md
```

## Features

- **Search**: Full-text search on customer name and phone number
- **Filters**: Multi-select and range filters for all specified fields
- **Sorting**: Sort by date, quantity, or customer name
- **Pagination**: 10 items per page with Previous/Next controls
- **State Management**: All state preserved in URL query parameters

## Tech Stack

- React 18
- Vite
- React Router
- Tailwind CSS


