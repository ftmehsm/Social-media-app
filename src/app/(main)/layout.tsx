import { validateRequest } from "@/auth";
import { SessionProvider } from "./SessionProvider";
import { redirect } from "next/navigation";
import Navbar from "./Navbar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto  p-5">
        {children}
        </div>
      </div>
    </SessionProvider>
  );
}
