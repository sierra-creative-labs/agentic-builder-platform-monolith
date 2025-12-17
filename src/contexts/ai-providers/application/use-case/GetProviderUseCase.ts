import { injectable, inject } from "inversify";
import type { ProviderRepository } from "../../domain/ports/ProviderRepository";
import type { Provider } from "../../domain/entities/Provider";
import { TYPES } from "../../infrastructure/di/types";

@injectable()
export class GetProviderUseCase {
    constructor(
        @inject(TYPES.ProviderRepository) private readonly providerRepository: ProviderRepository
    ) { }

    async execute(id: string): Promise<Provider> {
        const provider = await this.providerRepository.findById(id);
        if (!provider) {
            throw new Error(`Provider with id '${id}' not found`);
        }
        return provider;
    }
}
