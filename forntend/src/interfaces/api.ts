// filepath: src/interfaces/api.ts
export interface IApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface IApiError {
  message: string;
  details?: any;
  statusCode?: number;
}

export interface IPaginationParams {
  page: number;
  limit?: number;
  search?: string;
}

export interface IPaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
