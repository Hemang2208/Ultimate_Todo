// app/api/server-time/route.js
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET() {
  try {
    // Double-check we're not running in a static context
    if (
      process.env.NODE_ENV === "production" &&
      process.env.NEXT_PHASE === "phase-production-build"
    ) {
      throw new Error("Server-time API should not be called during build");
    }

    // Get current server time with additional validation
    const serverTime = new Date();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (isNaN(serverTime.getTime())) {
      throw new Error("Invalid system time detected");
    }

    // Validate timezone (basic check)
    if (!timezone || typeof timezone !== "string" || timezone.length < 3) {
      console.warn("Unexpected timezone value:", timezone);
    }

    // Prepare response data
    const responseData = {
      serverTime: serverTime.toISOString(),
      timezone,
      timestamp: serverTime.getTime(),
      isValid: true,
      generatedAt: Date.now(),
    };

    // Create secure headers
    const headers = new Headers({
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "CDN-Cache-Control": "no-store",
      "Vercel-CDN-Cache-Control": "no-store",
      ...CORS_HEADERS,
    });

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Server-time endpoint error:", error);

    // Fallback to client time if server time fails
    const fallbackTime = new Date();

    return new Response(
      JSON.stringify({
        serverTime: fallbackTime.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: fallbackTime.getTime(),
        isValid: false,
        warning: "Using fallback time",
        error: error.message || "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...CORS_HEADERS,
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
