import { TYPES } from "../../di/types";
import { injectable, inject } from "inversify";
import type { Request, Response } from 'express';
import type { AddProviderModelUseCase } from "../../../application/use-case/AddProviderModelUseCase";
import type { RemoveProviderModelUseCase } from "../../../application/use-case/RemoveProviderModelUseCase";
import type { ActivateProviderModelUseCase } from "../../../application/use-case/ActivateProviderModelUseCase";
import type { DeactivateProviderModelUseCase } from "../../../application/use-case/DeactivateProviderModelUseCase";
import { ProviderMapper } from "../../../application/mappers/ProviderMapper";

@injectable()
export class ProviderModelController {
    constructor(
        @inject(TYPES.AddProviderModelUseCase) private readonly addProviderModelUseCase: AddProviderModelUseCase,
        @inject(TYPES.RemoveProviderModelUseCase) private readonly removeProviderModelUseCase: RemoveProviderModelUseCase,
        @inject(TYPES.ActivateProviderModelUseCase) private readonly activateProviderModelUseCase: ActivateProviderModelUseCase,
        @inject(TYPES.DeactivateProviderModelUseCase) private readonly deactivateProviderModelUseCase: DeactivateProviderModelUseCase,
    ) { }

    async addModel(req: Request, res: Response): Promise<void> {
        try {
            const provider = await this.addProviderModelUseCase.execute(req.params.id as string, req.body);
            res.status(200).json(ProviderMapper.toResponse(provider));
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    }

    async removeModel(req: Request, res: Response): Promise<void> {
        try {
            const provider = await this.removeProviderModelUseCase.execute(req.params.id as string, req.params.modelId as string);
            res.status(200).json(ProviderMapper.toResponse(provider));
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    }

    async activateModel(req: Request, res: Response): Promise<void> {
        try {
            const provider = await this.activateProviderModelUseCase.execute(req.params.id as string, req.params.modelId as string);
            res.status(200).json(ProviderMapper.toResponse(provider));
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    }

    async deactivateModel(req: Request, res: Response): Promise<void> {
        try {
            const provider = await this.deactivateProviderModelUseCase.execute(req.params.id as string, req.params.modelId as string);
            res.status(200).json(ProviderMapper.toResponse(provider));
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    }
}
