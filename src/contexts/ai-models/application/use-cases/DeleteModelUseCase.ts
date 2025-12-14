import type { ModelRepository } from '../../domain/ports/ModelRepository';

export class DeleteModelUseCase {
    constructor(private readonly repository: ModelRepository) { }

    async execute(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
