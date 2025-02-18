import { cn } from "@/helper/helper";
import { useGeneral } from "@/hooks/useGeneral";
import PermissionService from "@/services/Permission/PermissionService";
import Button from "@/ui/button";
import Icon from "@/ui/icon";
import {
  ChevronDownSmall,
  ChevronLeft,
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
import { CommonlyUsed, LoadPermission, ManagementMenu } from "@pages/Lodging/Main/components";

const HomeLodging = () => {
  const { user, lodging, permissions, setPermissions } = useGeneral();
  const route = useRouter();
  const [loading, setLoading] = useState(false);
  const [commonlyPermissions, setCommonlyPermissions] = useState<IPermission[]>(
    []
  );
  const [managementPermissions, setManagementPermissions] = useState<
    IPermission[]
  >([]);

  const handleGetPermission = useCallback(async () => {
    setLoading(true);
    const data = await new PermissionService(lodging?.id).listByUser();
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
    } else {
      if (permissions.length <= 0) {
        handleGetPermission();
      } else {
        setCommonlyPermissions(
          permissions.filter(
            (permission) =>
              permission.type === constant.permission.type.commonly
          )
        );
        setManagementPermissions(
          permissions.filter(
            (permission) =>
              permission.type === constant.permission.type.management
          )
        );
      }
    }
  }, [user, lodging]);

  const tabs = useMemo(() => {
    return ["Quản lý", "Tổng quan"];
  }, []);

  return (
    <View className="flex-1 bg-white-50" style={{ paddingTop: 0 }}>
      <StatusBar backgroundColor="#F2F2F2" />
      <View className="relative z-10 py-2">
        <View className="p-4 flex-row items-center justify-center gap-2">
          <Button
            onPress={() => {
              route.back();
            }}
            className="flex items-center justify-center absolute left-6 z-10 p-1 rounded-full"
          >
            <Icon icon={ChevronLeft} className="text-mineShaft-950" />
          </Button>
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
        className="px-2 flex-1"
        contentContainerStyle={{ paddingBottom: 68 }}
      >
        <View className="flex-1 gap-5">
          {loading ? (
            <>
              {Array(3)
                .fill("")
                .map((_, index) => (
                  <LoadPermission key={index} />
                ))}
            </>
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
        </View>
      </ScrollView>
      <Menu />
    </View>
  );
};

export default HomeLodging;
