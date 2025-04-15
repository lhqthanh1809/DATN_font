import { constant } from "@/assets/constant";
import { cn, formatPhone } from "@/helper/helper";
import useToastStore from "@/store/toast/useToastStore";
import { useOTPStore } from "@/store/useOTPStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { ChevronLeft } from "@/ui/icon/symbol";
import Input from "@/ui/Input";
import HeaderBack from "@/ui/components/HeaderBack";
import { Href, router } from "expo-router";
import moment from "moment";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from "react-native";
import { SvgUri } from "react-native-svg";

function RequestOTP() {
  const [height, setHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { phone, requestOtp, verifyOtp } = useOTPStore();
  const [loading, setLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState("00:30"); 
  const [isTimeUp, setIsTimeUp] = useState(false);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const numInputs = 4;
  const [otp, setOtp] = useState(new Array(numInputs).fill(""));
  const inputsRef: RefObject<TextInput>[] = [...Array(numInputs)].map(() => useRef<TextInput>(null));

  const handleChange = useCallback((text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (index < numInputs - 1) {
      inputsRef[index + 1]!.current?.focus();
    }
  }, [inputsRef]);

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputsRef[index - 1]!.current?.focus();
    }
  };

  const handleVerifyOtp = useCallback(async() => {
    setLoading(true)
    try{
      const result  = await verifyOtp(otp.join(""))

      if(result){
        router.replace("/auth/reset_password" as Href)
      }
    }
    catch(err: any){
      useToastStore.getState().addToast(constant.toast.type.error, err.message || "An error occurred");
    }finally{
      setLoading(false)
    }
  }, [otp])


  const reRequestOtp = useCallback(async () => {
    setIsTimeUp(false);
    setTimeLeft("00:30")
    startCountdown();
    await requestOtp();
  }, [requestOtp]); 
  
  const startCountdown = () => {
    const targetTime = moment().add(31, "seconds");
  
    countdownIntervalRef.current = setInterval(() => {
      const now = moment();
      const diff = targetTime.diff(now);
  
      if (diff <= 0) {
        clearInterval(countdownIntervalRef.current!);
        setTimeLeft("00:00");
        setIsTimeUp(true);
      } else {
        const duration = moment.duration(diff);
        const minutes = duration.minutes();
        const seconds = duration.seconds();
  
        setTimeLeft(
          `${minutes < 10 ? "0" + minutes : minutes}:${
            seconds < 10 ? "0" + seconds : seconds
          }`
        );
      }
    }, 1000);
  };
  
  useEffect(() => {
    startCountdown(); 
  
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
    >
      <View className="flex-1 bg-white-50">
        <View className="px-6 bg-white-50 py-4 flex-row items-center gap-3">
          <Pressable
            onPress={() => {
              router.back();
            }}
            className="flex items-center justify-center absolute left-6 z-10 p-1 rounded-full"
          >
            <Icon icon={ChevronLeft} className="text-mineShaft-950" />
          </Pressable>
          <Text className="font-BeVietnamBold text-2xl text-mineShaft-950 w-full text-center">
            Xác thực
          </Text>
        </View>
        <ScrollView
          className="flex-1"
          onLayout={(event) => {
            setHeight(event.nativeEvent.layout.height);
          }}
        >
          <View
            className="flex-1 justify-center gap-16 py-3"
            style={
              !keyboardVisible && {
                height: height,
              }
            }
          >
            <SvgUri
              width={"100%"}
              uri={
                "https://qqmdkbculairrumaowaj.supabase.co/storage/v1/object/public/lodging_management/asset/input_otp.svg"
              }
            />

            <View className="px-6 gap-4">
              <View className="gap-2">
                <Text className="font-BeVietnamBold text-20 text-center text-mineShaft-950">
                  Nhập OTP
                </Text>

                <View className="px-9 gap-1">
                  <Text className="text-center font-BeVietnamRegular text-mineShaft-800">
                    Mã OTP với 4 số đã được gửi tới
                  </Text>
                  <Text className="text-center font-BeVietnamBold text-mineShaft-950">
                    {formatPhone(phone)}
                  </Text>
                </View>
              </View>

              <View className="pb-2 px-5 flex-row gap-5">
                {otp.map((digit, index) => (
                  <View key={index} className="flex-1">
                    <Input
                      maxLength={1}
                      value={digit}
                      className="h-20"
                      classNameInput="text-center text-2xl font-BeVietnamBold text-mineShaft-950"
                      type="code"
                      onChange={(text) => handleChange(text, index)}
                      onKeyPress={(event) => handleKeyPress(event, index)}
                      ref={inputsRef[index]}
                    />
                  </View>
                ))}
              </View>

              <Button disabled={loading} loading={loading} onPress={() => handleVerifyOtp()} className="w-full py-4 bg-lime-400">
                <Text className="text-mineShaft-950 text-18 font-BeVietnamSemiBold">
                  Xác nhận
                </Text>
              </Button>

              <View className="pt-4">
                <Button disabled={!isTimeUp} onPress={() => reRequestOtp()}>
                  <Text className={cn("font-BeVietnamSemiBold text-center text-16", isTimeUp ? "text-mineShaft-950" : "text-mineShaft-700")}>
                    Gửi lại OTP{" "}
                    {!isTimeUp && (
                      <Text className="text-mineShaft-300 text-14 font-BeVietnamMedium">
                        ({timeLeft})
                      </Text>
                    )}
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

export default RequestOTP;
