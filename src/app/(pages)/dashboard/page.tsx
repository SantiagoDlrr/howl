import RestrictedAccess from "@/app/_components/auth/restrictedAccess";
import LookerDashboard from "@/app/_components/dashboard/lookerDashboard";
import { auth } from "@/server/auth";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    return (
      <RestrictedAccess />
    )
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
      <LookerDashboard
        dashboardUrl="https://lookerstudio.google.com/embed/reporting/1afcc679-2b0e-4f29-a41b-cc3bbce42e6e/page/d0VBF"
        title="Sales Performance"
        height="700px"
      />
    </div>
  );
}