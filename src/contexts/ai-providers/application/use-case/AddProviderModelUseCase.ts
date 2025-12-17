import { injectable, inject } from "inversify";
import { TYPES } from "../../infrastructure/di/types";
import { ProviderModel } from "../../domain/entities/ProviderModel";
import { ProviderFinder } from "../../domain/services/ProviderFinder";
import type { AddProviderModelDTO } from "../dtos/ProviderModelDTOs";
import type { ProviderRepository } from "../../domain/ports/ProviderRepository";


@injectable()
export class AddProviderModelUseCase {
    constructor(
        @inject(TYPES.ProviderRepository) private readonly providerRepository: ProviderRepository,
        @inject(TYPES.ProviderFinder) private readonly providerFinder: ProviderFinder
    ) { }

    async execute(providerId: string, providerModelDTO: AddProviderModelDTO) {
        const provider = await this.providerFinder.find(providerId);
        const providerModel = new ProviderModel({
            id: providerModelDTO.id,
            name: providerModelDTO.name,
            isActive: providerModelDTO.isActive || true,
        });

        const providerUpdated = provider.addModel(providerModel);

        await this.providerRepository.save(providerUpdated);
        return providerUpdated;
    }
}   