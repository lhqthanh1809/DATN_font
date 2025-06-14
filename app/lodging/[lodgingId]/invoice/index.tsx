import { constant } from "@/assets/constant";
import { cn } from "@/helper/helper";
import { IRoomRentalHistory } from "@/interfaces/RoomRentalHistoryInterface";
import { IRoomServiceInvoice } from "@/interfaces/RoomServiceInvoiceInterface";
import ListRental, {
  RoomRentalItem,
} from "@/pages/Invoice/List/ListRoomRentInvoice";
import ListRoomServiceInvoice, {
  RoomServiceInvoiceItem,
} from "@/pages/Invoice/List/ListRoomServiceInvoice";
import InvoiceService from "@/services/Invoice/InvoiceService";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import HeaderBack from "@/ui/components/HeaderBack";
import TabsLine from "@/ui/components/TabsLine";
import Divide from "@/ui/Divide";
import Icon from "@/ui/Icon";
import { Search } from "@/ui/icon/active";
import { ChevronRight, Home2, Receipt } from "@/ui/icon/symbol";
import Input from "@/ui/Input";
import LoadingAnimation from "@/ui/LoadingAnimation";
import MonthPicker from "@/ui/MonthPicker";
import axios from "axios";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { debounce } from "lodash";
import moment from "moment";
import { Skeleton } from "moti/skeleton";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FlatList, ScrollView, Text, View } from "react-native";

const tabsInvoice = [
  { value: "unpaid", name: "Chưa thanh toán" },
  { value: "paid", name: "Thanh toán xong" },
];

const tabs = [
  {
    value: "rent",
    name: "Tiền phòng",
  },
  {
    value: "service",
    name: "Dịch vụ",
  },
];

