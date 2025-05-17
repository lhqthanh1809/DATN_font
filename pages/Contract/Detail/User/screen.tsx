import { constant } from "@/assets/constant";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import DetailItem from "@/ui/components/DetailItem";
import BoxInfo from "../BoxInfo";
import { router } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import useContractStore from "@/store/contract/useContractStore";
import useUserStore from "@/store/user/useUserStore";
import LoadingScreen from "@/ui/layouts/LoadingScreen";
import { cn } from "@/helper/helper";

interface DetailContractProps {
  id: string;
}

const DetailContract: React.FC<DetailContractProps> = ({ id }) => {
  const { addToast } = useToastStore();
  const { genders } = useUserStore();
  const { loading, contract, fetchContract } = useContractStore();

  useEffect(() => {
    fetchContract(id);
  }, [id]);

  const isAllowFeedback = useMemo(() => {
    return (
      contract?.status === constant.contract.status.active ||
      contract?.status === constant.contract.status.overdue
    );
  }, [contract?.status]);

  const buttonLabel = useMemo(() => {
    return isAllowFeedback ? "Phản hồi" : "Quay lại";
  }, [isAllowFeedback]);

  const buttonStyle = useMemo(() => {
    return isAllowFeedback
      ? "bg-lime-400"
      : "border-1 border-lime-500 bg-white-50";
  }, [isAllowFeedback]);

  const textStyle = useMemo(() => {
    return isAllowFeedback ? "text-mineShaft-950" : "text-lime-500";
  }, [isAllowFeedback]);

  const genderData = useMemo(() => {
    return genders.find((item) => item.value === contract?.gender);
  }, [genders, contract?.gender]);

  const boxInfoProps = useMemo(() => {
    if (!contract) return undefined;

    return {
      phone: contract.phone ?? "",
      name: contract.full_name ?? "",
      address: contract.address ?? "",
      birthDay: new Date(contract.date_of_birth ?? ""),
      endDate: new Date(contract.end_date ?? ""),
      identityCard: contract.identity_card ?? "",
      quantity: contract.quantity ?? 1,
      startDate: new Date(contract.start_date ?? ""),
      time: contract.lease_duration ?? 1,
      gender: genderData,
      status: contract.status ?? 1,
    };
  }, [contract, genderData]);

  const handleButtonPress = () => {
    if (isAllowFeedback) {
      router.push(
        `/feedback/create?lodging_id=${contract?.room?.lodging_id}&room_id=${contract?.room_id}`
      );
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-1">
      {loading && <LoadingScreen />}
      <ScrollView className="px-3 flex-1">
        <View className="flex-1 gap-2 py-3">
          <DetailItem title="Mã hợp đồng" data={`#${contract?.code ?? ""}`} />
          {boxInfoProps && <BoxInfo {...boxInfoProps} />}
        </View>
      </ScrollView>
      <View className="p-3 bg-white-50">
        <View className="flex-row gap-2">
          <Button
            onPress={handleButtonPress}
            className={cn("flex-1 py-4", buttonStyle)}
          >
            <Text className={cn("font-BeVietnamMedium", textStyle)}>
              {buttonLabel}
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default DetailContract;
