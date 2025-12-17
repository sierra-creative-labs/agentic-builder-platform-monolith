export interface CreateProviderDTO {
    id?: string;
    name: string;
}

export interface UpdateProviderDTO {
    name?: string;
    isActive?: boolean;
}