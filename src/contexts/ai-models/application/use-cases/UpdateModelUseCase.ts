import type { ModelRepository } from '../../domain/ports/ModelRepository';
import type { UpdateModelDTO } from '../dtos/ModelDTOs';

export class UpdateModelUseCase {
    constructor(private readonly repository: ModelRepository) { }

    async execute(id: string, dto: UpdateModelDTO): Promise<void> {
        const existingModel = await this.repository.findById(id);

        if (!existingModel) {
            throw new Error(`Model with id ${id} not found`);
        }

        const updatedModel = existingModel.withConfig(dto);
        await this.repository.update(updatedModel);
    }
}
