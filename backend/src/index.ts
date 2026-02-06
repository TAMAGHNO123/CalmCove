import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import appointmentsRouter from './routes/appointments';
import tipsRouter from './routes/tips';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/appointments', appointmentsRouter);
app.use('/api/tips', tipsRouter);

app.get('/', (req, res) => {
  res.send('CalmCove Backend Running');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

