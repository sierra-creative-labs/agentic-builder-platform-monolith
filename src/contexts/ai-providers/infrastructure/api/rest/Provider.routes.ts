import { Router } from "express";
import { ProviderController } from "./ProviderController";
import { ProviderModelController } from "./ProviderModelController";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";

const router = Router();

const controller = container.get<ProviderController>(TYPES.ProviderController);
const modelController = container.get<ProviderModelController>(TYPES.ProviderModelController);

router.post('/', (req, res) => controller.create(req, res));
router.get('/:id', (req, res) => controller.getById(req, res));
router.get('/', (req, res) => controller.getAll(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));

// Model Routes
router.post('/:id/models', (req, res) => modelController.addModel(req, res));
router.delete('/:id/models/:modelId', (req, res) => modelController.removeModel(req, res));
router.patch('/:id/models/:modelId/activate', (req, res) => modelController.activateModel(req, res));
router.patch('/:id/models/:modelId/deactivate', (req, res) => modelController.deactivateModel(req, res));

export { router as providerRoutes };