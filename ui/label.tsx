import { cn } from "@/helper/helper";
import { Text, View } from "react-native";

function Label({label, className} : {label: string, className?: string}) {
    return ( 
        <View className={cn("bg-lime-200/70 px-3 py-1 rounded-lg border-1 border-lime-300", className)}>
            <Text  className="font-BeVietnamRegular text-12 text-mineShaft-950">{label}</Text>
        </View>
     );
}

export default Label;