"use client";

import { StepBack, StepForward, Play, Pause, RotateCcw, FastForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ControlsProps {
  stepForward: () => void;
  stepBackward: () => void;
  reset: () => void;
  togglePlay: () => void;
  isPlaying: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  speed: number;
  setSpeed: (speed: number) => void;
  currentStepIndex: number;
  totalSteps: number;
}

export function Controls({
  stepForward,
  stepBackward,
  reset,
  togglePlay,
  isPlaying,
  isFirstStep,
  isLastStep,
  speed,
  setSpeed,
  currentStepIndex,
  totalSteps
}: ControlsProps) {
  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex justify-between items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={reset} disabled={isFirstStep}>
                <RotateCcw className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Reset</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={stepBackward} disabled={isFirstStep}>
                <StepBack className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Step Backward</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" onClick={togglePlay} disabled={isLastStep}>
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>{isPlaying ? 'Pause' : 'Auto Play'}</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={stepForward} disabled={isLastStep}>
                <StepForward className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Step Forward</p></TooltipContent>
          </Tooltip>
          <div className="text-sm text-muted-foreground font-mono">
            {currentStepIndex + 1} / {totalSteps}
          </div>
        </div>
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label htmlFor="speed-slider">Auto-play Speed</Label>
                <FastForward className="h-4 w-4 text-muted-foreground" />
            </div>
          <Slider
            id="speed-slider"
            min={1}
            max={10}
            step={1}
            value={[speed]}
            onValueChange={(value) => setSpeed(value[0])}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
