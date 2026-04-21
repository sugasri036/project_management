import { TaskType } from "@/types/api.type";
import { format, differenceInDays, startOfDay, addDays } from "date-fns";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getAvatarFallbackText } from "@/lib/helper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GanttTimelineProps {
       tasks: TaskType[];
       monthStart: Date;
}

export function GanttTimeline({ tasks, monthStart }: GanttTimelineProps) {
       const COLUMN_WIDTH = 40; // matches w-10 (2.5rem = 40px)

       return (
              <div className="flex flex-col relative min-h-[500px]">
                     {tasks.map((task) => {
                            // Derive dates
                            // Start: createdAt is reliable fallback.
                            // End: dueDate. If missing, assume 1 day duration.
                            const startDate = task.createdAt ? new Date(task.createdAt) : new Date();
                            const endDate = task.dueDate ? new Date(task.dueDate) : addDays(startDate, 1);

                            // Ensure dates are valid
                            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return <div key={task._id} className="h-12 w-full border-b border-muted/20" />;

                            // Calculate Position
                            // Relative to the currently visible month
                            const offsetDays = differenceInDays(startOfDay(startDate), startOfDay(monthStart));
                            const durationDays = Math.max(1, differenceInDays(endOfDay(endDate), startOfDay(startDate)) + 1);

                            // Styling based on status
                            const getStatusColor = (status: string) => {
                                   switch (status) {
                                          case "DONE": return "from-green-500/80 to-green-600/80 border-green-500/50";
                                          case "IN_PROGRESS": return "from-blue-500/80 to-blue-600/80 border-blue-500/50";
                                          case "IN_REVIEW": return "from-purple-500/80 to-purple-600/80 border-purple-500/50";
                                          default: return "from-gray-500/80 to-gray-600/80 border-gray-500/50";
                                   }
                            };

                            const statusGradient = getStatusColor(task.status);

                            return (
                                   <div key={task._id} className="h-12 w-full border-b border-muted/20 relative group">
                                          {/* The Bar */}
                                          <TooltipProvider>
                                                 <Tooltip>
                                                        <TooltipTrigger asChild>
                                                               <motion.div
                                                                      initial={{ opacity: 0, scaleX: 0 }}
                                                                      animate={{ opacity: 1, scaleX: 1 }}
                                                                      transition={{ duration: 0.4, ease: "easeOut" }}
                                                                      className={`absolute top-2.5 h-7 rounded-full bg-gradient-to-r ${statusGradient} shadow-lg backdrop-blur-md border cursor-pointer hover:brightness-110 z-10 flex items-center px-2 overflow-hidden`}
                                                                      style={{
                                                                             left: `${offsetDays * COLUMN_WIDTH}px`,
                                                                             width: `${durationDays * COLUMN_WIDTH}px`,
                                                                             minWidth: "20px" // Ensure visibility
                                                                      }}
                                                                      whileHover={{ scale: 1.02, y: -1 }}
                                                               >
                                                                      {durationDays > 2 && (
                                                                             <span className="text-[10px] text-white font-medium truncate drop-shadow-md">
                                                                                    {task.title}
                                                                             </span>
                                                                      )}
                                                               </motion.div>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="glass-card border-none text-foreground p-3 shadow-xl">
                                                               <div className="flex flex-col gap-1">
                                                                      <p className="font-semibold text-sm">{task.title}</p>
                                                                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                             <span>{format(startDate, "MMM d")} - {format(endDate, "MMM d")}</span>
                                                                      </div>
                                                                      <div className="flex items-center justify-between mt-2">
                                                                             <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase">
                                                                                    {task.status.replace("_", " ")}
                                                                             </span>
                                                                             {task.assignedTo && task.assignedTo.length > 0 && (
                                                                                    <div className="flex -space-x-1.5 overflow-hidden pb-1">
                                                                                           {task.assignedTo.slice(0, 3).map((assignee) => (
                                                                                                  <div key={assignee._id} className="flex items-center gap-1">
                                                                                                         <Avatar className="w-4 h-4 border border-white dark:border-gray-900">
                                                                                                                <AvatarImage src={assignee.profilePicture || ""} />
                                                                                                                <AvatarFallback className="text-[6px]">{getAvatarFallbackText(assignee.name)}</AvatarFallback>
                                                                                                         </Avatar>
                                                                                                  </div>
                                                                                           ))}
                                                                                           {task.assignedTo.length > 3 && (
                                                                                                  <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[6px] border border-white dark:border-gray-900">
                                                                                                         +{task.assignedTo.length - 3}
                                                                                                  </div>
                                                                                           )}
                                                                                    </div>
                                                                             )}
                                                                      </div>
                                                               </div>
                                                        </TooltipContent>
                                                 </Tooltip>
                                          </TooltipProvider>
                                   </div>
                            );
                     })}
              </div>
       );
}

// Helper for duration calculation
function endOfDay(date: Date) {
       const d = new Date(date);
       d.setHours(23, 59, 59, 999);
       return d;
}
