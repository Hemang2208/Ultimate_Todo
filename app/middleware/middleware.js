import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Decode JWT token and get the payload
function decodeToken(token) {
  try {
    return jwt.decode(token); // Returns the payload from the token (e.g., userId)
  } catch (error) {
    return null;
  }
}

export async function middleware(req) {
  // Get the token from the cookies (for the User)
  const token = await req.cookies["token"];

  if (!token) {
    // If no token found, redirect to login or unauthorized page
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Decode the token and check the role
  const decodedToken = decodeToken(token);

  if (!decodedToken) {
    // If decoding fails, redirect to login or unauthorized page
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Check if the user is trying to access user-only, admin, or employee routes
  const requestedUrl = req.url;

  // Protect routes based on roles

  if (requestedUrl.startsWith("/admin")) {
    // Block the user from accessing admin or employee pages
    return NextResponse.redirect(new URL("/unauthorized", req.url)); // Redirect if not authorized
  }

  if (requestedUrl.startsWith("/user")) {
    // Check if the user is accessing user-related routes (they should have token)
    return NextResponse.next(); // Allow access to user routes
  }

  // If trying to access other routes not covered, allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/user/*", "/admin/*", "/employee/*", "/organization/*"], // Apply this middleware to user, admin, and employee routes
};
