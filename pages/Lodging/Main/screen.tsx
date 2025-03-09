import { constant } from "@/assets/constant";
import { useGeneral } from "@/hooks/useGeneral";
import { IPermission } from "@/interfaces/Permission";
import PermissionService from "@/services/Permission/PermissionService";
import Button from "@/ui/button";
import Icon from "@/ui/icon";
import { ChevronDownSmall, ChevronLeft } from "@/ui/icon/symbol";
import Tabs from "@/ui/layout/tabs";
import { usePathname, useRouter } from "expo-router";
import { isArray } from "lodash";
import { View } from "moti";
import { useState, useCallback, useEffect, useMemo } from "react";
import { ScrollView, Text } from "react-native";
import LoadPermission from "./components/LoadPermission";
import MenuFunctionBox from "./components/MenuFunctionBox";
import { ILodging } from "@/interfaces/LodgingInterface";

const HomeScreen: React.FC<{
  id: string;
}> = ({ id }) => {
  const { user, lodgings, permissions, setPermissionsForLodging } =
    useGeneral();
  const currentPath = usePathname();
  const route = useRouter();
  const [loading, setLoading] = useState(false);
  const [lodging, setLodging] = useState<ILodging | null>(null);
  const [commonlyPermissions, setCommonlyPermissions] = useState<IPermission[]>(
    []
  );
  const [managementPermissions, setManagementPermissions] = useState<
    IPermission[]
  >([]);

  const handleGetPermission = useCallback(async () => {
    setLoading(true);
    const data = await new PermissionService(id).listByUser();
    if (isArray(data)) {
      setPermissionsForLodging(id, data);
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
  }, [id]);

  const handleLoadHome = useCallback(() => {
    if (user === undefined) return;

    if (!user) {
      route.push("/login");
      return;
    }

    if (!lodgings) return;

    const foundLodging = lodgings.find((item) => item.id == id) || null;
    setLodging(foundLodging);

    if (!foundLodging) {
      route.push("/");
      return;
    }

    if (!permissions?.[id] || permissions[id].length === 0) {
      handleGetPermission();
    } else {
      setCommonlyPermissions(
        permissions[id]?.filter(
          (permission) => permission.type === constant.permission.type.commonly
        ) || []
      );
      setManagementPermissions(
        permissions[id]?.filter(
          (permission) =>
            permission.type === constant.permission.type.management
        ) || []
      );
    }
  }, [user, lodgings, id, permissions]);

  useEffect(() => {
    handleLoadHome();
  }, [user, lodgings, id, permissions]);

  const tabs = useMemo(() => {
    return ["Quản lý", "Tổng quan"];
  }, []);

  return (
    <>
      <View className="relative z-10 py-2">
        <View className="p-4 flex-row items-center justify-center gap-2">
          <Button
            onPress={() => {
              route.navigate("/");
            }}
            className="flex items-center justify-center absolute left-6 z-10 p-1 rounded-full"
          >
            <Icon icon={ChevronLeft} className="text-mineShaft-950" />
          </Button>
          <Button
            className="p-0 gap-2"
            onPress={() => route.push("/lodging/list")}
          >
            <Text className="text-mineShaft-950 font-BeVietnamBold text-2xl text-center">
              {lodging?.name}
            </Text>
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
              {commonlyPermissions.length > 0 && (
                <MenuFunctionBox
                  title="Thao tác thường dùng"
                  path={currentPath}
                  permissions={commonlyPermissions}
                />
              )}
              {managementPermissions.length > 0 && (
                <MenuFunctionBox
                  title="Danh mục quản lý nhà trọ"
                  path={currentPath}
                  permissions={managementPermissions}
                />
              )}
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default HomeScreen;
