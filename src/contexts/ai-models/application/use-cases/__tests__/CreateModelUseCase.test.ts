import { CreateModelUseCase } from '../CreateModelUseCase';
import type { ModelRepository } from '../../../domain/ports/ModelRepository';
import type { ProviderRepository } from '../../../domain/ports/ProviderRepository';
import { Model } from '../../../domain/entities/Model';
import { Provider } from '../../../domain/entities/Provider';

import { expect, test, describe, beforeEach, mock } from "bun:test";

describe('CreateModelUseCase', () => {
    let useCase: CreateModelUseCase;
    let mockModelRepository: any;
    let mockProviderRepository: any;

    beforeEach(() => {
        mockModelRepository = {
            save: mock((model: Model) => Promise.resolve()),
            exists: mock((id: string) => Promise.resolve(false)), // Default to not existing
        };
        mockProviderRepository = {
            findById: mock((id: string) => Promise.resolve(null)),
            save: mock((provider: Provider) => Promise.resolve()), // Add save mock
        };

        useCase = new CreateModelUseCase(
            mockModelRepository as unknown as ModelRepository,
            mockProviderRepository as unknown as ProviderRepository
        );
    });

    test('should throw error if model id already exists', async () => {
        mockModelRepository.exists = mock(() => Promise.resolve(true));

        const dto = { id: 'existing-id', provider: 'openai', model: 'gpt-4' };

        await expect(useCase.execute(dto)).rejects.toThrow("Model with id 'existing-id' already exists");
        expect(mockModelRepository.save).not.toHaveBeenCalled();
    });

    test('should create a model successfully when provider and model are valid', async () => {
        // Setup Provider Mock
        const now = new Date();
        const models = [
            { id: 'm1', name: 'claude-3', associatedModelIds: new Set<string>() },
            { id: 'm2', name: 'claude-2', associatedModelIds: new Set<string>() }
        ];
        const mockProvider = new Provider({
            id: 'anthropic',
            name: 'Anthropic',
            availableModels: new Map(models.map(m => [m.id, m])),
            createdAt: now,
            updatedAt: now
        });
        mockProviderRepository.findById = mock(() => Promise.resolve(mockProvider));

        const dto = {
            id: 'custom-id',
            provider: 'anthropic',
            model: 'm1', // Using ID
            temperature: 0.5,
        };

        await useCase.execute(dto);

        // Verify Model Saved
        expect(mockModelRepository.save).toHaveBeenCalledTimes(1);
        const savedModel = mockModelRepository.save.mock.calls[0][0];
        expect(savedModel).toBeInstanceOf(Model);
        expect(savedModel.id).toBe('custom-id');
        expect(savedModel.model).toBe('m1'); // Stores the model ID

        // Verify Provider was NOT Updated (since we removed that logic)
        expect(mockProviderRepository.save).not.toHaveBeenCalled();
    });

    test('should throw error if provider not found', async () => {
        mockProviderRepository.findById = mock(() => Promise.resolve(null));

        const dto = { provider: 'unknown', model: 'gpt-4' };

        await expect(useCase.execute(dto)).rejects.toThrow("Provider 'unknown' not found");
        expect(mockModelRepository.save).not.toHaveBeenCalled();
    });

    test('should throw error if model not in provider list', async () => {
        const now = new Date();
        const models = [
            { id: 'm3', name: 'gpt-4', associatedModelIds: new Set<string>() }
        ];
        const mockProvider = new Provider({
            id: 'openai',
            name: 'OpenAI',
            availableModels: new Map(models.map(m => [m.id, m])),
            createdAt: now,
            updatedAt: now
        });
        mockProviderRepository.findById = mock(() => Promise.resolve(mockProvider));

        const dto = { provider: 'openai', model: 'wrong-id' }; // Wrong model ID

        await expect(useCase.execute(dto)).rejects.toThrow("Model with id 'wrong-id' is not available for provider 'openai'");
        expect(mockModelRepository.save).not.toHaveBeenCalled();
    });

    test('should generate an id if not provided', async () => {
        const now = new Date();
        const models = [
            { id: 'm4', name: 'gemini-pro', associatedModelIds: new Set<string>() }
        ];
        const mockProvider = new Provider({
            id: 'google',
            name: 'Google',
            availableModels: new Map(models.map(m => [m.id, m])),
            createdAt: now,
            updatedAt: now
        });
        mockProviderRepository.findById = mock(() => Promise.resolve(mockProvider));

        const dto = {
            provider: 'google',
            model: 'm4',
        };

        await useCase.execute(dto);

        expect(mockModelRepository.save).toHaveBeenCalledTimes(1);
        const savedModel = mockModelRepository.save.mock.calls[0][0];
        expect(savedModel.id).toBeDefined();
        expect(typeof savedModel.id).toBe('string');
        expect(savedModel.id.length).toBeGreaterThan(0);
    });
});
