"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface TrailImageGalleryProps {
  images: string[];
  trailName: string;
}

export default function TrailImageGallery({
  images,
  trailName,
}: TrailImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })],
  );

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  if (images.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">
        Fotos da trilha
      </h2>

      {/* Carrossel */}
      <div
        className="relative overflow-hidden rounded-3xl group"
        ref={emblaRef}
      >
        <div className="flex">
          {images.map((img, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] relative aspect-video cursor-pointer"
              onClick={() => setSelectedIndex(index)}
            >
              <Image
                src={img}
                alt={`${trailName} - foto ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 85vw"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium bg-black/60 px-6 py-2.5 rounded-full">
                  Ampliar foto
                </span>
              </div>
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-all z-10"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-all z-10"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-19 right-6 text-white p-3 hover:bg-white/10 rounded-full transition z-10"
          >
            <X size={32} />
          </button>

          <div className="relative w-full max-w-5xl">
            <Image
              src={images[selectedIndex]}
              alt="Imagem ampliada"
              width={1200}
              height={800}
              className="max-h-[85vh] w-auto mx-auto object-contain"
              priority
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setSelectedIndex((prev) =>
                    prev === null ? images.length - 1 : prev - 1,
                  )
                }
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() =>
                  setSelectedIndex((prev: number | null) =>
                    prev !== null
                      ? prev === images.length - 1
                        ? 0
                        : prev + 1
                      : prev,
                  )
                }
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/80 text-white p-2 rounded-full transition"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
