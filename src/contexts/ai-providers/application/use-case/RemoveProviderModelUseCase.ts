import { injectable, inject } from "inversify";
import { TYPES } from "../../infrastructure/di/types";
import { ProviderFinder } from "../../domain/services/ProviderFinder";
import type { ProviderRepository } from "../../domain/ports/ProviderRepository";

@injectable()
export class RemoveProviderModelUseCase {
    constructor(
        @inject(TYPES.ProviderRepository) private readonly providerRepository: ProviderRepository,
        @inject(TYPES.ProviderFinder) private readonly providerFinder: ProviderFinder
    ) { }

    async execute(providerId: string, modelId: string) {
        const provider = await this.providerFinder.find(providerId);

        if (!provider.hasModel(modelId)) {
            throw new Error(`Model with id '${modelId}' not found in provider '${providerId}'`);
        }

        const updatedProvider = provider.removeModel(modelId);
        await this.providerRepository.update(updatedProvider);
        return updatedProvider;
    }
}
