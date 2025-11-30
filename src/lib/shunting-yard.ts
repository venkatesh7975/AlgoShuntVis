import { uniqueId } from './utils';
import type { StepState, VisualizerToken, TokenType, Operator } from './types';

const OPERATORS: { [key: string]: { precedence: number, associativity: 'Left' | 'Right' } } = {
  '^': { precedence: 4, associativity: 'Right' },
  '*': { precedence: 3, associativity: 'Left' },
  '/': { precedence: 3, associativity: 'Left' },
  '+': { precedence: 2, associativity: 'Left' },
  '-': { precedence: 2, associativity: 'Left' },
};

function getTokenType(token: string): TokenType {
  if (!isNaN(parseFloat(token))) return 'operand';
  if (token in OPERATORS) return 'operator';
  if (token === '(') return 'left_paren';
  if (token === ')') return 'right_paren';
  throw new Error(`Unknown token type for: ${token}`);
}

export function tokenize(expression: string): VisualizerToken[] {
  const sanitized = expression.replace(/\s+/g, '');
  const regex = /(\d+\.?\d*)|([+\-*/^()])/g;
  let match;
  const tokens: string[] = [];
  while ((match = regex.exec(sanitized)) !== null) {
    tokens.push(match[0]);
  }

  return tokens.map(value => ({
    value,
    type: getTokenType(value),
    id: uniqueId('token-'),
  }));
}

function hasHigherPrecedence(op1: Operator, op2: Operator): boolean {
  const op1Info = OPERATORS[op1];
  const op2Info = OPERATORS[op2];
  return op1Info.associativity === 'Left'
    ? op1Info.precedence >= op2Info.precedence
    : op1Info.precedence > op2Info.precedence;
}

export function generateSteps(tokens: VisualizerToken[], forPrefix: boolean = false): StepState[] {
  const steps: StepState[] = [];
  let stack: VisualizerToken[] = [];
  let output: VisualizerToken[] = [];
  
  const initialDescription = forPrefix 
    ? "Start of algorithm (for prefix). Expression is reversed."
    : "Start of algorithm. Tokens are ready to be processed.";

  steps.push({
    step: 0,
    description: initialDescription,
    streamIds: tokens.map(t => t.id),
    stackIds: [],
    outputIds: [],
  });

  function addStep(description: string, movedToken?: VisualizerToken, from?: 'stream' | 'stack', to?: 'stack' | 'output', poppedTokens?: VisualizerToken[]) {
    steps.push({
      step: steps.length,
      description,
      streamIds: tokens.slice(steps.length).map(t => t.id),
      stackIds: [...stack].map(t => t.id),
      outputIds: [...output].map(t => t.id),
      movedTokenId: movedToken?.id,
      from,
      to,
      poppedTokens,
    });
  }

  tokens.forEach(token => {
    switch (token.type) {
      case 'operand':
        output.push(token);
        addStep(`Token '${token.value}' is an operand. Move to output.`, token, 'stream', 'output');
        break;

      case 'operator': {
        let popped: VisualizerToken[] = [];
        while (
          stack.length > 0 &&
          stack[stack.length - 1].type === 'operator' &&
          hasHigherPrecedence(stack[stack.length - 1].value as Operator, token.value as Operator)
        ) {
          const op = stack.pop()!;
          output.push(op);
          popped.push(op);
        }
        if (popped.length > 0) {
            addStep(`Popped operator(s) with higher/equal precedence from stack to output.`, popped[popped.length-1], 'stack', 'output', popped);
        }
        stack.push(token);
        addStep(`Token '${token.value}' is an operator. Push to stack.`, token, 'stream', 'stack');
        break;
      }
      
      case 'left_paren':
        stack.push(token);
        addStep(`Token '(' is a left parenthesis. Push to stack.`, token, 'stream', 'stack');
        break;

      case 'right_paren': {
        let popped: VisualizerToken[] = [];
        let foundLeftParen = false;
        while (stack.length > 0 && stack[stack.length - 1].type !== 'left_paren') {
          const op = stack.pop()!;
          output.push(op);
          popped.push(op);
        }

        if (popped.length > 0) {
          addStep(`Token ')' found. Pop operators from stack to output until '(' is found.`, popped[popped.length-1], 'stack', 'output', popped);
        }
        
        if (stack.length > 0 && stack[stack.length - 1].type === 'left_paren') {
            const leftParen = stack.pop()!;
            addStep(`Found '('. Discard both parentheses.`, leftParen); // Not animating discard for simplicity
        } else {
             // Mismatched parentheses error state
            addStep("Error: Mismatched parentheses. ')' found without a matching '('.");
        }
        break;
      }
    }
  });

  let finalPopped: VisualizerToken[] = [];
  while (stack.length > 0) {
    const op = stack.pop()!;
    if (op.type === 'left_paren' || op.type === 'right_paren') {
        addStep("Error: Mismatched parentheses in expression.");
        break;
    }
    output.push(op);
    finalPopped.push(op);
  }
  if(finalPopped.length > 0) {
      addStep(`End of stream. Pop remaining operators from stack to output.`, finalPopped[finalPopped.length-1], 'stack', 'output', finalPopped);
  }


  const finalExpression = forPrefix ? [...output].reverse() : output;
  steps.push({
    ...steps[steps.length-1],
    step: steps.length,
    description: `Algorithm finished. Final ${forPrefix ? "prefix" : "postfix"} expression: ${finalExpression.map(t => t.value).join(' ')}`,
    isDone: true,
  });

  return steps;
}


export function generatePrefixSteps(tokens: VisualizerToken[]): StepState[] {
    const reversedTokens = [...tokens].reverse().map(token => {
        if (token.type === 'left_paren') return {...token, value: ')', type: 'right_paren' as TokenType};
        if (token.type === 'right_paren') return {...token, value: '(', type: 'left_paren' as TokenType};
        return token;
    });

    return generateSteps(reversedTokens, true);
}
