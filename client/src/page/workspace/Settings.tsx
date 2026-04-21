import { Separator } from "@/components/ui/separator";
import WorkspaceHeader from "@/components/workspace/common/workspace-header";
import EditWorkspaceForm from "@/components/workspace/edit-workspace-form";
import DeleteWorkspaceCard from "@/components/workspace/settings/delete-workspace-card";
import LeaveWorkspaceCard from "@/components/workspace/settings/leave-workspace-card";
import { Permissions } from "@/constant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Users, Wind, Sunset, CloudMoon, Sparkles, Monitor, Moon, Sun } from "lucide-react";
import { useAuthContext } from "@/context/auth-provider";
import { useThemeCustomizer } from "@/context/theme-customizer-provider";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const Settings = () => {
  const { hasPermission } = useAuthContext();
  const { auroraTheme, setAuroraTheme } = useThemeCustomizer();
  const { theme, setTheme } = useTheme();

  const canManageSettings = hasPermission(Permissions.MANAGE_WORKSPACE_SETTINGS);

  return (
    <div className="w-full h-auto py-2">
      <WorkspaceHeader />
      <Separator className="my-4 " />
      <main>
        <div className="w-full max-w-4xl mx-auto py-3">
          <h2 className="text-[24px] leading-[30px] font-bold mb-6 tracking-tight">
            Settings
          </h2>

          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6 overflow-x-auto">
              <TabsTrigger
                value="appearance"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 pb-3 pt-2"
              >
                Appearance
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 pb-3 pt-2"
              >
                Notifications
              </TabsTrigger>

              {canManageSettings && (
                <>
                  <TabsTrigger
                    value="general"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 pb-3 pt-2"
                  >
                    General
                  </TabsTrigger>

                  <TabsTrigger
                    value="members"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 pb-3 pt-2"
                  >
                    Members
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            {/* ERROR: Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <div className="space-y-6">
                {/* Base Theme */}
                <div className="p-6 border rounded-lg bg-card/50 glass-card">
                  <h3 className="text-lg font-medium mb-4">Interface Theme</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <button onClick={() => setTheme("light")} className={cn("p-4 rounded-lg border-2 flex flex-col items-center gap-2 hover:bg-accent/50 transition-all", theme === 'light' ? 'border-primary bg-accent' : 'border-transparent')}>
                      <Sun className="h-6 w-6" />
                      <span className="text-sm font-medium">Light</span>
                    </button>
                    <button onClick={() => setTheme("dark")} className={cn("p-4 rounded-lg border-2 flex flex-col items-center gap-2 hover:bg-accent/50 transition-all", theme === 'dark' ? 'border-primary bg-accent' : 'border-transparent')}>
                      <Moon className="h-6 w-6" />
                      <span className="text-sm font-medium">Dark</span>
                    </button>
                    <button onClick={() => setTheme("system")} className={cn("p-4 rounded-lg border-2 flex flex-col items-center gap-2 hover:bg-accent/50 transition-all", theme === 'system' ? 'border-primary bg-accent' : 'border-transparent')}>
                      <Monitor className="h-6 w-6" />
                      <span className="text-sm font-medium">System</span>
                    </button>
                  </div>
                </div>

                {/* Aurora Moods */}
                <div className="p-6 border rounded-lg bg-card/50 glass-card">
                  <h3 className="text-lg font-medium mb-4">Aurora Moods</h3>
                  <p className="text-sm text-muted-foreground mb-4">Choose a dynamic ambient background for your workspace.</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button onClick={() => setAuroraTheme("northern-lights")} className={cn("p-4 rounded-lg border-2 flex flex-col items-center gap-2 hover:bg-cyan-500/10 transition-all", auroraTheme === 'northern-lights' ? 'border-cyan-500 bg-cyan-500/10' : 'border-transparent')}>
                      <Wind className="h-8 w-8 text-cyan-400" />
                      <span className="text-sm font-medium">Northern Lights</span>
                    </button>
                    <button onClick={() => setAuroraTheme("sunset")} className={cn("p-4 rounded-lg border-2 flex flex-col items-center gap-2 hover:bg-orange-500/10 transition-all", auroraTheme === 'sunset' ? 'border-orange-500 bg-orange-500/10' : 'border-transparent')}>
                      <Sunset className="h-8 w-8 text-orange-400" />
                      <span className="text-sm font-medium">Sunset</span>
                    </button>
                    <button onClick={() => setAuroraTheme("midnight")} className={cn("p-4 rounded-lg border-2 flex flex-col items-center gap-2 hover:bg-indigo-500/10 transition-all", auroraTheme === 'midnight' ? 'border-indigo-500 bg-indigo-500/10' : 'border-transparent')}>
                      <CloudMoon className="h-8 w-8 text-indigo-500" />
                      <span className="text-sm font-medium">Midnight</span>
                    </button>
                    <button onClick={() => setAuroraTheme("nebula")} className={cn("p-4 rounded-lg border-2 flex flex-col items-center gap-2 hover:bg-fuchsia-500/10 transition-all", auroraTheme === 'nebula' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-transparent')}>
                      <Sparkles className="h-8 w-8 text-fuchsia-500" />
                      <span className="text-sm font-medium">Nebula</span>
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <div className="p-6 border rounded-lg bg-card/50 glass-card">
                <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  {[
                    "New Task Assigned",
                    "Project Deadline Approaching",
                    "Weekly Digest",
                    "Mentions in Comments"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <span className="text-sm font-medium">{item}</span>
                      <Switch defaultChecked={i < 2} />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {canManageSettings && (
              <>
                <TabsContent value="general" className="space-y-6">
                  <div className="grid gap-6">
                    <EditWorkspaceForm />
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <LeaveWorkspaceCard />
                        <DeleteWorkspaceCard />
                      </div>
                    </div>
                  </div>
                </TabsContent>



                <TabsContent value="members">
                  <div className="p-6 border rounded-lg bg-card/50 glass-card flex flex-col items-center justify-center text-center py-12">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">Manage Team</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mb-4">
                      Invite new members and manage roles from the centralized member dashboard.
                    </p>
                    <Button variant="default">Go to Members Page</Button>
                  </div>
                </TabsContent>
              </>
            )}

          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Settings;
