import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskStatusEnumType } from "@/constant";
import { TaskType } from "@/types/api.type";
import { SortableContext } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useMemo } from "react";
import { TaskCard } from "./task-card";

interface TaskColumnProps {
       column: {
              id: TaskStatusEnumType;
              title: string;
       };
       tasks: TaskType[];
       onEditTask: (task: TaskType) => void;
}

export function TaskColumn({ column, tasks, onEditTask }: TaskColumnProps) {
       const { setNodeRef } = useDroppable({
              id: column.id,
              data: {
                     type: "Column",
                     column,
              },
       });

       const tasksIds = useMemo(() => {
              return tasks
                     .filter((task) => task._id) // Filter out invalid tasks
                     .map((task) => task._id);
       }, [tasks]);

       const validTasks = useMemo(
              () => tasks.filter((task) => task && task._id),
              [tasks]
       );

       // Color coding columns
       const columnColor =
              column.id === "DONE"
                     ? "bg-green-500/10 border-green-500/20"
                     : column.id === "IN_PROGRESS"
                            ? "bg-blue-500/10 border-blue-500/20"
                            : column.id === "IN_REVIEW"
                                   ? "bg-purple-500/10 border-purple-500/20"
                                   : column.id === "TODO"
                                          ? "bg-gray-500/10 border-gray-500/20"
                                          : "bg-red-500/10 border-red-500/20"; // Backlog

       const badgeVariant = column.id === "DONE" ? "default" : "secondary";

       return (
              <div
                     ref={setNodeRef}
                     className={`flex h-full w-[350px] min-w-[350px] flex-col rounded-2xl glass border-none p-4 transition-colors ${columnColor}`}
              >
                     <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                   <h3 className="font-semibold">{column.title}</h3>
                                   <Badge variant={badgeVariant} className="rounded-full px-2">
                                          {tasks.length}
                                   </Badge>
                            </div>
                     </div>

                     <ScrollArea className="h-full pr-3">
                            <div className="flex flex-col gap-3 pb-4">
                                   <SortableContext items={tasksIds}>
                                          {validTasks.map((task) => (
                                                 <TaskCard key={task._id} task={task} onEdit={onEditTask} />
                                          ))}
                                   </SortableContext>
                            </div>
                            {validTasks.length === 0 && (
                                   <div className="flex h-20 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20">
                                          <p className="text-sm text-muted-foreground">No tasks</p>
                                   </div>
                            )}
                     </ScrollArea>
              </div>
       );
}
