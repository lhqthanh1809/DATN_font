import { ILodging } from "@/interfaces/LodgingInterface";
import LodgingService from "@/services/Lodging/LodgingService";
import useLodgingsStore from "@/store/lodging/useLodgingsStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { Plus, PlusTiny, Trash } from "@/ui/icon/symbol";
import ItemFling from "@/ui/ItemFling";
import { Href, router, useRouter } from "expo-router";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import React, { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";

const ManagementScreen = () => {
  const { setLodgings, lodgings } = useLodgingsStore();
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

  const handlePressLodging = useCallback((item: ILodging) => {
    router.push(`/lodging/${item.id ?? ""}` as Href);
  }, []);

  return (
    <View className="px-3 py-5 flex-1 ">
      <View className="flex-row justify-between items-center px-2 mb-4">
        <Text className="font-BeVietnamMedium text-16">Nhà trọ của tôi</Text>
        {lodgings.length > 0 && (
          <Button
            className="p-2 px-4 bg-lime-100 rounded-lg gap-0"
            onPress={() => router.push("/lodging/create")}
          >
            <Icon icon={PlusTiny} className="text-lime-900" strokeWidth={2} />
            <Text className="font-BeVietnamMedium text-lime-900 px-2">
              Trọ mới
            </Text>
          </Button>
        )}
      </View>

      {loading ? (
        <View className="gap-3">
          {Array(3)
            .fill("")
            .map((_, index) => (
              <Skeleton
                key={index}
                width={"100%"}
                colorMode="light"
                height={64}
              />
            ))}
        </View>
      ) : lodgings && lodgings.length > 0 ? (
        <View className="gap-3">
          {lodgings.map((item, index) => (
            <LodgingItem key={index} item={item} onPress={handlePressLodging} />
          ))}
        </View>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Button
            onPress={() => router.push("/lodging/create")}
            className="items-center gap-3"
          >
            <Icon icon={PlusTiny} className="text-mineShaft-200" />
            <Text className="font-BeVietnamMedium text-mineShaft-200 text-16">
              Thêm trọ mới
            </Text>
          </Button>
        </View>
      )}
    </View>
  );
};

const LodgingItem: React.FC<{
  item: ILodging;
  onPress?: (item: ILodging) => void;
}> = ({ item, onPress = () => {} }) => {
  return (
    <ItemFling<ILodging> item={item} onPress={onPress}>
      <Text className="font-BeVietnamSemiBold text-16 text-mineShaft-900">
        {item.name}
      </Text>
      <Text
        numberOfLines={1}
        className="font-BeVietnamMedium text-12 text-lime-950 truncate w-3/4"
      >
        {[
          item.address,
          item.ward?.prefix
            ? `${item.ward.prefix} ${item.ward.name}`
            : item.ward?.name,
          item.district?.name,
          item.province?.name,
        ]
          .filter(Boolean)
          .join(", ")}
      </Text>
    </ItemFling>
  );
};

export default ManagementScreen;
