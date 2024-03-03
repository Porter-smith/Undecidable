// TODO : Werid vercel bug I found where yielding json objects. It will chunk the json objects together in 1 chunk.
// Like this 1 chunk {}{}
// The frontend expects this to be a chunk {}
// **** You just need to yield an empty string after it to fix it ???? I don't why lol (classic javascript)

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
	await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate 3 seconds delay
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
			// Split accumulated content into lines to process each one.
			let lines = processableContent.split('\n');
			processableContent = lines.pop() || ''; // Preserve incomplete last line.

			for (let line of lines) {
				let movieJson = processMovieLine(line);
				if (movieJson) {
					recommendations.push(movieJson);
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

					yield JSON.stringify(movieJson);
					yield ' ';
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
		const finalMovieJson = processMovieLine(processableContent);
		if (finalMovieJson) {
			recommendations.push(finalMovieJson);
			yield JSON.stringify(finalMovieJson);
		}
		callbacks.onFinal(accumulatedContent, recommendations);
	}
}
