import { ConfirmDialog } from "@/components/resuable/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth-provider";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { toast } from "@/hooks/use-toast";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { leaveWorkspaceMutationFn } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LeaveWorkspaceCard = () => {
       const { workspace } = useAuthContext();
       const navigate = useNavigate();

       const queryClient = useQueryClient();
       const workspaceId = useWorkspaceId();

       const { open, onOpenDialog, onCloseDialog } = useConfirmDialog();

       const { mutate, isPending } = useMutation({
              mutationFn: leaveWorkspaceMutationFn,
       });

       const handleConfirm = () => {
              mutate(workspaceId, {
                     onSuccess: () => {
                            queryClient.invalidateQueries({
                                   queryKey: ["userWorkspaces"],
                            });
                            navigate("/");
                            setTimeout(() => onCloseDialog(), 100);
                     },
                     onError: (error) => {
                            toast({
                                   title: "Error",
                                   description: error.message,
                                   variant: "destructive",
                            });
                     },
              });
       };

       return (
              <>
                     <div className="w-full border-t pt-5 mt-5">
                            <div className="mb-5">
                                   <h1
                                          className="text-[17px] tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1.5
           text-center sm:text-left"
                                   >
                                          Leave Workspace
                                   </h1>
                            </div>

                            <div className="flex flex-col items-start justify-between py-0">
                                   <div className="flex-1 mb-2">
                                          <p className="text-muted-foreground text-sm">
                                                 Leaving the workspace will revoke your access to all projects, tasks, and members within this workspace.
                                                 You will need to be re-invited to join again.
                                          </p>
                                   </div>
                                   <Button
                                          className="shrink-0 flex place-self-end h-[40px]"
                                          variant="destructive"
                                          onClick={onOpenDialog}
                                   >
                                          <LogOut className="w-4 h-4 mr-2" />
                                          Leave Workspace
                                   </Button>
                            </div>
                     </div>

                     <ConfirmDialog
                            isOpen={open}
                            isLoading={isPending}
                            onClose={onCloseDialog}
                            onConfirm={handleConfirm}
                            title={`Leave ${workspace?.name} Workspace`}
                            description={`Are you sure you want to leave this workspace? You will lose access immediately.`}
                            confirmText="Leave"
                            cancelText="Cancel"
                     />
              </>
       );
};

export default LeaveWorkspaceCard;
