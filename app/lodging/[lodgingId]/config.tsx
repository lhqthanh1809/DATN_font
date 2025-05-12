import { constant } from "@/assets/constant";
import { IError } from "@/interfaces/ErrorInterface";
import { ILodging, ILodgingConfig } from "@/interfaces/LodgingInterface";
import LodgingService from "@/services/Lodging/LodgingService";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import HeaderBack from "@/ui/components/HeaderBack";
import Input from "@/ui/Input";
import Layout from "@/ui/layouts/Layout";
import LoadingScreen from "@/ui/layouts/LoadingScreen";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

function ConfigLodging() {
  const { lodgingId } = useLocalSearchParams();
  const [lodging, setLodging] = useState<ILodging | null>(null);
  const [config, setConfig] = useState<ILodgingConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const lodgingService = new LodgingService();
  const { addToast } = useToastStore();

  const fetchLodging = useCallback(async () => {
    setLoading(true);
    try {
      const result = await lodgingService.detail(lodgingId as string);

      if (result.hasOwnProperty("message")) {
        addToast(constant.toast.type.error, (result as IError).message);
        router.back();
        return;
      }

      setLodging(result as ILodging);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [lodgingId]);

  const editConfig = useCallback(
    (key: keyof ILodgingConfig, value: any) => {
      if (!config) return;

      setConfig((prev) => {
        return { ...prev, [key]: value };
      });
    },
    [lodging, config]
  );

  const saveConfig = useCallback(async () => {
    if (!config) return;
    setProcessing(true);
    try {
      const result = await lodgingService.config({
        lodging_id: lodgingId as string,
        config: config,
      });

      if ("message" in result) {
        throw new Error(result.message);
      }

      setLodging(result);
      addToast(constant.toast.type.success, "Cập nhật thành công");
    } catch (err: any) {
      addToast(constant.toast.type.error, err.message || "Có lỗi xảy ra");
    } finally {
      setProcessing(false);
    }
  }, [config, lodgingId]);

  useEffect(() => {
    fetchLodging();
  }, [lodgingId]);

  useEffect(() => {
    if (lodging && lodging.config) {
      setConfig(lodging.config);
    }
  }, [lodging]);

  return (
    <View className="flex-1 bg-white-50">
      <Layout title="Cấu hình nhà trọ">
        {loading && <LoadingScreen />}
        <ScrollView className="flex-1 bg-white-50 px-3">
          <View className="flex-1 gap-3 py-3">
            <View className="gap-2">
              <Input
                type="password"
                value={config?.password_for_client || ""}
                label="Mật khẩu mặc định cho khách thuê"
                onChange={(value) => editConfig("password_for_client", value)}
              />
              <Text className="font-BeVietnamRegular text-12 text-balance text-white-600">
                Đây là mật khẩu mặc định được tạo khi lập hợp đồng cho khách
                thuê chưa có tài khoản trong hệ thống
              </Text>
            </View>
          </View>
        </ScrollView>

        <View className="p-3 bg-white-50">
          <Button
            disabled={loading || processing}
            loading={loading || processing}
            className="bg-lime-400 py-4"
            onPress={saveConfig}
          >
            <Text className="font-BeVietnamSemiBold text-mineShaft-950">
              Lưu thay đổi
            </Text>
          </Button>
        </View>
      </Layout>
    </View>
  );
}

export default ConfigLodging;
