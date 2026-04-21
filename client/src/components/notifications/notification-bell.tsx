import {
       Popover,
       PopoverContent,
       PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptInviteMutationFn, getPendingInvitesQueryFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

const NotificationBell = () => {
       const queryClient = useQueryClient();
       const navigate = useNavigate();

       const { data, isLoading } = useQuery({
              queryKey: ["pendingInvites"],
              queryFn: getPendingInvitesQueryFn,
              staleTime: 0, // Always fetch fresh
       });

       const { mutate: acceptInvite, isPending: isAccepting } = useMutation({
              mutationFn: acceptInviteMutationFn,
              onSuccess: (data) => {
                     toast({
                            title: "Success",
                            description: "Joined workspace successfully!",
                            variant: "success",
                     });
                     queryClient.invalidateQueries({ queryKey: ["pendingInvites"] });
                     queryClient.invalidateQueries({ queryKey: ["userWorkspaces"] });
                     // Navigate to the new workspace
                     navigate(`/workspace/${data.workspaceId}`);
              },
              onError: (error: any) => {
                     toast({
                            title: "Error",
                            description: error.response?.data?.message || "Failed to join workspace",
                            variant: "destructive",
                     });
              },
       });

       const inviteCount = data?.invites?.length || 0;

       return (
              <Popover>
                     <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                   <Bell className="h-5 w-5" />
                                   {inviteCount > 0 && (
                                          <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                                                 {inviteCount}
                                          </span>
                                   )}
                            </Button>
                     </PopoverTrigger>
                     <PopoverContent className="w-80 p-0" align="start">
                            <div className="p-4 font-semibold border-b">
                                   Notifications
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                   {isLoading ? (
                                          <div className="p-4 flex justify-center"><Loader className="animate-spin" /></div>
                                   ) : inviteCount === 0 ? (
                                          <div className="p-4 text-center text-muted-foreground text-sm">
                                                 No pending invites
                                          </div>
                                   ) : (
                                          <div className="divide-y">
                                                 {data?.invites.map((invite: any) => (
                                                        <div key={invite._id} className="p-4 space-y-3">
                                                               <div className="space-y-1">
                                                                      <p className="text-sm font-medium">
                                                                             Invite to <span className="text-primary">{invite.workspaceId?.name}</span>
                                                                      </p>
                                                                      <p className="text-xs text-muted-foreground">
                                                                             Invited by {invite.inviterId?.name}
                                                                      </p>
                                                               </div>
                                                               <Button
                                                                      size="sm"
                                                                      className="w-full"
                                                                      onClick={() => acceptInvite(invite._id)}
                                                                      disabled={isAccepting}
                                                               >
                                                                      {isAccepting ? "Joining..." : "Accept & Join"}
                                                               </Button>
                                                        </div>
                                                 ))}
                                          </div>
                                   )}
                            </div>
                     </PopoverContent>
              </Popover>
       );
};

export default NotificationBell;
