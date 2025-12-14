import type { Request, Response } from 'express';
import type { CreateModelUseCase } from '../../../application/use-cases/CreateModelUseCase';
import type { GetModelUseCase } from '../../../application/use-cases/GetModelUseCase';
import type { ListModelsUseCase } from '../../../application/use-cases/ListModelsUseCase';
import type { UpdateModelUseCase } from '../../../application/use-cases/UpdateModelUseCase';
import type { DeleteModelUseCase } from '../../../application/use-cases/DeleteModelUseCase';

export class ModelController {
    constructor(
        private readonly createModelUseCase: CreateModelUseCase,
        private readonly getModelUseCase: GetModelUseCase,
        private readonly listModelsUseCase: ListModelsUseCase,
        private readonly updateModelUseCase: UpdateModelUseCase,
        private readonly deleteModelUseCase: DeleteModelUseCase
    ) { }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const model = await this.createModelUseCase.execute(req.body);
            res.status(201).json(model);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async get(req: Request, res: Response): Promise<void> {
        if (!req.params.id) {
            res.status(400).json({ error: 'Model ID is required' });
            return;
        }
        try {
            const model = await this.getModelUseCase.execute(req.params.id);
            if (!model) {
                res.status(404).json({ error: 'Model not found' });
                return;
            }
            res.json(model);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async list(req: Request, res: Response): Promise<void> {
        try {
            const models = await this.listModelsUseCase.execute();
            res.json(models);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        if (!req.params.id) {
            res.status(400).json({ error: 'Model ID is required' });
            return;
        }
        try {
            await this.updateModelUseCase.execute(req.params.id, req.body);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        if (!req.params.id) {
            res.status(400).json({ error: 'Model ID is required' });
            return;
        }
        try {
            await this.deleteModelUseCase.execute(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }
}
