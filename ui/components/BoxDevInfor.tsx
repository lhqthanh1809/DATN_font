import { View } from "moti"
import { Text } from "react-native"
import Button from "../Button"
import Icon from "../Icon"
import { Facebook, Google, Tiktok } from "../icon/general"

const BoxDevInfor = () => {
    return <View>
        <View className="gap-4 border-1 border-white-100 bg-white-50 p-3 rounded-lg shadow-soft-md">

            <View className="gap-1">
                <Text className="font-BeVietnamSemiBold">Chúng tôi trên mạng xã hội</Text>
                <Text className="font-BeVietnamRegular">Theo dõi chúng tôi và cộng đồng để có thể thêm kinh nghiệm từ cộng đồng.</Text>
            </View>

            <View className="flex-row gap-1 flex-wrap">
                <Button className="border-1 border-lime-500 py-2 flex-1 basis-1/3 gap-3">
                    <Icon icon={Facebook}/>
                    <Text className="font-BeVietnamMedium">Facebook</Text>
                </Button>

                <Button className="border-1 border-lime-500 py-2 flex-1 basis-1/3 gap-3">
                    <Icon icon={Tiktok}/>
                    <Text className="font-BeVietnamMedium">Tiktok</Text>
                </Button>

            </View>
        </View>
    </View>
}

export default BoxDevInfor