import Box from "@/ui/box";
import Button from "@/ui/button";
import Divide from "@/ui/divide";
import Dropdown from "@/ui/dropdown";
import Icon from "@/ui/icon";
import { Edit } from "@/ui/icon/active";
import { Pin, PinCircle } from "@/ui/icon/travel";
import Input from "@/ui/input";
import Map from "@/ui/map";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Text, View } from "react-native";
import ILocation from "@/interfaces/LocationInterface";
import { useGeneral } from "@/hooks/useGeneral";
import { debounce, isArray } from "lodash";
import GeneralService from "@/services/GeneralService";

const BoxLocation: React.FC<
  ILocation & {
    setOpenMap: (openMap: boolean) => void;
  }
> = ({
  province,
  setProvince,
  district,
  setDistrict,
  ward,
  setWard,
  street,
  setStreet,
  setOpenMap,
  location,
}) => {
  const service = new GeneralService();
  const { provinces, districts, wards, setLocations, setLocationsWithParent } =
    useGeneral();
  const [loadingProvince, setLoadingProvince] = useState(false);
  const [loadingDistrict, setLoadingDistrict] = useState(false);
  const [loadingWard, setLoadingWard] = useState(false);

  // Fetch danh sách quận/huyện và phường/xã theo tỉnh/thành phố
  const fetchLocationData = useCallback(
    async (type: "district" | "ward", parentId?: number) => {
      if (!parentId) return;

      const setLoading =
        type === "district" ? setLoadingDistrict : setLoadingWard;

      setLoading(true);
      const data = await (type === "district"
        ? service.listDistrict(parentId)
        : service.listWard(parentId));
      if (isArray(data)) {
        setLocationsWithParent(type, data, parentId);
      }

      setLoading(false);
    },
    [setLocationsWithParent]
  );

  // Dùng useRef để giữ debounce function ổn định
  const debouncedFetchLocation = useRef(
    debounce(fetchLocationData, 300)
  ).current;

  // Fetch danh sách tỉnh/thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvince(true);
      const data = await service.listProvince();
      if (isArray(data)) {
        setLocations(data);
      }
      setLoadingProvince(false);
    };
    if (provinces.length <= 0) {
      fetchProvinces();
    }
  }, []);

  useEffect(() => {
    if (!province) {
      setDistrict(null);
      setWard(null);
    } else if (!districts[province.id]) {
      debouncedFetchLocation("district", province.id);
    }
  }, [province, fetchLocationData]);

  useEffect(() => {
    if (!district) {
      setWard(null);
    } else if (!wards[district.id]) {
      debouncedFetchLocation("ward", district?.id);
    }
  }, [district, fetchLocationData]);

  return (
    <Box title="Địa chỉ & vị trí" icon={<Icon icon={Pin} />}>
      <Dropdown
        className="max-h-44"
        onChange={setProvince}
        label="Tỉnh/Thành phố"
        options={provinces}
        optionKey="name"
        value={province}
        loading={loadingProvince}
        placeHolder="Chọn tỉnh/thành phố"
      />
      <Dropdown
        onChange={setDistrict}
        className="max-h-44"
        label="Quận/Huyện"
        options={(province && districts[province.id]) || []}
        optionKey="name"
        loading={loadingDistrict}
        value={district}
        disabled={!province}
        placeHolder="Chọn quận/huyện"
      />
      <Dropdown
        label="Phường/Xã"
        onChange={setWard}
        className="max-h-44"
        options={(district && wards[district.id]) || []}
        optionKey="name"
        loading={loadingWard}
        value={ward}
        disabled={!district}
        placeHolder="Chọn phường/xã"
        renderOption={(option) =>
          `${option.prefix ? option.prefix + " " : ""}${option.name}`
        }
      />
      <Input value={street} onChange={setStreet} label="Địa chỉ chi tiết" />
      <View className="px-8">
        <Divide direction="horizontal" className="h-[1] px-2" />
      </View>
      <View className="gap-3">
        {location ? (
          <View className="border-1 border-mineShaft-200 rounded-xl p-2 gap-2">
            <View className="h-40 rounded-lg overflow-hidden">
              <Map region={location} location={location} />
            </View>
            <Text className="font-BeVietnamMedium text-12 text-center text-mineShaft-600">{`${location.latitude}, ${location.longitude}`}</Text>
          </View>
        ) : (
          <Text className="font-BeVietnamRegular text-14 text-justify">
            Định vị vị trí nhà cho thuê trên bản đồ giúp người tìm trọ tìm thấy
            bạn nhanh hơn, tăng tỉ lệ tiếp cận khách thuê.
          </Text>
        )}

        <Button
          onPress={() => setOpenMap(true)}
          className={`flex-1 bg-mineShaft-950 py-4 ${location ? "gap-2" : "gap-3"}`}
        >
          <Icon icon={location ? Edit : PinCircle} className="text-white-50" />
          <Text className="text-white-50 text-14 font-BeVietnamSemiBold">
            {location ? "Chỉnh sửa vị trí" : "Lấy vị trí trên bản đồ"}
          </Text>
        </Button>
      </View>
    </Box>
  );
};

export { BoxLocation };
