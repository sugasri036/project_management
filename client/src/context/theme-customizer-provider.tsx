"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type AuroraTheme = "northern-lights" | "sunset" | "midnight" | "nebula";

interface ThemeCustomizerContextType {
       auroraTheme: AuroraTheme;
       setAuroraTheme: (theme: AuroraTheme) => void;
}

const ThemeCustomizerContext = createContext<ThemeCustomizerContextType | undefined>(undefined);

export function ThemeCustomizerProvider({ children }: { children: React.ReactNode }) {
       const [auroraTheme, setAuroraTheme] = useState<AuroraTheme>("northern-lights");

       // Persist preference
       useEffect(() => {
              const saved = localStorage.getItem("aurora-theme") as AuroraTheme;
              if (saved) setAuroraTheme(saved);
       }, []);

       useEffect(() => {
              localStorage.setItem("aurora-theme", auroraTheme);
       }, [auroraTheme]);

       return (
              <ThemeCustomizerContext.Provider value={{ auroraTheme, setAuroraTheme }}>
                     {children}
              </ThemeCustomizerContext.Provider>
       );
}

export function useThemeCustomizer() {
       const context = useContext(ThemeCustomizerContext);
       if (context === undefined) {
              throw new Error("useThemeCustomizer must be used within a ThemeCustomizerProvider");
       }
       return context;
}
