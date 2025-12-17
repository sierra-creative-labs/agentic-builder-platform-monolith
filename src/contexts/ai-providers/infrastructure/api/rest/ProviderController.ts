import { TYPES } from "../../di/types";
import { injectable, inject } from "inversify";
import type { Request, Response } from 'express';
import { GetProviderUseCase } from "../../../application/use-case/GetProviderUseCase";
import { ListProvidersUseCase } from "../../../application/use-case/ListProvidersUseCase";
import { CreateProviderUseCase } from "../../../application/use-case/CreateProviderUseCase";
import { UpdateProviderUseCase } from "../../../application/use-case/UpdateProviderUseCase";
import { DeleteProviderUseCase } from "../../../application/use-case/DeleteProviderUseCase";
import type { AddProviderModelUseCase } from "../../../application/use-case/AddProviderModelUseCase";
import { ProviderMapper } from "../../../application/mappers/ProviderMapper";

@injectable()
export class ProviderController {
    constructor(
        @inject(TYPES.CreateProviderUseCase) private readonly createProviderUseCase: CreateProviderUseCase,
        @inject(TYPES.GetProviderUseCase) private readonly getProviderUseCase: GetProviderUseCase,
        @inject(TYPES.ListProvidersUseCase) private readonly listProvidersUseCase: ListProvidersUseCase,
        @inject(TYPES.UpdateProviderUseCase) private readonly updateProviderUseCase: UpdateProviderUseCase,
        @inject(TYPES.DeleteProviderUseCase) private readonly deleteProviderUseCase: DeleteProviderUseCase,
        @inject(TYPES.AddProviderModelUseCase) private readonly addProviderModelUseCase: AddProviderModelUseCase,
    ) { }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const provider = await this.createProviderUseCase.execute(req.body);
            res.status(201).json(ProviderMapper.toResponse(provider));
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const provider = await this.getProviderUseCase.execute(req.params.id as string);
            res.status(200).json(ProviderMapper.toResponse(provider));
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const providers = await this.listProvidersUseCase.execute();
            res.status(200).json(providers.map(ProviderMapper.toResponse));
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const provider = await this.updateProviderUseCase.execute(req.params.id as string, req.body);
            res.status(200).json(ProviderMapper.toResponse(provider));
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            await this.deleteProviderUseCase.execute(req.params.id as string);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async addModel(req: Request, res: Response): Promise<void> {
        try {
            const provider = await this.addProviderModelUseCase.execute(req.params.id as string, req.body);
            res.status(200).json(ProviderMapper.toResponse(provider));
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    }
}