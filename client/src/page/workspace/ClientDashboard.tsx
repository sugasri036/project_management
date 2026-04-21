import useWorkspaceId from "@/hooks/use-workspace-id";
import RecentProjects from "@/components/workspace/project/recent-projects";
import RecentTasks from "@/components/workspace/task/recent-tasks";
import { ActivityFeed } from "@/components/workspace/activity/activity-feed";
import { TiltCard } from "@/components/ui/tilt-card";

const GlassWidget = ({ children, className = "", title }: { children: React.ReactNode; className?: string; title?: string }) => (
       <TiltCard className={className}>
              <div className={`glass-card rounded-2xl p-6 h-full flex flex-col`}>
                     {title && <h3 className="text-lg font-semibold mb-4 text-foreground/80">{title}</h3>}
                     <div className="flex-1 overflow-hidden">{children}</div>
              </div>
       </TiltCard>
);

const ClientDashboard = () => {
       const workspaceId = useWorkspaceId();

       return (
              <main className="flex flex-1 flex-col py-4 md:pt-3 space-y-6">
                     {/* Header Section */}
                     <div className="flex items-center justify-between">
                            <div>
                                   <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                                          Client Portal
                                   </h2>
                                   <p className="text-muted-foreground">Overview of your assigned projects</p>
                            </div>
                     </div>

                     {/* Main Grid Layout */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                            {/* Left Column: Projects */}
                            <div className="space-y-6 flex flex-col">
                                   <GlassWidget title="My Projects" className="min-h-[400px]">
                                          <RecentProjects />
                                   </GlassWidget>
                            </div>

                            {/* Right Column: Tasks & Activity */}
                            <div className="space-y-6 flex flex-col">
                                   <GlassWidget title="My Tasks">
                                          <RecentTasks />
                                   </GlassWidget>
                                   <GlassWidget title="Recent Activity">
                                          <ActivityFeed workspaceId={workspaceId} />
                                   </GlassWidget>
                            </div>
                     </div>
              </main>
       );
};

export default ClientDashboard;
