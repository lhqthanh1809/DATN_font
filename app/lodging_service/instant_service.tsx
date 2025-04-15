import { reference } from "@/assets/reference";
import { cn, convertToNumber } from "@/helper/helper";
import { IContract } from "@/interfaces/ContractInterface";
import { ILodgingService } from "@/interfaces/LodgingServiceInterface";
import ServiceManagerService from "@/services/Service/ServiceManagerService";
import useContractStore from "@/store/contract/useContractStore";
import useLodgingServiceStore from "@/store/lodgingService/useLodgingServiceStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import Input from "@/ui/Input";
import HeaderBack from "@/ui/components/HeaderBack";
import { router } from "expo-router";
import { useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

interface ServiceItemProps {
  item: ILodgingService & {
    current_value: any;
  };
  contract: IContract | null;
  setCurrentValue: (id: string, value: string) => void;
}

const serviceManagerService = new ServiceManagerService();

function ServiceItem({ item, contract, setCurrentValue }: ServiceItemProps) {
  const service = item.service
    ? serviceManagerService.getReferenceService(item.service)
    : reference.other;

  return (
    <Button
      key={item.id}
      className={cn(
        "w-full bg-white-50 rounded-xl p-4 border-1 flex-col items-start gap-2 border-mineShaft-100"
      )}
    >
      <View className="flex-row gap-4 w-full items-center">
        <View className="gap-3 flex-1">
          <View className="flex-row items-center justify-between">
            <View className="flex-row gap-2 items-center">
              <Icon icon={service.icon} className="text-lime-500" />
              <View className="gap-1">
                <Text className="font-BeVietnamMedium text-16">
                  {service.name || item.name}
                </Text>
              </View>
            </View>

            <View className="gap-4 flex-row">
              <View className="gap-2 flex-row items-center">
                <Text className="font-BeVietnamMedium text-12 text-mineShaft-400">
                  Chỉ số hiện tại:
                </Text>
                <Text className="font-BeVietnamMedium">
                  {convertToNumber(
                    (
                      item.room_services?.find(
                        (service) => service.room_id === contract?.room_id
                      )?.last_recorded_value ?? 0
                    ).toString()
                  )}
                </Text>
              </View>
            </View>
          </View>

          <View className="gap-2">
            <Input
              label="Chỉ số mới"
              onChange={(text) => setCurrentValue(item.id ?? "", text || "0")}
              placeHolder="Nhập chỉ số mới"
              type="number"
              value={item.current_value.toString()}
              className="h-11"
            />
          </View>
        </View>
      </View>
    </Button>
  );
}

function InstantService() {
  const { services, setCurrentValue } = useLodgingServiceStore();
  const { contract } = useContractStore();

  const indexServices = useMemo(
    () => services.filter((service) => !service.unit?.is_fixed),
    [services]
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
    >
      <View className="flex-1 ">
        <HeaderBack title="Chốt dịch vụ" />
        <ScrollView className="flex-1 px-3">
          <View className="py-3 gap-2">
            {indexServices.map((item) => (
              <ServiceItem
                key={item.id}
                item={item}
                contract={contract}
                setCurrentValue={setCurrentValue}
              />
            ))}
          </View>
        </ScrollView>

        <View className="p-3 flex bg-white-50 gap-2">
          <Button onPress={() => router.back()} className="bg-lime-400 py-3">
            <Text className="text-mineShaft-900 font-BeVietnamSemiBold">
              Chốt dịch vụ
            </Text>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default InstantService;
