import { injectable, inject } from "inversify";
import type { ProviderRepository } from "../../domain/ports/ProviderRepository";
import type { UpdateProviderDTO } from "../../application/dtos/ProviderDTOs";
import { Provider } from "../../domain/entities/Provider";
import { TYPES } from "../../infrastructure/di/types";

@injectable()
export class UpdateProviderUseCase {
    constructor(
        @inject(TYPES.ProviderRepository) private readonly providerRepository: ProviderRepository
    ) { }

    async execute(id: string, dto: UpdateProviderDTO): Promise<Provider> {
        const provider = await this.providerRepository.findById(id);
        if (!provider) {
            throw new Error(`Provider with id '${id}' not found`);
        }

        const updatedProvider = new Provider({
            id: provider.id,
            name: dto.name ?? provider.name,
            isActive: dto.isActive ?? provider.isActive,
            availableModels: provider.availableModels,
            createdAt: provider.createdAt,
            updatedAt: new Date(),
            deletedAt: provider.deletedAt
        });

        await this.providerRepository.update(updatedProvider);
        return updatedProvider;
    }
}
