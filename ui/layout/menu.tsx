import { View } from "react-native";
import Button from "../button";
import Icon from "../icon";
import { Home } from "../icon/symbol";

function Menu() {
  return (
    <View className="py-1 px-2 absolute  bottom-2 left-0 w-full">
      <View className="bg-mineShaft-950   w-full rounded-full">
        <Button>
          <Icon icon={Home} />
        </Button>
      </View>
    </View>
  );
}

export default Menu;
