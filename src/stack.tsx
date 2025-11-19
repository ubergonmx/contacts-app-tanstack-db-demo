import "server-only";

import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  // Use relative URLs - Stack Auth should auto-detect base URL from Next.js headers()
  // Make sure your domain is added to "Trusted domains" in Stack Auth dashboard
  urls: {
    handler: `${process.env.NEXT_PUBLIC_APP_URL}/handler/[...stack]`,
    signIn: `${process.env.NEXT_PUBLIC_APP_URL}/handler/[...stack]`,
    signUp: `${process.env.NEXT_PUBLIC_APP_URL}/handler/[...stack]`,
    afterSignIn: `${process.env.NEXT_PUBLIC_APP_URL}/`,
    afterSignUp: `${process.env.NEXT_PUBLIC_APP_URL}/`,
  },
});
