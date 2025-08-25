import { useState } from "react";
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

export function CommentModal({ isOpen, onClose, postId, currentUser }) {
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const handleSubmitComment = async () => {
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose} className="bg-[#020817]">
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col bg-[#020817] text-white">
                <DialogHeader>
                    <DialogTitle>Comments</DialogTitle>
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
                                        disabled={!newComment.trim() || isSubmitting}
                                        size="sm"
                                        className="gap-2 bg-[#6c46e2] transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
                                    >
                                        <Send className="h-4 w-4" />
                                        {isSubmitting ? "Posting..." : "Post Comment"}
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
