import { Model } from '../../domain/entities/Model';
import type { ModelRepository } from '../../domain/ports/ModelRepository';

export class ListModelsUseCase {
    constructor(private readonly repository: ModelRepository) { }

    async execute(): Promise<Model[]> {
        return this.repository.findAll();
    }
}
