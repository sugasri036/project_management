import { Outlet } from "react-router-dom";
import { Lock } from "lucide-react";

const PublicWorkspaceLayout = () => {
       return (
              <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
                     {/* Read-Only Header */}
                     <header className="h-16 shrink-0 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
                            <div className="flex items-center gap-2">
                                   <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                          <Lock className="w-4 h-4 text-primary" />
                                   </div>
                                   <span className="font-semibold text-lg">Shared Workspace</span>
                            </div>
                            <div className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border/50">
                                   Read-Only Mode
                            </div>
                     </header>

                     {/* Content Area */}
                     <main className="flex-1 overflow-auto bg-muted/5 p-6">
                            <div className="max-w-7xl mx-auto w-full h-full">
                                   <Outlet />
                            </div>
                     </main>
              </div>
       );
};

export default PublicWorkspaceLayout;
