import { InMemoryModelRepository } from '../InMemoryModelRepository';
import { Model } from '../../../domain/entities/Model';

import { expect, test, describe, beforeEach } from "bun:test";


describe('InMemoryModelRepository', () => {
    let repository: InMemoryModelRepository;

    beforeEach(() => {
        repository = new InMemoryModelRepository();
    });

    const createModel = (id: string) => new Model({
        id,
        provider: 'test-provider',
        model: 'test-model'
    });

    test('should save and find a model', async () => {
        const model = createModel('1');
        await repository.save(model);

        const found = await repository.findById('1');
        expect(found).toEqual(model);
    });

    test('should return null if model not found', async () => {
        const found = await repository.findById('non-existent');
        expect(found).toBeNull();
    });

    test('should find all models', async () => {
        await repository.save(createModel('1'));
        await repository.save(createModel('2'));

        const all = await repository.findAll();
        expect(all).toHaveLength(2);
    });

    test('should update a model', async () => {
        const model = createModel('1');
        await repository.save(model);

        const updated = model.withConfig({ temperature: 0.9 });
        await repository.update(updated);

        const found = await repository.findById('1');
        expect(found?.temperature).toBe(0.9);
    });

    test('should throw error when updating non-existent model', async () => {
        const model = createModel('1');
        await expect(repository.update(model)).rejects.toThrow('Model with id 1 not found');
    });

    test('should delete a model', async () => {
        const model = createModel('1');
        await repository.save(model);

        await repository.delete('1');

        const found = await repository.findById('1');
        expect(found).toBeNull();
    });

    test('should throw error when deleting non-existent model', async () => {
        await expect(repository.delete('non-existent')).rejects.toThrow('Model with id non-existent not found');
    });
});
