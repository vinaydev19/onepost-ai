import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ConfirmDialog({ open, onClose, onConfirm, title, description }) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-[#020817] text-white">
                <DialogHeader>
                    <DialogTitle>{title || "Are you sure?"}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {description || "This action cannot be undone."}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2 justify-end">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="bg-gray-800 text-white hover:bg-gray-700"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
