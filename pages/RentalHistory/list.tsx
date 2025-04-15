import { constant } from "@/assets/constant";
import { reference } from "@/assets/reference";
import { cn, convertToDate, convertToNumber, env } from "@/helper/helper";
import { IListRental, IRentalHistory } from "@/interfaces/RentalInterface";
import RentalHistory from "@/services/RentalHistory/RentalHistoryService";
import { useRentalHistoryStore } from "@/store/rentalHistory/useRentalHistoryStore";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import Divide from "@/ui/Divide";
import Icon from "@/ui/Icon";
import { CheckCircle, Error, Warning } from "@/ui/icon/symbol";
import SearchAndSegmentedControl from "@/ui/components/SearchAndSearchAndSegmentedControl";
import axios from "axios";
import { isArray } from "lodash";
import moment from "moment";
import { Skeleton } from "moti/skeleton";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import RentalHistoryItem from "./components/RentalHistoryItem";
import RentalHistoryItemLoading from "./components/RentalHistoryItemLoading";

const ListRentalHistory: React.FC<{
  lodgingId?: string;
  contractId: string;
}> = ({ lodgingId, contractId }) => {
  const [rentals, setRentals] = useState<IRentalHistory[]>([]);
  const { addToast } = useToastStore();
  const [isLoading, setIsLoading] = useState(true);
  const [statusActive, setStatusActive] = useState<number | null>(null);

  const fetchRental = useCallback(
    async (cancelToken: any) => {
      setIsLoading(true);

      const data: IListRental = {
        contract_id: contractId,
        status: statusActive,
        ...(lodgingId && { lodging_id: lodgingId })
      };

      const res = await new RentalHistory().list(data, cancelToken);

      if (isArray(res)) {
        setRentals(res);
      }
      if (!cancelToken.reason) setIsLoading(false);
    },
    [statusActive, lodgingId, contractId]
  );

  useEffect(() => {
    const source = axios.CancelToken.source();
    fetchRental(source.token);

    return () => {
      source.cancel("Hủy request do mất focus hoặc dữ liệu thay đổi");
    };
  }, [statusActive, lodgingId, contractId]);

  return (
    <View className="flex-1 gap-2 pt-3">
      <SearchAndSegmentedControl
        onChangeStatus={(status) => setStatusActive(status)}
        hasSearch={false}
        dataObject={reference.payment.status}
      />
      <ScrollView className="px-3 flex-1">
        <View className="flex-1 gap-4 pb-3">
          {isLoading
            ? Array(4)
                .fill("")
                .map((_, index) => (
                  <RentalHistoryItemLoading key={index} />
                ))
            : rentals.map((rental) => (
                <RentalHistoryItem key={rental.id} rental={rental} lodgingId={lodgingId} />
              ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ListRentalHistory;
