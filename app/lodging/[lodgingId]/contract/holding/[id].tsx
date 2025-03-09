import BoxInfo from "@/pages/Contract/Holding/BoxInfo";
import BoxPriceHolding from "@/pages/Contract/Holding/BoxPriceHolding";
import Button from "@/ui/button";
import HeaderBack from "@/ui/layout/header";
import Layout from "@/ui/layout/layout_create";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";

function CreateHolding() {
  const { id, name, price, lodgingId } = useLocalSearchParams();
  return (
    <View className="flex-1">
      <Layout title={`Đặt cọc giữ chỗ ${name && `- ${name}`} `}>
        <ScrollView className="px-3 flex-grow bg-white-50">
          <View className="gap-3 items-center py-3 flex-1">
            <BoxInfo />
            <BoxPriceHolding priceRoom={price as string} />
          </View>
        </ScrollView>
        <View className="p-3 flex bg-white-50">
          <View className="flex-row">
            <Button
              // disabled={loading}
              // loading={loading}
              // onPress={handleCreateRoom}
              className="flex-1 bg-lime-400 py-4"
            >
              <Text className="text-mineShaft-900 text-16 font-BeVietnamSemiBold">
                Hoàn thành
              </Text>
            </Button>
          </View>
        </View>
      </Layout>
    </View>
  );
}

export default CreateHolding;
