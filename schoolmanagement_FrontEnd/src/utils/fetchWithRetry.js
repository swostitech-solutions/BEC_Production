/**
 * fetchWithRetry — Industry-standard fetch wrapper with:
 *   ✅ Automatic retry on transient failures (network errors, 5xx, 429, timeouts)
 *   ✅ Exponential backoff with full jitter (prevents thundering herd)
 *   ✅ Per-attempt timeout via AbortController
 *   ✅ Smart retry rules — never retries 4xx client errors (they won't get better)
 *   ✅ onRetry callback for live UI status updates
 *
 * Retry decision table:
 *   Network error  → RETRY  (server unreachable / connection dropped)
 *   Timeout        → RETRY  (server is slow)
 *   5xx            → RETRY  (server-side transient error)
 *   429            → RETRY  (rate-limited — back off and try again)
 *   4xx (not 429)  → NO RETRY (bad request / auth — retrying won't help)
 *   2xx / 3xx      → SUCCESS immediately
 *
 * Backoff formula (Full Jitter — AWS recommendation):
 *   delay = random(0, min(baseDelay * 2^attempt, maxDelay))
 *
 * @param {string}      url
 * @param {RequestInit} [options={}]            — standard fetch options
 * @param {object}      [config={}]
 * @param {number}      [config.retries=3]      — max retry attempts after first failure
 * @param {number}      [config.baseDelay=1000] — base delay in ms
 * @param {number}      [config.maxDelay=8000]  — max delay cap in ms
 * @param {number}      [config.timeout=15000]  — per-attempt timeout in ms
 * @param {AbortSignal} [config.signal]         — external abort signal (e.g. component unmount)
 * @param {function}    [config.onRetry]        — called before each retry: (attempt, maxRetries, error) => void
 * @returns {Promise<Response>}
 */
export async function fetchWithRetry(url, options = {}, config = {}) {
  const {
    retries               = 3,
    baseDelay             = 1000,
    maxDelay              = 8000,
    timeout               = 15000,
    signal: externalSignal = null,
    onRetry               = null,
  } = config;

  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    // Per-attempt timeout controller
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), timeout);

    // Merge external abort signal with per-attempt timeout signal.
    // If EITHER fires the request is cancelled.
    const mergedSignal = externalSignal
      ? createMergedSignal(externalSignal, timeoutController.signal)
      : timeoutController.signal;

    try {
      const response = await fetch(url, { ...options, signal: mergedSignal });
      clearTimeout(timeoutId);

      // ── Smart retry rules ────────────────────────────────────────────────
      // 4xx except 429: client error — retrying won't fix it, return immediately
      if (
        response.status >= 400 &&
        response.status < 500 &&
        response.status !== 429
      ) {
        return response;
      }

      // 5xx or 429: server-side / rate-limit — worth retrying
      if (response.status >= 500 || response.status === 429) {
        lastError = new Error(
          `Server responded with ${response.status} ${response.statusText}`
        );
        lastError.status = response.status;
        // fall through to retry logic below
      } else {
        // 2xx / 3xx — success
        return response;
      }
    } catch (err) {
      clearTimeout(timeoutId);

      // If the external signal fired (component unmounted), stop immediately
      if (externalSignal?.aborted) throw err;

      lastError =
        err.name === "AbortError"
          ? new Error(
              `Request timed out after ${timeout / 1000}s (attempt ${attempt + 1})`
            )
          : err; // network error (DNS failure, connection refused, etc.)
    }

    // No more attempts left — break and throw below
    if (attempt >= retries) break;

    // ── Exponential backoff with Full Jitter (AWS recommendation) ──────────
    // delay = random(0, min(baseDelay * 2^attempt, maxDelay))
    const cap = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    const delay = Math.floor(Math.random() * cap);

    if (onRetry) onRetry(attempt + 1, retries, lastError);

    await sleep(delay);
  }

  throw lastError;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Merges two AbortSignals so that if EITHER fires the resulting signal fires.
 * Uses AbortSignal.any() where available (modern browsers), manual fallback otherwise.
 */
function createMergedSignal(sig1, sig2) {
  if (typeof AbortSignal.any === "function") {
    return AbortSignal.any([sig1, sig2]);
  }
  // Fallback for older browsers
  const controller = new AbortController();
  const abort = () => controller.abort();
  sig1.addEventListener("abort", abort, { once: true });
  sig2.addEventListener("abort", abort, { once: true });
  return controller.signal;
}
