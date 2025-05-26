import Button from "@/ui/Button";
import ImagePicker from "@/ui/ImagePicker";
import Input from "@/ui/Input";
import Layout from "@/ui/layouts/Layout";
import TextArea from "@/ui/Textarea";
import { AssetInfo } from "expo-media-library";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import * as FileSystem from "expo-file-system";
import ListModel from "@/ui/ListModal";
import { IRoom } from "@/interfaces/RoomInterface";
import { ILodging } from "@/interfaces/LodgingInterface";
import ClientService from "@/services/Client/ClientService";
import { router, useLocalSearchParams } from "expo-router";
import { ICreateFeedback } from "@/interfaces/FeedbackInterface";
import FeedbackService from "@/services/Feedback/FeedbackService";
import * as Yup from "yup";
import useToastStore from "@/store/toast/useToastStore";
import { constant } from "@/assets/constant";

const schema = Yup.object().shape({
  title: Yup.string().required("Tiêu đề là bắt buộc"),
  content: Yup.string().required("Nội dung là bắt buộc"),
  lodging: Yup.object()
    .required("Nhà trọ góp ý là bắt buột")
    .shape({
      id: Yup.string().required("Nhà trọ không hợp lệ"),
    }),
  room: Yup.object()
    .required("Phòng trọ góp ý là bắt buột")
    .shape({
      id: Yup.string().required("Phòng trọ không hợp lệ"),
    }),
});

function Create() {
  const { room_id, lodging_id } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [lodging, setLodging] = useState<ILodging | null>(null);
  const [room, setRoom] = useState<IRoom | null>(null);
  const { addToast } = useToastStore();

  //Data được fetch từ API
  const [lodgings, setLodgings] = useState<ILodging[]>([]);
  const [rooms, setRooms] = useState<IRoom[]>([]);

  const [selectPhotos, setSelectPhotos] = useState<(AssetInfo | string)[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const clientService = new ClientService();
  const feedbackService = new FeedbackService();

  const fetchLodgings = useCallback(async () => {
    setLoading(true);
    const data = await clientService.listLodgingAndRoomFromContractByUser();
    if ("message" in data) {
      router.back();
      return;
    }
    setLodgings(data);
    setLodging(data[0] ?? null);
    setLoading(false);
  }, []);

  const handleSendFeedback = useCallback(async () => {
    setProcessing(true);

    try {
      await schema.validate(
        {
          content,
          title,
          lodging,
          room,
        },
        { abortEarly: false }
      );

      if (!room?.id || !lodging?.id) return;
      const formData = new FormData();

      const images = selectPhotos.filter((item) =>
        typeof item === "string" ? item : item.mediaType === "photo"
      );

      for (const item of images) {
        if (typeof item !== "string") {
          const response = await fetch(item.uri);
          const blob = await response.blob();
          formData.append("images[]", {
            uri: item.uri,
            type: blob.type,
            name: item.filename,
          } as any);
        } else {
          formData.append("images[]", item);
        }
      }

      formData.append("room_id", room.id)
      formData.append("title", title)
      formData.append("content", content)
      formData.append("lodging_id", lodging.id)

      const res = await feedbackService.createFeedback(formData);
      if ("message" in res) {
        throw new Error(res.message);
      }
      router.back();
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
  }, [title, content, selectPhotos, lodging, room]);

  useEffect(() => {
    if (lodgings.length > 0) {
      setRooms(lodging?.rooms ?? []);
      setRoom(lodging?.rooms?.[0] ?? null);
    }
  }, [lodging]);

  useEffect(() => {
    if (lodgings.length <= 0 || rooms.length <= 0 || !lodging_id || !room_id)
      return;

    setLodging(lodgings.find((item) => item.id == lodging_id) ?? lodging);
    setRoom(rooms.find((item) => item.id == room_id) ?? room);
  }, [lodging_id, lodgings, rooms, room_id]);

  useEffect(() => {
    fetchLodgings();
  }, []);

  return (
    <Layout title="Đóng góp ý kiến">
      <ScrollView className="flex-1 bg-white-50">
        <View className="p-3 gap-3 flex-1 h-full">
          <ListModel
            compareKey="id"
            loading={loading}
            label="Nhà thuê"
            value={lodging}
            onChange={(option) => {
              setLodging(option);
            }}
            optionKey="name"
            options={lodgings}
            placeHolder="Chọn nhà thuê"
          />
          <ListModel
            compareKey="id"
            loading={loading}
            placeHolder="Chọn phòng"
            label="Phòng"
            value={room}
            onChange={(option) => setRoom(option)}
            optionKey="room_code"
            options={rooms}
          />
          <Input
            required
            value={title}
            onChange={(text) => setTitle(text)}
            label="Tiêu đề"
            placeHolder="Nhập tiêu đề"
          />
          <View className="flex-1">
            <TextArea
              required
              classNameInput="min-h-40"
              placeHolder="Nhập nội dung đóng góp..."
              value={content}
              onChange={(text) => setContent(text)}
              label="Nội dung"
            />
          </View>
          <ImagePicker
            label="Ảnh đính kèm"
            onChange={(value) => setSelectPhotos(value)}
            value={selectPhotos}
          />
        </View>
      </ScrollView>
      <View className="p-3 flex bg-white-50">
        <View className="flex-row">
          <Button
            disabled={processing}
            loading={processing}
            onPress={handleSendFeedback}
            className="flex-1 bg-lime-400 py-4"
          >
            <Text className="text-mineShaft-900 text-16 font-BeVietnamSemiBold">
              Gửi đóng góp
            </Text>
          </Button>
        </View>
      </View>
    </Layout>
  );
}

export default Create;
