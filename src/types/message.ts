interface FunctionCall {
	name: string;
	arguments: string[];
}

export interface ToolCall {
	function: FunctionCall;
	id: string;
	type: string;
}

export interface Message {
	role: 'system' | 'user' | 'assistant' | 'tool';
	content: string | null;
	name?: string;
	tool_calls?: ToolCall[];
	tool_call_id?: string;
}
