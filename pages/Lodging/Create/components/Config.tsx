import Box from "@/ui/box";
import { ScrollView, View } from "react-native";
import { BoxRetailInfor } from "./BoxRetailInfor";
import { BoxPaymentTimeBill } from "./BoxPaymentTimeBill";

const Config = () => {
  return (
    <ScrollView className="px-5 flex-grow">
      <View className="gap-3 items-center py-3 flex-1">
        <BoxRetailInfor/>
        <BoxPaymentTimeBill />
      </View>
    </ScrollView>
  );
};

export default Config;
