"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

const PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_ID!;

export default function MicrosoftClarity() {
  useEffect(() => {
    Clarity.init(PROJECT_ID);
  }, []);

  return null;
}
