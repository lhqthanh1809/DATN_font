import AuthService from "@/services/Auth/AuthService";
import { create } from "zustand";
import useToastStore from "./toast/useToastStore";
import { constant } from "@/assets/constant";
import * as Yup from "yup";
import { getDeviceID } from "@/helper/helper";

const otpSchema = Yup.object().shape({
    phone: Yup.string()
      .required("Số điện thoại là bắt buộc")
      .matches(/^0[0-9]{9}$/, "Số điện thoại không hợp lệ"),
  });

interface IOtpStore{
    phone: string,
    token: string,

    setPhone: (value: string) => void,
    setToken: (value: string) => void,

    requestOtp: () => Promise<boolean>
    verifyOtp: (otp: string) => Promise<boolean>
}
const service = new AuthService()
export const useOTPStore = create<IOtpStore>((set, get) => ({
    phone: "",
    token: "",
    setPhone: (value) => {
        set({phone: value})
    },
    setToken: (value) => {
        set({token: value})
    },

    requestOtp: async() => {
        try {
            await otpSchema.validate({
                phone: get().phone
            }, { context: { isCreate: true } });

            const token = await getDeviceID();
            const result = await service.requestOTP({
                phone: get().phone,
                ...(token && {token})
            });

            if (typeof result !== "string") {
                throw new Error(result.message);
            }

            return true;
        } catch (err: any) {
            useToastStore.getState().addToast(constant.toast.type.error, err.message || "An error occurred");
            return false
        }
    },

    verifyOtp: async(otp: string) => {
        try {
            await otpSchema.validate({
                phone: get().phone
            }, { context: { isCreate: true } });
            const result = await service.verifyOTP(get().phone, otp);

            if (typeof result !== "string") {
                throw new Error(result.message);
            }
            set({token: result})
            return true;
        } catch (err: any) {
            useToastStore.getState().addToast(constant.toast.type.error, err.message || "An error occurred");
            return false
        }
    },
}))