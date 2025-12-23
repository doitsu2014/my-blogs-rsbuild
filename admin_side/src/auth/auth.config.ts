import type { NextAuthConfig } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

export const authConfig = {
  providers: [
    KeycloakProvider({
      clientId: process.env.AUTH_KEYCLOAK_ID || 'my-blogs-admin-localhost',
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET || '',
      issuer: process.env.AUTH_KEYCLOAK_ISSUER || 'https://my-ids-admin.ducth.dev/realms/master',
      authorization: {
        params: {
          scope: process.env.AUTH_KEYCLOAK_SCOPE || 'my-headless-cms-api-all email openid profile',
        },
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      
      if (isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      
      return true;
    },
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and refresh_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      
      // Add user profile information
      if (profile) {
        token.name = profile.name;
        token.email = profile.email;
        token.username = profile.preferred_username;
      }
      
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider
      session.accessToken = token.accessToken as string;
      session.user = {
        ...session.user,
        username: token.username as string,
      };
      
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;
