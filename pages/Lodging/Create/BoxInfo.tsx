import { apiRouter } from "@/assets/ApiRouter";
import { LodgingType } from "@/interfaces/LodgingInterface";
import { IResponse } from "@/interfaces/ResponseInterface";
import { BaseHttpService } from "@/services/BaseHttpService";
import useLodgingTypeStore from "@/store/lodging_type/useLodgingType";
import Box from "@/ui/Box";
import Dropdown from "@/ui/Dropdown";
import Icon from "@/ui/Icon";
import { Home } from "@/ui/icon/symbol";
import Input from "@/ui/Input";
import { useEffect, useState } from "react";
import React from "react";

const BoxInfo: React.FC<{
  lodgingType: LodgingType | null;
  setLodgingType: (type: LodgingType | null) => void;
  name: string;
  setName: (name: string) => void;
}> = ({ setLodgingType, lodgingType, name, setName }) => {
  const { lodgingTypes, setLodgingTypes } = useLodgingTypeStore();
  const [loading, setLoading] = useState(false);  
  

  useEffect(() => {
    const fetchTypes = async () => {
      setLoading(true);
      try {
        const data: IResponse = await new BaseHttpService().https({
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
      description="Thông tin cơ bản tên, loại hình,..."
      icon={Home}
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
        value={name}
        onChange={setName}
        label={`Tên ${lodgingType?.name.toLocaleLowerCase()}`}
      />
      
      )}
    </Box>
  );
};

export { BoxInfo };
