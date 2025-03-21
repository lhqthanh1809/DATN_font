import { ScrollView, Text, View } from "react-native";
import Input from "../Input";
import { useEffect, useState } from "react";
import Icon from "../Icon";
import { Search } from "../icon/active";
import Button from "../Button";
import { cn } from "@/helper/helper";

const SearchAndStatus: React.FC<{
  dataObject: Record<number, Record<string, string>>;
  hasSearch?: boolean;
  onChangeSearch?: (search: string) => void;
  onChangeStatus: (status: null | number) => void;
  placeHolder?: string;
}> = ({
  onChangeSearch,
  dataObject,
  onChangeStatus,
  placeHolder,
  hasSearch = true,
}) => {
  const [search, setSearch] = useState("");
  const [statusActive, setStatusActive] = useState<null | number>(null);

  useEffect(() => {
    onChangeStatus(statusActive);
  }, [statusActive]);

  useEffect(() => {
    onChangeSearch && onChangeSearch(search);
  }, [search]);

  return (
    <View className="gap-2 px-3">
      {hasSearch && (
        <View className="flex-row gap-2">
          <View className="flex-1">
            <Input
              placeHolder={placeHolder ?? ""}
              value={search}
              onChange={(text) => setSearch(text)}
              suffix={<Icon icon={Search} />}
            />
          </View>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2">
          <Button
            onPress={() => setStatusActive(null)}
            className={cn(
              "border-1 rounded-full px-4 py-2 border-lime-300",
              !statusActive && "bg-lime-200"
            )}
          >
            <Text className="font-BeVietnamRegular">Tất cả</Text>
          </Button>
          {Object.entries(dataObject).map(([key, status]) => (
            <Button
              onPress={() => setStatusActive(parseInt(key))}
              key={key}
              className={cn(
                "border-1 rounded-full px-4 py-2 border-lime-300",
                statusActive == parseInt(key) && "bg-lime-200"
              )}
            >
              <Text className="font-BeVietnamRegular">{status.name}</Text>
            </Button>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default SearchAndStatus;
