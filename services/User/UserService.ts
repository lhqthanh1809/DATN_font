import { IResponse } from "@/interfaces/ResponseInterface";
import { BaseHttpService } from "../BaseHttpService";
import { apiRouter } from "@/assets/ApiRouter";
import { HttpStatusCode } from "axios";
import { IError } from "@/interfaces/ErrorInterface";

export default class UserService {
    private _service = new BaseHttpService()

      public async info(): Promise<any | IError> {
        try {
          const res: IResponse = await this._service.https({
            url: apiRouter.infoUser,
            authentication_requested: true,
          });
          return res.body?.data || null;
        } catch (error: any) {
          return {
            message: `Lỗi khi tải dữ liệu: ${error?.message || "Không xác định"}`,
            code: error?.code || HttpStatusCode.InternalServerError,
            details: error?.response || null,
          };
        }
      }
}