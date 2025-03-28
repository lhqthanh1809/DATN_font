import Box from "@/ui/Box";
import Button from "@/ui/Button";
import { Text, View } from "react-native";

function BoxWorkToDo() {
  return (
    <Box
      title="Việc cần làm trước khi kết thúc hợp đồng"
      description="Hoàn thành một số công việc bên dưới trước khi kết thúc hợp đồng"
    >
        {/*  */}

      {/* Thanh toán nợ */}
      <View className="border-1 border-mineShaft-100 rounded-xl p-3 gap-3 bg-white-50">
        <View>
          <Text className="font-BeVietnamMedium">
            Thanh toán hết khoản phí còn lại
          </Text>
          <Text className="font-BeVietnamRegular text-mineShaft-600 ">
            Thực hiện thanh toán hết khoản phí còn lại trước khi kết thúc hợp
            đồng
          </Text>
        </View>

        <View className="flex-row justify-between border-1 py-2 px-4 border-mineShaft-200 rounded-lg">
          <Text className="font-BeVietnamRegular">Số tiền cần thu:</Text>
          <Text className="font-BeVietnamRegular">3.200.000 đ</Text>
        </View>

        <View className="flex-row gap-2">
          <Button className="bg-mineShaft-400 py-2 px-11">
            <Text className="font-BeVietnamMedium text-white-50">Bỏ qua</Text>
          </Button>
          <Button className="bg-lime-400 p-2 flex-1">
            <Text className="font-BeVietnamMedium">Thanh toán</Text>
          </Button>
        </View>
      </View>
    </Box>
  );
}

export default BoxWorkToDo;
