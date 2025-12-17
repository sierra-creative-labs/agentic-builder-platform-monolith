import { injectable, inject } from "inversify";
import type { ProviderRepository } from "../../domain/ports/ProviderRepository";
import type { CreateProviderDTO } from "../../application/dtos/ProviderDTOs";
import { Provider } from "../../domain/entities/Provider";
import { randomUUID } from "crypto";
import { TYPES } from "../../infrastructure/di/types";
import { ProviderFinder } from "../../domain/services/ProviderFinder";


@injectable()
export class CreateProviderUseCase {
    constructor(
        @inject(TYPES.ProviderRepository) private readonly providerRepository: ProviderRepository,
        @inject(TYPES.ProviderFinder) private readonly providerFinder: ProviderFinder
    ) { }

    async execute(dto: CreateProviderDTO): Promise<Provider> {
        const id = dto.id ?? randomUUID();
        await this.providerFinder.ensureDoesNotExist(id);
        const provider = new Provider({
            id: id,
            name: dto.name,
            isActive: true
        });
        await this.providerRepository.save(provider);
        return provider;
    }
}   