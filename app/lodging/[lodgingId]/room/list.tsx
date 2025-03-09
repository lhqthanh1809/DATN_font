import { constant } from "@/assets/constant";
import { reference } from "@/assets/reference";
import { cn } from "@/helper/helper";
import { useUI } from "@/hooks/useUI";
import { IRoom } from "@/interfaces/RoomInterface";
import RoomService from "@/services/Room/RoomService";
import Button from "@/ui/button";
import Divide from "@/ui/divide";
import Icon from "@/ui/icon";
import { Edit } from "@/ui/icon/active";
import { Show } from "@/ui/icon/edit";
import { CrossMedium, Document, File, FileAdd, Home2 } from "@/ui/icon/symbol";
import ViewHasButtonAdd from "@/ui/layout/add_button";
import HeaderBack from "@/ui/layout/header";
import RoomItem from "@/ui/layout/room_item";
import {
  Href,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { isArray } from "lodash";
import { Skeleton } from "moti/skeleton";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

function ListRoom() {
  const { showModal, hideModal } = useUI();
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const route = useRouter();
  const { lodgingId } = useLocalSearchParams();

  const showAction = useCallback(
    (room: IRoom) => {
      const activeRoomSelect = [
        {
          title: "Xem thông tin chi tiết phòng",
          icon: Show,
          url: `/lodging/${lodgingId}/room/detail/${room.id}`,
        },
        {
          title: "Chỉnh sửa thông tin phòng",
          icon: Edit,
          url: `/lodging/${lodgingId}/room/edit/${room.id}?router_from=list`,
        },
        {
          title: "Quản lý hợp đồng",
          icon: File,
          url: `/lodging/${lodgingId}/room/edit/${room.id}?router_from=list`,
        },
        ...(room.status !== constant.room.status.filled &&
        typeof room.current_tenants == "number" &&
        room.current_tenants < room.max_tenants
          ? [
              {
                title: "Lập hợp đồng cho thuê mới",
                icon: FileAdd,
                url: `/contract/create/${room.id}?name=${room.room_code}&price=${room.price}`,
              },
            ]
          : []),
      ];
      showModal(
        <Pressable
          onPress={() => {}}
          className="absolute bottom-0 bg-white-50 rounded-xl py-4 gap-4 w-full"
        >
          <View className="px-4 flex-row items-center justify-between">
            <View className="gap-3 flex-row items-center">
              <View className="bg-lime-500 p-2 rounded-full">
                <Icon icon={Home2} className="text-white-50" />
              </View>
              <View className="gap-1">
                <Text className="text-mineShaft-950 font-BeVietnamBold text-16">
                  {room.room_code}
                </Text>
                <Text className="font-BeVietnamRegular text-mineShaft-600 text-14">
                  Thao tác phòng
                </Text>
              </View>
            </View>
            <Button className="bg-mineShaft-400 p-2" onPress={hideModal}>
              <Icon icon={CrossMedium} className="text-white-50" />
            </Button>
          </View>
          <Divide direction="horizontal" className="h-[1]" />
          {/* Trạng thái */}
          <View className="px-2">
            <View
              className={cn(
                "rounded-xl py-3",
                room.status === constant.room.status.filled
                  ? "bg-white-50"
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
                {`Trạng thái  `}
                <Text
                  className={cn(
                    "font-BeVietnamSemiBold text-center",
                    room.status === constant.room.status.filled
                      ? "text-lime-600"
                      : room.status === constant.room.status.fixing
                      ? "text-yellow-600"
                      : "text-red-600"
                  )}
                >
                  {`"${
                    room.status
                      ? (
                          reference.room.status as {
                            [key: number]: { name: string };
                          }
                        )[room.status]?.name
                      : reference.undefined.name
                  }"`}
                </Text>
              </Text>
            </View>
          </View>
          <View className="w-full px-2 gap-2">
            {activeRoomSelect.map((item, index) => (
              <Button
                className="justify-start border-1 px-4 py-3 rounded-xl border-lime-500 gap-3"
                key={index}
                onPress={() => {
                  route.push(item.url as any);
                  hideModal();
                }}
              >
                <Icon icon={item.icon} />
                <Text className="font-BeVietnamMedium text-mineShaft-800 text-14">
                  {item.title}
                </Text>
              </Button>
            ))}
          </View>
        </Pressable>
      );
    },
    [lodgingId]
  );

  const fetchRoom = useCallback(async () => {
    setLoading(true);
    const service = new RoomService(lodgingId as string);
    const data = await service.listByLodging();
    if (isArray(data)) {
      setRooms(data);
    }
    setLoading(false);
  }, [lodgingId]);

  useFocusEffect(
    useCallback(() => {
      fetchRoom();
    }, [])
  );

  return (
    <View className="flex-1 bg-white-50">
      <HeaderBack title="Danh sách phòng trọ" />
      <ViewHasButtonAdd
        onPressAdd={() => {
          route.push(`lodging/${lodgingId}/room/create` as Href);
        }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          className="px-3 flex-grow bg-white-50"
        >
          <View className="gap-2 items-center py-3 flex-1">
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
                  <RoomItem
                    item={room}
                    key={index}
                    onPress={() => showAction(room)}
                  />
                ))}
          </View>
        </ScrollView>
      </ViewHasButtonAdd>
    </View>
  );
}

export default ListRoom;
