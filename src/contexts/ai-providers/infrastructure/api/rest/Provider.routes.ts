import { Router } from "express";
import { ProviderController } from "./ProviderController";
import { CreateProviderUseCase } from "../../../application/use-case/CreateProviderUseCase";
import { InMemoryProviderRepository } from "../../persistence/InMemoryProviderRepository";

const router = Router();

const providerRepository = new InMemoryProviderRepository();

const createProviderUseCase = new CreateProviderUseCase(providerRepository);

const controller = new ProviderController(createProviderUseCase)

router.post('/', (req, res) => controller.create(req, res));


export { router as providerRoutes };