export type Operator = '+' | '-' | '*' | '/' | '^';
export type Parenthesis = '(' | ')';
export type TokenType = 'operand' | 'operator' | 'left_paren' | 'right_paren';

export type VisualizerToken = {
    value: string;
    type: TokenType;
    id: string; // for animation layoutId
}

export type StepState = {
    step: number;
    description: string;
    // Keep track of which tokens are in which container
    streamIds: string[];
    stackIds: string[];
    outputIds: string[];

    // For highlighting tokens during animation
    movedTokenId?: string;
    from?: 'stream' | 'stack';
    to?: 'stack' | 'output';
    poppedTokens?: VisualizerToken[]; // For multi-pop scenarios
    isDone?: boolean;
}
