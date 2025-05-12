import Icon from "@/ui/Icon";
import { Setting } from "@/ui/icon/active";
import { Bank, Money } from "@/ui/icon/finance";
import {
  ArrowArrangeCircle,
  ArrowDownCircle,
  ArrowExportCircle,
  ArrowImportCircle,
  ArrowUpCircle,
  Bulb,
  Car,
  Home,
  Receipt,
  TagLine,
  Trash,
  Water,
  Wifi,
} from "@/ui/icon/symbol";

export const reference = {
  permission: {
    room_list: {
      name: "Quản lý phòng",
      icon: Home,
    },
    service_list: {
      name: "Danh sách dịch vụ",
      icon: Home,
    },
    equipment_list: {
      name: "Danh sách trang thiết bị",
      icon: Home,
    },
    contract_list: {
      name: "Quản lý hợp đồng",
      icon: Home,
    },
    bill_create: {
      name: "Chốt dịch vụ tháng",
      icon: Home,
    },
    holding_room: {
      name: "Cọc giữ chỗ",
      icon: Home,
    },
    delete_contract: {
      name: "Thanh lý (Trả phòng)",
      icon: Home,
    },
    create_contract: {
      name: "Lập hợp đồng mới",
      icon: Home,
    },
    invoice_list: {
      name: "Danh sách hoá đơn",
      icon: Receipt,
    },
  },
  service: {
    water: {
      name: "Tiền nước",
      icon: Water,
      text: "text-curiousBlue-400",
      bg: "bg-curiousBlue-100",
    },
    wifi: {
      name: "Tiền wifi",
      icon: Wifi,
      text: "text-purplePlum-400",
      bg: "bg-purplePlum-200",
    },
    electricity: {
      name: "Tiền điện",
      icon: Bulb,
      text: "text-buttercup-300",
      bg: "bg-buttercup-100",
    },
    garbage: {
      name: "Tiền rác",
      icon: Trash,
      text: "text-lime-600",
      bg: "bg-lime-100",
    },
    parking: {
      name: "Tiền đổ xe",
      icon: Car,
      text: "text-pickledBlueWood-400",
      bg: "bg-pickledBlueWood-100",
    },
  },
  unit: {
    kwh: {
      name: "KWh",
      lowerName: "kWh",
    },
    cubic_meter: {
      name: "Khối",
    },
    month: {
      name: "Tháng",
    },
    person: {
      name: "Người",
    },
    item: {
      name: "Chiếc",
    },
    time: {
      name: "Lần",
    },
    piece: {
      name: "Cái",
    },
    container: {
      name: "Bình",
    },
  },

  room: {
    status: {
      1: {
        name: "Còn trống",
        bg: "bg-lime-600",
      },
      2: {
        name: "Bảo trì/Sửa chữa",
        bg: "bg-happyOrange-600",
      },
      3: {
        name: "Đã đủ",
        bg: "bg-redPower-600",
      },
    },
  },

  feedback: {
    status: {
      1: { name: "Đã gửi", bg: "bg-blue-500", text: "text-blue-50" },
      2: { name: "Đã nhận", bg: "bg-yellow-500", text: "text-yellow-50" },
      3: { name: "Đang xử lý", bg: "bg-orange-500", text: "text-orange-50" },
      4: { name: "Đã giải quyết", bg: "bg-lime-500", text: "text-lime-50" },
      5: { name: "Đã đóng", bg: "bg-gray-500", text: "text-gray-50" },
    },
  },

  contract: {
    status: {
      1: {
        name: "Sắp chuyển vào",
        bg: "bg-yellow-400",
        text: "text-yellow-100",
      },
      2: { name: "Đang thuê", bg: "bg-lime-500", text: "text-lime-100" },
      3: { name: "Đã kết thúc", bg: "bg-blue-400", text: "text-blue-100" },
      4: { name: "Đã huỷ", bg: "bg-gray-400", text: "text-gray-100" },
      5: { name: "Quá hạn", bg: "bg-redPower-600", text: "text-redPower-100" },
    },
  },
  transaction: {
    type: {
      deposit: {
        name: "Nạp tiền",
        bg: "bg-lime-100",
        text: "text-lime-400",
        icon: ArrowDownCircle,
      },
      withdraw: {
        name: "Rút tiền",
        bg: "text-redPower-600",
        text: "text-redPower-100",
        icon: ArrowUpCircle,
      },
      transfer_in: {
        name: "Chuyển vào",
        bg: "bg-blue-100",
        text: "text-blue-400",
        icon: ArrowImportCircle,
      },
      transfer_out: {
        name: "Chuyển ra",
        bg: "bg-blue-100",
        text: "text-blue-400",
        icon: ArrowExportCircle,
      },
      payment: {
        name: "Thanh toán",
        bg: "bg-yellow-100",
        text: "text-yellow-400",
        icon: Money,
      },
    },
  },

  other: {
    name: "Khác",
    icon: TagLine,
    text: "text-cascade-600",
    bg: "bg-cascade-100",
  },
  undefined: {
    name: "Không xác định",
    bg: "bg-gray-500",
    text: "text-gray-50",
  },

  payment: {
    status: {
      1: {
        name: "Chưa thanh toán",
        bg: "bg-redPower-100",
        text: "text-redPower-600",
      },
      2: { name: "Đã thanh toán", bg: "bg-lime-100", text: "text-lime-500" },
      3: {
        name: "Thanh toán một phần",
        bg: "bg-happyOrange-100",
        text: "text-happyOrange-600",
      },
    },
    method: {
      cash: {
        name: "Tiền mặt",
        icon: Money,
      },
      bank: { name: "Chuyển khoản", icon: Bank },
      system: {
        name: "Hệ thống",
        icon: Setting,
      },
      transfer: {
        name: "Ví nội bộ",
        icon: ArrowArrangeCircle,
      },
    },
  },
};
