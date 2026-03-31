import express from 'express';
import cors from 'cors';

import veteransRoutes from './routes/veterans.routes';
import serviceRequestsRoutes from './routes/serviceRequests.routes';

const app = express();

//  CORS (allow Vite frontend)

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4200'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: false,
}));

app.use(express.json());

// Routes
app.use('/api/veterans', veteransRoutes);
app.use('/api/service-requests', serviceRequestsRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ message: 'VetServe API is running' });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 VetServe API running on http://localhost:${PORT}`);
});
