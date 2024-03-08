import { db } from '@/lib/server/firebase/admin';

async function getRecommendationsForUser(userID: string) {
	try {
		const querySnapshot = await db
			.collection('recommendations')
			.where('userID', '==', userID)
			.get();

		if (querySnapshot.empty) {
			console.log('No matching documents for user:', userID);
			return [];
		}

		let recommendations = [];
		querySnapshot.forEach((doc) => {
			// Extracting data from the document
			let recommendationData = doc.data();

			// Convert Firestore Timestamp to JavaScript Date object
			if (recommendationData.createdAt && recommendationData.createdAt.toDate) {
				recommendationData.createdAt = recommendationData.createdAt.toDate();
			}

			// Adding the recommendation data and the document ID to the array
			recommendations.push({ id: doc.id, ...recommendationData });
		});

		return recommendations;
	} catch (error) {
		console.error('Error fetching movie recommendations for user:', userID, error);
		return { success: false, error: error.message };
	}
}

export default getRecommendationsForUser;
