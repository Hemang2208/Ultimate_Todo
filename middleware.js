import { middleware as proMiddleware } from "./app/middleware/protect.js";

export function middleware(request) {
  return proMiddleware(request);
}

export const config = {
  matcher: ["/user/profile", "/dashboard"],
};
