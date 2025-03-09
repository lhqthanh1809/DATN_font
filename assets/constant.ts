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
    max_tenants_default: 3,
  },
  contract: {
    status: {
      pending: 1,
      active: 2,
      finished: 3,
      cancel: 4,
    },
  },
  feedback: {
    status: {
      submitted: 1,
      received: 2,
      in_progress: 3,
      resolved: 4,
      closed: 5,
    },
  },

  equipment: {
    type: {
      private: 1,
      public: 2,
    },
  },

  object: {
    type: {
      lodging: "lodging",
      user: "user",
      room: "room",
    },
  },

  toast: {
    type: {
      success: 1,
      error: 2,
    },
  },
};
