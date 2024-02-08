import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import apiMiddleware from "./middleware/api";
import authMiddleware from "./middleware/auth";

function matchPathname(url: URL, pathname: string) {
  return url.pathname.startsWith(pathname);
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  if (matchPathname(url, "/api")) {
    return apiMiddleware(req);
  }

  if (matchPathname(url, "/auth")) {
    return authMiddleware(req);
  }

  return NextResponse.next();
}
