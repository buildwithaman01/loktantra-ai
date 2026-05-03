import { NextResponse } from "next/server";

export function middleware(): NextResponse {
  const res = NextResponse.next();

  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://*.googleapis.com https://*.gstatic.com",
      "connect-src 'self' https://generativelanguage.googleapis.com https://maps.googleapis.com https://translation.googleapis.com",
      "frame-src 'none'",
    ].join("; ")
  );
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(self), geolocation=(self)"
  );
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
