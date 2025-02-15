import { Text, View } from "react-native";
import Button from "../button";
import Icon from "../icon";
import { Bell, Home, Notification } from "../icon/symbol";
import { Image } from "react-native-svg";
import { Setting } from "../icon/active";

function Menu() {
  return (
    <View className="py-1 absolute bottom-2 left-0 w-full items-center ">
      <View className="bg-mineShaft-950 rounded-2xl w-fit flex-row py-3 px-6">
        <Button className="bg-white-50 rounded-full gap-2 px-6 py-2">
          <Icon icon={Home} className="text-mineShaft-900" />
          <Text className="font-BeVietnamMedium text-mineShaft-900">
            Trang chủ
          </Text>
        </Button>
        <Button className="px-6">
          <Icon icon={Bell} className="text-white-700" />
          {/* <Text>Trang chủ</Text> */}
        </Button>
        <Button className="px-6">
          <Icon icon={Notification} className="text-white-700" />
          {/* <Text>Trang chủ</Text> */}
        </Button>
        <Button className="px-6">
          <Icon icon={Setting} className="text-white-700" />
          {/* <Text>Trang chủ</Text> */}
        </Button>
      </View>
    </View>
  );
}

export default Menu;
