import AuraLoader from "@/components/ui/aura-loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BASE_ROUTE } from "@/routes/common/routePaths";
import useAuth from "@/hooks/api/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invitedUserJoinWorkspaceMutationFn, getWorkspaceByInviteCodeQueryFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import AuthLayout from "@/components/auth/auth-layout";

const InviteUser = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const param = useParams();
  const inviteCode = param.inviteCode as string;

  const { data: authData, isPending: isAuthPending } = useAuth();
  const user = authData?.user;

  // Fetch workspace details by invite code
  const { data: workspaceData, isPending: isWorkspacePending } = useQuery({
    queryKey: ["workspace-invite", inviteCode],
    queryFn: () => getWorkspaceByInviteCodeQueryFn(inviteCode),
    enabled: !!inviteCode,
  });

  const { mutate, isPending: isJoining } = useMutation({
    mutationFn: invitedUserJoinWorkspaceMutationFn,
  });

  const returnUrl = encodeURIComponent(
    `${BASE_ROUTE.INVITE_URL.replace(":inviteCode", inviteCode)}`
  );

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    mutate(inviteCode, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ["userWorkspaces"],
        });
        navigate(`/workspace/${data.workspaceId}`);
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

  const workspace = workspaceData?.workspace;
  const isLoading = isAuthPending || isWorkspacePending;

  return (
    <AuthLayout
      title={workspace?.name || "Workspace Invitation"}
      description={isLoading ? "Loading details..." : "Join your team on Aura"}
    >
      <div className="flex flex-col gap-6">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <AuraLoader size={40} />
          </div>
        ) : (
          <>
            <div className="text-center">
              <p className="text-base text-muted-foreground">
                You have been invited to join <strong>{workspace?.name}</strong>
                {workspace?.owner && (
                  <span> by <span className="text-foreground font-medium">{workspace.owner.name}</span></span>
                )}
              </p>
              {workspace?.description && (
                <p className="text-sm text-muted-foreground mt-2 italic">"{workspace.description}"</p>
              )}
            </div>

            <div className="mt-4">
              {user ? (
                <div className="flex flex-col items-center justify-center gap-6">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 w-full justify-center backdrop-blur-sm">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold ring-2 ring-primary/20">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Logged in as {user.email}</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="w-full">
                    <Button
                      type="submit"
                      disabled={isJoining}
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-lg h-12 shadow-md hover:shadow-green-500/20 transition-all sm:text-lg font-medium"
                    >
                      {isJoining && (
                        <AuraLoader size={20} className="mr-2" />
                      )}
                      Accept & Join Workspace
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <p className="text-center text-sm text-muted-foreground mb-2">
                    Log in or Sign up to accept this invitation.
                  </p>
                  <div className="flex flex-col md:flex-row items-center gap-3">
                    <Link
                      className="flex-1 w-full"
                      to={`/sign-up?returnUrl=${returnUrl}`}
                    >
                      <Button className="w-full h-11 text-base shadow-md hover:shadow-primary/20 transition-all">Create Account</Button>
                    </Link>
                    <Link
                      className="flex-1 w-full"
                      to={`/?returnUrl=${returnUrl}`}
                    >
                      <Button variant="outline" className="w-full h-11 text-base border-primary/20 hover:bg-primary/5">
                        Login
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default InviteUser;
