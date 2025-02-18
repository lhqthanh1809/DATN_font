export const apiRouter = {
    //User
    "registerUser" : "/user/register",
    "loginUser" : "/user/login",
    "infoUser" : "/user/info",
    "updateUser": "/user/update",    

    //Lodging
    "listTypeLodging" : "/lodging_type/list",
    "listLodgingByUser" : "/lodging/list_by_user",
    "createLodging" : "/lodging/create",

    //General
    "listProvince" :  "/general/provinces",
    "listDistrict" :  "/general/districts",
    "listWard" :  "/general/wards",

    //Permission
    "listPermissionByUser" : "/permission/list_by_user",

    //Service
    "listService" : "/service/list",

    //Unit
    "listUnit" : "/unit/list",
    "listUnitByService" : "/unit/list_by_service",

    //LodgingService
    "createLodgingService": "/lodging_service/create",
    "listLodgingService": "/lodging_service/list/:id",

    //Room
    "createRoom" : "/room/create",
    "listRoomByLodging": "/room/list/:id"
}