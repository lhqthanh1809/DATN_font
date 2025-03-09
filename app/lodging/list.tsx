import { reference } from "@/assets/reference";
import { useGeneral } from "@/hooks/useGeneral";
import { ILodging } from "@/interfaces/LodgingInterface";
import { ILodgingService } from "@/interfaces/LodgingServiceInterface";
import LodgingService from "@/services/Lodging/LodgingService";
import Icon from "@/ui/icon";
import { Building } from "@/ui/icon/general";
import ItemFling from "@/ui/item_fling";
import ViewHasButtonAdd from "@/ui/layout/add_button";
import HeaderBack from "@/ui/layout/header";
import { useFocusEffect, useRouter } from "expo-router";
import { Skeleton } from "moti/skeleton";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

function List() {
  const route = useRouter();
  const { lodgings, setLodgings } = useGeneral();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await new LodgingService().listByUser();
      if (Array.isArray(data)) {
        setLodgings(data);
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
                      <View className="flex-row gap-4 py-1">
                        <Skeleton
                          width={32}
                          height={32}
                          colorMode="light"
                          radius={"round"}
                        />
                      </View>
                      <View className="gap-2">
                        <Skeleton width={"50%"} height={22} colorMode="light" />
                        <Skeleton width={"70%"} height={20} colorMode="light" />
                      </View>
                    </View>
                  ))
              : lodgings.map((lodging, index) => (
                  <ItemFling<ILodging>
                    className="flex-row items-center justify-start gap-4 px-4 py-4 bg-mineShaft-950 border-0"
                    item={lodging}
                    onPress={() => handlePressLodging(lodging)}
                    key={index}
                  >
                    <View className="bg-lime-500 p-2 rounded-full">
                      <Icon icon={Building} className="text-white-50" />
                    </View>
                    <View className="gap-1">
                      <Text className="font-BeVietnamSemiBold text-16 text-white-50">
                        {lodging.name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        className="font-BeVietnamMedium text-12 text-white-50 truncate w-3/4"
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
      </ViewHasButtonAdd>
    </View>
  );
}

export default List;
