"use client";

import { useSession } from "@/lib/auth-client";
import invariant from "tiny-invariant";

export function useRequiredUser() {
  const { data: session } = useSession();
  invariant(
    session?.user,
    "User is required for this operation. Please ensure you are authenticated.",
  );
  return session.user;
}

export function useUser() {
  const { data: session, isPending } = useSession();
  return { user: session?.user ?? null, isLoading: isPending };
}
