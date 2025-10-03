import React, { useState } from "react";
import { Input, InputProps } from "./ui/input";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("", className)}
          ref={ref}
          {...props}
        />
        <button
          className="top-1/2 right-3 absolute text-muted-foreground -translate-y-1/2 transform"
          onClick={() => setShowPassword(!showPassword)}
          title={showPassword ? "Hide password" : "show password"}
        >
          {showPassword ? (
            <EyeOffIcon className="size-5" />
          ) : (
            <EyeIcon className="size-5" />
          )}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
