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
        };
        mockProviderRepository = {
            findById: mock((id: string) => Promise.resolve(null)),
        };

        useCase = new CreateModelUseCase(
            mockModelRepository as unknown as ModelRepository,
            mockProviderRepository as unknown as ProviderRepository
        );
    });

    test('should create a model successfully when provider and model are valid', async () => {
        // Setup Provider Mock
        const mockProvider = new Provider({
            id: 'anthropic',
            name: 'Anthropic',
            availableModels: ['claude-3', 'claude-2']
        });
        mockProviderRepository.findById = mock(() => Promise.resolve(mockProvider));

        const dto = {
            id: 'custom-id',
            provider: 'anthropic',
            model: 'claude-3',
            temperature: 0.5,
        };

        await useCase.execute(dto);

        expect(mockModelRepository.save).toHaveBeenCalledTimes(1);
        const savedModel = mockModelRepository.save.mock.calls[0][0];
        expect(savedModel).toBeInstanceOf(Model);
        expect(savedModel.id).toBe('custom-id');
        expect(savedModel.provider).toBe('anthropic');
    });

    test('should throw error if provider not found', async () => {
        mockProviderRepository.findById = mock(() => Promise.resolve(null));

        const dto = { provider: 'unknown', model: 'gpt-4' };

        await expect(useCase.execute(dto)).rejects.toThrow("Provider 'unknown' not found");
        expect(mockModelRepository.save).not.toHaveBeenCalled();
    });

    test('should throw error if model not in provider list', async () => {
        const mockProvider = new Provider({
            id: 'openai',
            name: 'OpenAI',
            availableModels: ['gpt-4']
        });
        mockProviderRepository.findById = mock(() => Promise.resolve(mockProvider));

        const dto = { provider: 'openai', model: 'claude-3' }; // Wrong model for this provider

        await expect(useCase.execute(dto)).rejects.toThrow("Model 'claude-3' is not available for provider 'openai'");
        expect(mockModelRepository.save).not.toHaveBeenCalled();
    });

    test('should generate an id if not provided', async () => {
        const mockProvider = new Provider({
            id: 'google',
            name: 'Google',
            availableModels: ['gemini-pro']
        });
        mockProviderRepository.findById = mock(() => Promise.resolve(mockProvider));

        const dto = {
            provider: 'google',
            model: 'gemini-pro',
        };

        await useCase.execute(dto);

        expect(mockModelRepository.save).toHaveBeenCalledTimes(1);
        const savedModel = mockModelRepository.save.mock.calls[0][0];
        expect(savedModel.id).toBeDefined();
        expect(typeof savedModel.id).toBe('string');
        expect(savedModel.id.length).toBeGreaterThan(0);
    });
});
