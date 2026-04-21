import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { enUS } from "date-fns/locale";
import { TaskType } from "@/types/api.type";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useQuery } from "@tanstack/react-query";
import { getAllTasksQueryFn, getProjectsInWorkspaceQueryFn } from "@/lib/api";
import {
       Dialog,
       DialogContent,
       DialogHeader,
       DialogTitle,
} from "@/components/ui/dialog";
import {
       Select,
       SelectContent,
       SelectItem,
       SelectTrigger,
       SelectValue,
} from "@/components/ui/select";
import { TaskCard } from "./task-card";
import { Loader } from "lucide-react";

// Setup date-fns localizer
const locales = {
       "en-US": enUS,
};

const localizer = dateFnsLocalizer({
       format,
       parse,
       startOfWeek,
       getDay,
       locales,
});

interface TaskEvent {
       id: string;
       title: string;
       start: Date;
       end: Date;
       allDay?: boolean;
       resource?: TaskType;
}

const TaskCalendar = () => {
       const workspaceId = useWorkspaceId();

       const { data: projectsData } = useQuery({
              queryKey: ["allprojects", workspaceId],
              queryFn: () => getProjectsInWorkspaceQueryFn({ workspaceId, pageSize: 1000 }),
       });
       const projects = projectsData?.projects || [];

       const [projectId, setProjectId] = useState<string>("all");

       const { data, isLoading } = useQuery({
              queryKey: ["all-tasks", workspaceId, projectId],
              queryFn: () =>
                     getAllTasksQueryFn({
                            workspaceId,
                            pageSize: 100,
                            projectId: projectId === "all" ? undefined : projectId,
                     }),
       });

       const tasks = data?.tasks || [];

       const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

       // Transform Tasks to Events
       const events: TaskEvent[] = tasks
              .filter((task) => task.dueDate) // Only map tasks with due dates
              .map((task) => {
                     const date = new Date(task.dueDate);
                     return {
                            id: task._id,
                            title: task.title,
                            start: date,
                            end: date, // Assuming 1-day tasks for now, or use same date
                            allDay: true,
                            resource: task,
                     };
              });

       const handleSelectEvent = (event: TaskEvent) => {
              if (event.resource) {
                     setSelectedTask(event.resource);
              }
       };

       const eventStyleGetter = (event: TaskEvent) => {
              const priority = event.resource?.priority;
              let backgroundColor = "#3174ad";
              if (priority === "HIGH") backgroundColor = "#ef4444"; // Red
              if (priority === "MEDIUM") backgroundColor = "#f59e0b"; // Amber
              if (priority === "LOW") backgroundColor = "#10b981"; // Green


              return {
                     style: {
                            backgroundColor,
                            borderRadius: "4px",
                            opacity: 0.8,
                            color: "white",
                            border: "0px",
                            display: "block",
                     },
              };
       };

       if (isLoading) {
              return (
                     <div className="flex h-96 items-center justify-center">
                            <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
                     </div>
              );
       }

       return (
              <div className="h-[calc(100vh-220px)] w-full bg-white dark:bg-zinc-950 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-4">
                     <div className="flex justify-end">
                            <Select value={projectId} onValueChange={setProjectId}>
                                   <SelectTrigger className="w-[180px]">
                                          <SelectValue placeholder="All Projects" />
                                   </SelectTrigger>
                                   <SelectContent>
                                          <SelectItem value="all">All Projects</SelectItem>
                                          {projects.map((project: any) => (
                                                 <SelectItem key={project._id} value={project._id}>
                                                        {project.name}
                                                 </SelectItem>
                                          ))}
                                   </SelectContent>
                            </Select>
                     </div>

                     <div className="flex-1">
                            <Calendar
                                   localizer={localizer}
                                   events={events}
                                   startAccessor="start"
                                   endAccessor="end"
                                   style={{ height: "100%" }}
                                   views={["month", "week", "day"]}
                                   defaultView="month"
                                   onSelectEvent={handleSelectEvent}
                                   eventPropGetter={eventStyleGetter}
                                   className="text-sm"
                            />
                     </div>

                     {/* View Task Details Dialog */}
                     <Dialog
                            open={!!selectedTask}
                            onOpenChange={(open) => !open && setSelectedTask(null)}
                     >
                            <DialogContent className="max-w-md border-0">
                                   <DialogHeader>
                                          <DialogTitle>{selectedTask?.title}</DialogTitle>
                                   </DialogHeader>
                                   {selectedTask && <TaskCard task={selectedTask} />}
                            </DialogContent>
                     </Dialog>
              </div>
       );
};

export default TaskCalendar;
