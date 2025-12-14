import { Router } from 'express';
import { InMemoryModelRepository } from '../../persistence/InMemoryModelRepository';
import { CreateModelUseCase } from '../../../application/use-cases/CreateModelUseCase';
import { GetModelUseCase } from '../../../application/use-cases/GetModelUseCase';
import { ListModelsUseCase } from '../../../application/use-cases/ListModelsUseCase';
import { UpdateModelUseCase } from '../../../application/use-cases/UpdateModelUseCase';
import { DeleteModelUseCase } from '../../../application/use-cases/DeleteModelUseCase';
import { ModelController } from './ModelController';

const router = Router();

// Wiring up dependencies (In-Memory Repository for now)
// Note: In a real/larger application, use a DI Container or a centralized Composition Root
const repository = new InMemoryModelRepository();

const createUseCase = new CreateModelUseCase(repository);
const getUseCase = new GetModelUseCase(repository);
const listUseCase = new ListModelsUseCase(repository);
const updateUseCase = new UpdateModelUseCase(repository);
const deleteUseCase = new DeleteModelUseCase(repository);

const controller = new ModelController(
    createUseCase,
    getUseCase,
    listUseCase,
    updateUseCase,
    deleteUseCase
);

// Define Routes
router.post('/', (req, res) => controller.create(req, res));
router.get('/:id', (req, res) => controller.get(req, res));
router.get('/', (req, res) => controller.list(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));

export { router as modelRoutes };
