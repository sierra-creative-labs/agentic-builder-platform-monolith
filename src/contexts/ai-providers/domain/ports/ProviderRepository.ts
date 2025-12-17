import { Provider } from "../entities/Provider";

export interface ProviderRepository {
    save(provider: Provider): Promise<Provider>;
    update(provider: Provider): Promise<Provider>;
    delete(id: string): Promise<void>;
    existsById(id: string): Promise<boolean>;
    findById(id: string): Promise<Provider | null>;
    findAll(): Promise<Provider[]>;
}