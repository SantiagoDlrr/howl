// app/profile/components/Avatar.tsx
import Image from "next/image";

interface AvatarProps {
  name: string;
  image?: string;
}

export function Avatar({ name, image }: AvatarProps) {
  if (image) {
    return (
      <Image
        src={image}
        alt={`Foto de ${name}`}
        width={110}
        height={110}
        className="rounded-full"
      />
    );
  }
  return (
    <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white/20">
      <span className="text-3xl font-bold text-indigo-700">
        {name.charAt(0)}
      </span>
    </div>
  );
}