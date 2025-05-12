import { formatNumber } from "@/helper/helper";
import { IError } from "@/interfaces/ErrorInterface";
import { IPaymentContract, IPaymentUser } from "@/interfaces/PaymentInterface";
import { PaymentService } from "@/services/Payment/PaymentService";
import ModalPayment from "@/ui/components/ModalPayment";
import { ReactNode } from "react";
import { create } from "zustand";
import useToastStore from "../toast/useToastStore";
import { constant } from "@/assets/constant";
import { Bank, Wallet } from "@/ui/icon/finance";
import ModalPaymentUser from "@/ui/components/ModalPaymentUser";

interface IPaymentStore {
  amount: string;
  balance: number;
  amountToBePaid: number;

  setAmountToBePaid: (amount: number) => void;
  setAmount: (amount: string) => void;

  relatedId: string;
  contractId: string;
  paymentType: "rent" | "service";
  openPaymentModal: (
    relatedId: string,
    contractId: string,
    paymentType: "rent" | "service",
    balance: number,
    showModal: (model: ReactNode) => void,
    actionWhenPaymentSuccess?: (amount: number, method: string) => void
  ) => void;

  handlePayment: () => Promise<boolean>;
}

const usePaymentUserStore = create<IPaymentStore>((set, get) => {
  const service = new PaymentService();
  const { addToast } = useToastStore.getState();
  return {
    amountToBePaid: 0,
    balance: 0,
    amount: "0",
    contractId: "",
    paymentType: "rent" as "rent" | "service",
    relatedId: "",
    rentPaymentType: "full" as "full" | "debt",

    setAmountToBePaid(amount) {
      set({ amount: amount.toString(), amountToBePaid: amount });
    },
    setAmount(amount) {
      const formattedAmount = formatNumber(amount, "float") ?? 0;
      const amountToPaid = get().amountToBePaid;
      if (formattedAmount > amountToPaid) {
        amount = amountToPaid.toString();
      }
      set({
        amount: amount,
      });
    },

    openPaymentModal: (
      relatedId,
      contractId,
      paymentType,
      balance,
      showModal,
      actionWhenPaymentSuccess
    ) => {
      set({
        contractId,
        paymentType,
        relatedId,
        balance,
      });

      showModal(
        <ModalPaymentUser actionWhenPaymentSuccess={actionWhenPaymentSuccess} />
      );
    },

    handlePayment: async () => {
      const { contractId, amount, paymentType, relatedId, balance } = get();
      const formattedAmount = formatNumber(amount, "float") ?? 0;

      if(formattedAmount > balance){
        addToast(constant.toast.type.error, "Số dư trong tài khoản của bạn không đủ để thực hiện giao dịch.");
        return false;
      }

      const data: IPaymentUser = {
              contract_id: contractId,
              amount: formattedAmount,
              object_type: paymentType,
              object_id: relatedId,
            };

      const result: string | IError =
        await new PaymentService().paymentByUser(data);

      if (!result) return false;
      if (result.hasOwnProperty("message")) {
        addToast(constant.toast.type.error, (result as IError).message);
        return false;
      }

      return true;
    },
  };
});

export default usePaymentUserStore;
