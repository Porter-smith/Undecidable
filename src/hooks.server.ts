import { auth } from '@/lib/server/firebase/admin';
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
	const sessionCookie = event.cookies.get('__session');
	let userID = null;
	let isAdmin = false;
	let user = null;

	try {
		if (sessionCookie) {
			const decodedClaims = await auth.verifySessionCookie(sessionCookie);
			userID = decodedClaims.uid
			user = decodedClaims
			console.log(decodedClaims)
			isAdmin = decodedClaims.role === 'admin';
		}
	} catch (e) {
		// Handle error, e.g., invalid or expired session cookie
	}

	event.locals.user = user;
	// *** Admin Protected Route 
	if (!isAdmin && event.url.pathname === '/admin') {
		throw redirect(302, '/'); // Redirect to home or a custom access denied page
	}
	// *** User Sign in Already ***
	// Redirect logic for signed-in users trying to access the /signin page
	if (userID && event.url.pathname.startsWith('/signin')) {
		console.log("User is already signed in")
		throw redirect(302, '/');
	}

	return resolve(event);
}) satisfies Handle;
