import type { ProviderRepository } from '../../domain/ports/ProviderRepository';
import { Provider } from '../../domain/entities/Provider';

export class InMemoryProviderRepository implements ProviderRepository {
    private readonly providers: Map<string, Provider> = new Map();

    constructor() {
        this.save(new Provider({ id: 'openai', name: 'OpenAI', availableModels: ['gpt-4', 'gpt-3.5-turbo'] }));
        this.save(new Provider({ id: 'anthropic', name: 'Anthropic', availableModels: ['claude-3-opus', 'claude-3-sonnet'] }));
        this.save(new Provider({ id: 'google', name: 'Google', availableModels: ['gemini-pro'] }));
    }

    async findById(id: string): Promise<Provider | null> {
        const provider = this.providers.get(id);
        return provider || null;
    }

    async findAll(): Promise<Provider[]> {
        return Array.from(this.providers.values());
    }

    async save(provider: Provider): Promise<void> {
        this.providers.set(provider.id, provider);
    }
}
