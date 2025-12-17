import type { ProviderRepository } from "../../domain/ports/ProviderRepository";
import type { CreateProviderDTO } from "../../application/dtos/ProviderDTOs";
import { Provider } from "../../domain/entities/Provider";
import { ProviderModel } from "../../domain/entities/ProviderModel";
import { randomUUID } from "crypto";


export class CreateProviderUseCase {
    constructor(
        private readonly providerRepository: ProviderRepository
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