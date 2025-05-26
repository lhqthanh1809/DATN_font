import { useUI } from "@/hooks/useUI";
import { IContract } from "@/interfaces/ContractInterface";
import { IRoom } from "@/interfaces/RoomInterface";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Keyboard, Text, View } from "react-native";
import Icon from "../Icon";
import { CrossMedium, Document, Time } from "../icon/symbol";
import Button from "../Button";
import Divide from "../Divide";
import { reference } from "@/assets/reference";
import moment, { duration } from "moment";
import ContractService from "@/services/Contract/ContractService";
import {
  cn,
  convertToNumber,
  formatDateForRequest,
  formatNumber,
} from "@/helper/helper";
import DatePicker from "../Datepicker";
import Input from "../Input";
import Label from "../Label";
import { ScrollView } from "moti";
import * as Yup from "yup";
import useToastStore from "@/store/toast/useToastStore";
import { constant } from "@/assets/constant";

const schema = Yup.object()
  .shape({
    end_date: Yup.date()
      .nullable()
      .notRequired()
      .typeError("Ngày kết thúc phải là ngày hợp lệ"),
    duration: Yup.number()
      .nullable()
      .notRequired()
      .typeError("Thời gian gia hạn phải là số"),
  })
  .test(
    "at-least-one",
    "Phải cung cấp ít nhất một trong hai: end_date hoặc duration",
    function (value) {
      return !!value.end_date || !!value.duration;
    }
  );

const ModalExtensionContract: React.FC<{
  contract: IContract;
  room: IRoom;

  setContract: (contract: IContract) => void;
}> = ({ contract, room, setContract }) => {
  const { hideModal } = useUI();
  const { addToast } = useToastStore();
  const [endDate, setEndDate] = useState(new Date());
  const [duration, setDuration] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const { status, displayDurationTimeRent } = useMemo(() => {
    const startDate = moment(contract.start_date);
    const endDate = contract.end_date
      ? moment(contract.end_date)
      : startDate.clone().add(contract.lease_duration, "months");

    const formattedStartDate = startDate.format("DD/MM/YYYY");
    const formattedEndDate = endDate.format("DD/MM/YYYY");

    const status = new ContractService().getReferenceToStatus(contract.status);

    return {
      status,
      displayDurationTimeRent: `${formattedStartDate} - ${formattedEndDate}`,
    };
  }, [contract]);

  const calcEndDate = useCallback(
    (duration: number) => {
      return moment(contract.start_date)
        .add(contract.lease_duration + (duration || 0), "months")
        .toDate();
    },
    [contract]
  );

  const handleExtensionContract = useCallback(async () => {
    setProcessing(true);
    try {
      await schema.validate(
        {
          end_date: endDate,
          duration,
        },
        { abortEarly: false }
      );

      let data: { contract_id: string; end_data?: string; duration?: number } =
        {
          contract_id: contract.id,
          ...(endDate ? { end_date: formatDateForRequest(endDate) } : {}),
        };

      const durationNumber = duration
        ? formatNumber(duration, "int")
        : undefined;

      if (durationNumber) {
        data.duration = durationNumber;
      }

      const res = await new ContractService().extension(data);

      if ("message" in res) {
        throw new Error(res.message);
      }

      setContract(res);
      addToast(
        constant.toast.type.success,
        "Gia hạn hợp đồng thành công!"
      );
      hideModal();
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((e) => {
          addToast(constant.toast.type.error, e.message);
        });
      } else {
        addToast(
          constant.toast.type.error,
          err.message || "Đã có lỗi xảy ra, vui lòng thử lại"
        );
      }
    } finally {
      setProcessing(false);
    }
  }, [endDate, duration, contract]);

  useEffect(() => {
    if (duration === null) return;

    setEndDate(calcEndDate(parseInt(duration)));
  }, [duration]);

  useEffect(() => {
    const expectedEndDate = calcEndDate(parseInt(duration || ""));

    if (expectedEndDate.getTime() !== endDate.getTime()) {
      setDuration(null);
    }
  }, [endDate]);

  return (
    <Button
      onPress={() => {
        !processing && hideModal();
      }}
      className="flex-1 items-center justify-center"
    >
      <View className="w-full px-6">
        <Button
          className={cn(
            "bg-white-50 p-5 rounded-xl flex-col items-stretch",
            keyboardVisible && "max-h-96"
          )}
        >
          {/* Title */}
          <View className="gap-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Icon icon={Document} />
                <Text className="font-BeVietnamMedium text-16">
                  Gia hạn hợp đồng
                </Text>
              </View>

              <Button onPress={hideModal} disabled={processing}>
                <Icon icon={CrossMedium} />
              </Button>
            </View>

            <Divide className="h-0.25" />
          </View>
          <ScrollView className="">
            <Button className="flex-col items-stretch">
              <View className="p-4 bg-white-100 rounded-xl gap-3">
                <Text className="font-BeVietnamMedium">
                  Thông tin hợp đồng hiện tại
                </Text>

                <View className="gap-2">
                  <InfoContract title="Phòng" data={room.room_code} />
                  <InfoContract
                    title="Mã hợp đồng"
                    data={`#${contract.code}`}
                  />
                  <InfoContract
                    title="Thời hạn"
                    data={displayDurationTimeRent}
                  />
                  <InfoContract
                    title="Trạng thái"
                    data={
                      <Text className={cn(status.bg.replace("bg", "text"))}>
                        {status.name}
                      </Text>
                    }
                  />
                  <InfoContract
                    title="Khách thuê"
                    data={`${contract.full_name}`}
                  />
                </View>
              </View>

              <View className="flex-col gap-4">
                <Text className="font-BeVietnamMedium">Thông tin gia hạn</Text>

                <Input
                  value={duration ? duration : ""}
                  type="number"
                  suffix={<Label label="tháng" />}
                  label="Thời gian gia hạn thêm"
                  onChange={(text) => setDuration(text)}
                />

                <View className="h-[4.8rem]">
                  <DatePicker
                    value={endDate}
                    label="Thời gian kết thúc mới"
                    onChange={setEndDate}
                  />
                </View>
              </View>

              <View className="gap-3">
                <Button
                  onPress={handleExtensionContract}
                  disabled={processing}
                  loading={processing}
                  className="bg-lime-400 py-3"
                >
                  <Text className="font-BeVietnamMedium text-lime-50">
                    Xác nhận gia hạn
                  </Text>
                </Button>

                <Button
                  disabled={processing}
                  onPress={hideModal}
                  className="bg-mineShaft-100 py-3"
                >
                  <Text className="font-BeVietnamMedium">Huỷ</Text>
                </Button>
              </View>
            </Button>
          </ScrollView>
        </Button>
      </View>
    </Button>
  );
};

const InfoContract = ({
  title,
  data,
}: {
  title: string;
  data: string | ReactNode;
}) => {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="font-BeVietnamRegular text-white-600 text-12">
        {title}:
      </Text>
      <Text className="font-BeVietnamMedium text-mineShaft-950 text-12">
        {data}
      </Text>
    </View>
  );
};

export default ModalExtensionContract;
