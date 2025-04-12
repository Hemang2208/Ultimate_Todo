"use server";

import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function verifyToken(req) {
  try {
    let token;
    const authHeader = await req.headers?.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = await authHeader.split(" ")[1];
    } else {
      token = await cookies()?.get("token")?.value;
    }

    if (!token) {
      console.error("❌ No Authorization Token Provided.");
      return NextResponse.json(
        { error: "Unauthorized Access. Please Login Again." },
        { status: 401 }
      );
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ Missing JWT_SECRET in environment variables.");
      return NextResponse.json(
        { error: "Server Error. Please Try Again Later." },
        { status: 500 }
      );
    }

    let decoded;
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      decoded = payload;
    } catch (err) {
      console.error("❌ Invalid or Expired Token.");
      return NextResponse.json(
        { error: "Session Expired. Please Login Again." },
        { status: 401 }
      );
    }

    const userId = decoded.userId || decoded.id;
    if (!userId) {
      console.error("❌ Token is Missing Required User ID.");
      return NextResponse.json(
        { error: "Unauthorized Access. Please Login Again." },
        { status: 401 }
      );
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", userId);

    return NextResponse.next({ headers: requestHeaders });
  } catch (error) {
    console.error("🚨 Token Verification Error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error. Please Try Again Later." },
      { status: 500 }
    );
  }
}
