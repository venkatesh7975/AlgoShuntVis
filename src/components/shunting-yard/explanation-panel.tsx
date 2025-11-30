"use client";

import { Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TeacherModeDialog } from './teacher-mode-dialog';
import type { StepState } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';

interface ExplanationPanelProps {
  currentStep?: StepState;
  getAndSetTeacherNarration: () => void;
  teacherNarration: string;
  isNarrationLoading: boolean;
  setTeacherNarration: (narration: string) => void;
}

export function ExplanationPanel({ currentStep, getAndSetTeacherNarration, teacherNarration, isNarrationLoading, setTeacherNarration }: ExplanationPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Explanation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-24 p-4 rounded-lg bg-muted/50 text-sm overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep?.step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep?.description || "Start the visualization to see explanations."}
            </motion.p>
          </AnimatePresence>
        </div>
        
        <TeacherModeDialog 
          teacherNarration={teacherNarration}
          isNarrationLoading={isNarrationLoading}
          setTeacherNarration={setTeacherNarration}
        >
          <Button className="w-full" onClick={getAndSetTeacherNarration}>
            {isNarrationLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Lightbulb className="mr-2 h-4 w-4" />
            )}
            Explain Like a Teacher
          </Button>
        </TeacherModeDialog>
      </CardContent>
    </Card>
  );
}
