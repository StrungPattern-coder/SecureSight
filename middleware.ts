import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    // Protect all routes except auth pages and API routes
    '/((?!auth|api|_next/static|_next/image|favicon.ico).*)',
  ]
}
