import { useGeneral } from "@/hooks/useGeneral";
import { BoxPaymentTimeBill } from "@/ui/layout/box_payment_time_bill";
import LayoutCreate from "@/ui/layout/layout_create";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { BoxInfo } from "@pages/Service/Create/components";
import { IService } from "@/interfaces/ServiceInterface";
import { IUnit } from "@/interfaces/UnitInterface";
import Button from "@/ui/button";
import LodgingServiceManagerService from "@/services/LodgingService/LodgingServiceManagerService";
import { formatNumber } from "@/helper/helper";
import { useRouter } from "expo-router";

function CreateService() {
  const { lodging } = useGeneral();
  const [paymentDate, setPaymentDate] = useState<number>(
    lodging?.payment_date || 5
  );
  const [lateDays, setLateDays] = useState<number>(lodging?.late_days || 5);
  const [service, setService] = useState<IService | null>(null);
  const [unit, setUnit] = useState<IUnit | null>(null);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const route = useRouter();

  const handleCreateLodgingService = useCallback(async () => {
    const pricePerUnit = formatNumber(price, "float");
    if (!lodging || !lodging.id || !pricePerUnit || !unit) return;
    setLoading(true);
    const serviceLodgingService = new LodgingServiceManagerService(lodging.id);
    const data = await serviceLodgingService.create({
      late_days: lateDays,
      payment_date: paymentDate,
      price_per_unit: pricePerUnit,
      service_id: service?.id || null,
      name: name || null,
      unit_id: unit.id,
    });
    setLoading(false);
    if (!("message" in data)) {
      route.push("/service/list");
    }
  }, [lodging, paymentDate, lateDays, service, unit, name, price]);

  return (
    <View className="flex-1">
      <LayoutCreate title="Thêm dịch vụ mới">
        <ScrollView className="px-5 flex-grow bg-white-50">
          <View className="gap-3 items-center py-3 flex-1">
            <BoxInfo
              {...{
                name,
                price,
                service,
                setName,
                setPrice,
                setService,
                setUnit,
                unit,
              }}
            />
            <BoxPaymentTimeBill
              {...{ lateDays, paymentDate, setLateDays, setPaymentDate }}
            />
          </View>
        </ScrollView>
        <View className="p-3 flex bg-white-50">
          <View className="flex-row">
            <Button
              disabled={loading}
              loading={loading}
              onPress={handleCreateLodgingService}
              className="flex-1 bg-lime-400 py-4"
            >
              <Text className="text-mineShaft-900 text-16 font-BeVietnamSemiBold">
                Hoàn thành
              </Text>
            </Button>
          </View>
        </View>
      </LayoutCreate>
    </View>
  );
}

export default CreateService;
