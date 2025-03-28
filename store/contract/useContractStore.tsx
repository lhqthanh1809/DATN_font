import { create } from "zustand";
import { constant } from "@/assets/constant";
import { IContract } from "@/interfaces/ContractInterface";
import { IError } from "@/interfaces/ErrorInterface";
import ContractService from "@/services/Contract/ContractService";
import { router } from "expo-router";
import useToastStore from "../toast/useToastStore";

const contractService = new ContractService();

interface IContractStore {
  contract: IContract | null;
  loading: boolean;
  loadingProcess: boolean;
  fetchContract: (id: string) => void;
  updateContract: (contract: IContract, lodgingId: string, goBack?: boolean) => void;
}

const useContractStore = create<IContractStore>((set, get) => ({
  contract: null,
  loading: false,
  loadingProcess: false,

  fetchContract: async (id) => {
    set({ loading: true });

    const result: IContract | IError = await contractService.detail(id);

    if (result.hasOwnProperty("message")) {
      const addToast = useToastStore.getState().addToast;
      addToast(constant.toast.type.error, (result as IError).message);
      router.back();
      return;
    }

    set({ contract: result as IContract });
    set({ loading: false });
  },

  updateContract: async (contract, lodgingId, goBack = false) => {
    set({ loadingProcess: true });
    const data = {
      ...contract,
      lodging_id: lodgingId,
      contract_id: contract.id,
    };
    try {
      const result = await contractService.update(data);

      const addToast = useToastStore.getState().addToast;
      if (result.hasOwnProperty("message")) {
        addToast(constant.toast.type.error, (result as IError).message);
        return;
      }

      addToast(constant.toast.type.success, "Cập nhập hợp đồng thành công!")
      set({ contract: result as IContract });
      if(goBack){
        router.back()
      }
    } catch (err) {
    } finally {
      set({ loadingProcess: false });
    }
  },
}));

export default useContractStore;