function Invoice() {
  const { typeInvoice, time } = useLocalSearchParams();

  const { lodgingId } = useLocalSearchParams();
  const { addToast } = useToastStore();
  const invoiceService = new InvoiceService();
  const [tabInvoice, setTabInvoice] = useState(tabsInvoice[0]);
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<
    (IRoomRentalHistory | IRoomServiceInvoice)[]
  >([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = constant.limit;

  const [search, setSearch] = useState("");
  const [timeBilling, setTimeBilling] = useState<Date | null>(
    time ? moment(time).toDate() : null
  );

  const [sourceAxios, setSourceAxios] = useState(axios.CancelToken.source());
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState(
    tabs.find((item) => item.value === typeInvoice) || tabs[0]
  );

  const fetchInvoice = useCallback(
    async (cancelToken: any, loadMore: boolean = false) => {
      loadMore ? setLoadingMore(true) : setLoading(true);
      try {
        if (loadMore && !hasMore) return;
        let offsetNew = loadMore ? offset + limit : 0;
        const result = await invoiceService.list(
          {
            lodging_id: lodgingId as string,
            offset: offsetNew,
            limit,
            type: tab.value,
            status: tabInvoice.value,
            room_code: search,
            ...(timeBilling && {
              month: timeBilling.getMonth() + 1,
              year: timeBilling.getFullYear(),
            }),
          },
          cancelToken
        );

        if ("message" in result) {
          // addToast(constant.toast.type.error, result.message);
          return;
        }

        setHasMore(result.total > offsetNew + result.data.length);
        setInvoices((prev) =>
          loadMore ? [...prev, ...result.data] : result.data
        );
        setOffset(offsetNew);
      } catch (error) {
        if (!axios.isCancel(error)) {
          addToast(constant.toast.type.error, "Failed to fetch invoices");
        }
      } finally {
        loadMore ? setLoadingMore(false) : setLoading(false);
      }
    },
    [lodgingId, tab, tabInvoice, search, offset, hasMore, limit, timeBilling]
  );

  // Debounced search handler
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchInvoice(sourceAxios.token);
    }, 100);

    return () => clearTimeout(delayDebounce);
  }, [search, timeBilling]);

  useEffect(() => {
    if (ready && sourceAxios) {
      fetchInvoice(sourceAxios.token);
    }
  }, [tab, tabInvoice, ready, sourceAxios]);

  // Cleanup on unmount

  useFocusEffect(
    useCallback(() => {
      const newSource = axios.CancelToken.source();
      setSourceAxios(newSource);
      setReady(true);
      return () => {
        sourceAxios.cancel("Component unmounted");
      };
    }, [])
  );

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchInvoice(sourceAxios.token, true);
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <HeaderBack title="Danh sách hoá đơn" />
      {/* Filter */}
      <View className="bg-white-50 py-3 gap-2">
        <View className="px-3">
          <Input
            value={search}
            onChange={setSearch}
            placeHolder="Tìm theo tên phòng..."
            prefix={<Icon icon={Search} />}
          />
        </View>
        <View className="">
          <TabsLine
            tabs={tabsInvoice}
            active={tabInvoice}
            onChange={(tab) => {
              setLoading(true);
              setTabInvoice(tab);
            }}
          />
        </View>

        {/* Tab cho các dạng hoá đơn dịch vụ/phòng  */}
        <View
          className="flex-row relative border-white-100 gap-2 px-3"
          style={{ borderBottomWidth: 1 }}
        >
          {tabs.map((item, index) => (
            <Button
              className={cn(
                "py-3 flex-1 bg-white-50 border-1",
                item === tab ? "border-lime-400" : "border-white-300"
              )}
              key={item.name}
              onPress={() => setTab(item)}
            >
              <Text
                style={{
                  fontSize: 13,
                }}
                className={cn(
                  "font-BeVietnamMedium",
                  item === tab ? "text-lime-600" : "text-mineShaft-950"
                )}
              >
                {item.name}
              </Text>
            </Button>
          ))}
        </View>
        <View className="px-3">
          <MonthPicker
            showIcon
            value={timeBilling}
            onChange={(date) => {
              setTimeBilling(date);
            }}
          />

          
        </View>
      </View>

      {!loading && invoices.length <= 0 ? (
        <InvoiceEmpty />
      ) : (
        <FlatList
          data={loading ? Array(2).fill("") : invoices}
          renderItem={({ item, index }) =>
            loading ? (
              <InvoiceSkeleton key={index} />
            ) : tab.value === "rent" ? (
              <RoomRentalItem item={item} lodgingId={lodgingId as string} />
            ) : (
              <RoomServiceInvoiceItem
                item={item}
                lodgingId={lodgingId as string}
              />
            )
          }
          keyExtractor={(_, index) => index.toString()}
          onEndReached={() => {
            if (!loadingMore && hasMore && !loading) {
              handleLoadMore();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View className="py-1">
                <LoadingAnimation />
              </View>
            ) : null
          }
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingVertical: 12,
            gap: 12,
          }}
        />
      )}
    </View>
  );
}

const InvoiceSkeleton = React.memo(() => {
  return (
    <Button className="w-full bg-white-100 rounded-xl p-4 flex-col items-start  gap-4">
      <Skeleton.Group show={true}>
        <View className="flex-row justify-between w-full gap-4">
          <View className="flex-row items-center gap-3 flex-1">
            <Skeleton
              width={40}
              height={40}
              radius={"round"}
              colorMode="light"
            />
            <View className="gap-1 flex-1">
              <Skeleton width={"70%"} height={20} colorMode="light" />
              <Skeleton width={"30%"} height={16} colorMode="light" />
            </View>
          </View>
        </View>
        <Divide className="h-0.25 bg-white-100" />
        <Skeleton width={"100%"} height={60} colorMode="light" />
      </Skeleton.Group>
    </Button>
  );
});

const InvoiceEmpty = () => {
  return (
    <View className="flex-1 justify-center items-center gap-2 px-7">
      <View className="bg-mineShaft-100 p-4 rounded-full">
        <Icon icon={Receipt} />
      </View>
      <View className="items-center">
        <Text className="font-BeVietnamMedium text-16 text-mineShaft-950">
          Không tìm thấy hoá đơn phù hợp
        </Text>
        <Text className="font-BeVietnamRegular text-white-500 text-center">
          Hãy thử thay đổi bộ lọc hoặc kiểm tra lại kết nối mạng.
        </Text>
      </View>
    </View>
  );
};

export default Invoice;
