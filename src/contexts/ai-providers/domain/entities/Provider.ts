import { ProviderModel } from "./ProviderModel";

export interface ProviderProps {
    id: string;
    name: string;
    isActive?: boolean;
    availableModels?: Map<string, ProviderModel>;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class Provider {
    readonly id: string;
    readonly name: string;
    readonly isActive: boolean;
    readonly availableModels: Map<string, ProviderModel>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt?: Date;

    constructor(props: ProviderProps) {
        this.id = props.id;
        this.name = props.name;
        this.isActive = props.isActive || false;
        this.availableModels = props.availableModels || new Map();
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
        this.deletedAt = props.deletedAt;
        this.validate();
    }

    private validate(): void {
        if (!this.id) throw new Error('Provider id is required');
        if (!this.name) throw new Error('Provider name is required');
    }

    addModel(model: ProviderModel): Provider {
        const updatedModels = new Map(this.availableModels);
        updatedModels.set(model.id, model);
        return new Provider({
            ...this,
            availableModels: updatedModels,
            updatedAt: new Date(),
        });
    }

    removeModel(modelId: string): Provider {
        const updatedModels = new Map(this.availableModels);
        updatedModels.delete(modelId);
        return new Provider({
            ...this,
            availableModels: updatedModels,
            updatedAt: new Date(),
        });
    }

    getModels(): Map<string, ProviderModel> {
        return new Map(this.availableModels);
    }

    getModel(modelId: string): ProviderModel | undefined {
        return this.availableModels.get(modelId);
    }

    hasModel(modelId: string): boolean {
        return this.availableModels.has(modelId);
    }

    markAsActive(): Provider {
        return new Provider({
            ...this,
            isActive: true,
            updatedAt: new Date(),
        });
    }

    markAsInactive(): Provider {
        return new Provider({
            ...this,
            isActive: false,
            updatedAt: new Date(),
        });
    }

    markAsDeleted(): Provider {
        return new Provider({
            ...this,
            deletedAt: new Date(),
            updatedAt: new Date(),
        });
    }

    markAsNotDeleted(): Provider {
        return new Provider({
            ...this,
            deletedAt: undefined,
            updatedAt: new Date(),
        });
    }
}