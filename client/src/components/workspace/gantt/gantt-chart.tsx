import { useState, useMemo } from "react";
import { format, eachDayOfInterval, startOfMonth, endOfMonth, addMonths, subMonths, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { getAllTasksQueryFn } from "@/lib/api";
import { useParams } from "react-router-dom";
import useTaskTableFilter from "@/hooks/use-task-table-filter";
import { GanttTimeline } from "./GanttTimeline";

export default function GanttChart() {
       const workspaceId = useWorkspaceId();
       const param = useParams();
       const projectIdParam = param.projectId as string;
       const [filters] = useTaskTableFilter();

       const [currentDate, setCurrentDate] = useState(new Date());

       // View mode: 'Month' | 'Week' (For MVP we stick to Month view with day fidelity)
       const [viewMode, setViewMode] = useState<"month">("month");

       // Fetch tasks
       const { data, isLoading } = useQuery({
              queryKey: ["all-tasks", workspaceId, 100, 1, filters, projectIdParam],
              queryFn: () =>
                     getAllTasksQueryFn({
                            workspaceId,
                            keyword: filters.keyword,
                            priority: filters.priority,
                            status: filters.status,
                            projectId: projectIdParam || filters.projectId,
                            assignedTo: filters.assigneeId,
                            pageNumber: 1,
                            pageSize: 100,
                     }),
       });

       const tasks = data?.tasks || [];

       // Month Navigation
       const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
       const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

       // Generate days for the grid
       const daysInMonth = useMemo(() => {
              return eachDayOfInterval({
                     start: startOfMonth(currentDate),
                     end: endOfMonth(currentDate),
              });
       }, [currentDate]);

       if (isLoading) {
              return (
                     <div className="flex h-96 items-center justify-center">
                            <Loader className="w-10 h-10 animate-spin text-primary" />
                     </div>
              );
       }

       return (
              <div className="flex flex-col h-full gap-4">
                     {/* Header Controls */}
                     <div className="flex items-center justify-between p-2 pl-1">
                            <div className="flex items-center gap-4">
                                   <div className="flex items-center gap-2">
                                          <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
                                                 <ChevronLeft className="w-4 h-4" />
                                          </Button>
                                          <h2 className="text-lg font-semibold w-32 text-center">
                                                 {format(currentDate, "MMMM yyyy")}
                                          </h2>
                                          <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                                                 <ChevronRight className="w-4 h-4" />
                                          </Button>
                                   </div>
                            </div>

                            <Select value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
                                   <SelectTrigger className="w-[120px]">
                                          <SelectValue />
                                   </SelectTrigger>
                                   <SelectContent>
                                          <SelectItem value="month">Month View</SelectItem>
                                   </SelectContent>
                            </Select>
                     </div>

                     {/* Gantt Area */}
                     <div className="flex-1 border rounded-lg overflow-hidden glass-card relative flex">
                            {/* Sidebar (Task List) - Sticky Left */}
                            <div className="w-64 border-r flex flex-col bg-background/50 backdrop-blur-sm z-20 shrink-0">
                                   <div className="h-12 border-b flex items-center px-4 font-semibold text-sm bg-muted/30">
                                          Task Name
                                   </div>
                                   <ScrollArea className="flex-1">
                                          <div className="flex flex-col">
                                                 {tasks.map((task) => (
                                                        <div
                                                               key={task._id}
                                                               className="h-12 flex items-center px-4 border-b last:border-0 text-sm truncate hover:bg-muted/20 transition-colors"
                                                               title={task.title}
                                                        >
                                                               {task.title}
                                                        </div>
                                                 ))}
                                          </div>
                                   </ScrollArea>
                            </div>

                            {/* Timeline Grid */}
                            <ScrollArea className="flex-1 w-full">
                                   <div className="flex flex-col min-w-max">
                                          {/* Timeline Header */}
                                          <div className="sticky top-0 z-10 flex h-12 bg-background/80 backdrop-blur-sm border-b">
                                                 {daysInMonth.map((day) => (
                                                        <div
                                                               key={day.toISOString()}
                                                               className={`w-10 shrink-0 flex flex-col items-center justify-center border-r last:border-0 text-xs ${isSameDay(day, new Date()) ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"
                                                                      }`}
                                                        >
                                                               <span>{format(day, "d")}</span>
                                                               <span className="text-[10px] opacity-70">{format(day, "EEE")}</span>
                                                        </div>
                                                 ))}
                                          </div>

                                          {/* Timeline Body (Task Rows) */}
                                          <div className="relative">
                                                 {/* Background Grid Lines */}
                                                 <div className="absolute inset-0 flex pointer-events-none">
                                                        {daysInMonth.map((day) => (
                                                               <div key={day.toISOString()} className="w-10 border-r last:border-0 h-full border-muted/20" />
                                                        ))}
                                                 </div>

                                                 {/* Task Rows */}
                                                 <GanttTimeline
                                                        tasks={tasks}
                                                        monthStart={startOfMonth(currentDate)}
                                                 />
                                          </div>
                                   </div>
                                   <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                     </div>
              </div>
       );
}
