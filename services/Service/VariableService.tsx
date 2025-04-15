import { convertToNumber, formatNumber } from "@/helper/helper";
import { IContract } from "@/interfaces/ContractInterface";
import { ILodgingService } from "@/interfaces/LodgingServiceInterface";
import { IService } from "@/interfaces/ServiceInterface";
import { ReactNode } from "react";
import { Text } from "react-native";

export class VariableService implements IService {
  constructor(
    private service: ILodgingService & {
      current_value: any;
    },
    private contract: IContract
  ) {}

  getDisplayValue(): {
    displayValue: ReactNode;
    price: number;
  } {

    const lastRecorded =
      this.service.room_services?.find(
        (item) => item.room_id === this.contract.room_id
      )?.last_recorded_value ?? 0;

    let currentValue = this.service.current_value;

    currentValue = typeof currentValue === "string" ? formatNumber(currentValue, "float") : currentValue 


    return {
      displayValue: (
        <>
          Chỉ số:
          <Text className="text-redPower-600 font-BeVietnamSemiBold">
            {` ${convertToNumber(lastRecorded.toString())} `}
          </Text>
          -
          <Text className="text-redPower-600 font-BeVietnamSemiBold">
            {` ${convertToNumber(currentValue.toString())}`}
          </Text>
        </>
      ),
      price:
        (((currentValue - lastRecorded) * this.service.price_per_unit) /
          ((this.contract.room?.current_tenants) ?? 1)) *
        this.contract.quantity,
    };
  }
}
