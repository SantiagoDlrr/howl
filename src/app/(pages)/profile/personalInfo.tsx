// src/app/(pages)/profile/components/PersonalInfo.tsx
"use client";

interface User {
  id:    string;
  name:  string;
  email: string;
}

interface PersonalInfoProps {
  user: User;
}

export function PersonalInfo({ user }: PersonalInfoProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
        Información Personal
      </h2>
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
          <div>
            <dt className="text-sm text-gray-500 mb-1">Nombre</dt>
            <dd className="text-gray-800 font-medium">{user.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500 mb-1">Email</dt>
            <dd className="text-gray-800 font-medium break-all">{user.email}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="text-sm text-gray-500 mb-1">ID de Usuario</dt>
            <dd className="text-gray-800 font-mono text-sm break-all bg-gray-100 p-2 rounded">
              {user.id}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}