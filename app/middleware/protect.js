import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/user/profile", "/dashboard"];

  if (!protectedRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing in environment variables.");
    return NextResponse.redirect(new URL("/user/login", request.nextUrl));
  }

  let token = "";
  const authHeader = request.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    const tokenTemp = await cookies();
    token = tokenTemp.get("token")?.value;
  }

  if (!token) {
    console.error("❌ No Authentication Token Found.");
    return NextResponse.redirect(new URL("/user/login", request.nextUrl));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId);

    return NextResponse.next({ headers: requestHeaders });
  } catch (err) {
    console.error("❌ Invalid OR Expired Token:", err.message || err);
    return NextResponse.redirect(new URL("/user/login", request.nextUrl));
  }
}

export const config = {
  matcher: ["/user/profile", "/dashboard"],
};
