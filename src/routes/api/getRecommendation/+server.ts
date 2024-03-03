import { OPENAI_API_KEY } from '$env/static/private';
import { handleOpenAIStream, type OpenAIStreamCallbacks } from '@/lib/ai/OpenAIStream';
import { StreamingTextResponse } from 'ai';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import OpenAI from 'openai';
import type { CinemaSearchCriteria } from '../../../types/recommendation';
function buildSearchCriteriaPrompt({
	cinemaType,
	selectedCategories,
	specificDescriptors
}: CinemaSearchCriteria) {
	let criteria = `Give me a list of 5 ${cinemaType} recommendations`;
	if (selectedCategories.length) {
		criteria += ` that fit all of the following categories: ${selectedCategories.join(', ')}`;
	}
	if (specificDescriptors) {
		criteria += `. Make sure it fits the following description as well: ${specificDescriptors}.`;
	}
	criteria += ` Please return this response as a numbered list with the ${cinemaType}'s title in bold ** markdown format then provide the year (), followed by a colon. There should be a line of whitespace between each item in the list.`;
	return criteria;
}
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
async function OpenAIAPI({ systemPrompt }: { systemPrompt: string }) {
	const systemMessage: ChatCompletionMessageParam = {
		role: 'system',
		content: systemPrompt
	};

	// Prepend the system message to the user messages
	const allMessages: ChatCompletionMessageParam[] = [systemMessage];

	// Request the OpenAI API for the response based on the modified messages array
	const response = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		stream: true,
		messages: allMessages
	});

	return response;
}

export async function POST({ request }: { request: any }) {
	const { cinemaType, selectedCategories, specificDescriptors } = await request.json();
	const criteriaPrompt = buildSearchCriteriaPrompt({
		cinemaType,
		selectedCategories,
		specificDescriptors
	});
	const callbacks: OpenAIStreamCallbacks = {
		onFinal: (accumulatedContent, recommendations) => {
			console.log(recommendations);
		}
	};
	// Initiating the stream handling
	const response = await OpenAIAPI({ systemPrompt: criteriaPrompt });

	const stream = handleOpenAIStream(response, callbacks);
	return new StreamingTextResponse(stream);
}
