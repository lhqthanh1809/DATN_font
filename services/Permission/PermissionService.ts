import { apiRouter } from "@/assets/ApiRouter";
import { BaseHttpService } from "../BaseHttpService";
import { HttpStatusCode } from "axios";
import { IResponse } from "@/interfaces/ResponseInterface";
import { IPermission } from "@/interfaces/Permission";
import { IError } from "@/interfaces/ErrorInterface";

export default class PermissionService {
  private _lodgingId: string | null;
  private _service = new BaseHttpService();
  constructor(lodgingId: string | null = null) {
    this._lodgingId = lodgingId;
  }

  public async listByUser(): Promise<IPermission[] | IError> {
    try {
      const res: IResponse = await this._service.https({
        url: apiRouter.listPermissionByUser,
        authentication_requested: true,
        body: {
          lodging_id: this._lodgingId,
        },
      });

      if (!res || res.status >= HttpStatusCode.BadRequest) {
        return {
          message: res.error?.[0].message || "Không xác định",
          code: res.status,
        };
      }
      return res.body?.data || [];
    } catch (error: any) {
      return {
        message: `Lỗi khi tải dữ liệu: ${error?.message || "Không xác định"}`,
        code: error?.code || HttpStatusCode.InternalServerError,
        details: error?.response || null,
      };
    }
  }
}
