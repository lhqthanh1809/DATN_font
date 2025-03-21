import { create, update } from "lodash";

export const apiRouter = {
  //User
  refreshUser: "/user/refresh",
  registerUser: "/user/register",
  loginUser: "/user/login",
  infoUser: "/user/info",
  updateUser: "/user/update",
  listLodgingAndRoomByUser: "/user/client/list_lodging_and_rooms",

  //Lodging
  listTypeLodging: "/lodging_type/list",
  listLodgingByUser: "/lodging/list_by_user",
  createLodging: "/lodging/create",
  overviewLodging: "lodging/overview",
  detailLodging: "/lodging/detail/:id",
  updateLodging: "/lodging/update",
  deleteLodging: "/lodging/delete/:id",

  //General
  listProvince: "/general/provinces",
  listDistrict: "/general/districts",
  listWard: "/general/wards",

  //Permission
  listPermissionByUser: "/permission/list_by_user",

  //Service
  listService: "/service/list",

  //Unit
  listUnit: "/unit/list",
  listUnitByService: "/unit/list_by_service",

  //LodgingService
  createLodgingService: "/lodging_service/create",
  listLodgingService: "/lodging_service/list/:lodging_id",
  detailLodgingService: "/lodging_service/detail/:id",
  updateLodgingService: "/lodging_service/update",

  //Room
  createRoom: "/room/create",
  listRoomByLodging: "/room/list/:lodging_id",
  detailRoom: "/room/detail/:id",
  updateRoom: "/room/update",
  filterRoom: "/room/filter",

  //CreateContract
  createContract: "/contract/create",
  listContract: "/contract/list",
  detailContract: "/contract/detail/:id",
  update: "/contract/update",

  //Feedback
  createFeedback: "/feedback/create",
  listFeedback: "/feedback/list",
  detailFeedback: "/feedback/detail/:id",
  updateStatusFeedback: "/feedback/update_status",
  listFeedbackByUser: "/feedback/list_by_user",

  // Notification
  listNotification: "/notification/list",

  //Equipment
  listEquipment: "/equipment/list",
  createEquipment: "/equipment/create",
  detailEquipment: "/equipment/detail/:id",
  updateEquipment: "/equipment/update",

  //RentalHistory
  listRentalHistory: "/rental_history/list",

  //RoomUsage
  listRoomUsageNeedClose: "/room_usage/list_need_close",
  closeRoomUsage: "/room_usage/close_room_usage",

  //ServicePayment
  listServicePayment: "/service_payment/list"
};
