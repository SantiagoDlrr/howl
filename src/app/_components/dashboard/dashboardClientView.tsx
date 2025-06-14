// src/app/_components/dashboard/dashboardClientView.tsx
"use client";

import { useEffect, useState } from "react";
import FormsResults from "@/app/_components/dashboard/forms_results/formsResults";
import LookerDashboard from "@/app/_components/dashboard/lookerDashboard";
import ToggleButton from "@/app/_components/toggleButton";
import { getUserRole, type UserRoleData } from '@/app/utils/services/userService';

export default function DashboardClientView() {
  const [selectedView, setSelectedView] = useState<number>(1);
  const [userRole, setUserRole] = useState<UserRoleData | null>(null);

  useEffect(() => {
    async function fetchRole() {
      const roleData = await getUserRole();
      setUserRole(roleData);
    }
    fetchRole();
  }, []);

  const isAdmin = userRole?.role === 'administrator';

  return (
    <div className="container mx-auto p-4 ">
      {isAdmin && (
        <>
          <div className="bg-gray-100 flex gap-2 justify-end items-center rounded-md p-1 mb-6 mx-auto" style={{ width: 500 }}>
            <ToggleButton
              id={1}
              selected={selectedView === 1}
              setSelected={setSelectedView}
              large label="Análisis"
            />
            <ToggleButton
              id={2}
              selected={selectedView === 2}
              setSelected={setSelectedView}
              large label="Comentarios"
            />
          </div>
          <div style={{ height: 12 }} />
        </>
      )}

      {selectedView === 1 ? (
        <LookerDashboard
          dashboardUrl="https://lookerstudio.google.com/embed/reporting/1afcc679-2b0e-4f29-a41b-cc3bbce42e6e/page/d0VBF"
          title="Sales Performance"
          height="700px"
        />
      ) : (
        isAdmin && <FormsResults />
      )}
    </div>
  );
}