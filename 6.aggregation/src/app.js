import express from 'express';
import aggregationRoutes from './routes/aggregation.routes.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Aggregation Pipeline Class Backend is running',
    });
});

app.use('/api/aggregation', aggregationRoutes);

app.use((req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;

    res.status(statusCode).json({
        message: error.message || 'Internal Server Error',
    });
});

export default app;
