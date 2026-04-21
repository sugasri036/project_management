import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getWorkspaceActivitiesQueryFn } from "@/lib/api";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Loader, Activity } from "lucide-react";

interface ActivityFeedProps {
       workspaceId: string;
}

export function ActivityFeed({ workspaceId }: ActivityFeedProps) {
       const { data, isLoading } = useQuery({
              queryKey: ["workspace-activities", workspaceId],
              queryFn: () => getWorkspaceActivitiesQueryFn(workspaceId),
              refetchInterval: 10000,
       });

       const activities: any[] = data?.activities || [];

       return (
              <div className="flex flex-col h-full bg-muted/20 rounded-lg border p-4">
                     <div className="flex items-center gap-2 mb-4">
                            <Activity className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold text-lg">Activity Log</h3>
                     </div>

                     <ScrollArea className="h-[300px]">
                            {isLoading ? (
                                   <div className="flex justify-center p-4">
                                          <Loader className="w-6 h-6 animate-spin text-primary" />
                                   </div>
                            ) : activities.length > 0 ? (
                                   <div className="flex flex-col gap-4 pr-3">
                                          {activities.map((activity) => {
                                                 const initials = getAvatarFallbackText(activity.userId.name);
                                                 const avatarColor = getAvatarColor(activity.userId.name);

                                                 return (
                                                        <div key={activity._id} className="flex gap-3 text-sm">
                                                               <Avatar className="h-8 w-8 mt-1">
                                                                      <AvatarImage src={activity.userId.profilePicture} alt={activity.userId.name} />
                                                                      <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
                                                               </Avatar>
                                                               <div className="flex flex-col gap-0.5">
                                                                      <div className="flex items-center gap-1.5 flex-wrap">
                                                                             <span className="font-semibold">{activity.userId.name}</span>
                                                                             <span className="text-muted-foreground">{activity.action}</span>
                                                                             <span className="font-medium text-primary">{activity.entityType}</span>
                                                                      </div>
                                                                      {activity.details && (
                                                                             <p className="text-muted-foreground text-xs">{activity.details}</p>
                                                                      )}
                                                                      <span className="text-[10px] text-muted-foreground mt-0.5">
                                                                             {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                                                      </span>
                                                               </div>
                                                        </div>
                                                 )
                                          })}
                                   </div>
                            ) : (
                                   <div className="text-center text-muted-foreground py-8 text-sm">
                                          No recent activity.
                                   </div>
                            )}
                     </ScrollArea>
              </div>
       );
}
