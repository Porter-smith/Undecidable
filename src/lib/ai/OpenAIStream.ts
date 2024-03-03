// This is a custom version of OpenAIStream from the vercel ai package to handle the movies so we can just handle recommendation on the backend and don't need to handle getting movie information on frontend
import type { ChatCompletionChunk } from 'openai/resources/index.mjs';
import type { Stream } from 'openai/streaming.mjs';
import type { ToolCall } from '@/types/message';
// Define types for the callbacks to handle function and tool calls.
interface MovieRecommendation {
	title: string;
	year: string;
}
export interface OpenAIStreamCallbacks {
	onToolCall?: (toolCall: ToolCall) => Promise<any>;
	onFinal?: (accumulatedContent: string, recommendations: MovieRecommendation[]) => void;
}
function processMovieLine(line): MovieRecommendation | null {
	const match = line.match(/^(?:\d+\.\s\*\*|\s+)?(.*?)\s*\((\d{4})\):/);
	if (match) {
		let title = match[1].replace(/\*\*$/, '').trim();
		let year = match[2];

		// Return the object directly.
		return { title, year };
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
	let processableContent = '';
	let recommendations = [];
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
			processableContent += delta.content;
			accumulatedContent += delta.content;
			// Split accumulated content into lines to process each one.
			let lines = processableContent.split('\n');
			processableContent = lines.pop() || ''; // Preserve incomplete last line.

			for (let line of lines) {
				let movieJson = processMovieLine(line);
				if (movieJson) {
					recommendations.push(movieJson);
					yield JSON.stringify(movieJson);
					// TODO : Werid vercel bug I found where yielding json objects need to yield an empty string after it to fix it ???? I don't why lol

					yield ' ';
				}
			}
		}
	}
	if (callbacks.onToolCall && toolCalls && Object.keys(toolCalls).length > 0) {
		const toolCallsArray = Object.values(toolCalls); // This creates an actual array from your object
		const jsonArrayString = JSON.stringify(toolCallsArray); // Converts the array into a JSON string
		yield jsonArrayString;
		yield ' ';
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
		const finalMovieJson = processMovieLine(processableContent);
		if (finalMovieJson) {
			recommendations.push(finalMovieJson);
			yield JSON.stringify(finalMovieJson);
		}
		callbacks.onFinal(accumulatedContent, recommendations);
	}
}
