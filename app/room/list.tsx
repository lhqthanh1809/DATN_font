import { constant } from "@/assets/constant";
import { reference } from "@/assets/reference";
import { cn, convertToNumber } from "@/helper/helper";
import { useGeneral } from "@/hooks/useGeneral";
import { IRoom } from "@/interfaces/RoomInterface";
import RoomService from "@/services/Room/RoomService";
import Button from "@/ui/button";
import ViewHasButtonAdd from "@/ui/layout/add_button";
import HeaderBack from "@/ui/layout/header";
import { useRouter } from "expo-router";
import { isArray } from "lodash";
import { Skeleton } from "moti/skeleton";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

function ListRoom() {
  const { lodging } = useGeneral();
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const route = useRouter();

  const fetchService = useCallback(async () => {
    if (!lodging || !lodging.id) return;
    setLoading(true);
    const service = new RoomService(lodging.id);
    const data = await service.listByLodging();
    if (isArray(data)) {
      setRooms(data);
    }
    setLoading(false);
  }, [lodging]);

  useEffect(() => {
    fetchService();
  }, []);

  return (
    <View className="flex-1">
      <HeaderBack title="Danh sách phòng trọ" />
      <ViewHasButtonAdd
        onPressAdd={() => {
          route.push("/room/create");
        }}
      >
        <ScrollView className="px-3 flex-grow bg-white-50">
          <View className="gap-3 items-center py-3 flex-1">
            {loading
              ? Array(4)
                  .fill("")
                  .map((_, index) => (
                    <View
                      key={index}
                      className="w-full bg-white-100 rounded-md flex-row px-3 py-4 gap-4 items-center"
                    >
                      <View className="gap-2">
                        <Skeleton width={"50%"} height={22} colorMode="light" />
                        <Skeleton width={"70%"} height={20} colorMode="light" />
                      </View>
                    </View>
                  ))
              : rooms.map((room, index) => (
                  <Button
                    key={index}
                    className="bg-lime-200 w-full justify-between items-start px-3 py-4 gap-2 items-center"
                  >
                    <View className="flex  gap-2">
                      <View className="gap-2 flex-row items-center">
                        {/* Mã phòng */}
                        <Text className="font-BeVietnamSemiBold text-16 text-mineShaft-900">
                          {room.room_code}
                        </Text>

                        {/* Số lượng */}
                        <View className="bg-lime-50 rounded-full px-5 py-1">
                          <Text className="font-BeVietnamMedium text-14 text-lime-900">
                            {`${room.current_tenants}/${room.max_tenants}`}
                          </Text>
                        </View>
                      </View>
                      <Text className="font-BeVietnamMedium text-14 text-lime-900">
                        {`${convertToNumber(room.price?.toString() ?? "0")} đ`}
                      </Text>
                    </View>
                    <View
                      className={cn(
                        "rounded-full py-2 px-3",
                        room.status === constant.room.status.filled
                          ? "bg-lime-100"
                          : room.status === constant.room.status.fixing
                          ? "bg-yellow-100"
                          : "bg-red-100"
                      )}
                    >
                      <Text
                        className={cn(
                          "font-BeVietnamRegular text-center",
                          room.status === constant.room.status.filled
                            ? "text-lime-600"
                            : room.status === constant.room.status.fixing
                            ? "text-yellow-600"
                            : "text-red-600"
                        )}
                      >
                        {room.status
                          ? (
                              reference.room.status as {
                                [key: number]: { name: string };
                              }
                            )[room.status]?.name
                          : reference.undefined.name}
                      </Text>
                    </View>
                  </Button>
                ))}
          </View>
        </ScrollView>
      </ViewHasButtonAdd>
    </View>
  );
}

export default ListRoom;
