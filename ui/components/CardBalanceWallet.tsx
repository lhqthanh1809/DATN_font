import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import Icon from "../Icon";
import { Wallet } from "../icon/finance";
import { ChevronRight } from "../icon/symbol";
import { convertToNumber } from "@/helper/helper";
import Button from "../Button";

function CardBalanceWallet({ balance }: { balance: number }) {
  return (
    <Pressable className="rounded-2xl overflow-hidden shadow-soft-xs">
      <LinearGradient
        colors={["#A3E635", "#94E11E"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      >
        <View className="p-5 gap-3">
          <View className="flex-row items-center justify-between gap-2">
            <View className="flex-row items-center gap-2">
              <Icon icon={Wallet} className="text-lime-50" />
              <Text className="text-lime-50 font-BeVietnamMedium text-16">
                Số dư ví
              </Text>
            </View>

            <Icon icon={ChevronRight} className="text-lime-50" />
          </View>

          <Text className="font-BeVietnamBold text-lime-50 text-2xl">
            {`${convertToNumber(balance.toString())} đ`}
          </Text>

          <Button className="bg-white-50/25 p-3">
            <Text className="font-BeVietnamMedium text-lime-50">Nạp tiền</Text>
          </Button>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

export default CardBalanceWallet;
