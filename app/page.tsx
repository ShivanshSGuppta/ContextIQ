import { redirect } from "next/navigation";

import { LandingPage } from "@/components/contextiq/landing-page";
import { getSessionUser } from "@/lib/auth/session";

export default async function HomePage() {
  const user = await getSessionUser();

  if (user) {
    redirect("/overview");
  }

  return <LandingPage />;
}
