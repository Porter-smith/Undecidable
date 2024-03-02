import { auth } from '@/lib/server/firebase/admin';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
	if (!idToken) {
		return new Response(JSON.stringify({ error: 'No token found' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}
	const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

	const decodedIdToken = await auth.verifyIdToken(idToken);

	if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
		const cookie = await auth.createSessionCookie(idToken, { expiresIn });
		const options = { maxAge: expiresIn, httpOnly: true, secure: true, path: '/' };

		cookies.set('__session', cookie, options);

		return new Response(JSON.stringify({ 
			status: 'success', 
			message: 'Sign-in successful. Session Sign-in successful. Session established.' 
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} else {
		return new Response(JSON.stringify({ 
			status: 'error', 
			message: 'Authentication failed: Token is too old. Please sign in again.' 
		}), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

export const DELETE: RequestHandler = async ({ cookies }) => {
	cookies.delete('__session', { path: '/' });
    return new Response(JSON.stringify({ 
        status: 'success', 
        message: 'Sign-out successful. Session terminated.' 
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};
