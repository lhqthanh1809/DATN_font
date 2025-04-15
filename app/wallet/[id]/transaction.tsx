import { constant } from "@/assets/constant";
import { reference } from "@/assets/reference";
import { cn, convertToNumber, getTimezone } from "@/helper/helper";
import { ITransaction } from "@/interfaces/TransactionInterface";
import { IWallet } from "@/interfaces/WalletInterface";
import TransactionService from "@/services/Transaction/TransactionService";
import WalletService from "@/services/Wallet/WalletService";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { Money, Wallet } from "@/ui/icon/finance";
import {
  ArrowDownCircle,
  ArrowImportCircle,
  ArrowUpCircle,
} from "@/ui/icon/symbol";
import HeaderBack from "@/ui/components/HeaderBack";
import SearchAndSegmentedControl from "@/ui/components/SearchAndSearchAndSegmentedControl";
import LoadingAnimation from "@/ui/LoadingAnimation";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { Skeleton } from "moti/skeleton";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";

const transactionService = new TransactionService();

const TransactionSkeletonItem = () => {
  return (
    <Button className="flex-col bg-white-100 p-3 gap-2 items-start">
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-center gap-2 flex-1">
          <Skeleton width={40} height={40} radius={"round"} colorMode="light" />
          <View className="gap-1 flex-1">
            <Skeleton colorMode="light" height={20} width={"34%"} />
            <Skeleton colorMode="light" height={16} width={"54%"} />
          </View>
        </View>

        <Skeleton colorMode="light" height={22} width={100} />
      </View>

      <View className="gap-1 flex-1">
        <Skeleton colorMode="light" height={20} width={"54%"} />
        <Skeleton colorMode="light" height={20} width={"86%"} />
      </View>
    </Button>
  );
};

const TransactionItem: React.FC<{
  transaction: ITransaction;
}> = ({ transaction }) => {
  const type = useMemo(() => {
    return transactionService.getReferenceType(transaction.transaction_type);
  }, [transaction.transaction_type]);
  return (
    <Button className="flex-col border-1 border-white-100 shadow-soft-xs bg-white-50 p-3 gap-2 items-start">
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-center gap-2 flex-1">
          <View className={cn("p-2 rounded-full", type.bg)}>
            <Icon icon={type.icon} className={type.text} />
          </View>
          <View className="gap-1 flex-1">
            <Text className="font-BeVietnamSemiBold truncate" numberOfLines={1}>
              {type.name}
            </Text>
            <Text
              className="font-BeVietnamRegular text-12 text-white-700 truncate"
              numberOfLines={1}
            >
              {moment(new Date(transaction.created_at))
                .tz(getTimezone())
                .format("DD/MM/YYYY HH:mm")}
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: 16,
          }}
          className={cn("font-BeVietnamSemiBold", type.text)}
        >
          {transaction.balance_after > transaction.balance_before
            ? "+"
            : transaction.balance_after < transaction.balance_before
            ? "-"
            : ""}
          {`${convertToNumber(transaction.amount.toString())} đ`}
        </Text>
      </View>

      <View className="gap-1 flex-1">
        <Text className="font-BeVietnamRegular text-white-700">
          Số dư hiện tại:{" "}
          <Text className="font-BeVietnamSemiBold text-mineShaft-950">
            {`${convertToNumber(transaction.balance_after.toString())} đ`}
          </Text>
        </Text>

        <Text className="font-BeVietnamRegular text-mineShaft-950-700">
          Nội dung: {transaction.description}
        </Text>
      </View>
    </Button>
  );
};

const TransactionEmpty = () => {
  return (
    <View className="flex-1 justify-center items-center gap-2">
      <View className="bg-mineShaft-100 p-4 rounded-full">
        <Icon icon={Wallet} />
      </View>
      <View className="items-center">
        <Text className="font-BeVietnamMedium text-16 text-mineShaft-950">
          Chưa có giao dịch nào
        </Text>
        <Text className="font-BeVietnamRegular text-white-500">
          Các giao dịch sẽ hiển thị ở đây
        </Text>
      </View>
    </View>
  );
};

