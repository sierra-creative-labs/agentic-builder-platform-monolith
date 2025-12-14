import { ListModelsUseCase } from '../ListModelsUseCase';
import type { ModelRepository } from '../../../domain/ports/ModelRepository';
import { Model } from '../../../domain/entities/Model';
import { expect, test, describe, beforeEach, mock } from "bun:test";

describe('ListModelsUseCase', () => {
    let useCase: ListModelsUseCase;
    let mockRepository: any;

    beforeEach(() => {
        mockRepository = {
            findAll: mock(() => Promise.resolve([])),
        };
        useCase = new ListModelsUseCase(mockRepository);
    });

    test('should return list of models', async () => {
        const models = [
            new Model({ id: '1', provider: 'p', model: 'm1' }),
            new Model({ id: '2', provider: 'p', model: 'm2' })
        ];
        mockRepository.findAll = mock(() => Promise.resolve(models));

        const result = await useCase.execute();
        expect(result).toHaveLength(2);
        expect(result).toEqual(models);
        expect(mockRepository.findAll).toHaveBeenCalled();
    });
});
