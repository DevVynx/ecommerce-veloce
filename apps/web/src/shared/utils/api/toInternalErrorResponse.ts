import type { ApiErrorResponse } from "@/shared/types/api/error";

export function toInternalErrorResponse(error: unknown): ApiErrorResponse {
  const isNetworkError =
    error instanceof TypeError || (error instanceof Error && error.name === "AbortError");

  if (isNetworkError) {
    return {
      status: 503,
      error: "NetworkError",
      message: "Não foi possível conectar ao servidor. Verifique sua conexão.",
      code: "SERVICE_UNAVAILABLE",
    };
  }

  return {
    status: 500,
    error: "InternalError",
    message: error instanceof Error ? error.message : "Erro interno inesperado.",
    code: "INTERNAL_SERVER_ERROR",
  };
}
