"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface TrailImageGalleryProps {
  images: string[];
  trailName: string;
}

export default function TrailImageGallery({
  images,
  trailName,
}: TrailImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const allImages = images;

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goToPrevious = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev: number | null) => {
      if (prev === null) return null;
      return prev === 0 ? allImages.length - 1 : prev - 1;
    });
  };

  const goToNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev: number | null) => {
      if (prev === null) return null;
      return prev === allImages.length - 1 ? 0 : prev + 1;
    });
  };

  if (allImages.length === 0) return null;

  return (
    <div className="w-full">
      {/* Galeria */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">
          Fotos da trilha
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allImages.map((img, index) => (
            <div
              key={index}
              className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-sm cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={img}
                alt={`${trailName} - foto ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover hover:scale-105 transition-transform duration-300"
                loading="eager"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">Ampliar</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-19 right-6 text-white p-3 hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <X size={32} />
          </button>

          <div className="relative w-full max-w-5xl px-4 py-8">
            <Image
              src={allImages[selectedIndex]}
              alt="Imagem ampliada"
              width={1200}
              height={800}
              className="max-h-[85vh] w-auto mx-auto object-contain"
              priority
            />

            {/* Navegação */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-4 rounded-full transition-all"
                >
                  <ChevronLeft size={28} />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-4 rounded-full transition-all"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </div>

          {/* Contador */}
          <div className="absolute bottom-8 text-white text-sm font-mono">
            {selectedIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
