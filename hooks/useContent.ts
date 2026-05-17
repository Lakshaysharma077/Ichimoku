"use client";

import { useState, useEffect } from "react";
import { staticContent, ContentType } from "@/lib/content";

export function useContent<K extends keyof ContentType>(section: K): ContentType[K] {
  const [data, setData] = useState<ContentType[K]>(staticContent[section]);

  useEffect(() => {
    async function fetchDynamicContent() {
      try {
        const res = await fetch(`/api/admin/content/${section}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          // Ensure we don't set error objects as content data
          if (json && typeof json === 'object' && !json.error) {
            setData(json);
          }
        }
      } catch (err) {
        console.error(`Failed to fetch dynamic content for section: ${section}`, err);
      }
    }

    fetchDynamicContent();
  }, [section]);

  return data;
}
