import { db } from '@/lib/server/firebase/admin';

// Define your Show type/interface
interface ProviderDetail {
	link: string;
	name: string;
	price: string;
}

interface RegionProviders {
	providers: ProviderDetail[];
	updatedLast: string;
}

interface Show {
	title: string;
	year: string;
	providers: {
		US: RegionProviders;
	};
}

export async function createShow(show: Show) {
	try {
		await db.collection('shows').add({
			...show,
			createdAt: new Date()
		});

		return { success: true };
	} catch (error) {
		console.error('Error creating show in Firebase:', error);
		return { success: false, error: error.message };
	}
}
export async function getShow(title: string, year: string) {
	try {
		const showsRef = db.collection('shows');
		const snapshot = await showsRef.where('title', '==', title).where('year', '==', year).get();
		if (snapshot.empty) {
			console.log('No matching shows found.');
			return null;
		}

		let showData;
		snapshot.forEach((doc) => {
			showData = doc.data();
		});

		return showData;
	} catch (error) {
		console.error('Error getting show from Firebase:', error);
		return null;
	}
}
