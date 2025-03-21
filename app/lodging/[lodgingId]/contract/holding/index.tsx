import { formatDateForRequest } from "@/helper/helper";
import { IRoom } from "@/interfaces/RoomInterface";
import FilterRoom from "@/pages/Contract/filterRoom";
import RoomService from "@/services/Room/RoomService";
import HeaderBack from "@/ui/layout/HeaderBack";
import RoomItem from "@/ui/layout/RoomItem";
import { useLocalSearchParams, useRouter } from "expo-router";
import { isArray } from "lodash";
import { Skeleton } from "moti/skeleton";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

function Holding() {
  const { lodgingId } = useLocalSearchParams();
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [quantity, setQuantity] = useState(1);
  const [leaseDuration, setLeaseDuration] = useState(1);
  const [loading, setLoading] = useState(false);
  const route = useRouter();

  const filterBase64Url = useCallback(() => {
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
      startDate: Date;
      quantity: number;
      leaseDuration: number;
    }) => {
      setLoading(true);
      const service = new RoomService(lodgingId as string);
      const data = await service.filter({
        lodging_id: lodgingId as string,
        start_date: formatDateForRequest(startDate),
        lease_duration: leaseDuration,
        quantity: quantity,
      });
      if (isArray(data)) {
        setRooms(data);
      }
      setLoading(false);
    },
    [lodgingId]
  );

  // useEffect(() => console.log(quantity), [quantity])
  useEffect(() => {
    fetchRoom({ startDate, quantity, leaseDuration });
  }, []);
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
        <View className="w-full flex-1 items-center justify-center">
          <Text className="font-BeVietnamRegular text-mineShaft-200">
            Hiện không có phòng phù hợp
          </Text>
        </View>
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
                        `lodging/${lodgingId}/contract/holding/${room.id}?name=${room.room_code}&price=${room.price}&filter=${filterBase64Url()}` as any
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
