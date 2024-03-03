import { Redis } from '@upstash/redis';
import { json } from '@sveltejs/kit';
import { UPSTASH_REDIS_URL, UPSTASH_REDIS_TOKEN, OMDB_API_KEY } from '$env/static/private';

// Initialize your Upstash Redis connection
const redis = new Redis({
	url: UPSTASH_REDIS_URL,
	token: UPSTASH_REDIS_TOKEN
});

export async function POST({ request }) {
	// Extract API key from the request, assuming it's provided in a header
	const apiKey = request.headers.get('x-api-key');

	// Check if the API key exists
	const keyCount = await redis.get(apiKey);
	if (!keyCount || keyCount <= 0) {
		return json({ error: 'Invalid or exhausted API key' }, { status: 401 });
	}

	// Decrement the API key usage counter
	await redis.decr(apiKey);

	// Extract the movie title from the request body
	const { title } = await request.json();

	// Construct the request URL for the OMDB API
	const url = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${title}`;

	// Fetch the movie details from the OMDB API
	const response = await fetch(url);
	const details = await response.json();

	// Return the fetched movie details
	return json(details);
}
