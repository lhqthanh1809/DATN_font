import { ILodging } from "@/interfaces/LodgingInterface";
import { ILodgingService } from "@/interfaces/LodgingServiceInterface";
import LodgingService from "@/services/Lodging/LodgingService";
import Icon from "@/ui/Icon";
import { Building } from "@/ui/icon/general";
import ItemFling from "@/ui/ItemFling";
import ViewHasButtonAdd from "@/ui/layouts/ViewHasButtonAdd";
import HeaderBack from "@/ui/components/HeaderBack";
import { useFocusEffect, useRouter } from "expo-router";
import { Skeleton } from "moti/skeleton";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import useLodgingsStore from "@/store/lodging/useLodgingsStore";
import EmptyScreen from "@/ui/layouts/EmptyScreen";

function List() {
  const route = useRouter();
  const { lodgings, setLodgings } = useLodgingsStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await new LodgingService().listByUser();
      if (Array.isArray(data)) {
        setLodgings(data.filter((item) => item.is_enabled));
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handlePressLodging = useCallback((lodging: ILodging) => {
    route.push(`/lodging/${lodging?.id}`);
  }, []);

  return (
    <View className="flex-1">
      <HeaderBack title="Danh sách nhà đang quản lý" />
      <ViewHasButtonAdd
        onPressAdd={() => {
          route.push("/lodging/create");
        }}
      >
        {!loading && lodgings.length <= 0 ? (
          <EmptyScreen
            className="pb-16"
            icon={Building}
            description="Hãy thử thay đổi bộ lọc hoặc kiểm tra lại kết nối mạng."
            title="Không tìm thấy nhà trọ phù hợp"
          />
        ) : (
          <ScrollView className="px-3 flex-grow bg-white-50">
            <View className="gap-3 items-center py-3 flex-1">
              {loading
                ? Array(3)
                    .fill("")
                    .map((_, index) => (
                      <View
                        key={index}
                        className="w-full bg-white-100 rounded-xl flex-row px-3 py-4 gap-4 items-center"
                      >
                        <View className="flex-row gap-4 py-1">
                          <Skeleton
                            width={40}
                            height={40}
                            colorMode="light"
                            radius={"round"}
                          />
                        </View>
                        <View className="gap-2">
                          <Skeleton
                            width={"50%"}
                            height={22}
                            colorMode="light"
                          />
                          <Skeleton
                            width={"70%"}
                            height={20}
                            colorMode="light"
                          />
                        </View>
                      </View>
                    ))
                : lodgings.map((lodging, index) => (
                    <ItemFling<ILodging>
                      className="flex-row items-center justify-start gap-2 px-4 py-4 border bg-white-50 border-white-100 shadow-soft-xs rounded-xl"
                      classNameContainer="rounded-xl"
                      item={lodging}
                      onPress={() => handlePressLodging(lodging)}
                      key={index}
                    >
                      <View className="bg-lime-400 p-2 rounded-full">
                        <Icon icon={Building} className="text-lime-100" />
                      </View>
                      <View className="gap-1 flex-1">
                        <Text className="font-BeVietnamSemiBold text-16 text-mineShaft-950">
                          {lodging.name}
                        </Text>
                        <Text
                          numberOfLines={1}
                          className="font-BeVietnamRegular text-12 truncate w-3/4 text-white-700"
                        >
                          {[
                            lodging.address,
                            lodging.ward?.prefix
                              ? `${lodging.ward.prefix} ${lodging.ward.name}`
                              : lodging.ward?.name,
                            lodging.district?.name,
                            lodging.province?.name,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </Text>
                      </View>
                    </ItemFling>
                  ))}
            </View>
          </ScrollView>
        )}
      </ViewHasButtonAdd>
    </View>
  );
}

export default List;
