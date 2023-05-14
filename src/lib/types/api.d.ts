import type { ApiError, ApiResponseStatus } from './api/data-contracts';

interface KnownApiResponse<T> {
	status: ApiResponseStatus;
	errors?: ApiError[];
	data?: T;
}

interface EmtpyKnownApiResponse {
  status: ApiResponseStatus;
  errors?: ApiError[];
  data: undefined | null;
}
