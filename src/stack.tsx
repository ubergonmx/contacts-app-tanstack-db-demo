import "server-only";

import { StackServerApp } from "@stackframe/stack";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : "http://localhost:3000";

console.log("Stack Auth Base URL:", baseUrl); // This will show in your function logs

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  baseUrl: baseUrl,
  urls: {
    handler: "/handler/[...stack]",
    signIn: "/handler/[...stack]",
    signUp: "/handler/[...stack]",
    afterSignIn: "/",
    afterSignUp: "/",
  },
});