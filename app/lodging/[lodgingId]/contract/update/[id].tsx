import { constant } from "@/assets/constant";
import { env, formatDateForRequest, formatNumber } from "@/helper/helper";
import { IContract } from "@/interfaces/ContractInterface";
import BoxInfo from "@/pages/Contract/BoxInfo";
import BoxPrice from "@/pages/Contract/Create/BoxPrice";
import useContractStore from "@/store/contract/useContractStore";
import useUserStore from "@/store/user/useUserStore";
import Button from "@/ui/Button";
import DetailItem from "@/ui/components/DetailItem";
import Layout from "@/ui/layouts/Layout";
import LoadingScreen from "@/ui/layouts/LoadingScreen";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";

function CreateContract() {
  const { id, name, price, lodgingId } = useLocalSearchParams();
  const { genders } = useUserStore();
  const { contract, fetchContract, updateContract, loading, loadingProcess } =
    useContractStore();
  const [nameCustom, setNameCustom] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [time, setTime] = useState(1);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [birthDay, setBirthDay] = useState<Date>(new Date());
  const [address, setAddress] = useState("");
  const [identityCard, setIdentityCard] = useState("");
  const [endDate, setEndDate] = useState<Date>(startDate);
  const [depositAmount, setDepositAmount] = useState<string>(price as string);
  const [gender, setGender] = useState(genders[0]);

  useEffect(() => {
    if (!contract) return;

    setNameCustom(contract.full_name);
    setPhone(contract.phone);
    setQuantity(contract.quantity);
    setTime(contract.lease_duration);
    setDepositAmount(contract.deposit_amount.toString());
    setStartDate(new Date(contract.start_date ?? startDate));
    setEndDate(contract.end_date ? new Date(contract.end_date) : endDate);

    setBirthDay(
      contract.date_of_birth ? new Date(contract.date_of_birth) : birthDay
    );
    setAddress(contract.address ?? address);
    setIdentityCard(contract.identity_card ?? identityCard);
    setGender(genders.find((item) => item.value == contract.gender) ?? gender);
  }, [contract]);

  const handleUpdateContract = useCallback(async () => {
    if (!contract) return;
    const data: IContract = {
      ...contract,
      address,
      phone,
      date_of_birth: formatDateForRequest(birthDay),
      end_date: formatDateForRequest(endDate),
      full_name: nameCustom,
      deposit_amount: formatNumber(depositAmount, "float") || 0,
      gender: gender.value,
      identity_card: identityCard,
      lease_duration: time,
      quantity,
      room_id: id as string,
      start_date: formatDateForRequest(startDate),
      status: constant.contract.status.active,
    };
    updateContract(data, lodgingId as string, true);
  }, [
    contract,
    lodgingId,
    id,
    nameCustom,
    phone,
    address,
    quantity,
    time,
    startDate,
    birthDay,
    identityCard,
    endDate,
    depositAmount,
    gender,
  ]);

  return (
    <View className="flex-1">
      <Layout
        title={`Chốt hợp đồng ${contract?.code && `- #${contract.code}`} `}
      >
      {loading && <LoadingScreen />}
        <ScrollView className="px-3 flex-grow bg-white-50">
          <View className="gap-3 items-center py-3 flex-1">
            {contract && contract.room && (
              <DetailItem title="Phòng" data={contract?.room?.room_code} />
            )}

            <BoxInfo
              {...{
                address,
                birthDay,
                endDate,
                gender,
                identityCard,
                phone,
                quantity,
                setAddress,
                setBirthDay,
                setEndDate,
                setGender,
                setIdentityCard,
                setPhone,
                setQuantity,
                setStartDate,
                setTime,
                time,
                startDate,
                name: nameCustom,
                setName: setNameCustom,
                disabled: ["phone"],
              }}
            />
            <BoxPrice
              priceRoom={contract?.room?.price?.toString() ?? ""}
              {...{ depositAmount, setDepositAmount }}
            />
          </View>
        </ScrollView>
        <View className="p-3 flex bg-white-50">
          <View className="flex-row">
            <Button
              disabled={loadingProcess}
              loading={loadingProcess}
              onPress={() => {
                handleUpdateContract();
              }}
              className="flex-1 bg-lime-400 py-4"
            >
              <Text className="text-mineShaft-900 text-16 font-BeVietnamSemiBold">
                Hoàn thành
              </Text>
            </Button>
          </View>
        </View>
      </Layout>
    </View>
  );
}

export default CreateContract;
