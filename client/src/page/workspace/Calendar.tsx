import { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useQuery } from "@tanstack/react-query";
import { getAllTasksQueryFn } from "@/lib/api";
import { TaskType } from "@/types/api.type";
import useCreateTaskDialog from "@/hooks/use-create-task-dialog";
import CreateTaskDialog from "@/components/workspace/task/create-task-dialog";
import {
       Tooltip,
       TooltipContent,
       TooltipProvider,
       TooltipTrigger,
} from "@/components/ui/tooltip";

const Calendar = () => {
       const workspaceId = useWorkspaceId();
       const [currentMonth, setCurrentMonth] = useState(new Date());
       const { onOpen } = useCreateTaskDialog();

       const { data } = useQuery({
              queryKey: ["all-tasks", workspaceId],
              queryFn: () => getAllTasksQueryFn({ workspaceId, pageSize: 1000 }), // Fetch all tasks for calendar
       });

       const tasks: TaskType[] = data?.tasks || [];

       const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
       const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
       const today = () => setCurrentMonth(new Date());

       const startDate = startOfWeek(startOfMonth(currentMonth));
       const endDate = endOfWeek(endOfMonth(currentMonth));

       const dateFormat = "d";
       const days = eachDayOfInterval({
              start: startDate,
              end: endDate,
       });

       const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

       return (
              <div className="flex flex-col h-full space-y-4 pt-4">
                     <div className="flex items-center justify-between px-1">
                            <div className="flex items-center space-x-4">
                                   <h2 className="text-2xl font-semibold tracking-tight">Calendar</h2>
                                   <div className="flex items-center bg-white dark:bg-card border rounded-md shadow-sm">
                                          <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
                                                 <ChevronLeft className="h-4 w-4" />
                                          </Button>
                                          <span className="w-32 text-center font-medium text-sm">
                                                 {format(currentMonth, "MMMM yyyy")}
                                          </span>
                                          <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
                                                 <ChevronRight className="h-4 w-4" />
                                          </Button>
                                   </div>
                                   <Button variant="outline" size="sm" onClick={today}>Today</Button>
                            </div>
                            <Button onClick={onOpen} className="gap-1">
                                   <Plus className="h-4 w-4" /> New Task
                            </Button>
                     </div>

                     <Card className="flex-1 flex flex-col shadow-md border-border/50 overflow-hidden">
                            {/* Header Days */}
                            <div className="grid grid-cols-7 border-b bg-gray-50/50 dark:bg-muted/20">
                                   {weekDays.map((day) => (
                                          <div key={day} className="py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                 {day}
                                          </div>
                                   ))}
                            </div>

                            {/* Calendar Grid */}
                            <CardContent className="flex-1 p-0 grid grid-cols-7 grid-rows-5 md:grid-rows-6">
                                   {days.map((day) => {
                                          const isCurrentMonth = isSameMonth(day, currentMonth);
                                          const isToday = isSameDay(day, new Date());

                                          // Filter tasks for this day
                                          const dayTasks = tasks.filter(task =>
                                                 task.dueDate && isSameDay(new Date(task.dueDate), day)
                                          );

                                          return (
                                                 <div
                                                        key={day.toString()}
                                                        className={`
                                    min-h-[80px] border-r border-b p-2 relative group transition-colors hover:bg-muted/30
                                    ${!isCurrentMonth ? "bg-gray-50/30 text-muted-foreground dark:bg-muted/10" : ""}
                                `}
                                                 >
                                                        <div className="flex justify-between items-start">
                                                               <span
                                                                      className={`
                                            text-sm w-6 h-6 flex items-center justify-center rounded-full font-medium
                                            ${isToday ? "bg-primary text-primary-foreground" : ""}
                                        `}
                                                               >
                                                                      {format(day, dateFormat)}
                                                               </span>
                                                        </div>
                                                        <div className="mt-1 space-y-1">
                                                               {dayTasks.map((task) => (
                                                                      <TooltipProvider key={task._id}>
                                                                             <Tooltip delayDuration={0}>
                                                                                    <TooltipTrigger asChild>
                                                                                           <div className="text-[10px] truncate px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200 border border-blue-200 dark:border-blue-800 cursor-pointer hover:opacity-80">
                                                                                                  {task.title}
                                                                                           </div>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent>
                                                                                           <p>{task.title}</p>
                                                                                           <p className="text-xs text-muted-foreground">{task.project?.name}</p>
                                                                                    </TooltipContent>
                                                                             </Tooltip>
                                                                      </TooltipProvider>
                                                               ))}
                                                               {dayTasks.length > 3 && (
                                                                      <div className="text-[10px] text-muted-foreground pl-1">
                                                                             +{dayTasks.length - 3} more
                                                                      </div>
                                                               )}
                                                        </div>
                                                 </div>
                                          );
                                   })}
                            </CardContent>
                     </Card>
                     <CreateTaskDialog hideTrigger />
              </div>
       );
};

export default Calendar;
