import { apiRouter } from "@/assets/ApiRouter";
import { useGeneral } from "@/hooks/useGeneral";
import { LodgingType } from "@/interfaces/LodgingInterface";
import { ResponseInterface } from "@/interfaces/ResponseInterface";
import { BaseHttpService } from "@/services/BaseHttpService";
import Box from "@/ui/box";
import Dropdown from "@/ui/dropdown";
import Icon from "@/ui/icon";
import { Home } from "@/ui/icon/symbol";
import Input from "@/ui/input";
import { useEffect, useState } from "react";

const BoxInfor: React.FC<{
  lodgingType: LodgingType | null;
  setLodgingType: (type: LodgingType | null) => void;
}> = ({ setLodgingType, lodgingType }) => {
  const { lodgingTypes, setLodgingTypes } = useGeneral();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTypes = async () => {
      setLoading(true);
      try {
        const data: ResponseInterface = await new BaseHttpService().https({
          url: apiRouter.listTypeLodging,
        });
        const types = data.body?.data || [];
        setLodgingTypes(types);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    if (lodgingTypes.length > 0) {
      setLodgingType(
        lodgingTypes.find((type) => type.id === lodgingType?.id) ||
          lodgingTypes[0]
      );
    } else {
      setLodgingType(null);
    }
  }, [lodgingTypes]);

  return (
    <Box
      title="Thông tin nhà cho thuê"
      icon={<Icon icon={Home} />}
      className="z-10"
    >
      <Dropdown
        options={lodgingTypes}
        value={lodgingType}
        optionKey="name"
        placeHolder="Chọn loại hình cho thuê"
        label="Loại hình cho thuê"
        onChange={(option) => setLodgingType(option)}
        loading={loading}
      />
      {!loading && lodgingType && (
        <Input
          value=""
          label={`Tên ${lodgingType?.name.toLocaleLowerCase()}`}
        />
      )}
    </Box>
  );
};

export default BoxInfor;
