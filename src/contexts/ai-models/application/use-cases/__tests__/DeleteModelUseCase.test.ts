import { DeleteModelUseCase } from '../DeleteModelUseCase';
import type { ModelRepository } from '../../../domain/ports/ModelRepository';
import { expect, test, describe, beforeEach, mock } from "bun:test";

describe('DeleteModelUseCase', () => {
    let useCase: DeleteModelUseCase;
    let mockRepository: any;

    beforeEach(() => {
        mockRepository = {
            delete: mock((id: string) => Promise.resolve()),
        };
        useCase = new DeleteModelUseCase(mockRepository);
    });

    test('should delete model', async () => {
        await useCase.execute('123');
        expect(mockRepository.delete).toHaveBeenCalledWith('123');
    });

    test('should propagate errors from repository', async () => {
        mockRepository.delete = mock(() => Promise.reject(new Error('Delete failed')));
        await expect(useCase.execute('123')).rejects.toThrow('Delete failed');
    });
});
