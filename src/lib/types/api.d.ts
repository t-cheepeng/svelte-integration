import type { ApiError } from './api/data-contracts';

interface KnownApiResponse<T> {
	status: string;
	errors?: ApiError[];
	data?: T;
}

interface EmtpyKnownApiResponse {
  status: string;
  errors?: ApiError[];
  data: undefined | null;
}
