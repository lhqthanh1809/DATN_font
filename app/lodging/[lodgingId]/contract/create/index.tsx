import { constant } from "@/assets/constant";
import { IRoom } from "@/interfaces/RoomInterface";
import FilterRoom from "@/pages/Contract/filterRoom";
import RoomService from "@/services/Room/RoomService";
import HeaderBack from "@/ui/components/HeaderBack";
import RoomItem from "@/ui/components/RoomItem";
import { Home2 } from "@/ui/icon/symbol";
import EmptyScreen from "@/ui/layouts/EmptyScreen";
import { router, useLocalSearchParams } from "expo-router";
import { isArray } from "lodash";
import { Skeleton } from "moti/skeleton";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";

function Create() {
  const { lodgingId } = useLocalSearchParams();
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [leaseDuration, setLeaseDuration] = useState(1);

  const filterBase64Url = useMemo(() => {
    const field = JSON.stringify({
      lease_duration: leaseDuration,
      quantity: quantity,
    });

    return btoa(field)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }, [quantity, leaseDuration]);

  const fetchRoom = useCallback(
    async ({
      quantity,
      leaseDuration,
    }: {
      quantity: number;
      leaseDuration: number;
    }) => {
      setLoading(true);
      const service = new RoomService(lodgingId as string);
      const data = await service.filter({
        lease_duration: leaseDuration,
        lodging_id: lodgingId as string,
        quantity: quantity,

        status: constant.room.status.unfilled,
      });
      if (isArray(data)) {
        setRooms(data);
      }
      setLoading(false);
    },
    [lodgingId]
  );

  useEffect(() => {
    fetchRoom({ leaseDuration, quantity });
  }, []);

  return (
    <View className="flex-1 bg-white-50">
      <HeaderBack title="Lập hợp đồng thuê phòng" />
      <FilterRoom
        onFilter={({ quantity, leaseDuration }) =>
          fetchRoom({ quantity, leaseDuration })
        }
        {...{
          leaseDuration,
          setLeaseDuration,
          quantity,
          setQuantity,
        }}
      />
      {!loading && rooms.length <= 0 ? (
        <EmptyScreen
          icon={Home2}
          description="Hãy thử thay đổi bộ lọc hoặc kiểm tra lại kết nối mạng."
          title="Không tìm thấy phòng nào"
        />
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
                        `/lodging/${lodgingId}/contract/create/${room.id}?name=${room.room_code}&price=${room.price}&filter=${filterBase64Url}` as any
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
