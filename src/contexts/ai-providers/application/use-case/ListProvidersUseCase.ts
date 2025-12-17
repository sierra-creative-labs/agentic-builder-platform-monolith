import { injectable, inject } from "inversify";
import type { ProviderRepository } from "../../domain/ports/ProviderRepository";
import type { Provider } from "../../domain/entities/Provider";
import { TYPES } from "../../infrastructure/di/types";

@injectable()
export class ListProvidersUseCase {
    constructor(
        @inject(TYPES.ProviderRepository) private readonly providerRepository: ProviderRepository
    ) { }

    async execute(): Promise<Provider[]> {
        return this.providerRepository.findAll();
    }
}
