import { NextResponse } from "next/server";

const rateLimit = {
  requests: new Map(),
  windowMs: 15 * 60 * 1000,
  max: 5,
};

setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimit.requests.entries()) {
    if (now - data.startTime > rateLimit.windowMs) {
      rateLimit.requests.delete(ip);
    }
  }
}, rateLimit.windowMs / 2);

export const limitRequests = async (req) => {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown"; // Use first forwarded IP

    if (ip === "unknown") {
      console.warn("⚠️ Could not determine client IP.");
      return NextResponse.next();
    }

    const now = Date.now();
    const requestInfo = rateLimit.requests.get(ip) || {
      count: 0,
      startTime: now,
    };

    if (now - requestInfo.startTime > rateLimit.windowMs) {
      rateLimit.requests.set(ip, { count: 1, startTime: now });
      return NextResponse.next();
    }

    if (requestInfo.count >= rateLimit.max) {
      console.error(`⛔ Too many requests from IP: ${ip}`);
      return NextResponse.json(
        { error: "Too Many Attempts. Please Try Again Later." },
        { status: 429 }
      );
    }

    requestInfo.count += 1;
    rateLimit.requests.set(ip, requestInfo);

    return NextResponse.next();
  } catch (error) {
    console.error("🚨 Rate Limiting Middleware Error:", error || error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
