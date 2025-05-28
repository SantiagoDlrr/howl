// src/app/(pages)/profile/components/ProfileHeader.tsx
"use client";
import Image from "next/image";

interface User {
  name:  string;
  email: string;
  image?: string;
}

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-56 relative">
      <div className="flex items-center h-full px-8">
        <div className="flex items-center space-x-6">
          <div className="relative ring-4 ring-white/30 rounded-full shadow-lg">
            {user.image ? (
              <Image
                src={user.image}
                alt={`Foto de ${user.name}`}
                width={110}
                height={110}
                className="rounded-full"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white/20">
                <span className="text-3xl font-bold text-indigo-700">
                  {user.name.charAt(0)}
                </span>
              </div>
            )}
            <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-green-500 border-2 border-white" />
          </div>
          <div className="text-white">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-indigo-100 flex items-center mt-1">
              {/* icono de email */}
              {user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}