
import Box from "@/ui/box";
import Input from "@/ui/input";
import Label from "@/ui/label";
import React from "react";

const BoxInfo: React.FC<{
  price: string;
  setPrice: (price: string) => void;

  area: string;
  setArea: (area: string) => void;

  maxTenants: number;
  setMaxTenants: (maxTenants: number) => void;

  name: string;
  setName: (name: string) => void;
}> = ({
  name,
  setName,
  price,
  setPrice,
  area,
  maxTenants,
  setArea,
  setMaxTenants,
}) => {
  return (
    <Box title="Thông tin phòng trọ" className="z-10">
      <Input
        value={name}
        onChange={(name) => setName(name)}
        label="Tên phòng trọ"
      />

      <Input
        value={maxTenants.toString()}
        onChange={(max) => setMaxTenants(max ? parseInt(max) : 0)}
        label="Số lượng tối đa"
        type="number"
        suffix={<Label label={"người"} />}
      />
      <Input
        value={area}
        onChange={(area) => setArea(area)}
        label="Diện tích phòng"
        type="number"
        suffix={<Label label={"m\u00B2"} />}
      />
      <Input
        value={price}
        onChange={(price) => setPrice(price)}
        label="Giá thuê"
        type="number"
        suffix={<Label label={"đồng/tháng"} />}
      />
    </Box>
  );
};

export { BoxInfo };
