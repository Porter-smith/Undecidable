import type { ChatCompletionChunk } from 'openai/resources/index.mjs';
import type { Stream } from 'openai/streaming.mjs';

// Define types for the callbacks to handle function and tool calls.
export interface ShowRecommendation {
	title: string;
	year: string;
}

export interface OpenAIStreamCallbacks {
	onFinal?: (accumulatedContent: string, recommendations: ShowRecommendation[]) => void;
}
async function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Transform the handleOpenAIStream function into an async generator
// This function will now yield StreamChunk objects
export function handleOpenAIStream(
	stream: Stream<ChatCompletionChunk>,
	callbacks: OpenAIStreamCallbacks
): ReadableStream<string> {
	return new ReadableStream<string>({
		async start(controller) {
			let accumulatedContent = '';
			let processableContent = '';
			const recommendations: ShowRecommendation[] = [];

			for await (const chunk of stream) {
				const delta = chunk.choices[0].delta;

				if (delta.content) {
					processableContent += delta.content;
					accumulatedContent += delta.content;

					// Use a global regular expression to find all matches.
					const regex = /(\d+)\.\s\*\*(.+)\*\*\s\((\d{4})\):/g;
					let match;
					while ((match = regex.exec(processableContent)) !== null) {
						const movieJson = {
							title: match[2],
							year: match[3]
						};
						recommendations.push(movieJson);

						// Timing to ensure proper async handling, not truly needed unless specific logic requires it.
						// TODO: Test if we need this but was having issues sometimes so gonna leave it for now
						await delay(10);

						controller.enqueue(JSON.stringify(movieJson));
						// TODO : Werid vercel bug I found where yielding json objects. It will chunk the json objects together in 1 chunk. If you yield a space after one it fixes it
						// controller.enqueue(' ');

						// Remove the processed match from processableContent.
						processableContent = processableContent.replace(match[0], '');
					}
				}
			}

			if (accumulatedContent && callbacks.onFinal) {
				callbacks.onFinal(accumulatedContent, recommendations);
			}

			controller.close();
		}
	});
}
