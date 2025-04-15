import ListFeedback from "@/pages/Feedback/User/List";
import HeaderBack from "@/ui/components/HeaderBack";
import { View } from "react-native";

function Index() {
  return (
    <View className="flex-1 bg-white-50">
      <HeaderBack title="Danh sách phản hồi/đánh giá" />
      <View className="flex-1 pt-3">
        <ListFeedback />
      </View>
    </View>
  );
}

export default Index;
