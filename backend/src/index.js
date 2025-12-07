import express from 'express';
import cors from 'cors';
import { loadSalesData } from './utils/csvParser.js';
import salesRoutes from './routes/salesRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load sales data at startup
let salesData = [];

async function initializeData() {
  try {
    salesData = await loadSalesData();
    app.locals.salesData = salesData;
    console.log(`✅ Sales data loaded: ${salesData.length} records`);
  } catch (error) {
    console.error('❌ Error loading sales data:', error);
    app.locals.salesData = [];
  }
}

// Routes
app.use('/api/sales', salesRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    recordsLoaded: app.locals.salesData?.length || 0 
  });
});

// Start server
async function startServer() {
  await initializeData();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoint: http://localhost:${PORT}/api/sales`);
  });
}

startServer().catch(console.error);


