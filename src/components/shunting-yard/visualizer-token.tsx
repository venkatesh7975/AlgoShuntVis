"use client";

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { VisualizerToken as TVisualizerToken, StepState } from '@/lib/types';

interface VisualizerTokenProps {
  token: TVisualizerToken;
  layoutId: string;
  currentStep: StepState;
}

const tokenColors = {
  operand: 'bg-token-operand/20 text-token-operand-foreground border-token-operand/50',
  operator: 'bg-token-operator/20 text-token-operator-foreground border-token-operator/50',
  left_paren: 'bg-token-paren/20 text-token-paren-foreground border-token-paren/50',
  right_paren: 'bg-token-paren/20 text-token-paren-foreground border-token-paren/50',
};

const glowColors = {
  operand: 'shadow-[0_0_15px_hsl(var(--token-operand))]',
  operator: 'shadow-[0_0_15px_hsl(var(--token-operator))]',
  paren: 'shadow-[0_0_15px_hsl(var(--token-paren))]',
  popped: 'shadow-[0_0_15px_hsl(var(--token-popped))]',
};

const variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

export function VisualizerToken({ token, layoutId, currentStep }: VisualizerTokenProps) {
  const isMoved = currentStep.movedTokenId === token.id;
  const isPopped = currentStep.poppedTokens?.some(p => p.id === token.id);
  
  let glowClass = '';
  if (isMoved) {
      if (currentStep.to === 'output') {
          glowClass = token.type === 'operand' ? glowColors.operand : glowColors.popped;
      } else if (currentStep.to === 'stack') {
          glowClass = token.type === 'operator' ? glowColors.operator : glowColors.paren;
      }
  }
  if (isPopped) {
      glowClass = glowColors.popped;
  }

  return (
    <motion.div
      layoutId={layoutId}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        "h-12 w-12 flex items-center justify-center rounded-md font-code font-medium text-lg border-2",
        tokenColors[token.type],
        glowClass,
        'transition-shadow duration-300'
      )}
    >
      {token.value}
    </motion.div>
  );
}
