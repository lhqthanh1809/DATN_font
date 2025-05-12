import { IRoomRentalHistory } from "@/interfaces/RoomRentalHistoryInterface";
import { IRoomServiceInvoice } from "@/interfaces/RoomServiceInvoiceInterface";
import InvoiceService from "@/services/Invoice/InvoiceService";
import { create } from "zustand";
import useToastStore from "../toast/useToastStore";
import { constant } from "@/assets/constant";

interface IInvoiceStore{
    invoice: IRoomRentalHistory | IRoomServiceInvoice | null
    
    setInvoice: (data: IRoomRentalHistory | IRoomServiceInvoice | null) =>void
    detail: (lodgingId: string, type: "rent" | "service", id: string) => Promise<boolean>
}

const useInvoiceStore = create<IInvoiceStore>((set, get) => ({
   invoice: null,
   setInvoice: (data) => {
    set({invoice: data})
   },

   detail: async(lodgingId, type, id) => {
       try{
            const result = await (new InvoiceService).detail({
                lodging_id: lodgingId,
                type,
                id
            })

            if("message" in result){
                throw new Error(result.message)
            }

            set({
                invoice : result
            })
            return true
       }catch(err: any){
          useToastStore.getState().addToast(constant.toast.type.error, err.message || "Lỗi không xác định")
          return false
       }
   },
}))


export default useInvoiceStore