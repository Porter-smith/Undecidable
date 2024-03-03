// This is a custom version of OpenAIStream from the vercel ai package to handle the movies so we can just handle recommendation on the backend and don't need to handle getting movie information on frontend
import type { ChatCompletionChunk } from 'openai/resources/index.mjs';
import type { Stream } from 'openai/streaming.mjs';
import type { ToolCall } from '../../types/message';
// Define types for the callbacks to handle function and tool calls.
export interface OpenAIStreamCallbacks {
	onToolCall?: (toolCall: ToolCall) => Promise<any>;
	onFinal?: (accumulatedContent: string) => void;
}
function processMovieLine(line) {
	const match = line.match(/^(?:\d+\.\s\*\*|\s+)?(.*?)\s*\((\d{4})\):/);
	if (match) {
		let title = match[1].replace(/\*\*$/, '').trim();
		let year = match[2];
		return JSON.stringify({ title, year });
	}
	return null;
}
// Transform the handleOpenAIStream function into an async generator
// This function will now yield StreamChunk objects
export async function* handleOpenAIStream(
	stream: Stream<ChatCompletionChunk>,
	callbacks: OpenAIStreamCallbacks
): AsyncGenerator<string, void, unknown> {
	let accumulatedContent = '';
	const toolCalls: { [index: number]: ToolCall } = {};

	for await (const chunk of stream) {
		const delta = chunk.choices[0].delta;

		if (delta.tool_calls) {
			for (const tool_call of delta.tool_calls) {
				let accToolCall = toolCalls[tool_call.index];
				if (!accToolCall) {
					accToolCall = {
						id: tool_call.id,
						type: 'function',
						function: { name: tool_call.function.name, arguments: '' }
					};
					toolCalls[tool_call.index] = accToolCall;
				}

				if (tool_call.id) accToolCall.id = tool_call.id;
				if (tool_call.function.name) accToolCall.function.name = tool_call.function.name;
				if (tool_call.function.arguments)
					accToolCall.function.arguments += tool_call.function.arguments;
			}
		}

		if (delta.content) {
			accumulatedContent += delta.content;
			// Split accumulated content into lines to process each one.
			let lines = accumulatedContent.split('\n');
			console.log(lines);
			accumulatedContent = lines.pop() || ''; // Preserve incomplete last line.

			for (let line of lines) {
				let movieJson = processMovieLine(line);
				if (movieJson) {
					yield movieJson;
				}
			}

			if (callbacks.onToolCall && toolCalls && Object.keys(toolCalls).length > 0) {
				// Convert the object to an array of its values only if toolCalls is not emptyl thinking about improving this but it works for now
				// Wrapping the object in an array and converting to a JSON string
				const toolCallsArray = Object.values(toolCalls); // This creates an actual array from your object
				const jsonArrayString = JSON.stringify(toolCallsArray); // Converts the array into a JSON string
				// const chunkSize = 1024;
				// TODO : Werid vercel bug I found where yield json objects? need to yield an empty string to fix it ???? I don't why lol
				yield jsonArrayString;
				yield ' ';

				// for await (const chunk of yieldChunks(jsonArrayString, chunkSize)) {
				// 	yield chunk; // Yielding chunks sequentially
				// }
				// const jsonArrayString = `[${JSON.stringify(toolCalls)}]`;
				// yield JSON.stringify(jsonArrayString); // Yield the array as a JSON string
				for (const index in toolCalls) {
					const toolCallResult = await callbacks.onToolCall(toolCalls[index]);
					// Yield the result of the tool call if available
					if (toolCallResult) {
						console.log(toolCallResult);
						yield toolCallResult;
					}
				}
			}

			if (accumulatedContent && callbacks.onFinal) {
				callbacks.onFinal(accumulatedContent);
				// Process any remaining content after splitting.
				const finalMovieJson = processMovieLine(accumulatedContent);
				if (finalMovieJson) {
					yield finalMovieJson;
				}
			}
		}
	}
}
