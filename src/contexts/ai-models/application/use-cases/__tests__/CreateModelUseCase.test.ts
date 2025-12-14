import { CreateModelUseCase } from '../CreateModelUseCase';
import type { ModelRepository } from '../../../domain/ports/ModelRepository';
import { Model } from '../../../domain/entities/Model';

import { expect, test, describe, beforeEach, mock } from "bun:test";

// Mock Repository
const mockRepository = {
    save: mock((model: Model) => Promise.resolve()),
    findById: mock((id: string) => Promise.resolve(null)),
    findAll: mock(() => Promise.resolve([])),
    update: mock((model: Model) => Promise.resolve()),
    delete: mock((id: string) => Promise.resolve()),
};

describe('CreateModelUseCase', () => {
    let useCase: CreateModelUseCase;

    beforeEach(() => {
        mock.clearAllMocks();
        useCase = new CreateModelUseCase(mockRepository as unknown as ModelRepository);
    });

    test('should create a model successfully with provided id', async () => {
        const dto = {
            id: 'custom-id',
            provider: 'anthropic',
            model: 'claude-3',
            temperature: 0.5,
        };

        await useCase.execute(dto);

        expect(mockRepository.save).toHaveBeenCalledTimes(1);
        const savedModel = mockRepository.save.mock.calls[0]![0];
        expect(savedModel).toBeInstanceOf(Model);
        expect(savedModel.id).toBe('custom-id');
        expect(savedModel.provider).toBe('anthropic');
    });

    test('should generate an id if not provided', async () => {
        const dto = {
            provider: 'google',
            model: 'gemini-pro',
        };

        await useCase.execute(dto);

        expect(mockRepository.save).toHaveBeenCalledTimes(1);
        const savedModel = mockRepository.save.mock.calls[0]![0];
        expect(savedModel.id).toBeDefined();
        expect(typeof savedModel.id).toBe('string');
        expect(savedModel.id.length).toBeGreaterThan(0);
    });
});
