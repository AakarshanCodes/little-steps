import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    const role = token.role as string

    if (path.startsWith("/parent") && role !== "PARENT") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    if (path.startsWith("/provider") && role !== "PROVIDER") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    if (path.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/parent/:path*", "/provider/:path*", "/admin/:path*"],
}
