// TODO : Werid vercel bug I found where yielding json objects. It will chunk the json objects together in 1 chunk.
// Like this 1 chunk {}{}
// The frontend expects this to be a chunk {}
// **** You just need to yield an empty string after it to fix it ???? I don't why lol (javascript moment?)

// This is a custom version of OpenAIStream from the vercel ai package to handle the movies so we can just handle recommendation on the backend and don't need to handle getting movie information on frontend
import type { ChatCompletionChunk } from 'openai/resources/index.mjs';
import type { Stream } from 'openai/streaming.mjs';
import type { ToolCall } from '@/types/message';
import redis from '../redis';
import crypto from 'crypto';

// Define types for the callbacks to handle function and tool calls.
export interface MovieRecommendation {
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
async function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Generate a secure API key
function generateApiKey() {
	// Generate a random 32-byte buffer
	const randomBytes = crypto.randomBytes(32);
	// Convert the buffer to a hexadecimal string
	const apiKey = randomBytes.toString('hex');
	return `${apiKey}`;
}
// Transform the handleOpenAIStream function into an async generator
// This function will now yield StreamChunk objects
export async function* handleOpenAIStream(
	stream: Stream<ChatCompletionChunk>,
	callbacks: OpenAIStreamCallbacks
): AsyncGenerator<string, void, unknown> {
	// Generate and store an API key in Redis
	const apiKey = await generateApiKey();
	try {
		await redis.set(apiKey, '5', 'EX', 60); // Initialize the usage counter to 5.
	} catch (e) {
		console.log(e);
	}
	// Yield the API key to the client.
	yield JSON.stringify({ apiKey: apiKey });
	yield ' ';
	let accumulatedContent = '';
	let processableContent = '';
	let recommendations = [];

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
				await delay(100); // Timing issue
				yield JSON.stringify(movieJson);
				yield ' ';
				// Remove the processed match from processableContent.
				processableContent = processableContent.replace(match[0], '');
			}
		}
	}

	if (accumulatedContent && callbacks.onFinal) {
		// Save it to firebase
		callbacks.onFinal(accumulatedContent, recommendations);
	}
}
