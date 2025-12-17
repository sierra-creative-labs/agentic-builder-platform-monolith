import { injectable, inject } from "inversify";
import type { ProviderRepository } from "../../domain/ports/ProviderRepository";
import type { CreateProviderDTO } from "../../application/dtos/ProviderDTOs";
import { Provider } from "../../domain/entities/Provider";
import { randomUUID } from "crypto";
import { TYPES } from "../../infrastructure/di/types";


@injectable()
export class CreateProviderUseCase {
    constructor(
        @inject(TYPES.ProviderRepository) private readonly providerRepository: ProviderRepository
    ) { }

    async execute(dto: CreateProviderDTO): Promise<Provider> {
        const id = dto.id ?? randomUUID();
        await this.providerExists(id);
        const provider = new Provider({
            id: id,
            name: dto.name,
            isActive: true
        });
        await this.providerRepository.save(provider);
        return provider;
    }

    private async providerExists(id: string): Promise<void> {
        if (await this.providerRepository.existsById(id)) {
            throw new Error(`Provider with id '${id}' already exists`);
        }
    }
}   