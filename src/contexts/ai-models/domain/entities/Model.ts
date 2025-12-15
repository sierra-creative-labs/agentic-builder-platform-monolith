export interface ModelProps {
    id: string;
    provider: string;
    model: string;
    maxOutputTokens?: number;
    temperature?: number;
    topK?: number;
    topP?: number;
}

export class Model {
    readonly id: string;
    readonly provider: string;
    readonly model: string;
    readonly maxOutputTokens?: number;
    readonly temperature?: number;
    readonly topK?: number;
    readonly topP?: number;
    readonly deletedAt?: Date;

    constructor(props: ModelProps & { deletedAt?: Date }) {
        this.id = props.id;
        this.provider = props.provider;
        this.model = props.model;
        this.maxOutputTokens = props.maxOutputTokens;
        this.temperature = props.temperature;
        this.topK = props.topK;
        this.topP = props.topP;
        this.deletedAt = props.deletedAt;

        this.validate();
    }

    private validate(): void {
        if (!this.id) {
            throw new Error('Model id is required');
        }
        if (!this.provider) {
            throw new Error('Model provider is required');
        }
        if (!this.model) {
            throw new Error('Model name is required');
        }
        if (this.temperature !== undefined && (this.temperature < 0 || this.temperature > 1)) {
            throw new Error('Temperature must be between 0 and 1');
        }
        if (this.maxOutputTokens !== undefined && this.maxOutputTokens <= 0) {
            throw new Error('Max output tokens must be greater than 0');
        }
    }

    // Example business logic method: cloning the model with updated config
    withConfig(config: Partial<Omit<ModelProps, 'id' | 'provider' | 'model'>>): Model {
        return new Model({
            ...this,
            ...config,
            deletedAt: this.deletedAt, // Preserve deletion status
        });
    }

    markAsDeleted(): Model {
        return new Model({
            ...this,
            deletedAt: new Date(),
        });
    }
}
