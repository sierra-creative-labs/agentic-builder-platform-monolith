import { Model } from '../../domain/entities/Model';
import type { ModelRepository } from '../../domain/ports/ModelRepository';

export class GetModelUseCase {
    constructor(private readonly repository: ModelRepository) { }

    async execute(id: string): Promise<Model | null> {
        return this.repository.findById(id);
    }
}
