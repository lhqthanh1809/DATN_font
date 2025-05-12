import { ManagementScreen } from "@/pages/User/Home/components";
import LogoutButton from "@/ui/components/LogoutButton";
import { Text, View } from "react-native";

function index() {
  return (
    <View className="flex-1 bg-white-50 ">
      <ManagementScreen />

      <View className="px-3 py-2">
        <LogoutButton/>
      </View>
    </View>
  );
}

export default index;
