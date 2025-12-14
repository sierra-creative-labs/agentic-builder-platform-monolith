import { Model } from '../../domain/entities/Model';
import type { ModelRepository } from '../../domain/ports/ModelRepository';

export class InMemoryModelRepository implements ModelRepository {
    private readonly models: Map<string, Model> = new Map();

    async save(model: Model): Promise<void> {
        this.models.set(model.id, model);
    }

    async findById(id: string): Promise<Model | null> {
        const model = this.models.get(id);
        return model || null;
    }

    async findAll(): Promise<Model[]> {
        return Array.from(this.models.values());
    }

    async update(model: Model): Promise<void> {
        if (!this.models.has(model.id)) {
            throw new Error(`Model with id ${model.id} not found`);
        }
        this.models.set(model.id, model);
    }

    async delete(id: string): Promise<void> {
        if (!this.models.has(id)) {
            throw new Error(`Model with id ${id} not found`);
        }
        this.models.delete(id);
    }
}
