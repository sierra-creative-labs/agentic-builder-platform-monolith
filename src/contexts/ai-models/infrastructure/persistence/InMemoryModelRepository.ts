import { Model } from '../../domain/entities/Model';
import type { ModelRepository } from '../../domain/ports/ModelRepository';

export class InMemoryModelRepository implements ModelRepository {
    private readonly models: Map<string, Model> = new Map();

    async save(model: Model): Promise<void> {
        this.models.set(model.id, model);
    }

    async findById(id: string): Promise<Model | null> {
        const model = this.models.get(id);
        if (!model || model.deletedAt) {
            return null;
        }
        return model;
    }

    async exists(id: string): Promise<boolean> {
        return this.models.has(id);
    }

    async findAll(): Promise<Model[]> {
        return Array.from(this.models.values()).filter(m => !m.deletedAt);
    }

    async update(model: Model): Promise<void> {
        const existing = await this.findById(model.id);
        if (!existing) {
            throw new Error(`Model with id ${model.id} not found`);
        }
        this.models.set(model.id, model);
    }

    async delete(id: string): Promise<void> {
        const existing = await this.findById(id);
        if (!existing) {
            throw new Error(`Model with id ${id} not found`);
        }
        const deletedModel = existing.markAsDeleted();
        this.models.set(id, deletedModel);
    }
}
