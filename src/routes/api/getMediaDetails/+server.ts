import { json } from '@sveltejs/kit';
import { OMDB_API_KEY } from '$env/static/private';
import redis from '@/lib/redis.js';
import type { RequestHandler } from './$types';

// Function to check if the API key exists and decrement its usage counter
async function RedisApiCheck(apiKey) {
	try {
		// Check if the API key exists
		const keyCount = await redis.get(apiKey);
		if (keyCount && keyCount > 0) {
			// Decrement the API key usage counter
			await redis.decr(apiKey);
			return true;
		} else {
			return false;
		}
	} catch (error) {
		// Handle any exceptions (e.g., Redis connection error)
		console.error(`Error checking API key: ${error}`);
		return false;
	}
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	// Extract the API key from the cookie
	const apiKey = cookies.get('media_api_key');

	// Validate the API key
	if (!(await RedisApiCheck(apiKey))) {
		return json({ error: 'Invalid or exhausted API key' }, { status: 401 });
	}

	// Extract the movie title from the request body
	const { title } = await request.json();

	// Construct the request URL for the OMDB API
	const url = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${title}`;

	// Fetch the movie details from the OMDB API
	const response = await fetch(url);
	const details = await response.json();

	// Return the fetched movie details
	return json(details);
};
