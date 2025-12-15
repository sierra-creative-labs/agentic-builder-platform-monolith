import { Provider } from '../entities/Provider';

export interface ProviderRepository {
    findById(id: string): Promise<Provider | null>;
    findAll(): Promise<Provider[]>;
    save(provider: Provider): Promise<void>;
}