function Transaction() {
  const { id } = useLocalSearchParams();
  const { addToast } = useToastStore();

  const walletService = new WalletService();
  const transactionService = new TransactionService();

  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [wallet, setWallet] = useState<IWallet | null>(null);

  const [loadingWallet, setLoadingWallet] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [type, setType] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [offsetTransaction, setOffsetTransaction] = useState(0);
  const didFirstFetch = useRef(false);

  const sourceAxios = useMemo(() => {
    return axios.CancelToken.source();
  }, []);

  const limit = 10;

  const fetchWallet = useCallback(async () => {
    setLoadingWallet(true);
    try {
      const result = await walletService.detail(id as string);

      if ("message" in result) {
        addToast(constant.toast.type.error, result.message);

        router.canGoBack() ? router.back() : router.replace("/");
        return;
      }

      setWallet(result);
    } catch (err) {
    } finally {
      setLoadingWallet(false);
    }
  }, [id]);

  const fetchListTransaction = useCallback(
    async (cancelToken: any, loadMore: boolean = false) => {
      let offset = 0;
      if (loadMore) {
        if (!hasMore) return;
        offset = offsetTransaction + limit;
      }
      
      loadMore ? setLoadingMore(true) : setLoadingTransactions(true);
      try {
        const result = await transactionService.listByWallet(
          {
            wallet_id: id as string,
            offset,
            limit,
            type,
          },
          cancelToken
        );

        if ("message" in result) {
          addToast(constant.toast.type.error, result.message);
          return;
        }

        setHasMore(result.total - (offset + limit) > 0);

        setTransactions((prev) =>
          loadMore ? [...prev, ...result.data] : result.data
        );
      } finally {
        loadMore ? setLoadingMore(false) : setLoadingTransactions(false);
      }
    },
    [type, id, offsetTransaction, limit, hasMore]
  );

  const fetchFirstMount = useCallback(async (cancelToken: any) => {
    await Promise.all([fetchWallet(), fetchListTransaction(cancelToken)]);
  }, []);

  useEffect(() => {
    fetchFirstMount(sourceAxios.token);
    return () => sourceAxios.cancel("Huỷ request do unmount");
  }, []);

  useEffect(() => {
    if (didFirstFetch.current) {
      fetchListTransaction(sourceAxios.token);
      return () => sourceAxios.cancel("Huỷ request do thay đổi type");
    } else {
      didFirstFetch.current = true;
    }
  }, [type]);

  return (
    <View className="flex-1 bg-white-50">
      <HeaderBack title="Lịch sử giao dịch" />
      <View className="flex-1">
        <View className="bg-white-50 px-2 gap-2">
          <View className="pt-6 px-2 gap-1">
            <Text className="font-BeVietnamRegular text-white-700">
              Số dư hiện tại
            </Text>
            {loadingWallet ? (
              <Skeleton height={32} width={"40%"} colorMode="light" />
            ) : (
              <Text className="font-BeVietnamBold text-2xl text-mineShaft-950">
                {`${convertToNumber((wallet?.balance ?? 0).toString())} đ`}
              </Text>
            )}
          </View>

          <View className="py-3">
            <SearchAndSegmentedControl
              hasSearch={false}
              onChangeStatus={(value) => setType(value)}
              dataObject={reference.transaction.type}
            />
          </View>
        </View>

        {loadingTransactions ? (
          <ScrollView
            className="flex-1 px-3"
            contentContainerStyle={{
              paddingBottom: 12,
            }}
          >
            <View className="flex-1 gap-3">
              {[...Array(4)].map((_, index) => (
                <TransactionSkeletonItem key={index} />
              ))}
            </View>
          </ScrollView>
        ) : transactions.length <= 0 ? (
          <TransactionEmpty />
        ) : (
          <ScrollView
            scrollEventThrottle={400}
            onScroll={({ nativeEvent }) => {
              const { layoutMeasurement, contentOffset, contentSize } =
                nativeEvent;
              const isCloseToBottom =
                layoutMeasurement.height - contentOffset.y >=
                contentSize.height - 20;

              if (isCloseToBottom && hasMore && (!loadingMore)) {
                fetchListTransaction(sourceAxios.token, true);
              }
            }}
            className="flex-1 px-3"
            contentContainerStyle={{
              paddingBottom: 12,
            }}
          >
            <View className="flex-1 gap-3">
              {transactions.map((transaction) => (
                <TransactionItem
                  transaction={transaction}
                  key={transaction.id}
                />
              ))}

              {loadingMore && (
                <View>
                  <LoadingAnimation />
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

export default Transaction;
