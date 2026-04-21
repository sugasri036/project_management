import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/context/auth-provider";
import { toast } from "@/hooks/use-toast";
import { Check, Copy, Link as LinkIcon, Mail, Send, Loader2 } from "lucide-react";
import { BASE_ROUTE } from "@/routes/common/routePaths";
import PermissionsGuard from "@/components/resuable/permission-guard";
import { Permissions } from "@/constant";
import { useMutation } from "@tanstack/react-query";
import { inviteMemberMutationFn } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const InviteMember = () => {
  const { workspace, workspaceLoading } = useAuthContext();
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: inviteMemberMutationFn,
    onSuccess: () => {
      toast({
        title: "Invitation Sent",
        description: `An invite has been sent to ${email}`,
        variant: "success",
      });
      setEmail("");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send",
        description: error.message || "Could not send invitation.",
        variant: "destructive",
      });
    },
  });

  const memberInviteUrl = workspace
    ? `${window.location.origin}${BASE_ROUTE.INVITE_URL.replace(
      ":inviteCode",
      workspace.inviteCode
    )}`
    : "";

  const clientInviteUrl = workspace
    ? `${window.location.origin}${BASE_ROUTE.SHARED_LINK.replace(
      ":code",
      workspace.inviteCodeClient || ""
    )}`
    : "";


  const handleCopy = (url: string) => {
    if (url) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        toast({
          title: "Link Copied",
          description: "Invite link copied to clipboard.",
        });
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleInvitePayload = () => {
    if (!workspace) return;
    mutate({ workspaceId: workspace._id, email });
  };

  return (
    <Card className="border-border/50 shadow-sm bg-gradient-to-br from-card to-muted/20">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          Invite Users
        </CardTitle>
        <CardDescription>
          Invite users to join <strong>{workspace?.name}</strong> via email or by sharing a link.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <PermissionsGuard showMessage requiredPermission={Permissions.ADD_MEMBER}>
          {workspaceLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <Tabs defaultValue="member" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="member">Team Member</TabsTrigger>
                <TabsTrigger value="client">Client (Read-Only)</TabsTrigger>
              </TabsList>

              <TabsContent value="member" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-invite" className="text-sm font-medium">Invite Member by Email</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email-invite"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Button
                      disabled={isPending || !email}
                      onClick={handleInvitePayload}
                      className="bg-primary hover:bg-primary/90 min-w-[100px]"
                    >
                      {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                      Invite
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or share link</span></div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link" className="text-sm font-medium">Copy Member Invite Link</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="link"
                        disabled={true}
                        className="pl-9 disabled:opacity-100 disabled:bg-muted/50"
                        value={memberInviteUrl}
                        readOnly
                      />
                    </div>
                    <Button variant="outline" className="shrink-0 min-w-[100px]" onClick={() => handleCopy(memberInviteUrl)}>
                      {copied ? <><Check className="w-4 h-4 mr-2 text-green-500" /> Copied</> : <><Copy className="w-4 h-4 mr-2" /> Copy</>}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Anyone with this link joins as a <strong>Member</strong> (can edit).</p>
                </div>
              </TabsContent>

              <TabsContent value="client" className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <p className="text-sm text-muted-foreground mb-4">
                    Clients have <strong>View Only</strong> access to projects they are added to. They cannot edit tasks or settings.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="client-link" className="text-sm font-medium">Copy Client Invite Link</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="client-link"
                          disabled={true}
                          className="pl-9 disabled:opacity-100 disabled:bg-muted/50"
                          value={clientInviteUrl}
                          readOnly
                        />
                      </div>
                      <Button variant="outline" className="shrink-0 min-w-[100px]" onClick={() => handleCopy(clientInviteUrl)}>
                        {copied ? <><Check className="w-4 h-4 mr-2 text-green-500" /> Copied</> : <><Copy className="w-4 h-4 mr-2" /> Copy</>}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </PermissionsGuard>
      </CardContent>
    </Card>
  );
};

export default InviteMember;
