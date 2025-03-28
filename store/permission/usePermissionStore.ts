import { create } from "zustand";
import { IPermission } from "@/interfaces/Permission";

interface PermissionState {
  permissions: Record<string, IPermission[]>;
  setPermissionsForLodging: (parentId: string, permission: IPermission[]) => void;
}

const usePermissionStore = create<PermissionState>((set) => ({
  permissions: {},
  setPermissionsForLodging: (parentId, permission) =>
    set((state) => ({
      permissions: { ...state.permissions, [parentId]: permission },
    })),
}));

export default usePermissionStore;
