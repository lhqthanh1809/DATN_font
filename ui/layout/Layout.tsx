import { KeyboardAvoidingView, Platform, View } from "react-native";
import HeaderBack from "./HeaderBack";

const Layout: React.FC<{
  children?: React.ReactNode;
  title: string;
}> = ({ children, title }) => {
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-mineShaft-50 relative"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
    >
      <HeaderBack title={title} />
      <View className="flex-1">

      {children}
      </View>
    </KeyboardAvoidingView>
  );
};

export default Layout;
