import { AxiosRequestConfig, AxiosPromise, AxiosInterceptorManager, AxiosResponse } from "axios";

export interface MyAxiosInstance {
    (config: MyAxiosRequestConfig): AxiosPromise;
    (url: string, config?: MyAxiosRequestConfig): AxiosPromise;
    defaults: MyAxiosRequestConfig;
    interceptors: {
        request: AxiosInterceptorManager<MyAxiosRequestConfig>;
        response: AxiosInterceptorManager<AxiosResponse>;
    };
    getUri(config?: MyAxiosRequestConfig): string;
    request<T = any, R = AxiosResponse<T>>(config: MyAxiosRequestConfig): Promise<R>;
    get<T = any, R = AxiosResponse<T>>(url: string, config?: MyAxiosRequestConfig): Promise<R>;
    delete<T = any, R = AxiosResponse<T>>(url: string, config?: MyAxiosRequestConfig): Promise<R>;
    head<T = any, R = AxiosResponse<T>>(url: string, config?: MyAxiosRequestConfig): Promise<R>;
    options<T = any, R = AxiosResponse<T>>(url: string, config?: MyAxiosRequestConfig): Promise<R>;
    post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: MyAxiosRequestConfig): Promise<R>;
    put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: MyAxiosRequestConfig): Promise<R>;
    patch<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: MyAxiosRequestConfig): Promise<R>;
}

interface MyAxiosRequestConfig extends AxiosRequestConfig {
    [property: string]: any
}