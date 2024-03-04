// Assuming this function is part of a server-side Node.js environment
// since firebase-admin is designed for server-side use.

import { db } from '@/lib/server/firebase/admin';
import type { MovieRecommendation } from '../../../ai/OpenAIStream';

async function createRecommendation(userID: string, movies: MovieRecommendation[]) {
	try {
		// Adding a new movie recommendation document to the 'movieRecommendations' collection
		await db.collection('recommendations').add({
			userID: userID,
			createdAt: new Date(),
			movies: movies
		});
		return { success: true };
	} catch (error) {
		console.error('Error creating movie recommendation in Firebase:', error);
		return { success: false, error: error.message };
	}
}

export default createRecommendation;
