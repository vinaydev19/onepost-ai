import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateCommentMutation, useUpdateCommentMutation } from "@/redux/api/commentApiSlice";
import toast from "react-hot-toast";
import { useGetBlogBySlugQuery } from "@/redux/api/blogApiSlice";

export function CommentModal({ isOpen, onClose, postId, currentUser, editingComment }) {
    const [newComment, setNewComment] = useState("");
    const [createComment] = useCreateCommentMutation()
    const [updateComment] = useUpdateCommentMutation()

    useEffect(() => {
        if (editingComment) {
            setNewComment(editingComment?.content);
        } else {
            setNewComment("");
        }
    }, [editingComment, isOpen]);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        try {
            let res;
            if (editingComment) {
                res = await updateComment({
                    commentId: editingComment._id,
                    content: newComment,
                }).unwrap();
            } else {
                res = await createComment({ content: newComment, slug: postId }).unwrap();
            }
            toast.success(res.message);
            setNewComment("");
            onClose();
        } catch (error) {
            console.error("Error while submitting comment:", error);
            toast.error(error?.data?.message || "Something went wrong");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose} className="bg-[#020817]">
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col bg-[#020817] text-white">
                <DialogHeader>
                    <DialogTitle>{editingComment ? "Edit Comment" : "Add Comment"}</DialogTitle>
                </DialogHeader>
                {currentUser && (
                    <div className="border-t pt-4 mt-4 ">
                        <div className="flex gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={currentUser.profilePic} alt={currentUser.username} />
                                <AvatarFallback className="text-xs">
                                    {currentUser.username[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-3">
                                <Textarea
                                    placeholder="Write a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="min-h-[80px] resize-none"
                                />
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleSubmitComment}
                                        disabled={!newComment.trim()}
                                        size="sm"
                                        className="gap-2 bg-[#6c46e2] transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                                    >
                                        <Send className="h-4 w-4" />
                                        {editingComment ? "Update" : "Post"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
