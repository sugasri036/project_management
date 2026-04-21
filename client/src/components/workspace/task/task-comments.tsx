import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCommentMutationFn, deleteCommentMutationFn, getTaskCommentsQueryFn } from "@/lib/api";
import { useAuthContext } from "@/context/auth-provider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader, Send } from "lucide-react";
import { CommentItem } from "./comment-item";
import { toast } from "@/hooks/use-toast";

interface TaskCommentsProps {
       taskId: string;
}

export function TaskComments({ taskId }: TaskCommentsProps) {
       const { user } = useAuthContext();
       const queryClient = useQueryClient();
       const [content, setContent] = useState("");

       const { data, isLoading } = useQuery({
              queryKey: ["task-comments", taskId],
              queryFn: () => getTaskCommentsQueryFn(taskId),
       });

       const { mutate: createComment, isPending: isCreating } = useMutation({
              mutationFn: createCommentMutationFn,
              onSuccess: () => {
                     setContent("");
                     queryClient.invalidateQueries({ queryKey: ["task-comments", taskId] });
              },
              onError: (error) => {
                     toast({
                            title: "Error",
                            description: error.message,
                            variant: "destructive",
                     });
              }
       });

       const { mutate: deleteComment } = useMutation({
              mutationFn: deleteCommentMutationFn,
              onSuccess: () => {
                     queryClient.invalidateQueries({ queryKey: ["task-comments", taskId] });
                     toast({
                            title: "Success",
                            description: "Comment deleted",
                     });
              },
              onError: (error) => {
                     toast({
                            title: "Error",
                            description: error.message,
                            variant: "destructive",
                     });
              }
       });

       const handleSubmit = (e: React.FormEvent) => {
              e.preventDefault();
              if (!content.trim()) return;
              createComment({ taskId, content });
       };

       const comments: any[] = data?.comments || [];

       return (
              <div className="flex flex-col h-full gap-4">
                     <h3 className="font-semibold text-lg">Comments</h3>

                     <ScrollArea className="flex-1 pr-4 -mr-4 h-[300px]">
                            {isLoading ? (
                                   <div className="flex justify-center py-4">
                                          <Loader className="w-6 h-6 animate-spin text-primary" />
                                   </div>
                            ) : comments.length > 0 ? (
                                   <div className="flex flex-col gap-4">
                                          {comments.map((comment) => (
                                                 <CommentItem
                                                        key={comment._id}
                                                        comment={comment}
                                                        currentUserId={user?._id}
                                                        onDelete={deleteComment}
                                                 />
                                          ))}
                                   </div>
                            ) : (
                                   <div className="text-center text-muted-foreground py-8">
                                          No comments yet. Start the conversation!
                                   </div>
                            )}
                     </ScrollArea>

                     <form onSubmit={handleSubmit} className="flex gap-2 items-end">
                            <Textarea
                                   placeholder="Write a comment..."
                                   value={content}
                                   onChange={(e: { target: { value: import("react").SetStateAction<string>; }; }) => setContent(e.target.value)}
                                   className="min-h-[80px] resize-none"
                            />
                            <Button type="submit" disabled={isCreating || !content.trim()} size="icon">
                                   {isCreating ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </Button>
                     </form>
              </div>
       );
}
