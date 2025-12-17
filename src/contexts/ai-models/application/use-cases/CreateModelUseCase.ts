import { Model } from '../../domain/entities/Model';
import type { Provider } from '../../domain/entities/Provider';
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
        const id = dto.id ?? randomUUID();
        await this.modelExists(id);
        await this.validateProvider(dto.provider, dto.model);
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

    private async modelExists(id: string): Promise<void> {
        if (await this.modelRepository.exists(id)) {
            throw new Error(`Model with id '${id}' already exists`);
        }
    }

    private async validateProvider(providerId: string, modelId: string): Promise<void> {
        const provider = await this.providerExists(providerId);
        await this.providerModelExists(provider, modelId);
    }

    private async providerExists(id: string): Promise<Provider> {
        const provider = await this.providerRepository.findById(id);
        if (!provider) {
            throw new Error(`Provider '${id}' not found`);
        }
        return provider
    }

    private async providerModelExists(provider: Provider, modelId: string): Promise<void> {
        if (!provider.hasModel(modelId)) {
            throw new Error(`Model with id '${modelId}' is not available for provider '${provider.id}'`);
        }
    }
}
