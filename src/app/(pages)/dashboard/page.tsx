// src/app/dashboard/page.tsx — SERVER COMPONENT ✅
import { auth } from "@/server/auth";
import RestrictedAccess from "@/app/_components/auth/restrictedAccess";
import DashboardClientView from "@/app/_components/dashboard/dashboardClientView";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) return <RestrictedAccess />;

  return <DashboardClientView />;
}