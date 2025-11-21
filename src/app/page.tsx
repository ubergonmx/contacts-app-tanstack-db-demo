import { ClientOnly } from "@/components/client-only";
import { ContactsList } from "@/components/contacts-list";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ClientOnly>
          <div className="w-full max-w-6xl mx-auto">
            <ContactsList />
          </div>
        </ClientOnly>
      </div>
    </main>
  );
}
