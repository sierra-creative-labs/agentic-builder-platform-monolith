export interface CreateModelDTO {
    id?: string;
    provider: string;
    model: string;
    maxOutputTokens?: number;
    temperature?: number;
    topK?: number;
    topP?: number;
}

export interface UpdateModelDTO {
    maxOutputTokens?: number;
    temperature?: number;
    topK?: number;
    topP?: number;
}
