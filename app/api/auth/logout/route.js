"use server";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const POST = async () => {
  try {
    let cookie = await cookies();
    cookie.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    return NextResponse.json(
      { message: "Logout successful." },
      { status: 200 }
    );
  } catch (error) {
    console.error("🚨 Logout Error:", error.message || error);
    return NextResponse.json(
      { error: "Internal Server Error. Please try again later." },
      { status: 500 }
    );
  }
};
