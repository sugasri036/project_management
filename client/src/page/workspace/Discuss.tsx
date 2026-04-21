import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { getWorkspaceDiscussionsQueryFn, createDiscussionMutationFn } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Loader, Send } from "lucide-react";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import { toast } from "@/hooks/use-toast";

const Discuss = () => {
       const workspaceId = useWorkspaceId();
       const queryClient = useQueryClient();
       const [content, setContent] = useState("");

       const { data, isLoading } = useQuery({
              queryKey: ["discussions", workspaceId],
              queryFn: () => getWorkspaceDiscussionsQueryFn(workspaceId),
       });

       const { mutate, isPending } = useMutation({
              mutationFn: createDiscussionMutationFn,
              onSuccess: () => {
                     queryClient.invalidateQueries({ queryKey: ["discussions", workspaceId] });
                     setContent("");
                     toast({ title: "Message posted", variant: "success" });
              },
              onError: () => {
                     toast({ title: "Failed to post message", variant: "destructive" });
              }
       });

       const handleSubmit = (e: React.FormEvent) => {
              e.preventDefault();
              if (!content.trim()) return;
              mutate({ workspaceId, content });
       }

       const discussions = data?.discussions || [];

       return (
              <div className="flex flex-col h-full space-y-6 pt-4 p-4 max-w-5xl mx-auto">
                     <div>
                            <h2 className="text-2xl font-bold tracking-tight">Team Discussion</h2>
                            <p className="text-muted-foreground">
                                   Share updates, ideas, and general messages with the team.
                            </p>
                     </div>

                     <Card className="flex flex-col flex-1 h-[calc(100vh-200px)]">
                            <CardHeader className="border-b shadow-sm bg-gray-50/50 dark:bg-card">
                                   <CardTitle className="text-lg">Conversation</CardTitle>
                            </CardHeader>

                            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                                   {/* Message List */}
                                   <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                          {isLoading && <div className="text-center py-4">Loading messages...</div>}

                                          {!isLoading && discussions.length === 0 && (
                                                 <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                                        <p>No messages yet. Start the conversation!</p>
                                                 </div>
                                          )}

                                          {discussions.map((msg: any) => {
                                                 const initials = getAvatarFallbackText(msg.author.name);
                                                 const avatarColor = getAvatarColor(msg.author.name);

                                                 return (
                                                        <div key={msg._id} className="flex gap-4">
                                                               <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-800 shadow-sm">
                                                                      <AvatarImage src={msg.author.profilePicture} />
                                                                      <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
                                                               </Avatar>
                                                               <div className="flex-1 space-y-1">
                                                                      <div className="flex items-center gap-2">
                                                                             <span className="font-semibold text-sm">{msg.author.name}</span>
                                                                             <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}</span>
                                                                      </div>
                                                                      <div className="text-sm bg-gray-100 dark:bg-muted p-3 rounded-r-lg rounded-bl-lg max-w-[80%] inline-block">
                                                                             {msg.content}
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 )
                                          })}
                                   </div>

                                   {/* Input Area */}
                                   <div className="p-4 border-t bg-background">
                                          <form onSubmit={handleSubmit} className="flex gap-4">
                                                 <Textarea
                                                        placeholder="Type a message..."
                                                        className="min-h-[60px] resize-none"
                                                        value={content}
                                                        onChange={(e) => setContent(e.target.value)}
                                                        onKeyDown={(e) => {
                                                               if (e.key === 'Enter' && !e.shiftKey) {
                                                                      e.preventDefault();
                                                                      handleSubmit(e);
                                                               }
                                                        }}
                                                 />
                                                 <Button type="submit" size="icon" className="h-[60px] w-[60px]" disabled={isPending || !content.trim()}>
                                                        {isPending ? <Loader className="animate-spin" /> : <Send className="h-5 w-5" />}
                                                 </Button>
                                          </form>
                                   </div>
                            </CardContent>
                     </Card>
              </div>
       );
};

export default Discuss;
