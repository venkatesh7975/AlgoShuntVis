"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";
import { generateSteps, generatePrefixSteps, tokenize } from '@/lib/shunting-yard';
import type { StepState, VisualizerToken } from '@/lib/types';
import { teacherModeNarration } from '@/ai/flows/teacher-mode-narration';

export function useShuntingYard(defaultExpression = "(7+4)-2*(6-7)") {
  const { toast } = useToast();
  const [expression, setExpression] = useState(defaultExpression);
  const [tokens, setTokens] = useState<VisualizerToken[]>(() => tokenize(defaultExpression));
  const [steps, setSteps] = useState<StepState[]>(() => generateSteps(tokenize(defaultExpression)));
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5); // 1-10, maps to delay
  const [mode, setMode] = useState<'postfix' | 'prefix'>('postfix');

  const [teacherNarration, setTeacherNarration] = useState('');
  const [isNarrationLoading, setIsNarrationLoading] = useState(false);

  const currentStep = useMemo(() => steps[currentStepIndex], [steps, currentStepIndex]);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const startVisualization = useCallback((newExpression: string) => {
    try {
      const newTokens = tokenize(newExpression);
      setTokens(newTokens);
      const newSteps = mode === 'postfix' ? generateSteps(newTokens) : generatePrefixSteps(newTokens);
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setExpression(newExpression);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Invalid Expression",
        description: "Please check your expression for errors.",
      });
    }
  }, [mode, toast]);

  useEffect(() => {
    startVisualization(expression);
  }, [mode]);

  const stepForward = useCallback(() => {
    if (!isLastStep) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  }, [isLastStep]);

  const stepBackward = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [isFirstStep]);

  const reset = useCallback(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      if (isLastStep) {
        setIsPlaying(false);
        return;
      }
      const delay = 1500 - (speed - 1) * 150;
      const timer = setTimeout(() => {
        stepForward();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStepIndex, speed, isLastStep, stepForward]);

  const getAndSetTeacherNarration = useCallback(async () => {
    if (!currentStep) return;
    setIsNarrationLoading(true);
    setTeacherNarration('');
    
    try {
        const stackValues = currentStep.stackIds.map(id => tokens.find(t => t.id === id)?.value ?? '');
        const outputValues = currentStep.outputIds.map(id => tokens.find(t => t.id === id)?.value ?? '');
        const currentToken = tokens.find(t => t.id === steps[currentStepIndex + 1]?.movedTokenId)?.value ?? 'N/A';
        
        const res = await teacherModeNarration({
            stepDescription: currentStep.description,
            token: currentToken,
            stack: stackValues,
            outputQueue: outputValues,
            explanationSoFar: steps.slice(0, currentStepIndex + 1).map(s => s.description).join('; '),
        });
        setTeacherNarration(res.narration);
    } catch (error) {
        console.error("AI narration failed:", error);
        setTeacherNarration("Sorry, I couldn't generate an explanation right now.");
    } finally {
        setIsNarrationLoading(false);
    }
  }, [currentStep, steps, tokens, currentStepIndex]);

  return {
    expression,
    setExpression,
    startVisualization,
    tokens,
    currentStep,
    currentStepIndex,
    totalSteps: steps.length,
    stepForward,
    stepBackward,
    reset,
    isPlaying,
    togglePlay,
    isFirstStep,
    isLastStep,
    speed,
    setSpeed,
    mode,
    setMode,
    teacherNarration,
    isNarrationLoading,
    getAndSetTeacherNarration,
    setTeacherNarration,
  };
}
