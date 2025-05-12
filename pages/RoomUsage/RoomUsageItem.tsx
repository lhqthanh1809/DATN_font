import { View, Text } from "react-native";
import { cn, convertToNumber } from "@/helper/helper";
import { IRoomServiceInvoice } from "@/interfaces/RoomServiceInvoiceInterface";
import ServiceManagerService from "@/services/Service/ServiceManagerService";
import { reference } from "@/assets/reference";
import Divide from "@/ui/Divide";
import Icon from "@/ui/Icon";
import Input from "@/ui/Input";
import Button from "@/ui/Button";
import { MotiView } from "moti";
import { Pressable } from "react-native-gesture-handler";

interface ItemRoomUsageProps {
  roomUsage: IRoomServiceInvoice;
  active: string | null;
  setActive: (id: string) => void;
  value: string;
  setValue: (value: string) => void;
  onCloseService: (id: string, currentValue: number) => void;

  loadingProcess: boolean;
}

const serviceManagerService = new ServiceManagerService();

const ItemRoomUsage: React.FC<ItemRoomUsageProps> = ({
  roomUsage,
  active,
  setActive,
  value,
  setValue,
  onCloseService,
  loadingProcess,
}) => {
  const service = roomUsage.lodging_service?.service
    ? serviceManagerService.getReferenceService(
        roomUsage.lodging_service.service
      )
    : reference.other;

  const isActive = roomUsage.id === active;
  const currentValue = roomUsage.final_index ?? roomUsage.initial_index ?? 0;

  return (
    <MotiView
      key={roomUsage.id}
      from={{ opacity: 0, translateY: 20, translateX: 0 }}
      animate={{ opacity: 1, translateY: 0, translateX: 0 }}
      exit={{ opacity: 0, translateY: 0, translateX: 300 }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 120,
      }}
      exitTransition={{
        type: "timing",
        duration: 400,
      }}
    >
      <Button
        className={cn(
          "w-full bg-white-50 rounded-xl p-4 border-1 flex-col items-start gap-2 ",
          isActive ? "border-white-100" : "border-mineShaft-100"
        )}
        style={{
          shadowColor: isActive ? "#000" : "transparent",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isActive ? 0.1 : 0,
          shadowRadius: isActive ? 4 : 0,
          elevation: isActive ? 4 : 0,
        }}
        onPress={() => {
          !loadingProcess && setActive(roomUsage.id);
        }}
      >
        <View className="flex-row gap-4 w-full items-center">
          <View className="border-1 items-stretch px-6 py-3 rounded-md border-white-200 gap-2">
            <View>
              <Text className="font-BeVietnamMedium text-mineShaft-600 text-center">
                Tháng
              </Text>
              <Text
                className={cn(
                  "font-BeVietnamBold text-3xl text-center text-lime-600"
                )}
              >
                {roomUsage.month_billing}
              </Text>
            </View>
            <View className="">
              <Divide className="h-1 w-full bg-lime-800" />
            </View>
            <Text className="font-BeVietnamMedium text-center text-mineShaft-950">
              {roomUsage.year_billing}
            </Text>
          </View>

          <View className="gap-3 flex-1">
            <View className="flex-row gap-2 items-center">
              <View className="bg-lime-400 p-2 rounded-full">
                <Icon icon={service.icon} className="text-white-50" />
              </View>
              <View className="gap-1">
                <Text className="font-BeVietnamMedium text-12 text-mineShaft-400">
                  Phòng {roomUsage.room?.room_code}
                </Text>
                <Text className="font-BeVietnamMedium">
                  {roomUsage.lodging_service?.service
                    ? serviceManagerService.getReferenceService(
                        roomUsage.lodging_service.service
                      ).name
                    : roomUsage.lodging_service?.name}
                </Text>
              </View>
            </View>

            <View className="gap-2">
              {isActive && (
                <Input
                  onChange={(text) => setValue(text)}
                  placeHolder="Nhập chỉ số mới"
                  type="number"
                  value={value}
                  className="h-9"
                />
              )}

              <View className="gap-4 flex-row">
                <View className="gap-2 flex-row items-center">
                  <Text className="font-BeVietnamMedium text-12 text-mineShaft-400">
                    Chỉ số hiện tại:
                  </Text>
                  <Text className="font-BeVietnamMedium">
                    {convertToNumber(currentValue.toString())}
                  </Text>
                </View>
                {isActive && (
                  <Button
                    disabled={!value ||loadingProcess}
                    loading={loadingProcess}
                    className="bg-lime-500 flex-1 py-2"
                    onPress={() => {
                      onCloseService(roomUsage.id, currentValue);
                    }}
                  >
                    <Text className="font-BeVietnamMedium text-white-50">
                      Chốt chỉ số
                    </Text>
                  </Button>
                )}
              </View>
            </View>
          </View>
        </View>
      </Button>
    </MotiView>
  );
};

export default ItemRoomUsage;
