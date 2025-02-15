import { HttpStatusCode } from "axios";

export interface IResponse {
  status: HttpStatusCode;
  body?: {
    [key: string]: any;
    data?: any;
  };
  error?: Array<{ message: string; field?: string }>;
}
