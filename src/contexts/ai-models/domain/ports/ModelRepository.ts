import { Model } from '../entities/Model';

export interface ModelRepository {
    save(model: Model): Promise<void>;
    findById(id: string): Promise<Model | null>;
    findAll(): Promise<Model[]>;
    update(model: Model): Promise<void>;
    delete(id: string): Promise<void>;
}
