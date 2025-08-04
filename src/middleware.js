import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => !!token
  },
});

export const config = {
  matcher: [
    "/collection/:path*",
    "/profile/:path*",
    // Add other protected routes
  ]
};