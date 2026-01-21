import { BASE_URL } from "./config";

export async function getGlobalForecast(token) {
  const response = await fetch(`${BASE_URL}/predict/global-forecast`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.detail ||
      "Terjadi kesalahan saat memuat forecast.";
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}
