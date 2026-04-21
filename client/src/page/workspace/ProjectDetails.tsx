import { Separator } from "@/components/ui/separator";
import ProjectAnalytics from "@/components/workspace/project/project-analytics";
import ProjectHeader from "@/components/workspace/project/project-header";
import TaskTable from "@/components/workspace/task/task-table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutList, Kanban, ChartGantt } from "lucide-react";
import TaskBoard from "@/components/workspace/task/task-board";
import GanttChart from "@/components/workspace/gantt/gantt-chart";

const ProjectDetails = () => {
  return (
    <div className="w-full space-y-6 py-4 md:pt-3">
      <ProjectHeader />
      <div className="space-y-5">
        <ProjectAnalytics />
        <Separator />

        <Tabs defaultValue="list" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="list" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <LayoutList className="w-4 h-4 mr-2" />
                List
              </TabsTrigger>
              <TabsTrigger value="board" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Kanban className="w-4 h-4 mr-2" />
                Board
              </TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <ChartGantt className="w-4 h-4 mr-2" />
                Timeline
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="list" className="mt-0">
            <TaskTable />
          </TabsContent>
          <TabsContent value="board" className="mt-0 h-[calc(100vh-320px)]">
            <TaskBoard />
          </TabsContent>
          <TabsContent value="timeline" className="mt-0">
            <GanttChart />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectDetails;
