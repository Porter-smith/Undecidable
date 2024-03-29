// Assuming this function is part of a server-side Node.js environment
// since firebase-admin is designed for server-side use.
import { db } from '@/lib/server/firebase/admin';
import { type ShowRecommendation } from '@/lib/ai/OpenAIStream';

async function createRecommendation(
	userID: string,
	shows: ShowRecommendation[],
	searchQuery: string,
	specificDescriptors: string
) {
	try {
		// Adding a new movie recommendation document to the 'movieRecommendations' collection
		await db.collection('recommendations').add({
			userID: userID, // Storing user ID associated with the recommendation
			createdAt: new Date(), // Using the current date and time as the timestamp
			shows: shows, // Storing the array of movie objects
			searchQuery: searchQuery,
			specificDescriptors: specificDescriptors
			// You can add other relevant fields as necessary
		});

		return { success: true };
	} catch (error) {
		console.error('Error creating movie recommendation in Firebase:', error);
		return { success: false, error: error.message };
	}
}

export default createRecommendation;
