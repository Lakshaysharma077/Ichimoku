"use client";

import { useState, useEffect } from "react";
import { staticContent, ContentType } from "@/lib/content";

export function useContent<K extends keyof ContentType>(section: K): ContentType[K] {
  const [data, setData] = useState<ContentType[K]>(staticContent[section]);

  useEffect(() => {
    async function fetchDynamicContent() {
      try {
        const res = await fetch(`/api/admin/content/${section}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(`Failed to fetch dynamic content for section: ${section}`, err);
      }
    }

    fetchDynamicContent();
  }, [section]);

  return data;
}
