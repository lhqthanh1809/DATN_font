import { create } from "lodash";

export const apiRouter = {
  //User
  registerUser: "/user/register",
  loginUser: "/user/login",
  infoUser: "/user/info",
  updateUser: "/user/update",
  listLodgingAndRoomByUser: "/user/client/list_lodging_and_rooms",

  //Lodging
  listTypeLodging: "/lodging_type/list",
  listLodgingByUser: "/lodging/list_by_user",
  createLodging: "/lodging/create",

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
  createEquipment: "/equipment/create"
};
