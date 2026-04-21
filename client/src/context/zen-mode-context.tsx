import React, { createContext, useContext, useState, useEffect } from "react";

type ZenModeContextType = {
       isZenMode: boolean;
       toggleZenMode: () => void;
       setZenMode: (value: boolean) => void;
};

const ZenModeContext = createContext<ZenModeContextType | undefined>(undefined);

export function ZenModeProvider({ children }: { children: React.ReactNode }) {
       const [isZenMode, setIsZenMode] = useState(false);

       // Keyboard shortcut: Ctrl + J or Cmd + J to toggle
       useEffect(() => {
              const handleKeyDown = (e: KeyboardEvent) => {
                     if ((e.ctrlKey || e.metaKey) && e.key === "j") {
                            e.preventDefault();
                            setIsZenMode((prev) => !prev);
                     }
              };
              window.addEventListener("keydown", handleKeyDown);
              return () => window.removeEventListener("keydown", handleKeyDown);
       }, []);

       return (
              <ZenModeContext.Provider
                     value={{
                            isZenMode,
                            toggleZenMode: () => setIsZenMode((prev) => !prev),
                            setZenMode: setIsZenMode,
                     }}
              >
                     {children}
              </ZenModeContext.Provider>
       );
}

export const useZenMode = () => {
       const context = useContext(ZenModeContext);
       if (!context) {
              throw new Error("useZenMode must be used within a ZenModeProvider");
       }
       return context;
};
