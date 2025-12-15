import { AddProviderModelUseCase } from '../AddProviderModelUseCase';
import type { ProviderRepository } from '../../../domain/ports/ProviderRepository';
import { Provider } from '../../../domain/entities/Provider';
import { expect, test, describe, beforeEach, mock } from "bun:test";

describe('AddProviderModelUseCase', () => {
    let useCase: AddProviderModelUseCase;
    let mockProviderRepository: any;

    beforeEach(() => {
        mockProviderRepository = {
            findById: mock((id: string) => Promise.resolve(null)),
            save: mock((provider: Provider) => Promise.resolve()),
        };
        useCase = new AddProviderModelUseCase(mockProviderRepository as unknown as ProviderRepository);
    });

    test('should add a model to provider successfully', async () => {
        const now = new Date();
        const initialProvider = new Provider({
            id: 'openai',
            name: 'OpenAI',
            availableModels: new Map(),
            createdAt: now,
            updatedAt: now
        });

        mockProviderRepository.findById = mock(() => Promise.resolve(initialProvider));

        const dto = {
            providerId: 'openai',
            name: 'gpt-5',
            id: 'gpt-5-id'
        };

        await useCase.execute(dto);

        expect(mockProviderRepository.save).toHaveBeenCalledTimes(1);
        const savedProvider = mockProviderRepository.save.mock.calls[0][0] as Provider;
        expect(savedProvider.availableModels.has('gpt-5-id')).toBe(true);
        expect(savedProvider.availableModels.get('gpt-5-id')?.name).toBe('gpt-5');
    });

    test('should throw error if provider not found', async () => {
        mockProviderRepository.findById = mock(() => Promise.resolve(null));
        await expect(useCase.execute({ providerId: 'unknown', name: 'gpt-5' })).rejects.toThrow("Provider 'unknown' not found");
    });

    test('should throw error if model name already exists', async () => {
        const now = new Date();
        const existingModel = { id: 'gpt-4', name: 'gpt-4', associatedModelIds: new Set<string>() };
        const initialProvider = new Provider({
            id: 'openai',
            name: 'OpenAI',
            availableModels: new Map([['gpt-4', existingModel]]),
            createdAt: now,
            updatedAt: now
        });
        mockProviderRepository.findById = mock(() => Promise.resolve(initialProvider));

        await expect(useCase.execute({ providerId: 'openai', name: 'gpt-4' })).rejects.toThrow("Model with name 'gpt-4' already exists");
    });
});
