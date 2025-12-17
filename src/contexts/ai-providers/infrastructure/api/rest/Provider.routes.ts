import { Router } from "express";
import { ProviderController } from "./ProviderController";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";

const router = Router();

const controller = container.get<ProviderController>(TYPES.ProviderController);

router.post('/', (req, res) => controller.create(req, res));
router.get('/:id', (req, res) => controller.getById(req, res));
router.get('/', (req, res) => controller.getAll(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));
router.post('/:id/models', (req, res) => controller.addModel(req, res));

export { router as providerRoutes };