import { IService } from "@/interfaces/ServiceInterface";
import { calculateDuration, getFromDate } from "@/helper/helper";
import { reference } from "@/assets/reference";
import { IContract } from "@/interfaces/ContractInterface";
import { ILodgingService } from "@/interfaces/LodgingServiceInterface";
import { constant } from "@/assets/constant";
import { Text } from "react-native";
import moment from "moment";
import { ReactNode } from "react";

export class FixedService implements IService {
  constructor(
    private contract: IContract,
    private service: ILodgingService,
    private endDate: Date
  ) {}

  getDisplayValue() : {
    displayValue: ReactNode,
    price: number
  } {
    if (this.service.unit?.name === constant.unit.name.person) {
      return {
        displayValue: (
          <>
            <Text className="text-redPower-600 font-BeVietnamSemiBold">
              {`${this.contract.quantity} `}
            </Text>
            người
          </>
        ),
        price: this.service.price_per_unit * this.contract.quantity,
      };
    }

    if (this.service.unit?.name === constant.unit.name.month) {
      const duration = calculateDuration(
        getFromDate(this.service.payment_date ?? 1),
        this.endDate
      );
      return {
        displayValue: (
          <>
            {duration.months > 0 && (
              <>
                <Text className="text-redPower-600 font-BeVietnamSemiBold">
                  {`${duration.months} `}
                </Text>
                tháng,
              </>
            )}
            <Text className="text-redPower-600 font-BeVietnamSemiBold">
              {` ${duration.days} `}
            </Text>
            ngày
          </>
        ),
        price: this.calculatorPriceTotal(duration),
      };
    }
    return {
        displayValue: null,
        price: 0
    };
  }

  private calculatorPriceTotal(duration: any) {
    const pricePerMonth =
      (this.service.price_per_unit / (this.contract?.room?.current_tenants ?? 1)) *
      (this.contract?.quantity ?? 1); 
    const dayInMonth = moment(this.endDate).daysInMonth();
    const pricePerDay = pricePerMonth / dayInMonth;

    return pricePerMonth * duration.months + pricePerDay * duration.days;
  }
}
