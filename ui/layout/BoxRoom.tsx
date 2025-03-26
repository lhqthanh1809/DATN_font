import { cn } from "@/helper/helper";
import { IRoom } from "@/interfaces/RoomInterface";
import RoomService from "@/services/Room/RoomService";
import Box from "@/ui/Box";
import Button from "@/ui/Button";
import CheckBox from "@/ui/Checkbox";
import LoadingAnimation from "@/ui/LoadingAnimation";
import { isArray } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

const BoxRoom: React.FC<{
  selectRooms: IRoom[];
  setSelectRooms: (rooms: IRoom[]) => void;
  rooms: IRoom[];
  setRooms: (rooms: IRoom[]) => void;

  lodgingId: string;
}> = ({ selectRooms, rooms, setRooms, setSelectRooms, lodgingId }) => {
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(true);
  const fetchRoom = useCallback(async () => {
    setLoading(true);
    const service = new RoomService(lodgingId);
    const data = await service.listByLodging();
    if (isArray(data)) {
      setRooms(data);
    }
    setLoading(false);
  }, [lodgingId]);

  const toggleRoom = useCallback(
    (room: IRoom) => {
      const isSelected = selectRooms.some((item) => item.id === room.id);

      const rooms = isSelected
        ? selectRooms.filter((item) => item.id !== room.id)
        : [...selectRooms, room];

      setSelectRooms(rooms);
    },
    [selectRooms]
  );

  const toggleAll = useCallback(() => {
    setSelectRooms(selectRooms.length == rooms.length ? [] : rooms);
  }, [rooms, selectRooms]);

  useEffect(() => {
    if (rooms.length <= 0 && flag) {
      setFlag(false);
      fetchRoom();
    }
  }, [rooms]);

  return (
    <Box
      title="Danh sách phòng"
      className="z-10"
      suffix={
        rooms.length > 0 && (
          <Button onPress={() => toggleAll()} className="gap-2">
            <CheckBox
              checked={!loading && selectRooms.length == rooms.length}
            />
            <Text className="font-BeVietnamRegular text-14">
              {!loading && selectRooms.length == rooms.length
                ? "Bỏ tất cả"
                : "Chọn tất cả"}
            </Text>
          </Button>
        )
      }
    >
      {loading ? (
        <LoadingAnimation />
      ) : rooms.length <= 0 ? (
        <View className="py-1 items-center">
          <Text className="font-BeVietnamRegular text-mineShaft-300">
            Hiện không có phòng
          </Text>
        </View>
      ) : (
        <ScrollView className="flex">
          <View className="flex-row gap-2 flex-wrap max-h-96">
            {rooms.map((room, index) => {
              const checked = selectRooms.some((item) => item.id === room.id);
              return (
                <Button
                  key={index}
                  onPress={() => toggleRoom(room)}
                  className={cn(
                    "border-1 bg-lime-200 border-lime-400 py-3 px-5 gap-2 flex-1 basis-[fit-content]",
                    checked
                      ? "bg-lime-200 border-lime-400"
                      : "bg-white-50 border-mineShaft-200"
                  )}
                >
                  <CheckBox checked={checked} />
                  <Text className="font-BeVietnamMedium text-14">
                    {room.room_code}
                  </Text>
                </Button>
              );
            })}
          </View>
        </ScrollView>
      )}
    </Box>
  );
};

export { BoxRoom };
