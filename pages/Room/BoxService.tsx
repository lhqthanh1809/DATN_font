import { ILodgingService } from "@/interfaces/LodgingServiceInterface";
import LodgingServiceManagerService from "@/services/LodgingService/LodgingServiceManagerService";
import Box from "@/ui/Box";
import { isArray } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import ItemService from "./ItemService";
import LoadingAnimation from "@/ui/LoadingAnimation";

const BoxService: React.FC<{
  serviceSelects: Array<{
    id: string;
    value?: string;
    selected: boolean;
  }>;
  setServiceSelects: (
    services: Array<{
      id: string;
      value?: string;
      selected: boolean;
    }>
  ) => void;

  lodgingId: string
}> = ({ serviceSelects, setServiceSelects, lodgingId }) => {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<ILodgingService[]>([]);

  const fetchService = useCallback(async () => {
    setLoading(true);
    const lodgingServiceManager = new LodgingServiceManagerService(lodgingId);
    const data = await lodgingServiceManager.list();

    if (isArray(data)) {
      setServices(data);
    }
    setLoading(false);
  }, [lodgingId]);

  const handlePressService = useCallback(
    (service: ILodgingService) => {
      if (!service || !service.id) return;
      if (serviceSelects.some((item) => item.id == service.id)) {
        setServiceSelects(
          serviceSelects.map((item) =>
            item.id == service.id ? { ...item, selected: !item.selected } : item
          )
        );
      } else {
        setServiceSelects([
          ...serviceSelects,
          {
            id: service.id,
            value: "0",
            selected: true,
          },
        ]);
      }
    },
    [serviceSelects, setServiceSelects]
  );

  const handleInputService = useCallback(
    (value: string, serviceId: string) => {
      const newService = serviceSelects.map((item) => {
        if (item.id !== serviceId) return item;
        return { ...item, value: value };
      });
      setServiceSelects(newService);
    },
    [serviceSelects]
  );

  useEffect(() => {
    fetchService();
  }, []);

  return (
    <Box title="Dịch vụ phòng sử dụng">
      <View className="bg-mineShaft-50 rounded-lg p-2 items-center">
        {loading ? (
          <LoadingAnimation />
        ) : services.length <= 0 ? (
          <Text className="font-BeVietnamRegular text-mineShaft-300">
            Hiện không hỗ trợ dịch vụ
          </Text>
        ) : (
          <ScrollView className="max-h-96">
            <View className=" gap-2">
              {services.map((service, index) => (
                <ItemService
                  key={index}
                  {...{
                    onChange: handleInputService,
                    onPress: handlePressService,
                    service: service,
                    checked:
                      serviceSelects.find((item) => item.id === service.id)
                        ?.selected ?? false,
                    value:
                      serviceSelects.find((item) => item.id === service.id)
                        ?.value ?? "",
                  }}
                />
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </Box>
  );
};

export default BoxService;
