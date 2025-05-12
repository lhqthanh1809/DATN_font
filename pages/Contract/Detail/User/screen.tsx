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
import useContractStore from "@/store/contract/useContractStore";
import moment from "moment";
import useUserStore from "@/store/user/useUserStore";
import LoadingScreen from "@/ui/layouts/LoadingScreen";
import { cn } from "@/helper/helper";

const DetailContract: React.FC<{
  id: string;
}> = ({ id }) => {
  const { addToast } = useToastStore();
  const { genders } = useUserStore();
  const { loading, contract, fetchContract } = useContractStore();

  useEffect(() => {
    fetchContract(id);
  }, [id]);

  return (
    <View className="flex-1">
      {loading && <LoadingScreen />}
      <ScrollView className="px-3 flex-1">
        <View className="flex-1 gap-2 py-3">
          <DetailItem title="Mã hợp đồng" data={`#${contract?.code ?? ""}`} />

          <BoxInfo
            {...{
              phone: contract?.phone ?? "",
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
        <View className="flex-row gap-2">
          <Button
            onPress={() =>
              contract?.status == constant.contract.status.active
                ? router.push(
                    `/feedback/create?lodging_id=${contract?.room?.lodging_id}&room_id=${contract?.room_id}`
                  )
                : router.back()
            }
            className={cn("flex-1 py-4", contract?.status == constant.contract.status.active ? "bg-lime-400" : "border-1 border-lime-400 bg-white-50")}
          >
            <Text className={cn("text-mineShaft-950 font-BeVietnamMedium", contract?.status == constant.contract.status.active ? "text-mineShaft-950" : "text-lime-500")}>
              {contract?.status == constant.contract.status.active ? "Phản hồi" : "Quay lại"}
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default DetailContract;
