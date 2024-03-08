import getRecommendationsForUser from '../../lib/server/firebase/recommendations/getRecommendationForUser';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	let recomendations = [];
	if (user) {
		recomendations = await getRecommendationsForUser(user.uid);
	}
	console.log(user.uid);

	return {
		recomendations
	};
};
