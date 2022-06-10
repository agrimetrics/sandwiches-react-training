/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface SuccessOrFailure {
  success: boolean;
}

export type Customer = string;

export type Sandwich = string;

export type SandwichGroup = Sandwich | Sandwich[];

export interface MakeTask {
  task: "make";
  type: Sandwich;
  time: number;
  customer: Customer;
}

export interface ServeTask {
  task: "serve";
  type: SandwichGroup;
  time: number;
  customer?: Customer;
}

export interface BreakTask {
  task: "break";
  time: number;
}

export interface InventoryItem {
  name: string;
  count: number;
}

export type Inventory = InventoryItem[];

export namespace Status {
  /**
   * @description Checks the status for the API.
   * @name GetStatus
   * @summary Checks the status for the API.
   * @request GET:/status
   * @secure
   */
  export namespace GetStatus {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}

export namespace Schedule {
  /**
   * @description Get the current task schedule.
   * @name GetSchedule
   * @summary Get the current task schedule.
   * @request GET:/schedule
   */
  export namespace GetSchedule {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = { schedule: (MakeTask | ServeTask | BreakTask)[] };
  }
  /**
   * @description Clear the current task schedule.
   * @name ClearSchedule
   * @summary Clear the current task schedule.
   * @request DELETE:/schedule
   */
  export namespace ClearSchedule {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = object;
  }
}

export namespace Orders {
  /**
   * @description Submit a sandwich order.
   * @name AddOrder
   * @summary Submit a sandwich order.
   * @request POST:/orders
   */
  export namespace AddOrder {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = { customer: Customer; type?: SandwichGroup };
    export type RequestHeaders = {};
    export type ResponseBody = SuccessOrFailure;
  }
}

export namespace Inventory {
  /**
   * @description Get the sandwiches that can currently be made.
   * @name GetInventory
   * @summary Get the sandwiches that can currently be made.
   * @request GET:/inventory
   */
  export namespace GetInventory {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = { inventory: Inventory };
  }
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://api-test.agrimetrics.co.uk/sandwiches";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  private encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  private addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  private addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  private mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  private createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
        ...(requestParams.headers || {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : void 0,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title sandwiches-api
 * @version 1.0
 * @baseUrl https://api-test.agrimetrics.co.uk/sandwiches
 *
 * Simple API for placing and checking sandwich orders. Used in pairing sessions for front end interviews.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  status = {
    /**
     * @description Checks the status for the API.
     *
     * @name GetStatus
     * @summary Checks the status for the API.
     * @request GET:/status
     * @secure
     */
    getStatus: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/status`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  schedule = {
    /**
     * @description Get the current task schedule.
     *
     * @name GetSchedule
     * @summary Get the current task schedule.
     * @request GET:/schedule
     */
    getSchedule: (params: RequestParams = {}) =>
      this.request<{ schedule: (MakeTask | ServeTask | BreakTask)[] }, any>({
        path: `/schedule`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Clear the current task schedule.
     *
     * @name ClearSchedule
     * @summary Clear the current task schedule.
     * @request DELETE:/schedule
     */
    clearSchedule: (params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/schedule`,
        method: "DELETE",
        format: "json",
        ...params,
      }),
  };
  orders = {
    /**
     * @description Submit a sandwich order.
     *
     * @name AddOrder
     * @summary Submit a sandwich order.
     * @request POST:/orders
     */
    addOrder: (data: { customer: Customer; type?: SandwichGroup }, params: RequestParams = {}) =>
      this.request<SuccessOrFailure, SuccessOrFailure>({
        path: `/orders`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  inventory = {
    /**
     * @description Get the sandwiches that can currently be made.
     *
     * @name GetInventory
     * @summary Get the sandwiches that can currently be made.
     * @request GET:/inventory
     */
    getInventory: (params: RequestParams = {}) =>
      this.request<{ inventory: Inventory }, any>({
        path: `/inventory`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
