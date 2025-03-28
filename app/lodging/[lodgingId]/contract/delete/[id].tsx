import Box from "@/ui/Box";
import DatePicker from "@/ui/Datepicker";
import HeaderBack from "@/ui/layout/HeaderBack";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Button from "@/ui/Button"
import BoxWorkToDo from "@/pages/Contract/Delete/BoxWorkToDo";

function EndContract() {
  const { id, room_code, code } = useLocalSearchParams();
  const [endDate, setEndDate] = useState(new Date());

  return (
    <View className="flex-1 bg-white-50">
      <HeaderBack title={`Kết thúc hợp đồng - #${code}`} />
      <ScrollView className="flex-1 p-3">
        <View className="gap-3 flex-1">
          <View className="w-full bg-white-50 rounded-xl p-2 gap-2 border-1 shadow-soft-md flex-col border-white-100 items-center">
            <Text className="font-BeVietnamSemiBold">
              Kết thúc hợp đồng cho phòng {room_code}
            </Text>
          </View>

          <Box title="Ngày kết thúc hợp đồng" description="Là ngày khách thuê muốn rời đi">
            <DatePicker required label="Ngày khách rời đi" value={endDate} />
          </Box>

          <BoxWorkToDo/>
        </View>
      </ScrollView>

      <View className="p-3 flex bg-white-50">
        <Button className="bg-lime-400 py-4">
          <Text className="text-mineShaft-900 text-16 font-BeVietnamSemiBold">Kết thúc</Text>
        </Button>
      </View>
    </View>
  );
}

export default EndContract;
