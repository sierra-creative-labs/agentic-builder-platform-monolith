export interface ProviderProps {
    id: string;
    name: string;
    availableModels: string[];
}

export class Provider {
    readonly id: string;
    readonly name: string;
    readonly availableModels: string[];

    constructor(props: ProviderProps) {
        this.id = props.id;
        this.name = props.name;
        this.availableModels = props.availableModels;
        this.validate();
    }

    private validate(): void {
        if (!this.id) throw new Error('Provider id is required');
        if (!this.name) throw new Error('Provider name is required');
    }

    hasModel(modelName: string): boolean {
        return this.availableModels.includes(modelName);
    }
}
