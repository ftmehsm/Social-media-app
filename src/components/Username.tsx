import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Username Component
 * 
 * Displays a username with @ symbol.
 * Ensures @ stays on the left side even in RTL mode.
 */
interface UsernameProps {
  username: string;
  className?: string;
  children?: ReactNode;
}

export default function Username({ 
  username, 
  className,
  children 
}: UsernameProps) {
  // If children are provided, use them (for custom formatting)
  // Otherwise, render @username
  const content = children || `@${username}`;
  
  return (
    <span 
      className={cn("username", className)}
      dir="ltr"
    >
      {content}
    </span>
  );
}

