"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

interface LoginPromptDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  onCancel?: () => void;
}

export function LoginPromptDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  cancelText,
  onCancel,
}: LoginPromptDialogProps) {
  const router = useRouter();

  const handleLogin = () => {
    const currentPath = window.location.pathname;
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleLogin}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
