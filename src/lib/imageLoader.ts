import { convertUploadThingUrl } from "./utils";

/**
 * Custom image loader for Next.js Image component
 * Returns UploadThing URLs as-is without optimization
 */
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // Convert old UploadThing URLs to new format
  const convertedSrc = convertUploadThingUrl(src) || src;

  // If it's an UploadThing URL (old or new format), return it directly without optimization
  if (convertedSrc.includes("utfs.io") || convertedSrc.includes(".ufs.sh")) {
    return convertedSrc;
  }

  // For other images, use Next.js default optimization
  const params = new URLSearchParams();
  params.set("url", src);
  params.set("w", width.toString());
  params.set("q", (quality || 75).toString());

  return `/_next/image?${params.toString()}`;
}
