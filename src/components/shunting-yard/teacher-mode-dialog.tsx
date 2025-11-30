"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface TeacherModeDialogProps {
    children: React.ReactNode;
    teacherNarration: string;
    isNarrationLoading: boolean;
    setTeacherNarration: (narration: string) => void;
}

export function TeacherModeDialog({ children, teacherNarration, isNarrationLoading, setTeacherNarration }: TeacherModeDialogProps) {
    const isOpen = !!teacherNarration || isNarrationLoading;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && setTeacherNarration('')}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Teacher Mode</DialogTitle>
                <DialogDescription>
                    Here's a simple, teacher-like explanation of the current step.
                </DialogDescription>
                </DialogHeader>
                <div className="py-4 min-h-[100px] flex items-center justify-center">
                    {isNarrationLoading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    ) : (
                        <p className="text-base leading-relaxed">{teacherNarration}</p>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={() => setTeacherNarration('')}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
