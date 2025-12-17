import { injectable, inject } from "inversify";
import type { Provider } from "../../domain/entities/Provider";
import { TYPES } from "../../infrastructure/di/types";
import { ProviderFinder } from "../../domain/services/ProviderFinder";

@injectable()
export class GetProviderUseCase {
    constructor(
        @inject(TYPES.ProviderFinder) private readonly providerFinder: ProviderFinder
    ) { }

    async execute(id: string): Promise<Provider> {
        return this.providerFinder.find(id);
    }
}
