import { formatNumber } from "@/helper/helper";
import { IError } from "@/interfaces/ErrorInterface";
import { IPaymentContract } from "@/interfaces/PaymentInterface";
import { PaymentService } from "@/services/Payment/PaymentService";
import ModalPayment from "@/ui/components/ModalPayment";
import { ReactNode } from "react";
import { create } from "zustand";
import useToastStore from "../toast/useToastStore";
import { constant } from "@/assets/constant";
import { Bank, Wallet } from "@/ui/icon/finance";

interface IPaymentStore {
  amount: string;
  amountToBePaid: number;
  paymentMethods: { value: string; label: string; icon: React.FC }[];

  setAmountToBePaid: (amount: number) => void;
  setAmount: (amount: string) => void;

  relatedId: string;
  contractId: string;
  paymentType: "rent" | "service";
  rentPaymentType?: "full" | "debt";
  openPaymentModal: (
    relatedId: string,
    contractId: string,
    paymentType: "rent" | "service",
    showModal: (model: ReactNode) => void,
    actionWhenPaymentSuccess?: (amount: number, method: string) => void,
    rentPaymentType?: "full" | "debt"
  ) => void;

  handlePayment: (paymentMethod: "bank" | "cash") => Promise<boolean>;
}

const usePaymentStore = create<IPaymentStore>((set, get) => {
  const service = new PaymentService();
  const { addToast } = useToastStore.getState();
  return {
    paymentMethods: [
      {
        value: "cash",
        label: "Thanh toán tiền mặt",
        icon: Wallet,
      },
      {
        value: "bank",
        label: "Chuyển khoản ngân hàng",
        icon: Bank,
      },
    ],
    amountToBePaid: 0,
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

    openPaymentModal(
      relatedId,
      contractId,
      paymentType,
      showModal,
      actionWhenPaymentSuccess,
      rentPaymentType
    ) {
      set({
        contractId,
        paymentType,
        relatedId,
        rentPaymentType,
      });

      showModal(
        <ModalPayment actionWhenPaymentSuccess={actionWhenPaymentSuccess} />
      );
    },

    handlePayment: async (paymentMethod) => {
      const { contractId, amount, paymentType, relatedId, rentPaymentType } =
        get();
      const formattedAmount = formatNumber(amount, "float") ?? 0;

      const finalPaymentType = paymentType as "rent" | "service";

      const data: IPaymentContract =
        finalPaymentType === "rent"
          ? {
              contract_id: contractId,
              amount: formattedAmount,
              payment_method: paymentMethod,
              payment_type: "rent",
              rental_history_id: relatedId,
              rent_payment_type: rentPaymentType ?? "full",
            }
          : {
              contract_id: contractId,
              amount: formattedAmount,
              payment_method: paymentMethod,
              payment_type: "service",
              service_payment_id: relatedId,
            };

      const result: string | IError =
        await new PaymentService().paymentByContract(data);

      if (!result) return false;
      if (result.hasOwnProperty("message")) {
        addToast(constant.toast.type.error, (result as IError).message);
        return false;
      }

      return true;
    },
  };
});

export default usePaymentStore;
