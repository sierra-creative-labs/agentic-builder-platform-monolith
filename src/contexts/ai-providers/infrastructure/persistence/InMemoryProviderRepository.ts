import { injectable } from "inversify";
import type { ProviderRepository } from "../../domain/ports/ProviderRepository";
import type { Provider } from "../../domain/entities/Provider";

@injectable()
export class InMemoryProviderRepository implements ProviderRepository {
    private readonly providers: Map<string, Provider> = new Map();

    constructor() {

    }

    async existsById(id: string): Promise<boolean> {
        return this.providers.has(id);
    }

    async findById(id: string): Promise<Provider | null> {
        return this.providers.get(id) || null;
    }

    async findAll(): Promise<Provider[]> {
        return Array.from(this.providers.values());
    }

    async save(provider: Provider): Promise<Provider> {
        this.providers.set(provider.id, provider);
        return provider;
    }

    async update(provider: Provider): Promise<Provider> {
        this.providers.set(provider.id, provider);
        return provider;
    }

    async delete(id: string): Promise<void> {
        this.providers.delete(id);
    }
}