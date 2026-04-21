import {
       getPublicProjectQueryFn,
       getPublicProjectTasksQueryFn,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { Loader2, ArrowLeft, Calendar, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
       Card,
       CardContent,
       CardDescription,
       CardHeader,
       CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TaskType } from "@/types/api.type";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";

const SharedProjectDetails = () => {
       const { code, projectId } = useParams();

       const { data: projectData, isLoading: projectLoading } = useQuery({
              queryKey: ["publicProject", code, projectId],
              queryFn: () =>
                     getPublicProjectQueryFn({
                            code: code as string,
                            projectId: projectId as string,
                     }),
              enabled: !!code && !!projectId,
       });

       const { data: tasksData, isLoading: tasksLoading } = useQuery({
              queryKey: ["publicTasks", code, projectId],
              queryFn: () =>
                     getPublicProjectTasksQueryFn({
                            code: code as string,
                            projectId: projectId as string,
                     }),
              enabled: !!code && !!projectId,
       });

       if (projectLoading) {
              return (
                     <div className="h-full flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-muted-foreground text-sm">Loading project...</p>
                     </div>
              );
       }

       if (!projectData?.project) {
              return (
                     <div className="h-full flex flex-col items-center justify-center gap-4">
                            <p className="text-destructive font-semibold">Project not found.</p>
                            <Link
                                   to={`/shared/${code}`}
                                   className="text-primary hover:underline text-sm"
                            >
                                   Back to Workspace
                            </Link>
                     </div>
              );
       }

       const project = projectData.project;
       const tasks = tasksData?.tasks || [];

       return (
              <div className="space-y-8">
                     {/* Header */}
                     <div className="flex flex-col gap-4">
                            <Link
                                   to={`/shared/${code}`}
                                   className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-fit transition-colors"
                            >
                                   <ArrowLeft className="w-4 h-4" />
                                   Back to Workspace
                            </Link>

                            <div>
                                   <div className="flex items-center gap-3 mb-2">
                                          <span className="text-4xl">{project.emoji}</span>
                                          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                                   </div>

                                   <p className="text-muted-foreground max-w-2xl">{project.description}</p>
                            </div>
                     </div>

                     {/* Tasks Grid */}
                     <div>
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                   Tasks <Badge variant="secondary" className="rounded-full ml-2">{tasks.length}</Badge>
                            </h2>

                            {tasksLoading ? (
                                   <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                            ) : tasks.length === 0 ? (
                                   <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                                          No tasks visible in this project.
                                   </div>
                            ) : (
                                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                          {tasks.map((task: TaskType) => (
                                                 <ReadOnlyTaskCard key={task._id} task={task} />
                                          ))}
                                   </div>
                            )}
                     </div>
              </div>
       );
};

const ReadOnlyTaskCard = ({ task }: { task: any }) => {
       return (
              <Card className="hover:shadow-md transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
                     <CardHeader className="p-4 pb-2 space-y-1">
                            <div className="flex justify-between items-start gap-2">
                                   <CardTitle className="text-base font-medium leading-tight">{task.title}</CardTitle>
                                   <Badge variant="outline" className="shrink-0 text-[10px] uppercase tracking-wider font-semibold">
                                          {task.priority}
                                   </Badge>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                                   <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                                          {task.status}
                                   </span>
                            </div>
                     </CardHeader>
                     <CardContent className="p-4 pt-2">
                            <CardDescription className="line-clamp-2 text-xs mb-4 min-h-[32px]">
                                   {task.description || "No description provided."}
                            </CardDescription>

                            <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                   <div className="flex items-center gap-2">
                                          {task.assignedTo && task.assignedTo.length > 0 ? (
                                                 <div className="flex -space-x-1.5 overflow-hidden">
                                                        {task.assignedTo.slice(0, 3).map((assignee: any) => {
                                                               const initials = getAvatarFallbackText(assignee.name || "Unknown");
                                                               const color = getAvatarColor(assignee.name || "Unknown");
                                                               return (
                                                                      <Avatar key={assignee._id} className="w-5 h-5 border border-border cursor-help transition-transform hover:z-10 hover:scale-110" title={assignee.name}>
                                                                             <AvatarImage src={assignee.profilePicture} />
                                                                             <AvatarFallback className={color} style={{ fontSize: "7px" }}>
                                                                                    {initials}
                                                                             </AvatarFallback>
                                                                      </Avatar>
                                                               );
                                                        })}
                                                        {task.assignedTo.length > 3 && (
                                                               <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[8px] border border-border z-10" title={`+${task.assignedTo.length - 3} more`}>
                                                                      +{task.assignedTo.length - 3}
                                                               </div>
                                                        )}
                                                 </div>
                                          ) : (
                                                 <div className="flex items-center gap-1.5 text-muted-foreground/50">
                                                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                                                               <UserIcon className="w-3 h-3" />
                                                        </div>
                                                        <span className="text-[10px]">Unassigned</span>
                                                 </div>
                                          )}
                                   </div>

                                   <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                          <Calendar className="w-3 h-3" />
                                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                                   </div>
                            </div>
                     </CardContent>
              </Card>
       )
}

export default SharedProjectDetails;
