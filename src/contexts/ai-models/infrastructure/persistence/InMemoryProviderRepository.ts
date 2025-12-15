import type { ProviderRepository } from '../../domain/ports/ProviderRepository';
import { Provider } from '../../domain/entities/Provider';

export class InMemoryProviderRepository implements ProviderRepository {
    private readonly providers: Map<string, Provider> = new Map();

    constructor() {
        const now = new Date();

        // Seed OpenAI
        const startOpenAiModels = [
            { id: 'gpt-4', name: 'gpt-4', associatedModelIds: new Set<string>() },
            { id: 'gpt-3.5-turbo', name: 'gpt-3.5-turbo', associatedModelIds: new Set<string>() }
        ];
        this.save(new Provider({
            id: 'openai',
            name: 'OpenAI',
            availableModels: new Map(startOpenAiModels.map(m => [m.id, m])),
            createdAt: now,
            updatedAt: now
        }));

        // Seed Anthropic
        const startAnthropicModels = [
            { id: 'claude-3-opus', name: 'claude-3-opus', associatedModelIds: new Set<string>() },
            { id: 'claude-3-sonnet', name: 'claude-3-sonnet', associatedModelIds: new Set<string>() }
        ];
        this.save(new Provider({
            id: 'anthropic',
            name: 'Anthropic',
            availableModels: new Map(startAnthropicModels.map(m => [m.id, m])),
            createdAt: now,
            updatedAt: now
        }));

        // Seed Google
        const startGoogleModels = [
            { id: 'gemini-pro', name: 'gemini-pro', associatedModelIds: new Set<string>() }
        ];
        this.save(new Provider({
            id: 'google',
            name: 'Google',
            availableModels: new Map(startGoogleModels.map(m => [m.id, m])),
            createdAt: now,
            updatedAt: now
        }));
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
