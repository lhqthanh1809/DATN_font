import { IError } from "@/interfaces/ErrorInterface";
import { BaseHttpService } from "./BaseHttpService";
import { HttpStatusCode } from "axios";
import { IResponse } from "@/interfaces/ResponseInterface";

export default class BaseService {
  protected _service = new BaseHttpService();

  protected returnError = (error: any): IError => {
    return {
      message: `Lỗi khi tải dữ liệu: ${error?.message || "Không xác định"}`,
      code: error?.code || HttpStatusCode.InternalServerError,
      details: error?.response || null,
    };
  };

  protected getErrorResponse = (response: IResponse): IError => {
    return {
      message: response.error?.[0].message || "Không xác định",
      code: response.status,
    };
  };
}
