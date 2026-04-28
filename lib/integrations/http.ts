function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWithRetry(
  input: RequestInfo | URL,
  init: RequestInit,
  options?: {
    retries?: number;
    baseDelayMs?: number;
    retryOn?: number[];
  },
) {
  const retries = options?.retries ?? 2;
  const baseDelayMs = options?.baseDelayMs ?? 350;
  const retryOn = options?.retryOn ?? [408, 409, 425, 429, 500, 502, 503, 504];
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(input, init);
      if (!retryOn.includes(response.status) || attempt === retries) {
        return response;
      }

      const jitter = Math.floor(Math.random() * 120);
      await wait(baseDelayMs * 2 ** attempt + jitter);
    } catch (error) {
      lastError = error;
      if (attempt === retries) {
        break;
      }
      const jitter = Math.floor(Math.random() * 120);
      await wait(baseDelayMs * 2 ** attempt + jitter);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Network request failed.");
}
