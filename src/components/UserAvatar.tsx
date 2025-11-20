import Image from "next/image";
import AvatarPlaceholder from "@/assets/avatar-placeholder.png";
import { cn, isUploadThingUrl } from "@/lib/utils";

interface UserAvatarProps {
  avatarUrl: string | null | undefined;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  avatarUrl,
  size,
  className,
}: UserAvatarProps) {
  const imageSize = size ?? 48;
  const src = avatarUrl || AvatarPlaceholder;
  const isUploadThing = typeof src === "string" && isUploadThingUrl(src);

  // Use regular img tag for UploadThing URLs to avoid Next.js Image Optimization
  if (isUploadThing) {
    return (
      <img
        src={src}
        alt="User Avatar"
        width={imageSize}
        height={imageSize}
        className={cn(
          "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
          className,
        )}
      />
    );
  }

  return (
    <Image
      src={src}
      alt="User Avatar"
      width={imageSize}
      height={imageSize}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        className,
      )}
    />
  );
}
