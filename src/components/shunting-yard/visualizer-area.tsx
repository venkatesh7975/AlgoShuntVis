"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { VisualizerToken } from './visualizer-token';
import type { StepState, VisualizerToken as TVisualizerToken } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

interface VisualizerAreaProps {
  tokens: TVisualizerToken[];
  currentStep: StepState;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

function VisualizerLane({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex-1 p-4 rounded-lg bg-muted/50 min-h-[8rem]", className)}>
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 tracking-wider uppercase">{title}</h3>
      <div className="flex flex-wrap gap-2 items-center min-h-[3rem]">
        {children}
      </div>
    </div>
  )
}

export function VisualizerArea({ tokens, currentStep }: VisualizerAreaProps) {
  if (!currentStep) {
    return (
      <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
        <p>Loading visualization...</p>
      </div>
    );
  }

  const streamTokens = tokens.filter(t => currentStep.streamIds.includes(t.id));
  const stackTokens = currentStep.stackIds.map(id => tokens.find(t => t.id === id)!);
  const outputTokens = currentStep.outputIds.map(id => tokens.find(t => t.id === id)!);

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardContent className="p-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4 tracking-wider uppercase">Token Stream</h3>
        <ScrollArea className="w-full whitespace-nowrap">
            <motion.div 
              className="flex gap-2 items-center min-h-[3rem]"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {streamTokens.map((token) => (
                    <VisualizerToken key={token.id} token={token} layoutId={token.id} currentStep={currentStep} />
                ))}
              </AnimatePresence>
            </motion.div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <VisualizerLane title="Operator Stack">
          <AnimatePresence>
            {stackTokens.map((token) => (
              <VisualizerToken key={token.id} token={token} layoutId={token.id} currentStep={currentStep} />
            ))}
          </AnimatePresence>
        </VisualizerLane>
        <VisualizerLane title="Output Queue">
          <AnimatePresence>
            {outputTokens.map((token) => (
              <VisualizerToken key={token.id} token={token} layoutId={token.id} currentStep={currentStep} />
            ))}
          </AnimatePresence>
        </VisualizerLane>
      </div>
    </div>
  );
}
