import { json } from '@sveltejs/kit';
import { getShow, createShow } from '@/lib/server/firebase/shows/shows';

// Assuming BACKEND_URL is defined in your private environment variables
import { BACKEND_URL } from '$env/static/private';
import type { RequestHandler } from './$types';

function convertToCommissionLink(provider) {
	let updatedLink = provider.link;
	const url = new URL(updatedLink);

	// List of supported provider domains for which you want to modify links
	const supportedProviders = {
		'Amazon Prime Video': 'www.amazon.com'
		// Add more supported providers and their corresponding domains as needed
		// 'Provider Name': 'provider-domain.com',
	};

	// Check if the provider is supported by comparing the domain
	if (url.hostname === supportedProviders[provider.name]) {
		if (provider.name === 'Amazon Prime Video') {
			const affiliateParams =
				'linkCode=ll2&tag=unwatchable-20&linkId=f15c089998fa1da6cbb0d173282f70d0&language=en_US&ref_=as_li_ss_tl';
			updatedLink += updatedLink.includes('?') ? `&${affiliateParams}` : `?${affiliateParams}`;
		}

		// Add additional conditions here for other providers you support
	} else {
		console.warn(`Unsupported provider URL detected: ${updatedLink}`);
		// Handle unsupported URLs as necessary, maybe leave them unmodified or log a warning
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

		const url = `${BACKEND_URL}/search?title=${encodeURIComponent(title)}&year=${encodeURIComponent(year)}`;
		const response = await fetch(url);
		// Extract the providers array from the response
		const responseData = await response.json();
		let providers = responseData.providers; // Correctly access the providers array

		// Convert all provider links to include your commission
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
			console.error(`Failed to save ${title} (${year}) details: ${saveResult.error}`);
			return json({ error: 'Failed to save show details' }, { status: 500 });
		}
	}
};
