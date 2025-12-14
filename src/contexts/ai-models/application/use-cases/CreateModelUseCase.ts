import { Model } from '../../domain/entities/Model';
import type { ModelRepository } from '../../domain/ports/ModelRepository';
import type { CreateModelDTO } from '../dtos/ModelDTOs';

import { randomUUID } from 'crypto';

export class CreateModelUseCase {
    constructor(private readonly repository: ModelRepository) { }

    async execute(dto: CreateModelDTO): Promise<Model> {
        const model = new Model({
            id: dto.id ?? randomUUID(),
            provider: dto.provider,
            model: dto.model,
            maxOutputTokens: dto.maxOutputTokens,
            temperature: dto.temperature,
            topK: dto.topK,
            topP: dto.topP,
        });

        await this.repository.save(model);

        return model;
    }
}
