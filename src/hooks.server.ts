import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import getUserData from '@/lib/server/firebase/users/getUserData';

export const handle = (async ({ event, resolve }) => {
	const sessionCookie = event.cookies.get('__session');
	let userID = null;
	let isAdmin = false;
	let user = null;
	const decodedClaims = await getUserData(sessionCookie);
	if (decodedClaims) {
		userID = decodedClaims.uid;
		user = decodedClaims;
		isAdmin = decodedClaims.role === 'admin';
	}
	event.locals.user = user;
	// *** Admin Protected Route
	if (!isAdmin && event.url.pathname === '/admin') {
		throw redirect(302, '/'); // Redirect to home or a custom access denied page
	}
	// *** User Sign in Already ***
	// Redirect logic for signed-in users trying to access the /signin page
	if (userID && event.url.pathname.startsWith('/signin')) {
		throw redirect(302, '/');
	}
	// ** Pages the user needs to be signed in to access **
	if (!userID && event.url.pathname === '/dashboard') {
		throw redirect(302, '/signin');
	}
	if (!userID && event.url.pathname === '/account') {
		throw redirect(302, '/signin');
	}

	return resolve(event);
}) satisfies Handle;
