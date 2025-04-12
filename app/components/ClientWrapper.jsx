"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";

export default function ClientWrapper({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {mounted ? children : null}
    </ThemeProvider>
  );
}
