import { HttpStatusCode } from "axios";

export interface ResponseInterface {
  status: HttpStatusCode;
  body?: {
    [key: string]: any;
    data?: any;
  };
  error?: any;
}
