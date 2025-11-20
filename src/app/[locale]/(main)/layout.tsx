import { validateRequest } from "@/auth";
import { SessionProvider } from "@/contexts/SessionProvider";
import { redirect } from "@/i18n/routing";
import Navbar from "./Navbar";
import MenuBar from "./MenuBar";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const session = await validateRequest();
  const { locale } = await params;

  if (!session.user || !session.session) {
    redirect({ href: "/login", locale });
  }

  // After the check, we know user and session are non-null
  // TypeScript needs explicit assertion since validateRequest returns a union type
  const { user, session: userSession } = session as {
    user: NonNullable<typeof session.user>;
    session: NonNullable<typeof session.session>;
  };

  return (
    <SessionProvider value={{ user, session: userSession }}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
          <MenuBar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
          {children}
        </div>
        <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
      </div>
    </SessionProvider>
  );
}
