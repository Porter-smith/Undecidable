import { goto } from '$app/navigation';
import { auth } from '@/firebase/client';
import fetchServerSignOut from '@/services/api/auth/fetchServerSignOut';

export async function handleSignOut() {
	try {
		// Sign out on Firebase client too
		await auth.signOut();
		await fetchServerSignOut();
		console.log('Signed out successfully');
		window.location.href = '/login';
	} catch (error) {
		console.error('Error signing out:', error);
	}
}
