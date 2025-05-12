import { constant } from "@/assets/constant";
import { reference } from "@/assets/reference";
import { cn } from "@/helper/helper";
import { useUI } from "@/hooks/useUI";
import { ILodging } from "@/interfaces/LodgingInterface";
import LodgingService from "@/services/Lodging/LodgingService";
import useLodgingsStore from "@/store/lodging/useLodgingsStore";
import useLodgingStore from "@/store/lodging/user/useLodgingStore";
import useToastStore from "@/store/toast/useToastStore";
import Icon from "@/ui/Icon";
import { PinLarge } from "@/ui/icon/travel";
import ItemFling from "@/ui/ItemFling";
import ViewHasButtonAdd from "@/ui/layouts/ViewHasButtonAdd";
import { Href, router } from "expo-router";
import { Skeleton } from "moti/skeleton";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ScrollView, Text, View } from "react-native";

const ManagementScreen = () => {
  const { setLodgings, lodgings } = useLodgingsStore();
  const [loading, setLoading] = useState(false);
  const Wrapper = useMemo(() => {
    return lodgings.length > 0 ? ViewHasButtonAdd : Fragment;
  }, [lodgings]);

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
    <View className="flex-1">
      <View className="px-5 py-3 flex-row justify-between items-center border-b-1 border-white-100">
        <Text className="font-BeVietnamBold text-18">Nhà trọ của tôi</Text>
        {/* {lodgings.length > 0 && (
          <Button
            className="p-2 px-4 bg-lime-100 rounded-lg gap-0"
            onPress={() => router.push("/lodging/create")}
          >
            <Icon icon={PlusTiny} className="text-lime-900" strokeWidth={2} />
            <Text className="font-BeVietnamMedium text-lime-900 px-2">
              Trọ mới
            </Text>
          </Button>
        )} */}
      </View>

      <Wrapper
        {...(lodgings.length > 0 && {
          onPressAdd: () => router.push("/lodging/create"),
        })}
      >
        <ScrollView className="flex-1 px-3">
          <View className="flex-1 gap-3 py-3">
            {loading
              ? Array(3)
                  .fill("")
                  .map((_, index) => (
                    <Skeleton
                      key={index}
                      width={"100%"}
                      colorMode="light"
                      height={64}
                    />
                  ))
              : lodgings.map((item, index) => (
                  <LodgingItem
                    key={index}
                    item={item}
                    onPress={handlePressLodging}
                  />
                ))}
          </View>
        </ScrollView>
      </Wrapper>
    </View>
  );
};

const LodgingItem: React.FC<{
  item: ILodging;
  onPress?: (item: ILodging) => void;
}> = ({ item, onPress = () => {} }) => {
  const { deleteLodging } = useLodgingStore();
  const { addToast } = useToastStore();
  const { showModal } = useUI();

  return (
    <ItemFling<ILodging>
      item={item}
      onPress={(lodging) => {
        item.is_enabled
          ? onPress(lodging)
          : addToast(constant.toast.type.error, "Nhà cho thuê không khả dụng");
      }}
      onDelete={() => deleteLodging(item.id ?? "", showModal)}
      className="p-4 shadow-soft-xs border-1 border-white-100 bg-white-50 flex-col gap-2"
    >
      <View className="flex-row items-center justify-between w-full">
        <View className="flex-row items-center gap-2 flex-1">
          <Text
            numberOfLines={1}
            className="font-BeVietnamSemiBold text-16 text-mineShaft-950 truncate"
          >
            {item.name}
          </Text>

          <View
            className={cn(
              `w-2 h-2 rounded-full`,
              item.is_enabled ? "bg-lime-400" : "bg-white-300"
            )}
          />
        </View>

        <View className="bg-lime-400 rounded-full p-2">
          <Text className="text-12 font-BeVietnamMedium text-white-50">
            {item.type?.name ?? reference.undefined.name}
          </Text>
        </View>
      </View>
      <View className="w-full flex-row items-center gap-2">
        <Icon icon={PinLarge} className="text-white-500" />

        <View className="flex-1">
          <Text className="font-BeVietnamRegular text-white-700">
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
        </View>
      </View>
    </ItemFling>
  );
};

export default ManagementScreen;
