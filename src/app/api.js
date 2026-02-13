const BASE_URL = "http://127.0.0.1:8000";

export async function apiRequest(endpoint, method = "GET", body = null) {
  const token = localStorage.getItem("access_token");

  const headers = {};

  // Only set JSON header if body is NOT FormData
  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body:
      body instanceof FormData
        ? body
        : body
        ? JSON.stringify(body)
        : null,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw data;
  }

  return data;
}
