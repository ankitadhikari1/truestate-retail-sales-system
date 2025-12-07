import express from 'express';
import cors from 'cors';
import { loadSalesData } from './utils/csvParser.js';
import salesRoutes from './routes/salesRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

let salesData = [];

async function initializeData() {
  try {
    salesData = await loadSalesData();
    app.locals.salesData = salesData;
    console.log(` Sales data loaded: ${salesData.length} records`);
  } catch (error) {
    console.error('Error loading sales data:', error);
    app.locals.salesData = [];
  }
}

app.use('/api/sales', salesRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    recordsLoaded: app.locals.salesData?.length || 0 
  });
});
async function startServer() {
  await initializeData();
  
  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api/sales`);
  });
}

startServer().catch(console.error);


