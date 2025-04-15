import { constant } from "@/assets/constant";
import { IContract } from "@/interfaces/ContractInterface";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import Phone from "@/ui/icon/active/phone";
import DetailItem from "@/ui/components/DetailItem";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Linking, ScrollView, Text, View } from "react-native";
import BoxInfo from "../BoxInfo";
import LoadingAnimation from "@/ui/LoadingAnimation";
import { BlurView } from "expo-blur";
import useContractStore from "@/store/contract/useContractStore";
import moment from "moment";
import useUserStore from "@/store/user/useUserStore";


const DetailContract: React.FC<{
  id: string;
  lodgingId: string;
}> = ({ id, lodgingId }) => {
  const { addToast } = useToastStore();
  const {genders} = useUserStore()
  const { loading, loadingProcess, contract, fetchContract, updateContract } =
    useContractStore();
  const makeCall = useCallback((phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch((err) =>
      addToast(constant.toast.type.error, "Không thể mở trình gọi điện")
    );
  }, []);

  const buttonActiveSection = useCallback(() => {
    if (!contract) return;
    let data: IContract = contract;

    if (contract.status == constant.contract.status.pending) {
      data = { ...data, status: constant.contract.status.cancel };
      return (
        <>
          <Button
            disabled={loadingProcess}
            loading={loadingProcess}
            onPress={() => updateContract(data, lodgingId)}
            className="flex-1 bg-white-50 border border-lime-400 py-4"
          >
            <Text className="text-mineShaft-900 text-14 font-BeVietnamMedium">
              Huỷ giữ chỗ
            </Text>
          </Button>
          {moment(contract.start_date).isSameOrAfter(moment(), "day") && (
            <Button
              disabled={loadingProcess}
              loading={loadingProcess}
              onPress={() => { router.push(`/lodging/${lodgingId}/contract/update/${id}`)}}
              className="flex-1 bg-lime-400 py-4"
            >
              <Text className="text-mineShaft-900 text-14 font-BeVietnamMedium">
                Chốt hợp đồng
              </Text>
            </Button>
          )}
        </>
      );
    }

    if (contract.status > constant.contract.status.active) {
      return (
        <Button
          disabled={loading}
          loading={loading}
          onPress={() => {
            router.push(`/lodging/${lodgingId}/contract/list`);
          }}
          className="flex-1 bg-white-50 border border-lime-400 py-4"
        >
          <Text className="text-mineShaft-900 text-14 font-BeVietnamMedium">
            Xem hợp đồng khác
          </Text>
        </Button>
      );
    }

    return (
      <Button onPress={() => router.push(`/lodging/${lodgingId}/contract/delete/${contract.id}`)} className="flex-1 bg-lime-400 py-4">
        <Text className="text-mineShaft-900 text-14 font-BeVietnamMedium">
          Kết thúc hợp đồng
        </Text>
      </Button>
    );
  }, [contract, lodgingId, id]);

  useEffect(() => {
    fetchContract(id);
  }, [id]);

  return (
    <View className="flex-1">
      {loading && (
        <View className="absolute inset-0 z-10 items-center justify-center">
          {/* Tạo nền mờ */}
          <BlurView
            className="absolute w-full h-full"
            intensity={30}
            tint="dark"
          />

          {/* Animation Loading */}
          <LoadingAnimation className="text-white-50" />
        </View>
      )}
      <ScrollView className="px-3 flex-1">
        <View className="flex-1 gap-2 py-3">
          <DetailItem title="Mã hợp đồng" data={`#${contract?.code ?? ""}`} />
          <DetailItem
            title="Số điện thoại"
            data={contract?.phone ?? ""}
            suffix={
              <Button
                className="bg-lime-500 gap-2 py-2 px-4 rounded-full"
                onPress={() => makeCall(contract?.phone ?? "")}
              >
                <Icon icon={Phone} className="text-lime-100" />
                <Text className="font-BeVietnamMedium text-lime-100">
                  Liên lạc
                </Text>
              </Button>
            }
          />

          <BoxInfo
            {...{
              name: contract?.full_name ?? "",
              address: contract?.address ?? "",
              birthDay: new Date(contract?.date_of_birth ?? ""),
              endDate: new Date(contract?.end_date ?? ""),
              identityCard: contract?.identity_card ?? "",
              quantity: contract?.quantity ?? 1,
              startDate: new Date(contract?.start_date ?? ""),
              time: contract?.lease_duration ?? 1,
              gender: genders.find((item) => item.value == contract?.gender),
              status: contract?.status ?? 1,
            }}
          />
        </View>
      </ScrollView>
      <View className="p-3 flex bg-white-50">
        <View className="flex-row gap-2">{buttonActiveSection()}</View>
      </View>
    </View>
  );
};

export default DetailContract;
