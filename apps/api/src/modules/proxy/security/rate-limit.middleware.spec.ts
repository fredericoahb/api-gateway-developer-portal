import { RateLimitMiddleware } from "./rate-limit.middleware";

describe("RateLimitMiddleware", () => {
  it("should block when exceeding per-minute limit", async () => {
    const pipeline = {
      incr: jest.fn().mockReturnThis(),
      expire: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([
        [null, 2], // minute count
        [null, 1],
        [null, 1], // month count
        [null, 1]
      ])
    };

    const redisMock = { raw: { pipeline: () => pipeline } } as any;

    const prismaMock = {
      rateLimitViolation: { create: jest.fn().mockResolvedValue({ id: "v1" }) }
    } as any;

    const mw = new RateLimitMiddleware(redisMock, prismaMock);

    const req: any = { gatewayContext: { apiKeyId: "k1", apiId: "a1", limitPerMinute: 1, limitPerMonth: 9999 } };
    const res: any = {
      headers: {},
      setHeader: function (k: string, v: string) { this.headers[k] = v; },
      status: function (code: number) { this.statusCode = code; return this; },
      json: function (body: any) { this.body = body; return this; }
    };
    const next = jest.fn();

    await mw.use(req, res, next);

    expect(res.statusCode).toBe(429);
    expect(prismaMock.rateLimitViolation.create).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
