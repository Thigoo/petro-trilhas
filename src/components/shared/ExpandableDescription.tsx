"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface ExpandableDescriptionProps {
  description: string;
}

export default function ExpandableDescription({
  description,
}: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = description.length > 320; // ≈ 4-5 linhas

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">
        Sobre a trilha
      </h2>

      <div className="prose prose-slate max-w-none">
        <p
          className={`text-lg leading-relaxed text-slate-700 transition-all duration-300 ${
            isExpanded ? "" : "line-clamp-4"
          }`}
        >
          {description}
        </p>
      </div>

      {isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
        >
          {isExpanded ? "Mostrar menos" : "Ler mais"}
          <ChevronDown
            size={18}
            className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </div>
  );
}
