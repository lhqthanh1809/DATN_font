import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import React from "react";
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
import Icon from "./Icon";
import { Hide, Show } from "./icon/edit";
import Input from "./Input";
import { cn } from "@/helper/helper";
import { useGeneral } from "@/hooks/useGeneral";
import { ChevronDown, ChevronUp } from "./icon/symbol";
import LoadingAnimation from "./LoadingAnimation";

interface Props {
  label?: string;
  onChange?: (options: any) => void;
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
  required?: boolean;
  compareKey?: string;
  renderOption?: (option: any) => string;
}

function Dropdown({
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
  required,
  compareKey,
  renderOption,
}: Props) {
  const { clickRef } = useGeneral();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [resultSearch, setResultSearch] = useState(options);

  // useEffect(() => {
  //   console.log("Option:", options);
  //   console.log("Value:", value);
  // }, [value, options])

  const dropdownRef = useRef<View>(null);

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

  const handleOutsideClick = useCallback(() => {
    setShowDropdown(false);
  }, []);

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
    <View className="flex gap-2">
      {label && (
        <View className="flex-row items-center">
          <Text className="font-BeVietnamRegular text-14 text-mineShaft-950 ml-2">
            {typeof label === "string" ? label : label[optionKey]}
          </Text>
          {required && (
            <Text className="font-BeVietnamRegular text-14 text-red-600 ml-2">
              *
            </Text>
          )}
        </View>
      )}

      <View>
        <TouchableWithoutFeedback
          disabled={Boolean(disabled || loading)}
          onPress={() => {
            clickRef(dropdownRef, handleOutsideClick);
            setShowDropdown(!showDropdown);
          }}
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
            {loading ? (
              <LoadingAnimation />
            ) : (
              <View>
                <Icon icon={showDropdown ? ChevronUp : ChevronDown} />
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
        {!loading ? (
          showDropdown && (
            <View
              ref={dropdownRef}
              className={cn(
                "absolute top-full translate-y-2 w-full z-10 bg-white-50 border-1 border-mineShaft-200 rounded-xl shadow-sm shadow-white-100 px-2 py-2 gap-2",
                className
              )}
            >
              {hasSearch && (
                <Input
                  value={searchValue}
                  className="h-11"
                  onChange={handleInputChange}
                />
              )}
              <ScrollView nestedScrollEnabled={true}>
                {resultSearch.length > 0 ? (
                  resultSearch.map((option, index) => {
                    const isSelected = compareKey
                      ? typeof option === "object" && typeof value === "object"
                        ? option[compareKey] === value?.[compareKey]
                        : option === value
                      : option === value;
                    return (
                      <Pressable
                        key={index}
                        className={cn(
                          "p-2 rounded-lg",
                          isSelected && "bg-lime-200/70"
                        )}
                        onPress={() => {
                          onChange && onChange(option);
                          setShowDropdown(false);
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
                    );
                  })
                ) : (
                  <Text className="font-BeVietnamRegular text-14 text-mineShaft-950 text-center">
                    Không có kết quả
                  </Text>
                )}
              </ScrollView>
            </View>
          )
        ) : (
          <></>
        )}
      </View>
    </View>
  );
}

export default Dropdown;
