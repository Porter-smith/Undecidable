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
					controller.enqueue(delta.content);
					while ((match = regex.exec(processableContent)) !== null) {
						const movieJson = {
							title: match[2],
							year: match[3]
						};
						recommendations.push(movieJson);
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
