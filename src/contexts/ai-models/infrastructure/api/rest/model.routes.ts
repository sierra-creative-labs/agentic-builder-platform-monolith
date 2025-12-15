import { Router } from 'express';
import { InMemoryModelRepository } from '../../persistence/InMemoryModelRepository';
import { InMemoryProviderRepository } from '../../persistence/InMemoryProviderRepository';
import { CreateModelUseCase } from '../../../application/use-cases/CreateModelUseCase';
import { GetModelUseCase } from '../../../application/use-cases/GetModelUseCase';
import { ListModelsUseCase } from '../../../application/use-cases/ListModelsUseCase';
import { UpdateModelUseCase } from '../../../application/use-cases/UpdateModelUseCase';
import { DeleteModelUseCase } from '../../../application/use-cases/DeleteModelUseCase';
import { ModelController } from './ModelController';

const router = Router();

// Wiring up dependencies
const modelRepository = new InMemoryModelRepository();
const providerRepository = new InMemoryProviderRepository();


const createUseCase = new CreateModelUseCase(modelRepository, providerRepository);
const getUseCase = new GetModelUseCase(modelRepository);
const listUseCase = new ListModelsUseCase(modelRepository);
const updateUseCase = new UpdateModelUseCase(modelRepository);
const deleteUseCase = new DeleteModelUseCase(modelRepository);

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
