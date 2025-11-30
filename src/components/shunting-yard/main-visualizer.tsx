"use client";

import { useState } from 'react';
import { LayoutGroup } from 'framer-motion';
import { useShuntingYard } from '@/hooks/use-shunting-yard';
import { VisualizerArea } from './visualizer-area';
import { Controls } from './controls';
import { ExplanationPanel } from './explanation-panel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export function MainVisualizer() {
  const hook = useShuntingYard();
  const [inputValue, setInputValue] = useState(hook.expression);

  const handleStart = () => {
    hook.startVisualization(inputValue);
  };

  const finalResult = useMemo(() => {
    if (!hook.currentStep || !hook.currentStep.isDone) return null;
    let resultTokens = hook.currentStep.outputIds.map(id => hook.tokens.find(t => t.id === id)!);
    if (hook.mode === 'prefix') {
      resultTokens.reverse();
    }
    return resultTokens.map(t => t.value).join(' ');
  }, [hook.currentStep, hook.tokens, hook.mode]);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <LayoutGroup>
          <VisualizerArea tokens={hook.tokens} currentStep={hook.currentStep} />
        </LayoutGroup>
        {hook.currentStep?.isDone && finalResult && (
          <Card>
            <CardHeader>
              <CardTitle>Final Result ({hook.mode === 'prefix' ? 'Prefix' : 'Postfix'})</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-code text-lg bg-muted p-4 rounded-md">{finalResult}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expression-input">Infix Expression</Label>
              <div className="flex gap-2">
                <Input
                  id="expression-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                  className="font-code"
                />
                <Button onClick={handleStart}>Visualize</Button>
              </div>
            </div>
            <Separator />
            <Controls {...hook} />
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="mode-switch">
                Mode: <span className="font-semibold capitalize">{hook.mode}</span>
              </Label>
              <Switch
                id="mode-switch"
                checked={hook.mode === 'prefix'}
                onCheckedChange={(checked) => hook.setMode(checked ? 'prefix' : 'postfix')}
              />
            </div>
          </CardContent>
        </Card>

        <ExplanationPanel {...hook} />
      </div>
    </div>
  );
}
