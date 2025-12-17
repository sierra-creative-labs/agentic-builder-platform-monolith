import { Container } from "inversify";
import { TYPES } from "./types";
import { InMemoryProviderRepository } from "../persistence/InMemoryProviderRepository";
import type { ProviderRepository } from "../../domain/ports/ProviderRepository";
import { CreateProviderUseCase } from "../../application/use-case/CreateProviderUseCase";
import { GetProviderUseCase } from "../../application/use-case/GetProviderUseCase";
import { ListProvidersUseCase } from "../../application/use-case/ListProvidersUseCase";
import { UpdateProviderUseCase } from "../../application/use-case/UpdateProviderUseCase";
import { DeleteProviderUseCase } from "../../application/use-case/DeleteProviderUseCase";
import { ProviderController } from "../api/rest/ProviderController";

const container = new Container();

container.bind<ProviderRepository>(TYPES.ProviderRepository).to(InMemoryProviderRepository).inSingletonScope();
container.bind<CreateProviderUseCase>(TYPES.CreateProviderUseCase).to(CreateProviderUseCase);
container.bind<GetProviderUseCase>(TYPES.GetProviderUseCase).to(GetProviderUseCase);
container.bind<ListProvidersUseCase>(TYPES.ListProvidersUseCase).to(ListProvidersUseCase);
container.bind<UpdateProviderUseCase>(TYPES.UpdateProviderUseCase).to(UpdateProviderUseCase);
container.bind<DeleteProviderUseCase>(TYPES.DeleteProviderUseCase).to(DeleteProviderUseCase);
container.bind<ProviderController>(TYPES.ProviderController).to(ProviderController);

export { container };
