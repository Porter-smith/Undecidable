import { getAuth } from 'firebase-admin/auth';
import createUserDocument from '@/lib/server/firebase/users/createUserDocument';
import { app } from '@/lib/server/firebase/admin';
// Create User Document
export const POST = async ({ request }) => {
	const auth = getAuth(app);

	const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
	if (!idToken) {
		return new Response(
			JSON.stringify({
				status: 401,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ success: false, message: 'Unauthorized' })
			})
		);
	}

	try {
		const decodedToken = await auth.verifyIdToken(idToken);
		const uid = decodedToken.uid;

		// Set the role of the user
		await auth.setCustomUserClaims(uid, {
			role: 'user'
		});
		// Create User document
		await createUserDocument(uid);

		return new Response(
			JSON.stringify({
				status: 200,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ success: true, message: 'Role set successfully' })
			})
		);
	} catch (error) {
		let errorMessage = 'Internal Server Error';
		let statusCode = 500;

		// Check if error is an instance of Error
		if (error instanceof Error) {
			errorMessage = error.message;
			// If the error object has a 'statusCode' property, use it.
			statusCode = (error as { statusCode?: number }).statusCode || 500;
		}

		// Return a generic error response or customize based on the error type
		return new Response(JSON.stringify({ error: errorMessage }), {
			status: statusCode,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
