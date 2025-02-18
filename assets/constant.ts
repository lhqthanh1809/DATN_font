export const constant = {
  permission: {
    type: { commonly: "commonly", management: "management" },
  },
  service: {
    name: {
      water: "water",
      wifi: "wifi",
      electricity: "electricity",
      garbage: "garbage",
      parking: "parking",
    },
  },
  unit: {
    name: {
      kwh: "kwh",
      cubic_meter: "cubic_meter",
      month: "month",
      person: "person",
      item: "item",
      time: "time",
      piece: "piece",
      container: "container",
    },
  },
  room: {
    status: {
      unfilled: 1,
      fixing: 2,
      filled: 3,
    },
    max_tenants_default: 3
  },
};
