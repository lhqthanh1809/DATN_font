import { HttpStatusCode } from "axios";

export interface IResponse {
  status: HttpStatusCode;
  body?: {
    [key: string]: any;
    data?: any;
  };
  errors?: Array<{ message: string; field?: string }>;
}
