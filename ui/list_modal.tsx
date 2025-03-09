import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  StyleProp,
  Text,
  TextInput,
  View,
  ViewStyle,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import Icon from "./icon";
import { Hide, Show } from "./icon/edit";
import Input from "./input";
import { cn } from "@/helper/helper";
import { useGeneral } from "@/hooks/useGeneral";
import { ChevronDown, ChevronUp, CrossMedium } from "./icon/symbol";
import LoadingAnimation from "./loading_animation";
import { useUI } from "@/hooks/useUI";
import Button from "./button";
import Divide from "./divide";

interface Props {
  label?: string;
  onChange: (options: any) => void;
  style?: StyleProp<ViewStyle>;
  className?: string;
  type?: string;
  icon?: ReactNode;
  options?: any[];
  optionKey: string;
  value: any;
  placeHolder?: string;
  disabled?: boolean;
  hasSearch?: boolean;
  loading?: boolean;
  renderOption?: (option: any) => string;
}

function ListModel({
  label,
  onChange,
  style,
  className,
  type = "text",
  icon,
  options = [],
  optionKey,
  value,
  placeHolder = "",
  disabled = false,
  hasSearch = true,
  loading = false,
  renderOption,
}: Props) {
  const { clickRef } = useGeneral();
  const { showModal, hideModal } = useUI();
  const [searchValue, setSearchValue] = useState("");
  const [resultSearch, setResultSearch] = useState(options);

  const handleShowModal = useCallback(() => {
    showModal(
      <ListModalItem
        {...{
          onChange,
          optionKey,
          value,
          className,
          disabled,
          hasSearch,
          icon,
          label,
          loading,
          options,
          placeHolder,
          renderOption,
        }}
      />
    );
  }, [options, optionKey, value]);

  useEffect(() => {
    setResultSearch(
      Array.isArray(options)
        ? options.filter((option) =>
            typeof option !== "object"
              ? option
              : renderOption
              ? renderOption(option)
              : option[optionKey]
          )
        : []
    );
  }, [options]);

  return (
    <View className="flex gap-2">
      {label && (
        <Text className="font-BeVietnamRegular text-14 text-mineShaft-950 ml-2">
          {typeof label === "string" ? label : label[optionKey]}
        </Text>
      )}

      <View>
        <TouchableWithoutFeedback
          disabled={Boolean(disabled || loading)}
          onPress={handleShowModal}
        >
          <View
            className={cn(
              "border-1 border-mineShaft-200 px-3 h-[3rem] rounded-xl flex-row items-center gap-2 relative w-full",
              (disabled || loading) && "bg-mineShaft-50"
            )}
          >
            <Text
              className={cn(
                `py-0 flex-1 text-14 font-BeVietnamRegular text-mineShaft-600 ${className}`,
                !value && "text-mineShaft-300"
              )}
            >
              {value
                ? typeof value !== "object"
                  ? value
                  : renderOption
                  ? renderOption(value)
                  : value[optionKey]
                : placeHolder}
            </Text>
            {loading && <LoadingAnimation />}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const ListModalItem: React.FC<Props> = ({
  label,
  onChange,
  style,
  className,
  type = "text",
  icon,
  options = [],
  optionKey,
  value,
  placeHolder = "",
  disabled = false,
  hasSearch = true,
  loading = false,
  renderOption,
}) => {
  const { showModal, hideModal } = useUI();
  const [searchValue, setSearchValue] = useState("");
  const [resultSearch, setResultSearch] = useState(options);
  const [optionLocal, setOptionLocal] = useState(value);

  useEffect(() => {
    onChange(optionLocal);
  }, [optionLocal]);

  const handleInputChange = useCallback(
    (text: string) => {
      setSearchValue(text);
      setResultSearch(
        Array.isArray(options)
          ? options.filter((option) =>
              typeof option !== "object"
                ? option.toLowerCase().includes(text.toLowerCase())
                : (renderOption ? renderOption(option) : option[optionKey])
                    ?.toLowerCase()
                    .includes(text.toLowerCase())
            )
          : []
      );
    },
    [options, optionKey]
  );

  return (
    <View className="absolute w-full left-0  items-center justify-center top-1/2 -translate-y-1/2 px-4">
      <Pressable
        onPress={() => {}}
        className="rounded-xl shadow-sm shadow-white-100 w-full bg-white-50 gap-4"
      >
        <View className="px-4 flex-row items-center justify-between pt-4">
          <Text className="text-mineShaft-950 font-BeVietnamSemiBold text-16">
            {label}
          </Text>
          <Button className="bg-mineShaft-400 p-2" onPress={hideModal}>
            <Icon icon={CrossMedium} className="text-white-50" />
          </Button>
        </View>
        <Divide direction="horizontal" className="h-[1]" />

        <View className="px-4">
          {hasSearch && (
            <Input
              placeHolder="Tìm kiếm..."
              value={searchValue}
              className="h-11"
              onChange={handleInputChange}
            />
          )}
          <ScrollView nestedScrollEnabled={true}>
            <View className="py-4">
              {resultSearch.length > 0 ? (
                resultSearch.map((option, index) => (
                  <Pressable
                    key={index}
                    className={cn(
                      "p-4 rounded-lg",
                      option == optionLocal && "bg-lime-200/70"
                    )}
                    onPress={() => {
                      setOptionLocal(option);
                    }}
                  >
                    <Text className="font-BeVietnamRegular text-14 text-mineShaft-950">
                      {typeof option !== "object"
                        ? option
                        : renderOption
                        ? renderOption(option)
                        : option[optionKey]}
                    </Text>
                  </Pressable>
                ))
              ) : (
                <Text className="font-BeVietnamRegular text-14 text-mineShaft-950 text-center">
                  Không có kết quả
                </Text>
              )}
            </View>
          </ScrollView>
        </View>
      </Pressable>
    </View>
  );
};

export default ListModel;
