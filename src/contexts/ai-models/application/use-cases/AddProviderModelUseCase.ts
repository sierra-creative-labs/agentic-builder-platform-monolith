import type { ProviderRepository } from '../../domain/ports/ProviderRepository';
import type { AddProviderModelDTO } from '../dtos/AddProviderModelDTO';
import { randomUUID } from 'crypto';

export class AddProviderModelUseCase {
    constructor(private readonly providerRepository: ProviderRepository) { }

    async execute(dto: AddProviderModelDTO): Promise<void> {
        const provider = await this.providerRepository.findById(dto.providerId);
        if (!provider) {
            throw new Error(`Provider '${dto.providerId}' not found`);
        }

        const newModel = {
            id: dto.id ?? randomUUID(),
            name: dto.name,
            associatedModelIds: new Set<string>()
        };

        const updatedProvider = provider.addModel(newModel);

        await this.providerRepository.save(updatedProvider);
    }
}
