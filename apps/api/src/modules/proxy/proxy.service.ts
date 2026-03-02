import { Injectable, BadRequestException } from "@nestjs/common";
import axios, { AxiosRequestConfig } from "axios";
import { ApisService } from "../apis/apis.service";

@Injectable()
export class ProxyService {
  constructor(private apis: ApisService) {}

  async forward(apiId: string, path: string, req: any) {
    const api = await this.apis.get(apiId);
    if (api.status !== "ACTIVE") throw new BadRequestException("API is inactive");

    const targetUrl = new URL(api.baseUrl.replace(/\/$/, "") + "/" + path.replace(/^\//, ""));
    const config: AxiosRequestConfig = {
      url: targetUrl.toString(),
      method: req.method,
      headers: {
        ...req.headers,
        host: undefined,
        "x-api-key": undefined
      },
      params: req.query,
      data: req.body,
      validateStatus: () => true,
      timeout: 30000
    };

    const response = await axios.request(config);
    return response;
  }
}
