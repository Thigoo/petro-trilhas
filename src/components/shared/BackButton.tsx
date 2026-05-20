"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      onClick={() => router.back()}
      className="z-20 absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 
                 bg-white/90 backdrop-blur-sm hover:bg-white text-green-900 
                 rounded-full shadow-sm transition-all font-medium text-sm"
    >
      <ArrowLeft className="h-4 w-4" />
      Voltar para trilhas
    </Button>
  );
}
