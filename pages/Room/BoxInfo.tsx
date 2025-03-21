import Box from "@/ui/Box";
import Input from "@/ui/Input";
import Label from "@/ui/Label";
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

  disabled?: boolean;
}> = ({
  name,
  setName,
  price,
  setPrice,
  area,
  maxTenants,
  setArea,
  setMaxTenants,
  disabled,
}) => {
  return (
    <Box title="Thông tin phòng trọ" className="z-10">
      <Input
        value={name}
        onChange={(name) => setName(name)}
        label="Tên phòng trọ"
        disabled={disabled}
      />

      <Input
        value={maxTenants.toString()}
        onChange={(max) => setMaxTenants(max ? parseInt(max) : 0)}
        label="Số lượng tối đa"
        type="number"
        suffix={<Label label={"người"} />}
        disabled={disabled}
      />
      <Input
        value={area}
        onChange={(area) => setArea(area)}
        label="Diện tích phòng"
        type="number"
        suffix={<Label label={"m\u00B2"} />}
        disabled={disabled}
      />
      <Input
        value={price}
        onChange={(price) => setPrice(price)}
        label="Giá thuê"
        type="number"
        suffix={<Label label={"đồng/tháng"} />}
        disabled={disabled}
      />
    </Box>
  );
};

export { BoxInfo };
