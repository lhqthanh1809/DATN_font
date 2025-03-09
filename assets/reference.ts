import Icon from "@/ui/icon";
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
      1: { name: "Đã gửi" },
      2: { name: "Đã nhận" },
      3: { name: "Đang xử lý" },
      4: { name: "Đã giải quyết" },
      5: { name: "Đã đóng" },
    },
  },

  other: {
    name: "Khác",
    icon: TagLine,
  },
  undefined: {
    name: "Không xác định",
  },
};
