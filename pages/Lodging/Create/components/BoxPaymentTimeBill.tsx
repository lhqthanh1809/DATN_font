import Box from "@/ui/box";
import Input from "@/ui/input";
import Label from "@/ui/label";

export const BoxPaymentTimeBill: React.FC<{
  paymentDate: number;
  lateDays: number;
  setPaymentDate: (paymentDate: number) => void;
  setLateDays: (lateDays: number) => void;
}> = ({ lateDays, paymentDate, setLateDays, setPaymentDate }) => {
  return (
    <Box title="Cài đặt ngày chốt & hạn hoá đơn">
      <Input
        value={paymentDate.toString()}
        onChange={(value) => {
          const num = Number(value);
          setPaymentDate(!isNaN(num) && num > 0 ? num : 0);
        }}
        type="number"
        label="Ngày lập hoá đơn thu tiền"
      />
      <Input
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
