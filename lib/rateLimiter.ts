interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const requestMap = new Map<string, RateLimitRecord>();

/**
 * Returns true if request is allowed, false if rate limited.
 * Default: 10 requests per 60 seconds per IP.
 */
export function rateLimit(
  identifier: string,
  limit = 10,
  windowMs = 60_000
): boolean {
  const now = Date.now();
  const record = requestMap.get(identifier);

  if (!record || now > record.resetTime) {
    requestMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) return false;

  record.count++;
  return true;
}
