"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { getPlaceholderAvatar } from "@/src/utils/formatter";

interface AvatarUploadProps {
  userName: string;
  uploading: boolean;
  onUpload: (file: File) => Promise<unknown>;
}

export function AvatarUpload({
  userName,
  uploading,
  onUpload,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação básica antes de subir
    if (!file.type.startsWith("image/")) {
      alert("Selecione um arquivo de imagem.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 2MB.");
      return;
    }

    setPreview(URL.createObjectURL(file));
    await onUpload(file);
  };

  return (
    <div className="flex items-center gap-4 border rounded-lg p-4 bg-white/20">
      <div className="relative h-14 w-14 shrink-0 rounded-full overflow-hidden bg-muted ring-2 ring-medium-green/20">
        {preview ? (
          <Image
            src={preview}
            alt="Avatar"
            fill
            sizes="56px"
            loading="eager"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-dark-green/20">
            {getPlaceholderAvatar(userName)}
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="h-5 w-5 text-white animate-spin" />
          </div>
        )}
      </div>

      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 text-sm font-medium text-medium-green/80 hover:text-dark-green transition-colors"
        >
          <Camera className="h-4 w-4" />
          Alterar foto
        </button>
        <p className="text-xs text-muted-foreground mt-1">
          JPG ou PNG, até 2MB
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
