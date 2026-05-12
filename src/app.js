import express from 'express';
import cors from 'cors';
import healthCheckRouter from './routes/health.route.js';
import errorHandler from './middlewares/error.middleware.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
const app = express();

//** MIDDLEWARES */

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(cookieParser());
//** ROUTES */

app.use('/api/v1/healthcheck', healthCheckRouter);
app.use('/api/v1/auth', authRouter);
app.use(errorHandler);
export default app;
