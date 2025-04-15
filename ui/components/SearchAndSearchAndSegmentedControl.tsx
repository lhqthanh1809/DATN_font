import { ScrollView, Text, View } from "react-native";
import Input from "../Input";
import { useEffect, useState } from "react";
import Icon from "../Icon";
import { Search } from "../icon/active";
import Button from "../Button";
import { cn } from "@/helper/helper";

const SearchAndSegmentedControl: React.FC<{
  dataObject: Record<number, Record<string, string>>;
  hasSearch?: boolean;
  onChangeSearch?: (search: string) => void;
  onChangeStatus: (status: any) => void;
  placeHolder?: string;
}> = ({
  onChangeSearch,
  dataObject,
  onChangeStatus,
  placeHolder,
  hasSearch = true,
}) => {
  const [search, setSearch] = useState("");
  const [statusActive, setStatusActive] = useState<any>(null);

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
              "rounded-full px-4 py-2 bg-white-100",
              !statusActive && "bg-lime-400"
            )}
          >
            <Text
              className={cn(
                "font-BeVietnamMedium",
                !statusActive && "text-lime-50"
              )}
            >
              Tất cả
            </Text>
          </Button>
          {Object.entries(dataObject).map(([key, status]) => (
            <Button
              onPress={() => setStatusActive(key)}
              key={key}
              className={cn(
                "rounded-full px-4 py-2 bg-white-100",
                statusActive == key && "bg-lime-400"
              )}
            >
              <Text
                className={cn(
                  "font-BeVietnamMedium",
                  statusActive == parseInt(key) && "text-lime-50"
                )}
              >
                {status.name}
              </Text>
            </Button>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default SearchAndSegmentedControl;
