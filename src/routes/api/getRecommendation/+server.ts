import { OPENAI_API_KEY } from '$env/static/private';
import { handleOpenAIStream, type OpenAIStreamCallbacks } from '@/lib/ai/OpenAIStream';
import { StreamingTextResponse } from 'ai';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import OpenAI from 'openai';
import type { CinemaSearchCriteria } from '@/types/recommendation';
import type { RequestHandler } from './$types';
import getUserData from '@/lib/server/firebase/users/getUserData';
import { FREE_REQUEST_COUNT, USER_REQUEST_COUNT } from '@/constants';
import redis from '@/lib/redis';
import createRecommendation from '@/lib/server/firebase/movies/createRecommendation.js';
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

function updateRequestCountCookie(cookies) {
	// Retrieve the current request count or initialize it to 3 if not present
	let requestCount = cookies.get('request_count');
	console.log(requestCount);
	requestCount = requestCount ? parseInt(requestCount) : FREE_REQUEST_COUNT; // Start with 3 requests for new users

	// Check if the user has already utilized their requests
	if (requestCount <= 0) {
		// No more requests allowed; prompt the user to create an account
		return false;
	}

	// Decrement the request count for each request
	requestCount--;

	// Define cookie options
	const options = {
		// Set the cookie to expire in 24 hours
		maxAge: 60 * 60 * 24,
		// Secure flag should be true in production for HTTPS
		secure: process.env.NODE_ENV === 'production',
		// HttpOnly flag to prevent access from client-side scripts
		httpOnly: true,
		// SameSite policy for CSRF protection
		sameSite: 'strict',
		// Cookie accessible across the entire site
		path: '/'
	};

	// Update the request count cookie
	cookies.set('request_count', requestCount.toString(), options);

	// Requests are still available
	return true;
}
async function updateRequestCountRedis(userUid) {
	// Use the standardized key with a prefix and the user's UID
	const key = `USER_REQUEST_COUNT:${userUid}`;

	// Retrieve the current request count or initialize it if not present
	let requestCount = await redis.get(key);
	requestCount = requestCount ? parseInt(requestCount) : USER_REQUEST_COUNT;

	// Check if there are no remaining requests
	if (requestCount <= 0) {
		// No additional requests are allowed
		return false;
	}

	// Decrement the request count and update it in Redis
	requestCount--;
	await redis.set(key, requestCount, 'EX', 60 * 60 * 24); // Update with a 24-hour expiration

	return true;
}
export const POST: RequestHandler = async ({ request, cookies }) => {
	const sessionCookie = cookies.get('__session') ?? null;
	// Get user data based on the session cookie.

	const user = await getUserData(sessionCookie);
	if (user) {
		// For authenticated users, manage request counts using Redis
		const hasRemainingRequests = await updateRequestCountRedis(user.uid);
		if (!hasRemainingRequests) {
			return new Response(
				JSON.stringify({
					error: `You have reached your ${USER_REQUEST_COUNT} daily search limit! Please wait until tomorrow or consider upgrading your account.`
				}),
				{
					status: 429,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}
	} else {
		// For non-authenticated users, fall back to cookie-based tracking
		const hasRemainingFreeRequests = updateRequestCountCookie(cookies);
		if (!hasRemainingFreeRequests) {
			return new Response(
				JSON.stringify({
					error: `You have reached your ${FREE_REQUEST_COUNT} daily searches! To search more, please create a free account.`
				}),
				{
					status: 429,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}
	}

	// User is authenticated, proceed with updating user data...
	// Extract the data you want to update from the request body.
	const { cinemaType, selectedCategories, specificDescriptors } = await request.json();
	const criteriaPrompt = buildSearchCriteriaPrompt({
		cinemaType,
		selectedCategories,
		specificDescriptors
	});
	const callbacks: OpenAIStreamCallbacks = {
		onFinal: async (accumulatedContent, recommendations) => {
			const userUID = user?.uid || 'Anonomous User';
			await createRecommendation(userUID, recommendations, criteriaPrompt);
			console.log(recommendations);
		}
	};
	// Initiating the stream handling
	const response = await OpenAIAPI({ systemPrompt: criteriaPrompt });

	const stream = handleOpenAIStream(response, callbacks);
	return new StreamingTextResponse(stream);
};
