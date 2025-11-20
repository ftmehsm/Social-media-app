import { validateRequest } from "@/auth";
import { redirect } from "@/i18n/routing";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { user } = await validateRequest();
  const { locale } = await params;

  if (user) {
    redirect({ href: "/", locale });
  }

  return <>{children}</>;
}
