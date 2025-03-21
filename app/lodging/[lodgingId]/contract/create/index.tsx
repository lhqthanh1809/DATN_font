import { constant } from "@/assets/constant";
import { IRoom } from "@/interfaces/RoomInterface";
import RoomService from "@/services/Room/RoomService";
import HeaderBack from "@/ui/layout/HeaderBack";
import RoomItem from "@/ui/layout/RoomItem";
import { router, useLocalSearchParams } from "expo-router";
import { isArray } from "lodash";
import { Skeleton } from "moti/skeleton";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

function Create() {
  const {lodgingId} = useLocalSearchParams()
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchService = useCallback(async () => {
    setLoading(true);
    const service = new RoomService(lodgingId as string);
    const data = await service.listByLodging({
      status: constant.room.status.unfilled,
    });
    if (isArray(data)) {
      setRooms(data);
    }
    setLoading(false);
  }, [lodgingId]);

  useEffect(() => {
    fetchService();
  }, []);
  return (
    <View
      className="flex-1 bg-white-50"
    >
      <HeaderBack title="Lập hợp đồng thuê phòng" />
      {!loading && rooms.length <= 0 ? (
        <View className="w-full flex-1 items-center justify-center">
          <Text className="font-BeVietnamRegular text-mineShaft-200">
            Hiện không có phòng phù hợp
          </Text>
        </View>
      ) : (
        <ScrollView className="px-2 flex-1">
          <View className="gap-2 items-center py-3 flex flex-1">
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
              : rooms.length > 0 &&
                rooms.map((room, index) => (
                  <RoomItem
                    item={room}
                    key={index}
                    onPress={() =>
                      room.id &&
                      router.push(
                        `/lodging/${lodgingId}/contract/create/${room.id}?name=${room.room_code}&price=${room.price}` as any
                      )
                    }
                  />
                ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

export default Create;
