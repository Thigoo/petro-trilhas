import { Mountain } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface AppLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function AppLogo({
  size = "md",
  showText = true,
  className,
}: AppLogoProps) {
  const sizes = {
    sm: {
      icon: "h-6 w-6",
      text: "text-xl",
      gap: "gap-2",
    },
    md: {
      icon: "h-10 w-10",
      text: "text-3xl",
      gap: "gap-2.5",
    },
    lg: {
      icon: "h-13 w-13",
      text: "text-5xl",
      gap: "gap-3",
    },
  };

  const current = sizes[size];

  return (
    <div className={cn("flex items-center", current.gap, className)}>
      <Mountain className={cn(current.icon, "text-medium-green")} />

      {showText && (
        <span
          className={cn(
            current.text,
            "font-bold tracking-tight text-dark-green",
          )}
        >
          Petro<span className="text-medium-green">Trilhas</span>
        </span>
      )}
    </div>
  );
}
