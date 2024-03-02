import { goto } from '$app/navigation';
// import { auth } from '@/firebase/client';
import fetchServerSignOut from '@/services/api/auth/fetchServerSignOut';

export async function handleSignOut() {
	try {
		// await auth.signOut();
		await fetchServerSignOut();
		console.log('Signed out successfully');
		goto('/signin');
	} catch (error) {
		console.error('Error signing out:', error);
	}
}
