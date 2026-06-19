"use client";

import dynamic from "next/dynamic";

const TrailMap = dynamic(() => import("./TrailMap"), {
  ssr: false,
  loading: () => (
    <div className="h-120 bg-slate-100 animate-pulse rounded-2xl" />
  ),
});

export default TrailMap;
