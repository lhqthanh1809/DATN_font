import { reference } from "@/assets/reference";
import { formatPhone, getTimezone } from "@/helper/helper";
import { useGeneral } from "@/hooks/useGeneral";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { Edit } from "@/ui/icon/active";
import HeaderBack from "@/ui/components/HeaderBack";
import { router } from "expo-router";
import moment from "moment";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const genders = [
  {
    name: "Nam",
    value: false,
  },
  {
    name: "Nữ",
    value: true,
  },
];

function Detail() {
  const { user, changeUser } = useGeneral();

  return (
    <View className="flex-1 bg-white-50">
      <HeaderBack title="Thông tin người dùng" />
      <ScrollView className="flex-1 px-3">
        <View className="flex-1 py-3 gap-3">
          <Button className="bg-white-50 border-1 border-white-100 shadow-soft-xs rounded-xl p-5 flex-col items-start">
            <View className="w-full flex-row items-center justify-between">
              <Text className="font-BeVietnamSemiBold text-16 text-mineShaft-950">
                Thông tin cá nhân
              </Text>

              <Button onPress={() => router.push("/user/update")}>
                <Text className="text-lime-500 font-BeVietnamMedium">
                  Chỉnh sửa
                </Text>
              </Button>
            </View>

            <DetailItem
              title="Họ tên"
              data={user?.full_name ?? reference.undefined.name}
            />
            <DetailItem
              title="Số điện thoại"
              data={user ? formatPhone(user.phone) : reference.undefined.name}
            />

            <DetailItem
              title="Số căn cước công dân"
              data={user?.identity_card ?? reference.undefined.name}
            />

            <DetailItem
              title="Giới tính"
              data={
                genders.find((item) => item.value == user?.gender)?.name ??
                reference.undefined.name
              }
            />

            <DetailItem
              title="Ngày sinh"
              data={
                user?.date_of_birth
                  ? moment(new Date(user?.date_of_birth))
                      .tz(getTimezone())
                      .format("DD/MM/YYYY")
                  : reference.undefined.name
              }
            />

            <DetailItem
              title="Email"
              data={user?.email ?? reference.undefined.name}
            />

            <DetailItem
              title="Địa chỉ"
              data={user?.address ?? reference.undefined.name}
            />
          </Button>

          {/* BoxPassword */}
          <Button className="bg-white-50 border-1 border-white-100 shadow-soft-xs rounded-xl p-5 flex-col items-start">
            <Text className="font-BeVietnamSemiBold text-16 text-mineShaft-950">
              Quản lý mật khẩu
            </Text>

            <DetailItem title="Mật khẩu" data={"•••••••••••"} />

            <Button onPress={() => router.push("/user/change_password")} className="w-full bg-lime-400 p-3">
              <Text className="text-lime-50 font-BeVietnamMedium">
                Thay đổi mật khẩu
              </Text>
            </Button>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const DetailItem = ({ title, data }: { title: string; data: string }) => {
  return (
    <View className="gap-1">
      <Text className="font-BeVietnamRegular text-12 text-white-600">
        {title}
      </Text>
      <Text className="font-BeVietnamMedium">{data}</Text>
    </View>
  );
};

export default Detail;
