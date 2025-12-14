import { UpdateModelUseCase } from '../UpdateModelUseCase';
import type { ModelRepository } from '../../../domain/ports/ModelRepository';
import { Model } from '../../../domain/entities/Model';
import { expect, test, describe, beforeEach, mock } from "bun:test";

describe('UpdateModelUseCase', () => {
    let useCase: UpdateModelUseCase;
    let mockRepository: any;

    beforeEach(() => {
        mockRepository = {
            findById: mock((id: string) => Promise.resolve(null)),
            update: mock((model: Model) => Promise.resolve()),
        };
        useCase = new UpdateModelUseCase(mockRepository);
    });

    test('should update existing model', async () => {
        const existingModel = new Model({ id: '1', provider: 'p', model: 'm', temperature: 0.5 });
        mockRepository.findById = mock(() => Promise.resolve(existingModel));

        // Mock update to verify it was called
        mockRepository.update = mock(() => Promise.resolve());

        await useCase.execute('1', { temperature: 0.8 });

        expect(mockRepository.findById).toHaveBeenCalledWith('1');
        expect(mockRepository.update).toHaveBeenCalledTimes(1);

        // Check that the model passed to update has the new value
        const updatedModelArgument = mockRepository.update.mock.calls[0]![0] as Model;
        expect(updatedModelArgument.temperature).toBe(0.8);
        expect(updatedModelArgument.id).toBe('1');
    });

    test('should throw error if model not found', async () => {
        mockRepository.findById = mock(() => Promise.resolve(null));

        await expect(useCase.execute('non-existent', {})).rejects.toThrow('Model with id non-existent not found');
        expect(mockRepository.update).not.toHaveBeenCalled();
    });
});
