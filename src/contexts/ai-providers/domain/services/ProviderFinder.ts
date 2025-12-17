import { injectable, inject } from "inversify";
import { TYPES } from "../../infrastructure/di/types";
import type { ProviderRepository } from "../ports/ProviderRepository";
import type { Provider } from "../entities/Provider";

@injectable()
export class ProviderFinder {
    constructor(
        @inject(TYPES.ProviderRepository) private readonly repository: ProviderRepository
    ) { }

    async find(id: string): Promise<Provider> {
        const provider = await this.repository.findById(id);
        if (!provider) {
            throw new Error(`Provider with id '${id}' not found`);
        }
        return provider;
    }

    async ensureDoesNotExist(id: string): Promise<void> {
        const exists = await this.repository.existsById(id);
        if (exists) {
            throw new Error(`Provider with id '${id}' already exists`);
        }
    }
}
