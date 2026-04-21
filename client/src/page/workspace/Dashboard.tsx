import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import useCreateProjectDialog from "@/hooks/use-create-project-dialog";
import useWorkspaceId from "@/hooks/use-workspace-id";
import WorkspaceAnalytics from "@/components/workspace/workspace-analytics";
import RecentProjects from "@/components/workspace/project/recent-projects";
import RecentTasks from "@/components/workspace/task/recent-tasks";
import { ActivityFeed } from "@/components/workspace/activity/activity-feed";
import RecentMembers from "@/components/workspace/member/recent-members";
import { useEffect, useState } from "react";
import { TiltCard } from "@/components/ui/tilt-card";
import ClientDashboard from "./ClientDashboard";
import { useAuthContext } from "@/context/auth-provider";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";

const GlassWidget = ({ children, className = "", title }: { children: React.ReactNode; className?: string; title?: string }) => (
  <TiltCard className={className}>
    <div className={`glass-card rounded-2xl p-6 h-full flex flex-col`}>
      {title && <h3 className="text-lg font-semibold mb-4 text-foreground/80">{title}</h3>}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  </TiltCard>
);

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
      <div className="text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-pulse">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-lg text-muted-foreground font-medium">
        {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
};

const WorkspaceDashboard = () => {
  const workspaceId = useWorkspaceId();
  const { onOpen } = useCreateProjectDialog();
  const { user } = useAuthContext();

  const { data: membersData } = useGetWorkspaceMembers(workspaceId);
  const currentMember = membersData?.members?.find(m => m.userId._id === user?._id);
  const isClient = currentMember?.role?.name === "CLIENT";

  if (isClient) {
    return <ClientDashboard />;
  }

  return (
    <main className="flex flex-1 flex-col py-4 md:pt-3 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
            Mission Control
          </h2>
          <p className="text-muted-foreground">Overview for this workspace</p>
        </div>
        <Button onClick={onOpen} className="glass border-primary/20 hover:bg-primary/20 text-foreground transition-all shadow-lg hover:shadow-primary/25">
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      {/* Analytics Row */}
      <div className="w-full">
        <WorkspaceAnalytics />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">

        {/* Left Column: Clock & Members */}
        <div className="space-y-6 flex flex-col">
          <GlassWidget className="h-48 border-blue-500/20 bg-blue-500/5">
            <ClockWidget />
          </GlassWidget>
          <GlassWidget title="Team Members" className="flex-1">
            <RecentMembers />
          </GlassWidget>
        </div>

        {/* Center Column: Projects (Wide) */}
        <div className="space-y-6 flex flex-col md:col-span-2">
          <GlassWidget title="Recent Projects" className="min-h-[300px]">
            <RecentProjects />
          </GlassWidget>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            <GlassWidget title="My Tasks">
              <RecentTasks />
            </GlassWidget>
            <GlassWidget title="Activity Feed">
              <ActivityFeed workspaceId={workspaceId} />
            </GlassWidget>
          </div>
        </div>

      </div>
    </main>
  );
};

export default WorkspaceDashboard;
