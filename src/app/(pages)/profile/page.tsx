// app/profile/page.tsx
"use client";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

// Si usas el sub-folder components:
import { Avatar } from "src/app/(pages)/profile/avatar.tsx";
import { ProfileHeader } from "src/app/(pages)/profile/profileHeader.tsx";
import { PersonalInfo } from "src/app/(pages)/profile/personalInfo.tsx";
import { RecentActivity } from "src/app/(pages)/profile/recentActivity.tsx";
import { ProfileActions } from "src/app/(pages)/profile/profileActions.tsx";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Cargando…</div>;
  }
  if (status === "unauthenticated") {
    redirect("/login");
    return null;
  }
  if (!session) {
    return <div>Ocurrió un error, recarga la página.</div>;
  }

  // A estas alturas TS sabe que session.user existe
  const user = {
    id:      session.user.id,                      
    name:    session.user.name  ?? "Sin Nombre",   
    email:   session.user.email ?? "Sin Email",
    image:   session.user.image ?? undefined,
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <ProfileHeader user={user} />

          <div className="p-8 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <PersonalInfo user={user} />
              <RecentActivity />
            </div>
            {/* Cambiado callbackUrl a "/" para redirigir a la landing page */}
            <ProfileActions />
          </div>
        </div>
      </div>
    </div>
  );
}