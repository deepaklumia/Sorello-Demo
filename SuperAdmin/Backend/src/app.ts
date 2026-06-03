import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { swaggerDocument } from './utils/swagger';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Router Registry
app.use('/api', routes);

// Welcome Info Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SaaS POS Platform Super Admin API',
    docs: '/api-docs',
  });
});

// Error handling middleware
app.use(errorHandler);

export default app;
