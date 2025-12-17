import { Provider } from "../../domain/entities/Provider";
import { ProviderModel } from "../../domain/entities/ProviderModel";

export interface ProviderResponseDTO {
    id: string;
    name: string;
    isActive: boolean;
    availableModels: ProviderModelResponseDTO[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export interface ProviderModelResponseDTO {
    id: string;
    name: string;
    isActive: boolean;
    associatedModelIds: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class ProviderMapper {
    static toResponse(provider: Provider): ProviderResponseDTO {
        return {
            id: provider.id,
            name: provider.name,
            isActive: provider.isActive,
            availableModels: Array.from(provider.availableModels.values()).map(ProviderMapper.toModelResponse),
            createdAt: provider.createdAt,
            updatedAt: provider.updatedAt,
            deletedAt: provider.deletedAt,
        };
    }

    static toModelResponse(model: ProviderModel): ProviderModelResponseDTO {
        return {
            id: model.id,
            name: model.name,
            isActive: model.isActive,
            associatedModelIds: Array.from(model.associatedModelIds),
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
            deletedAt: model.deletedAt,
        };
    }
}
