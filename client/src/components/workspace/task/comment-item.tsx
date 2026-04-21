import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CommentItemProps {
       comment: {
              _id: string;
              content: string;
              userId: {
                     _id: string;
                     name: string;
                     profilePicture?: string;
              };
              createdAt: string;
       };
       currentUserId?: string;
       onDelete: (commentId: string) => void;
}

export function CommentItem({ comment, currentUserId, onDelete }: CommentItemProps) {
       const isOwner = currentUserId === comment.userId._id;
       const initials = getAvatarFallbackText(comment.userId.name);
       const avatarColor = getAvatarColor(comment.userId.name);

       return (
              <div className="flex gap-3 group">
                     <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.userId.profilePicture} alt={comment.userId.name} />
                            <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
                     </Avatar>
                     <div className="flex flex-col w-full gap-1">
                            <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-2">
                                          <span className="text-sm font-semibold">{comment.userId.name}</span>
                                          <span className="text-xs text-muted-foreground">
                                                 {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                          </span>
                                   </div>
                                   {isOwner && (
                                          <Button
                                                 variant="ghost"
                                                 size="icon"
                                                 className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                                                 onClick={() => onDelete(comment._id)}
                                          >
                                                 <Trash2 className="h-3 w-3" />
                                          </Button>
                                   )}
                            </div>
                            <div className="text-sm text-foreground/90 bg-muted/40 p-2 rounded-md">
                                   {comment.content}
                            </div>
                     </div>
              </div>
       );
}
