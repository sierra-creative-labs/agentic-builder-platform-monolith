import { Router } from 'express';
import { modelRoutes } from '../../../contexts/ai-models/infrastructure/api/rest/model.routes';

// This is the main router that aggregates all context routes
const router = Router();

// Mount context routes
router.use('/models', modelRoutes);

// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export { router as apiV1Router };
