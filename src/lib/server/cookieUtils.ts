import { FREE_REQUEST_COUNT } from '@/constants';
import type { Cookies } from '@sveltejs/kit';

export function updateRequestCountCookie(cookies: Cookies) {
	// Retrieve the current request count or initialize it to 3 if not present
	const requestCountStr = cookies.get('request_count');
	console.log(requestCountStr);
	let requestCount = requestCountStr ? parseInt(requestCountStr) : FREE_REQUEST_COUNT; // Start with 3 requests for new users

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

	// Update the request count cookie with the new count, converting it back to a string
	cookies.set('request_count', requestCount.toString(), options);

	// Requests are still available
	return true;
}
