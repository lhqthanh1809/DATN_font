import { reference } from "@/assets/reference";
import { convertToNumber, formatNumber } from "@/helper/helper";
import { ServiceFactory } from "@/services/Service/ServiceFactory";
import ServiceManagerService from "@/services/Service/ServiceManagerService";
import UnitService from "@/services/Unit/UnitService";
import useContractStore from "@/store/contract/useContractStore";
import useEndContractStore from "@/store/contract/useEndContractStore";
import useLodgingServiceStore from "@/store/lodgingService/useLodgingServiceStore";
import Box from "@/ui/Box";
import Button from "@/ui/Button";
import DatePicker from "@/ui/Datepicker";
import Divide from "@/ui/Divide";
import Input from "@/ui/Input";
import Label from "@/ui/Label";
import LoadingAnimation from "@/ui/LoadingAnimation";
import { Href, router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";

const BoxServiceUsage:React.FC<{
  totalService: number;
  setTotalService: (value: number) => void;
  isMonthBilling: boolean
}> = ({ totalService, setTotalService, isMonthBilling })=>{
  const [amountReduce, setAmountReduce] = useState("0");
  const { endDate } = useEndContractStore();
  const { contract } = useContractStore();
  const { loading, services, fetchServiceByRoom } = useLodgingServiceStore();
  const unitService = new UnitService();
  const serviceManagerService = new ServiceManagerService();

  const serviceHasFormat = useMemo(() => {
    if (!contract) return [];
    return services.map((service) => ({
      ...service,
      ...ServiceFactory.createService(
        service,
        contract,
        endDate,
        isMonthBilling
      ).getDisplayValue(),
    }));
  }, [contract, services, endDate, isMonthBilling]);


  const totalPrice = useMemo(() => {
    return serviceHasFormat.reduce((sum, service) => sum + service.price, 0);
  }, [serviceHasFormat]);

  useEffect(() => {
    if (!contract) return;
    fetchServiceByRoom(contract?.room_id);
  }, [contract]);


  useEffect(() => {
    setTotalService(totalPrice - (formatNumber(amountReduce, "float") ?? 0))
  }, [totalPrice, amountReduce])

  return (
    <Box
      title="Thu tiền dịch vụ khi kết thúc hợp đồng"
      description="Chốt mức khách sử dụng để tính tiền"
    >
      {/* <Input
        value={amountReduce.toString()}
        type="number"
        label="Giảm trừ tiền phòng"
        suffix={<Label label="đ" />}
        onChange={(amount) => {
          setAmountReduce(amount || "0");
        }}
      /> */}

      <View className="gap-1">
        <View className="border-1 border-mineShaft-100 p-2 rounded-xl gap-2">
          {loading ? (
            <LoadingAnimation />
          ) : serviceHasFormat.length <= 0 ? (
            <View className="items-center">
              <Text className="font-BeVietnamRegular text-mineShaft-300 items-center">
                Hiện không hỗ trợ dịch vụ
              </Text>
            </View>
          ) : (
            serviceHasFormat.map((service, index) => (
              <View
                key={index}
                className="flex-col justify-between gap-2 border-1 border-mineShaft-100 p-3 rounded-lg"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="font-BeVietnamMedium">
                    {service.service
                      ? serviceManagerService.getReferenceService(
                          service.service
                        ).name
                      : service.name}
                  </Text>
                  <Text className="font-BeVietnamRegular">
                    {convertToNumber(service.price_per_unit.toString())}{" "}
                    {service.unit
                      ? unitService.getUnitSuffix("đồng", service.unit)
                      : reference.undefined.name}
                  </Text>
                </View>

                <Divide className="h-0.25 bg-lime-400" />

                <View className="flex-row items-center justify-between">
                  <Text className="font-BeVietnamRegular text-12">
                    {service.displayValue}
                  </Text>

                  <Text className="font-BeVietnamMedium">
                    Tổng tiền: {convertToNumber(service.price.toString())} đ
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {!loading && services.length > 0 && services.some(item => !item.unit?.is_fixed) && (
          <Button className="bg-lime-400 p-2" onPress={() => router.push('/lodging_service/instant_service' as Href)}>
            <Text className="font-BeVietnamMedium text-mineShaft-950">
              Chốt dịch vụ
            </Text>
          </Button>
        )}
      </View>

      <View className="bg-lime-50 px-4 py-2 rounded-xl border-1 border-lime-200 gap-2 items-end">
        <View className="items-end gap-1">
          <Text className="font-BeVietnamSemiBold text-14 text-lime-800">{`Thành tiền`}</Text>
          <Text className="font-BeVietnamRegular text-14 text-mineShaft-950">{`${convertToNumber(
            (totalService).toString()
          )} đ`}</Text>
        </View>
      </View>
    </Box>
  );
}

export default BoxServiceUsage;
