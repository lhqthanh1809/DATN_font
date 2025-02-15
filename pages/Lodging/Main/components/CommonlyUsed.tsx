import { reference } from "@/assets/reference";
import { IPermission } from "@/interfaces/Permission";
import BoxItem from "@/ui/box_item";
import { Pressable, Text, View } from "react-native";

function CommonlyUsed({ permissions }: { permissions: IPermission[] }) {
  return (
    <Pressable className="p-2 gap-2">
      <Text className="font-BeVietnamMedium font-16">Thao tác thường dùng</Text>
      <View className="flex-row gap-2 flex-wrap">
        {permissions.map((permission, index) => {
          return (
            <BoxItem
              key={index}
              className="basis-1/4"
              title={
                reference.permission[
                  permission.name as keyof typeof reference.permission
                ].title
              }
              description={permission.description ?? ""}
              icon={
                reference.permission[
                  permission.name as keyof typeof reference.permission
                ].icon
              }
            />
          );
        })}
      </View>
    </Pressable>
  );
}

export default CommonlyUsed;
