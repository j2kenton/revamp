import { withAuth } from 'next-auth/middleware';

/**
 * Middleware for protecting routes with NextAuth.
 * This runs at the edge before pages render.
 * 
 * Routes matching the matcher pattern will require authentication.
 * Unauthenticated users will be redirected to the login page.
 */
export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // Return true if the user has a valid token
      return !!token;
    },
  },
});

/**
 * Specify which routes should be protected by this middleware.
 * Add or remove paths as needed for your application.
 */
export const config = {
  matcher: [
    '/dashboard/:path*',
    // Add other protected routes here
    // '/admin/:path*',
    // '/api/protected/:path*',
  ],
};
