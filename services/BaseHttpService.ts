import { env } from "@/helper/helper";
import axios, { HttpStatusCode } from "axios";
import { LocalStorage } from "./LocalStorageService";

export class BaseHttpService {
  private _api = axios.create({
    baseURL: env("API_URL"),
    headers: {
      "Content-Type": "application/json",
    },
  });

  async https({
    method = "GET",
    url,
    body,
    cancelToken,
    authentication_requested = false,
  }: {
    method?: "POST" | "PUT" | "GET";
    url: string;
    body?: any;
    cancelToken?: any;
    authentication_requested?: boolean;
  }) {
    try {
      const headers: Record<string, string> = {};
      if (authentication_requested) {
        const token = await (new LocalStorage()).getItem(env("KEY_TOKEN"));
        if (!token) {
          return false;
        }
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await this._api.request({
        method: method,
        url: url,
        ...(method === "GET" ? { params: body } : { data: body }),
        cancelToken,
        headers,
      });

      if (response.status >= HttpStatusCode.BadRequest) return false;
      return response.data;
    } catch (error) {
      return false;
    }
  }
}
