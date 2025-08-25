import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const userProtectedPaths = ["/dashboard"];
const userAuthPaths = ["/auth/login", "/auth/signup"];
const adminProtectedPaths = ["/admin/dashboard"];
const adminAuthPaths = ["/admin/login"];
const doctorProtectedPaths = ["/doctor/dashboard"];
const doctorAuthPaths = ["/doctor/login"];
const doctorOtpPaths = ["/auth/verify-otp"]; // doctor can access this

export function middleware(req: NextRequest) {
  const userToken = req.cookies.get("accessToken")?.value;

  const adminToken = req.cookies.get("adminAccessToken")?.value;
  const doctorToken = req.cookies.get("doctorAccessToken")?.value;

  const url = req.nextUrl.clone();

  // ---------------- Doctor OTP access first ----------------
  if (doctorOtpPaths.some((path) => url.pathname.startsWith(path))) {
    // Allow access if visiting /auth/verify-otp (even if doctorToken is missing)
    return NextResponse.next();
  }

  // ---------------- User routes ----------------
  if (!userToken && userProtectedPaths.some((path) => url.pathname.startsWith(path))) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }
  if (userToken && ["/auth/login", "/auth/signup"].some((path) => url.pathname.startsWith(path))) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // ---------------- Admin routes ----------------
  if (!adminToken && adminProtectedPaths.some((path) => url.pathname.startsWith(path))) {
    url.pathname = "/admin/auth/login";
    return NextResponse.redirect(url);
  }
  if (adminToken && adminAuthPaths.some((path) => url.pathname.startsWith(path))) {
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  // ---------------- Doctor routes ----------------
  if (!doctorToken && doctorProtectedPaths.some((path) => url.pathname.startsWith(path))) {
    url.pathname = "/doctor/login";
    return NextResponse.redirect(url);
  }
  if (doctorToken && doctorAuthPaths.some((path) => url.pathname.startsWith(path))) {
    url.pathname = "/doctor/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/login",
    "/auth/signup",
    "/auth/verify-otp",
    "/admin/dashboard/:path*",
    "/admin/login",
    "/doctor/dashboard/:path*",
    "/doctor/login",
  ],
};
