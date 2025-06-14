import { formatDateForRequest } from "@/helper/helper";
import { IRoom } from "@/interfaces/RoomInterface";
import FilterRoom from "@/pages/Contract/filterRoom";
import RoomService from "@/services/Room/RoomService";
import HeaderBack from "@/ui/components/HeaderBack";
import RoomItem from "@/ui/components/RoomItem";
import { Home2 } from "@/ui/icon/symbol";
import EmptyScreen from "@/ui/layouts/EmptyScreen";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { isArray } from "lodash";
import { Skeleton } from "moti/skeleton";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";

function Holding() {
  const { lodgingId } = useLocalSearchParams();
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [quantity, setQuantity] = useState(1);
  const [leaseDuration, setLeaseDuration] = useState(1);
  const [loading, setLoading] = useState(false);
  const route = useRouter();

  const filterBase64Url = useMemo(() => {
    const field = JSON.stringify({
      start_date: startDate,
      lease_duration: leaseDuration,
      quantity: quantity,
    });

    return btoa(field)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }, [startDate, quantity, leaseDuration]);

  const fetchRoom = useCallback(
    async ({
      startDate,
      quantity,
      leaseDuration,
    }: {
      startDate?: Date;
      quantity: number;
      leaseDuration: number;
    }) => {
      setLoading(true);
      const service = new RoomService(lodgingId as string);
      const data = await service.filter({
        lodging_id: lodgingId as string,
        lease_duration: leaseDuration,
        quantity: quantity,
        ...(startDate && {
          start_date: formatDateForRequest(startDate),
        }),
      });
      if (isArray(data)) {
        setRooms(data);
      }
      setLoading(false);
    },
    [lodgingId]
  );

  // useEffect(() => console.log(quantity), [quantity])
  useFocusEffect(
    useCallback(() => {
      fetchRoom({ startDate, quantity, leaseDuration });
    }, [])
  );
  return (
    <View className="flex-1 bg-white-50">
      <HeaderBack title="Cọc giữ chỗ" />
      <FilterRoom
        onFilter={({ startDate, quantity, leaseDuration }) =>
          fetchRoom({ startDate, quantity, leaseDuration })
        }
        {...{
          leaseDuration,
          setLeaseDuration,
          startDate,
          setStartDate,
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
          <View className="gap-2 items-center pt-1 pb-3 flex flex-1">
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
                      route.push(
                        `lodging/${lodgingId}/contract/holding/${room.id}?name=${room.room_code}&price=${room.price}&filter=${filterBase64Url}` as any
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

export default Holding;
