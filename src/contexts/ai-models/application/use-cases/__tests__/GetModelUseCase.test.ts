import { GetModelUseCase } from '../GetModelUseCase';
import type { ModelRepository } from '../../../domain/ports/ModelRepository';
import { Model } from '../../../domain/entities/Model';
import { expect, test, describe, beforeEach, mock } from "bun:test";

describe('GetModelUseCase', () => {
    let useCase: GetModelUseCase;
    let mockRepository: any;

    beforeEach(() => {
        mockRepository = {
            findById: mock((id: string) => Promise.resolve(null)),
        };
        useCase = new GetModelUseCase(mockRepository);
    });

    test('should return model if found', async () => {
        const dummyModel = new Model({ id: '1', provider: 'p', model: 'm' });
        mockRepository.findById = mock(() => Promise.resolve(dummyModel));

        const result = await useCase.execute('1');
        expect(result).toEqual(dummyModel);
        expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    test('should return null if not found', async () => {
        mockRepository.findById = mock(() => Promise.resolve(null));

        const result = await useCase.execute('non-existent');
        expect(result).toBeNull();
    });
});
