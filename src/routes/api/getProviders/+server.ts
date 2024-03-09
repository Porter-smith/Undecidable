import { json } from '@sveltejs/kit';
import { getShow, createShow } from '@/lib/server/firebase/shows/shows';
import { BACKEND_URL } from '$env/static/private';
import type { RequestHandler } from './$types';

function convertToCommissionLink(provider) {
	let updatedLink = provider.link;
	const url = new URL(updatedLink);
	const supportedProviders = {
		'Amazon Prime Video': 'www.amazon.com'
	};

	if (url.hostname === supportedProviders[provider.name]) {
		if (provider.name === 'Amazon Prime Video') {
			const affiliateParams =
				'linkCode=ll2&tag=unwatchable-20&linkId=f15c089998fa1da6cbb0d173282f70d0&language=en_US&ref_=as_li_ss_tl';
			updatedLink += updatedLink.includes('?') ? `&${affiliateParams}` : `?${affiliateParams}`;
		}
	} else {
		console.warn(`Unsupported provider URL detected: ${updatedLink}`);
	}

	return {
		...provider,
		link: updatedLink
	};
}

export const POST: RequestHandler = async ({ request }) => {
	const { title, year } = await request.json();
	const existingShow = await getShow(title, year);

	if (existingShow) {
		console.log(`Found ${title} (${year}) in Firebase.`);
		return json(existingShow.providers.US);
	} else {
		console.log(`Did not find ${title} (${year}) in Firebase. Adding it now.`);

		try {
			const url = `${BACKEND_URL}/search?title=${encodeURIComponent(title)}&year=${encodeURIComponent(year)}`;
			const response = await fetch(url);
			if (!response.ok) {
				const errorResponse = await response.json(); // Attempt to parse the JSON error response
				// TODO: Create the show in the system with something like error finding movies
				throw new Error(`API request failed: ${errorResponse.error || response.statusText}`);
			}

			const responseData = await response.json();

			if (!responseData || !responseData.providers) {
				throw new Error('Invalid API response: Missing providers data.');
			}

			let providers = responseData.providers;
			providers = providers.map(convertToCommissionLink);

			const showData = {
				title,
				year,
				providers: {
					US: {
						providers: providers,
						updatedLast: new Date().toISOString()
					}
				}
			};

			const saveResult = await createShow(showData);
			if (saveResult.success) {
				console.log(`${title} (${year}) successfully added to Firebase.`);
				return json(showData.providers.US);
			} else {
				throw new Error(`Failed to save ${title} (${year}) details: ${saveResult.error}`);
			}
		} catch (error) {
			console.error(error.message);
			return json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
		}
	}
};
