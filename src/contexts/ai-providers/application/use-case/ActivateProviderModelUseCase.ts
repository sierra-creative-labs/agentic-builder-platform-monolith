import { injectable, inject } from "inversify";
import { TYPES } from "../../infrastructure/di/types";
import { ProviderFinder } from "../../domain/services/ProviderFinder";
import type { ProviderRepository } from "../../domain/ports/ProviderRepository";

@injectable()
export class ActivateProviderModelUseCase {
    constructor(
        @inject(TYPES.ProviderRepository) private readonly providerRepository: ProviderRepository,
        @inject(TYPES.ProviderFinder) private readonly providerFinder: ProviderFinder
    ) { }

    async execute(providerId: string, modelId: string) {
        const provider = await this.providerFinder.find(providerId);
        const model = provider.getModel(modelId);

        if (!model) {
            throw new Error(`Model with id '${modelId}' not found in provider '${providerId}'`);
        }

        const activeModel = model.markAsActive();
        const updatedProvider = provider.addModel(activeModel);

        await this.providerRepository.update(updatedProvider);
        return updatedProvider;
    }
}
