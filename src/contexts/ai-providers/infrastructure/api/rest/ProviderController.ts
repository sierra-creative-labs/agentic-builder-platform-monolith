import type { Request, Response } from 'express';
import { CreateProviderUseCase } from "../../../application/use-case/CreateProviderUseCase";

export class ProviderController {
    constructor(
        private readonly createProviderUseCase: CreateProviderUseCase,
    ) { }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const provider = await this.createProviderUseCase.execute(req.body);
            res.status(201).json(provider);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }
}