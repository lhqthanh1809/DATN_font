import { cn } from "@/helper/helper";
import { useGeneral } from "@/hooks/useGeneral";
import PermissionService from "@/services/Permission/PermissionService";
import Box from "@/ui/box";
import BoxItem from "@/ui/box_item";
import Button from "@/ui/button";
import Icon from "@/ui/icon";
import {
  ChevronDown,
  ChevronDownSmall,
  Home,
  Menu as MenuIcon,
} from "@/ui/icon/symbol";
import Menu from "@/ui/layout/menu";
import Tabs from "@/ui/layout/tabs";
import { useRouter } from "expo-router";
import { isArray } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { IPermission } from "@/interfaces/Permission";
import { constant } from "@/assets/constant";
import { CommonlyUsed, LoadPermission, ManagementMenu } from "./components";

const HomeLodging = () => {
  const { user, lodging, permissions, setPermissions } = useGeneral();
  const route = useRouter();
  const [loading, setLoading] = useState(true);
  const [commonlyPermissions, setCommonlyPermissions] = useState<
    IPermission[]
  >([]);
  const [managementPermissions, setManagementPermissions] = useState<
    IPermission[]
  >([]);

  const handleGetPermission = useCallback(async () => {
    setLoading(true);
    const data = await new PermissionService(lodging?.id ?? null).listByUser();
    if (isArray(data)) {
      setPermissions(data);
      setCommonlyPermissions(
        data.filter(
          (permission) => permission.type === constant.permission.type.commonly
        )
      );
      setManagementPermissions(
        data.filter(
          (permission) =>
            permission.type === constant.permission.type.management
        )
      );
    }
    setLoading(false);
  }, [lodging]);

  useEffect(() => {
    if (!lodging) {
      route.push(user ? "/" : "/login");
    }
    handleGetPermission();
  }, [user, lodging]);

  useEffect(() => {
    if (permissions.length <= 0) {
      handleGetPermission();
    }
  }, []);

  const tabs = useMemo(() => {
    return ["Quản lý", "Tổng quan"];
  }, []);

  return (
    <View className="flex-1 bg-white-50" style={{ paddingTop: 0 }}>
      <StatusBar backgroundColor="#F2F2F2" />
      <View className="relative z-10 py-2">
        <View className="p-4 flex-row items-center justify-center gap-2">
          <Text className="text-mineShaft-950 font-BeVietnamBold text-2xl text-center">
            {lodging?.name}
          </Text>
          <Button className="p-0">
            <Icon icon={ChevronDownSmall} className="text-mineShaft-900" />
          </Button>
        </View>
        <Tabs tabs={tabs} className="mx-4 bg-[#f6f4fc]" />
      </View>
      <ScrollView
        className=" px-2 flex-1"
        contentContainerStyle={{ paddingBottom: 68 }}
      >
        {loading ? (
          <View className="flex-1 gap-5">
            {Array(3)
              .fill("")
              .map((_, index) => (
                <LoadPermission key={index} />
              ))}
          </View>
        ) : (
          <>
            {permissions.length > 0 && commonlyPermissions.length > 0 && (
              <CommonlyUsed permissions={commonlyPermissions} />
            )}
            {managementPermissions.length > 0 && (
              <ManagementMenu permissions={managementPermissions} />
            )}
          </>
        )}

        {/* <View className="flex-1 gap-3">
          <View className="p-2 gap-2">
            <Text className="font-BeVietnamMedium text-16">
              Tác vụ thường dùng
            </Text>
            <View className="flex-row gap-2 flex-wrap">
              <BoxItem
                className="basis-1/4"
                title="Cọc giữ chỗ"
                description="Khách đặt cọc giữ chỗ trước khi vào ở."
                icon={Home}
              />
              <BoxItem
                className="basis-1/4"
                title="Lập hợp đồng mới"
                description="Khách đặt cọc giữ chỗ trước."
                icon={Home}
              />
              <BoxItem
                className="basis-1/4"
                title="Lập hợp đồng mới"
                description="Khách đặt cọc giữ chỗ trước."
                icon={Home}
              />
              <BoxItem
                className="basis-1/4"
                title="Lập hợp đồng mới"
                description="Khách đặt cọc giữ chỗ trước."
                icon={Home}
              />
            </View>
          </View>
        </View> */}
      </ScrollView>
      <Menu />
    </View>
  );
};

export default HomeLodging;
