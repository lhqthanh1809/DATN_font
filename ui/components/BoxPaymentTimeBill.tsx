import Box from "@/ui/Box";
import Input from "@/ui/Input";
import Label from "@/ui/Label";

export const BoxPaymentTimeBill: React.FC<{
  paymentDate: number;
  lateDays: number;
  setPaymentDate: (paymentDate: number) => void;
  setLateDays: (lateDays: number) => void;
  disabled?: boolean;
}> = ({ lateDays, paymentDate, setLateDays, setPaymentDate, disabled }) => {
  return (
    <Box title="Cài đặt ngày chốt & hạn hoá đơn">
      <Input
        disabled={disabled}
        value={paymentDate.toString()}
        onChange={(value) => {
          const num = Number(value);
          setPaymentDate(!isNaN(num) && num > 0 ? num : 0);
        }}
        type="number"
        label="Ngày lập hoá đơn thu tiền"
      />
      <Input
        disabled={disabled}
        value={lateDays.toString()}
        type="number"
        onChange={(value) => {
          const num = Number(value);
          setLateDays(!isNaN(num) && num >= 0 ? num : 0);
        }}
        label="Hạn đóng tiền"
        suffix={<Label label={"ngày"} />}
      />
    </Box>
  );
};
