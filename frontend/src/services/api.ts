const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? "http://localhost:4000/api" : "/api");

const buildUrl = (path: string, params?: Record<string, string | undefined>) => {
  const url = new URL(`${API_BASE_URL}${path}`);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

export async function apiRequest<T>(
  path: string,
  options?: RequestInit,
  params?: Record<string, string | undefined>
): Promise<T> {
  const response = await fetch(buildUrl(path, params), {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(error?.message ?? "Falha ao comunicar com a API.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
