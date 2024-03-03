import type { CinemaSearchCriteria } from '@/types/recommendation';

// Connect to the Python backend
async function fetchGetRecommendation({
	cinemaType,
	selectedCategories,
	specificDescriptors
}: CinemaSearchCriteria) {
	const response = await fetch(`/api/getRecommendation`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json' // Specifies the content type in the header
		},
		// Passes cinemaType, selectedCategories, and specificDescriptors in the request body
		body: JSON.stringify({
			cinemaType,
			selectedCategories,
			specificDescriptors
		})
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch LLM. Server responded with status: ${response.status}`);
	}

	return response.body; // Return the ReadableStream from the response
}

export default fetchGetRecommendation;
