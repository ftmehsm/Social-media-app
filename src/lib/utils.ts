import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDate, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeDate(from:Date) {
  const currentDate = new Date();

  if(currentDate.getTime() - from.getTime() < 24*60*60*1000) {
    return formatDistanceToNow(from, { addSuffix: true });
  } else{
    if(currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, "MMM d");
    } else {
      return formatDate(from, "MMM d, yyyy");
    }
  }
}