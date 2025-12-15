
export interface ProviderModel {
    id: string;
    name: string;
    deletedAt?: Date;
    associatedModelIds: Set<string>;
}

export interface ProviderProps {
    id: string;
    name: string;
    availableModels: Map<string, ProviderModel>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class Provider {
    readonly id: string;
    readonly name: string;
    readonly availableModels: Map<string, ProviderModel>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt?: Date;

    constructor(props: ProviderProps) {
        this.id = props.id;
        this.name = props.name;
        this.availableModels = props.availableModels;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.deletedAt = props.deletedAt;
        this.validate();
    }

    private validate(): void {
        if (!this.id) throw new Error('Provider id is required');
        if (!this.name) throw new Error('Provider name is required');
    }

    hasModel(modelId: string): boolean {
        const model = this.availableModels.get(modelId);
        return !!model && !model.deletedAt;
    }

    registerModelUsage(providerModelId: string, modelId: string): Provider {
        const targetModel = this.availableModels.get(providerModelId);

        // Check existence
        if (!targetModel) {
            throw new Error(`Model with id '${providerModelId}' not found in provider '${this.name}'`);
        }

        // Immutable update: Clone the map
        const updatedModels = new Map(this.availableModels);

        // Create new Set to ensure immutability
        const newAssociatedIds = new Set(targetModel.associatedModelIds);
        newAssociatedIds.add(modelId);

        updatedModels.set(providerModelId, {
            ...targetModel,
            associatedModelIds: newAssociatedIds
        });

        return new Provider({
            ...this,
            availableModels: updatedModels,
            updatedAt: new Date(),
        });
    }

    softDeleteModel(modelId: string): Provider {
        const targetModel = this.availableModels.get(modelId);
        if (!targetModel) {
            throw new Error(`Model with id '${modelId}' not found in provider '${this.name}'`);
        }

        const updatedModels = new Map(this.availableModels);
        updatedModels.set(modelId, {
            ...targetModel,
            deletedAt: new Date()
        });

        return new Provider({
            ...this,
            availableModels: updatedModels,
            updatedAt: new Date(),
        });
    }

    addModel(model: ProviderModel): Provider {
        if (this.availableModels.has(model.id)) {
            throw new Error(`Model with id '${model.id}' already exists in provider '${this.name}'`);
        }

        // Check name uniqueness
        const nameExists = Array.from(this.availableModels.values()).some(m => m.name === model.name && !m.deletedAt);
        if (nameExists) {
            throw new Error(`Model with name '${model.name}' already exists in provider '${this.name}'`);
        }

        const updatedModels = new Map(this.availableModels);
        updatedModels.set(model.id, model);

        return new Provider({
            ...this,
            availableModels: updatedModels,
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
}
