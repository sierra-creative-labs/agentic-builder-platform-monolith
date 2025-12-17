import { TYPES } from "./types";
import { Container } from "inversify";
import { ProviderController } from "../api/rest/ProviderController";
import { ProviderFinder } from "../../domain/services/ProviderFinder";
import type { ProviderRepository } from "../../domain/ports/ProviderRepository";
import { GetProviderUseCase } from "../../application/use-case/GetProviderUseCase";
import { InMemoryProviderRepository } from "../persistence/InMemoryProviderRepository";
import { ListProvidersUseCase } from "../../application/use-case/ListProvidersUseCase";
import { CreateProviderUseCase } from "../../application/use-case/CreateProviderUseCase";
import { UpdateProviderUseCase } from "../../application/use-case/UpdateProviderUseCase";
import { DeleteProviderUseCase } from "../../application/use-case/DeleteProviderUseCase";
import { AddProviderModelUseCase } from "../../application/use-case/AddProviderModelUseCase";

const container = new Container();

container.bind<ProviderRepository>(TYPES.ProviderRepository).to(InMemoryProviderRepository).inSingletonScope();
container.bind<ProviderFinder>(TYPES.ProviderFinder).to(ProviderFinder);
container.bind<CreateProviderUseCase>(TYPES.CreateProviderUseCase).to(CreateProviderUseCase);
container.bind<GetProviderUseCase>(TYPES.GetProviderUseCase).to(GetProviderUseCase);
container.bind<ListProvidersUseCase>(TYPES.ListProvidersUseCase).to(ListProvidersUseCase);
container.bind<UpdateProviderUseCase>(TYPES.UpdateProviderUseCase).to(UpdateProviderUseCase);
container.bind<DeleteProviderUseCase>(TYPES.DeleteProviderUseCase).to(DeleteProviderUseCase);
container.bind<ProviderController>(TYPES.ProviderController).to(ProviderController);
container.bind<AddProviderModelUseCase>(TYPES.AddProviderModelUseCase).to(AddProviderModelUseCase);

export { container };
