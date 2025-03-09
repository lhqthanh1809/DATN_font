import { reference } from "@/assets/reference";
import { useGeneral } from "@/hooks/useGeneral";
import { ILodgingService } from "@/interfaces/LodgingServiceInterface";
import LodgingServiceManagerService from "@/services/LodgingService/LodgingServiceManagerService";
import ServiceManagerService from "@/services/Service/ServiceManagerService";
import UnitService from "@/services/Unit/UnitService";
import Icon from "@/ui/icon";
import ItemFling from "@/ui/item_fling";
import ViewHasButtonAdd from "@/ui/layout/add_button";
import HeaderBack from "@/ui/layout/header";
import {
  Href,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { isArray } from "lodash";
import { Skeleton } from "moti/skeleton";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

function ListService() {
  const { lodgingId } = useLocalSearchParams();
  const [services, setServices] = useState<ILodgingService[]>([]);
  const [loading, setLoading] = useState(false);
  const route = useRouter();
  const unitService = new UnitService();
  const serviceManagerService = new ServiceManagerService();

  const fetchService = useCallback(async () => {
    setLoading(true);
    const service = new LodgingServiceManagerService(lodgingId as string);
    const data = await service.list();
    if (isArray(data)) {
      setServices(data);
    }
    setLoading(false);
  }, [lodgingId]);

  useFocusEffect(
    useCallback(() => {
      fetchService();
    }, [])
  );

  return (
    <View className="flex-1">
      <HeaderBack title="Danh sách dịch vụ" />
      <ViewHasButtonAdd
        onPressAdd={() => {
          route.push(`lodging/${lodgingId}/service/create` as Href);
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
              : services.map((service, index) => (
                  <ItemFling<ILodgingService>
                    item={service}
                    onPress={() => {
                      route.push(`/lodging/${lodgingId}/service/edit/${service.id}` as any);
                    }}
                    key={index}
                  >
                    <View className="flex-row gap-4 py-1 items-center">
                      <View className="bg-lime-50 rounded-full p-2">
                        <Icon
                          className="text-lime-900"
                          icon={
                            service.service
                              ? serviceManagerService.getReferenceService(
                                  service.service
                                ).icon
                              : reference.other.icon
                          }
                        />
                      </View>
                      <View className="gap-2">
                        <Text className="font-BeVietnamSemiBold text-14 text-mineShaft-900">
                          {service.service
                            ? serviceManagerService.getReferenceService(
                                service.service
                              ).name
                            : service.name}
                        </Text>
                        <Text className="font-BeVietnamMedium text-12 text-mineShaft-500">
                          {`${new Intl.NumberFormat("vi-VN").format(
                            Number(service.price_per_unit)
                          )} ${
                            service.unit
                              ? unitService.getUnitSuffix("đồng", service.unit)
                              : reference.undefined.name
                          }`}
                        </Text>
                      </View>
                    </View>
                  </ItemFling>
                ))}
          </View>
        </ScrollView>
      </ViewHasButtonAdd>
    </View>
  );
}

export default ListService;
