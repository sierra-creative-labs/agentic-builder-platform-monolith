import { injectable, inject } from "inversify";
import type { ProviderRepository } from "../../domain/ports/ProviderRepository";
import { TYPES } from "../../infrastructure/di/types";

@injectable()
export class DeleteProviderUseCase {
    constructor(
        @inject(TYPES.ProviderRepository) private readonly providerRepository: ProviderRepository
    ) { }

    async execute(id: string): Promise<void> {
        await this.providerRepository.delete(id);
    }
}
