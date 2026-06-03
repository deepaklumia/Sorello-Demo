import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { swaggerDocument } from './utils/swagger';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Router registry mounted at /api
app.use('/api', routes);

// Base info endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SaaS POS Platform Restaurant Admin API',
    docs: '/api-docs',
  });
});

// Global error handler
app.use(errorHandler);

export default app;
