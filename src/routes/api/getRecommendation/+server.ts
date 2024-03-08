import { OPENAI_API_KEY } from '$env/static/private';
import { handleOpenAIStream, type OpenAIStreamCallbacks } from '@/lib/ai/OpenAIStream';
import { StreamingTextResponse } from 'ai';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import OpenAI from 'openai';
import type { CinemaSearchCriteria } from '@/types/recommendation';
import type { RequestHandler } from './$types';
import getUserData from '@/lib/server/firebase/users/getUserData';
import { FREE_REQUEST_COUNT, USER_REQUEST_COUNT } from '@/constants';
import { createMediaAccessLimiterCookie, updateRequestCountRedis } from '@/lib/server/redisUtils';
import { updateRequestCountCookie } from '@/lib/server/cookieUtils';
import type { User } from '@/types/user';
import type { Cookies } from '@sveltejs/kit';
import createRecommendation from '../../../lib/server/firebase/recommendations/createRecommendation';
async function rateLimiter({ user, cookies }: { user: User | null; cookies: Cookies }) {
	if (user) {
		// For authenticated users, manage request counts using Redis
		const hasRemainingRequests = await updateRequestCountRedis(user.uid);
		if (!hasRemainingRequests) {
			throw new Error(`You have reached your ${USER_REQUEST_COUNT} daily search limit!`);
		}
	} else {
		// For non-authenticated users, use cookie-based tracking
		const hasRemainingFreeRequests = updateRequestCountCookie(cookies);
		if (!hasRemainingFreeRequests) {
			throw new Error(`You have reached your ${FREE_REQUEST_COUNT} daily searches!`);
		}
	}
}
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

export const POST: RequestHandler = async ({ request, cookies }) => {
	const sessionCookie = cookies.get('__session') ?? null;
	const user = await getUserData(sessionCookie);

	try {
		// Apply the rate limiter
		await rateLimiter({ user, cookies });

		// If the rate limiter does not throw an error, proceed with the request handling
		const { cinemaType, selectedCategories, specificDescriptors } = await request.json();
		const criteriaPrompt = buildSearchCriteriaPrompt({
			cinemaType,
			selectedCategories,
			specificDescriptors
		});

		// Create API Key in cookies for getMediaDetails endpoint, manage streaming response, etc.
		await createMediaAccessLimiterCookie(cookies);
		const response = await OpenAIAPI({ systemPrompt: criteriaPrompt });
		const callbacks: OpenAIStreamCallbacks = {
			onFinal: async (accumulatedContent, recommendations) => {
				const userUID = user?.uid || 'Anonomous User';
				await createRecommendation(userUID, recommendations, criteriaPrompt, specificDescriptors);
				console.log(recommendations);
			}
		};
		const stream = handleOpenAIStream(response, callbacks);
		return new StreamingTextResponse(stream);
	} catch (error) {
		// Handle errors if they are thrown
		return new Response(
			JSON.stringify({
				error: error instanceof Error ? error.message : 'An unexpected error occurred'
			}),
			{ status: 429, headers: { 'Content-Type': 'application/json' } }
		);
	}
};
