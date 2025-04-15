import ListContract from "@/pages/Contract/ListContract";
import HeaderBack from "@/ui/components/HeaderBack";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

function Contract() {
  const { roomId, lodgingId, name } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-white-50">
      <HeaderBack title={`Danh sách hợp đồng - Phòng ${name}`} />
      <ListContract lodgingId={lodgingId as string} roomId={roomId as string} />
    </View>
  );
}

export default Contract;
