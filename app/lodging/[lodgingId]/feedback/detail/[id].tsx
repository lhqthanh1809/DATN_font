import React from "react";
import Button from "@/ui/Button";
import Layout from "@/ui/layouts/Layout";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import ClientService from "@/services/Client/ClientService";
import { router, useLocalSearchParams } from "expo-router";
import { IFeedback } from "@/interfaces/FeedbackInterface";
import FeedbackService from "@/services/Feedback/FeedbackService";
import { constant } from "@/assets/constant";
import { cn } from "@/helper/helper";
import ImageViewBox from "@/ui/ImageViewBox";
import LoadingAnimation from "@/ui/LoadingAnimation";
import DetailItem from "@/ui/components/DetailItem";
import { useUI } from "@/hooks/useUI";
import { BlurView } from "expo-blur";
import Icon from "@/ui/Icon";
import { Warning } from "@/ui/icon/symbol";
import { Channel } from "@ably/laravel-echo";
import { initializeEcho } from "@/utils/echo";
import { IDataRealtime } from "@/interfaces/GeneralInterface";

function Detail() {
  const { id, lodgingId } = useLocalSearchParams();
  const { showModal } = useUI();
  const [feedback, setFeedback] = useState<IFeedback | null>(null);

  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const clientService = new ClientService();
  const feedbackService = new FeedbackService();

  const titleButtonAction = useMemo(() => {
    return {
      [constant.feedback.status.received]: "Xác nhận",
      [constant.feedback.status.in_progress]: "Xử lý",
      [constant.feedback.status.resolved]: "Hoàn thành",
    };
  }, []);

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    const data = await feedbackService.detail(id as string);

    if (!data || data.hasOwnProperty("message")) {
      router.back();
    }
    setFeedback(data as IFeedback);

    setLoading(false);
  }, [id]);

  const handleUpdateFeedback = useCallback(
    async (status: number) => {
      setProcessing(true);
      try {
        const data = await feedbackService.updateStatus({
          feedback_id: id as string,
          status: status,
          lodging_id: lodgingId as string,
        });

        if (!data || data.hasOwnProperty("message")) {
          return;
        }
        setFeedback(data as IFeedback);
      } catch (err) {
        console.log(err);
      } finally {
        setProcessing(false);
      }
    },
    [id, lodgingId]
  );

  useEffect(() => {
    fetchFeedback();
  }, []);

  useEffect(() => {
    let channel: Channel | null = null;
    const setupEcho = async () => {
      try {
        const echo = await initializeEcho();
        channel = echo.private(`feedback.lodging.${lodgingId}`);
        channel.listen(".delete", (payload: IDataRealtime<IFeedback>) => {
          if (payload.data.id == id) {
            showModal(<ModalHasDeletedFeedback />);
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    setupEcho();
    return () => {
      if (channel) {
        channel.stopListening(".delete");
      }
    };
  }, [lodgingId, id]);

  return (
    <Layout title="Đóng góp ý kiến">
      {loading && (
        <View className="bg-mineShaft-950/90 z-10 absolute h-full w-full top-0 items-center justify-center">
          <LoadingAnimation className="text-white-50" />
        </View>
      )}
      <ScrollView className="flex-1 bg-white-50">
        <View className="p-3 gap-3 flex-1 h-full">
          <DetailItem title="Phòng" data={feedback?.room?.room_code} />
          <DetailItem title="Tiêu đề" data={feedback?.title} />
          <View className="flex-1">
            <DetailItem title="Nội dung" data={feedback?.body.content} />
          </View>

          {feedback && feedback.body.images && feedback.body.images.length > 0 && (
            <Button className="flex gap-1 px-4 py-3 border-1 border-mineShaft-100 rounded-2xl bg-white-50 shadow-sm shadow-mineShaft-950/10 flex-col items-start">
              <ImageViewBox
                label="Ảnh đính kèm"
                value={feedback?.body.images ?? []}
              />
            </Button>
          )}
        </View>
      </ScrollView>
      <View className="p-3 flex bg-white-50">
        <View className="flex-row gap-2">
          {feedback?.status &&
          feedback?.status < constant.feedback.status.resolved ? (
            <>
              {feedback?.status < constant.feedback.status.in_progress && (
                <Button
                  className="flex-1 bg-white-50 border-1 border-lime-400 py-4"
                  disabled={processing}
                  loading={processing}
                  onPress={() =>
                    handleUpdateFeedback(constant.feedback.status.closed)
                  }
                >
                  <Text className="text-mineShaft-900 text-14 font-BeVietnamSemiBold">
                    Đóng phản hồi
                  </Text>
                </Button>
              )}
              <Button
                className="flex-1 bg-lime-400 py-4"
                disabled={processing}
                loading={processing}
                onPress={() =>
                  handleUpdateFeedback((feedback?.status ?? 1) + 1)
                }
              >
                <Text className="text-mineShaft-900 text-14 font-BeVietnamSemiBold">
                  {titleButtonAction[(feedback?.status ?? 1) + 1]}
                </Text>
              </Button>
            </>
          ) : (
            <Button
              className="flex-1 bg-white-50 border-1 border-lime-400 py-4"
              onPress={() => {
                router.push(`/lodging/${lodgingId}?slugTab=feedback`);
              }}
            >
              <Text className="text-mineShaft-900 text-14 font-BeVietnamMedium">
                Xem đóng góp/phản hồi khác
              </Text>
            </Button>
          )}
        </View>
      </View>
    </Layout>
  );
}

const ModalHasDeletedFeedback = () => {
  const { hideModal } = useUI();
  return (
    <Button className="absolute inset-0 z-10 items-center justify-center">
      <BlurView className="absolute w-full h-full" intensity={20} tint="dark" />

      <View className="w-full p-8">
        <View className="bg-white-50 p-6 rounded-2xl gap-6 items-center">
          <Icon
            icon={Warning}
            className="text-happyOrange-600"
            width={50}
            height={50}
            viewBox="0 0 25 25"
          />
          <View className="items-center gap-3">
            <Text className="font-BeVietnamSemiBold text-16">
              Phản hồi/ Góp ý đã bị thu hồi
            </Text>

            <Text className="text-center font-BeVietnamRegular">
              Phản hồi không khả dụng do đã bị thu hồi bởi người gửi
            </Text>
          </View>

          <Button
            className="bg-lime-400 py-3 w-full"
            onPress={() => {
              hideModal();
              router.canGoBack() ? router.back() : router.push("/");
            }}
          >
            <Text className="font-BeVietnamMedium">Quay lại </Text>
          </Button>
        </View>
      </View>
    </Button>
  );
};

export default Detail;
