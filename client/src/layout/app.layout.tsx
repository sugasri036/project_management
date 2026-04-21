import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AuthProvider } from "@/context/auth-provider";
import { ThemeCustomizerProvider } from "@/context/theme-customizer-provider";
import { ZenModeProvider, useZenMode } from "@/context/zen-mode-context";
import Asidebar from "@/components/asidebar/asidebar";
import Header from "@/components/header";
import CreateWorkspaceDialog from "@/components/workspace/create-workspace-dialog";
import CreateProjectDialog from "@/components/workspace/project/create-project-dialog";
import BackgroundGlow from "@/components/background-glow";
import { CommandPalette } from "@/components/command-palette";
import { cn } from "@/lib/utils";

const ZenLayoutContent = () => {
  const { isZenMode, toggleZenMode } = useZenMode();

  return (
    <SidebarProvider>
      {/* Sidebar fades out in Zen Mode, but reappears on hover */}
      <div className={cn("transition-opacity duration-700 ease-in-out", isZenMode ? "opacity-0 hover:opacity-100" : "opacity-100")}>
        <Asidebar />
      </div>

      <BackgroundGlow />

      <SidebarInset className="overflow-x-hidden bg-transparent transition-all duration-700">
        <div className="w-full flex flex-col min-h-screen">
          {/* Header fades out in Zen Mode, reappears on hover */}
          <div className={cn("transition-opacity duration-700 ease-in-out sticky top-0 z-50", isZenMode ? "opacity-0 hover:opacity-100" : "opacity-100")}>
            <Header />
          </div>

          {/* Main Content Centers in Zen Mode */}
          <div className={cn(
            "flex-1 transition-all duration-700 ease-in-out px-3 lg:px-20 py-3",
            isZenMode ? "max-w-6xl mx-auto w-full pt-10" : "w-full"
          )}>
            <Outlet />
          </div>

          {/* Zen Mode Toggle Button (Floating) - Only visible when in Zen Mode to exit */}
          {isZenMode && (
            <button
              onClick={toggleZenMode}
              className="fixed bottom-6 right-6 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all text-muted-foreground hover:text-foreground z-50 animate-in fade-in zoom-in duration-1000"
              title="Exit Zen Mode (Ctrl+J)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-minimize-2"><polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" /><line x1="14" y1="10" x2="21" y2="3" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
            </button>
          )}
        </div>
        <CreateWorkspaceDialog />
        <CreateProjectDialog />
      </SidebarInset>
    </SidebarProvider>
  )
}

const AppLayout = () => {
  return (
    <AuthProvider>
      <ThemeCustomizerProvider>
        <ZenModeProvider>
          <CommandPalette />
          <ZenLayoutContent />
        </ZenModeProvider>
      </ThemeCustomizerProvider>
    </AuthProvider>
  );
};

export default AppLayout;
