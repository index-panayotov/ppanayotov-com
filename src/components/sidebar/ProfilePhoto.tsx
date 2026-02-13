import Image from "next/image";

export function ProfilePhoto() {
  return (
    <div className="flex justify-center px-6 py-6">
      <Image
        src="/profile.jpg"
        alt="Preslav Panayotov"
        width={160}
        height={160}
        className="h-40 w-40 rounded-md object-cover"
        priority
      />
    </div>
  );
}
