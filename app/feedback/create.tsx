import Button from "@/ui/Button";
import ImagePicker from "@/ui/ImagePicker";
import Input from "@/ui/Input";
import Layout from "@/ui/components/Layout";
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

function Create() {
  const { room_id, lodging_id } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [lodging, setLodging] = useState<ILodging | null>(null);
  const [room, setRoom] = useState<IRoom | null>(null);

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
    if (!title || !content || !lodging || !room || !room.id || !lodging.id)
      return;
    setProcessing(true);
    const images = selectPhotos.filter((item) =>
      typeof item === "string" ? item : item.mediaType === "photo"
    );
    try {
      const imagesBase64 = await Promise.all(
        images.map(async (item) => {
          if (typeof item != "string") {
            const base64 = await FileSystem.readAsStringAsync(item.uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            const extension = item.filename.split(".")[1].toLocaleLowerCase();
            return `data:image/${extension};base64,${base64}`;
          }
          return item;
        })
      );
      let dataReq: ICreateFeedback = {
        room_id: room.id,
        title: title,
        content: content,
        lodging_id: lodging.id,
      };
      if (imagesBase64.length > 0) {
        dataReq = { ...dataReq, images: imagesBase64 };
      }
      const res = await feedbackService.createFeedback(dataReq);
      if (!("message" in res)) {
        router.back();
      }
    } catch (error) {
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
    if(lodgings.length <= 0 || rooms.length <= 0 || !lodging_id || !room_id) return
    
    setLodging(lodgings.find(item => item.id == lodging_id) ?? lodging)
    setRoom(rooms.find(item => item.id == room_id) ?? room)
  }, [lodging_id, lodgings, rooms, room_id])

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
            value={title}
            onChange={(text) => setTitle(text)}
            label="Tiêu đề"
            placeHolder="Nhập tiêu đề"
          />
          <View className="flex-1">
            <TextArea
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
