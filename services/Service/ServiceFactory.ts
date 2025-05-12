import { IContract } from "@/interfaces/ContractInterface";
import { ILodgingService } from "@/interfaces/LodgingServiceInterface";
import { IService } from "@/interfaces/ServiceInterface";
import { FixedService } from "./FixedService";
import { VariableService } from "./VariableService";

export class ServiceFactory {
    static createService(service: ILodgingService & { current_value: any }, contract: IContract, endDate: Date, isMonth?: boolean): IService {
        if (service.unit?.is_fixed) {
            return new FixedService(contract, service ,endDate, isMonth);
        } else {
            return new VariableService(service, contract);
        }
    }
}
