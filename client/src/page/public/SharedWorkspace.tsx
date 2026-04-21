import { getPublicProjectsQueryFn, getPublicWorkspaceQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Loader2, FolderKanban, CalendarDays } from "lucide-react";
import {
       Card,
       CardContent,
       CardDescription,
       CardHeader,
       CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SharedWorkspace = () => {
       const { code } = useParams();

       const { data: workspaceData, isLoading: workspaceLoading, error: workspaceError } = useQuery({
              queryKey: ["publicWorkspace", code],
              queryFn: () => getPublicWorkspaceQueryFn(code as string),
              enabled: !!code,
       });

       const { data: projectsData, isLoading: projectsLoading } = useQuery({
              queryKey: ["publicProjects", code],
              queryFn: () => getPublicProjectsQueryFn({ code: code as string }),
              enabled: !!code,
       });

       if (workspaceLoading) {
              return (
                     <div className="h-full flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-muted-foreground text-sm">Loading shared workspace...</p>
                     </div>
              );
       }

       if (workspaceError || !workspaceData) {
              return (
                     <div className="h-full flex flex-col items-center justify-center gap-4">
                            <p className="text-destructive font-semibold">Unable to load workspace.</p>
                            <p className="text-muted-foreground text-sm">The link might be invalid or expired.</p>
                     </div>
              )
       }

       const workspace = workspaceData.workspace;
       const projects = projectsData?.projects || [];

       return (
              <div className="space-y-8">
                     {/* Workspace Header Info */}
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                   <h1 className="text-3xl font-bold tracking-tight mb-1">{workspace.name}</h1>
                                   <p className="text-muted-foreground">{workspace.description || "No description provided."}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card px-4 py-2 rounded-lg border border-border/50">
                                   <span>Owner:</span>
                                   <span className="font-medium text-foreground">{workspace.owner?.name || "Unknown"}</span>
                            </div>
                     </div>

                     {/* Projects List */}
                     <div className="grid gap-6">
                            <div className="flex items-center gap-2">
                                   <FolderKanban className="w-5 h-5 text-primary" />
                                   <h2 className="text-xl font-semibold">Shared Projects</h2>
                            </div>

                            {projectsLoading ? (
                                   <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                            ) : projects.length === 0 ? (
                                   <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                                          No projects found in this workspace.
                                   </div>
                            ) : (
                                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                          {projects.map((project: any) => (
                                                 <Link key={project._id} to={`/shared/${code}/project/${project._id}`} className="block h-full">
                                                        <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm group h-full cursor-pointer relative overflow-hidden">
                                                               {/* Hover Overlay */}
                                                               <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                                               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                                      <CardTitle className="text-lg font-medium truncate flex items-center gap-2">
                                                                             <span className="text-xl">{project.emoji}</span>
                                                                             {project.name}
                                                                      </CardTitle>
                                                               </CardHeader>
                                                               <CardContent>
                                                                      <CardDescription className="line-clamp-2 min-h-[40px] mb-4">
                                                                             {project.description || "No description"}
                                                                      </CardDescription>

                                                                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                                                             <div className="flex -space-x-2">
                                                                                    {/* Placeholder for members if we want to show them later, for now just hidden or static */}
                                                                             </div>
                                                                             <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                                                    <CalendarDays className="w-3 h-3" />
                                                                                    {new Date(project.updatedAt).toLocaleDateString()}
                                                                             </div>
                                                                      </div>

                                                                      {/* Simple Status Badges */}
                                                                      <div className="mt-4 flex flex-wrap gap-1">
                                                                             {project.taskStatuses?.slice(0, 3).map((status: any) => (
                                                                                    <Badge key={status.value} variant="outline" className="text-[10px] h-5 px-1.5" style={{ borderColor: status.color, color: status.color }}>
                                                                                           {status.label}
                                                                                    </Badge>
                                                                             ))}
                                                                             {project.taskStatuses?.length > 3 && (
                                                                                    <Badge variant="outline" className="text-[10px] h-5 px-1.5 opacity-50">+{project.taskStatuses.length - 3}</Badge>
                                                                             )}
                                                                      </div>
                                                               </CardContent>
                                                        </Card>
                                                 </Link>
                                          ))}
                                   </div>
                            )}
                     </div>
              </div>
       );
};

export default SharedWorkspace;
