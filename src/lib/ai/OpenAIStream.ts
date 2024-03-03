// TODO : Werid vercel bug I found where yielding json objects. It will chunk the json objects together in 1 chunk.
// Like this 1 chunk {}{}
// The frontend expects this to be a chunk {}
// **** You just need to yield an empty string after it to fix it ???? I don't why lol (javascript moment?)

// This is a custom version of OpenAIStream from the vercel ai package to handle the movies so we can just handle recommendation on the backend and don't need to handle getting movie information on frontend
import type { ChatCompletionChunk } from 'openai/resources/index.mjs';
import type { Stream } from 'openai/streaming.mjs';
import type { ToolCall } from '@/types/message';
// Define types for the callbacks to handle function and tool calls.
interface MovieRecommendation {
	title: string;
	year: string;
}
interface Movie {
	title: string;
	year: string;
	description: string;
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
async function getMovieData({ title, year }: MovieRecommendation): Promise<Movie> {
	return { title, year, description: 'test' };
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
	let fetchPromises = [];
	let availableResults = [];
	async function fetchMovieData(movieRecommendation) {
		try {
			// Generate a random delay between 1 and 5 seconds.
			let delay = Math.random() * 4000 + 1000;
			console.log(delay);

			await new Promise((resolve) => setTimeout(resolve, delay));

			const movieData = await getMovieData(movieRecommendation);
			const result = JSON.stringify(movieData);
			return result;
		} catch (error) {
			// Handle errors as needed.
			console.error('Error fetching movie data:', error);
		}
	}

	for await (const chunk of stream) {
		const delta = chunk.choices[0].delta;

		if (delta.content) {
			processableContent += delta.content;
			accumulatedContent += delta.content;

			// Use a global regular expression to find all matches.
			const regex = /(\d+)\.\s\*\*(.+)\*\*\s\((\d{4})\):/g;
			let match;
			while ((match = regex.exec(processableContent)) !== null) {
				let movieJson = {
					// rank: match[1],
					title: match[2],
					year: match[3]
				};
				recommendations.push(movieJson);
				yield JSON.stringify(movieJson);
				yield ' ';

				// Initiate data fetch without waiting for it to complete.
				let fetchPromise = fetchMovieData(movieJson)
					.then((result) => {
						// Instead of yielding here, store the result for later.
						availableResults.push(result);
					})
					.catch((error) => {
						// Handle or log error
						console.error('Error fetching movie data:', error);
					});

				// Store the promise so we can ensure all are completed later.
				fetchPromises.push(fetchPromise);

				// Remove the processed match from processableContent.
				processableContent = processableContent.replace(match[0], '');
			}

			// Check for any available results and yield them.
			while (availableResults.length > 0) {
				let result = availableResults.shift(); // Remove the result from the array.
				console.log(result);
				yield result; // Yield the available result.
				yield ' ';
			}
		}
	}

	// Wait for all fetch operations to complete before processing the final content.
	await Promise.all(fetchPromises);
	// Now, process all available results.
	for (let result of availableResults) {
		console.log(result);
		yield result;
		yield ' ';
	}

	if (accumulatedContent && callbacks.onFinal) {
		callbacks.onFinal(accumulatedContent, recommendations);
	}
}
