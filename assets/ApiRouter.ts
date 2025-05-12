export const apiRouter = {
  //Auth
  refreshToken: "/auth/refresh",
  registerUser: "/auth/register",
  loginUser: "/auth/login",
  logoutUser: "/auth/logout",
  requestOtp : "/auth/request_otp",
  verifyOtp : "/auth/verify_otp",
  resetPassword: "/auth/reset_password",

  //User
  infoUser: "/user/info",
  updateUser: "/user/update",
  changePassword: "/user/change_password",
  listLodgingAndRoomByUser: "/user/client/list_lodging_and_rooms",

  //Lodging
  listTypeLodging: "/lodging_type/list",
  listLodgingByUser: "/lodging/list_by_user",
  createLodging: "/lodging/create",
  overviewLodging: "/lodging/overview",
  detailLodging: "/lodging/detail/:id",
  updateLodging: "/lodging/update",
  deleteLodging: "/lodging/delete/:id",
  configLodging: "/lodging/config",

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
  deleteLodgingService: "/lodging_service/delete",
  listLodgingServiceByRoom: "/lodging_service/list_by_room",

  //Room
  createRoom: "/room/create",
  listRoomByLodging: "/room/list/:lodging_id",
  detailRoom: "/room/detail/:id",
  updateRoom: "/room/update",
  filterRoom: "/room/filter",
  deleteRoom: "/room/delete",

  //CreateContract
  createContract: "/contract/create",
  listContract: "/contract/list",
  detailContract: "/contract/detail/:id",
  updateContract: "/contract/update",
  debtContract: "/contract/debt/:id",
  createFinalBill: "/contract/create_final_bill",
  endContract: "/contract/end_contract",
  payAmountByContract: "/contract/pay_amount",
  listContractByUser: "/contract/list_by_user",

  //Feedback
  createFeedback: "/feedback/create",
  listFeedback: "/feedback/list",
  detailFeedback: "/feedback/detail/:id",
  updateStatusFeedback: "/feedback/update_status",

  // Notification
  listNotification: "/notification/list",
  toggleReadNotification: "/notification/:id/toggle_read",

  //Equipment
  listEquipment: "/equipment/list",
  createEquipment: "/equipment/create",
  detailEquipment: "/equipment/detail/:id",
  updateEquipment: "/equipment/update",
  deleteEquipment: "/equipment/delete",

  //RentalPayment
  listRentalPayment: "/rent_payment/list",
  detailRentalPayment: "/rent_payment/detail/:id",

  //RoomServiceInvoice
  listRoomServiceNeedClose: "/room_service_invoice/list_need_close",
  closeRoomService: "/room_service_invoice/close_room_service",

  //ServicePayment
  listServicePayment: "/service_payment/list",
  detailServicePayment: "/service_payment/detail/:id",


  //List channel
  listChannel: "channel/list",
  leaveChannel: "channel/leave",

  //Chat
  createChat: "chat/create",
  listChat: "chat/list",

  //Payment
  paymentByContract: "/payment/payment_by_contract",
  paymentByUser: "/payment/payment_by_user",

  //Wallet
  detailWallet: "/wallet/detail/:id",

  //Transaction
  listTransactionByWallet: "/transaction/list_by_wallet",

  //PaymentHistory
  listPaymentHistory: "/payment_history/list",

  //Invoice
  listInvoice: "/invoice/list",
  detailInvoice: "/invoice/detail"
};
