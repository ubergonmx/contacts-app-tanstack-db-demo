import "server-only";

import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  baseUrl: process.env.NEXT_PUBLIC_APP_URL,
  urls: {
    handler: "/handler/[...stack]",
    signIn: "/handler/[...stack]",
    signUp: "/handler/[...stack]",
    afterSignIn: "/",
    afterSignUp: "/",
  },
});
