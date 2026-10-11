import express from 'express';
import authRoutes from './routes/auth.route.js';
import userroutes from './routes/user.route.js';
import bottleRoute from './routes/bottle.route.js';
import esewaRoute from './routes/esewa.route.js';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  process.env.CORS_ORIGIN,
].filter(Boolean).map((origin) => {
  const trimmedOrigin = origin.trim();
  try {
    return new URL(trimmedOrigin).origin;
  } catch {
    return trimmedOrigin;
  }
});

const isPrintifyVercelOrigin = (origin) => {
  try {
    const url = new URL(origin);
    return url.protocol === 'https:' &&
      /^printify3d(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(url.hostname);
  } catch {
    return false;
  }
};

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || isPrintifyVercelOrigin(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true
}))

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/user', userroutes);
app.use('/api/bottles', bottleRoute);
app.use('/api/payment', esewaRoute);


// test route
app.get("/", (req, res) => {
  res.send("API is running");
});

export default app;
