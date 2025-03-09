import { reference } from "@/assets/reference";
import { convertToNumber } from "@/helper/helper";
import { IRoom } from "@/interfaces/RoomInterface";
import ServiceManagerService from "@/services/Service/ServiceManagerService";
import UnitService from "@/services/Unit/UnitService";
import Box from "@/ui/box";
import Icon from "@/ui/icon";
import React from "react";
import { ScrollView, Text, View } from "react-native";

const BoxServiceDetail: React.FC<{
  services: IRoom["room_services"];
}> = ({ services }) => {
  const unitService = new UnitService();
  const serviceManagerService = new ServiceManagerService();

  return (
    <Box title="Dịch vụ phòng sử dụng">
      <View className=" rounded-lg items-center gap-2">
        {services && services.length > 0 ? (
          services.map((service, index) => (
            <View
              key={index}
              className="w-full border-1 border-lime-500 rounded-xl px-4 py-1 flex-row items-center justify-between"
            >
              <View className="flex-row gap-3 py-1 items-center">
                <View className="bg-lime-500 rounded-full p-2">
                  <Icon
                    className="text-white-50"
                    icon={
                      service.lodging_service.service
                        ? serviceManagerService.getReferenceService(
                            service.lodging_service.service
                          ).icon
                        : reference.other.icon
                    }
                  />
                </View>
                <View className="gap-1">
                  <Text className="font-BeVietnamMedium text-14 text-mineShaft-900">
                    {service.lodging_service.service
                      ? serviceManagerService.getReferenceService(
                          service.lodging_service.service
                        ).name
                      : service.lodging_service.name}
                  </Text>
                  <Text className="font-BeVietnamMedium text-12 text-mineShaft-500">
                    {`${new Intl.NumberFormat("vi-VN").format(
                      Number(service.lodging_service.price_per_unit)
                    )} ${
                      service.lodging_service.unit
                        ? unitService.getUnitSuffix(
                            "đồng",
                            service.lodging_service.unit
                          )
                        : reference.undefined.name
                    }`}
                  </Text>
                </View>
              </View>
              {service.lodging_service.unit &&
                !service.lodging_service.unit.is_fixed && (
                  <View className="bg-lime-200 py-1 px-3 rounded-full">
                    <Text className="font-BeVietnamMedium text-12 text-mineShaft-900">{`Số hiện tại: ${convertToNumber(
                      service.last_recorded_value?.toString() ?? "0"
                    )}`}</Text>
                  </View>
                )}
            </View>
          ))
        ) : (
          <View>
            <Text className="font-BeVietnamRegular text-mineShaft-300">Phòng trọ không sử dụng dịch vụ</Text>
          </View>
        )}
      </View>
    </Box>
  );
};

export default BoxServiceDetail;
