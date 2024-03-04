import crypto from 'crypto';
import redis from '@/lib/redis';
import { USER_REQUEST_COUNT } from '@/constants';
import type { Cookies } from '@sveltejs/kit';
// Generate a secure API key
function generateApiKey() {
	// Generate a random 32-byte buffer
	const randomBytes = crypto.randomBytes(32);
	// Convert the buffer to a hexadecimal string
	const apiKey = randomBytes.toString('hex');
	return `${apiKey}`;
}
export async function createMediaAccessLimiterCookie(cookies: Cookies): Promise<string> {
	// Always generate a new API key
	const apiKey = generateApiKey(); // Your function to generate an API key
	await redis.set(apiKey, '5', 'EX', 60); // Initialize the usage counter to 5.

	// Define cookie options with a 60 seconds expiration
	const options = {
		maxAge: 60, // Expires in 60 seconds
		secure: process.env.NODE_ENV === 'production', // Secure flag for HTTPS
		httpOnly: true, // HttpOnly to prevent access from client-side scripts
		path: '/' // Accessible across the entire site
	};

	// Set the 'media_api_key' cookie with the new API key and options
	cookies.set('media_api_key', apiKey, options);

	// Return the new API key for potential immediate use
	return apiKey;
}

export async function updateRequestCountRedis(userUid: string): Promise<boolean> {
	// Use the standardized key with a prefix and the user's UID
	const key = `USER_REQUEST_COUNT:${userUid}`;

	// Retrieve the current request count or initialize it if not present
	const requestCountStr = await redis.get(key);
	let requestCount = requestCountStr ? parseInt(requestCountStr, 10) : USER_REQUEST_COUNT;

	// Check if there are no remaining requests
	if (requestCount <= 0) {
		// No additional requests are allowed
		return false;
	}

	// Decrement the request count and update it in Redis
	requestCount--;
	await redis.set(key, requestCount.toString(), 'EX', 60 * 60 * 24); // Update with a 24-hour expiration

	return true;
}
