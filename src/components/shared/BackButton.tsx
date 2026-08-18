"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => router.back()}
      aria-label="Voltar para trilhas"
      className="z-20 absolute top-6 left-6 bg-white/90 backdrop-blur-sm hover:bg-white 
             text-dark-green hover:text-medium-green rounded-full shadow-sm 
             w-10 h-10 transition-all"
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
}
