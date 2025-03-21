import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import LoadPermission from "./LoadPermission";
import MenuFunctionBox from "./MenuFunctionBox";
import { ILodging } from "@/interfaces/LodgingInterface";
import { IPermission } from "@/interfaces/Permission";
import { isArray } from "lodash";
import PermissionService from "@/services/Permission/PermissionService";
import { constant } from "@/assets/constant";
import usePermissionStore from "@/store/permission/usePermissionStore";

const ManagerScreen: React.FC<{
    lodgingId: string
    currentPath: string
}> = ({lodgingId, currentPath}) => {
  const { permissions, setPermissionsForLodging } =
    usePermissionStore();
  const [loading, setLoading] = useState(false);
  const [commonlyPermissions, setCommonlyPermissions] = useState<IPermission[]>(
    []
  );
  const [managementPermissions, setManagementPermissions] = useState<
    IPermission[]
  >([]);

  const handleGetPermission = useCallback(async () => {
    setLoading(true);
    const data = await new PermissionService(lodgingId).listByUser();
    if (isArray(data)) {
      setPermissionsForLodging(lodgingId, data);
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
  }, [lodgingId]);

  useEffect(() => {
    if (!permissions?.[lodgingId] || permissions[lodgingId].length === 0) {
      handleGetPermission();
    } else {
      setCommonlyPermissions(
        permissions[lodgingId]?.filter(
          (permission) => permission.type === constant.permission.type.commonly
        ) || []
      );
      setManagementPermissions(
        permissions[lodgingId]?.filter(
          (permission) =>
            permission.type === constant.permission.type.management
        ) || []
      );
    }
  }, [lodgingId]);

  return (
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
  );
};

export default ManagerScreen;
