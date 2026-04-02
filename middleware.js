import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove: (name, options) => {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const mockSession = request.cookies.get("mock_session")?.value;
  const isMockUser = mockSession === "user";
  const isMockAdmin = mockSession === "admin";
  const isAuthenticated = !!user || isMockUser || isMockAdmin;

  const path = request.nextUrl.pathname;

  // Skip middleware for static assets, favicon, etc.
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/favicon.ico") ||
    path.includes(".svg") ||
    path.includes(".png") ||
    path.includes(".jpg") ||
    path.includes(".jpeg")
  ) {
    return response;
  }

  // Auth/Redirect logic
  const isLoginRoute = path === "/login";
  const isAuthCallback = path === "/auth/callback";
  const isAdminRoute = path.startsWith("/admin") || path.startsWith("/quiz/admin");
  const isProtected = path === "/" || path.startsWith("/quiz") || isAdminRoute;

  // Redirect to login if not authenticated and trying to access protected route
  if (!isAuthenticated && isProtected && !isLoginRoute && !isAuthCallback) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to root if already authenticated and trying to access login
  if (isAuthenticated && isLoginRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Admin access control
  if (isAdminRoute && !isMockAdmin) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user?.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: "/:path*",
};
