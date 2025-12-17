interface ProviderModelProps {
    id: string;
    name: string;
    isActive: boolean;
    associatedModelIds?: Set<string>;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class ProviderModel {
    readonly id: string;
    readonly name: string;
    readonly isActive: boolean;
    readonly associatedModelIds: Set<string>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt?: Date;

    constructor(props: ProviderModelProps) {
        this.id = props.id;
        this.name = props.name;
        this.isActive = props.isActive;
        this.associatedModelIds = props.associatedModelIds || new Set();
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
        this.deletedAt = props.deletedAt;
        this.validate();
    }

    private validate(): void {
        if (!this.id) throw new Error('ProviderModel id is required');
        if (!this.name) throw new Error('ProviderModel name is required');
        if (!this.isActive) throw new Error('ProviderModel isActive is required');
    }

    markAsActive(): ProviderModel {
        return new ProviderModel({
            ...this,
            isActive: true,
            updatedAt: new Date(),
        });
    }

    markAsInactive(): ProviderModel {
        return new ProviderModel({
            ...this,
            isActive: false,
            updatedAt: new Date(),
        });
    }

    markAsDeleted(): ProviderModel {
        return new ProviderModel({
            ...this,
            isActive: false,
            deletedAt: new Date(),
            updatedAt: new Date(),
        });
    }

    markAsNotDeleted(): ProviderModel {
        return new ProviderModel({
            ...this,
            deletedAt: undefined,
            updatedAt: new Date(),
        });
    }

    associateModel(modelId: string): ProviderModel {
        const updatedModels = new Set(this.associatedModelIds);
        updatedModels.add(modelId);
        return new ProviderModel({
            ...this,
            associatedModelIds: updatedModels,
            updatedAt: new Date(),
        });
    }

    isInUse(): boolean {
        return this.associatedModelIds.size > 0;
    }
}