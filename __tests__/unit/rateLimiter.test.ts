import { rateLimit } from "@/lib/rateLimiter";

describe("rateLimit", () => {
  it("allows requests within the limit", () => {
    expect(rateLimit("test-ip-1", 3, 60000)).toBe(true);
    expect(rateLimit("test-ip-1", 3, 60000)).toBe(true);
    expect(rateLimit("test-ip-1", 3, 60000)).toBe(true);
  });

  it("blocks the request that exceeds the limit", () => {
    rateLimit("test-ip-2", 2, 60000);
    rateLimit("test-ip-2", 2, 60000);
    expect(rateLimit("test-ip-2", 2, 60000)).toBe(false);
  });

  it("treats different IPs independently", () => {
    rateLimit("ip-A", 1, 60000);
    expect(rateLimit("ip-A", 1, 60000)).toBe(false);
    expect(rateLimit("ip-B", 1, 60000)).toBe(true); // fresh IP
  });
});
