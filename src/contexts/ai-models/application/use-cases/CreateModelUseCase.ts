import { Model } from '../../domain/entities/Model';
import type { ModelRepository } from '../../domain/ports/ModelRepository';
import type { ProviderRepository } from '../../domain/ports/ProviderRepository';
import type { CreateModelDTO } from '../dtos/ModelDTOs';

import { randomUUID } from 'crypto';

export class CreateModelUseCase {
    constructor(
        private readonly modelRepository: ModelRepository,
        private readonly providerRepository: ProviderRepository
    ) { }

    async execute(dto: CreateModelDTO): Promise<Model> {
        // 1. Validate ID Uniqueness if ID is provided
        const id = dto.id ?? randomUUID();
        const exists = await this.modelRepository.exists(id);
        if (exists) {
            throw new Error(`Model with id '${id}' already exists`);
        }

        // 2. Validate Provider
        const provider = await this.providerRepository.findById(dto.provider);
        if (!provider) {
            throw new Error(`Provider '${dto.provider}' not found`);
        }

        if (!provider.hasModel(dto.model)) {
            throw new Error(`Model with id '${dto.model}' is not available for provider '${dto.provider}'`);
        }

        const model = new Model({
            id: id,
            provider: dto.provider,
            model: dto.model,
            maxOutputTokens: dto.maxOutputTokens,
            temperature: dto.temperature,
            topK: dto.topK,
            topP: dto.topP,
        });

        await this.modelRepository.save(model);

        return model;
    }
}
