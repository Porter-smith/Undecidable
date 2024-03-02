/**
 * Retrieves user data based on the provided session cookie.
 * @param {string} cookie - The session cookie string to verify and extract user data from.
 * @returns {Promise<any | null>} - A promise that resolves with the user data if authenticated, otherwise null.
 */

import { auth } from '@/lib/server/firebase/admin';
import type { User } from '@/types/user';

async function getUserData(cookie: string | null | undefined): Promise<User | null> {
	// If there's no cookie, return null immediately.
	if (cookie === undefined || cookie === null) {
		return null;
	}

	try {
		const decodedCookie = await auth.verifySessionCookie(cookie);
		if (!decodedCookie) return null;

		// Fetch the latest user data after verifying the session
		const userRecord = await auth.getUser(decodedCookie.uid);

		return {
			uid: userRecord.uid,
			email: userRecord.email || '',
			emailVerified: userRecord.emailVerified,
			displayName: userRecord.displayName || '',
			photoURL: userRecord.photoURL || ''
		};
	} catch (error) {
		console.error('Error verifying session cookie:', error);
		// You can handle/log the error as required.
		return null; // Return null in case of any error.
	}
}
export default getUserData;
