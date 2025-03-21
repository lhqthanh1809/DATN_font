import Icon from "@/ui/Icon";
import { Bulb, Car, Home, TagLine, Trash, Water, Wifi } from "@/ui/icon/symbol";

export const reference = {
  permission: {
    room_list: {
      name: "Quản lý phòng",
      icon: Home,
    },
    service_list: {
      name: "Quản lý dịch vụ",
      icon: Home,
    },
    equipment_list: {
      name: "Quản lý trang thiết bị",
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
  },
  service: {
    water: {
      name: "Tiền nước",
      icon: Water,
    },
    wifi: {
      name: "Tiền wifi",
      icon: Wifi,
    },
    electricity: {
      name: "Tiền điện",
      icon: Bulb,
    },
    garbage: {
      name: "Tiền rác",
      icon: Trash,
    },
    parking: {
      name: "Tiền đổ xe",
      icon: Car,
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
      },
      2: {
        name: "Bảo trì/Sửa chữa",
      },
      3: {
        name: "Đã đủ",
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
      1: { name: "Sắp chuyển vào", bg: "bg-yellow-400", text: "text-yellow-100" },
      2: { name: "Đang thuê", bg: "bg-lime-500", text: "text-lime-100" },
      3: { name: "Đã kết thúc", bg: "bg-blue-400", text: "text-lime-100" },
      4: { name: "Đã huỷ", bg: "bg-blue-400", text: "text-blue-100" },
      5: { name: "Quá hạn", bg: "bg-blue-400", text: "text-lime-100" },
    },
  },

  other: {
    name: "Khác",
    icon: TagLine,
  },
  undefined: {
    name: "Không xác định",
    bg: "bg-gray-500",
    text: "text-gray-50",
  },

  payment: {
    status: {
      1: { name: "Chưa thanh toán" },
      2: { name: "Đã thanh toán" },
      3: { name: "Đã thanh toán một phần" },
    },
  },
};
